/** Independent business-invariant assertions against actual authored modules. Lightweight: no full compiler. */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';

const modules = new Map();
function moduleAt(relative) {
  if (modules.has(relative)) return modules.get(relative);
  const code = ts.transpile(fs.readFileSync(`src/prototype/${relative}.ts`, 'utf8'), { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS });
  const exports = {};
  modules.set(relative, exports);
  new Function('exports', 'require', code)(exports, name => name === '../shared' ? moduleAt('shared/helpers') : name.startsWith('.') ? moduleAt(path.posix.join(path.posix.dirname(relative), name)) : (() => { throw new Error(`Unexpected runtime import ${name}`); })());
  return exports;
}
const tests = [];
function test(name, body) {
  try { body(); tests.push({ name, pass: true }); }
  catch (error) { tests.push({ name, pass: false, error: error.message }); }
}
function close(actual, expected, label) { assert(Math.abs(actual - expected) < 1e-8, `${label}: ${actual} != ${expected}`); }

const pulse = moduleAt('pulse-analytics/data'), pulseMath = moduleAt('pulse-analytics/formulas');
test('Pulse seed cohort retention uses original membership and actual returning fixture dates', () => {
  const rows = pulseMath.retention(pulse.seed.cohorts[0], pulse.seed.events);
  assert.deepEqual(rows.map(row => row.denominator), [12, 12, 12, 12, 12]);
  assert.deepEqual(rows.map(row => row.value), [12, 0, 8, 8, 8]);
  const paid = pulseMath.filterEvents(pulse.seed.events, 'Paid', 'All', 'All dates');
  assert.equal(pulseMath.unique(paid), 8);
  assert.deepEqual(pulseMath.retention(pulse.seed.cohorts[0], paid).map(row => row.denominator), [12, 12, 12, 12, 12]);
});
test('Pulse funnel excludes out-of-order conversions and preserves descending eligible unique-user counts', () => {
  const common = { channel: 'Organic', platform: 'Web', sessionId: 'qa-session', userId: 'qa-user' };
  const reversed = ['Purchase', 'Signup', 'Visit'].map((event, index) => ({ ...common, id: String(index), event, timestamp: `2026-10-01T0${index}:00:00` }));
  assert.deepEqual(pulseMath.funnel(reversed, ['Visit', 'Signup', 'Purchase']).map(row => row.value), [1, 0, 0]);
  const counts = pulseMath.funnel(pulse.seed.events, ['Visit', 'Signup', 'Activate', 'Purchase']).map(row => row.value);
  assert.deepEqual(counts, [24, 24, 18, 6]);
});

const store = moduleAt('storefront-pro/data'), storeMath = moduleAt('storefront-pro/formulas'), storeActions = moduleAt('storefront-pro/actions');
test('Storefront fixture totals, transition guards and cancel stock release stay consistent without double release', () => {
  assert.equal(storeMath.orderTotal(store.seed.orders[1]), 9600);
  assert.equal(storeMath.settlementDiff(store.seed.settlements[1]), 300);
  assert.equal(storeMath.lowStock(store.seed.products).length, 2);
  assert.throws(() => storeActions.transition(store.seed, 'ORD-1', 'shipped'), /cannot/i);
  const canceled = storeActions.transition(store.seed, 'ORD-1', 'canceled');
  assert.equal(canceled.products.find(row => row.id === 'p1').stock, 19);
  assert.throws(() => storeActions.transition(canceled, 'ORD-1', 'canceled'), /cannot/i);
  assert.equal(store.seed.products.find(row => row.id === 'p1').stock, 18, 'Mutation must preserve original records');
  const shipped = storeActions.transition(storeActions.transition(store.seed, 'ORD-1', 'packed'), 'ORD-1', 'shipped');
  assert.equal(shipped.orders[0].status, 'shipped');
  assert.equal(shipped.products[0].stock, 18, 'Reserved stock must not be removed twice');
});

