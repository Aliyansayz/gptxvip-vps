export type ThumbLayout = 'sidebar' | 'topnav' | 'compact'
export type ChartKind = 'bars' | 'area' | 'donut'
export type DashboardPreviewKind = 'surface'

export interface Template {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  frameworks: string[]
  version: string
  updated: string
  pages: number
  components: number
  accent: string
  layout: ThumbLayout
  chart: ChartKind
  preview?: DashboardPreviewKind
  featured?: boolean
  features: string[]
  includes: string[]
  tags: string[]
}

export const CONTACT_EMAIL = 'aliyan@gptx.vip'

export const getContactHref = (template: Pick<Template, 'name' | 'slug'>) => {
  const subject = encodeURIComponent(`Project inquiry: ${template.name}`)
  const body = encodeURIComponent(`Hello,\n\nI would like to discuss the ${template.name} surface (${template.slug}).\n\nWho will use it:\nData sources available:\nIntegrations required:\nDeployment or support constraints:\nDesired outcome:\n`)
  return `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
}

export const CATEGORIES = [
  'Analytics',
  'E-commerce',
  'SaaS',
  'Finance',
  'CRM',
  'Marketing',
  'Healthcare',
  'Crypto',
] as const

export const FRAMEWORKS = ['React', 'Next.js', 'Vue', 'Angular', 'Tailwind CSS'] as const

export const templates: Template[] = [
  {
    id: 't01', slug: 'pulse-analytics', name: 'Pulse Analytics',
    tagline: 'Real-time product analytics with cohort and funnel views',
    description: 'A focused analytics command center for activation, retention, cohorts, funnels, and session insights. Built on React and Tailwind CSS with Recharts under the hood.',
    category: 'Analytics', frameworks: ['React', 'Tailwind CSS'], version: '3.2.0', updated: 'Aug 2026', pages: 42, components: 180,
    accent: '#6366f1', layout: 'sidebar', chart: 'area', preview: 'surface', featured: true,
    features: ['Cohort retention tables', 'Dashboard builder patterns', 'Real-time data adapter', 'Funnel and path analysis', 'Accessible theme system', 'Report export states'],
    includes: ['Discovery prompts', 'TypeScript source', 'Storybook notes', 'Review checklist'], tags: ['recharts', 'realtime', 'cohorts', 'funnels'],
  },
  {
    id: 't02', slug: 'storefront-pro', name: 'Storefront Pro',
    tagline: 'Commerce operations surface with orders and inventory views',
    description: 'A commerce operations surface for teams that need clear order pipelines, inventory alerts, reconciliation views, and customer context without the noise of a sales flow.',
    category: 'E-commerce', frameworks: ['Next.js', 'Tailwind CSS'], version: '2.7.1', updated: 'Jul 2026', pages: 38, components: 164,
    accent: '#0ea5e9', layout: 'sidebar', chart: 'bars', preview: 'surface', featured: true,
    features: ['Order workflow patterns', 'Inventory alert states', 'Reconciliation tables', 'Customer context panels', 'Printable record layouts', 'Multi-space navigation'],
    includes: ['Conversation brief', 'TypeScript source', 'Integration questions', 'Review checklist'], tags: ['orders', 'inventory', 'operations'],
  },
  {
    id: 't03', slug: 'ledgerline', name: 'Ledgerline',
    tagline: 'Finance and banking dashboard with clear reporting surfaces',
    description: 'Accounting-grade dashboard patterns for ledgers, balance snapshots, cash-flow views, and audit-ready tables, with keyboard-first and WCAG AA-conscious interaction design.',
    category: 'Finance', frameworks: ['React', 'Tailwind CSS'], version: '1.9.0', updated: 'Aug 2026', pages: 31, components: 142,
    accent: '#059669', layout: 'topnav', chart: 'area', preview: 'surface', featured: true,
    features: ['Cash-flow waterfall charts', 'Reconciliation diff views', 'Audit log patterns', 'Multi-currency formatting', 'Keyboard-first data grid', 'Accessible component states'],
    includes: ['Discovery prompts', 'TypeScript source', 'Accessibility notes', 'Review checklist'], tags: ['accounting', 'banking', 'fintech', 'a11y'],
  },
  {
    id: 't04', slug: 'orbit-crm', name: 'Orbit CRM',
    tagline: 'Pipeline-first CRM for modern relationship teams',
    description: 'A relationship workspace centered on visual stages, activity timelines, conversation context, and a clean contacts and companies model.',
    category: 'CRM', frameworks: ['React', 'Tailwind CSS'], version: '4.1.2', updated: 'Jun 2026', pages: 35, components: 156,
    accent: '#f59e0b', layout: 'sidebar', chart: 'donut', preview: 'surface', featured: true,
    features: ['Visual pipeline stages', 'Weighted planning views', 'Activity timeline', 'Conversation context panels', 'Team workspace widgets', 'Duplicate detection patterns'],
    includes: ['Conversation brief', 'TypeScript source', 'Data model notes', 'Review checklist'], tags: ['pipeline', 'relationships', 'forecasting'],
  },
  {
    id: 't05', slug: 'saas-metrics-kit', name: 'SaaS Metrics Kit',
    tagline: 'Subscription metrics and retention dashboards',
    description: 'A concise kit for recurring-product metrics, cohort retention curves, lifecycle movement, and board-ready signal summaries.',
    category: 'SaaS', frameworks: ['Next.js', 'Tailwind CSS'], version: '2.3.0', updated: 'Jul 2026', pages: 24, components: 118,
    accent: '#8b5cf6', layout: 'compact', chart: 'area', preview: 'surface',
    features: ['Lifecycle movement views', 'Cohort retention curves', 'Unit-economics tracker', 'Recovery state patterns', 'Presentation export mode', 'API adapter notes'],
    includes: ['Discovery prompts', 'TypeScript source', 'Metric definitions', 'Review checklist'], tags: ['mrr', 'retention', 'subscription'],
  },
  {
    id: 't06', slug: 'adsphere', name: 'AdSphere',
    tagline: 'Marketing performance hub across every channel',
    description: 'A unified marketing workspace for channel performance, creative review, pacing signals, and drill-down analysis.',
    category: 'Marketing', frameworks: ['Vue', 'Tailwind CSS'], version: '1.8.4', updated: 'May 2026', pages: 27, components: 121,
    accent: '#ec4899', layout: 'topnav', chart: 'bars', preview: 'surface',
    features: ['Cross-channel tables', 'Creative review grid', 'Pacing and alert states', 'Campaign helper utilities', 'Attribution view switcher', 'Digest layout patterns'],
    includes: ['Conversation brief', 'Vue source', 'Integration questions', 'Review checklist'], tags: ['ads', 'campaigns', 'attribution'],
  },
  {
    id: 't07', slug: 'clinicare', name: 'CliniCare',
    tagline: 'Healthcare operations dashboard with privacy-first patterns',
    description: 'A calm operations interface for patient flow, appointments, staffing, and masked data views with privacy-conscious interaction patterns.',
    category: 'Healthcare', frameworks: ['React', 'Tailwind CSS'], version: '1.4.0', updated: 'Aug 2026', pages: 33, components: 138,
    accent: '#14b8a6', layout: 'sidebar', chart: 'area', preview: 'surface',
    features: ['Patient flow views', 'Appointment conflict states', 'Staff scheduling patterns', 'Masked data views', 'Session-timeout patterns', 'Trend sparklines'],
    includes: ['Discovery prompts', 'TypeScript source', 'Privacy notes', 'Review checklist'], tags: ['privacy', 'scheduling', 'patient-flow'],
  },
  {
    id: 't08', slug: 'chainpulse', name: 'ChainPulse',
    tagline: 'Crypto portfolio and on-chain analytics terminal',
    description: 'A research terminal for portfolio context, wallet clustering, token calendars, gas signals, and streaming chart states.',
    category: 'Crypto', frameworks: ['React', 'Tailwind CSS'], version: '2.0.1', updated: 'Jul 2026', pages: 29, components: 133,
    accent: '#f97316', layout: 'compact', chart: 'bars', preview: 'surface',
    features: ['Candlestick and depth charts', 'Portfolio context views', 'Token calendar', 'Wallet clustering', 'Gas signal tracker', 'Streaming data layer'],
    includes: ['Conversation brief', 'TypeScript source', 'Data assumptions', 'Review checklist'], tags: ['web3', 'research', 'onchain'],
  },
  {
    id: 't09', slug: 'hq-admin', name: 'HQ Admin',
    tagline: 'A calm, all-purpose SaaS admin starting point',
    description: 'A flexible foundation for authentication, settings, team spaces, notifications, empty states, and a focused default dashboard.',
    category: 'SaaS', frameworks: ['Next.js', 'Tailwind CSS'], version: '5.0.3', updated: 'Aug 2026', pages: 46, components: 195,
    accent: '#64748b', layout: 'sidebar', chart: 'area', preview: 'surface',
    features: ['Auth and onboarding states', 'Workspace and role views', 'Notification center patterns', 'Empty and error states', 'Theme tokens', 'Responsive admin shell'],
    includes: ['Discovery prompts', 'TypeScript source', 'Architecture notes', 'Review checklist'], tags: ['starter', 'admin', 'boilerplate'],
  },
  {
    id: 't10', slug: 'insight-boards', name: 'Insight Boards',
    tagline: 'Embeddable analytics for customer-facing dashboards',
    description: 'White-label analytics patterns with per-tenant theming, embeddable chart components, usage context, and multi-tenant controls.',
    category: 'Analytics', frameworks: ['Angular', 'Tailwind CSS'], version: '1.2.0', updated: 'Jun 2026', pages: 22, components: 104,
    accent: '#3b82f6', layout: 'topnav', chart: 'donut', preview: 'surface',
    features: ['Per-tenant theming', 'Embeddable chart SDK', 'Usage context views', 'Report scheduling states', 'Row-level security patterns', 'Web-component embeds'],
    includes: ['Conversation brief', 'Angular source', 'Integration questions', 'Review checklist'], tags: ['embedded', 'white-label', 'multi-tenant'],
  },
  {
    id: 't11', slug: 'fulfillr', name: 'Fulfillr',
    tagline: 'Warehouse and fulfillment operations console',
    description: 'A dense but readable operations surface for picking queues, carrier context, returns triage, and service-level alerts.',
    category: 'E-commerce', frameworks: ['Vue', 'Tailwind CSS'], version: '1.6.2', updated: 'Jul 2026', pages: 28, components: 127,
    accent: '#84cc16', layout: 'compact', chart: 'bars', preview: 'surface',
    features: ['Picking queue management', 'Carrier comparison table', 'Returns triage workflow', 'Service-level alerting', 'Large-table patterns', 'Barcode input modes'],
    includes: ['Discovery prompts', 'Vue source', 'Integration questions', 'Review checklist'], tags: ['warehouse', 'logistics', 'fulfillment'],
  },
  {
    id: 't12', slug: 'fundview', name: 'Fundview',
    tagline: 'Portfolio and fund reporting for asset managers',
    description: 'A reporting workspace for NAV history, capital context, distributions, return bridges, and print-ready quarterly views.',
    category: 'Finance', frameworks: ['React', 'Tailwind CSS'], version: '1.1.0', updated: 'Aug 2026', pages: 26, components: 112,
    accent: '#0f766e', layout: 'sidebar', chart: 'area', preview: 'surface',
    features: ['NAV history charts', 'Capital context ledgers', 'Investor portal view', 'Quarterly report export', 'Benchmark overlays', 'Sharing controls'],
    includes: ['Conversation brief', 'TypeScript source', 'Data assumptions', 'Review checklist'], tags: ['funds', 'irr', 'reporting'],
  },
]

export const getTemplate = (slug: string) => templates.find((template) => template.slug === slug)
