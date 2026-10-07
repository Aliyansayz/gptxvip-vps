import type { Deal } from "./data";
export const openDeals = (deals: Deal[]) =>
  deals.filter((d) => !["won", "lost"].includes(d.stage));
export const forecast = (deals: Deal[]) => ({
  raw: openDeals(deals).reduce((n, d) => n + d.valueCents, 0),
  weighted: openDeals(deals).reduce(
    (n, d) => n + Math.round(d.valueCents * d.probability),
    0,
  ),
  won: deals
    .filter((d) => d.stage === "won")
    .reduce((n, d) => n + d.valueCents, 0),
});
