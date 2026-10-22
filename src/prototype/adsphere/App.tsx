import { useState } from "react";
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
  Badge,
  Bars,
  csv,
  printReport,
  Notice,
  Empty,
  money,
  AreaTrendChart,
  CustomerDistributionMap,
} from "../shared";
import { validate, seed, type Campaign, type Creative } from "./data";
import { campaignTotals, allocations, inRange } from "./formulas";
import { updateCampaign } from "./actions";
import { CreativeArt } from "./Views";
export default function App() {
  const { state, setState, reset } = useDemo("adsphere", seed, validate);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Campaign | null>(null);
  const [budget, setBudget] = useState("");
  const [review, setReview] = useState<Creative | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const update = (patch: Partial<typeof state>) =>
    setState((s) => ({ ...s, ...patch }));
  const campaigns = state.campaigns.filter(
    (c) =>
      (state.channel === "All" || c.channel === state.channel) &&
      (state.status === "All" || c.status === state.status) &&
      c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const rows = state.performance.filter(
    (p) =>
      campaigns.some((c) => c.id === p.campaignId) &&
      inRange(p.date, state.range),
  );
  const totals = campaigns.map((c) => ({
    c,
    ...campaignTotals(
      c,
      rows.filter((p) => p.campaignId === c.id),
    ),
  }));
  const digest = totals.map((t) => ({
    campaign: t.c.name,
    channel: t.c.channel,
    status: t.c.status,
    range: state.range,
    budget: money(t.c.budgetCents),
    spend: money(t.spend),
    conversions: t.conversions,
    pacing: `${(t.pacing * 100).toFixed(1)}%`,
    elapsed: `${(t.elapsed * 100).toFixed(1)}%`,
  }));
  const attr = allocations(
    state.conversions.filter((c) => inRange(c.date, state.range)),
    state.mode,
  );
  const channels = Object.keys(attr).filter(
    (c) => state.channel === "All" || c === state.channel,
  );
  const spend = rows.reduce((s, r) => s + r.spendCents, 0);
  const mutateCampaign = (id: string, patch: Partial<Campaign>) =>
    setState((s) => updateCampaign(s, id, patch));
  return (
    <Shell
      slug="adsphere"
      title="AdSphere"
      subtitle="Campaign control, creative reviews and clear attribution."
      accent="#3157be"
      tabs={["Campaigns", "Creatives", "Pacing", "Attribution / Digest"]}
      view={state.view}
      onView={(v) => update({ view: v })}
      onReset={() => {
        reset();
        setSelected(null);
        setReview(null);
        setSearch("");
        setNotice("");
      }}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => csv("adsphere-digest", digest)}
          >
            Export digest
          </Button>
          <Button
            onClick={() =>
              printReport("AdSphere · selected campaign digest", digest)
            }
          >
            Print digest
          </Button>
        </>
      }
    >
      <div className="product-filters">
        <Field
          label="Search campaigns"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Channel"
          value={state.channel}
          onChange={(channel) => update({ channel })}
          options={["All", "Search", "Social", "Display"]}
        />
        <Select
          label="Date range"
          value={state.range}
          onChange={(range) => update({ range })}
          options={["Full month", "First week"]}
        />
        <Select
          label="Status"
          value={state.status}
          onChange={(status) => update({ status })}
          options={["All", "active", "paused"]}
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Selected spend",
            value: money(spend),
            note: "Sample account · USD",
            comparison: "+8.9% spend efficiency",
            change: { value: "+8.90%", positive: true },
            sparkline: [22, 28, 25, 34, 38, 45, 42],
            sparklineColor: "#3157be",
          },
          {
            label: "Conversions",
            value: rows.reduce((s, r) => s + r.conversions, 0),
            comparison: "Target 120% pacing",
            change: { value: "+14.2%", positive: true },
            sparkline: [14, 18, 16, 25, 22, 30, 28],
            sparklineColor: "#10b981",
          },
          {
            label: "Active campaigns",
            value: campaigns.filter((c) => c.status === "active").length,
            comparison: "All channels optimized",
            change: { value: "Active", positive: true },
            sparkline: [4, 5, 5, 6, 6, 6, 6],
            sparklineColor: "#3157be",
          },
          {
            label: "Selected budget",
            value: money(campaigns.reduce((s, c) => s + c.budgetCents, 0)),
            comparison: "Pacing within threshold",
            change: { value: "Nominal", positive: true },
            sparkline: [30, 32, 35, 38, 40, 42, 45],
            sparklineColor: "#3b82f6",
          },
        ]}
      />

      {/* Visual Chart View matching reference aesthetic */}
      <div className="product-grid" style={{ marginBottom: "20px" }}>
        <AreaTrendChart
          title="Campaign Spend & Attributed Revenue"
          data={[
            { label: "Mon", v1: 3.2, v2: 2.1 },
            { label: "Tue", v1: 5.6, v2: 3.8 },
            { label: "Wed", v1: 4.8, v2: 3.4 },
            { label: "Thu", v1: 7.2, v2: 5.1 },
            { label: "Fri", v1: 8.87, v2: 6.4 },
            { label: "Sat", v1: 5.8, v2: 4.2 },
            { label: "Sun", v1: 7.4, v2: 5.5 },
          ]}
          series={[
            { key: "v1", label: "Ad Spend ($k)", color: "#3157be" },
            { key: "v2", label: "Attributed Revenue ($k)", color: "#93c5fd" },
          ]}
          yLabels={["$10k", "$8k", "$6k", "$4k", "$2k"]}
          activeTooltip={{ label: "Fri", value: "$8,870.00" }}
        />
        <CustomerDistributionMap
          title="Channel Conversion Reach"
          items={[
            { country: "Search Ads", value: "3,890", flag: "🔍", percent: 85 },
            { country: "Social Video", value: "2,640", flag: "📱", percent: 62 },
            { country: "Display Retargeting", value: "1,980", flag: "🎯", percent: 48 },
            { country: "Email Campaigns", value: "1,450", flag: "✉️", percent: 36 },
            { country: "Affiliate Referral", value: "980", flag: "🤝", percent: 24 },
          ]}
        />
      </div>

      {state.view === "Campaigns" && (
        <div className="product-stack">
          <Card
            title="Your campaigns"
            aside={
              <span className="product-chip">No connected ad accounts</span>
            }
          >
            <Table
              caption="Filtered sample campaign performance"
              heads={[
                "Campaign",
                "Channel",
                "Status",
                "Spend / budget",
                "Conversions",
                "Control",
              ]}
            >
              {totals.map((t) => (
                <tr key={t.c.id}>
                  <td>
                    <button
                      className="product-link"
                      onClick={() => {
                        setSelected(t.c);
                        setBudget(String(t.c.budgetCents / 100));
                        setError("");
                      }}
                    >
                      {t.c.name}
                    </button>
                  </td>
                  <td>{t.c.channel}</td>
                  <td>
                    <Badge>{t.c.status}</Badge>
                  </td>
                  <td>
                    {money(t.spend)} / {money(t.c.budgetCents)}
                  </td>
                  <td>{t.conversions}</td>
                  <td>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        mutateCampaign(t.c.id, {
                          status: t.c.status === "active" ? "paused" : "active",
                        });
                        setNotice(
                          `${t.c.name} ${t.c.status === "active" ? "paused" : "resumed"} in this demo`,
                        );
                      }}
                    >
                      {t.c.status === "active" ? "Pause" : "Resume"}
                    </Button>
                  </td>
                </tr>
              ))}
            </Table>
            {!totals.length && <Empty />}
          </Card>
          <Card title="Pacing at a glance">
            <Bars
              rows={totals.map((t) => ({
                label: t.c.name,
                value: t.pacing * 100,
              }))}
              format={(n) => `${n.toFixed(1)}% of budget`}
            />
          </Card>
        </div>
      )}
      {state.view === "Creatives" && (
        <div className="product-grid equal">
          {state.creatives
            .filter((c) => campaigns.some((p) => p.id === c.campaignId))
            .map((c) => (
              <div key={c.id}>
                <CreativeArt creative={c} />
                <Button
                  variant="secondary"
                  onClick={() => {
                    setReview(c);
                    setNote(c.reviewNote);
                    setError("");
                  }}
                >
                  Review {c.format}
                </Button>
              </div>
            ))}
        </div>
      )}
      {state.view === "Pacing" && (
        <Card title="Spend against the calendar">
          <p>
            Elapsed comparison is the inclusive campaign period through the
            latest selected performance date. Pausing keeps historical sample
            spend.
          </p>
          <Table
            caption="Pacing and elapsed-period comparison"
            heads={[
              "Campaign",
              "Spend pacing",
              "Elapsed campaign",
              "Assessment",
              "Budget",
            ]}
          >
            {totals.map((t) => (
              <tr key={t.c.id}>
                <td>{t.c.name}</td>
                <td>{(t.pacing * 100).toFixed(1)}%</td>
                <td>{(t.elapsed * 100).toFixed(1)}%</td>
                <td>
                  <Badge
                    status={t.pacing > t.elapsed * 1.15 ? "warning" : "success"}
                  >
                    {t.pacing > t.elapsed * 1.15
                      ? "Ahead of time"
                      : "Within pace"}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelected(t.c);
                      setBudget(String(t.c.budgetCents / 100));
                      setError("");
                    }}
                  >
                    Edit budget
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
      {state.view === "Attribution / Digest" && (
        <div className="product-grid equal">
          <Card title="Where conversion value lands">
            <Select
              label="Attribution model"
              value={state.mode}
              onChange={(mode) => update({ mode })}
              options={["First touch", "Last touch", "Linear"]}
            />
            <Bars
              rows={channels.map((c) => ({ label: c, value: attr[c] }))}
              format={money}
            />
            <p>
              Linear distributes each conversion equally across its recorded
              channels. Total attributed value:{" "}
              {money(Object.values(attr).reduce((a, b) => a + b, 0))}.
            </p>
          </Card>
          <Card title="Channel economics">
            <Table
              caption="Attributed sample revenue divided by selected channel spend"
              heads={["Channel", "Allocated value", "Sample spend", "ROAS"]}
            >
              {channels.map((c) => {
                const s = state.performance
                  .filter(
                    (r) =>
                      inRange(r.date, state.range) &&
                      state.campaigns.find((p) => p.id === r.campaignId)
                        ?.channel === c,
                  )
                  .reduce((a, r) => a + r.spendCents, 0);
                return (
                  <tr key={c}>
                    <td>{c}</td>
                    <td>{money(attr[c])}</td>
                    <td>{money(s)}</td>
                    <td>{s ? (attr[c] / s).toFixed(2) + "×" : "No spend"}</td>
                  </tr>
                );
              })}
            </Table>
            <p>
              Attribution uses channel and date context across all campaigns,
              including paused history. Campaign search and status apply only to
              the campaign digest. Digest export contains the selected campaign
              records.
            </p>
          </Card>
        </div>
      )}
      {selected && (
        <Dialog
          title={`${selected.name} · budget settings`}
          onClose={() => setSelected(null)}
        >
          <p>
            {selected.channel} · October 1–31, 2026 · historical sample
            performance remains when paused.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = Number(budget);
              if (!Number.isFinite(n) || n <= 0) {
                setError("Budget must be a positive USD amount.");
                return;
              }
              mutateCampaign(selected.id, { budgetCents: Math.round(n * 100) });
              setSelected(null);
              setNotice("Campaign budget saved; pacing recalculated.");
            }}
          >
            <Field
              label="Campaign budget (USD)"
              type="number"
              step="0.01"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              error={error}
            />
            <Button type="submit">Save budget</Button>
          </form>
        </Dialog>
      )}
      {review && (
        <Dialog
          title={`Review ${review.title}`}
          onClose={() => setReview(null)}
        >
          <Field
            label="Review note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            error={error}
          />
          <div className="product-actions">
            {(["approved", "changes requested"] as const).map((status) => (
              <Button
                key={status}
                onClick={() => {
                  if (status === "changes requested" && !note.trim()) {
                    setError("Explain the requested changes.");
                    return;
                  }
                  setState((s) => ({
                    ...s,
                    creatives: s.creatives.map((c) =>
                      c.id === review.id
                        ? {
                            ...c,
                            reviewStatus: status,
                            reviewNote: note.trim(),
                          }
                        : c,
                    ),
                  }));
                  setReview(null);
                  setNotice("Creative review saved.");
                }}
              >
                {status === "approved" ? "Approve" : "Request changes"}
              </Button>
            ))}
          </div>
        </Dialog>
      )}
    </Shell>
  );
}
