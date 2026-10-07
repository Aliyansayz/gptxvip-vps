import type { Order, Product, Settlement } from "./data";
export const orderTotal = (o: Order) =>
  o.items.reduce((n, i) => n + i.quantity * i.priceCents, 0);
export const lowStock = (p: Product[]) =>
  p.filter((i) => i.stock <= i.reorderPoint);
export const settlementDiff = (s: Settlement) =>
  s.chargedCents - s.feeCents - s.settledCents;
export const validTransition = (from: string, to: string) =>
  (
    ({
      pending: ["paid", "canceled"],
      paid: ["packed", "canceled"],
      packed: ["shipped", "canceled"],
      shipped: [],
      canceled: [],
    }) as Record<string, string[]>
  )[from]?.includes(to);
