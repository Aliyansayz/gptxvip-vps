export interface Fund {
  id: string;
  name: string;
  currency: string;
  openingNavCents: number;
}
export interface NavPoint {
  fundId: string;
  period: string;
  navCents: number;
  benchmarkIndex: number;
  gainCents: number;
}
export interface CapitalEvent {
  id: string;
  fundId: string;
  investorId: string;
  date: string;
  kind: "call" | "distribution";
  amountCents: number;
}
export interface Investor {
  id: string;
  fundId: string;
  name: string;
  commitmentCents: number;
}
export interface Holding {
  id: string;
  fundId: string;
  name: string;
  sector: string;
  valueCents: number;
}
export interface ReportSettings {
  fundId: string;
  quarter: string;
  visibleSections: string[];
}
export interface SharePreview {
  reportId: string;
  enabled: boolean;
  expiresAt: string;
}
export interface State {
  view: string;
  fundId: string;
  quarter: string;
  benchmark: string;
  funds: Fund[];
  nav: NavPoint[];
  capital: CapitalEvent[];
  investors: Investor[];
  holdings: Holding[];
  reports: ReportSettings[];
  shares: SharePreview[];
  audit: { id: string; fundId: string; action: string; date: string }[];
}
export const sections = [
  "Performance",
  "Capital ledger",
  "Investors",
  "Exposure",
];
export const seed: State = {
  view: "Performance",
  fundId: "atlas",
  quarter: "2026 Q4",
  benchmark: "Sample benchmark",
  funds: [
    {
      id: "atlas",
      name: "Atlas Growth Fund",
      currency: "USD",
      openingNavCents: 90000000,
    },
    {
      id: "cedar",
      name: "Cedar Opportunities",
      currency: "USD",
      openingNavCents: 50000000,
    },
  ],
  nav: [
    {
      fundId: "atlas",
      period: "2026 Q2",
      navCents: 100000000,
      benchmarkIndex: 103,
      gainCents: 0,
    },
    {
      fundId: "atlas",
      period: "2026 Q3",
      navCents: 116000000,
      benchmarkIndex: 108,
      gainCents: 1000000,
    },
    {
      fundId: "atlas",
      period: "2026 Q4",
      navCents: 126000000,
      benchmarkIndex: 111,
      gainCents: 4000000,
    },
    {
      fundId: "cedar",
      period: "2026 Q2",
      navCents: 60000000,
      benchmarkIndex: 103,
      gainCents: 0,
    },
    {
      fundId: "cedar",
      period: "2026 Q3",
      navCents: 66000000,
      benchmarkIndex: 108,
      gainCents: 1000000,
    },
    {
      fundId: "cedar",
      period: "2026 Q4",
      navCents: 70000000,
      benchmarkIndex: 111,
      gainCents: 1000000,
    },
  ],
  investors: [
    {
      id: "i1",
      fundId: "atlas",
      name: "Westbrook Family Office",
      commitmentCents: 90000000,
    },
    {
      id: "i2",
      fundId: "atlas",
      name: "Oak Foundation",
      commitmentCents: 50000000,
    },
    {
      id: "i3",
      fundId: "cedar",
      name: "Summit Partners",
      commitmentCents: 65000000,
    },
    {
      id: "i4",
      fundId: "cedar",
      name: "River Endowment",
      commitmentCents: 35000000,
    },
  ],
  capital: [
    {
      id: "capital-1",
      fundId: "atlas",
      investorId: "i1",
      date: "2026-04-05",
      kind: "call",
      amountCents: 12000000,
    },
    {
      id: "capital-2",
      fundId: "atlas",
      investorId: "i1",
      date: "2026-06-05",
      kind: "distribution",
      amountCents: 2000000,
    },
    {
      id: "capital-3",
      fundId: "atlas",
      investorId: "i2",
      date: "2026-07-05",
      kind: "call",
      amountCents: 20000000,
    },
    {
      id: "capital-4",
      fundId: "atlas",
      investorId: "i1",
      date: "2026-09-05",
      kind: "distribution",
      amountCents: 5000000,
    },
    {
      id: "capital-5",
      fundId: "atlas",
      investorId: "i1",
      date: "2026-10-05",
      kind: "call",
      amountCents: 10000000,
    },
    {
      id: "capital-6",
      fundId: "atlas",
      investorId: "i2",
      date: "2026-10-05",
      kind: "distribution",
      amountCents: 4000000,
    },
    {
      id: "capital-7",
      fundId: "cedar",
      investorId: "i3",
      date: "2026-04-05",
      kind: "call",
      amountCents: 15000000,
    },
    {
      id: "capital-8",
      fundId: "cedar",
      investorId: "i3",
      date: "2026-06-05",
      kind: "distribution",
      amountCents: 5000000,
    },
    {
      id: "capital-9",
      fundId: "cedar",
      investorId: "i4",
      date: "2026-07-05",
      kind: "call",
      amountCents: 8000000,
    },
    {
      id: "capital-10",
      fundId: "cedar",
      investorId: "i3",
      date: "2026-09-05",
      kind: "distribution",
      amountCents: 3000000,
    },
    {
      id: "capital-11",
      fundId: "cedar",
      investorId: "i3",
      date: "2026-10-05",
      kind: "call",
      amountCents: 5000000,
    },
    {
      id: "capital-12",
      fundId: "cedar",
      investorId: "i4",
      date: "2026-10-05",
      kind: "distribution",
      amountCents: 2000000,
    },
  ],
  holdings: [
    {
      id: "h1",
      fundId: "atlas",
      name: "Northstar Systems",
      sector: "Technology",
      valueCents: 62000000,
    },
    {
      id: "h2",
      fundId: "atlas",
      name: "Grove Energy",
      sector: "Infrastructure",
      valueCents: 41000000,
    },
    {
      id: "h3",
      fundId: "atlas",
      name: "Liquidity reserve",
      sector: "Cash",
      valueCents: 23000000,
    },
    {
      id: "h4",
      fundId: "cedar",
      name: "Fieldwork Industries",
      sector: "Industrial",
      valueCents: 42000000,
    },
    {
      id: "h5",
      fundId: "cedar",
      name: "Ember Services",
      sector: "Technology",
      valueCents: 18000000,
    },
    {
      id: "h6",
      fundId: "cedar",
      name: "Liquidity reserve",
      sector: "Cash",
      valueCents: 10000000,
    },
  ],
  reports: ["atlas", "cedar"].flatMap((fundId) =>
    ["2026 Q2", "2026 Q3", "2026 Q4"].map((quarter) => ({
      fundId,
      quarter,
      visibleSections: [...sections],
    })),
  ),
  shares: [],
  audit: [],
};

