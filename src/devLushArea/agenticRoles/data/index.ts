import seoData from './seoAgenticAnalyst.json';
import accountantData from './agenticAccountant.json';
import commerceData from './agenticCommerceAnalyst.json';
import recommendationData from './agenticRecommendationAnalyst.json';
import preprocessingData from './dataPreprocessingAgentic.json';
import visualizationData from './dataVisualizationAgentic.json';
import { industryRoleChapters } from './industryRoleChapters';

import { AgenticRoleChapter, AgenticRoleDefinition } from '../agenticRoleTypes';

export const seoAgenticChapters = [...seoData, ...industryRoleChapters.seo] as AgenticRoleChapter[];
export const accountantAgenticChapters = [...accountantData, ...industryRoleChapters.accountant] as AgenticRoleChapter[];
export const commerceAgenticChapters = [...commerceData, ...industryRoleChapters.commerce] as AgenticRoleChapter[];
export const recommendationAgenticChapters = [...recommendationData, ...industryRoleChapters.recommendation] as AgenticRoleChapter[];
export const preprocessingAgenticChapters = [...preprocessingData, ...industryRoleChapters.preprocessing] as AgenticRoleChapter[];
export const visualizationAgenticChapters = [...visualizationData, ...industryRoleChapters.visualization] as AgenticRoleChapter[];

export const mobilityAgenticChapters = industryRoleChapters.mobility;
export const retailAgenticChapters = industryRoleChapters.retail;
export const procurementAgenticChapters = industryRoleChapters.procurement;
export const contractsAgenticChapters = industryRoleChapters.contracts;
export const uiuxAgenticChapters = industryRoleChapters.uiux;

/**
 * Master flat array of all Agentic Role Chapters
 */
export const agenticRolesChaptersRaw: AgenticRoleChapter[] = [
  ...seoAgenticChapters,
  ...accountantAgenticChapters,
  ...commerceAgenticChapters,
  ...recommendationAgenticChapters,
  ...preprocessingAgenticChapters,
  ...visualizationAgenticChapters,
  ...mobilityAgenticChapters,
  ...retailAgenticChapters,
  ...procurementAgenticChapters,
  ...contractsAgenticChapters,
  ...uiuxAgenticChapters,
];

/**
 * Top-Level Role Definitions for Sidebars, Roadmap Hubs, and Career Progress Tracking
 */
