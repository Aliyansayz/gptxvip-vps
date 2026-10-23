import type { PrototypeId } from "../../../prototype/registry";

export interface Template {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  frameworks: string[];
  version: string;
  updated: string;
  prototype: PrototypeId;
  featured?: boolean;
  features: string[];
  includes: string[];
  tags: string[];
}

export const CONTACT_EMAIL = "hello@gptx.vip";

export const getContactHref = (template: Pick<Template, "name" | "slug">) => {
  const subject = encodeURIComponent(`Project inquiry: ${template.name}`);
  const body = encodeURIComponent(
    `Hello,\n\nI would like to discuss the ${template.name} surface (${template.slug}).\n\nWho will use it:\nData sources available:\nIntegrations required:\nDeployment or support constraints:\nDesired outcome:\n`,
  );
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

export const CATEGORIES = [
  "Analytics",
  "E-commerce",
  "SaaS",
  "Finance",
  "CRM",
  "Marketing",
  "Healthcare",
  "Crypto",
  "Project Management",
] as const;

export const FRAMEWORKS = ["React", "Tailwind CSS"] as const;

export const templates: Template[] = [
  {
    id: "t01",
    slug: "pulse-analytics",
    name: "Pulse Analytics",
    prototype: "pulse-analytics",
    tagline:
      "Product analytics with activation funnels, retention cohorts and session paths",
    description:
      "A product analytics workspace for exploring sample event streams, activation funnels, retention cohorts and session paths. Save report widgets and export the selected event data.",
    category: "Analytics",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Activation trend and segmentation",
      "Unique-user funnel conversion",
      "Retention cohort heatmap",
      "Session event paths",
      "Saved report builder",
      "Simulated event stream and CSV export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["analytics", "events", "cohorts", "funnels"],
  },
  {
    id: "t02",
    slug: "storefront-pro",
    name: "Storefront Pro",
    prototype: "storefront-pro",
    tagline:
      "Orders, inventory and settlement reconciliation in one commerce desk",
    description:
      "A commerce operations workspace with a fulfillment queue, order and customer details, inventory restocking and settlement reconciliation. Changes persist in browser demo data.",
    category: "E-commerce",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Order fulfillment transitions",
      "Order and customer details",
      "Warehouse and status filters",
      "Inventory restocking and alerts",
      "Settlement adjustment audit",
      "Printable orders and CSV export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["orders", "inventory", "operations"],
  },
  {
    id: "t03",
    slug: "ledgerline",
    name: "Ledgerline",
    prototype: "ledgerline",
    tagline: "Account ledgers, reconciliation and cash-flow reporting",
    description:
      "A finance workspace for sample account ledgers, journal entries, statement matching and cash-flow reporting. Account currencies remain separate, with an audit trail for local changes.",
    category: "Finance",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Account and currency selection",
      "Validated journal entries",
      "Statement match and unmatch",
      "Reconciliation discrepancy view",
      "Cash-flow bridge and audit trail",
      "Account ledger CSV export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["accounting", "reconciliation", "cashflow"],
  },
  {
    id: "t04",
    slug: "orbit-crm",
    name: "Orbit CRM",
    prototype: "orbit-crm",
    tagline: "Deal pipelines, relationship context and weighted forecasts",
    description:
      "A relationship workspace with deal-stage transitions, linked companies and contacts, next actions, activity notes and probability-weighted forecasts. Duplicate contact merging updates linked deals.",
    category: "CRM",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Deal pipeline and stage changes",
      "Deal creation and editing",
      "Linked contacts and companies",
      "Activity notes and next actions",
      "Weighted revenue forecast",
      "Duplicate contact review and merge",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["pipeline", "relationships", "forecasting"],
  },
  {
    id: "t05",
    slug: "saas-metrics-kit",
    name: "SaaS Metrics Kit",
    prototype: "saas-metrics-kit",
    tagline: "Recurring revenue movement, retention and payment recovery",
    description:
      "A subscription workspace that connects monthly revenue movement, retention cohorts, sample payment recovery and unit economics. Metric definitions explain calculations and printable reports use the selected context.",
    category: "SaaS",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Monthly recurring revenue bridge",
      "Plan and period filtering",
      "Retention cohort analysis",
      "Sample payment retry and recovery",
      "Plan changes and unit economics",
      "Metric definitions and report export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["mrr", "retention", "subscription"],
  },
  {
    id: "t06",
    slug: "adsphere",
    name: "AdSphere",
    prototype: "adsphere",
    tagline: "Campaign pacing, creative review and channel attribution",
    description:
      "A marketing workspace for sample campaign pacing, channel performance, creative review and attribution comparison. Campaign state and review notes persist locally; exports reflect the selected reporting context.",
    category: "Marketing",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Campaign pacing and state changes",
      "Channel and date filters",
      "Creative approval and review notes",
      "Attribution model comparison",
      "Period performance comparison",
      "Channel CSV and printable digest",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["campaigns", "creatives", "attribution"],
  },
  {
    id: "t07",
    slug: "clinicare",
    name: "CliniCare",
    prototype: "clinicare",
    tagline: "Clinic scheduling, patient flow and masked demo records",
    description:
      "A clinic operations workspace with fictional appointment schedules, patient-flow transitions, staff availability and masked records. Booking checks expose room and clinician conflicts; privacy and session-lock controls are browser demonstrations.",
    category: "Healthcare",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Appointment and room schedule",
      "Conflict-checked booking and rescheduling",
      "Check-in and patient-flow updates",
      "Staff availability management",
      "Masked records and demo session lock",
      "Filtered schedule export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["scheduling", "patient-flow", "masked-demo-data"],
  },
  {
    id: "t08",
    slug: "chainpulse",
    name: "ChainPulse",
    prototype: "chainpulse",
    tagline: "Sample market charts, portfolio context and wallet research",
    description:
      "A research terminal with sample candlestick and depth charts, portfolio holdings, wallet clusters, token events and gas signals. Prices and streaming ticks are simulated fixtures, with no connected trading or wallet service.",
    category: "Crypto",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "OHLC candlesticks and market depth",
      "Simulated tick pause and resume",
      "Portfolio holdings and allocation",
      "Wallet cluster and activity explorer",
      "Token event bookmarks",
      "Gas network analysis and CSV export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["research", "portfolio", "sample-market-data"],
  },
  {
    id: "t09",
    slug: "hq-admin",
    name: "HQ Admin",
    prototype: "hq-admin",
    tagline: "Workspace administration, membership and onboarding",
    description:
      "A browser administration workspace with separate team spaces, membership roles, sample invitations, notifications and onboarding settings. Sign-in and sign-out demonstrate local workspace states.",
    category: "SaaS",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Workspace membership isolation",
      "Sample invitations and revocation",
      "Role changes and final-admin guard",
      "Read and unread notifications",
      "Persistent preferences and onboarding",
      "Local sign-in and error recovery",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["admin", "workspaces", "onboarding"],
  },
  {
    id: "t10",
    slug: "insight-boards",
    name: "Insight Boards",
    prototype: "insight-boards",
    tagline: "Tenant analytics boards, embedding and access previews",
    description:
      "An analytics studio with tenant-specific records and branding, configurable board widgets and working iframe embeds. Role and access controls are client-side sample previews; report schedules are stored browser-demo records.",
    category: "Analytics",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Tenant-specific analytics and branding",
      "Board widget configuration",
      "Accessible theme editing",
      "Member and admin access preview",
      "Working iframe embed code",
      "Local report schedules and CSV export",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["embedded", "tenant-analytics", "boards"],
  },
  {
    id: "t11",
    slug: "fulfillr",
    name: "Fulfillr",
    prototype: "logistics",
    tagline: "AI logistics dispatch and delivery operations console",
    description:
      "A working logistics prototype with delivery dispatch, driver assignments, fleet readiness, schematic routes, exceptions and agent approvals. Sample data persists in your browser.",
    category: "E-commerce",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Delivery dispatch board",
      "Driver assignments",
      "Schematic route overview",
      "Fleet readiness",
      "Exception resolution",
      "Agent approval workflow",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["warehouse", "logistics", "fulfillment"],
  },
  {
    id: "t12",
    slug: "fundview",
    name: "Fundview",
    prototype: "fundview",
    tagline: "Fund NAV, capital activity and investor reporting",
    description:
      "A fund reporting workspace with sample NAV and benchmark history, capital activity, investor commitments and quarterly statements. Print and CSV output reflect the selected fund and quarter; sharing is a local report-preview demonstration.",
    category: "Finance",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Fund and quarter reporting context",
      "NAV and benchmark performance bridge",
      "Validated capital calls and distributions",
      "Investor commitment statements",
      "Sector exposure and quarterly export",
      "Local report sharing and expiry preview",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Browser demo data",
      "Setup guide",
    ],
    tags: ["nav", "capital", "reporting"],
  },
  {
    id: "t13",
    slug: "project-management",
    name: "Project Management",
    prototype: "project-management",
    tagline: "Project overview, kanban boards and team analytics",
    description:
      "An interactive project workspace with a dashboard, project details, activity views, analytics and a draggable kanban board using sample data.",
    category: "Project Management",
    frameworks: ["React", "Tailwind CSS"],
    version: "1.0.0",
    updated: "Oct 2026",
    features: [
      "Project dashboard",
      "Project list and details",
      "Draggable kanban board",
      "Team analytics",
      "Activity timeline",
      "Responsive navigation",
    ],
    includes: [
      "Interactive prototype",
      "TypeScript source",
      "Sample project data",
      "Setup guide",
    ],
    tags: ["projects", "tasks", "kanban", "team"],
  },
];

export const getTemplate = (slug: string) =>
  templates.find((template) => template.slug === slug);
