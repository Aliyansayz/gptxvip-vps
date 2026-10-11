import { validate } from "./data";
import { Trend } from "./Views";
import { useEffect, useState } from "react";
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
  Empty,
  Bars,
  Notice,
  csv,
  uid,
} from "../shared";
import { seed, type SavedReport } from "./data";
import { filterEvents, unique, funnel, retention } from "./formulas";
import { streamEvent } from "./actions";
export default function App() {
  const {
    state: s,
    setState: set,
    reset,
  } = useDemo("pulse-analytics", seed, validate);
  const [view, V] = useState("Overview");
  const [session, S] = useState("");
  const [steps, Steps] = useState(["Visit", "Signup", "Activate", "Purchase"]);
  const [widgets, W] = useState(["Active users", "Activation trend"]);
  const [name, N] = useState("Weekly product health");
  const [notice, Q] = useState("");
  const [report, R] = useState<SavedReport | null>(null);
  useEffect(() => {
    if (!s.stream) return;
    const timer = setInterval(
      () =>
        set((p) => {const event=streamEvent(p.events);const existing=p.sessions.find(session=>session.id===event.sessionId);return {...p,events:[...p.events,event],sessions:existing?p.sessions.map(session=>session.id===event.sessionId?{...session,path:[...session.path,event.event]}:session):[...p.sessions,{id:event.sessionId,userId:event.userId,startedAt:event.timestamp,platform:event.platform,path:[event.event]}]}}),
      3000,
    );
    return () => clearInterval(timer);
  }, [s.stream, set]);
  const events = filterEvents(s.events, s.channel, s.platform, s.range);
  const users = unique(events),
    activated = unique(events.filter((e) => e.event === "Activate"));
  const counts = funnel(events, steps);
  const daily = Array.from(new Set(events.map((e) => e.timestamp.slice(0, 10))))
    .sort()
    .map((label) => ({
      label,
      value: unique(events.filter((e) => e.timestamp.startsWith(label))),
    }));
  const ret = retention(
    s.cohorts.find((c) => c.startPeriod === s.cohort)!,
    events,
  );
  const rows = events
    .filter((e) => !session || e.sessionId === session)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const exportRows = report
    ? filterEvents(s.events, report.channel, "All", report.range)
    : rows;
  return (
    <Shell
      slug="pulse-analytics"
      title="Pulse Analytics"
      subtitle="Understand the moments that turn visitors into lasting customers."
      accent="#6750ca"
      tabs={["Overview", "Funnels", "Cohorts", "Sessions", "Reports / Builder"]}
      view={view}
      onView={V}
      onReset={() => {
        reset();
        S("");
        R(null);
        Q("");
      }}
      actions={
        <Button onClick={() => csv("pulse-events", exportRows)}>
          Export events
        </Button>
      }
    >
      <div className="product-filters">
        <Select
          label="Channel"
          value={s.channel}
          options={["All", "Organic", "Paid", "Referral"]}
          onChange={(channel) => set({ ...s, channel })}
        />
        <Select
          label="Platform"
          value={s.platform}
          options={["All", "Web", "iOS", "Android"]}
          onChange={(platform) => set({ ...s, platform })}
        />
        <Select
          label="Date range"
          value={s.range}
          options={["All dates", "Oct 1–4", "Oct 5–8"]}
          onChange={(range) => set({ ...s, range })}
        />
        <Button
          variant="secondary"
          onClick={() => set({ ...s, stream: !s.stream })}
        >
          {s.stream ? "Pause" : "Resume"} sample stream
        </Button>
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Active users",
            value: users,
            note: "Unique users in selected events",
          },
          {
            label: "Activation rate",
            value: `${users ? ((activated / users) * 100).toFixed(1) : 0}%`,
            note: `${activated} activated users / ${users} active`,
          },
          {
            label: "Product events",
            value: events.length,
            note: "Sample event records",
          },
          {
            label: "Channels",
            value: new Set(events.map((e) => e.channel)).size,
            note: s.stream
              ? "Simulated stream running"
              : "Simulated stream paused",
          },
        ]}
      />
      {view === "Overview" && (
        <div className="product-grid">
          <Card title="Activation pulse">
            <Trend rows={daily} />
            <p>Unique active users per fixture date.</p>
          </Card>
          <div className="product-stack">
            <Card title="Conversion journey">
              <Bars rows={counts} />
            </Card>
            <Card title="Sample event stream">
              <p>
                Browser simulation · one fixture event every 3 seconds when
                resumed.
              </p>
              {events
                .slice(-5)
                .reverse()
                .map((e) => (
                  <div className="product-record" key={e.id}>
                    <strong>
                      {e.event}{" "}
                      <span className="product-chip">{e.channel}</span>
                    </strong>
                    <small>
                      {e.userId} · {e.platform} · {e.timestamp.slice(11, 16)}
                    </small>
                  </div>
                ))}
            </Card>
          </div>
        </div>
      )}
      {view === "Funnels" && (
        <Card title="Funnel exploration">
          <Select
            label="Conversion endpoint"
            value={steps.at(-1)!}
            options={["Signup", "Activate", "Purchase"]}
            onChange={(v) =>
              Steps([
                "Visit",
                "Signup",
                ...(v !== "Signup" ? ["Activate"] : []),
                ...(v === "Purchase" ? ["Purchase"] : []),
              ])
            }
          />
          <div style={{ marginTop: 24 }}>
            <Bars rows={counts} />
          </div>
          <Table
            caption="Sequential unique user conversion"
            heads={["Step", "Users", "From previous"]}
          >
            {counts.map((r, i) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>{r.value}</td>
                <td>
                  {i && counts[i - 1].value
                    ? `${((r.value / counts[i - 1].value) * 100).toFixed(1)}%`
                    : "100%"}
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {view === "Cohorts" && (
        <Card title="Returning user retention">
          <Select
            label="Cohort start"
            value={s.cohort}
            options={s.cohorts.map((c) => c.startPeriod)}
            onChange={(cohort) => set({ ...s, cohort })}
          />
          <p>
            Daily retention is unique cohort users with any event on each
            fixture date, divided by the full original cohort size.
            Channel/platform/range filter eligible events, never the
            denominator.
          </p>
          <Table
            caption="Daily cohort retention heatmap"
            heads={[
              "Fixture date",
              "Returning users",
              "Original cohort",
              "Retention",
            ]}
          >
            {ret.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>{r.value}</td>
                <td>{r.denominator}</td>
                <td
                  style={{
                    background: `color-mix(in srgb, var(--accent) ${r.denominator ? (r.value / r.denominator) * 35 : 0}%, var(--surface))`,
                  }}
                >
                  {r.denominator
                    ? ((r.value / r.denominator) * 100).toFixed(1)
                    : 0}
                  %
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {view === "Sessions" && (
        <Card title="Session explorer">
          <Table
            caption="Sessions with matching events"
            heads={["Session", "User", "Platform", "Events", "Inspect"]}
          >
            {Array.from(new Set(events.map((e) => e.sessionId))).map((id) => {
              const es = events.filter((e) => e.sessionId === id);
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{es[0].userId}</td>
                  <td>{es[0].platform}</td>
                  <td>{es.length}</td>
                  <td>
                    <Button variant="secondary" onClick={() => S(id)}>
                      View path
                    </Button>
                  </td>
                </tr>
              );
            })}
          </Table>
          {!events.length && <Empty />}
        </Card>
      )}
      {view === "Reports / Builder" && (
        <div className="product-grid equal">
          <Card title="Build your report">
            <Field
              label="Report name"
              value={name}
              onChange={(e) => N(e.target.value)}
            />
            <p>
              Reports save the selected channel, range and named widget
              definitions.
            </p>
            {[
              "Active users",
              "Activation trend",
              "Funnel conversion",
              "Cohort progression",
              "Event volume",
            ].map((w) => (
              <div className="product-record" key={w}>
                <label>
                  <input
                    type="checkbox"
                    style={{ width: 18, minHeight: 18, marginRight: 10 }}
                    checked={widgets.includes(w)}
                    onChange={() =>
                      W(
                        widgets.includes(w)
                          ? widgets.filter((x) => x !== w)
                          : [...widgets, w],
                      )
                    }
                  />
                  {w}
                </label>
              </div>
            ))}
            <Button
              onClick={() => {
                if (!name.trim() || !widgets.length) {
                  Q("Enter a report name and choose at least one widget.");
                  return;
                }
                const next = {
                  id: uid(s.reports, "report"),
                  name: name.trim(),
                  metric: widgets[0],
                  channel: s.channel,
                  range: s.range,
                  widgets,
                };
                set({ ...s, reports: [...s.reports, next] });
                Q("Report saved on this device.");
              }}
            >
              Save report
            </Button>
          </Card>
          <Card title="Saved reports">
            {s.reports.map((r) => (
              <div key={r.id} className="product-record">
                <strong>{r.name}</strong>
                <p>
                  {r.channel} · {r.range} · {r.widgets.join(", ")}
                </p>
                <Button variant="secondary" onClick={() => R(r)}>
                  Open report
                </Button>
              </div>
            ))}
            {!s.reports.length && (
              <Empty>No reports yet. Build your first report.</Empty>
            )}
          </Card>
        </div>
      )}
      {session && (
        <Dialog title={`Session ${session}`} onClose={() => S("")}>
          <ol>
            {rows.map((e) => (
              <li key={e.id}>
                {e.timestamp} · <strong>{e.event}</strong> · {e.channel}
              </li>
            ))}
          </ol>
          <Button onClick={() => csv(session, rows)}>
            Export this session
          </Button>
        </Dialog>
      )}
      {report && (
        <Dialog title={report.name} onClose={() => R(null)}>
          <p>
            {report.channel} · {report.range}
          </p>
          {report.widgets.map((w) => (
            <Card key={w} title={w}>
              <strong>
                {w === "Active users"
                  ? unique(exportRows)
                  : w === "Event volume"
                    ? exportRows.length
                    : w === "Funnel conversion"
                      ? `${funnel(exportRows,["Visit","Signup","Activate","Purchase"])[3].value} sequential purchasers`
                      : w === "Activation trend"
                        ? `${unique(exportRows.filter((e) => e.event === "Activate"))} activations`
                        : `${retention(s.cohorts[0], exportRows)[2].value} / ${s.cohorts[0].userIds.length} cohort users returned on ${retention(s.cohorts[0], exportRows)[2].label}`}
              </strong>
            </Card>
          ))}
          <Button onClick={() => csv(report.name, exportRows)}>
            Export report events
          </Button>
        </Dialog>
      )}
    </Shell>
  );
}
