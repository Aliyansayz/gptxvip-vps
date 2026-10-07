/** Independent sequential runtime audit. Domain assertions are added as implementations arrive.
 * npm run dev -- --port 3001
 * QA_BASE_URL=http://127.0.0.1:3001 node src/prototype/episodes/qa-browser.mjs
 * Smoke coverage is explicitly insufficient for the full domain acceptance matrix.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3001';
const output = process.env.QA_OUTPUT || '/tmp/gptx-prototype-qa';
await fs.mkdir(output, { recursive: true });
const catalogSource = await fs.readFile('src/devLushArea/agentMarketplace/data/templates.ts', 'utf8');
const catalogCode = ts.transpile(catalogSource.replace(/^import .*$/mg, '').replace(/^export /mg, ''), { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None });
const templates = new Function(`${catalogCode}; return templates;`)();
const selected = process.env.QA_SLUGS?.split(',');
const cases = templates.filter(template => !selected || selected.includes(template.slug));
const results = [];
const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
let currentErrors = [];
page.on('pageerror', error => currentErrors.push(`page: ${error.message}`));
page.on('console', message => { if (message.type() === 'error') currentErrors.push(`console: ${message.text()}`); });
page.on('response', response => { if (response.status() >= 400) currentErrors.push(`HTTP ${response.status()}: ${response.url()}`); });

export async function assertDownload(trigger, expectedStrings = []) {
  const downloadPromise = page.waitForEvent('download');
  await trigger();
  const download = await downloadPromise;
  const target = path.join(output, download.suggestedFilename());
  await download.saveAs(target);
  const text = await fs.readFile(target, 'utf8');
  assert(text.includes('demo') || text.includes('sample'), 'Export must identify sample data');
  for (const expected of expectedStrings) assert(text.includes(expected), `Export missing ${expected}`);
  return { filename: download.suggestedFilename(), text };
}

export async function assertDialogFocus(opener) {
  await opener.click();
  const dialog = page.getByRole('dialog');
  await dialog.waitFor();
  assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'Dialog must receive focus');
  for (let count = 0; count < 18; count++) {
    await page.keyboard.press('Tab');
    assert(await dialog.evaluate(el => el.contains(document.activeElement)), 'Tab focus escaped dialog');
  }
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert(await opener.evaluate(el => el === document.activeElement), 'Dialog must restore opener focus');
}

async function noDocumentOverflow(label) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(dimensions.document <= dimensions.width + 1 && dimensions.body <= dimensions.width + 1, `${label} page overflow ${JSON.stringify(dimensions)}`);
}

try {
  for (const template of cases) {
    currentErrors = [];
    const row = { slug: template.slug, id: template.prototype, checks: [], errors: [], completeDomainAcceptance: false };
    results.push(row);
    try {
      assert(template.prototype, `${template.slug} has no prototype registration`);
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${base}/agents/prototypes/${template.prototype}`, { waitUntil: 'networkidle' });
      await page.locator('[data-prototype],.logistics-prototype,.project-management-prototype').waitFor();
      assert(!await page.getByText('Unable to load this prototype.', { exact: true }).count(), 'Runtime error boundary');
      await noDocumentOverflow('desktop');
      row.checks.push('direct route and desktop layout');
      const workspace = page.locator(`[data-prototype="${template.slug}"]`);
      if (await workspace.count()) {
        assert.equal(await workspace.getAttribute('data-theme'), 'light');
        const navNames = await workspace.locator('aside nav button').allTextContents();
        assert(navNames.length >= 4, 'Distinct domain workspace must have its specified view modules');
        for (let index = 0; index < navNames.length; index++) {
          await workspace.locator('aside nav button').nth(index).click();
          await workspace.locator('h1').waitFor();
          assert.equal(await workspace.locator('aside nav [aria-current="page"]').count(), 1);
          assert(!await workspace.getByText(/under construction|coming soon/i).count(), 'Unimplemented domain navigation');
          await noDocumentOverflow(`view ${navNames[index]}`);
        }
        await workspace.locator('aside nav button').first().click();
        row.checks.push(`all ${navNames.length} navigation views`);
        await page.screenshot({ path: path.join(output, `${template.slug}-desktop-light.png`), fullPage: true });
        await workspace.getByRole('button', { name: 'Dark theme', exact: true }).click();
        assert.equal(await workspace.getAttribute('data-theme'), 'dark');
        await page.screenshot({ path: path.join(output, `${template.slug}-desktop-dark.png`), fullPage: true });
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await workspace.getAttribute('data-theme'), 'dark', 'Theme preference must persist');
        await workspace.getByRole('button', { name: 'Light theme', exact: true }).click();
        row.checks.push('local theme switch and reload persistence');
        await assertDialogFocus(workspace.getByRole('button', { name: 'Reset demo', exact: true }));
        row.checks.push('reset dialog focus containment, Escape and focus return');
        for (const width of [768, 390]) {
          await page.setViewportSize({ width, height: 844 });
          await noDocumentOverflow(`${width}px`);
          if (width === 390) {
            const menu = workspace.getByRole('button', { name: 'Open navigation', exact: true });
            await menu.click();
            assert.equal(await menu.getAttribute('aria-expanded'), 'true');
            await workspace.locator('aside nav button').last().click();
            assert.equal(await menu.getAttribute('aria-expanded'), 'false');
            await menu.click();
            await page.keyboard.press('Escape');
            assert.equal(await menu.getAttribute('aria-expanded'), 'false');
            await page.screenshot({ path: path.join(output, `${template.slug}-mobile-light.png`), fullPage: true });
          }
        }
        row.checks.push('768px/390px layout and mobile navigation');
      } else {
        await page.screenshot({ path: path.join(output, `${template.slug}-desktop-light.png`), fullPage: true });
        row.checks.push('existing authored reference: domain workflow audit pending');
      }
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${base}/agents/templates/${template.slug}`, { waitUntil: 'networkidle' });
      const iframe = page.getByTitle(/interactive prototype/);
      await iframe.waitFor();
      assert.equal(new URL(await iframe.getAttribute('src'), base).pathname, `/agents/prototypes/${template.prototype}`);
      await page.frameLocator('iframe[title$="interactive prototype"]').locator('[data-prototype],.logistics-prototype,.project-management-prototype').waitFor();
      row.checks.push('live showcase iframe');
      assert.equal(currentErrors.length, 0, currentErrors.join('\n'));
      row.verdict = 'smoke passed; domain acceptance pending';
    } catch (error) {
      row.verdict = 'failed';
      row.errors.push(error.stack || String(error));
    }
    row.errors.push(...currentErrors);
    await fs.writeFile(path.join(output, 'smoke-results.json'), JSON.stringify({ base, cases: results }, null, 2));
    console.log(`${row.slug}: ${row.verdict}`);
    // Keep domains isolated and prevent theme/mutations leaking into subsequent cases.
    await page.goto('about:blank');
    await context.clearCookies();
  }
} finally {
  await browser.close();
}
if (results.some(row => row.verdict === 'failed')) process.exitCode = 1;
