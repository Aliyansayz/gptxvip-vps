export interface Workspace {
  id: string;
  name: string;
  slug: string;
}
export interface Member {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "suspended";
  workspaceId: string;
}
export interface Invitation {
  id: string;
  email: string;
  role: string;
  workspaceId: string;
  status: "pending" | "revoked";
}
export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  workspaceId: string;
}
export interface AuditEvent {
  id: string;
  action: string;
  at: string;
  targetId: string;
  workspaceId: string;
}
export interface Preferences {
  theme: string;
  workspaceId: string;
  displayName: string;
}
export interface State {
  view: string;
  workspaces: Workspace[];
  members: Member[];
  invitations: Invitation[];
  notifications: Notification[];
  audit: AuditEvent[];
  preferences: Preferences;
  loggedIn: boolean;
  service: "ready" | "failed";
}
export const seed: State = {
  view: "Overview",
  loggedIn: true,
  service: "ready",
  preferences: {
    theme: "System",
    workspaceId: "ws1",
    displayName: "Jordan Davis",
  },
  workspaces: [
    { id: "ws1", name: "Northstar Studio", slug: "northstar" },
    { id: "ws2", name: "Fieldwork Labs", slug: "fieldwork" },
    { id: "ws3", name: "New workspace", slug: "new-workspace" },
  ],
  members: [
    {
      id: "member-1",
      name: "Jordan Davis",
      email: "jordan@example.test",
      role: "admin",
      status: "active",
      workspaceId: "ws1",
    },
    {
      id: "member-2",
      name: "Sam Rivers",
      email: "sam@example.test",
      role: "editor",
      status: "active",
      workspaceId: "ws1",
    },
    {
      id: "member-3",
      name: "Casey Quinn",
      email: "casey@example.test",
      role: "viewer",
      status: "suspended",
      workspaceId: "ws1",
    },
    {
      id: "member-4",
      name: "Jordan Davis",
      email: "jordan@example.test",
      role: "admin",
      status: "active",
      workspaceId: "ws2",
    },
    {
      id: "member-5",
      name: "Dana Ellis",
      email: "dana@example.test",
      role: "viewer",
      status: "active",
      workspaceId: "ws2",
    },
    {
      id: "member-6",
      name: "Jordan Davis",
      email: "jordan@example.test",
      role: "admin",
      status: "active",
      workspaceId: "ws3",
    },
  ],
  invitations: [],
  notifications: [
    {
      id: "notification-1",
      title: "Welcome to Northstar",
      body: "Your sample workspace is ready to configure.",
      read: false,
      workspaceId: "ws1",
    },
    {
      id: "notification-2",
      title: "Member review due",
      body: "Review Casey’s suspended membership.",
      read: false,
      workspaceId: "ws1",
    },
    {
      id: "notification-3",
      title: "Sample workspace created",
      body: "Fieldwork Labs settings are available.",
      read: true,
      workspaceId: "ws2",
    },
  ],
  audit: [
    {
      id: "audit-1",
      action: "Sample workspace created",
      at: "2026-10-01T09:00",
      targetId: "ws1",
      workspaceId: "ws1",
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
  const roles = ["admin", "editor", "viewer"];
  const workspace = (id: string) => s.workspaces.some((w) => w.id === id);
  const email = (v: string) =>
    typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  return (
    [
      "Overview",
      "Members / Roles",
      "Workspaces",
      "Notifications",
      "Settings / Onboarding",
    ].includes(s.view) &&
    ["ready", "failed"].includes(s.service) &&
    workspace(s.preferences.workspaceId) &&
    text(s.preferences.displayName) &&
    ["System", "Light", "Dark"].includes(s.preferences.theme) &&
    unique(s.workspaces) &&
    s.workspaces.length > 0 &&
    s.workspaces.every(
      (w) =>
        text(w.name) &&
        text(w.slug) &&
        s.members.some(
          (m) =>
            m.workspaceId === w.id &&
            m.role === "admin" &&
            m.status === "active",
        ),
    ) &&
    unique(s.members) &&
    s.members.every(
      (m) =>
        text(m.name) &&
        email(m.email) &&
        roles.includes(m.role) &&
        ["active", "suspended"].includes(m.status) &&
        workspace(m.workspaceId),
    ) &&
    unique(s.invitations) &&
    s.invitations.every(
      (i) =>
        email(i.email) &&
        roles.includes(i.role) &&
        workspace(i.workspaceId) &&
        ["pending", "revoked"].includes(i.status),
    ) &&
    unique(s.notifications) &&
    s.notifications.every(
      (n) =>
        workspace(n.workspaceId) &&
        text(n.title) &&
        text(n.body) &&
        typeof n.read === "boolean",
    ) &&
    unique(s.audit) &&
    s.audit.every(
      (a) =>
        workspace(a.workspaceId) &&
        text(a.action) &&
        text(a.at) &&
        text(a.targetId),
    )
  );
}
