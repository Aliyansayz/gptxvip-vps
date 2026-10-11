/** Verify every showcase product card exposes and opens its named app action. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3001';
const source = fs.readFileSync('src/devLushArea/agentMarketplace/data/templates.ts', 'utf8');
const code = ts.transpile(
  source.replace(/^import .*$/gm, '').replace(/^export /gm, ''),
  { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
);
const templates = new Function(`${code}; return templates;`)();
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(8000);
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
const results = [];

try {
  await page.goto(`${base}/agents/templates`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('article').count(), templates.length);

  for (const template of templates) {
    const card = page.locator('article').filter({
      has: page.getByRole('heading', { name: template.name, exact: true }),
    });
    const button = card.getByRole('link', {
      name: `Open Prototype: ${template.name}`,
      exact: true,
    });
    assert.equal(await button.count(), 1, `${template.name}: named launch action`);
    await button.scrollIntoViewIfNeeded();
    assert(await button.isVisible(), `${template.name}: launch action is visible`);
    if (results.length === 0) {
      fs.mkdirSync('src/prototype/episodes/evidence', { recursive: true });
      await card.screenshot({
        path: 'src/prototype/episodes/evidence/card-open-prototype.png',
      });
    }
    assert.match(
      await button.getAttribute('href'),
      new RegExp(`/agents/prototypes/${template.prototype}$`),
    );
    await button.click();

    const app = template.prototype === 'logistics'
      ? page.locator('.logistics-prototype')
      : template.prototype === 'project-management'
        ? page.locator('.project-management-prototype')
        : page.locator(`[data-prototype="${template.prototype}"]`);
    await app.waitFor();
    assert(page.url().endsWith(`/agents/prototypes/${template.prototype}`));
    assert.equal(errors.length, 0, errors.join('\n'));
    results.push({ name: template.name, id: template.prototype, label: 'Open Prototype', visible: true, route: page.url(), opened: true });
    await page.goto(`${base}/agents/templates`, { waitUntil: 'networkidle' });
  }
} finally {
  await browser.close();
  fs.mkdirSync('src/prototype/episodes/evidence', { recursive: true });
  fs.writeFileSync(
    'src/prototype/episodes/evidence/card-launch-results.json',
    JSON.stringify({ base, count: results.length, results }, null, 2) + '\n',
  );
}

console.log(`${results.length}/${templates.length} named card launch actions opened the matching app.`);
