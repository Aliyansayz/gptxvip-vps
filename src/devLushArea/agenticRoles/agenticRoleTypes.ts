import type React from 'react';

/**
 * Standard difficulty levels for Agentic Role activities
 */
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NormalizedDifficulty = 'Easy' | 'Medium' | 'Hard' | 'easy' | 'medium' | 'hard';

/**
 * The 6 supported Agentic Job Role Domains
 */
export type RoleDomain = 
  | 'seo' 
  | 'accountant' 
  | 'commerce' 
  | 'recommendation' 
  | 'preprocessing' 
  | 'visualization';

/**
 * The technical and business perspective nature of an activity
 */
export type RoleNatureCategory = 
  | 'technical_execution' 
  | 'business_governance' 
  | 'forensic_audit' 
  | 'pipeline_optimization' 
  | 'ux_perception';

export type CareerLevel = 
  | 'Junior AI Analyst' 
  | 'Mid AI Engineer' 
  | 'Senior Agentic Architect';

/**
 * Core concept tested or taught in an activity
 */
export interface AgenticRoleConcept {
  concept: string;
  definition?: string;
  elaboration?: string;
  industry_application?: string;
}

/**
 * Feedback for specific incorrect choices in assessment
 */
export interface WrongOptionFeedback {
  option: string;
  feedback: string;
}

/**
 * Real-time log entry generated during agent simulation
 */
export interface AgentLogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source?: string;
}

/**
 * Expected tool call trace for autonomous agent evaluation
 */
export interface ExpectedToolCall {
  toolName: string;
  args: Record<string, any>;
  purpose: string;
  expectedOutputSnippet?: string;
}

// -------------------------------------------------------------
// Specialized Domain Telemetry & Payload Schemas
// -------------------------------------------------------------

export interface SeoDomainData {
  targetKeyword: string;
  searchVolume: number;
  searchIntent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  serpCompetitors?: Array<{ rank: number; url: string; title: string; intentScore: number; domainAuthority: number }>;
  schemaGraph?: {
    context: string;
    type: string;
    entities: Array<{ id: string; name: string; type: string; properties: Record<string, any> }>;
  };
  linkEquityGraph?: {
    nodes: Array<{ id: string; url: string; internalInlinks: number; pageRankScore: number }>;
    edges: Array<{ source: string; target: string; weight: number }>;
  };
  webVitals?: {
    lcpMs: number;
    clsScore: number;
    inpMs: number;
    ttfbMs: number;
    payloadKb: number;
  };
}

export interface AccountantDomainData {
  currencyBase: string;
  journalEntries: Array<{
    id: string;
    date: string;
    account: string;
    debit: number;
    credit: number;
    currency: string;
    rate: number;
    verified: boolean;
  }>;
  benfordDistribution?: Array<{
    digit: number;
    expectedFreq: number;
    observedFreq: number;
    anomalyFlag: boolean;
  }>;
  taxJurisdictions?: Array<{
    stateCode: string;
    salesThreshold: number;
    transactionCount: number;
    currentSales: number;
    nexusReached: boolean;
    rate: number;
  }>;
  cashFlowForecast?: {
    currentCash: number;
    monthlyBurn: number;
    runwayMonths: number;
    monteCarloP50: number;
    monteCarloP95: number;
  };
}

export interface CommerceDomainData {
  sku: string;
  productName: string;
  ourPrice: number;
  minMarginFloor: number;
  competitors: Array<{ id: string; name: string; currentPrice: number; undercuttingActive: boolean }>;
  inventoryState: {
    stockAvailable: number;
    allocatedReservations: number;
    ghostStockRiskCount: number;
    lockAcquired: boolean;
  };
  cartAbandonmentFunnel?: {
    intentScore: number;
    cartValue: number;
    timeIdleSeconds: number;
    triggeredIncentivePct: number;
    predictedConversionLift: number;
  };
  fraudulentReviewRing?: {
    clusterScore: number;
    flaggedAccountIds: string[];
    sentimentAnomalyRatio: number;
  };
}

export interface RecommendationDomainData {
  userVector: number[];
  candidateItems: Array<{
    id: string;
    title: string;
    category: string;
    vector: number[];
    cosineSimilarity: number;
    rerankScore?: number;
    popularityDebiasScore?: number;
  }>;
  twoTowerHnswConfig?: {
    efSearch: number;
    mNeighbors: number;
    recallAt10: number;
    latencyMs: number;
  };
  banditExplorationRate?: number;
  coldStartEpisodicMemories?: string[];
}