const ledger = moduleAt('ledgerline/data'), ledgerMath = moduleAt('ledgerline/formulas'), ledgerActions = moduleAt('ledgerline/actions');
test('Ledgerline USD/EUR balances isolate currencies and signed discrepancy cannot be silently matched', () => {
  assert.equal(ledgerMath.closing(ledger.seed.accounts[0], ledger.seed.entries), 7500000);
  assert.equal(ledgerMath.closing(ledger.seed.accounts[1], ledger.seed.entries), 5220000);
  assert.equal(ledgerMath.matchDifference(ledger.seed.statements[1], ledger.seed.entries[1]), -10000);
  assert.throws(() => ledgerActions.match(ledger.seed, 'line-2', 'entry-2'), /exact signed amount/i);
  assert.throws(() => ledgerActions.match(ledger.seed, 'line-1', 'entry-4'), /same account/i);
  const matched = ledgerActions.match(ledger.seed, 'line-1', 'entry-1');
  assert.equal(matched.entries[0].reconciled, true); assert.equal(matched.statements[0].matchedEntryId, 'entry-1');
  const unlinked = ledgerActions.unmatch(matched, 'line-1');
  assert.equal(unlinked.entries[0].reconciled, false); assert.equal(unlinked.statements[0].matchedEntryId, '');
  assert.deepEqual(unlinked.audit.map(row => row.action), ['Statement matched', 'Statement unmatched']);
});
test('Ledgerline valid posting changes only its account and records actual journal audit', () => {
  const entry = { accountId: 'usd', date: '2026-10-08', description: 'QA capital', direction: 'credit', amountCents: 12500, category: 'Capital', reference: 'QA-001' };
  const posted = ledgerActions.post(ledger.seed, entry);
  assert.equal(ledgerMath.closing(posted.accounts[0], posted.entries), 7512500);
  assert.equal(ledgerMath.closing(posted.accounts[1], posted.entries), 5220000);
  assert.equal(posted.audit.at(-1).recordId, posted.entries.at(-1).id);
  assert.throws(() => ledgerActions.post(ledger.seed, { ...entry, amountCents: -1 }), /positive/i);
});

const orbit = moduleAt('orbit-crm/data'), orbitMath = moduleAt('orbit-crm/formulas'), orbitActions = moduleAt('orbit-crm/actions');
test('Orbit stage probability updates weighted forecast and excludes won/lost open amounts', () => {
  const before = orbitMath.forecast(orbit.seed.deals);
  assert.deepEqual(before, { raw: 13750000, weighted: 5255000, won: 2800000 });
  const moved = orbitActions.stageMove(orbit.seed, 'deal-1', 'won');
  assert.equal(moved.deals[0].probability, 1);
  assert.deepEqual(orbitMath.forecast(moved.deals), { raw: 11950000, weighted: 4985000, won: 4600000 });
});
test('Orbit duplicate merge repairs deals, retains unrelated contacts and rejects unrelated pair', () => {
  const merged = orbitActions.merge(orbit.seed, 'contact-1', 'contact-2');
  assert.equal(merged.contacts.length, 3);
  assert(merged.deals.every(deal => merged.contacts.some(contact => contact.id === deal.contactId && contact.companyId === deal.companyId)));
  assert(merged.contacts.some(contact => contact.id === 'contact-3'));
  assert.equal(merged.deals.find(deal => deal.id === 'deal-4').contactId, 'contact-1');
  assert.throws(() => orbitActions.merge(orbit.seed, 'contact-1', 'contact-3'), /duplicate/i);
});