export const agenticRoleDefinitions: AgenticRoleDefinition[] = [
  {
    id: 'seo-agentic-analyst',
    title: 'SEO Agentic Analyst',
    shortTitle: 'SEO Analyst',
    roleDomain: 'seo',
    tagline: 'Autonomous search intelligence, entity graphs, and technical performance profiling.',
    description: 'Master autonomous SERP intent decomposition, nested Schema.org Knowledge Graphs, and Core Web Vitals optimization.',
    longDescription: 'Prepare as an enterprise AI SEO Analyst. Build autonomous scrapers that detect intent shifts, construct directed PageRank link equity graphs, and implement canonical guardrails against search ranking demotions.',
    iconName: 'Search',
    accentColor: 'emerald',
    totalDays: seoAgenticChapters.length,
    careerLevel: 'Junior AI Analyst',
    requiredSkills: ['SERP Scraping', 'Knowledge Graph Schema', 'PageRank Topology', 'Core Web Vitals', 'Canonical Governance'],
    chapters: seoAgenticChapters,
  },
  {
    id: 'agentic-accountant',
    title: 'Agentic Accountant',
    shortTitle: 'Accountant',
    roleDomain: 'accountant',
    tagline: 'Autonomous double-entry integrity, Benford forensic audits, and real-time cash modeling.',
    description: 'Master multi-currency double-entry reconciliation, logarithmic fraud scanning, and arbitrary-precision decimal ledgers.',
    longDescription: 'Step into modern autonomous financial engineering. Implement strict double-entry invariants, uncover invoice fabrication rings with Benford\'s Law, and simulate Monte Carlo cash runways for executive leadership.',
    iconName: 'Calculator',
    accentColor: 'amber',
    totalDays: accountantAgenticChapters.length,
    careerLevel: 'Mid AI Engineer',
    requiredSkills: ['Double-Entry Ledgers', 'Forex Translation', "Benford's Law Forensics", 'Economic Nexus', 'Monte Carlo Runway'],
    chapters: accountantAgenticChapters,
  },
  {
    id: 'agentic-commerce-analyst',
    title: 'Agentic Commerce Analyst',
    shortTitle: 'Commerce Analyst',
    roleDomain: 'commerce',
    tagline: 'Dynamic elasticity repricing, distributed inventory locks, and cross-border trade.',
    description: 'Master multi-agent repricing loops, distributed inventory concurrency, and review fraud detection rings.',
    longDescription: 'Lead next-generation algorithmic commerce. Build margin floor circuit-breakers against predatory competitor bots, enforce distributed Redis locks on flash drops, and optimize multi-warehouse international tariff routes.',
    iconName: 'ShoppingBag',
    accentColor: 'rose',
    totalDays: commerceAgenticChapters.length,
    careerLevel: 'Mid AI Engineer',
    requiredSkills: ['Algorithmic Pricing', 'Distributed Locks', 'Cart Recovery Funnels', 'Review Fraud Graphs', 'Landed Cost Logistics'],
    chapters: commerceAgenticChapters,
  },
  {
    id: 'agentic-recommendation-analyst',
    title: 'Agentic Recommendation System Analyst',
    shortTitle: 'Recommender Analyst',
    roleDomain: 'recommendation',
    tagline: 'High-dimensional vector search, HNSW retrieval tuning, and multi-armed bandit exploration.',
    description: 'Master vector embeddings, Two-Tower HNSW candidate retrieval, and contextual multi-armed bandit re-ranking.',
    longDescription: 'Design low-latency neural recommendation architectures. Tune approximate nearest neighbor indexes for millions of items, balance exploitation with Thompson Sampling bandits, and extract zero-shot personas from LLM memory stores.',
    iconName: 'Compass',
    accentColor: 'indigo',
    totalDays: recommendationAgenticChapters.length,
    careerLevel: 'Senior Agentic Architect',
    requiredSkills: ['Vector Embeddings', 'Two-Tower HNSW', 'Cross-Encoder Re-Ranking', 'Cold-Start Memory', 'Filter Bubble MMR'],
    chapters: recommendationAgenticChapters,
  },
  {
    id: 'data-preprocessing-agentic',
    title: 'Data Preprocessing Agentic Specialist',
    shortTitle: 'Data Preprocessing',
    roleDomain: 'preprocessing',
    tagline: 'Autonomous statistical imputation, schema drift guardrails, and zero-copy Arrow DAGs.',
    description: 'Master multivariate missing data imputation, runtime schema contracts, and high-cardinality target encoding.',
    longDescription: 'Eliminate garbage-in-garbage-out in production machine learning pipelines. Deploy MICE and KNN imputation, enforce runtime data contracts against upstream schema drift, and build zero-copy streaming DAGs in Polars and Apache Arrow.',
    iconName: 'Database',
    accentColor: 'cyan',
    totalDays: preprocessingAgenticChapters.length,
    careerLevel: 'Mid AI Engineer',
    requiredSkills: ['MICE & KNN Imputation', 'Schema Drift Contracts', 'Isolation Forests', 'Out-of-Fold Encoding', 'Polars & Arrow DAGs'],
    chapters: preprocessingAgenticChapters,
  },
  {
    id: 'data-visualization-agentic',
    title: 'Data Visualization Agentic Specialist',
    shortTitle: 'Data Visualization',
    roleDomain: 'visualization',
    tagline: 'Perceptual color palettes, 60 FPS WebGL heatmaps, and SHAP model explainability.',
    description: 'Master WCAG AAA accessible visual encodings, GPU-accelerated canvas streaming, and interactive XAI waterfall charts.',
    longDescription: 'Communicate complex data with visual precision. Synthesize perceptually uniform colorblind-safe palettes, render 150,000+ real-time telemetry nodes with WebGL shaders, and construct regulatory SHAP explainability waterfalls.',
    iconName: 'BarChart2',
    accentColor: 'purple',
    totalDays: visualizationAgenticChapters.length,
    careerLevel: 'Junior AI Analyst',
    requiredSkills: ['WCAG AAA Palettes', 'Sankey Flow Diagrams', 'WebGL / Canvas Shaders', 'Tufte Data-Ink Critique', 'SHAP Waterfall Visuals'],
    chapters: visualizationAgenticChapters,
  },
  {
    id: 'taxi-demand-intelligence', title: 'Taxi Demand Intelligence Agent', shortTitle: 'Taxi Demand', roleDomain: 'mobility',
    tagline: 'Forecast zone demand and recommend feasible driver positioning.',
    description: 'Use trips, weather, events and supply to anticipate ride shortages.',
    longDescription: 'Validate trip feeds, enrich local demand signals, forecast zone-hour requests, investigate anomalies and recommend bounded fleet moves.',
    iconName: 'CarTaxiFront', accentColor: 'cyan', totalDays: mobilityAgenticChapters.length, careerLevel: 'Mid AI Engineer',
    requiredSkills: ['Trip Data Validation', 'Spatiotemporal Joins', 'Zone-Hour Forecasting', 'Anomaly Investigation', 'Fleet Positioning'], chapters: mobilityAgenticChapters,
  },
  {
    id: 'retail-replenishment', title: 'Retail Replenishment Agent', shortTitle: 'Retail Replenishment', roleDomain: 'retail',
    tagline: 'Forecast SKU-store demand and recommend stock movements.',
    description: 'Balance availability, supplier lead times and excess stock.',
    longDescription: 'Estimate demand hidden by stockouts, adjust for promotions, set safety stock and choose transfers or purchases with buyer review.',
    iconName: 'PackageSearch', accentColor: 'rose', totalDays: retailAgenticChapters.length, careerLevel: 'Mid AI Engineer',
    requiredSkills: ['SKU-Store Forecasting', 'Promotion Uplift', 'Safety Stock', 'Depot Transfers', 'Order Exceptions'], chapters: retailAgenticChapters,
  },
  {
    id: 'procurement-intelligence', title: 'Procurement Intelligence Agent', shortTitle: 'Procurement', roleDomain: 'procurement',
    tagline: 'Compare suppliers and reconcile purchasing evidence.',
    description: 'Combine documents and purchase history to reduce cost and payment errors.',
    longDescription: 'Normalize quotations, evaluate supplier reliability, match purchase orders to invoices and receipts, and avoid unnecessary purchases.',
    iconName: 'ClipboardList', accentColor: 'amber', totalDays: procurementAgenticChapters.length, careerLevel: 'Mid AI Engineer',
    requiredSkills: ['Quotation Normalization', 'Supplier Cost', 'Three-Way Match', 'Price Drift', 'Inventory-Aware Buying'], chapters: procurementAgenticChapters,
  },
  {
    id: 'contract-obligation-intelligence', title: 'Contract Obligation Intelligence Agent', shortTitle: 'Contract Obligations', roleDomain: 'contracts',
    tagline: 'Track evidenced duties, deadlines and amendments.',
    description: 'Turn executed agreements into reviewable operational tasks.',
    longDescription: 'Extract source-cited clauses, calculate notice windows, assess SLA evidence and maintain an auditable obligation register.',
    iconName: 'FileText', accentColor: 'purple', totalDays: contractsAgenticChapters.length, careerLevel: 'Mid AI Engineer',
    requiredSkills: ['Clause Extraction', 'Renewal Deadlines', 'SLA Evidence', 'Insurance Tracking', 'Amendment Control'], chapters: contractsAgenticChapters,
  },
  {
    id: 'ui-ux-agentic-specialist', title: 'UI/UX Agentic Specialist', shortTitle: 'UI/UX', roleDomain: 'uiux',
    tagline: 'Accessibility barriers, navigation depth, funnel evidence, and interaction latency budgets.',
    description: 'Audit contrast and semantics, flatten navigation depth, locate funnel drop-off, and hold interface work to a latency budget.',
    longDescription: 'Practice interface work the way an evidence review would. Measure contrast ratios and heading structure, map click depth before a migration, isolate the funnel step that costs the most setups, and treat a slow interaction as a defect rather than a loading state.',
    iconName: 'Palette', accentColor: 'lime', totalDays: uiuxAgenticChapters.length, careerLevel: 'Mid AI Engineer',
    requiredSkills: ['WCAG Contrast & Semantics', 'Focus Order Audits', 'Navigation Depth Mapping', 'Funnel Cohort Analysis', 'Interaction Latency Budgets'], chapters: uiuxAgenticChapters,
  },
];

export default agenticRolesChaptersRaw;
