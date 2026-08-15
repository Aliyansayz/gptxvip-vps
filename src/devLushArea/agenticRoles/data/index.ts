import seoData from './seoAgenticAnalyst.json';
import accountantData from './agenticAccountant.json';
import commerceData from './agenticCommerceAnalyst.json';
import recommendationData from './agenticRecommendationAnalyst.json';
import preprocessingData from './dataPreprocessingAgentic.json';
import visualizationData from './dataVisualizationAgentic.json';

import { AgenticRoleChapter, AgenticRoleDefinition } from '../agenticRoleTypes';

export const seoAgenticChapters = seoData as unknown as AgenticRoleChapter[];
export const accountantAgenticChapters = accountantData as unknown as AgenticRoleChapter[];
export const commerceAgenticChapters = commerceData as unknown as AgenticRoleChapter[];
export const recommendationAgenticChapters = recommendationData as unknown as AgenticRoleChapter[];
export const preprocessingAgenticChapters = preprocessingData as unknown as AgenticRoleChapter[];
export const visualizationAgenticChapters = visualizationData as unknown as AgenticRoleChapter[];

/**
 * Master flat array of all 30 Agentic Role Chapters (Days 1..5 across 6 roles)
 */
export const agenticRolesChaptersRaw: AgenticRoleChapter[] = [
  ...seoAgenticChapters,
  ...accountantAgenticChapters,
  ...commerceAgenticChapters,
  ...recommendationAgenticChapters,
  ...preprocessingAgenticChapters,
  ...visualizationAgenticChapters,
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
    totalDays: 5,
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
    totalDays: 5,
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
    totalDays: 5,
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
    totalDays: 5,
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
    totalDays: 5,
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
    totalDays: 5,
    careerLevel: 'Junior AI Analyst',
    requiredSkills: ['WCAG AAA Palettes', 'Sankey Flow Diagrams', 'WebGL / Canvas Shaders', 'Tufte Data-Ink Critique', 'SHAP Waterfall Visuals'],
    chapters: visualizationAgenticChapters,
  },
];

export default agenticRolesChaptersRaw;
