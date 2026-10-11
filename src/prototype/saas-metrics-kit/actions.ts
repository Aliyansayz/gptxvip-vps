import { seed, plans } from "./data";
import { uid } from "../shared";
export function changePlan(s: typeof seed, id: string, plan: string) {
  const sub = s.subscriptions.find((x) => x.id === id)!;
  if (sub.status === "churned")
    throw Error("A churned contract cannot change plan.");
  const delta = plans[plan] - sub.monthlyCents;
  if (!delta) return s;
  return {
    ...s,
    subscriptions: s.subscriptions.map((x) =>
      x.id === id ? { ...x, plan, monthlyCents: plans[plan] } : x,
    ),
    movements: [
      ...s.movements,
      {
        id: uid(s.movements, "move"),
        subscriptionId: id,
        period: "2026-10",
        kind: delta > 0 ? "expansion" : "contraction",
        deltaCents: delta,
      },
    ],
  };
}
export function retry(s: typeof seed, id: string) {
  const invoice = s.invoices.find((i) => i.id === id)!;
  if (invoice.status === "paid") return s;
  const attempt = invoice.attemptCount + 1;
  const success = attempt >= 2;
  return {
    ...s,
    invoices: s.invoices.map((i) =>
      i.id === id
        ? {
            ...i,
            attemptCount: attempt,
            status: success ? "paid" : "failed",
            attempts: [
              ...i.attempts,
              `Attempt ${attempt}: ${success ? "fixture success" : "fixture declined"}`,
            ],
          }
        : i,
    ),
    subscriptions: success
      ? s.subscriptions.map((x) =>
          x.id === invoice.subscriptionId ? { ...x, status: "active" } : x,
        )
      : s.subscriptions,
  };
}
