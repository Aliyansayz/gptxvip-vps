export interface Patient {
  id: string;
  displayCode: string;
  name: string;
  dob: string;
}
export interface Appointment {
  id: string;
  patientId: string;
  clinicianId: string;
  room: string;
  startAt: string;
  endAt: string;
  status: "scheduled" | "checked-in" | "in-room" | "completed";
}
export interface Clinician {
  id: string;
  name: string;
  role: string;
  availability: { start: string; end: string };
}
export interface FlowEvent {
  id: string;
  appointmentId: string;
  status: string;
  at: string;
}
export interface PrivacySettings {
  masked: boolean;
  lockAfterMinutes: number;
}
export interface State {
  patients: Patient[];
  appointments: Appointment[];
  clinicians: Clinician[];
  events: FlowEvent[];
  privacy: PrivacySettings;
  view: string;
  date: string;
  clinician: string;
  room: string;
  locked: boolean;
}
export const seed: State = {
  view: "Today / Flow",
  date: "2026-10-05",
  clinician: "All",
  room: "All",
  locked: false,
  privacy: { masked: true, lockAfterMinutes: 5 },
  patients: [
    {
      id: "p1",
      displayCode: "PT-1042",
      name: "Alex Morgan",
      dob: "1989-03-12",
    },
    {
      id: "p2",
      displayCode: "PT-1048",
      name: "Taylor Brooks",
      dob: "1977-08-21",
    },
    {
      id: "p3",
      displayCode: "PT-1051",
      name: "Jamie Patel",
      dob: "1995-01-17",
    },
    { id: "p4", displayCode: "PT-1060", name: "Riley Chen", dob: "1983-11-09" },
  ],
  clinicians: [
    {
      id: "d1",
      name: "Dr. Maya Ellis",
      role: "General care",
      availability: { start: "08:00", end: "17:00" },
    },
    {
      id: "d2",
      name: "Dr. Noah Reed",
      role: "General care",
      availability: { start: "09:00", end: "16:00" },
    },
  ],
  appointments: [
    {
      id: "appointment-1",
      patientId: "p1",
      clinicianId: "d1",
      room: "Room 1",
      startAt: "2026-10-05T09:00",
      endAt: "2026-10-05T09:30",
      status: "completed",
    },
    {
      id: "appointment-2",
      patientId: "p2",
      clinicianId: "d2",
      room: "Room 2",
      startAt: "2026-10-05T09:30",
      endAt: "2026-10-05T10:00",
      status: "checked-in",
    },
    {
      id: "appointment-3",
      patientId: "p3",
      clinicianId: "d1",
      room: "Room 1",
      startAt: "2026-10-05T10:00",
      endAt: "2026-10-05T10:30",
      status: "scheduled",
    },
    {
      id: "appointment-4",
      patientId: "p4",
      clinicianId: "d2",
      room: "Room 2",
      startAt: "2026-10-05T11:00",
      endAt: "2026-10-05T11:30",
      status: "scheduled",
    },
    {
      id: "appointment-5",
      patientId: "p1",
      clinicianId: "d1",
      room: "Room 1",
      startAt: "2026-10-06T09:00",
      endAt: "2026-10-06T09:30",
      status: "scheduled",
    },
  ],
  events: [
    {
      id: "flow-1",
      appointmentId: "appointment-1",
      status: "checked-in",
      at: "2026-10-05T08:50",
    },
    {
      id: "flow-2",
      appointmentId: "appointment-1",
      status: "in-room",
      at: "2026-10-05T09:00",
    },
    {
      id: "flow-3",
      appointmentId: "appointment-1",
      status: "completed",
      at: "2026-10-05T09:30",
    },
    {
      id: "flow-4",
      appointmentId: "appointment-2",
      status: "checked-in",
      at: "2026-10-05T09:20",
    },
  ],
};

const unique = (rows: { id: string }[]) =>
  rows.every((r) => typeof r.id === "string" && !!r.id) &&
  new Set(rows.map((r) => r.id)).size === rows.length;
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const nonnegative = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const integer = (v: unknown): v is number =>
  nonnegative(v) && Number.isSafeInteger(v);
const validDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v;
export function validate(s: State) {
  const time = (v: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
  const stamp = (v: string) =>
    typeof v === "string" &&
    v.length === 16 &&
    validDate(v.slice(0, 10)) &&
    v[10] === "T" &&
    time(v.slice(11));
  const statuses = ["scheduled", "checked-in", "in-room", "completed"];
  return (
    ["Today / Flow", "Appointments", "Staff", "Privacy"].includes(s.view) &&
    validDate(s.date) &&
    ["All", ...s.clinicians.map((c) => c.id)].includes(s.clinician) &&
    ["All", "Room 1", "Room 2", "Room 3"].includes(s.room) &&
    [1, 5, 15].includes(s.privacy.lockAfterMinutes) &&
    unique(s.patients) &&
    s.patients.length > 0 &&
    s.patients.every(
      (p) => text(p.displayCode) && text(p.name) && validDate(p.dob),
    ) &&
    unique(s.clinicians) &&
    s.clinicians.length > 0 &&
    s.clinicians.every(
      (c) =>
        text(c.name) &&
        text(c.role) &&
        time(c.availability.start) &&
        time(c.availability.end) &&
        c.availability.start < c.availability.end,
    ) &&
    unique(s.appointments) &&
    s.appointments.every(
      (a) =>
        s.patients.some((p) => p.id === a.patientId) &&
        s.clinicians.some((c) => c.id === a.clinicianId) &&
        ["Room 1", "Room 2", "Room 3"].includes(a.room) &&
        statuses.includes(a.status) &&
        stamp(a.startAt) &&
        stamp(a.endAt) &&
        a.startAt < a.endAt &&
        a.startAt.slice(0, 10) === a.endAt.slice(0, 10),
    ) &&
    unique(s.events) &&
    s.events.every(
      (e) =>
        s.appointments.some((a) => a.id === e.appointmentId) &&
        statuses.includes(e.status) &&
        stamp(e.at),
    )
  );
}
