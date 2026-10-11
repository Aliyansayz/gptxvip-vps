import { useEffect, useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Kpis,
  Select,
  Table,
  Dialog,
  Field,
  Button,
  Bars,
  csv,
  printReport,
  Notice,
  Empty,
  money,
  uid,
} from "../shared";
import { validate, seed, sections } from "./data";
import {
  bridge,
  commitment,
  capitalError,
  quarterOf,
  shareActive,
} from "./formulas";
import { recordCapital } from "./actions";
import { PerformancePlot } from "./Views";
export default function App() {
  const { state, setState, reset } = useDemo("fundview", seed, validate);
  const query = new URLSearchParams(window.location.search);
  const preview = query.get("preview") === "1";
  const fundId = preview ? query.get("fund") || state.fundId : state.fundId;
  const quarter = preview
    ? query.get("quarter") || state.quarter
    : state.quarter;
  const fund = state.funds.find((f) => f.id === fundId) || state.funds[0];
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState<{
    investorId: string;
    kind: string;
    amount: string;
    date: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const update = (patch: Partial<typeof state>) =>
    setState((s) => ({ ...s, ...patch }));
  const investors = state.investors.filter((i) => i.fundId === fund.id);
  const ledger = state.capital.filter(
    (e) => e.fundId === fund.id && quarterOf(e.date) === quarter,
  );
  const b = bridge(fund, quarter, state.nav, state.capital);
  const report = state.reports.find(
    (r) => r.fundId === fund.id && r.quarter === quarter,
  ) || { fundId: fund.id, quarter, visibleSections: sections };
  const shareId = `${fund.id}-${quarter}`;
  const share = state.shares.find((s) => s.reportId === shareId);
  const url = `${window.location.origin}/agents/prototypes/fundview?preview=1&fund=${encodeURIComponent(fund.id)}&quarter=${encodeURIComponent(quarter)}`;
  const points = state.nav
    .filter((n) => n.fundId === fund.id && n.period <= quarter)
    .map((n) => ({
      period: n.period,
      nav: bridge(fund, n.period, state.nav, state.capital).closing,
      benchmark: n.benchmarkIndex,
    }));
  const holdings = state.holdings.filter((h) => h.fundId === fund.id);
  const exposure = Object.entries(
    holdings.reduce<Record<string, number>>(
      (a, h) => ({ ...a, [h.sector]: (a[h.sector] || 0) + h.valueCents }),
      {},
    ),
  );
  const reportRows: Record<string, unknown>[] = report.visibleSections.flatMap<Record<string, unknown>>(
    (section) =>
      section === "Performance"
        ? [
            {
              section,
              fund: fund.name,
              quarter,
              opening: money(b.opening),
              calls: money(b.calls),
              distributions: money(b.distributions),
              sampleGain: money(b.gain),
              closing: money(b.closing),
              simpleGainRate: `${(b.returnRate * 100).toFixed(2)}%`,
            },
          ]
        : section === "Capital ledger"
          ? ledger.map((e) => ({
              section,
              fund: fund.name,
              quarter,
              date: e.date,
              investor: investors.find((i) => i.id === e.investorId)?.name,
              kind: e.kind,
              amount: money(e.amountCents),
            }))
          : section === "Investors"
            ? investors.map((i) => {
                const c = commitment(i, state.capital, quarter);
                return {
                  section,
                  fund: fund.name,
                  quarter,
                  investor: i.name,
                  commitment: money(i.commitmentCents),
                  contributed: money(c.contributed),
                  distributed: money(c.distributed),
                  remaining: money(c.remaining),
                };
              })
            : exposure.map(([sector, value]) => ({
                section,
                fund: fund.name,
                quarter,
                sector,
                value: money(value),
                note: "Fixed Q4 sample holdings snapshot",
              })),
  );
  const reportView = (
    <div className="product-stack">
      <Card title={`${fund.name} · ${quarter}`}>
        <p>Fictional quarterly investor report · USD · Browser-only preview</p>
        <p>Included sections: {report.visibleSections.join(", ") || "None"}</p>
      </Card>
      {report.visibleSections.includes("Performance") && (
        <Card title="Performance bridge">
          <PerformancePlot
            points={points}
            benchmark={state.benchmark !== "None"}
          />
          <Table
            caption="Explicit capital / performance bridge"
            heads={[
              "Opening NAV",
              "Calls",
              "Distributions",
              "Sample gain",
              "Closing NAV",
            ]}
          >
            <tr>
              <td>{money(b.opening)}</td>
              <td>{money(b.calls)}</td>
              <td>−{money(b.distributions)}</td>
              <td>{money(b.gain)}</td>
              <td>{money(b.closing)}</td>
            </tr>
          </Table>
        </Card>
      )}
      {report.visibleSections.includes("Capital ledger") && (
        <Card title="Quarterly capital ledger">
          <Table
            caption={`${quarter} capital activity`}
            heads={["Date", "Investor", "Kind", "Amount"]}
          >
            {ledger.map((e) => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{investors.find((i) => i.id === e.investorId)?.name}</td>
                <td>{e.kind}</td>
                <td>{money(e.amountCents)}</td>
              </tr>
            ))}
          </Table>
          {!ledger.length && <Empty>No capital activity this quarter.</Empty>}
        </Card>
      )}
      {report.visibleSections.includes("Investors") && (
        <Card title="Commitments through selected quarter">
          <Table
            caption="Contributions reduce commitments; distributions do not restore them"
            heads={[
              "Investor",
              "Commitment",
              "Contributed",
              "Distributed",
              "Remaining",
            ]}
          >
            {investors.map((i) => {
              const c = commitment(i, state.capital, quarter);
              return (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>{money(i.commitmentCents)}</td>
                  <td>{money(c.contributed)}</td>
                  <td>{money(c.distributed)}</td>
                  <td>{money(c.remaining)}</td>
                </tr>
              );
            })}
          </Table>
        </Card>
      )}
      {report.visibleSections.includes("Exposure") && (
        <Card title="Sector exposure · fixed Q4 sample holdings">
          <Bars
            rows={exposure.map(([label, value]) => ({ label, value }))}
            format={money}
          />
          <p>
            Holdings are a fixed Q4 research snapshot; capital mutations affect
            the NAV ledger, not this holdings allocation.
          </p>
        </Card>
      )}
    </div>
  );
  if (preview)
    return (
      <div
        className="product-workspace"
        data-prototype="fundview"
        data-theme="light"
        style={{ "--accent": "#355c81" } as React.CSSProperties}
      >
        <main className="product-main">
          <div className="product-content">
            {shareActive(share, now) &&
            state.funds.some((f) => f.id === fundId) &&
            state.reports.some(
              (r) => r.fundId === fundId && r.quarter === quarter,
            ) ? (
              reportView
            ) : (
              <Card title="Report preview unavailable">
                <p>
                  This local share preview is disabled, expired or unknown. It
                  only works in the browser holding the demo records.
                </p>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  return (
    <Shell
      slug="fundview"
      title="Fundview"
      subtitle="Clear investor reporting with a reconciled capital bridge."
      accent="#355c81"
      tabs={[
        "Performance",
        "Capital Ledger",
        "Investors",
        "Quarterly Report / Sharing",
      ]}
      view={state.view}
      onView={(view) => update({ view })}
      onReset={() => {
        reset();
        setSelected(null);
        setForm(null);
      }}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => csv(`fundview-${fund.id}-${quarter}`, reportRows)}
          >
            Export report
          </Button>
          <Button
            onClick={() => printReport(`${fund.name} · ${quarter}`, reportRows)}
          >
            Print report
          </Button>
        </>
      }
    >
      <div className="product-filters">
        <Select
          label="Fund"
          value={fund.id}
          onChange={(fundId) => {
            update({ fundId });
            setSelected(null);
            setForm(null);
          }}
          options={state.funds.map((f) => ({ value: f.id, label: f.name }))}
        />
        <Select
          label="Quarter"
          value={quarter}
          onChange={(quarter) => update({ quarter })}
          options={["2026 Q2", "2026 Q3", "2026 Q4"]}
        />
        <Select
          label="Benchmark"
          value={state.benchmark}
          onChange={(benchmark) => update({ benchmark })}
          options={["Sample benchmark", "None"]}
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      {state.view === "Performance" && (
        <>
          <Kpis
            items={[
              { label: "Closing NAV", value: money(b.closing) },
              {
                label: "Quarter gain",
                value: money(b.gain),
                note: "Recorded performance component",
              },
              {
                label: "Simple gain / opening",
                value: `${(b.returnRate * 100).toFixed(2)}%`,
                note: "Not IRR or time-weighted return",
              },
              {
                label: "Net capital flow",
                value: money(b.calls - b.distributions),
              },
            ]}
          />
          <div className="product-grid">
            <Card title="NAV and benchmark">
              <PerformancePlot
                points={points}
                benchmark={state.benchmark !== "None"}
              />
              <Table
                caption="NAV and benchmark source values"
                heads={["Quarter", "NAV", "Benchmark index"]}
              >
                {points.map((p) => (
                  <tr key={p.period}>
                    <td>{p.period}</td>
                    <td>{money(p.nav)}</td>
                    <td>
                      {state.benchmark === "None" ? "Hidden" : p.benchmark}
                    </td>
                  </tr>
                ))}
              </Table>
            </Card>
            <Card title="NAV bridge">
              <Bars
                rows={[
                  { label: "Opening NAV", value: b.opening },
                  { label: "Capital calls", value: b.calls },
                  { label: "Distributions", value: -b.distributions },
                  { label: "Sample performance gain", value: b.gain },
                  { label: "Closing NAV", value: b.closing },
                ]}
                format={money}
              />
              <p>Opening + calls − distributions + gain = closing.</p>
            </Card>
          </div>
        </>
      )}
      {state.view === "Capital Ledger" && (
        <div className="product-stack">
          <Card
            title={`${quarter} capital events`}
            aside={
              <Button
                onClick={() => {
                  setForm({
                    investorId: investors[0].id,
                    kind: "call",
                    amount: "",
                    date: `2026-${quarter.endsWith("Q2") ? "04" : quarter.endsWith("Q3") ? "07" : "10"}-05`,
                  });
                  setError("");
                }}
              >
                Record demo capital event
              </Button>
            }
          >
            <Table
              caption="Selected fund and quarter capital ledger"
              heads={["Date", "Investor", "Event", "Amount"]}
            >
              {ledger.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{investors.find((i) => i.id === e.investorId)?.name}</td>
                  <td>{e.kind}</td>
                  <td>{money(e.amountCents)}</td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card title="Capital action audit">
            {state.audit
              .filter((a) => a.fundId === fund.id)
              .map((a) => (
                <p key={a.id}>
                  {a.date} · {a.action}
                </p>
              ))}
            {!state.audit.some((a) => a.fundId === fund.id) && (
              <Empty>No demo capital changes recorded yet.</Empty>
            )}
          </Card>
        </div>
      )}
      {state.view === "Investors" && (
        <div className="product-grid">
          <Card title="Investor commitments">
            {investors.map((i) => {
              const c = commitment(i, state.capital, quarter);
              return (
                <div className="product-record" key={i.id}>
                  <Button variant="secondary" onClick={() => setSelected(i.id)}>
                    {i.name}
                  </Button>
                  <p>
                    {money(i.commitmentCents)} committed · {money(c.remaining)}{" "}
                    remaining through {quarter}
                  </p>
                </div>
              );
            })}
          </Card>
          <Card title="Investor statement">
            {selected && investors.find((i) => i.id === selected) ? (
              (() => {
                const i = investors.find((i) => i.id === selected)!;
                const c = commitment(i, state.capital, quarter);
                return (
                  <>
                    <h3>{i.name}</h3>
                    <p>Commitment: {money(i.commitmentCents)}</p>
                    <p>
                      Contributed: {money(c.contributed)} · Distributed:{" "}
                      {money(c.distributed)} · Remaining: {money(c.remaining)}
                    </p>
                    {state.capital
                      .filter(
                        (e) =>
                          e.investorId === i.id && quarterOf(e.date) <= quarter,
                      )
                      .map((e) => (
                        <p key={e.id}>
                          {e.date} · {e.kind} · {money(e.amountCents)}
                        </p>
                      ))}
                  </>
                );
              })()
            ) : (
              <Empty>Select an investor for a statement.</Empty>
            )}
          </Card>
        </div>
      )}
      {state.view === "Quarterly Report / Sharing" && (
        <div className="product-stack">
          <Card title="Report section controls">
            <div className="product-filters">
              {sections.map((section) => (
                <label
                  key={section}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="checkbox"
                    style={{ width: 20 }}
                    checked={report.visibleSections.includes(section)}
                    onChange={() =>
                      setState((s) => ({
                        ...s,
                        reports: s.reports.map((r) =>
                          r.fundId === fund.id && r.quarter === quarter
                            ? {
                                ...r,
                                visibleSections: r.visibleSections.includes(
                                  section,
                                )
                                  ? r.visibleSections.filter(
                                      (v) => v !== section,
                                    )
                                  : [...r.visibleSections, section],
                              }
                            : r,
                        ),
                      }))
                    }
                  />
                  {section}
                </label>
              ))}
            </div>
            <p>Print and CSV include only the selected sections and quarter.</p>
          </Card>
          <Card title="Local share preview">
            <p>
              Browser-only access simulation. This link reads demo state on this
              device; it is not a secure or publicly published report.
            </p>
            <div className="product-actions">
              <Button
                onClick={() => {
                  const expiresAt = new Date(
                    Date.now() + 3600000,
                  ).toISOString();
                  setState((s) => ({
                    ...s,
                    shares: [
                      ...s.shares.filter((r) => r.reportId !== shareId),
                      { reportId: shareId, enabled: true, expiresAt },
                    ],
                  }));
                }}
              >
                Enable preview for 1 hour
              </Button>
              <Button
                variant="secondary"
                disabled={!share?.enabled}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    shares: s.shares.map((r) =>
                      r.reportId === shareId ? { ...r, enabled: false } : r,
                    ),
                  }))
                }
              >
                Disable preview
              </Button>
              <Button
                variant="secondary"
                disabled={!shareActive(share, now)}
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    shares: s.shares.map((r) =>
                      r.reportId === shareId
                        ? {
                            ...r,
                            expiresAt: new Date(
                              Date.now() - 1000,
                            ).toISOString(),
                          }
                        : r,
                    ),
                  }))
                }
              >
                Simulate expiry
              </Button>
            </div>
            <p>
              {shareActive(share, now)
                ? `Enabled until ${new Date(share!.expiresAt).toLocaleString()}`
                : "Disabled or expired"}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--accent-text)" }}
            >
              Open local report preview
            </a>
          </Card>
          {reportView}
        </div>
      )}
      {form && (
        <Dialog title="Record demo capital event" onClose={() => setForm(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const i = investors.find((i) => i.id === form.investorId)!;
              const amount = Math.round(Number(form.amount) * 100);
              const err = capitalError(
                i,
                state.capital,
                form.kind,
                amount,
                form.date,
              );
              if (err || quarterOf(form.date) !== quarter) {
                setError(
                  err || "Event date must fall in the selected quarter.",
                );
                return;
              }
              setState((s) =>
                recordCapital(s, {
                  fundId: fund.id,
                  investorId: i.id,
                  date: form.date,
                  kind: form.kind as "call" | "distribution",
                  amountCents: amount,
                }),
              );
              setForm(null);
              setNotice(
                "Capital event recorded. NAV, commitments and report recalculated.",
              );
            }}
          >
            <Select
              label="Investor"
              value={form.investorId}
              onChange={(investorId) => setForm({ ...form, investorId })}
              options={investors.map((i) => ({ value: i.id, label: i.name }))}
            />
            <Select
              label="Event type"
              value={form.kind}
              onChange={(kind) => setForm({ ...form, kind })}
              options={["call", "distribution"]}
            />
            <Field
              label="Amount (USD)"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
            <Field
              label="Date in selected quarter"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            {error && (
              <p className="product-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">Record event</Button>
          </form>
        </Dialog>
      )}
    </Shell>
  );
}