const unique = (rows: { id: string }[]) =>
  rows.every((r) => typeof r.id === "string" && !!r.id) &&
  new Set(rows.map((r) => r.id)).size === rows.length;
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const nonnegative = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const integer = (v: unknown): v is number =>
  nonnegative(v) && Number.isSafeInteger(v);
const validDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v;
export function validate(s: State) {
  const fund = (id: string) => s.funds.some((f) => f.id === id);
  const periods = ["2026 Q2", "2026 Q3", "2026 Q4"];
  return (
    [
      "Performance",
      "Capital Ledger",
      "Investors",
      "Quarterly Report / Sharing",
    ].includes(s.view) &&
    fund(s.fundId) &&
    periods.includes(s.quarter) &&
    ["Sample benchmark", "None"].includes(s.benchmark) &&
    unique(s.funds) &&
    s.funds.length > 0 &&
    s.funds.every(
      (f) =>
        text(f.name) &&
        f.currency === "USD" &&
        integer(f.openingNavCents) &&
        s.investors.some((i) => i.fundId === f.id),
    ) &&
    s.nav.every(
      (n) =>
        fund(n.fundId) &&
        periods.includes(n.period) &&
        integer(n.navCents) &&
        integer(n.gainCents) &&
        nonnegative(n.benchmarkIndex) &&
        n.benchmarkIndex > 0,
    ) &&
    new Set(s.nav.map((n) => n.fundId + n.period)).size === s.nav.length &&
    unique(s.investors) &&
    s.investors.every(
      (i) => fund(i.fundId) && text(i.name) && integer(i.commitmentCents),
    ) &&
    unique(s.capital) &&
    s.capital.every(
      (e) =>
        fund(e.fundId) &&
        s.investors.some(
          (i) => i.id === e.investorId && i.fundId === e.fundId,
        ) &&
        validDate(e.date) &&
        periods.includes(
          e.date.slice(0, 4) + " Q" + Math.ceil(Number(e.date.slice(5, 7)) / 3),
        ) &&
        ["call", "distribution"].includes(e.kind) &&
        integer(e.amountCents) &&
        e.amountCents > 0,
    ) &&
    s.investors.every((i) => {
      const rows = s.capital
        .filter((e) => e.investorId === i.id)
        .slice()
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) || (a.kind === "call" ? -1 : 1),
        );
      let paid = 0,
        available = 0;
      return rows.every((e) => {
        if (e.kind === "call") {
          paid += e.amountCents;
          available += e.amountCents;
        } else available -= e.amountCents;
        return paid <= i.commitmentCents && available >= 0;
      });
    }) &&
    unique(s.holdings) &&
    s.holdings.every(
      (h) =>
        fund(h.fundId) &&
        text(h.name) &&
        text(h.sector) &&
        integer(h.valueCents),
    ) &&
    s.reports.every(
      (r) =>
        fund(r.fundId) &&
        periods.includes(r.quarter) &&
        r.visibleSections.every((v) => sections.includes(v)) &&
        new Set(r.visibleSections).size === r.visibleSections.length,
    ) &&
    new Set(s.reports.map((r) => r.fundId + r.quarter)).size ===
      s.reports.length &&
    s.funds.every((f) =>
      periods.every((q) =>
        s.reports.some((r) => r.fundId === f.id && r.quarter === q),
      ),
    ) &&
    s.shares.every(
      (r) =>
        s.reports.some((p) => r.reportId === p.fundId + "-" + p.quarter) &&
        typeof r.enabled === "boolean" &&
        typeof r.expiresAt === "string" &&
        Number.isFinite(Date.parse(r.expiresAt)),
    ) &&
    new Set(s.shares.map((r) => r.reportId)).size === s.shares.length &&
    unique(s.audit) &&
    s.audit.every((a) => fund(a.fundId) && text(a.action) && validDate(a.date))
  );
}
