import { seed } from "./data";
import { validTransition } from "./formulas";
export function transition(s: typeof seed, id: string, status: string) {
  const order = s.orders.find((o) => o.id === id)!;
  if (!validTransition(order.status, status))
    throw Error("This order cannot make that transition.");
  return {
    ...s,
    orders: s.orders.map((o) =>
      o.id === id
        ? { ...o, status, history: [...o.history, `2026-10-08: ${status}`] }
        : o,
    ),
    products:
      status === "canceled"
        ? s.products.map((p) => ({
            ...p,
            stock:
              p.stock +
              order.items
                .filter((i) => i.productId === p.id)
                .reduce((n, i) => n + i.quantity, 0),
          }))
        : s.products,
  };
}
