export interface Product {
  id: string;
  sku: string;
  name: string;
  stock: number;
  reorderPoint: number;
  unitPriceCents: number;
}
export interface Order {
  id: string;
  customerId: string;
  items: { productId: string; quantity: number; priceCents: number }[];
  status: string;
  placedAt: string;
  warehouse: string;
  paymentRef: string;
  history: string[];
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  orders: string[];
}
export interface Settlement {
  id: string;
  orderId: string;
  chargedCents: number;
  feeCents: number;
  settledCents: number;
  status: string;
  notes: string[];
}
export const seed = {
  products: [
    {
      id: "p1",
      sku: "ST-001",
      name: "Everyday tote",
      stock: 18,
      reorderPoint: 10,
      unitPriceCents: 3200,
    },
    {
      id: "p2",
      sku: "ST-002",
      name: "Ceramic pour-over",
      stock: 3,
      reorderPoint: 8,
      unitPriceCents: 4800,
    },
    {
      id: "p3",
      sku: "ST-003",
      name: "Studio notebook",
      stock: 0,
      reorderPoint: 12,
      unitPriceCents: 1800,
    },
    {
      id: "p4",
      sku: "ST-004",
      name: "Desk lamp",
      stock: 25,
      reorderPoint: 5,
      unitPriceCents: 8900,
    },
  ] as Product[],
  customers: [
    {
      id: "c1",
      name: "Maya Chen",
      email: "maya@example.test",
      address: "12 Sample Lane, Demo City",
      orders: ["ORD-1", "ORD-4"],
    },
    {
      id: "c2",
      name: "Alex Morgan",
      email: "alex@example.test",
      address: "48 Fictional Avenue, Demo City",
      orders: ["ORD-2", "ORD-5"],
    },
    {
      id: "c3",
      name: "Taylor Rivera",
      email: "taylor@example.test",
      address: "7 Example Street, Demo City",
      orders: ["ORD-3", "ORD-6"],
    },
  ] as Customer[],
  orders: Array.from({ length: 6 }, (_, i) => ({
    id: `ORD-${i + 1}`,
    customerId: `c${(i % 3) + 1}`,
    items: [
      {
        productId: `p${(i % 4) + 1}`,
        quantity: (i % 2) + 1,
        priceCents: [3200, 4800, 1800, 8900][i % 4],
      },
    ],
    status: ["paid", "packed", "shipped", "pending", "canceled", "paid"][i],
    placedAt: `2026-10-0${i + 1}`,
    warehouse: i % 2 ? "West" : "East",
    paymentRef: `PAY-${101 + i}`,
    history: [
      `2026-10-0${i + 1}: ${["paid", "packed", "shipped", "pending", "canceled", "paid"][i]}`,
    ],
  })) as Order[],
  settlements: [
    {
      id: "st1",
      orderId: "ORD-1",
      chargedCents: 3200,
      feeCents: 100,
      settledCents: 3100,
      status: "matched",
      notes: [],
    },
    {
      id: "st2",
      orderId: "ORD-2",
      chargedCents: 9600,
      feeCents: 280,
      settledCents: 9020,
      status: "mismatch",
      notes: [],
    },
  ] as Settlement[],
  movements: [] as {
    id: string;
    productId: string;
    quantity: number;
    note: string;
  }[],
  warehouse: "All",
  status: "All",
};
export function validate(s: typeof seed) {
  return (
    ["All", "East", "West"].includes(s.warehouse) &&
    ["All", "pending", "paid", "packed", "shipped", "canceled"].includes(
      s.status,
    ) &&
    s.products.every((p) => Number.isInteger(p.stock) && p.stock >= 0) &&
    s.orders.every(
      (o) =>
        s.customers.some((c) => c.id === o.customerId) &&
        ["pending", "paid", "packed", "shipped", "canceled"].includes(
          o.status,
        ) &&
        o.items.every(
          (i) =>
            s.products.some((p) => p.id === i.productId) &&
            i.quantity > 0 &&
            Number.isInteger(i.quantity),
        ),
    ) &&
    s.settlements.every(
      (st) =>
        s.orders.some((o) => o.id === st.orderId) &&
        st.notes.every((n) => typeof n === "string"),
    ) &&
    s.movements.every(
      (m) =>
        typeof m.id === "string" &&
        s.products.some((p) => p.id === m.productId) &&
        Number.isInteger(m.quantity) &&
        m.quantity > 0 &&
        typeof m.note === "string",
    )
  );
}
