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
  Bars,
  csv,
  money,
  AreaTrendChart,
  MatrixHeatmapChart,
} from "../shared";
import { seed } from "./data";
import { signed, closing, matchDifference } from "./formulas";
import { post, match, unmatch } from "./actions";
export default function App() {
  const {
    state: s,
    setState: set,
    reset,
  } = useDemo("ledgerline", seed, validate);
  const [view, V] = useState("Ledger");
  const [open, O] = useState(false);
  const [detail, D] = useState("");
  const [notice, N] = useState("");
  const [description, Desc] = useState("");
  const [amount, A] = useState("");
  const [direction, Dir] = useState("credit");
  const [category, Cat] = useState("Revenue");
  const [reference, Ref] = useState("");
  const [date, DateV] = useState("2026-10-08");
  const [matches, M] = useState<Record<string, string>>({});
  const account = s.accounts.find((a) => a.id === s.account)!;
  const entries = s.entries.filter(
    (e) =>
      e.accountId === s.account &&
      (s.range === "All dates" ||
        (s.range === "Oct 1–3"
          ? e.date >= "2026-10-01" && e.date <= "2026-10-03"
          : e.date >= "2026-10-04" && e.date <= "2026-10-08")),
  );
  const lines = s.statements.filter((l) => l.accountId === s.account);
  const fmt = (n: number) => money(n, account.currency);
  const actions = (fn: () => typeof s) => {
    try {
      set(fn());
      N("Ledger and audit updated.");
    } catch (e) {
      N((e as Error).message);
    }
  };
  const rows = entries.map((e) => ({
    date: e.date,
    description: e.description,
    reference: e.reference,
    direction: e.direction,
    amount: fmt(e.amountCents),
    currency: account.currency,
    reconciled: e.reconciled,
  }));
  return (
    <Shell
      slug="ledgerline"
      title="Ledgerline"
      subtitle="Every posting accounted for. Every difference explained."
      accent="#334d77"
      tabs={["Ledger", "Reconciliation", "Cash Flow", "Audit"]}
      view={view}
      onView={V}
      onReset={() => {
        reset();
        D("");
        O(false);
        M({});
        N("");
      }}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => csv("ledgerline-postings", rows)}
          >
            Export postings
          </Button>
          <Button onClick={() => O(true)}>New journal entry</Button>
        </>
      }
    >
      <div className="product-filters">
        <Select
          label="Account / currency"
          value={s.account}
          options={s.accounts.map((a) => ({
            value: a.id,
            label: `${a.name} · ${a.currency}`,
          }))}
          onChange={(account) => {
            set({ ...s, account });
            D("");
          }}
        />
        <Select
          label="Date window"
          value={s.range}
          options={["All dates", "Oct 1–3", "Oct 4–8"]}
          onChange={(range) => set({ ...s, range })}
        />
        <span className="product-chip">
          No bank connection · fixture statements
        </span>
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Opening balance",
            value: fmt(account.openingBalanceCents),
            note: "Fixture opening on October 1",
            comparison: "Base fixture",
            change: { value: "+0.0%", positive: true },
            sparkline: [40, 40, 42, 45, 43, 46, 48],
            sparklineColor: "#334d77",
          },
          {
            label: "Selected net movement",
            value: fmt(entries.reduce((n, e) => n + signed(e), 0)),
            note: s.range,
            comparison: "+8.4% surplus",
            change: { value: "+8.4%", positive: true },
            sparkline: [12, 18, 15, 24, 20, 32, 30],
            sparklineColor: "#10b981",
          },
          {
            label: "Closing account balance",
            value: fmt(closing(account, s.entries)),
            note: "Opening + all account postings",
            comparison: "Reconciled ledger",
            change: { value: "+5.2%", positive: true },
            sparkline: [42, 46, 48, 52, 50, 56, 58],
            sparklineColor: "#334d77",
          },
          {
            label: "Unmatched statement lines",
            value: lines.filter((l) => !l.matchedEntryId).length,
            note: account.currency + " only; no FX conversion",
            comparison: "2 pending review",
            change: { value: "-1", positive: false },
            sparkline: [6, 5, 4, 4, 3, 2, 2],
            sparklineColor: "#f43f5e",
          },
        ]}
      />

      {/* Visual Chart View matching reference aesthetic */}
      <div className="product-grid" style={{ marginBottom: "20px" }}>
        <AreaTrendChart
          title="Cash Flow & Working Capital Trajectory"
          data={[
            { label: "Oct 1", v1: 4.8, v2: 2.4 },
            { label: "Oct 2", v1: 6.2, v2: 3.9 },
            { label: "Oct 3", v1: 5.4, v2: 3.1 },
            { label: "Oct 4", v1: 7.9, v2: 4.5 },
            { label: "Oct 5", v1: 9.87, v2: 5.6 },
            { label: "Oct 6", v1: 6.8, v2: 4.2 },
            { label: "Oct 7", v1: 8.5, v2: 5.1 },
          ]}
          series={[
            { key: "v1", label: "Cash Inflow ($k)", color: "#334d77" },
            { key: "v2", label: "Operating Disbursements ($k)", color: "#93c5fd" },
          ]}
          yLabels={["$10k", "$8k", "$6k", "$4k", "$2k"]}
          activeTooltip={{ label: "Oct 5", value: "$9,873.42" }}
        />
        <MatrixHeatmapChart
          title="Account Settlement Density"
          subtitle="Postings by Category"
          rows={[
            { name: "Revenue", values: [3, 2, 3, 3, 2, 3, 3] },
            { name: "Payroll", values: [1, 3, 1, 2, 1, 2, 1] },
            { name: "SaaS / Tools", values: [2, 1, 2, 1, 3, 1, 2] },
            { name: "Logistics", values: [1, 2, 1, 3, 2, 1, 2] },
            { name: "Tax Reserve", values: [2, 1, 2, 2, 1, 3, 2] },
          ]}
          columns={["M", "T", "W", "T", "F", "S", "S"]}
        />
      </div>

      {view === "Ledger" && (
        <Card title="Journal postings">
          <Table
            caption={`${account.name} · ${account.currency} postings`}
            heads={[
              "Date",
              "Description / reference",
              "Category",
              "Debit",
              "Credit",
              "State",
              "Inspect",
            ]}
          >
            {entries.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>
                  {e.description}
                  <small style={{ display: "block", color: "var(--muted)" }}>
                    {e.reference}
                  </small>
                </td>
                <td>{e.category}</td>
                <td>{e.direction === "debit" ? fmt(e.amountCents) : "—"}</td>
                <td>{e.direction === "credit" ? fmt(e.amountCents) : "—"}</td>
                <td>
                  <Badge status={e.reconciled ? "success" : "neutral"}>
                    {e.reconciled ? "Reconciled" : "Open"}
                  </Badge>
                </td>
                <td>
                  <Button variant="secondary" onClick={() => D(e.id)}>
                    Open posting
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
          {!entries.length && <Empty />}
        </Card>
      )}
      {view === "Reconciliation" && (
        <div className="product-stack">
          {lines.map((l) => {
            const options = s.entries.filter(
              (e) => e.accountId === s.account && !e.reconciled,
            );
            const chosen = s.entries.find((e) => e.id === matches[l.id]);
            return (
              <Card
                key={l.id}
                title={`Statement ${l.reference}`}
                aside={
                  <Badge status={l.matchedEntryId ? "success" : "warning"}>
                    {l.matchedEntryId ? "Matched" : "Unmatched"}
                  </Badge>
                }
              >
                <p>
                  {l.date} · {fmt(l.amountCents)} · {l.id}
                </p>
                {l.matchedEntryId ? (
                  <>
                    <p>Matched to {l.matchedEntryId}</p>
                    <Button
                      variant="secondary"
                      onClick={() => actions(() => unmatch(s, l.id))}
                    >
                      Unmatch posting
                    </Button>
                  </>
                ) : (
                  <>
                    <Select
                      label={`Ledger posting for ${l.reference}`}
                      value={matches[l.id] || ""}
                      options={[
                        { value: "", label: "Choose a posting" },
                        ...options.map((e) => ({
                          value: e.id,
                          label: `${e.reference} · ${fmt(signed(e))}`,
                        })),
                      ]}
                      onChange={(value) => M({ ...matches, [l.id]: value })}
                    />
                    {chosen && (
                      <p>
                        Difference:{" "}
                        <strong>{fmt(matchDifference(l, chosen))}</strong>.{" "}
                        {matchDifference(l, chosen) !== 0
                          ? "Amount mismatch: resolve the ledger or statement before matching."
                          : "Exact signed amount match."}
                      </p>
                    )}
                    <Button
                      onClick={() =>
                        actions(() => match(s, l.id, matches[l.id] || ""))
                      }
                    >
                      Match selected posting
                    </Button>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
      {view === "Cash Flow" && (
        <div className="product-grid">
          <Card title="Signed cash-flow bridge">
            <Bars
              rows={[
                {
                  label: "Opening balance",
                  value: account.openingBalanceCents,
                },
                ...Array.from(new Set(entries.map((e) => e.category))).map(
                  (label) => ({
                    label,
                    value: entries
                      .filter((e) => e.category === label)
                      .reduce((n, e) => n + signed(e), 0),
                  }),
                ),
                {
                  label: "Selected window ending",
                  value:
                    account.openingBalanceCents +
                    entries.reduce((n, e) => n + signed(e), 0),
                },
              ]}
              format={fmt}
            />
            <p>
              Signed category movements for selected dates; full account closing
              balance appears above. Each currency is isolated.
            </p>
          </Card>
          <Card title="Posting breakdown">
            <Table
              caption="Selected signed category amounts"
              heads={["Category", "Credits", "Debits", "Net"]}
            >
              {Array.from(new Set(entries.map((e) => e.category))).map((c) => {
                const es = entries.filter((e) => e.category === c);
                return (
                  <tr key={c}>
                    <td>{c}</td>
                    <td>
                      {fmt(
                        es
                          .filter((e) => e.direction === "credit")
                          .reduce((n, e) => n + e.amountCents, 0),
                      )}
                    </td>
                    <td>
                      {fmt(
                        es
                          .filter((e) => e.direction === "debit")
                          .reduce((n, e) => n + e.amountCents, 0),
                      )}
                    </td>
                    <td>{fmt(es.reduce((n, e) => n + signed(e), 0))}</td>
                  </tr>
                );
              })}
            </Table>
          </Card>
        </div>
      )}
      {view === "Audit" && (
        <Card
          title="Mutation audit trail"
          aside={
            <Button
              onClick={() =>
                csv(
                  "ledgerline-audit",
                  s.audit.filter(
                    (a) =>
                      s.entries.some(
                        (e) => e.accountId === s.account && e.id === a.recordId,
                      ) || lines.some((l) => l.id === a.recordId),
                  ),
                )
              }
            >
              Export audit
            </Button>
          }
        >
          <Table
            caption="Account-specific posting and reconciliation history"
            heads={["Time", "Action", "Record", "Details"]}
          >
            {s.audit
              .filter(
                (a) =>
                  s.entries.some(
                    (e) => e.accountId === s.account && e.id === a.recordId,
                  ) || lines.some((l) => l.id === a.recordId),
              )
              .map((a) => (
                <tr key={a.id}>
                  <td>{a.at}</td>
                  <td>{a.action}</td>
                  <td>{a.recordId}</td>
                  <td>{a.details}</td>
                </tr>
              ))}
          </Table>
          {!s.audit.length && (
            <Empty>
              No actions yet. Post or reconcile to create an audit event.
            </Empty>
          )}
        </Card>
      )}
      {open && (
        <Dialog
          title={`New ${account.currency} journal entry`}
          onClose={() => O(false)}
        >
          {notice && <Notice>{notice}</Notice>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                set(
                  post(s, {
                    accountId: s.account,
                    date,
                    description,
                    direction,
                    amountCents: Math.round(Number(amount) * 100),
                    category,
                    reference,
                  }),
                );
                O(false);
                N("Journal entry posted with audit trail.");
              } catch (e) {
                N((e as Error).message);
              }
            }}
          >
            <Field
              label="Description"
              required
              value={description}
              onChange={(e) => Desc(e.target.value)}
            />
            <div className="product-form-row">
              <Field
                label="Amount (major currency units)"
                type="number"
                min="0.01"
                step="0.01"
                required
                value={amount}
                onChange={(e) => A(e.target.value)}
              />
              <Field
                label="Posting date"
                type="date"
                required
                value={date}
                onChange={(e) => DateV(e.target.value)}
              />
            </div>
            <Select
              label="Direction"
              value={direction}
              options={["credit", "debit"]}
              onChange={Dir}
            />
            <Select
              label="Category"
              value={category}
              options={["Revenue", "Operations", "Payroll", "Capital"]}
              onChange={Cat}
            />
            <Field
              label="Reference"
              required
              value={reference}
              onChange={(e) => Ref(e.target.value)}
            />
            <Button type="submit">Post journal entry</Button>
          </form>
        </Dialog>
      )}
      {detail && (
        <Dialog title="Posting detail" onClose={() => D("")}>
          {s.entries
            .filter((e) => e.id === detail)
            .map((e) => (
              <div key={e.id}>
                <h3>{e.description}</h3>
                <p>
                  {e.reference} · {e.date}
                </p>
                <p>
                  {e.direction} {fmt(e.amountCents)} · {e.category}
                </p>
                <p>
                  {e.reconciled
                    ? "Linked to statement " +
                      s.statements.find((l) => l.matchedEntryId === e.id)?.id
                    : "Not yet reconciled"}
                </p>
              </div>
            ))}
        </Dialog>
      )}
    </Shell>
  );
}
