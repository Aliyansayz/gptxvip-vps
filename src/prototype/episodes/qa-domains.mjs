/** Agent C domain workflows. Sequential, fictional fixture state; no external services.
 * QA_SLUGS=adsphere,clinicare,chainpulse,hq-admin node src/prototype/episodes/qa-domains.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3001';
const output = process.env.QA_OUTPUT || '/tmp/gptx-prototype-qa';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
const context = await browser.newContext({ timezoneId: 'Asia/Karachi', viewport: { width: 1440, height: 900 }, acceptDownloads: true });
await context.addInitScript(() => { window.print = () => {}; });
const page = await context.newPage();
page.setDefaultTimeout(8000);
const results = [];
let slug, errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const ws = () => page.locator(`[data-prototype="${slug}"]`);
const nav = name => ws().locator('aside nav').getByRole('button', { name: new RegExp(`${name}$`) }).click();
const data = () => page.evaluate(id => JSON.parse(localStorage.getItem(`gptx.prototype.${id}.v1`)).data, slug);
async function reload() { await page.reload({ waitUntil: 'networkidle' }); await ws().waitFor(); }
async function download(trigger, required = [], forbidden = []) {
  const pending = page.waitForEvent('download'); await trigger(); const artifact = await pending;
  const destination = path.join(output, artifact.suggestedFilename()); await artifact.saveAs(destination);
  const text = await fs.readFile(destination, 'utf8');
  for (const term of required) assert(text.includes(term), `CSV missing ${term}`);
  for (const term of forbidden) assert(!text.includes(term), `CSV leaks ${term}`);
  return text;
}
async function printed(trigger, required=[], forbidden=[]) {
  const pending = page.waitForEvent('popup'); await trigger(); const popup = await pending;
  await popup.waitForLoadState('domcontentloaded'); const text = await popup.locator('body').innerText();
  for (const term of required) assert(text.includes(term), `Print missing ${term}`);
  for (const term of forbidden) assert(!text.includes(term), `Print leaks ${term}`);
  await fs.writeFile(path.join(output,`${slug}-print.html`),await popup.content()); await popup.close();
}
const dialog = () => page.getByRole('dialog');
const close = () => page.keyboard.press('Escape');

const scenarios = {
  async 'insight-boards'() {
    await ws().getByLabel('Tenant',{exact:true}).selectOption('grove');
    await ws().getByLabel('Sample access role').selectOption('Member');
    await download(()=>ws().getByRole('button',{name:'Export tenant report'}).click(), ['Grove & Co','sessions'], ['Northstar','Ember','revenue']);
    await ws().getByRole('button',{name:'Remove widget'}).first().click();
    await ws().getByLabel('Available widget').selectOption('sessions'); await ws().getByRole('button',{name:'Add widget',exact:true}).click();
    await ws().getByRole('button',{name:'Edit title and accent'}).click(); await ws().getByLabel('Board title').fill('QA Grove board');
    await ws().getByLabel('Accent color').fill('#ffffff'); await ws().getByRole('button',{name:'Save tenant brand'}).click(); assert(await ws().getByRole('alert').count()); await ws().getByLabel('Accent color').fill('#26715e'); await ws().getByRole('button',{name:'Save tenant brand'}).click();
    await reload(); assert.equal((await data()).boards.find(row=>row.tenantId==='grove').title,'QA Grove board');
    assert.deepEqual((await data()).boards.find(row=>row.tenantId==='north').widgetIds,['sessions','signups','revenue']);
    await nav('Embed'); await context.grantPermissions(['clipboard-read','clipboard-write']); await ws().getByRole('button',{name:'Copy iframe code'}).click(); const copied=await page.evaluate(()=>navigator.clipboard.readText()); assert(copied.includes('tenant=grove')&&copied.includes('role=Member')); const iframe=ws().locator('iframe'); await iframe.waitFor();
    const src=await iframe.getAttribute('src'); assert(src.includes('tenant=grove')&&src.includes('role=Member')&&src.includes('embed=1'));
    await iframe.contentFrame().getByText('QA Grove board',{exact:true}).waitFor(); assert.equal(await iframe.contentFrame().locator('iframe').count(),0);
    await nav('Reports / Access'); await ws().getByRole('button',{name:'Add demo schedule'}).click(); await reload();
    assert((await data()).schedules.some(row=>row.tenantId==='grove'&&row.enabled));
    await ws().getByRole('button',{name:'Pause schedule'}).click(); assert.equal((await data()).schedules[0].enabled,false);
    await ws().getByRole('button',{name:'Delete schedule'}).click(); assert.equal((await data()).schedules.length,0);
    return ['tenant/role CSV isolation','widget add/remove and board ownership','brand/reload','query iframe tenant+role/no recursion','schedule CRUD/reload'];
  },
  async fundview() {
    await nav('Capital Ledger'); await ws().getByRole('button',{name:'Record demo capital event'}).click();
    await dialog().getByLabel('Amount (USD)').fill('999999999'); await dialog().getByRole('button',{name:'Record event'}).click(); assert(await dialog().getByRole('alert').count());
    await dialog().getByLabel('Amount (USD)').fill('100'); await dialog().getByRole('button',{name:'Record event'}).click(); await reload();
    assert((await data()).capital.some(row=>row.amountCents===10000 && row.date.startsWith('2026-10')));
    assert((await data()).audit.length>0); await ws().getByLabel('Fund',{exact:true}).selectOption('cedar');
    assert.equal(await ws().getByText('Westbrook Family Office',{exact:true}).count(),0);
    await download(()=>ws().getByRole('button',{name:'Export report',exact:true}).click(), ['2026 Q4','Cedar'], ['Westbrook','Atlas']);
    await printed(()=>ws().getByRole('button',{name:'Print report',exact:true}).click(),['Cedar','2026 Q4'],['Atlas']);
    await nav('Quarterly Report / Sharing'); await ws().getByRole('button',{name:'Enable preview for 1 hour'}).click();
    const state=await data(); assert(state.shares.some(row=>row.reportId==='cedar-2026 Q4'&&row.enabled));
    await ws().getByRole('button',{name:'Simulate expiry'}).click(); await page.waitForTimeout(1100);
    assert(await ws().getByText('Disabled or expired',{exact:true}).count()); await ws().getByRole('button',{name:'Enable preview for 1 hour'}).click();
    await ws().getByRole('button',{name:'Disable preview'}).click(); assert.equal((await data()).shares[0].enabled,false);
    return ['capital limit rejection/post/audit/reload','fund partitions and quarter CSV','share enable/expiry/disable'];
  },
  async 'pulse-analytics'() {
    await ws().getByLabel('Channel', {exact:true}).selectOption('Paid');
    await ws().getByLabel('Date range').selectOption('Oct 1–4');
    await download(() => ws().getByRole('button',{name:'Export events',exact:true}).click(), ['Paid'], ['Organic','Referral','2026-10-05']);
    await nav('Funnels'); await ws().getByLabel('Conversion endpoint').selectOption('Signup');
    assert.equal(await ws().getByRole('table').getByRole('row').count(), 3);
    await nav('Cohorts'); assert(await ws().getByRole('table').getByText('12', {exact:true}).count());
    await nav('Sessions'); await ws().getByRole('button',{name:'View path'}).first().click();
    const sessionCSV = await download(() => dialog().getByRole('button',{name:'Export this session'}).click(), ['sessionId','Paid']);
    assert(!sessionCSV.includes('Organic')); await close();
    await nav('Reports / Builder'); await ws().getByLabel('Report name').fill('QA saved acquisition');
    await ws().getByLabel('Event volume',{exact:true}).check(); await ws().getByRole('button',{name:'Save report',exact:true}).click();
    await reload(); assert((await data()).reports.some(row=>row.name==='QA saved acquisition' && row.widgets.includes('Event volume')));
    const start=(await data()).events.length; await page.waitForTimeout(3200); assert.equal((await data()).events.length,start);
    await ws().getByRole('button',{name:'Resume sample stream'}).click(); await page.waitForTimeout(3200);
    assert((await data()).events.length>start); await ws().getByRole('button',{name:'Pause sample stream'}).click();
    return ['segment/date CSV exclusion','endpoint funnel','cohort denominator','ordered session CSV','report widgets/reload','stream pause/resume'];
  },
  async 'storefront-pro'() {
    await ws().getByRole('row').filter({hasText:'ORD-1'}).getByRole('button',{name:'Open order'}).click();
    assert(await dialog().getByRole('button',{name:'Ship order'}).isDisabled());
    await dialog().getByRole('button',{name:'Pack order'}).click(); await dialog().getByRole('button',{name:'Ship order'}).click();
    await printed(()=>dialog().getByRole('button',{name:'Print order'}).click(),['ORD-1','shipped','browser demo']); await close(); await reload(); assert.equal((await data()).orders.find(row=>row.id==='ORD-1').status,'shipped');
    await nav('Inventory'); await ws().getByRole('button',{name:'Restock',exact:true}).first().click();
    await dialog().getByLabel('Restock quantity').fill('0'); await dialog().getByRole('button',{name:'Record restock'}).click(); assert(await dialog().count());
    const before=(await data()).products[0].stock; await dialog().getByLabel('Restock quantity').fill('7'); await dialog().getByRole('button',{name:'Record restock'}).click();
    assert.equal((await data()).products[0].stock,before+7); await reload();
    await nav('Reconciliation'); await ws().getByRole('button',{name:'Resolve exception'}).click();
    await dialog().getByLabel('Adjustment explanation').fill('QA settlement bank fee correction'); await dialog().getByRole('button',{name:'Record adjustment'}).click();
    assert.equal((await data()).settlements[1].status,'adjusted'); await close(); await nav('Orders');
    await ws().getByLabel('Warehouse').selectOption('East');
    await download(()=>ws().getByRole('button',{name:'Export orders'}).click(), ['East'], ['West']);
    await ws().getByLabel('Search orders or customers').fill('qa-no-match'); assert(await ws().getByText('No matching records. Adjust your filters.').count());
    return ['transition disabled guard/pack/ship/reload','restock invalid/valid/persistence','settlement adjustment/audit','warehouse CSV','empty search'];
  },
  async ledgerline() {
    await ws().getByRole('button',{name:'New journal entry'}).click();
    await dialog().getByLabel('Description').fill('QA capital posting'); await dialog().getByLabel('Amount (major currency units)').fill('125');
    await dialog().getByLabel('Direction').selectOption('credit'); await dialog().getByLabel('Reference',{exact:true}).fill('QA-001');
    await dialog().getByRole('button',{name:'Post journal entry'}).click(); await reload();
    assert((await data()).entries.some(row=>row.reference==='QA-001'&&row.amountCents===12500));
    await nav('Reconciliation'); await ws().getByLabel('Ledger posting for CLOUD-01').selectOption('entry-2');
    await ws().getByRole('button',{name:'Match selected posting'}).nth(1).click();
    assert.equal((await data()).statements[1].matchedEntryId,'');
    await ws().getByLabel('Ledger posting for REC-001').selectOption('entry-1'); await ws().getByRole('button',{name:'Match selected posting'}).first().click();
    assert.equal((await data()).statements[0].matchedEntryId,'entry-1'); await ws().getByRole('button',{name:'Unmatch posting'}).click();
    assert.equal((await data()).entries[0].reconciled,false); await nav('Audit');
    await download(()=>ws().getByRole('button',{name:'Export audit'}).click(), ['QA-001','Statement matched','Statement unmatched']);
    await ws().getByLabel('Account / currency').selectOption('eur'); await nav('Ledger');
    await download(()=>ws().getByRole('button',{name:'Export postings'}).click(), ['EUR'], ['QA-001']);
    return ['post/reload','signed mismatch rejection','match/unmatch state+audit','account isolation CSV'];
  },
  async 'orbit-crm'() {
    const initial=await data(); const title=initial.deals[0].title;
    await ws().getByLabel(`Stage for ${title}`).selectOption('won'); assert.equal((await data()).deals[0].probability,1);
    await ws().getByRole('button',{name:title,exact:true}).click(); await dialog().getByLabel('New relationship note').fill('QA relationship note');
    await dialog().getByRole('button',{name:'Add note',exact:true}).click(); await dialog().getByLabel('Next action',{exact:true}).fill('Review QA renewal');
    await dialog().getByRole('button',{name:'Save next action'}).click(); await close(); await reload();
    assert((await data()).activities.some(row=>row.note==='QA relationship note')); assert.equal((await data()).deals[0].nextAction,'Review QA renewal');
    await nav('Contacts / Companies'); await ws().getByRole('button',{name:'Review duplicates'}).click();
    await dialog().getByRole('button',{name:'Confirm merge'}).click(); const merged=await data();
    assert.equal(merged.contacts.length,initial.contacts.length-1); assert(merged.deals.every(deal=>merged.contacts.some(c=>c.id===deal.contactId)));
    await reload(); await nav('Pipeline'); await ws().getByRole('button',{name:'New deal',exact:true}).click();
    await dialog().getByRole('button',{name:'Save deal'}).click(); assert(await dialog().count());
    await dialog().getByLabel('Deal title').fill('QA renewal opportunity'); await dialog().getByLabel('Deal value (USD)').fill('2500');
    await dialog().getByRole('button',{name:'Save deal'}).click(); await reload(); assert((await data()).deals.some(row=>row.title==='QA renewal opportunity'&&row.valueCents===250000));
    await ws().getByRole('button',{name:'QA renewal opportunity',exact:true}).click(); await dialog().getByRole('button',{name:'Edit deal',exact:true}).click();
    await dialog().getByLabel('Deal title').fill('QA updated renewal'); await dialog().getByRole('button',{name:'Save deal'}).click(); await reload();
    assert((await data()).deals.some(row=>row.title==='QA updated renewal')); await nav('Forecast'); await ws().getByLabel('Owner',{exact:true}).selectOption('Jamie');
    await download(()=>ws().getByRole('button',{name:'Export deals'}).click(), ['Jamie'], ['Jordan']);
    return ['stage/weighted change','note+next-action/reload','duplicate merge/link repair/reload','owner forecast CSV'];
  },
  async 'saas-metrics-kit'() {
    await nav('Recovery'); const retry=ws().getByRole('button',{name:'Retry sample payment'}).first();
    await retry.click(); assert.equal((await data()).invoices[0].status,'failed'); await retry.click();
    assert.equal((await data()).invoices[0].status,'paid'); assert(await retry.isDisabled()); await reload();
    await nav('Revenue'); await ws().getByRole('button',{name:'Manage plan'}).nth(1).click();
    await dialog().getByLabel('Subscription plan').selectOption('Scale'); await close(); await reload();
    assert.equal((await data()).subscriptions[1].plan,'Scale'); assert.equal((await data()).movements.at(-1).deltaCents,50000);
    await ws().getByLabel('Period',{exact:true}).selectOption('2026-09'); await ws().getByLabel('Plan',{exact:true}).selectOption('Scale');
    await download(()=>ws().getByRole('button',{name:'Export metrics'}).click(), ['2026-09','Scale','Starting MRR','Ending MRR']);
    await ws().getByRole('button',{name:'Metric definitions'}).click(); assert(await dialog().getByText(/starting MRR/i).count()); await close();
    await ws().getByRole('button',{name:'Board presentation'}).click(); assert.equal(await ws().getByRole('button',{name:'Manage plan'}).count(),0);
    await printed(()=>ws().getByRole('button',{name:'Print summary'}).click(),['2026-09','Scale','Starting MRR']);
    return ['print current period+plan','retry decline/success/no-double-action/reload','plan movement/reload','period+plan CSV','metric definitions','presentation operations hidden'];
  },
  async adsphere() {
    const before = await data();
    const campaign = ws().getByRole('row').filter({ hasText: 'Autumn essentials' });
    await campaign.getByRole('button', { name: 'Pause', exact: true }).click();
    assert.equal((await data()).campaigns.find(row => row.id === 'c1').status, 'paused');
    await reload();
    assert.equal((await data()).campaigns.find(row => row.id === 'c1').status, 'paused');
    await ws().getByRole('button', { name: 'Autumn essentials', exact: true }).click();
    await dialog().getByLabel('Campaign budget (USD)').fill('-2');
    await dialog().getByRole('button', { name: 'Save budget' }).click();
    assert(await dialog().getByRole('alert').count(), 'Invalid budget must be rejected');
    await dialog().getByLabel('Campaign budget (USD)').fill('4000');
    await dialog().getByRole('button', { name: 'Save budget' }).click();
    assert.equal((await data()).campaigns.find(row => row.id === 'c1').budgetCents, 400000);
    await nav('Creatives');
    await ws().getByRole('button', { name: 'Review Social square' }).click();
    await dialog().getByRole('button', { name: 'Request changes' }).click();
    assert(await dialog().getByRole('alert').count(), 'Creative change request needs note');
    await dialog().getByLabel('Review note').fill('Increase headline contrast');
    await dialog().getByRole('button', { name: 'Request changes' }).click();
    await reload();
    assert.equal((await data()).creatives.find(row => row.id === 'creative-2').reviewNote, 'Increase headline contrast');
    await nav('Attribution / Digest');
    await ws().getByLabel('Attribution model').selectOption('First touch');
    assert(await ws().getByText('$3,300.00', { exact: true }).count());
    await ws().getByLabel('Attribution model').selectOption('Last touch');
    assert(await ws().getByText('$4,200.00', { exact: true }).count());
    await ws().getByLabel('Attribution model').selectOption('Linear');
    assert(await ws().getByText('$2,150.00', { exact: true }).count());
    await ws().getByLabel('Date range').selectOption('First week');
    await download(() => ws().getByRole('button', { name: 'Export digest' }).click(), ['First week', 'Autumn essentials', '$693.00']);
    await nav('Campaigns');
    await ws().getByLabel('Campaign search').fill('nothing-matches-qa');
    assert(await ws().getByText('No matching records. Adjust your filters.').count());
    assert.equal((await data()).performance.length, before.performance.length, 'Search cannot discard stored performance');
    return ['campaign pause/reload', 'invalid/valid budget + derived export', 'creative validation/reload', 'first/last/linear values', 'date-filtered CSV', 'empty search'];
  },
  async clinicare() {
    assert(!await ws().getByText('Alex Morgan', { exact: true }).count(), 'Initial clinic names must be masked');
    await printed(()=>ws().getByRole('button',{name:'Print schedule'}).click(),['PT-1042','Masked'],['Alex Morgan','1989-03-12']);
    await download(() => ws().getByRole('button', { name: 'Export schedule' }).click(), ['PT-1042', 'Masked'], ['Alex Morgan', '1989-03-12']);
    await ws().getByRole('button', { name: 'Book appointment', exact: true }).click();
    await dialog().getByLabel('Start', { exact: true }).fill('2026-10-05T10:15');
    await dialog().getByLabel('End', { exact: true }).fill('2026-10-05T10:45');
    await dialog().getByRole('button', { name: 'Save appointment' }).click();
    assert((await dialog().getByRole('alert').textContent()).includes('conflict'));
    assert.equal(await dialog().getByLabel('Start', { exact: true }).inputValue(), '2026-10-05T10:15', 'Invalid booking keeps form input');
    await dialog().getByLabel('Start', { exact: true }).fill('2026-10-05T13:00');
    await dialog().getByLabel('End', { exact: true }).fill('2026-10-05T13:05');
    await dialog().getByRole('button', { name: 'Save appointment' }).click();
    await reload();
    assert((await data()).appointments.some(row => row.startAt === '2026-10-05T13:00' && row.endAt === '2026-10-05T13:05'));
    await nav('Appointments');
    const newRow = ws().getByRole('row').filter({ hasText: '13:00–13:05' });
    await newRow.getByRole('button', { name: 'Open appointment' }).click();
    await dialog().getByRole('button', { name: 'Move to checked-in' }).click();
    await newRow.getByRole('button', { name: 'Open appointment' }).click();
    assert.equal(await dialog().getByRole('button', { name: 'Reschedule', exact: true }).count(), 0);
    await dialog().getByRole('button', { name: 'Move to in-room' }).click();
    const state = await data(); const added = state.appointments.find(row => row.startAt === '2026-10-05T13:00');
    const room = state.events.find(row => row.appointmentId === added.id && row.status === 'in-room');
    assert(room.at > added.startAt && room.at < added.endAt, `Karachi browser midpoint must be inside appointment: ${room.at}`);
    await nav('Staff'); await ws().getByRole('button',{name:'Edit availability'}).first().click();
    await dialog().getByLabel('Available from').fill('11:00'); await dialog().getByRole('button',{name:'Save availability'}).click();
    assert(await ws().getByText(/Availability conflict:/).count()); await reload();
    assert.equal((await data()).clinicians[0].availability.start,'11:00');
    await nav('Privacy');
    await ws().getByRole('button', { name: 'Reveal fictional names and DOB' }).click();
    assert(await ws().getByText(/Alex Morgan/).count());
    await ws().getByRole('button', { name: 'Lock now', exact: true }).last().click();
    assert(await ws().getByText('Demo session locked', { exact: true }).count());
    assert.equal(await ws().getByRole('button', { name: 'Book appointment', exact: true }).count(), 0);
    assert(!await ws().getByText(/Alex Morgan/).count());
    await ws().getByRole('button', { name: 'Unlock demo session' }).click();
    assert.equal((await data()).privacy.masked, true);
    return ['default masking and real CSV', 'conflict validation/input retention', 'short booking/reload', 'flow transitions in Karachi timezone', 'reschedule guard', 'reveal/lock/remask/operation block'];
  },
  async chainpulse() {
    const initial = await data();
    await ws().getByLabel('Asset', { exact: true }).selectOption('BTC');
    assert.equal(await ws().getByRole('img').getAttribute('aria-label'), 'BTC sample OHLC candlesticks, 20 periods');
    await ws().getByLabel('Time window').selectOption('8 candles');
    assert.equal(await ws().getByRole('img').getAttribute('aria-label'), 'BTC sample OHLC candlesticks, 8 periods');
    await download(() => ws().getByRole('button', { name: 'Export candles' }).click(), ['BTC', 'open', 'close'], ['ETH']);
    await ws().getByRole('button', { name: 'Resume simulated ticks' }).click();
    await page.waitForTimeout(3700);
    const running = await data(); assert(running.tick > initial.tick);
    await ws().getByRole('button', { name: 'Pause simulated ticks' }).click();
    const paused = await data(); await page.waitForTimeout(3700);
    assert.equal((await data()).tick, paused.tick, 'Paused stream must freeze records');
    const last = paused.candles.BTC.at(-1), prior = paused.candles.BTC.at(-2);
    assert.equal(Date.parse(last.time + 'Z') - Date.parse(prior.time + 'Z'), 1800000);
    await nav('Portfolio');
    await ws().getByRole('button', { name: 'Edit holding' }).first().click();
    await dialog().getByLabel('Quantity').fill('-1');
    await dialog().getByRole('button', { name: 'Save holding' }).click();
    assert(await dialog().getByRole('alert').count());
    await dialog().getByLabel('Quantity').fill('5');
    await dialog().getByRole('button', { name: 'Save holding' }).click();
    await reload(); assert.equal((await data()).holdings.find(row => row.asset === 'ETH').quantity, 5);
    await download(() => ws().getByRole('button', { name: 'Export holdings' }).click(), ['ETH', 'pnl', 'quantity']);
    await nav('Wallets');
    await ws().getByLabel('Research cluster').selectOption('Treasuries');
    assert.equal(await ws().getByRole('button', { name: 'Research wallet 01' }).count(), 0);
    await ws().getByRole('button', { name: 'Research wallet 03' }).click();
    assert(await ws().getByText('2026-10-05 · Sample allocation: 10 ETH', { exact: true }).count());
    await nav('Token Calendar / Gas');
    await ws().getByRole('button', { name: 'Bookmark event', exact: true }).first().click();
    await ws().getByLabel('Network', { exact: true }).selectOption('Arbitrum');
    assert(await ws().getByText('Median 0.15 gwei', { exact: true }).count());
    await reload(); assert((await data()).bookmarks.length > 0);
    return ['asset/window/candle CSV', 'sample stream update/pause + chronological timezone correctness', 'holding validation/reload/export', 'wallet cluster/activity', 'calendar bookmark/reload', 'network gas median'];
  },
  async 'hq-admin'() {
    await nav('Members / Roles');
    await ws().getByRole('row').filter({ hasText: 'jordan@example.test' }).getByRole('button', { name: 'Edit member' }).click();
    await dialog().getByLabel('Role', { exact: true }).selectOption('viewer');
    await dialog().getByRole('button', { name: 'Save member' }).click();
    assert((await dialog().getByRole('alert').textContent()).includes('active admin')); await close();
    await ws().getByRole('button', { name: 'Create demo invitation' }).click();
    await dialog().getByLabel('Email', { exact: true }).fill('jordan@example.test');
    await dialog().getByRole('button', { name: 'Create pending invitation' }).click();
    assert((await dialog().getByRole('alert').textContent()).includes('already'));
    await dialog().getByLabel('Email', { exact: true }).fill('new.qa@example.test');
    await dialog().getByRole('button', { name: 'Create pending invitation' }).click();
    await reload(); assert((await data()).invitations.some(row => row.email === 'new.qa@example.test' && row.status === 'pending'));
    await ws().getByRole('button', { name: 'Revoke invitation' }).click();
    assert.equal((await data()).invitations.find(row => row.email === 'new.qa@example.test').status, 'revoked');
    await ws().getByLabel('Current workspace').selectOption('ws2');
    assert.equal(await ws().getByText('sam@example.test', { exact: true }).count(), 0);
    assert(await ws().getByText('dana@example.test', { exact: true }).count());
    await nav('Notifications');
    await ws().getByRole('button', { name: 'Clear read' }).click();
    assert(await ws().getByText('Your workspace inbox is clear.').count());
    await ws().getByLabel('Current workspace').selectOption('ws1');
    assert(await ws().getByText(/Welcome to Northstar/).count());
    await ws().getByRole('button', { name: 'Mark read', exact: true }).first().click();
    assert.equal((await data()).notifications.filter(row => row.workspaceId === 'ws1' && !row.read).length, 1);
    await nav('Overview');
    await ws().getByRole('button', { name: 'Simulate health error' }).click();
    assert.equal((await data()).service, 'failed');
    await ws().getByRole('button', { name: 'Retry health check' }).click();
    assert.equal((await data()).service, 'ready');
    await nav('Settings / Onboarding'); await ws().getByRole('button',{name:'Edit preferences'}).click();
    await dialog().getByLabel('Display name').fill('QA workspace owner'); await dialog().getByLabel('Appearance preference').selectOption('Dark');
    await dialog().getByRole('button',{name:'Save preferences'}).click(); assert.equal(await ws().getAttribute('data-theme'),'dark');
    await reload(); assert.equal((await data()).preferences.displayName,'QA workspace owner'); assert.equal(await ws().getAttribute('data-theme'),'dark');
    await ws().getByRole('button', { name: 'Demo sign out' }).click();
    assert(await ws().getByText('Welcome back to HQ', { exact: true }).count());
    assert.equal(await ws().getByLabel('Current workspace').count(), 0);
    await ws().getByRole('button', { name: 'Sign in as sample account' }).click();
    assert.equal((await data()).loggedIn, true);
    return ['final-admin guard', 'duplicate invitation validation/pending reload/revoke', 'workspace member+notification partition', 'read/clear empty state', 'error/retry', 'local sign-in/out'];
  },
};

try {
  const requested = process.env.QA_SLUGS?.split(',') || Object.keys(scenarios);
  for (slug of requested) {
    errors = []; const result = { slug, checks: [], errors: [] }; results.push(result);
    try {
      assert(scenarios[slug], `No implemented independent domain scenario for ${slug}`);
      await page.goto(`${base}/agents/prototypes/${slug}`, { waitUntil: 'networkidle' }); await ws().waitFor();
      await page.evaluate(id => { localStorage.removeItem(`gptx.prototype.${id}.v1`); localStorage.removeItem(`gptx.prototype.${id}.theme`); }, slug); await reload();
      result.checks = await scenarios[slug]();
      // Malformed stored fixture recovery and domain-only reset are independent foundation acceptance cases.
      await page.evaluate(id=>{localStorage.setItem('gptx.prototype.qa-unrelated.v1','sentinel');localStorage.setItem(`gptx.prototype.${id}.v1`,JSON.stringify({version:1,data:{invalid:true}}));},slug);
      await reload(); assert(!(await data()).invalid);
      await ws().getByRole('button',{name:'Reset demo',exact:true}).click();
      await dialog().getByRole('button',{name:'Confirm reset'}).click();
      assert.equal(await page.evaluate(()=>localStorage.getItem('gptx.prototype.qa-unrelated.v1')),'sentinel');
      result.checks.push('malformed saved-state recovery','domain-only confirmed reset');
      assert.equal(errors.length, 0, errors.join('\n'));
      result.pass = true;
    } catch (error) { result.pass = false; result.errors.push(error.stack || String(error)); await page.screenshot({path:path.join(output,`${slug}-domain-failure.png`),fullPage:true}); await fs.writeFile(path.join(output,`${slug}-domain-failure.html`),await page.content()); }
    result.errors.push(...errors);
    await fs.writeFile(path.join(output, 'domain-results.json'), JSON.stringify({ base, timezone: 'Asia/Karachi', results }, null, 2));
    console.log(`${slug}: ${result.pass ? 'passed' : 'failed'}`);
    await page.goto('about:blank');
  }
} finally { await browser.close(); }
if (results.some(result => !result.pass)) process.exitCode = 1;
