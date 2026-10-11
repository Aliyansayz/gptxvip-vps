import { useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Select,
  Table,
  Field,
  Button,
  Badge,
  csv,
  Notice,
  Empty,
  uid,
} from "../shared";
import { validate, seed, allowed } from "./data";
import { scopedUsage, metricTotal, embedUrl, validAccent } from "./formulas";
import { replaceBoardWidgets } from "./actions";
import { WidgetView } from "./Views";
export default function App() {
  const { state, setState, reset } = useDemo("insight-boards", seed, validate);
  const query = new URLSearchParams(window.location.search);
  const embedded = query.get("embed") === "1";
  const [tenantId, setTenantId] = useState(() =>
    state.tenants.some((t) => t.id === query.get("tenant"))
      ? query.get("tenant")!
      : state.tenantId,
  );
  const [role, setRole] = useState(() =>
    query.get("role") === "Member"
      ? "Member"
      : query.get("role") === "Admin"
        ? "Admin"
        : state.role,
  );
  const [title, setTitle] = useState("");
  const [accent, setAccent] = useState("");
  const [inspecting, setInspecting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [widget, setWidget] = useState("sessions");
  const [cadence, setCadence] = useState("Weekly");
  const tenant =
    state.tenants.find((t) => t.id === tenantId) || state.tenants[0];
  const board = state.boards.find((b) => b.tenantId === tenant.id)!;
  const rows = scopedUsage(state.usage, tenant.id, role);
  const visibleWidgets = board.widgetIds
    .map((id) => state.widgets.find((w) => w.id === id)!)
    .filter((w) => w && allowed(role).includes(w.metric));
  const url = embedUrl(window.location.origin, tenant.id, role);
  const code = `<iframe src="${url}" title="${tenant.name.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")} analytics" width="100%" height="720" style="border:0"></iframe>`;
  const exportRows = rows.map((r) => ({
    tenant: tenant.name,
    role,
    date: r.date,
    metric: r.metric,
    value: r.value,
  }));
  const mutateBoard = (widgetIds: string[]) =>
    setState((s) => replaceBoardWidgets(s, board.id, widgetIds));
  const canvas = (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 15,
          marginBottom: 24,
        }}
      >
        <div>
          <p style={{ color: "var(--muted)", margin: 0 }}>
            {tenant.logoText} / {tenant.name}
          </p>
          <h2 style={{ fontSize: 26, margin: "5px 0" }}>{board.title}</h2>
        </div>
        <Badge>{role} preview</Badge>
      </div>
      <div className="product-grid equal">
        {visibleWidgets.map((w) => (
          <div key={w.id} className="product-stack">
            <WidgetView widget={w} rows={rows} />
            {!embedded && (
              <div className="product-actions">
                <Button
                  variant="secondary"
                  disabled={board.widgetIds.indexOf(w.id) === 0}
                  onClick={() => {
                    const ids = [...board.widgetIds];
                    const i = ids.indexOf(w.id);
                    [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]];
                    mutateBoard(ids);
                  }}
                >
                  Move earlier
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    mutateBoard(board.widgetIds.filter((id) => id !== w.id))
                  }
                >
                  Remove widget
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!visibleWidgets.length && (
        <Empty>
          No widgets visible for this tenant and role. Add an allowed widget in
          the studio.
        </Empty>
      )}
      {board.widgetIds.some(
        (id) => !visibleWidgets.some((w) => w.id === id),
      ) && (
        <Notice>
          Restricted widgets are hidden in Member preview, including exports.
        </Notice>
      )}
    </>
  );
  if (embedded)
    return (
      <div
        className="product-workspace"
        data-prototype="insight-boards"
        data-theme="light"
        style={{ "--accent": tenant.accent } as React.CSSProperties}
      >
        <main className="product-main">
          <div className="product-content">
            <p className="product-kicker">EMBEDDED FICTIONAL BROWSER DEMO</p>
            {canvas}
            <p>
              Client-side sample access simulation · {tenant.name} only · no
              secure row-level enforcement.
            </p>
          </div>
        </main>
      </div>
    );
  return (
    <Shell
      slug="insight-boards"
      title="Insight Boards"
      subtitle="Build branded analytics boards for each customer workspace."
      accent={tenant.accent}
      tabs={["Board", "Tenants / Usage", "Embed", "Reports / Access"]}
      view={state.view}
      onView={(view) => setState((s) => ({ ...s, view }))}
      onReset={() => {
        reset();
        setTenantId(seed.tenantId);
        setRole(seed.role);
        setInspecting(false);
      }}
      actions={
        <Button
          variant="secondary"
          onClick={() =>
            csv(`insight-${tenant.id}-${role.toLowerCase()}`, exportRows)
          }
        >
          Export tenant report
        </Button>
      }
    >
      <div className="product-filters">
        <Select
          label="Tenant"
          value={tenant.id}
          onChange={(id) => {
            setTenantId(id);
            setState((s) => ({ ...s, tenantId: id }));
            setInspecting(false);
            setNotice("");
          }}
          options={state.tenants.map((t) => ({ value: t.id, label: t.name }))}
        />
        <Select
          label="Sample access role"
          value={role}
          onChange={(v) => {
            setRole(v);
            setState((s) => ({ ...s, role: v }));
          }}
          options={["Admin", "Member"]}
        />
        <span
          className="product-chip"
          style={{ borderLeft: `4px solid ${tenant.accent}` }}
        >
          {tenant.logoText} · {tenant.name}
        </span>
      </div>
      <Notice>Fictional demo · sample access rules</Notice>
      {notice && <Notice>{notice}</Notice>}
      {state.view === "Board" && (
        <>
          <Card title="Board tools">
            <div className="product-filters">
              <Select
                label="Available widget"
                value={allowed(role).includes(widget) ? widget : "sessions"}
                onChange={setWidget}
                options={state.widgets
                  .filter((w) => allowed(role).includes(w.metric))
                  .map((w) => ({ value: w.id, label: w.title }))}
              />
              <Button
                disabled={board.widgetIds.includes(
                  allowed(role).includes(widget) ? widget : "sessions",
                )}
                onClick={() =>
                  mutateBoard([
                    ...board.widgetIds,
                    allowed(role).includes(widget) ? widget : "sessions",
                  ])
                }
              >
                Add widget
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setInspecting(true);
                  setTitle(board.title);
                  setAccent(tenant.accent);
                  setError("");
                }}
              >
                Edit title and accent
              </Button>
            </div>
          </Card>
          <div style={{ marginTop: 24 }}>{canvas}</div>
        </>
      )}
      {state.view === "Tenants / Usage" && (
        <div className="product-grid">
          <Card title={`${tenant.name} usage records`}>
            <Table
              caption="Only selected tenant and allowed role metrics"
              heads={["Date", "Metric", "Value"]}
            >
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.metric}</td>
                  <td>
                    {r.metric === "revenue"
                      ? `$${r.value.toLocaleString()}`
                      : r.value}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
          <Card title="Tenant summary">
            {allowed(role).map((metric) => (
              <div className="product-record" key={metric}>
                <strong>{metric}</strong>
                <p>
                  {metric === "revenue" ? "$" : ""}
                  {metricTotal(rows, metric).toLocaleString()}
                </p>
              </div>
            ))}
            <p>
              Brand accent: {tenant.accent} · Board: {board.title}
            </p>
          </Card>
        </div>
      )}
      {state.view === "Embed" && (
        <div className="product-stack">
          <Card title="Working iframe code">
            <p>
              This route reads tenant, role and embed query parameters. Embedded
              mode contains the board only and cannot recursively create an
              iframe.
            </p>
            <label>
              Copyable iframe markup
              <textarea value={code} readOnly style={{ minHeight: 100 }} />
            </label>
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setNotice("Iframe code copied.");
                } catch {
                  setNotice(
                    "Clipboard unavailable. Select and copy the code above.",
                  );
                }
              }}
            >
              Copy iframe code
            </Button>
            <p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent-text)" }}
              >
                Open {tenant.name} embed route
              </a>
            </p>
          </Card>
          <Card title={`${tenant.name} · ${role} embed preview`}>
            <iframe
              key={url}
              title={`${tenant.name} embedded board preview`}
              src={url}
              style={{
                width: "100%",
                height: 720,
                border: "1px solid var(--line)",
                borderRadius: 10,
              }}
            />
          </Card>
        </div>
      )}
      {state.view === "Reports / Access" && (
        <div className="product-grid equal">
          <Card title="Sample access boundary">
            <p>
              {role} can view: {allowed(role).join(", ")}.
            </p>
            <p>
              {role === "Member"
                ? "Revenue is excluded from board, table, report CSV and iframe."
                : "Admin preview includes sample revenue records."}
            </p>
            <p>
              These are client-side display rules for fictional data, not
              production security.
            </p>
            <Button
              onClick={() =>
                csv(`insight-${tenant.id}-${role.toLowerCase()}`, exportRows)
              }
            >
              Export allowed report
            </Button>
          </Card>
          <Card title="Browser report schedules">
            <div className="product-filters">
              <Select
                label="Cadence"
                value={cadence}
                onChange={setCadence}
                options={["Weekly", "Monthly"]}
              />
              <Button
                onClick={() =>
                  setState((s) => ({
                    ...s,
                    schedules: [
                      ...s.schedules,
                      {
                        id: uid(s.schedules, "schedule"),
                        tenantId: tenant.id,
                        reportId: board.id,
                        cadence,
                        enabled: true,
                      },
                    ],
                  }))
                }
              >
                Add demo schedule
              </Button>
            </div>
            {state.schedules
              .filter((s) => s.tenantId === tenant.id)
              .map((s) => (
                <div className="product-record" key={s.id}>
                  <strong>
                    {s.cadence} · {s.enabled ? "Enabled" : "Paused"}
                  </strong>
                  <p>
                    Sample next run:{" "}
                    {s.cadence === "Weekly" ? "October 12" : "November 1"},
                    2026. Browser record only; no email is sent.
                  </p>
                  <div className="product-actions">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setState((st) => ({
                          ...st,
                          schedules: st.schedules.map((r) =>
                            r.id === s.id ? { ...r, enabled: !r.enabled } : r,
                          ),
                        }))
                      }
                    >
                      {s.enabled ? "Pause schedule" : "Enable schedule"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setState((st) => ({
                          ...st,
                          schedules: st.schedules.filter((r) => r.id !== s.id),
                        }))
                      }
                    >
                      Delete schedule
                    </Button>
                  </div>
                </div>
              ))}
            {!state.schedules.some((s) => s.tenantId === tenant.id) && (
              <Empty>No schedules for this tenant.</Empty>
            )}
          </Card>
        </div>
      )}
      {inspecting && (
        <Card title="Brand inspector">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !validAccent(accent)) {
                setError(
                  "Use a board title and a dark enough six-digit hex accent (4.5:1 contrast with white).",
                );
                return;
              }
              setState((s) => ({
                ...s,
                tenants: s.tenants.map((t) =>
                  t.id === tenant.id ? { ...t, accent } : t,
                ),
                boards: s.boards.map((b) =>
                  b.id === board.id ? { ...b, title: title.trim() } : b,
                ),
              }));
              setInspecting(false);
              setNotice("Tenant title and accent saved.");
            }}
            className="product-stack"
          >
            <Field
              label="Board title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Field
              label="Accent color"
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
            />
            {error && (
              <p role="alert" className="product-error">
                {error}
              </p>
            )}
            <div className="product-actions">
              <Button type="submit">Save tenant brand</Button>
              <Button variant="secondary" onClick={() => setInspecting(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </Shell>
  );
}
