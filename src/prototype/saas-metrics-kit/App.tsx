import { validate } from "./data";
import { MovementBridge } from "./Views";
import { useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Kpis,
  Select,
  Table,
  Button,
  Dialog,
  Badge,
  Notice,
  Empty,
  Bars,
  csv,
  printReport,
  money,
} from "../shared";
import { seed, plans, definitions } from "./data";
import { metrics, amountAt } from "./formulas";
import { changePlan, retry } from "./actions";
export default function App() {
  const {
    state: s,
    setState: set,
    reset,
  } = useDemo("saas-metrics-kit", seed, validate);
  const [view, V] = useState("Revenue");
  const [selected, S] = useState("");
  const [defs, D] = useState(false);
  const [notice, N] = useState("");
  const subs = s.subscriptions.filter(
    (x) => s.plan === "All" || x.plan === s.plan,
  );
  const m = metrics(subs, s.movements, s.period);
  const rows = [
    {
      metric: "Starting MRR",
      value: money(m.start),
      period: s.period,
      plan: s.plan,
    },
    {
      metric: "New",
      value: money(
        m.moves
          .filter((x) => x.kind === "new")
          .reduce((n, x) => n + x.deltaCents, 0),
      ),
      period: s.period,
      plan: s.plan,
    },
    {
      metric: "Expansion",
      value: money(
        m.moves
          .filter((x) => x.kind === "expansion")
          .reduce((n, x) => n + x.deltaCents, 0),
      ),
      period: s.period,
      plan: s.plan,
    },
    {
      metric: "Contraction",
      value: money(
        m.moves
          .filter((x) => x.kind === "contraction")
          .reduce((n, x) => n + x.deltaCents, 0),
      ),
      period: s.period,
      plan: s.plan,
    },
    {
      metric: "Churn",
      value: money(
        m.moves
          .filter((x) => x.kind === "churn")
          .reduce((n, x) => n + x.deltaCents, 0),
      ),
      period: s.period,
      plan: s.plan,
    },
    {
      metric: "Ending MRR",
      value: money(m.end),
      period: s.period,
      plan: s.plan,
    },
    { metric: "ARPA", value: money(m.arpa), period: s.period, plan: s.plan },
    {
      metric: "Gross churn",
      value: m.churn === null ? "N/A" : `${(m.churn * 100).toFixed(2)}%`,
      period: s.period,
      plan: s.plan,
    },
  ];
  const change = (fn: () => typeof s) => {
    try {
      set(fn());
      N("Sample subscription state updated.");
    } catch (e) {
      N((e as Error).message);
    }
  };
  return (
    <Shell
      slug="saas-metrics-kit"
      title="SaaS Metrics Kit"
      subtitle="See the revenue story behind every customer relationship."
      accent="#3b60bd"
      tabs={
        s.presentation
          ? ["Revenue", "Retention", "Unit Economics"]
          : ["Revenue", "Retention", "Recovery", "Unit Economics"]
      }
      view={view}
      onView={V}
      onReset={() => {
        reset();
        S("");
      }}
      actions={
        <>
          <Button variant="secondary" onClick={() => D(true)}>
            Metric definitions
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              set({ ...s, presentation: !s.presentation });
              V("Revenue");
            }}
          >
            {s.presentation ? "Exit presentation" : "Board presentation"}
          </Button>
          <Button onClick={() => csv("saas-metrics", rows)}>
            Export metrics
          </Button>
        </>
      }
    >
      <div className="product-filters">
        <Select
          label="Period"
          value={s.period}
          options={["2026-09", "2026-10"]}
          onChange={(period) => set({ ...s, period })}
        />
        <Select
          label="Plan"
          value={s.plan}
          options={["All", ...Object.keys(plans)]}
          onChange={(plan) => set({ ...s, plan })}
        />
        <Button
          variant="secondary"
          onClick={() => printReport("Recurring revenue board summary", rows)}
        >
          Print summary
        </Button>
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Ending contracted MRR",
            value: money(m.end),
            note: `${s.period} · ${s.plan}`,
          },
          {
            label: "ARPA",
            value: money(m.arpa),
            note: `${m.active} positive-MRR accounts`,
          },
          {
            label: "Gross revenue churn",
            value: m.churn === null ? "N/A" : `${(m.churn * 100).toFixed(2)}%`,
            note: "Contraction + churn / starting MRR",
          },
          {
            label: "Outstanding recovery",
            value: money(
              s.invoices
                .filter(
                  (i) =>
                    i.status !== "paid" &&
                    subs.some((x) => x.id === i.subscriptionId),
                )
                .reduce((n, i) => n + i.amountCents, 0),
            ),
            note: "Cash receivables; separate from MRR",
          },
        ]}
      />
      {view === "Revenue" && (
        <div className="product-stack">
          <Card title="MRR movement bridge">
            <MovementBridge start={m.start} end={m.end} movements={m.moves} />
            <p>
              Opening + signed movements = ending. USD fixture contracts;
              past-due remains in contracted MRR.
            </p>
          </Card>
          <Card title="Account revenue">
            <Table
              caption="Selected subscription revenue at period end"
              heads={["Account", "Plan", "Current status", "MRR", "Cohort", "Inspect"]}
            >
              {subs.map((x) => (
                <tr key={x.id}>
                  <td>{x.account}</td>
                  <td>{x.plan}</td>
                  <td>
                    <Badge
                      status={x.status === "active" ? "success" : "warning"}
                    >
                      {x.status}
                    </Badge>
                  </td>
                  <td>{money(amountAt(x.id, s.period, s.movements))}</td>
                  <td>{x.cohort}</td>
                  <td>
                    {!s.presentation ? (
                      <Button variant="secondary" onClick={() => S(x.id)}>
                        Manage plan
                      </Button>
                    ) : (
                      "Board view"
                    )}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}
      {view === "Retention" && (
        <Card title="Revenue and logo retention cohorts">
          <Table
            caption="Cohort retention with original account denominator"
            heads={[
              "Acquisition cohort",
              "Original accounts",
              "September active",
              "September retained",
              "October active",
              "October retained",
            ]}
          >
            {Array.from(new Set(subs.map((x) => x.cohort)))
              .sort()
              .map((cohort) => {
                const members = subs.filter((x) => x.cohort === cohort);
                return (
                  <tr key={cohort}>
                    <td>{cohort}</td>
                    <td>{members.length}</td>
                    {["2026-09", "2026-10"].flatMap((period) => {
                      const active = members.filter(
                        (x) => amountAt(x.id, period, s.movements) > 0,
                      ).length;
                      return [
                        <td key={period + "n"}>
                          {cohort > period ? "Not started" : active}
                        </td>,
                        <td
                          key={period + "p"}
                          style={{
                            background:
                              "color-mix(in srgb,var(--accent) 10%,var(--surface))",
                          }}
                        >
                          {cohort > period
                            ? "N/A"
                            : `${((active / members.length) * 100).toFixed(1)}%`}
                        </td>,
                      ];
                    })}
                  </tr>
                );
              })}
          </Table>
          <p>
            Denominator is original accounts in selected plan cohort. Churn
            removes a positive-MRR account from the numerator; plan filtering
            uses current plan membership.
          </p>
        </Card>
      )}
      {view === "Recovery" && !s.presentation && (
        <Card title="Payment recovery queue">
          <p>
            Fixture retry behavior: first retry declines; second succeeds.
            Success changes the invoice and account status once, with no MRR
            movement because contracted MRR already includes the contract.
          </p>
          {s.invoices
            .filter((i) => subs.some((x) => x.id === i.subscriptionId))
            .map((i) => (
              <div className="product-record" key={i.id}>
                <div className="product-card-heading">
                  <div>
                    <strong>
                      {
                        s.subscriptions.find((x) => x.id === i.subscriptionId)
                          ?.account
                      }
                    </strong>
                    <p>
                      {money(i.amountCents)} due {i.dueAt} · {i.status} ·{" "}
                      {i.attemptCount} attempts
                    </p>
                  </div>
                  <Button
                    disabled={i.status === "paid"}
                    onClick={() => {
                      change(() => retry(s, i.id));
                      N(
                        i.attemptCount === 0
                          ? "Fixture payment declined; try again to test success."
                          : "Fixture payment recovered. No duplicate MRR added.",
                      );
                    }}
                  >
                    Retry sample payment
                  </Button>
                </div>
                {i.attempts.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </div>
            ))}
        </Card>
      )}
      {view === "Unit Economics" && (
        <div className="product-grid">
          <Card title="Customer acquisition payback">
            <Bars
              rows={subs
                .filter((x) => amountAt(x.id, s.period, s.movements) > 0)
                .map((x) => ({
                  label: x.account,
                  value: Number(
                    (
                      x.acquisitionCostCents /
                      (amountAt(x.id, s.period, s.movements) * 0.8)
                    ).toFixed(2),
                  ),
                }))}
              format={(n) => `${n.toFixed(1)} months`}
            />
            <p>
              Acquisition cost / (ending MRR × assumed 80% gross margin).
              Churned/zero MRR omitted because payback is undefined.
            </p>
          </Card>
          <Card title="Unit economics source">
            <Table
              caption="Fixture acquisition costs and payback inputs"
              heads={["Account", "Acquisition cost", "MRR", "Gross margin"]}
            >
              {subs.map((x) => (
                <tr key={x.id}>
                  <td>{x.account}</td>
                  <td>{money(x.acquisitionCostCents)}</td>
                  <td>{money(amountAt(x.id, s.period, s.movements))}</td>
                  <td>80% fixture assumption</td>
                </tr>
              ))}
            </Table>
            <p>
              Average acquisition cost:{" "}
              {subs.length
                ? money(
                    Math.round(
                      subs.reduce((n, x) => n + x.acquisitionCostCents, 0) /
                        subs.length,
                    ),
                  )
                : "N/A"}
            </p>
          </Card>
        </div>
      )}
      {selected && s.subscriptions.some((x) => x.id === selected) && (
        <Dialog
          title={`Manage ${s.subscriptions.find((x) => x.id === selected)!.account}`}
          onClose={() => S("")}
        >
          <p>
            Changes post expansion/contraction in October 2026, the current
            fixture demo period. Past period views retain their historical
            amounts.
          </p>
          <Select
            label="Subscription plan"
            value={s.subscriptions.find((x) => x.id === selected)!.plan}
            options={Object.keys(plans)}
            onChange={(plan) => change(() => changePlan(s, selected, plan))}
          />
          <p>
            {money(
              s.subscriptions.find((x) => x.id === selected)!.monthlyCents,
            )}{" "}
            per month · {s.subscriptions.find((x) => x.id === selected)!.status}
          </p>
          {s.subscriptions.find((x) => x.id === selected)!.status ===
            "churned" && (
            <Notice>Churned contracts cannot change plans.</Notice>
          )}
        </Dialog>
      )}
      {defs && (
        <Dialog title="Metric definitions" onClose={() => D(false)}>
          {definitions.map((d) => (
            <div className="product-record" key={d.key}>
              <strong>{d.label}</strong>
              <p>{d.formula}</p>
            </div>
          ))}
        </Dialog>
      )}
    </Shell>
  );
}
