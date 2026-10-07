export interface ProductEvent {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: string;
  event: string;
  platform: string;
  channel: string;
}
export interface Session {
  id: string;
  userId: string;
  startedAt: string;
  platform: string;
  path: string[];
}
export interface Cohort {
  startPeriod: string;
  userIds: string[];
}
export interface SavedReport {
  id: string;
  name: string;
  metric: string;
  channel: string;
  range: string;
  widgets: string[];
}
const users = Array.from({ length: 24 }, (_, i) => ({
  id: `user-${i + 1}`,
  channel: ["Organic", "Paid", "Referral"][i % 3],
  platform: ["Web", "iOS", "Android"][Math.floor(i / 3) % 3],
}));
export const events: ProductEvent[] = users.flatMap((u, i) =>
  [
    "Visit",
    "Signup",
    ...(i % 4 !== 0 ? ["Activate"] : []),
    ...(i % 3 === 0 ? ["Purchase"] : []),
  ].map((event, j) => ({
    id: `event-${i * 5 + j + 1}`,
    userId: u.id,
    sessionId: `session-${i + 1}`,
    timestamp: `2026-10-${String(1 + (i % 2)).padStart(2, "0")}T${String(9 + j).padStart(2, "0")}:00:00`,
    event,
    platform: u.platform,
    channel: u.channel,
  })),
);
events.push(
  ...users.flatMap((u, i) =>
    [1, 2, 3]
      .filter((d) => (i + d) % 3 !== 0)
      .map((d) => ({
        id: `return-${i}-${d}`,
        userId: u.id,
        sessionId: `return-session-${i}-${d}`,
        timestamp: `2026-10-${String(2 + (i % 2) + d).padStart(2, "0")}T15:00:00`,
        event: "Return visit",
        platform: u.platform,
        channel: u.channel,
      })),
  ),
);
export const sessions: Session[] = Array.from(
  new Set(events.map((e) => e.sessionId)),
).map((id) => {
  const path = events
    .filter((e) => e.sessionId === id)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  return {
    id,
    userId: path[0].userId,
    startedAt: path[0].timestamp,
    platform: path[0].platform,
    path: path.map((e) => e.event),
  };
});
export const cohorts: Cohort[] = [
  {
    startPeriod: "2026-10-01",
    userIds: users.filter((_, i) => i % 2 === 0).map((u) => u.id),
  },
  {
    startPeriod: "2026-10-02",
    userIds: users.filter((_, i) => i % 2 !== 0).map((u) => u.id),
  },
];
export const seed = {
  events,
  sessions,
  cohorts,
  reports: [] as SavedReport[],
  stream: false,
  channel: "All",
  platform: "All",
  range: "All dates",
  cohort: "2026-10-01",
};
/** Validate references and the mutable stream contracts before accepting stored records. */
export function validate(s: typeof seed) {
  const channels = ["Organic", "Paid", "Referral"];
  const platforms = ["Web", "iOS", "Android"];
  const ranges = ["All dates", "Oct 1–4", "Oct 5–8"];
  const eventNames = [
    "Visit",
    "Signup",
    "Activate",
    "Purchase",
    "Return visit",
  ];
  const widgets = [
    "Active users",
    "Activation trend",
    "Funnel conversion",
    "Cohort progression",
    "Event volume",
  ];
  const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
  const uniqueIds = (rows: { id: string }[]) =>
    rows.every((r) => text(r.id)) &&
    new Set(rows.map((r) => r.id)).size === rows.length;
  const date = (v: unknown): v is string => {
    if (typeof v !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const parsed = Date.parse(v + "T00:00:00Z");
    return (
      Number.isFinite(parsed) &&
      new Date(parsed).toISOString().slice(0, 10) === v
    );
  };
  const stamp = (v: unknown): v is string =>
    typeof v === "string" &&
    /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v) &&
    date(v.slice(0, 10));
  const userRecord = (id: string) =>
    users.find((u) => u.id === id) ||
    (/^sample-user-(?:[0-9]|1[01])$/.test(id)
      ? {
          id,
          channel: channels[Number(id.split("-").at(-1)) % 3],
          platform: platforms[Number(id.split("-").at(-1)) % 3],
        }
      : undefined);
  if (
    !Array.isArray(s.events) ||
    !Array.isArray(s.sessions) ||
    !Array.isArray(s.cohorts) ||
    !Array.isArray(s.reports)
  )
    return false;
  return (
    typeof s.stream === "boolean" &&
    ["All", ...channels].includes(s.channel) &&
    ["All", ...platforms].includes(s.platform) &&
    ranges.includes(s.range) &&
    uniqueIds(s.events) &&
    uniqueIds(s.sessions) &&
    uniqueIds(s.reports) &&
    s.events.every((e) => {
      const session = s.sessions.find((row) => row.id === e.sessionId);
      const user = userRecord(e.userId);
      return (
        !!session &&
        !!user &&
        session.userId === e.userId &&
        session.platform === e.platform &&
        user.channel === e.channel &&
        user.platform === e.platform &&
        stamp(e.timestamp) &&
        eventNames.includes(e.event)
      );
    }) &&
    s.sessions.every((session) => {
      const rows = s.events.filter((e) => e.sessionId === session.id);
      // Session paths preserve ingestion order, including generated stream events.
      return (
        !!userRecord(session.userId) &&
        platforms.includes(session.platform) &&
        stamp(session.startedAt) &&
        rows.length > 0 &&
        rows[0].timestamp === session.startedAt &&
        Array.isArray(session.path) &&
        session.path.length === rows.length &&
        session.path.every((kind, i) => kind === rows[i].event)
      );
    }) &&
    s.cohorts.length > 0 &&
    new Set(s.cohorts.map((c) => c.startPeriod)).size === s.cohorts.length &&
    s.cohorts.some((c) => c.startPeriod === s.cohort) &&
    s.cohorts.every(
      (c) =>
        date(c.startPeriod) &&
        Array.isArray(c.userIds) &&
        c.userIds.length > 0 &&
        new Set(c.userIds).size === c.userIds.length &&
        c.userIds.every(
          (id) =>
            users.some((u) => u.id === id) &&
            s.events.some(
              (e) =>
                e.userId === id &&
                e.event === "Visit" &&
                e.timestamp.startsWith(c.startPeriod),
            ),
        ),
    ) &&
    s.reports.every(
      (r) =>
        text(r.name) &&
        ["All", ...channels].includes(r.channel) &&
        ranges.includes(r.range) &&
        Array.isArray(r.widgets) &&
        r.widgets.length > 0 &&
        new Set(r.widgets).size === r.widgets.length &&
        r.widgets.every((w) => widgets.includes(w)) &&
        r.metric === r.widgets[0] &&
        (!("platform" in r) ||
          ["All", ...platforms].includes(String(r.platform))),
    )
  );
}