const saas = moduleAt('saas-metrics-kit/data'), saasMath = moduleAt('saas-metrics-kit/formulas'), saasActions = moduleAt('saas-metrics-kit/actions');
test('SaaS starting MRR plus signed movements reconciles both periods and plan changes', () => {
  const sept = saasMath.metrics(saas.seed.subscriptions, saas.seed.movements, '2026-09');
  assert.equal(sept.start, 39800); assert.equal(sept.end, 129600);
  const oct = saasMath.metrics(saas.seed.subscriptions, saas.seed.movements, '2026-10');
  assert.equal(oct.start, 129600); assert.equal(oct.end, 149600);
  assert.equal(oct.start + oct.moves.reduce((total, movement) => total + movement.deltaCents, 0), oct.end);
  const changed = saasActions.changePlan(saas.seed, 'sub-2', 'Scale');
  assert.equal(changed.movements.at(-1).deltaCents, 50000);
  assert.equal(saasMath.metrics(changed.subscriptions, changed.movements, '2026-10').end, 199600);
});
test('SaaS deterministic invoice retry fails once, recovers once, and cannot double count MRR', () => {
  const failed = saasActions.retry(saas.seed, 'invoice-1');
  assert.equal(failed.invoices[0].status, 'failed'); assert.equal(failed.invoices[0].attemptCount, 1);
  const recovered = saasActions.retry(failed, 'invoice-1');
  assert.equal(recovered.invoices[0].status, 'paid'); assert.equal(recovered.subscriptions[1].status, 'active');
  assert.equal(recovered.movements.length, saas.seed.movements.length, 'Contracted MRR does not grow again from cash recovery');
  assert.equal(saasActions.retry(recovered, 'invoice-1'), recovered);
});

const ads = moduleAt('adsphere/data'), adMath = moduleAt('adsphere/formulas');
test('AdSphere attribution conserves fixture conversion value and changes channel allocation', () => {
  const expected = {
    'First touch': { Search: 160000, Social: 330000, Display: 180000 },
    'Last touch': { Search: 420000, Social: 160000, Display: 90000 },
    Linear: { Search: 250000, Social: 205000, Display: 215000 },
  };
  for (const [mode, values] of Object.entries(expected)) {
    const result = adMath.allocations(ads.seed.conversions, mode);
    for (const [channel, value] of Object.entries(values)) close(result[channel], value, `${mode} ${channel}`);
    close(Object.values(result).reduce((total, value) => total + value, 0), 670000, `${mode} total`);
  }
});
test('AdSphere selected range drives spend and inclusive elapsed-period pacing', () => {
  const campaign = ads.seed.campaigns[0];
  const rows = ads.seed.performance.filter(row => row.campaignId === campaign.id);
  const full = adMath.campaignTotals(campaign, rows);
  const first = adMath.campaignTotals(campaign, rows.filter(row => adMath.inRange(row.date, 'First week')));
  close(full.spend, 102600, 'full spend'); close(first.spend, 69300, 'first week spend');
  close(full.pacing, 102600 / 320000, 'budget pacing'); close(full.elapsed, 10 / 31, 'full elapsed');
  close(first.elapsed, 7 / 31, 'first week elapsed');
});

const clinic = moduleAt('clinicare/data'), clinicMath = moduleAt('clinicare/formulas');
test('CliniCare booking validates room and clinician conflicts, boundaries, availability and reversed interval', () => {
  const proposal = { ...clinic.seed.appointments[2], id: 'qa-new', startAt: '2026-10-05T13:00', endAt: '2026-10-05T13:30' };
  assert.equal(clinicMath.validateAppointment(proposal, clinic.seed.appointments, clinic.seed.clinicians), '');
  assert.match(clinicMath.validateAppointment({ ...proposal, startAt: '2026-10-05T10:15', endAt: '2026-10-05T10:45' }, clinic.seed.appointments, clinic.seed.clinicians), /conflict/i);
  assert.match(clinicMath.validateAppointment({ ...proposal, startAt: '2026-10-05T17:00', endAt: '2026-10-05T17:30' }, clinic.seed.appointments, clinic.seed.clinicians), /availability/i);
  assert.match(clinicMath.validateAppointment({ ...proposal, endAt: proposal.startAt }, clinic.seed.appointments, clinic.seed.clinicians), /after/i);
  assert.equal(clinicMath.overlaps({ ...proposal, startAt: '2026-10-05T10:30', endAt: '2026-10-05T11:00' }, clinic.seed.appointments[2]), false);
});
test('CliniCare seed recorded wait is ten minutes and no flow gives unavailable denominator', () => {
  close(clinicMath.averageWait(clinic.seed.appointments, clinic.seed.events), 10, 'seed average wait');
  assert.equal(clinicMath.averageWait([clinic.seed.appointments[2]], clinic.seed.events), null);
});

