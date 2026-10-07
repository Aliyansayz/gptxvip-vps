import type { State } from "./data";
import { uid } from "../shared/helpers";
const next = {
  scheduled: "checked-in",
  "checked-in": "in-room",
  "in-room": "completed",
  completed: "completed",
} as const;
/** Schedule strings are Karachi wall-clock fixtures; UTC arithmetic preserves those strings regardless of host timezone. */
export function moveAppointment(state: State, id: string): State {
  const appointment = state.appointments.find((a) => a.id === id);
  if (!appointment || state.locked || appointment.status === "completed")
    return state;
  const status = next[appointment.status];
  const at =
    status === "checked-in"
      ? appointment.startAt
      : status === "in-room"
        ? new Date(
            (Date.parse(appointment.startAt + "Z") +
              Date.parse(appointment.endAt + "Z")) /
              2,
          )
            .toISOString()
            .slice(0, 16)
        : appointment.endAt;
  return {
    ...state,
    appointments: state.appointments.map((a) =>
      a.id === id ? { ...a, status } : a,
    ),
    events: [
      ...state.events,
      { id: uid(state.events, "flow"), appointmentId: id, status, at },
    ],
  };
}
