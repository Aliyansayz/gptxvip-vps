import type { Campaign, DailyPerformance, TouchpointConversion } from "./data";
export const inRange = (date: string, range: string) =>
  range !== "First week" || date <= "2026-10-07";
export function campaignTotals(c: Campaign, rows: DailyPerformance[]) {
  const spend = rows.reduce((s, r) => s + r.spendCents, 0);
  const through = rows.reduce((s, r) => (r.date > s ? r.date : s), c.startAt);
  const elapsed = Math.max(
    0,
    Math.min(
      1,
      (Date.parse(through) - Date.parse(c.startAt) + 86400000) /
        (Date.parse(c.endAt) - Date.parse(c.startAt) + 86400000),
    ),
  );
  return {
    spend,
    clicks: rows.reduce((s, r) => s + r.clicks, 0),
    conversions: rows.reduce((s, r) => s + r.conversions, 0),
    revenue: rows.reduce((s, r) => s + r.revenueCents, 0),
    pacing: spend / c.budgetCents,
    elapsed,
  };
}
export function allocations(rows: TouchpointConversion[], mode: string) {
  const result: Record<string, number> = { Search: 0, Social: 0, Display: 0 };
  for (const r of rows) {
    const channels =
      mode === "First touch"
        ? [r.firstChannel]
        : mode === "Last touch"
          ? [r.lastChannel]
          : r.weightedChannels;
    channels.forEach((c) => {
      result[c] = (result[c] || 0) + r.valueCents / channels.length;
    });
  }
  return result;
}
