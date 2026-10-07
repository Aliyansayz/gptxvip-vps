import type { Member, State } from "./data";
export function memberError(rows: Member[], current: Member, next: Member) {
  return current.role === "admin" &&
    current.status === "active" &&
    (next.role !== "admin" || next.status !== "active") &&
    !rows.some(
      (m) =>
        m.id !== current.id &&
        m.workspaceId === current.workspaceId &&
        m.role === "admin" &&
        m.status === "active",
    )
    ? "This workspace must retain at least one active admin."
    : "";
}
export function invitationError(s: State, email: string, ws: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  if (
    s.members.some(
      (m) =>
        m.workspaceId === ws && m.email.toLowerCase() === email.toLowerCase(),
    ) ||
    s.invitations.some(
      (i) =>
        i.workspaceId === ws &&
        i.status === "pending" &&
        i.email.toLowerCase() === email.toLowerCase(),
    )
  )
    return "This address is already a member or has a pending invitation.";
  return "";
}
export function onboarding(s: State) {
  const ws = s.preferences.workspaceId;
  return [
    {
      label: "Choose workspace",
      done: !!s.workspaces.find((w) => w.id === ws),
    },
    { label: "Set display name", done: !!s.preferences.displayName.trim() },
    {
      label: "Grow your team",
      done:
        s.members.filter((m) => m.workspaceId === ws && m.status === "active")
          .length > 1 ||
        s.invitations.some(
          (i) => i.workspaceId === ws && i.status === "pending",
        ),
    },
    {
      label: "Choose appearance preference",
      done: s.preferences.theme !== "System",
    },
  ];
}
