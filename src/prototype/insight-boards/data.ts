export interface Tenant {
  id: string;
  name: string;
  accent: string;
  logoText: string;
}
export interface UsageRecord {
  id: string;
  tenantId: string;
  date: string;
  metric: string;
  value: number;
}
export interface Board {
  id: string;
  tenantId: string;
  title: string;
  widgetIds: string[];
}
export interface Widget {
  id: string;
  metric: string;
  title: string;
  type: "trend" | "metric" | "table";
}
export interface Schedule {
  id: string;
  tenantId: string;
  reportId: string;
  cadence: string;
  enabled: boolean;
}
export interface AccessPreview {
  tenantId: string;
  role: string;
  allowedMetrics: string[];
}
export interface State {
  view: string;
  tenantId: string;
  role: string;
  tenants: Tenant[];
  usage: UsageRecord[];
  boards: Board[];
  widgets: Widget[];
  schedules: Schedule[];
}
export const allowed = (role: string) =>
  role === "Admin"
    ? ["sessions", "signups", "revenue"]
    : ["sessions", "signups"];
export const seed: State = {
  view: "Board",
  tenantId: "north",
  role: "Admin",
  tenants: [
    { id: "north", name: "Northstar", accent: "#395bc2", logoText: "NS" },
    { id: "grove", name: "Grove & Co", accent: "#26715e", logoText: "GC" },
    { id: "ember", name: "Ember Studio", accent: "#a54532", logoText: "ES" },
  ],
  usage: ["north", "grove", "ember"].flatMap((tenantId, t) =>
    Array.from({ length: 15 }, (_, i) => ({
      id: `usage-${tenantId}-${i}`,
      tenantId,
      date: `2026-10-${String(1 + Math.floor(i / 3)).padStart(2, "0")}`,
      metric: ["sessions", "signups", "revenue"][i % 3],
      value:
        i % 3 === 0
          ? 520 + t * 230 + Math.floor(i / 3) * 65
          : i % 3 === 1
            ? 28 + t * 15 + Math.floor(i / 3) * 4
            : 1300 + t * 850 + Math.floor(i / 3) * 150,
    })),
  ),
  widgets: [
    {
      id: "sessions",
      metric: "sessions",
      title: "Product sessions",
      type: "trend",
    },
    { id: "signups", metric: "signups", title: "New signups", type: "metric" },
    {
      id: "revenue",
      metric: "revenue",
      title: "Sample revenue (USD)",
      type: "table",
    },
  ],
  boards: ["north", "grove", "ember"].map((tenantId, i) => ({
    id: `board-${tenantId}`,
    tenantId,
    title: ["Product health", "Growth studio", "Client pulse"][i],
    widgetIds: ["sessions", "signups", "revenue"],
  })),
  schedules: [],
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
const accessibleAccent = (value: string) => {
  if (!/^#[0-9a-f]{6}$/i.test(value)) return false;
  const rgb = [1, 3, 5]
    .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return (
    1.05 / (rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722 + 0.05) >= 4.5
  );
};
export function validate(s: State) {
  const metrics = ["sessions", "signups", "revenue"];
  const tenant = (id: string) => s.tenants.some((t) => t.id === id);
  return (
    ["Board", "Tenants / Usage", "Embed", "Reports / Access"].includes(
      s.view,
    ) &&
    tenant(s.tenantId) &&
    ["Admin", "Member"].includes(s.role) &&
    unique(s.tenants) &&
    s.tenants.length > 0 &&
    s.tenants.every(
      (t) =>
        text(t.name) &&
        text(t.logoText) &&
        accessibleAccent(t.accent) &&
        s.boards.some((b) => b.tenantId === t.id),
    ) &&
    unique(s.usage) &&
    s.usage.every(
      (r) =>
        tenant(r.tenantId) &&
        validDate(r.date) &&
        metrics.includes(r.metric) &&
        nonnegative(r.value),
    ) &&
    unique(s.widgets) &&
    s.widgets.every(
      (w) =>
        metrics.includes(w.metric) &&
        text(w.title) &&
        ["trend", "metric", "table"].includes(w.type),
    ) &&
    unique(s.boards) &&
    new Set(s.boards.map((b) => b.tenantId)).size === s.boards.length &&
    s.boards.every(
      (b) =>
        tenant(b.tenantId) &&
        text(b.title) &&
        b.widgetIds.every((id) => s.widgets.some((w) => w.id === id)) &&
        new Set(b.widgetIds).size === b.widgetIds.length,
    ) &&
    unique(s.schedules) &&
    s.schedules.every(
      (r) =>
        tenant(r.tenantId) &&
        s.boards.some(
          (b) => b.id === r.reportId && b.tenantId === r.tenantId,
        ) &&
        ["Weekly", "Monthly"].includes(r.cadence) &&
        typeof r.enabled === "boolean",
    )
  );
}
