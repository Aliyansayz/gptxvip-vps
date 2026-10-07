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
  Notice,
  Empty,
  Bars,
  csv,
  money,
  uid,
} from "../shared";
import { seed, stages, probabilities, type Deal } from "./data";
import { forecast, openDeals } from "./formulas";
import { stageMove, saveDeal, merge } from "./actions";
const blank = {
  title: "",
  companyId: "co1",
  contactId: "contact-1",
  valueCents: 100000,
  stage: "qualify",
  ownerId: "Jordan",
  probability: 0.15,
  expectedClose: "2026-10-20",
  nextAction: "Book discovery call",
};
export default function App() {
  const {
    state: s,
    setState: set,
    reset,
  } = useDemo("orbit-crm", seed, validate);
  const [view, V] = useState("Pipeline");
  const [query, Q] = useState("");
  const [selected, S] = useState("");
  const [editing, E] = useState<null | { id?: string; data: Omit<Deal, "id"> }>(
    null,
  );
  const [note, N] = useState("");
  const [next, Next] = useState("");
  const [mergeOpen, MO] = useState(false);
  const [keep, K] = useState("contact-1");
  const [source, Src] = useState("contact-2");
  const [notice, M] = useState("");
  const deals = s.deals.filter(
    (d) =>
      (s.owner === "All" || d.ownerId === s.owner) &&
      (s.period === "All periods" || d.expectedClose.startsWith(s.period)) &&
      (d.title.toLowerCase().includes(query.toLowerCase()) ||
        s.companies
          .find((c) => c.id === d.companyId)
          ?.name.toLowerCase()
          .includes(query.toLowerCase())),
  );
  const f = forecast(deals);
  const deal = s.deals.find((d) => d.id === selected);
  const mutate = (fn: () => typeof s) => {
    try {
      set(fn());
      M("Workspace updated on this device.");
    } catch (e) {
      M((e as Error).message);
    }
  };
  return (
    <Shell
      slug="orbit-crm"
      title="Orbit CRM"
      subtitle="Keep relationships moving, with the next conversation always in view."
      accent="#9b5d30"
      tabs={["Pipeline", "Contacts / Companies", "Forecast", "Activity"]}
      view={view}
      onView={V}
      onReset={() => {
        reset();
        S("");
        E(null);
      }}
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() =>
              csv(
                "orbit-deals",
                deals.map((d) => ({
                  ...d,
                  value: money(d.valueCents),
                  weightedValue: money(
                    Math.round(d.valueCents * d.probability),
                  ),
                })),
              )
            }
          >
            Export deals
          </Button>
          <Button onClick={() => E({ data: blank })}>New deal</Button>
        </>
      }
    >
      <div className="product-filters">
        <Field
          label="Search deals or companies"
          value={query}
          onChange={(e) => Q(e.target.value)}
        />
        <Select
          label="Owner"
          value={s.owner}
          options={["All", "Jordan", "Jamie"]}
          onChange={(owner) => set({ ...s, owner })}
        />
        <Select
          label="Expected close"
          value={s.period}
          options={[
            { value: "All periods", label: "All periods" },
            { value: "2026-10", label: "October 2026" },
            { value: "2026-11", label: "November 2026" },
          ]}
          onChange={(period) => set({ ...s, period })}
        />
      </div>
      {notice && <Notice>{notice}</Notice>}
      <Kpis
        items={[
          {
            label: "Open pipeline",
            value: money(f.raw),
            note: `${openDeals(deals).length} active relationships`,
          },
          {
            label: "Weighted forecast",
            value: money(f.weighted),
            note: "Open value × stage probability",
          },
          {
            label: "Closed won",
            value: money(f.won),
            note: "Recognized separately from open forecast",
          },
          {
            label: "Next actions",
            value: openDeals(deals).filter((d) => d.nextAction).length,
            note: "Owner and close-period filters applied",
          },
        ]}
      />
      {view === "Pipeline" && (
        <div className="product-board">
          {stages.map((stage) => (
            <section className="product-lane" key={stage}>
              <h2 style={{ textTransform: "capitalize" }}>
                {stage} · {deals.filter((d) => d.stage === stage).length}
              </h2>
              <p>
                {money(
                  deals
                    .filter((d) => d.stage === stage)
                    .reduce((n, d) => n + d.valueCents, 0),
                )}
              </p>
              {deals
                .filter((d) => d.stage === stage)
                .map((d) => (
                  <Card key={d.id}>
                    <button
                      className="product-link"
                      onClick={() => {
                        S(d.id);
                        Next(d.nextAction);
                      }}
                    >
                      {d.title}
                    </button>
                    <p>{s.companies.find((c) => c.id === d.companyId)?.name}</p>
                    <strong>{money(d.valueCents)}</strong>
                    <p>
                      {d.ownerId} · {d.expectedClose}
                    </p>
                    <p className="product-chip">{d.nextAction}</p>
                    <Select
                      label={`Stage for ${d.title}`}
                      value={d.stage}
                      options={stages}
                      onChange={(v) => mutate(() => stageMove(s, d.id, v))}
                    />
                  </Card>
                ))}
            </section>
          ))}
        </div>
      )}
      {view === "Contacts / Companies" && (
        <div className="product-grid">
          <Card
            title="Contact directory"
            aside={
              <Button variant="secondary" onClick={() => MO(true)}>
                Review duplicates
              </Button>
            }
          >
            <Table
              caption="Fictional linked contacts"
              heads={["Contact", "Email", "Company", "Linked deals"]}
            >
              {s.contacts
                .filter(
                  (c) =>
                    s.owner === "All" ||
                    deals.some((d) => d.contactId === c.id),
                )
                .map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>
                      {s.companies.find((x) => x.id === c.companyId)?.name}
                    </td>
                    <td>{deals.filter((d) => d.contactId === c.id).length}</td>
                  </tr>
                ))}
            </Table>
          </Card>
          <Card title="Companies">
            {s.companies
              .filter(
                (c) =>
                  s.owner === "All" || deals.some((d) => d.companyId === c.id),
              )
              .map((c) => (
                <div key={c.id} className="product-record">
                  <strong>{c.name}</strong>
                  <p>
                    {c.industry} ·{" "}
                    {deals.filter((d) => d.companyId === c.id).length} deals
                  </p>
                  {deals
                    .filter((d) => d.companyId === c.id)
                    .map((d) => (
                      <p key={d.id}>
                        <button
                          className="product-link"
                          onClick={() => {
                            S(d.id);
                            Next(d.nextAction);
                          }}
                        >
                          {d.title}
                        </button>
                      </p>
                    ))}
                </div>
              ))}
          </Card>
        </div>
      )}
      {view === "Forecast" && (
        <div className="product-grid">
          <Card title="Probability-weighted forecast">
            <Bars
              rows={openDeals(deals).map((d) => ({
                label: d.title,
                value: Math.round(d.valueCents * d.probability),
              }))}
              format={money}
            />
            <p>
              Won deals count only in closed won; lost deals have zero
              probability and are excluded from open forecast.
            </p>
          </Card>
          <Card title="Forecast source values">
            <Table
              caption="Open opportunity arithmetic"
              heads={["Deal", "Raw value", "Probability", "Weighted"]}
            >
              {openDeals(deals).map((d) => (
                <tr key={d.id}>
                  <td>{d.title}</td>
                  <td>{money(d.valueCents)}</td>
                  <td>{d.probability * 100}%</td>
                  <td>{money(Math.round(d.valueCents * d.probability))}</td>
                </tr>
              ))}
            </Table>
            <p>
              Stage defaults: qualify 15%, discovery 40%, proposal 70%, won
              100%, lost 0%.
            </p>
          </Card>
        </div>
      )}
      {view === "Activity" && (
        <Card title="Relationship activity">
          {s.activities
            .filter((a) => deals.some((d) => d.id === a.dealId))
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((a) => (
              <div className="product-record" key={a.id}>
                <strong>
                  {s.deals.find((d) => d.id === a.dealId)?.title} · {a.kind}
                </strong>
                <p>{a.note}</p>
                <small>
                  {a.date} · {a.ownerId}
                </small>
              </div>
            ))}
          {!s.activities.filter((a) => deals.some((d) => d.id === a.dealId))
            .length && <Empty>No activity in this filtered pipeline.</Empty>}
        </Card>
      )}
      {deal && (
        <Dialog title={deal.title} onClose={() => S("")}>
          <p>
            {s.companies.find((c) => c.id === deal.companyId)?.name} ·{" "}
            {s.contacts.find((c) => c.id === deal.contactId)?.name}
          </p>
          <p>
            {s.contacts.find((c) => c.id === deal.contactId)?.email} · Owner:{" "}
            {deal.ownerId}
          </p>
          <h3>
            {money(deal.valueCents)} · {(deal.probability * 100).toFixed(0)}%
            probability
          </h3>
          <Select
            label="Deal stage"
            value={deal.stage}
            options={stages}
            onChange={(stage) => mutate(() => stageMove(s, deal.id, stage))}
          />
          <Button
            variant="secondary"
            onClick={() => {
              E({ id: deal.id, data: { ...deal } });
              S("");
            }}
          >
            Edit deal
          </Button>
          <h3>Next action</h3>
          {notice&&<Notice>{notice}</Notice>}
<form
            onSubmit={(e) => {
              e.preventDefault();
              if (!next.trim()) {
                M("Next action is required.");
                return;
              }
              set({
                ...s,
                deals: s.deals.map((d) =>
                  d.id === deal.id ? { ...d, nextAction: next.trim() } : d,
                ),
                activities: [
                  ...s.activities,
                  {
                    id: uid(s.activities, "activity"),
                    dealId: deal.id,
                    kind: "next action",
                    note: next.trim(),
                    date: "2026-10-08",
                    ownerId: deal.ownerId,
                  },
                ],
              });
              M("Next action updated.");
            }}
          >
            <Field
              label="Next action"
              required
              value={next}
              onChange={(e) => Next(e.target.value)}
            />
            <Button type="submit">Save next action</Button>
          </form>
          <h3>Chronological notes</h3>
          {s.activities
            .filter((a) => a.dealId === deal.id)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((a) => (
              <p key={a.id}>
                {a.date} · {a.note}
              </p>
            ))}
          {notice&&<Notice>{notice}</Notice>}
<form
            onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              set({
                ...s,
                activities: [
                  ...s.activities,
                  {
                    id: uid(s.activities, "activity"),
                    dealId: deal.id,
                    kind: "note",
                    note: note.trim(),
                    date: "2026-10-08",
                    ownerId: deal.ownerId,
                  },
                ],
              });
              N("");
              M("Note saved.");
            }}
          >
            <Field
              label="New relationship note"
              required
              value={note}
              onChange={(e) => N(e.target.value)}
            />
            <Button type="submit">Add note</Button>
          </form>
        </Dialog>
      )}
      {editing && (
        <Dialog
          title={editing.id ? "Edit deal" : "Create deal"}
          onClose={() => E(null)}
        >
          {notice&&<Notice>{notice}</Notice>}
<form
            onSubmit={(e) => {
              e.preventDefault();
              try {
                set(saveDeal(s, editing.data, editing.id));
                E(null);
                M("Deal saved.");
              } catch (e) {
                M((e as Error).message);
              }
            }}
          >
            <Field
              label="Deal title"
              required
              value={editing.data.title}
              onChange={(e) =>
                E({
                  ...editing,
                  data: { ...editing.data, title: e.target.value },
                })
              }
            />
            <Select
              label="Company"
              value={editing.data.companyId}
              options={s.companies.map((c) => ({ value: c.id, label: c.name }))}
              onChange={(companyId) =>
                E({
                  ...editing,
                  data: {
                    ...editing.data,
                    companyId,
                    contactId: s.contacts.find(
                      (c) => c.companyId === companyId,
                    )!.id,
                  },
                })
              }
            />
            <Select
              label="Contact"
              value={editing.data.contactId}
              options={s.contacts
                .filter((c) => c.companyId === editing.data.companyId)
                .map((c) => ({ value: c.id, label: c.name }))}
              onChange={(contactId) =>
                E({ ...editing, data: { ...editing.data, contactId } })
              }
            />
            <Field
              label="Deal value (USD)"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={editing.data.valueCents / 100}
              onChange={(e) =>
                E({
                  ...editing,
                  data: {
                    ...editing.data,
                    valueCents: Math.round(Number(e.target.value) * 100),
                  },
                })
              }
            />
            <Field
              label="Expected close"
              type="date"
              required
              value={editing.data.expectedClose}
              onChange={(e) =>
                E({
                  ...editing,
                  data: { ...editing.data, expectedClose: e.target.value },
                })
              }
            />
            <Select
              label="Owner"
              value={editing.data.ownerId}
              options={["Jordan", "Jamie"]}
              onChange={(ownerId) =>
                E({ ...editing, data: { ...editing.data, ownerId } })
              }
            />
            <Select
              label="Stage"
              value={editing.data.stage}
              options={stages}
              onChange={(stage) =>
                E({
                  ...editing,
                  data: {
                    ...editing.data,
                    stage,
                    probability: probabilities[stage],
                  },
                })
              }
            />
            <Field
              label="Next action"
              required
              value={editing.data.nextAction}
              onChange={(e) =>
                E({
                  ...editing,
                  data: { ...editing.data, nextAction: e.target.value },
                })
              }
            />
            <Button type="submit">Save deal</Button>
          </form>
        </Dialog>
      )}
      {mergeOpen && (
        <Dialog
          title="Review duplicate contact merge"
          onClose={() => MO(false)}
        >
          {notice&&<Notice>{notice}</Notice>}
<p>
            Review both records. Keep record retains its name/email/company;
            source is removed and its deals are relinked. Matching email and
            company required.
          </p>
          <Select
            label="Keep contact"
            value={keep}
            options={s.contacts.map((c) => ({
              value: c.id,
              label: `${c.name} · ${c.email}`,
            }))}
            onChange={K}
          />
          <Select
            label="Merge source"
            value={source}
            options={s.contacts.map((c) => ({
              value: c.id,
              label: `${c.name} · ${c.email}`,
            }))}
            onChange={Src}
          />
          <p>
            {s.deals.filter((d) => d.contactId === source).length} deals will be
            relinked.
          </p>
          <Button
            onClick={() => {
              try {
                set(merge(s, keep, source));
                MO(false);
                M("Duplicate merged; deal links repaired.");
              } catch (e) {
                M((e as Error).message);
              }
            }}
          >
            Confirm merge
          </Button>
        </Dialog>
      )}
    </Shell>
  );
}
