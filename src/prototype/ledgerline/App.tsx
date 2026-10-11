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
          },
          {
            label: "Selected net movement",
            value: fmt(entries.reduce((n, e) => n + signed(e), 0)),
            note: s.range,
          },
          {
            label: "Closing account balance",
            value: fmt(closing(account, s.entries)),
            note: "Opening + all account postings",
          },
          {
            label: "Unmatched statement lines",
            value: lines.filter((l) => !l.matchedEntryId).length,
            note: account.currency + " only; no FX conversion",
          },
        ]}
      />
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
          {notice&&<Notice>{notice}</Notice>}
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
