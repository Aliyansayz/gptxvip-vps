/** Capture actual running apps. npm run qa:prototype-capture -- [base-url] [ids...] */
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const source = await fs.readFile('src/prototype/registry.ts', 'utf8');
const ast = ts.createSourceFile('registry.ts', source, ts.ScriptTarget.Latest, true);
const entries = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'prototypes' && ts.isObjectLiteralExpression(node.initializer)) {
    for (const property of node.initializer.properties) {
      const id = property.name.getText(ast).replace(/^['"]|['"]$/g, '');
      const screenshot = property.getText(ast).match(/screenshot:\s*['"]([^'"]+)/)?.[1];
      if (!screenshot) throw new Error(`No screenshot path registered for ${id}`);
      entries.push({ id, screenshot });
    }
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const [baseUrl = 'http://localhost:3001', ...only] = process.argv.slice(2);
const selected = only.length ? entries.filter(entry => only.includes(entry.id)) : entries;
if (!selected.length || only.some(id => !entries.some(entry => entry.id === id))) throw new Error('Unknown prototype capture ID');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const { id, screenshot } of selected) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${baseUrl.replace(/\/$/, '')}/agents/prototypes/${id}`);
    const selector = id === 'logistics' ? '.logistics-prototype .metric-grid' : id === 'project-management' ? '.project-management-prototype' : `[data-prototype="${id}"]`;
    await page.locator(selector).waitFor({ timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    if (errors.length) throw new Error(`${id}: ${errors.join('; ')}`);
    const output = path.join(process.cwd(), 'public', screenshot);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await page.screenshot({ path: output, animations: 'disabled' });
    await context.close();
    console.log(`${id}: ${screenshot}`);
  }
} finally { await browser.close(); }
