import type { Appointment, Clinician, FlowEvent } from "./data";
export const overlaps = (a: Appointment, b: Appointment) =>
  a.startAt < b.endAt && b.startAt < a.endAt;
export function validateAppointment(
  a: Appointment,
  rows: Appointment[],
  staff: Clinician[],
) {
  if (!a.startAt || !a.endAt || a.endAt <= a.startAt)
    return "End must be after start.";
  if (a.startAt.slice(0, 10) !== a.endAt.slice(0, 10))
    return "Keep the appointment within one day.";
  const c = staff.find((d) => d.id === a.clinicianId);
  if (
    !c ||
    a.startAt.slice(11) < c.availability.start ||
    a.endAt.slice(11) > c.availability.end
  )
    return "Appointment is outside clinician availability.";
  const conflict = rows.find(
    (b) =>
      b.id !== a.id &&
      overlaps(a, b) &&
      (a.clinicianId === b.clinicianId || a.room === b.room),
  );
  return conflict
    ? "Room or clinician conflicts with an existing appointment."
    : "";
}
export function averageWait(rows: Appointment[], events: FlowEvent[]) {
  const values = rows.flatMap((a) => {
    const check = events.find(
      (e) => e.appointmentId === a.id && e.status === "checked-in",
    );
    const room = events.find(
      (e) => e.appointmentId === a.id && e.status === "in-room",
    );
    return check && room
      ? [(Date.parse(room.at + "Z") - Date.parse(check.at + "Z")) / 60000]
      : [];
  });
  return values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : null;
}