const chain = moduleAt('chainpulse/data'), chainMath = moduleAt('chainpulse/formulas');
test('ChainPulse seed and repeated ticks preserve OHLC inequalities and chronological 30-minute spacing in every timezone', () => {
  for (const asset of ['ETH', 'BTC']) {
    let candles = chain.seed.candles[asset];
    for (let n = 1; n <= 6; n++) {
      const prior = candles.at(-1);
      candles = chainMath.tick(candles, n);
      const next = candles.at(-1);
      assert.equal(Date.parse(next.time + 'Z') - Date.parse(prior.time + 'Z'), 1800000, `${asset} tick time ordering`);
      assert(next.low <= Math.min(next.open, next.close) && next.high >= Math.max(next.open, next.close));
      assert.equal(next.open, prior.close);
    }
    for (const candle of candles) assert(candle.low <= Math.min(candle.open, candle.close) && candle.high >= Math.max(candle.open, candle.close));
  }
});
test('ChainPulse fixture portfolio cost/P&L and gas median use correct numeric units', () => {
  const positions = chainMath.valuation(chain.seed.holdings, chain.seed.candles);
  close(positions.reduce((total, row) => total + row.cost, 0), 19680, 'USD cost basis');
  for (const row of positions) close(row.pnl, row.value - row.cost, `${row.asset} P/L`);
  close(chainMath.median([1, 3, 9, 11]), 6, 'even median');
  close(chainMath.median([9, 1, 3]), 3, 'odd median');
});

const hq = moduleAt('hq-admin/data'), hqMath = moduleAt('hq-admin/formulas');
test('HQ Admin last-active-admin guard is scoped per workspace and permits another existing admin', () => {
  const current = hq.seed.members[0];
  assert.match(hqMath.memberError(hq.seed.members, current, { ...current, role: 'viewer' }), /active admin/i);
  assert.match(hqMath.memberError(hq.seed.members, current, { ...current, status: 'suspended' }), /active admin/i);
  const withSecond = [...hq.seed.members, { ...current, id: 'qa-admin', email: 'other@example.test' }];
  assert.equal(hqMath.memberError(withSecond, current, { ...current, role: 'editor' }), '');
  assert.equal(hqMath.memberError(hq.seed.members, hq.seed.members[1], { ...hq.seed.members[1], status: 'suspended' }), '');
});
test('HQ Admin invitation validation checks member/pending duplicates only in current workspace', () => {
  assert.match(hqMath.invitationError(hq.seed, 'not-email', 'ws1'), /valid email/i);
  assert.match(hqMath.invitationError(hq.seed, 'JORDAN@example.test', 'ws1'), /already/i);
  assert.equal(hqMath.invitationError(hq.seed, 'sam@example.test', 'ws2'), '');
  const state = { ...hq.seed, invitations: [{ id: 'qa-invite', workspaceId: 'ws1', email: 'new@example.test', role: 'viewer', status: 'pending' }] };
  assert.match(hqMath.invitationError(state, 'new@example.test', 'ws1'), /pending/i);
  assert.equal(hqMath.invitationError(state, 'new@example.test', 'ws2'), '');
});
test('HQ Admin onboarding distinguishes partial/new/completed workspace setup from actual records', () => {
  assert.deepEqual(hqMath.onboarding(hq.seed).map(row => row.done), [true, true, true, false]);
  const state = { ...hq.seed, preferences: { ...hq.seed.preferences, workspaceId: 'ws3', theme: 'Dark' } };
  assert.deepEqual(hqMath.onboarding(state).map(row => row.done), [true, true, false, true]);
});

