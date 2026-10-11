export interface Campaign {
  id: string;
  name: string;
  channel: string;
  budgetCents: number;
  startAt: string;
  endAt: string;
  status: "active" | "paused";
}
export interface DailyPerformance {
  campaignId: string;
  date: string;
  spendCents: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueCents: number;
}
export interface Creative {
  id: string;
  campaignId: string;
  title: string;
  format: string;
  reviewStatus: "pending" | "approved" | "changes requested";
  reviewNote: string;
}
export interface TouchpointConversion {
  id: string;
  date: string;
  valueCents: number;
  firstChannel: string;
  lastChannel: string;
  weightedChannels: string[];
}
export interface State {
  campaigns: Campaign[];
  performance: DailyPerformance[];
  creatives: Creative[];
  conversions: TouchpointConversion[];
  view: string;
  channel: string;
  range: string;
  status: string;
  mode: string;
}
export const seed: State = {
  view: "Campaigns",
  channel: "All",
  range: "Full month",
  status: "All",
  mode: "First touch",
  campaigns: [
    {
      id: "c1",
      name: "Autumn essentials",
      channel: "Search",
      budgetCents: 320000,
      startAt: "2026-10-01",
      endAt: "2026-10-31",
      status: "active",
    },
    {
      id: "c2",
      name: "The everyday collection",
      channel: "Social",
      budgetCents: 200000,
      startAt: "2026-10-01",
      endAt: "2026-10-31",
      status: "active",
    },
    {
      id: "c3",
      name: "Return to something good",
      channel: "Display",
      budgetCents: 140000,
      startAt: "2026-10-01",
      endAt: "2026-10-31",
      status: "paused",
    },
  ],
  performance: Array.from({ length: 12 }, (_, i) => ({
    campaignId: ["c1", "c2", "c3"][i % 3],
    date: `2026-10-${String(1 + Math.floor(i / 3) * 3).padStart(2, "0")}`,
    spendCents: 18000 + i * 1700,
    impressions: 14000 + i * 1700,
    clicks: 450 + i * 32,
    conversions: 18 + i * 2,
    revenueCents: 53000 + i * 6300,
  })),
  creatives: [
    {
      id: "creative-1",
      campaignId: "c1",
      title: "Less, but better.",
      format: "Search headline",
      reviewStatus: "approved",
      reviewNote: "Approved by sample reviewer",
    },
    {
      id: "creative-2",
      campaignId: "c2",
      title: "Made for your every day.",
      format: "Social square",
      reviewStatus: "pending",
      reviewNote: "",
    },
    {
      id: "creative-3",
      campaignId: "c3",
      title: "A little everyday magic.",
      format: "Display banner",
      reviewStatus: "pending",
      reviewNote: "",
    },
  ],
  conversions: [
    {
      id: "cv1",
      date: "2026-10-02",
      valueCents: 240000,
      firstChannel: "Social",
      lastChannel: "Search",
      weightedChannels: ["Social", "Display", "Search"],
    },
    {
      id: "cv2",
      date: "2026-10-04",
      valueCents: 180000,
      firstChannel: "Display",
      lastChannel: "Search",
      weightedChannels: ["Display", "Search"],
    },
    {
      id: "cv3",
      date: "2026-10-09",
      valueCents: 160000,
      firstChannel: "Search",
      lastChannel: "Social",
      weightedChannels: ["Search", "Social"],
    },
    {
      id: "cv4",
      date: "2026-10-10",
      valueCents: 90000,
      firstChannel: "Social",
      lastChannel: "Display",
      weightedChannels: ["Social", "Display"],
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
  const channels = ["Search", "Social", "Display"];
  return (
    ["Campaigns", "Creatives", "Pacing", "Attribution / Digest"].includes(
      s.view,
    ) &&
    ["All", ...channels].includes(s.channel) &&
    ["Full month", "First week"].includes(s.range) &&
    ["All", "active", "paused"].includes(s.status) &&
    ["First touch", "Last touch", "Linear"].includes(s.mode) &&
    unique(s.campaigns) &&
    s.campaigns.length > 0 &&
    s.campaigns.every(
      (c) =>
        text(c.name) &&
        channels.includes(c.channel) &&
        integer(c.budgetCents) &&
        c.budgetCents > 0 &&
        validDate(c.startAt) &&
        validDate(c.endAt) &&
        c.startAt <= c.endAt &&
        ["active", "paused"].includes(c.status),
    ) &&
    s.performance.every(
      (p) =>
        s.campaigns.some((c) => c.id === p.campaignId) &&
        validDate(p.date) &&
        [
          p.spendCents,
          p.impressions,
          p.clicks,
          p.conversions,
          p.revenueCents,
        ].every(integer),
    ) &&
    unique(s.creatives) &&
    s.creatives.every(
      (c) =>
        s.campaigns.some((p) => p.id === c.campaignId) &&
        text(c.title) &&
        text(c.format) &&
        ["pending", "approved", "changes requested"].includes(c.reviewStatus) &&
        typeof c.reviewNote === "string",
    ) &&
    unique(s.conversions) &&
    s.conversions.every(
      (c) =>
        validDate(c.date) &&
        integer(c.valueCents) &&
        channels.includes(c.firstChannel) &&
        channels.includes(c.lastChannel) &&
        c.weightedChannels.length > 0 &&
        c.weightedChannels.every((v) => channels.includes(v)),
    )
  );
}
