/** Agent B regression checks for Episodes 6–11 records, state recovery and mutation invariants. */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import assert from "node:assert/strict";
const modules = new Map();
function moduleAt(relative) {
  if (modules.has(relative)) return modules.get(relative);
  const code = ts.transpile(
    fs.readFileSync(`src/prototype/${relative}.ts`, "utf8"),
    { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  );
  const exports = {};
  modules.set(relative, exports);
  new Function("exports", "require", code)(exports, (name) =>
    moduleAt(path.posix.join(path.posix.dirname(relative), name)),
  );
  return exports;
}
let count = 0;
function test(name, body) {
  body();
  count++;
  console.log(`PASS ${name}`);
}
function near(actual, expected) {
  assert(Math.abs(actual - expected) < 1e-8);
}
const slugs = [
  "adsphere",
  "clinicare",
  "chainpulse",
  "hq-admin",
  "insight-boards",
  "fundview",
];
for (const slug of slugs) {
  const { seed, validate } = moduleAt(`${slug}/data`);
  test(`${slug}: seeded record relationships and contexts accepted`, () =>
    assert(validate(seed)));
  test(`${slug}: invalid navigation context rejected`, () =>
    assert.equal(validate({ ...seed, view: "unknown" }), false));
}
const ad = moduleAt("adsphere/data"),
  am = moduleAt("adsphere/formulas"),
  aa = moduleAt("adsphere/actions");
test("AdSphere: channel/date performance spend and pacing use same records", () => {
  const c = ad.seed.campaigns[0];
  const rows = ad.seed.performance.filter(
    (p) => p.campaignId === c.id && am.inRange(p.date, "First week"),
  );
  const totals = am.campaignTotals(c, rows);
  assert.equal(totals.spend, 69300);
  near(totals.pacing, 69300 / 320000);
});
test("AdSphere: all attribution models conserve selected conversion value", () => {
  for (const mode of ["First touch", "Last touch", "Linear"])
    near(
      Object.values(am.allocations(ad.seed.conversions, mode)).reduce(
        (a, b) => a + b,
        0,
      ),
      670000,
    );
});
test("AdSphere: paused state and changed budget are valid persisted records", () => {
  const state = aa.updateCampaign(ad.seed, "c1", {
    status: "paused",
    budgetCents: 500000,
  });
  assert(ad.validate(state));
  assert.equal(state.campaigns[0].budgetCents, 500000);
  assert.equal(ad.seed.campaigns[0].status, "active");
});
test("AdSphere: broken creative campaign reference is rejected", () => {
  const state = structuredClone(ad.seed);
  state.creatives[0].campaignId = "unknown";
  assert.equal(ad.validate(state), false);
});
const clinic = moduleAt("clinicare/data"),
  cm = moduleAt("clinicare/formulas"),
  ca = moduleAt("clinicare/actions");
test("CliniCare: valid short booking produces chronological flow and wait time", () => {
  let state = structuredClone(clinic.seed);
  state.appointments.push({
    ...state.appointments[2],
    id: "appointment-9",
    startAt: "2026-10-05T13:00",
    endAt: "2026-10-05T13:02",
  });
  assert.equal(
    cm.validateAppointment(
      state.appointments.at(-1),
      state.appointments,
      state.clinicians,
    ),
    "",
  );
  for (let i = 0; i < 3; i++)
    state = ca.moveAppointment(state, "appointment-9");
  assert.equal(state.appointments.at(-1).status, "completed");
  assert.deepEqual(
    state.events.slice(-3).map((e) => e.at),
    ["2026-10-05T13:00", "2026-10-05T13:01", "2026-10-05T13:02"],
  );
  near(cm.averageWait([state.appointments.at(-1)], state.events), 1);
  assert(clinic.validate(state));
});
test("CliniCare: overlap blocked but adjacent booking allowed", () => {
  const appointment = {
    ...clinic.seed.appointments[2],
    id: "new",
    startAt: "2026-10-05T10:15",
    endAt: "2026-10-05T10:45",
  };
  assert.match(
    cm.validateAppointment(
      appointment,
      clinic.seed.appointments,
      clinic.seed.clinicians,
    ),
    /conflicts/,
  );
  assert.equal(
    cm.validateAppointment(
      {
        ...appointment,
        startAt: "2026-10-05T10:30",
        endAt: "2026-10-05T11:00",
      },
      clinic.seed.appointments,
      clinic.seed.clinicians,
    ),
    "",
  );
});
test("CliniCare: completed visits and locked state cannot transition", () => {
  assert.equal(ca.moveAppointment(clinic.seed, "appointment-1"), clinic.seed);
  const locked = { ...clinic.seed, locked: true };
  assert.equal(ca.moveAppointment(locked, "appointment-3"), locked);
});
test("CliniCare: persisted unknown patient, empty staff and invalid status rejected", () => {
  for (const mutate of [
    (s) => (s.appointments[0].patientId = "unknown"),
    (s) => (s.clinicians = []),
    (s) => (s.appointments[0].status = "unknown"),
  ]) {
    const state = structuredClone(clinic.seed);
    mutate(state);
    assert.equal(clinic.validate(state), false);
  }
});
const chain = moduleAt("chainpulse/data"),
  chm = moduleAt("chainpulse/formulas"),
  cha = moduleAt("chainpulse/actions");
test("ChainPulse: tick time increases and OHLC bounds remain valid", () => {
  const rows = chm.tick(chain.seed.candles.ETH, 1);
  assert.equal(rows.at(-1).time, "2026-10-05T14:00");
  assert(
    chain.validate({
      ...chain.seed,
      candles: { ...chain.seed.candles, ETH: rows },
    }),
  );
});
test("ChainPulse: portfolio P/L is quantity multiplied by price minus average cost", () => {
  for (const p of chm.valuation(chain.seed.holdings, chain.seed.candles)) {
    near(p.pnl, p.value - p.cost);
    near(p.value, p.quantity * p.price);
  }
});
test("ChainPulse: zero holdings valid; negative mutation and broken asset rejected", () => {
  const state = cha.saveHolding(chain.seed, {
    asset: "ETH",
    quantity: 0,
    averageCost: 2200,
  });
  assert(chain.validate(state));
  assert.equal(state.holdings.find((h) => h.asset === "ETH").quantity, 0);
  assert.equal(
    cha.saveHolding(chain.seed, {
      asset: "ETH",
      quantity: -1,
      averageCost: 10,
    }),
    chain.seed,
  );
  assert.equal(chain.validate({ ...chain.seed, asset: "unknown" }), false);
});
const hq = moduleAt("hq-admin/data"),
  hm = moduleAt("hq-admin/formulas"),
  ha = moduleAt("hq-admin/actions");
test("HQ: workspace final active admin guard and alternate-admin demotion", () => {
  const member = hq.seed.members[0];
  assert.match(
    hm.memberError(hq.seed.members, member, { ...member, role: "viewer" }),
    /active admin/,
  );
  assert.equal(
    hm.memberError(
      [...hq.seed.members, { ...member, id: "alternate" }],
      member,
      { ...member, role: "viewer" },
    ),
    "",
  );
  assert.match(
    hm.memberError(hq.seed.members, member, { ...member, status: "suspended" }),
    /active admin/,
  );
});
test("HQ: duplicate invitation considers only current workspace pending records", () => {
  assert.match(
    hm.invitationError(hq.seed, "jordan@example.test", "ws1"),
    /already/,
  );
  assert.equal(hm.invitationError(hq.seed, "sam@example.test", "ws2"), "");
});
test("HQ: saved empty-array audit records validated and partitioned", () => {
  const state = ha.appendAudit(hq.seed, "ws2", "Member updated", "member-5");
  assert(hq.validate(state));
  assert.equal(state.audit.at(-1).workspaceId, "ws2");
  state.audit.push({ id: "bad" });
  assert.equal(hq.validate(state), false);
});
const insight = moduleAt("insight-boards/data"),
  im = moduleAt("insight-boards/formulas"),
  ia = moduleAt("insight-boards/actions");
test("Insight: member and tenant scoping excludes revenue and all other tenants", () => {
  const rows = im.scopedUsage(insight.seed.usage, "grove", "Member");
  assert.equal(rows.length, 10);
  assert(rows.every((r) => r.tenantId === "grove" && r.metric !== "revenue"));
  assert.equal(im.metricTotal(rows, "sessions"), 4400);
});
test("Insight: copied embed path scopes tenant/role and prevents recursive mode", () => {
  const url = new URL(im.embedUrl("https://demo.example", "grove", "Member"));
  assert.equal(url.pathname, "/agents/prototypes/insight-boards");
  assert.equal(url.searchParams.get("embed"), "1");
  assert.equal(url.searchParams.get("tenant"), "grove");
  assert.equal(url.searchParams.get("role"), "Member");
});
test("Insight: accessible accent and invalid persisted brand checks", () => {
  assert(im.validAccent("#26715e"));
  for (const accent of ["#ffffff", "#ffff00", "#aabbcc"]) {
    assert.equal(im.validAccent(accent), false);
    const state = structuredClone(insight.seed);
    state.tenants[0].accent = accent;
    assert.equal(insight.validate(state), false);
  }
});
test("Insight: widget mutation respects board ownership and references", () => {
  const state = ia.replaceBoardWidgets(insight.seed, "board-grove", [
    "signups",
    "sessions",
    "sessions",
    "unknown",
  ]);
  assert(insight.validate(state));
  assert.deepEqual(state.boards[1].widgetIds, ["signups", "sessions"]);
  assert.deepEqual(state.boards[0].widgetIds, [
    "sessions",
    "signups",
    "revenue",
  ]);
});
const fund = moduleAt("fundview/data"),
  fm = moduleAt("fundview/formulas"),
  fa = moduleAt("fundview/actions");
test("Fundview: every fixture NAV reconciles to dated capital/performance bridge", () => {
  for (const point of fund.seed.nav) {
    const f = fund.seed.funds.find((f) => f.id === point.fundId);
    const b = fm.bridge(f, point.period, fund.seed.nav, fund.seed.capital);
    assert.equal(b.closing, point.navCents);
    assert.equal(b.opening + b.calls - b.distributions + b.gain, b.closing);
  }
});
test("Fundview: new call updates NAV, commitment and persisted audit consistently", () => {
  const state = fa.recordCapital(fund.seed, {
    fundId: "atlas",
    investorId: "i1",
    kind: "call",
    date: "2026-10-06",
    amountCents: 100000,
  });
  assert(fund.validate(state));
  assert.equal(
    fm.bridge(state.funds[0], "2026 Q4", state.nav, state.capital).closing,
    126100000,
  );
  assert.equal(
    fm.commitment(state.investors[0], state.capital).remaining,
    67900000,
  );
  assert.equal(state.audit.length, 1);
  assert.equal(fund.seed.audit.length, 0);
});
test("Fundview: past/future distribution solvency guard rejects ledger overdraft", () => {
  const investor = fund.seed.investors[0];
  assert.match(
    fm.capitalError(
      investor,
      fund.seed.capital,
      "distribution",
      5000000,
      "2026-04-01",
    ),
    /available/,
  );
  assert.match(
    fm.capitalError(
      investor,
      fund.seed.capital,
      "distribution",
      6000000,
      "2026-04-06",
    ),
    /available/,
  );
  assert.match(
    fm.capitalError(
      investor,
      fund.seed.capital,
      "call",
      90000000,
      "2026-10-06",
    ),
    /commitment/,
  );
});
test("Fundview: share disabled and expiry both block preview", () => {
  assert.equal(
    fm.shareActive(
      { enabled: false, expiresAt: "2030-01-01", reportId: "atlas-2026 Q4" },
      0,
    ),
    false,
  );
  assert.equal(
    fm.shareActive(
      {
        enabled: true,
        expiresAt: "2026-10-05T12:00Z",
        reportId: "atlas-2026 Q4",
      },
      Date.parse("2026-10-05T13:00Z"),
    ),
    false,
  );
});
console.log(`${count} domain contract checks passed.`);
