export interface Subscription {
  id: string;
  account: string;
  plan: string;
  monthlyCents: number;
  status: string;
  startedAt: string;
  cohort: string;
  acquisitionCostCents: number;
}
export interface MonthlyMovement {
  id: string;
  subscriptionId: string;
  period: string;
  kind: string;
  deltaCents: number;
}
export interface Invoice {
  id: string;
  subscriptionId: string;
  amountCents: number;
  status: string;
  attemptCount: number;
  dueAt: string;
  attempts: string[];
}
export interface MetricDefinition {
  key: string;
  label: string;
  formula: string;
}
export const plans: Record<string, number> = {
  Starter: 9900,
  Growth: 29900,
  Scale: 79900,
};
export const seed = {
  subscriptions: [
    {
      id: "sub-1",
      account: "Northstar",
      plan: "Scale",
      monthlyCents: 79900,
      status: "active",
      startedAt: "2026-08-01",
      cohort: "2026-08",
      acquisitionCostCents: 160000,
    },
    {
      id: "sub-2",
      account: "Harbor",
      plan: "Growth",
      monthlyCents: 29900,
      status: "past_due",
      startedAt: "2026-09-01",
      cohort: "2026-09",
      acquisitionCostCents: 90000,
    },
    {
      id: "sub-3",
      account: "Evergreen",
      plan: "Starter",
      monthlyCents: 9900,
      status: "active",
      startedAt: "2026-09-15",
      cohort: "2026-09",
      acquisitionCostCents: 40000,
    },
    {
      id: "sub-4",
      account: "Atlas",
      plan: "Growth",
      monthlyCents: 29900,
      status: "active",
      startedAt: "2026-10-01",
      cohort: "2026-10",
      acquisitionCostCents: 100000,
    },
    {
      id: "sub-5",
      account: "Studio",
      plan: "Starter",
      monthlyCents: 0,
      status: "churned",
      startedAt: "2026-08-10",
      cohort: "2026-08",
      acquisitionCostCents: 30000,
    },
  ] as Subscription[],
  movements: [
    {
      id: "move-1",
      subscriptionId: "sub-1",
      period: "2026-09",
      kind: "expansion",
      deltaCents: 50000,
    },
    {
      id: "move-2",
      subscriptionId: "sub-2",
      period: "2026-09",
      kind: "new",
      deltaCents: 29900,
    },
    {
      id: "move-3",
      subscriptionId: "sub-3",
      period: "2026-09",
      kind: "new",
      deltaCents: 9900,
    },
    {
      id: "move-4",
      subscriptionId: "sub-4",
      period: "2026-10",
      kind: "new",
      deltaCents: 29900,
    },
    {
      id: "move-5",
      subscriptionId: "sub-5",
      period: "2026-10",
      kind: "churn",
      deltaCents: -9900,
    },
  ] as MonthlyMovement[],
  invoices: [
    {
      id: "invoice-1",
      subscriptionId: "sub-2",
      amountCents: 29900,
      status: "failed",
      attemptCount: 0,
      dueAt: "2026-10-02",
      attempts: [],
    },
  ] as Invoice[],
  period: "2026-10",
  plan: "All",
  presentation: false,
};
export const definitions: MetricDefinition[] = [
  {
    key: "MRR",
    label: "Monthly recurring revenue",
    formula:
      "Starting MRR + signed new, expansion, contraction and churn movements = ending MRR. Past-due contracts remain in contracted MRR; cash recovery is separate.",
  },
  {
    key: "ARPA",
    label: "Average revenue per account",
    formula:
      "Ending contracted MRR / accounts with positive end-of-period MRR.",
  },
  {
    key: "Gross churn",
    label: "Gross revenue churn",
    formula:
      "Absolute contraction + churn / starting MRR. Excludes expansion and new revenue; zero starting MRR has no denominator.",
  },
  {
    key: "Retention",
    label: "Logo retention",
    formula:
      "Original cohort accounts with positive end-of-period MRR / original cohort accounts. New accounts in another cohort excluded.",
  },
  {
    key: "CAC",
    label: "Acquisition cost",
    formula:
      "Total fixture acquisition spend / selected accounts. Payback uses 80% fixture gross margin × current monthly recurring revenue.",
  },
];
export function validate(s: typeof seed) {
  return (
    ["2026-09", "2026-10"].includes(s.period) &&
    ["All", ...Object.keys(plans)].includes(s.plan) &&
    s.subscriptions.every(
      (x) =>
        Object.keys(plans).includes(x.plan) &&
        ["active", "past_due", "churned"].includes(x.status) &&
        Number.isInteger(x.monthlyCents) &&
        x.monthlyCents >= 0,
    ) &&
    s.movements.every(
      (m) =>
        s.subscriptions.some((x) => x.id === m.subscriptionId) &&
        ["new", "expansion", "contraction", "churn"].includes(m.kind) &&
        Number.isInteger(m.deltaCents),
    ) &&
    s.invoices.every(
      (i) =>
        s.subscriptions.some((x) => x.id === i.subscriptionId) &&
        ["failed", "paid"].includes(i.status) &&
        Number.isInteger(i.attemptCount) &&
        i.attemptCount >= 0 &&
        i.attempts.every((a) => typeof a === "string"),
    )
  );
}