export interface PreprocessingDomainData {
  datasetName: string;
  totalRows: number;
  missingValuesSummary: Array<{
    column: string;
    nullCount: number;
    nullPercentage: number;
    recommendedImputation: 'KNN' | 'MICE' | 'Median' | 'Drop' | 'Mode';
  }>;
  schemaDriftRules?: Array<{
    field: string;
    expectedType: string;
    actualDetectedType: string;
    coercionSafe: boolean;
  }>;
  outlierProfiles?: Array<{
    column: string;
    q1: number;
    q3: number;
    iqr: number;
    lowerBound: number;
    upperBound: number;
    detectedAnomalies: number;
  }>;
  pipelineDagNodes?: Array<{
    stepId: string;
    name: string;
    engine: 'polars' | 'arrow' | 'pandas';
    memoryUsageMb: number;
    zeroCopy: boolean;
  }>;
}

export interface VisualizationDomainData {
  chartTitle: string;
  chartType: 'bar' | 'sankey' | 'heatmap' | 'waterfall' | 'treemap' | 'scatter' | 'choropleth';
  colorPaletteAudits?: Array<{
    paletteName: string;
    hexCodes: string[];
    contrastRatioAgainstBg: number;
    wcagRating: 'AAA' | 'AA' | 'FAIL';
    colorblindSafe: boolean;
  }>;
  webGlMetrics?: {
    renderedPointsCount: number;
    fpsAverage: number;
    gpuMemoryAllocatedMb: number;
  };
  shapWaterfallAttributions?: Array<{
    feature: string;
    baselineValue: number;
    shapContribution: number;
    finalPrediction: number;
  }>;
}

export type RoleSpecificData = 
  | { type: 'seo'; data: SeoDomainData }
  | { type: 'accountant'; data: AccountantDomainData }
  | { type: 'commerce'; data: CommerceDomainData }
  | { type: 'recommendation'; data: RecommendationDomainData }
  | { type: 'preprocessing'; data: PreprocessingDomainData }
  | { type: 'visualization'; data: VisualizationDomainData }
  | Record<string, any>;

// -------------------------------------------------------------
// Interactive Exercise & Assessment Schema
// -------------------------------------------------------------

export interface AgenticRoleExercise {
  id?: string;
  componentId: string;
  dayNumber: number;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  question: string;
  options: string[];
  answer: string;
  correctAnswerIndex?: number;
  explanation: string;
  wrong_answer_feedback?: WrongOptionFeedback[];
  tags?: string[];
  
  // Nature and Perspective
  nature?: RoleNatureCategory;
  perspective?: 'developer_perspective' | 'business_perspective' | 'governance_perspective' | 'candidate_perspective';
  
  // Real-time Simulation & Telemetry
  logs?: AgentLogEntry[];
  expectedToolCalls?: ExpectedToolCall[];
  roleSpecificData?: RoleSpecificData;
  
  // Theory & Real World
  theory_explanation?: string;
  real_world_analogy?: string;
  industry_case_study?: string;
}

/**
 * A Day Milestone Chapter in the Roadmap (e.g. Day 1, Day 2 ... Day N)
 */
export interface AgenticRoleChapter {
  id?: string;
  course: string; // e.g. "SEO Agentic Analyst"
  roleDomain: RoleDomain;
  day: number;
  day_title: string;
  chapter_title: string;
  labComponentId: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  prerequisites?: string[];
  tags: string[];
  critical_concepts: AgenticRoleConcept[];
  interactive_questions: AgenticRoleExercise[];
  theory_content: {
    title: string;
    content: string;
    practical_takeaway?: string;
    analogy?: string;
  };
}

/**
 * Top-Level Role Definition (for Hub, Cards, and Sidebars)
 */
export interface AgenticRoleDefinition {
  id: string; // e.g. "seo-agentic-analyst"
  title: string; // e.g. "SEO Agentic Analyst"
  shortTitle: string; // e.g. "SEO Analyst"
  roleDomain: RoleDomain;
  tagline: string;
  description: string;
  longDescription: string;
  iconName: string;
  icon?: React.ComponentType<{ className?: string }>;
  accentColor: string;
  totalDays: number;
  careerLevel: CareerLevel;
  requiredSkills: string[];
  chapters: AgenticRoleChapter[];
}

/**
 * Filter & Search Query State
 */
export interface AgenticRoleFilterState {
  difficulty: 'all' | Difficulty;
  selectedRoleDomain: 'all' | RoleDomain;
  searchQuery: string;
  dayRange?: [number, number];
}
