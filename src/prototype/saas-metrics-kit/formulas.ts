import type { Subscription, MonthlyMovement } from "./data";
export const initial: Record<string, number> = {
  "sub-1": 29900,
  "sub-2": 0,
  "sub-3": 0,
  "sub-4": 0,
  "sub-5": 9900,
};
export function amountAt(
  id: string,
  period: string,
  movements: MonthlyMovement[],
  inclusive = true,
) {
  return (
    (initial[id] || 0) +
    movements
      .filter(
        (m) =>
          m.subscriptionId === id &&
          (inclusive ? m.period <= period : m.period < period),
      )
      .reduce((n, m) => n + m.deltaCents, 0)
  );
}
export function metrics(
  subs: Subscription[],
  movements: MonthlyMovement[],
  period: string,
) {
  const ids = subs.map((s) => s.id);
  const moves = movements.filter(
    (m) => ids.includes(m.subscriptionId) && m.period === period,
  );
  const start = subs.reduce(
      (n, s) => n + amountAt(s.id, period, movements, false),
      0,
    ),
    end = subs.reduce((n, s) => n + amountAt(s.id, period, movements), 0),
    active = subs.filter((s) => amountAt(s.id, period, movements) > 0).length;
  const loss = -moves
    .filter((m) => m.deltaCents < 0)
    .reduce((n, m) => n + m.deltaCents, 0);
  return {
    start,
    end,
    active,
    arpa: active ? Math.round(end / active) : 0,
    churn: start ? loss / start : null,
    moves,
  };
}
