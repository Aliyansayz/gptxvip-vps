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
  Badge,
  Bars,
  csv,
  printReport,
  Notice,
  Empty,
  uid,
} from "../shared";
import { validate, seed, type Appointment } from "./data";
import { validateAppointment, averageWait } from "./formulas";
import { moveAppointment } from "./actions";
import { Schedule } from "./Views";
const nextStatus = {
  scheduled: "checked-in",
  "checked-in": "in-room",
  "in-room": "completed",
  completed: "completed",
} as const;
export default function App() {
  const { state, setState, reset } = useDemo("clinicare", seed, validate);
  const [detail, setDetail] = useState<Appointment | null>(null);
  const [edit, setEdit] = useState<Appointment | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [availability, setAvailability] = useState<{
    id: string;
    start: string;
    end: string;
  } | null>(null);
  const update = (patch: Partial<typeof state>) =>
    setState((s) => ({ ...s, ...patch }));
  const lock = () => {
    setState((s) => ({
      ...s,
      locked: true,
      privacy: { ...s.privacy, masked: true },
    }));
    setDetail(null);
    setEdit(null);
    setAvailability(null);
  };
  useEffect(() => {
    if (state.locked) return;
    let timer: ReturnType<typeof setTimeout>;
    const touch = () => {
      clearTimeout(timer);
      timer = setTimeout(
        () =>
          setState((s) => ({
            ...s,
            locked: true,
            privacy: { ...s.privacy, masked: true },
          })),
        state.privacy.lockAfterMinutes * 60000,
      );
    };
    touch();
    window.addEventListener("pointerdown", touch);
    window.addEventListener("keydown", touch);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", touch);
      window.removeEventListener("keydown", touch);
    };
  }, [state.privacy.lockAfterMinutes, state.locked, setState]);
  useEffect(() => {
    if (state.locked) {
      setDetail(null);
      setEdit(null);
      setAvailability(null);
    }
  }, [state.locked]);
  const label = (id: string) => {
    const p = state.patients.find((p) => p.id === id)!;
    return state.privacy.masked ? p.displayCode : p.name;
  };
  const staff = (id: string) =>
    state.clinicians.find((d) => d.id === id)?.name || "Unknown";
  const rows = state.appointments
    .filter(
      (a) =>
        a.startAt.startsWith(state.date) &&
        (state.clinician === "All" || a.clinicianId === state.clinician) &&
        (state.room === "All" || a.room === state.room),
    )
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const exportRows = rows.map((a) => ({
    patient: label(a.patientId),
    dob: state.privacy.masked
      ? "Masked"
      : state.patients.find((p) => p.id === a.patientId)?.dob,
    date: a.startAt.slice(0, 10),
    start: a.startAt.slice(11),
    end: a.endAt.slice(11),
    clinician: staff(a.clinicianId),
    room: a.room,
    status: a.status,
  }));
  const wait = averageWait(rows, state.events);
  const begin = (a?: Appointment) => {
    setDetail(null);
    setError("");
    setEdit(
      a
        ? { ...a }
        : {
            id: uid(state.appointments, "appointment"),
            patientId: state.patients[0].id,
            clinicianId: state.clinicians[0].id,
            room: "Room 1",
            startAt: `${state.date}T13:00`,
            endAt: `${state.date}T13:30`,
            status: "scheduled",
          },
    );
  };
  const transition = (a: Appointment) => {
    if (state.locked || a.status === "completed") return;
    const status = nextStatus[a.status];
    setState((s) => moveAppointment(s, a.id));
    setDetail(null);
    setNotice(
      `${label(a.patientId)} moved to ${status}. Simulated flow time recorded.`,
    );
  };
  return (
    <Shell
      slug="clinicare"
      title="CliniCare"
      subtitle="A calmer front desk for appointments, staff availability and patient flow."
      accent="#267769"
      tabs={["Today / Flow", "Appointments", "Staff", "Privacy"]}
      view={state.view}
      onView={(v) => update({ view: v })}
      onReset={() => {
        reset();
        setDetail(null);
        setEdit(null);
      }}
      actions={
        !state.locked && (
          <>
            <Button
              variant="secondary"
              onClick={() =>
                printReport("CliniCare · selected schedule", exportRows)
              }
            >
              Print schedule
            </Button>
            <Button onClick={() => begin()}>Book appointment</Button>
          </>
        )
      }
    >
      {state.locked ? (
        <Card title="Demo session locked">
          <p>
            Patient details have been remasked. This is a browser-only lock
            simulation, not authentication or secure storage.
          </p>
          <Button onClick={() => update({ locked: false })}>
            Unlock demo session
          </Button>
        </Card>
      ) : (
        <>
          <div className="product-filters">
            <Field
              label="Appointment date"
              type="date"
              value={state.date}
              onChange={(e) => update({ date: e.target.value })}
            />
            <Select
              label="Clinician"
              value={state.clinician}
              onChange={(clinician) => update({ clinician })}
              options={[
                "All",
                ...state.clinicians.map((d) => ({
                  value: d.id,
                  label: d.name,
                })),
              ]}
            />
            <Select
              label="Room"
              value={state.room}
              onChange={(room) => update({ room })}
              options={["All", "Room 1", "Room 2", "Room 3"]}
            />
            <Button
              variant="secondary"
              onClick={() => csv("clinicare-schedule", exportRows)}
            >
              Export schedule
            </Button>
            <Button variant="secondary" onClick={lock}>
              Lock now
            </Button>
          </div>
          {notice && <Notice>{notice}</Notice>}
          <Notice>
            {state.privacy.masked
              ? "Privacy mode: names and dates of birth masked in every view and export."
              : "Explicit sample reveal enabled. Remask at any time in Privacy."}
          </Notice>
          <Kpis
            items={[
              { label: "Appointments", value: rows.length },
              {
                label: "Waiting",
                value: rows.filter((a) => a.status === "checked-in").length,
              },
              {
                label: "In room",
                value: rows.filter((a) => a.status === "in-room").length,
              },
              {
                label: "Recorded average wait",
                value: wait === null ? "No flow yet" : `${wait.toFixed(0)} min`,
                note: "Check-in to in-room recorded times",
              },
            ]}
          />
          {state.view === "Today / Flow" && (
            <div className="product-grid">
              <Schedule
                rows={rows}
                label={label}
                staff={staff}
                onSelect={setDetail}
              />
              <div className="product-stack">
                <Card title="Check-in queue">
                  {rows
                    .filter((a) => a.status !== "completed")
                    .map((a) => (
                      <div key={a.id} className="product-record">
                        <strong>{label(a.patientId)}</strong>
                        <p>
                          {a.startAt.slice(11)} · {a.room} · {a.status}
                        </p>
                        <Button onClick={() => transition(a)}>
                          {a.status === "scheduled"
                            ? "Check in"
                            : a.status === "checked-in"
                              ? "Move in-room"
                              : "Complete visit"}
                        </Button>
                      </div>
                    ))}
                  {!rows.some((a) => a.status !== "completed") && (
                    <Empty>All scheduled visits are complete.</Empty>
                  )}
                </Card>
                <Card title="Completed visits by day">
                  <Bars
                    rows={["2026-10-05", "2026-10-06"].map((date) => ({
                      label: date,
                      value: state.appointments.filter(
                        (a) =>
                          a.startAt.startsWith(date) &&
                          a.status === "completed" &&
                          (state.clinician === "All" ||
                            a.clinicianId === state.clinician) &&
                          (state.room === "All" || a.room === state.room),
                      ).length,
                    }))}
                    format={(n) => `${n} completed`}
                  />
                </Card>
              </div>
            </div>
          )}
          {state.view === "Appointments" && (
            <Card title="Appointment register">
              <Table
                caption="Selected day schedule; patient identifiers follow privacy setting"
                heads={[
                  "Time",
                  "Patient",
                  "Clinician",
                  "Room",
                  "Flow",
                  "Detail",
                ]}
              >
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      {a.startAt.slice(11)}–{a.endAt.slice(11)}
                    </td>
                    <td>{label(a.patientId)}</td>
                    <td>{staff(a.clinicianId)}</td>
                    <td>{a.room}</td>
                    <td>
                      <Badge>{a.status}</Badge>
                    </td>
                    <td>
                      <Button variant="secondary" onClick={() => setDetail(a)}>
                        Open appointment
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
              {!rows.length && <Empty />}
            </Card>
          )}
          {state.view === "Staff" && (
            <div className="product-grid equal">
              {state.clinicians.map((d) => (
                <Card key={d.id} title={d.name}>
                  <p>
                    {d.role} · {d.availability.start}–{d.availability.end}
                  </p>
                  <p>
                    {
                      state.appointments.filter(
                        (a) =>
                          a.clinicianId === d.id &&
                          a.startAt.startsWith(state.date),
                      ).length
                    }{" "}
                    appointments on {state.date}
                  </p>
                  {state.appointments
                    .filter(
                      (a) =>
                        a.clinicianId === d.id &&
                        (a.startAt.slice(11) < d.availability.start ||
                          a.endAt.slice(11) > d.availability.end),
                    )
                    .map((a) => (
                      <Notice key={a.id}>
                        Availability conflict: {a.startAt.replace("T", " ")} (
                        {label(a.patientId)}). Reschedule this appointment.
                      </Notice>
                    ))}
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setAvailability({ id: d.id, ...d.availability });
                      setError("");
                    }}
                  >
                    Edit availability
                  </Button>
                </Card>
              ))}
            </div>
          )}
          {state.view === "Privacy" && (
            <div className="product-grid equal">
              <Card title="Patient display">
                <p>
                  Fictional records remain in browser storage. Masking is a
                  presentation feature, not a security guarantee.
                </p>
                <Button
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      privacy: { ...s.privacy, masked: !s.privacy.masked },
                    }))
                  }
                >
                  {state.privacy.masked
                    ? "Reveal fictional names and DOB"
                    : "Remask patient details"}
                </Button>
                <p>Sample patient directory:</p>
                {state.patients.map((p) => (
                  <p key={p.id}>
                    {label(p.id)} ·{" "}
                    {state.privacy.masked ? "DOB masked" : p.dob}
                  </p>
                ))}
              </Card>
              <Card title="Simulated session lock">
                <Select
                  label="Idle lock after"
                  value={String(state.privacy.lockAfterMinutes)}
                  onChange={(v) =>
                    setState((s) => ({
                      ...s,
                      privacy: { ...s.privacy, lockAfterMinutes: Number(v) },
                    }))
                  }
                  options={[
                    { value: "1", label: "1 minute" },
                    { value: "5", label: "5 minutes" },
                    { value: "15", label: "15 minutes" },
                  ]}
                />
                <p>
                  Interaction restarts the timer. Locking closes operational
                  dialogs and remasks all patient details.
                </p>
                <Button variant="secondary" onClick={lock}>
                  Lock now
                </Button>
              </Card>
            </div>
          )}
          {detail && (
            <Dialog
              title={`Appointment · ${label(detail.patientId)}`}
              onClose={() => setDetail(null)}
            >
              <p>
                {state.privacy.masked
                  ? "DOB masked"
                  : state.patients.find((p) => p.id === detail.patientId)?.dob}
              </p>
              <p>
                {detail.startAt.replace("T", " ")}–{detail.endAt.slice(11)} ·{" "}
                {detail.room} · {staff(detail.clinicianId)}
              </p>
              <p>Status: {detail.status}</p>
              <div className="product-actions">
                {detail.status === "scheduled" && (
                  <Button variant="secondary" onClick={() => begin(detail)}>
                    Reschedule
                  </Button>
                )}
                {detail.status !== "completed" && (
                  <Button onClick={() => transition(detail)}>
                    Move to {nextStatus[detail.status]}
                  </Button>
                )}
              </div>
              <h3>Flow history</h3>
              {state.events
                .filter((e) => e.appointmentId === detail.id)
                .map((e) => (
                  <p key={e.id}>
                    {e.status} · {e.at.replace("T", " ")}
                  </p>
                ))}
            </Dialog>
          )}
          {edit && (
            <Dialog
              title={
                state.appointments.some((a) => a.id === edit.id)
                  ? "Reschedule appointment"
                  : "Book appointment"
              }
              onClose={() => setEdit(null)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const err = validateAppointment(
                    edit,
                    state.appointments,
                    state.clinicians,
                  );
                  if (err) {
                    setError(err);
                    return;
                  }
                  setState((s) => ({
                    ...s,
                    appointments: s.appointments.some((a) => a.id === edit.id)
                      ? s.appointments.map((a) => (a.id === edit.id ? edit : a))
                      : [...s.appointments, edit],
                  }));
                  setEdit(null);
                  setNotice("Schedule saved.");
                }}
              >
                <Select
                  label="Fictional patient"
                  value={edit.patientId}
                  onChange={(patientId) => setEdit({ ...edit, patientId })}
                  options={state.patients.map((p) => ({
                    value: p.id,
                    label: label(p.id),
                  }))}
                />
                <Select
                  label="Clinician"
                  value={edit.clinicianId}
                  onChange={(clinicianId) => setEdit({ ...edit, clinicianId })}
                  options={state.clinicians.map((d) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                />
                <Select
                  label="Room"
                  value={edit.room}
                  onChange={(room) => setEdit({ ...edit, room })}
                  options={["Room 1", "Room 2", "Room 3"]}
                />
                <Field
                  label="Start"
                  type="datetime-local"
                  value={edit.startAt}
                  onChange={(e) =>
                    setEdit({ ...edit, startAt: e.target.value })
                  }
                />
                <Field
                  label="End"
                  type="datetime-local"
                  value={edit.endAt}
                  onChange={(e) => setEdit({ ...edit, endAt: e.target.value })}
                />
                {error && (
                  <p role="alert" className="product-error">
                    {error}
                  </p>
                )}
                <Button type="submit">Save appointment</Button>
              </form>
            </Dialog>
          )}
          {availability && (
            <Dialog
              title="Staff availability"
              onClose={() => setAvailability(null)}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (
                    !availability.start ||
                    availability.end <= availability.start
                  ) {
                    setError("Availability end must be after start.");
                    return;
                  }
                  setState((s) => ({
                    ...s,
                    clinicians: s.clinicians.map((d) =>
                      d.id === availability.id
                        ? {
                            ...d,
                            availability: {
                              start: availability.start,
                              end: availability.end,
                            },
                          }
                        : d,
                    ),
                  }));
                  setAvailability(null);
                  setNotice(
                    "Availability saved. Existing appointments outside the window are flagged.",
                  );
                }}
              >
                <Field
                  label="Available from"
                  type="time"
                  value={availability.start}
                  onChange={(e) =>
                    setAvailability({ ...availability, start: e.target.value })
                  }
                />
                <Field
                  label="Available until"
                  type="time"
                  value={availability.end}
                  onChange={(e) =>
                    setAvailability({ ...availability, end: e.target.value })
                  }
                />
                {error && (
                  <p role="alert" className="product-error">
                    {error}
                  </p>
                )}
                <Button type="submit">Save availability</Button>
              </form>
            </Dialog>
          )}
        </>
      )}
    </Shell>
  );
}
