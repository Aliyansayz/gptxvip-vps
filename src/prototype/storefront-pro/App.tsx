import { validate } from "./data";
import { useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Kpis,
  Select,
  Table,
  Button,
  Field,
  Dialog,
  Badge,
  Notice,
  Empty,
  csv,
  printReport,
  money,
  uid,
} from "../shared";
import { seed } from "./data";
import {
  orderTotal,
  lowStock,
  settlementDiff,
  validTransition,
} from "./formulas";
import { transition } from "./actions";
export default function App() {
  const {
    state: s,
    setState: set,
    reset,
  } = useDemo("storefront-pro", seed, validate);
  const [view, V] = useState("Orders");
  const [query, Q] = useState("");
  const [selected, S] = useState("");
  const [restock, R] = useState("");
  const [quantity, Qty] = useState("10");
  const [customer, C] = useState("");
  const [note, N] = useState("");
  const [settlement, St] = useState("");
  const [notice, M] = useState("");
  const orders = s.orders.filter(
    (o) =>
      (s.warehouse === "All" || o.warehouse === s.warehouse) &&
      (s.status === "All" || o.status === s.status) &&
      (o.id.toLowerCase().includes(query.toLowerCase()) ||
        s.customers
          .find((c) => c.id === o.customerId)
          ?.name.toLowerCase()
          .includes(query.toLowerCase())),
  );
  const order = s.orders.find((o) => o.id === selected);
  const filtered = orders.map((o) => ({
    order: o.id,
    customer: s.customers.find((c) => c.id === o.customerId)?.name,
    status: o.status,
    warehouse: o.warehouse,
    total: money(orderTotal(o)),
    placed: o.placedAt,
  }));
  const move = (status: string) => {
    try {
      set(transition(s, selected, status));
      M(
        `Order ${selected} ${status}. ${status === "canceled" ? "Reserved stock returned." : ""}`,
      );
    } catch (e) {
      M((e as Error).message);
    }
  };
  return (
    <Shell
      slug="storefront-pro"
      title="Storefront Pro"
      subtitle="A clear view of every order, from the shelf to the doorstep."
      accent="#147d6b"
      tabs={["Orders", "Inventory", "Reconciliation", "Customers"]}
      view={view}
      onView={V}
      onReset={() => {
        reset();
        S("");
        R("");
        C("");
        St("");
        M("");
      }}
      actions={
        <Button onClick={() => csv("storefront-orders", filtered)}>
          Export orders
        </Button>
      }
    >
      <div className="product-filters">
        <Field
          label="Search orders or customers"
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
        <Select
          label="Warehouse"
          value={s.warehouse}
          options={["All", "East", "West"]}
          onChange={(warehouse) => set({ ...s, warehouse })}
        />
        <Select
          label="Order status"
          value={s.status}
          options={["All", "pending", "paid", "packed", "shipped", "canceled"]}
          onChange={(status) => set({ ...s, status })}
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Fulfillment queue",
            value: orders.filter((o) => ["paid", "packed"].includes(o.status))
              .length,
            note: "Ready for your next action",
          },
          {
            label: "Selected order value",
            value: money(
              orders
                .filter((o) => o.status !== "canceled")
                .reduce((n, o) => n + orderTotal(o), 0),
            ),
            note: "Canceled orders excluded",
          },
          {
            label: "Stock alerts",
            value: lowStock(s.products).length,
            note: "Available stock at reorder point",
          },
          {
            label: "Settlement exceptions",
            value: s.settlements.filter((x) => settlementDiff(x) !== 0).length,
            note: "Payment difference needs review",
          },
        ]}
      />
      {view === "Orders" && (
        <div className="product-grid">
          <Card title="Fulfillment desk">
            <Table
              caption="Filtered fulfillment orders"
              heads={["Order / customer", "Date", "Status", "Total", "Action"]}
            >
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    {o.id}
                    <small style={{ display: "block", color: "var(--muted)" }}>
                      {s.customers.find((c) => c.id === o.customerId)?.name}
                    </small>
                  </td>
                  <td>{o.placedAt}</td>
                  <td>
                    <Badge
                      status={
                        o.status === "shipped"
                          ? "success"
                          : o.status === "canceled"
                            ? "neutral"
                            : "warning"
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td>{money(orderTotal(o))}</td>
                  <td>
                    <Button variant="secondary" onClick={() => S(o.id)}>
                      Open order
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            {!orders.length && <Empty />}
          </Card>
          <div className="product-stack">
            <Card title="Shipping progress">
              {["paid", "packed", "shipped"].map((status, i) => (
                <div className="product-record" key={status}>
                  <span className="product-chip">0{i + 1}</span>
                  <strong style={{ display: "inline", marginLeft: 12 }}>
                    {status}
                  </strong>
                  <p>
                    {orders.filter((o) => o.status === status).length} orders ·{" "}
                    {s.warehouse} warehouse
                  </p>
                </div>
              ))}
            </Card>
            <Card title="Stock attention">
              {lowStock(s.products).map((p) => (
                <div className="product-record" key={p.id}>
                  <strong>{p.name}</strong>
                  <small>
                    {p.stock} on hand · reorder at {p.reorderPoint}
                  </small>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      V("Inventory");
                      R(p.id);
                    }}
                  >
                    Restock
                  </Button>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
      {view === "Inventory" && (
        <div className="product-stack">
          <Card title="Inventory availability">
            <p>
              Stock is available after existing orders have reserved their
              items. Canceling an unshipped order releases its reservation.
            </p>
            <Table
              caption="SKU stock and reorder thresholds"
              heads={[
                "Product",
                "SKU",
                "On hand",
                "Reorder point",
                "Price",
                "Action",
              ]}
            >
              {s.products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td>{p.stock}</td>
                  <td>{p.reorderPoint}</td>
                  <td>{money(p.unitPriceCents)}</td>
                  <td>
                    <Button onClick={() => R(p.id)}>Restock</Button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card title="Stock movement log">
            {s.movements.map((m) => (
              <div className="product-record" key={m.id}>
                {s.products.find((p) => p.id === m.productId)?.name} · +
                {m.quantity} · {m.note}
              </div>
            ))}
            {!s.movements.length && (
              <Empty>No stock movements recorded yet.</Empty>
            )}
          </Card>
        </div>
      )}
      {view === "Reconciliation" && (
        <Card title="Payment settlement review">
          <Table
            caption="Settlement ledger, USD"
            heads={[
              "Order",
              "Charged",
              "Fee",
              "Settled",
              "Difference",
              "Review",
            ]}
          >
            {s.settlements.map((st) => (
              <tr key={st.id}>
                <td>{st.orderId}</td>
                <td>{money(st.chargedCents)}</td>
                <td>{money(st.feeCents)}</td>
                <td>{money(st.settledCents)}</td>
                <td>{money(settlementDiff(st))}</td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      St(st.id);
                      N("");
                    }}
                  >
                    {settlementDiff(st) ? "Resolve exception" : "View audit"}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {view === "Customers" && (
        <Card title="Customer relationships">
          <Table
            caption="Fictional customer directory"
            heads={["Customer", "Email", "Orders", "Action"]}
          >
            {s.customers
              .filter(
                (c) =>
                  c.name.toLowerCase().includes(query.toLowerCase()) || !query,
              )
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>
                    {s.orders.filter((o) => o.customerId === c.id).length}
                  </td>
                  <td>
                    <Button variant="secondary" onClick={() => C(c.id)}>
                      View customer
                    </Button>
                  </td>
                </tr>
              ))}
          </Table>
        </Card>
      )}
      {order && (
        <Dialog title={`Order ${order.id}`} onClose={() => S("")}>
          <p>
            {s.customers.find((c) => c.id === order.customerId)?.name} ·{" "}
            {order.warehouse} warehouse
          </p>
          <p>{s.customers.find((c) => c.id === order.customerId)?.address}</p>
          <p>
            Payment {order.paymentRef} · <Badge>{order.status}</Badge>
          </p>
          <Table
            caption="Order items"
            heads={["Item", "Quantity", "Price", "Line total"]}
          >
            {order.items.map((i) => (
              <tr key={i.productId}>
                <td>{s.products.find((p) => p.id === i.productId)?.name}</td>
                <td>{i.quantity}</td>
                <td>{money(i.priceCents)}</td>
                <td>{money(i.priceCents * i.quantity)}</td>
              </tr>
            ))}
          </Table>
          <h3>Total {money(orderTotal(order))}</h3>
          <div className="product-actions">
            {["paid", "packed", "shipped", "canceled"].map((status) => (
              <Button
                key={status}
                variant={status === "canceled" ? "danger" : "secondary"}
                disabled={!validTransition(order.status, status)}
                onClick={() => move(status)}
              >
                {status === "paid"
                  ? "Mark paid"
                  : status === "packed"
                    ? "Pack order"
                    : status === "shipped"
                      ? "Ship order"
                      : "Cancel order"}
              </Button>
            ))}
            <Button
              onClick={() =>
                printReport(
                  order.id,
                  order.items.map((i) => ({
                    order: order.id,
                    status: order.status,
                    customer: s.customers.find((c) => c.id === order.customerId)
                      ?.name,
                    address: s.customers.find((c) => c.id === order.customerId)
                      ?.address,
                    payment: order.paymentRef,
                    product: s.products.find((p) => p.id === i.productId)?.name,
                    quantity: i.quantity,
                    lineTotal: money(i.quantity * i.priceCents),
                    orderTotal: money(orderTotal(order)),
                  })),
                )
              }
            >
              Print order
            </Button>
          </div>
          <h3>Status history</h3>
          {order.history.map((h, i) => (
            <p key={i}>{h}</p>
          ))}
        </Dialog>
      )}
      {restock && (
        <Dialog
          title={`Restock ${s.products.find((p) => p.id === restock)?.name}`}
          onClose={() => R("")}
        >
          {notice&&<Notice>{notice}</Notice>}
<form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(quantity);
              if (!Number.isInteger(n) || n <= 0) {
                M("Restock quantity must be a positive whole number.");
                return;
              }
              set({
                ...s,
                products: s.products.map((p) =>
                  p.id === restock ? { ...p, stock: p.stock + n } : p,
                ),
                movements: [
                  ...s.movements,
                  {
                    id: uid(s.movements, "movement"),
                    productId: restock,
                    quantity: n,
                    note: "2026-10-08 demo restock",
                  },
                ],
              });
              R("");
              M("Inventory restocked and movement recorded.");
            }}
          >
            <Field
              label="Restock quantity"
              type="number"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(e) => Qty(e.target.value)}
            />
            <Button type="submit">Record restock</Button>
          </form>
        </Dialog>
      )}
      {customer && (
        <Dialog
          title={s.customers.find((c) => c.id === customer)!.name}
          onClose={() => C("")}
        >
          <p>{s.customers.find((c) => c.id === customer)!.email}</p>
          {s.orders
            .filter((o) => o.customerId === customer)
            .map((o) => (
              <div key={o.id} className="product-record">
                <strong>
                  {o.id} · {money(orderTotal(o))}
                </strong>
                <p>
                  {o.status} · {o.placedAt}
                </p>
                <Button
                  onClick={() => {
                    C("");
                    S(o.id);
                  }}
                >
                  Open order
                </Button>
              </div>
            ))}
        </Dialog>
      )}
      {settlement && (
        <Dialog title="Settlement audit" onClose={() => St("")}>
          <p>
            Difference:{" "}
            {money(
              settlementDiff(s.settlements.find((st) => st.id === settlement)!),
            )}
            . Adjusting records the actual expected settlement and an
            explanation in this demo.
          </p>
          {s.settlements
            .find((st) => st.id === settlement)!
            .notes.map((n, i) => (
              <p key={i}>{n}</p>
            ))}
          {settlementDiff(s.settlements.find((st) => st.id === settlement)!) !==
            0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                set({
                  ...s,
                  settlements: s.settlements.map((st) =>
                    st.id === settlement
                      ? {
                          ...st,
                          settledCents: st.chargedCents - st.feeCents,
                          status: "adjusted",
                          notes: [
                            ...st.notes,
                            `2026-10-08: Adjustment ${money(settlementDiff(st))} — ${note.trim()}`,
                          ],
                        }
                      : st,
                  ),
                });
                M("Settlement adjustment recorded.");
              }}
            >
              <Field
                label="Adjustment explanation"
                required
                value={note}
                onChange={(e) => N(e.target.value)}
              />
              <Button type="submit">Record adjustment</Button>
            </form>
          )}
        </Dialog>
      )}
    </Shell>
  );
}