const insight = moduleAt('insight-boards/data'), insightMath = moduleAt('insight-boards/formulas');
test('Insight tenant and role boundaries exclude other tenants and restricted revenue', () => {
  const north = insightMath.scopedUsage(insight.seed.usage, 'north', 'Member');
  assert.equal(north.length, 10);
  assert(north.every(row => row.tenantId === 'north' && row.metric !== 'revenue'));
  assert.equal(insightMath.metricTotal(north, 'sessions'), 3250);
  assert.equal(insightMath.metricTotal(insightMath.scopedUsage(insight.seed.usage, 'grove', 'Admin'), 'revenue'), 12250);
  const url = new URL(insightMath.embedUrl('https://example.test', 'grove', 'Member'));
  assert.equal(url.searchParams.get('tenant'), 'grove'); assert.equal(url.searchParams.get('role'), 'Member'); assert.equal(url.searchParams.get('embed'), '1');
});
const fund = moduleAt('fundview/data'), fundMath = moduleAt('fundview/formulas');
test('Episodes 1–5 persisted schemas reject broken record relationships', () => {
  for (const domain of [pulse, store, ledger, orbit, saas]) assert(domain.validate(domain.seed));
  const invalid = [
    [pulse, state => { state.events[0].sessionId = 'missing-session'; }],
    [store, state => { state.orders[0].customerId = 'missing-customer'; }],
    [ledger, state => { state.entries[0].accountId = 'missing-account'; }],
    [orbit, state => { state.deals[0].contactId = 'missing-contact'; }],
    [saas, state => { state.invoices[0].subscriptionId = 'missing-subscription'; }],
  ];
  for (const [domain, corrupt] of invalid) { const state=structuredClone(domain.seed); corrupt(state); assert.equal(domain.validate(state),false); }
});
test('Fundview all fixture NAV bridges reconcile fund and quarter without cross-fund capital', () => {
  for (const point of fund.seed.nav) {
    const summary = fundMath.bridge(fund.seed.funds.find(row => row.id === point.fundId), point.period, fund.seed.nav, fund.seed.capital);
    assert.equal(summary.closing, point.navCents, `${point.fundId} ${point.period}`);
    assert.equal(summary.opening + summary.calls - summary.distributions + summary.gain, summary.closing);
  }
});
test('Fundview commitment limits, distribution date boundary and local share expiry are enforced', () => {
  const investor = fund.seed.investors[0], totals = fundMath.commitment(investor, fund.seed.capital);
  assert.equal(totals.remaining, investor.commitmentCents - totals.contributed);
  assert.match(fundMath.capitalError(investor, fund.seed.capital, 'call', totals.remaining + 1, '2026-10-06'), /commitment/);
  assert.match(fundMath.capitalError(investor, fund.seed.capital, 'distribution', 1, '2026-01-01'), /available/);
  assert.match(fundMath.capitalError(investor, fund.seed.capital, 'call', -1, '2026-10-06'), /positive/);
  const now = Date.parse('2026-10-05T12:00:00Z');
  assert.equal(fundMath.shareActive({ enabled: true, expiresAt: '2026-10-05T12:00:01Z' }, now), true);
  assert.equal(fundMath.shareActive({ enabled: true, expiresAt: '2026-10-05T12:00:00Z' }, now), false);
  assert.equal(fundMath.shareActive({ enabled: false, expiresAt: '2026-10-06T12:00:00Z' }, now), false);
});

console.log(JSON.stringify({ timezone: process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone, tests }, null, 2));
if (tests.some(test => !test.pass)) process.exitCode = 1;
