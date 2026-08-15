import React from 'react';
import FallbackRoleActivity, { ActivityComponentProps } from './activities/FallbackRoleActivity';

// 1. SEO Agentic Analyst (Days 1..5)
import SerpIntentAuditActivity from './activities/seo/SerpIntentAuditActivity';
import SchemaGraphExtractionActivity from './activities/seo/SchemaGraphExtractionActivity';
import InternalLinkPageRankActivity from './activities/seo/InternalLinkPageRankActivity';
import CoreWebVitalsHydrationActivity from './activities/seo/CoreWebVitalsHydrationActivity';
import ContentOptimizationAgentActivity from './activities/seo/ContentOptimizationAgentActivity';

// 2. Agentic Accountant (Days 1..5)
import DoubleEntryReconciliationActivity from './activities/accountant/DoubleEntryReconciliationActivity';
import BenfordFraudScanActivity from './activities/accountant/BenfordFraudScanActivity';
import TaxNexusComplianceActivity from './activities/accountant/TaxNexusComplianceActivity';
import DecimalPrecisionAuditActivity from './activities/accountant/DecimalPrecisionAuditActivity';
import CashFlowRunwayForecastActivity from './activities/accountant/CashFlowRunwayForecastActivity';

// 3. Agentic Commerce Analyst (Days 1..5)
import PriceElasticityScraperActivity from './activities/commerce/PriceElasticityScraperActivity';
import InventoryRaceConditionActivity from './activities/commerce/InventoryRaceConditionActivity';
import CartAbandonmentAgentActivity from './activities/commerce/CartAbandonmentAgentActivity';
import ReviewSentimentFraudActivity from './activities/commerce/ReviewSentimentFraudActivity';
import CrossBorderSurchargeActivity from './activities/commerce/CrossBorderSurchargeActivity';

// 4. Agentic Recommendation System Analyst (Days 1..5)
import VectorCosineAuditActivity from './activities/recommendation/VectorCosineAuditActivity';
import TwoTowerRetrievalHnswActivity from './activities/recommendation/TwoTowerRetrievalHnswActivity';
import CrossEncoderRerankerActivity from './activities/recommendation/CrossEncoderRerankerActivity';
import ColdStartMemorySynthesisActivity from './activities/recommendation/ColdStartMemorySynthesisActivity';
import FilterBubbleMitigationActivity from './activities/recommendation/FilterBubbleMitigationActivity';

// 5. Data Preprocessing Agentic Specialist (Days 1..5)
import MissingValueImputationActivity from './activities/preprocessing/MissingValueImputationActivity';
import SchemaDriftGuardrailsActivity from './activities/preprocessing/SchemaDriftGuardrailsActivity';
import OutlierZscoreIqrScrubActivity from './activities/preprocessing/OutlierZscoreIqrScrubActivity';
import TargetEncodingLeakageActivity from './activities/preprocessing/TargetEncodingLeakageActivity';
import PolarsArrowPipelineDagActivity from './activities/preprocessing/PolarsArrowPipelineDagActivity';

// 6. Data Visualization Agentic Specialist (Days 1..5)
import ColorContrastA11yActivity from './activities/visualization/ColorContrastA11yActivity';
import HierarchicalSankeyActivity from './activities/visualization/HierarchicalSankeyActivity';
import WebGlHeatmapStreamActivity from './activities/visualization/WebGlHeatmapStreamActivity';
import AutomatedEdaCritiqueActivity from './activities/visualization/AutomatedEdaCritiqueActivity';
import ShapWaterfallExplainabilityActivity from './activities/visualization/ShapWaterfallExplainabilityActivity';

export type { ActivityComponentProps };

/**
 * Master Registry mapping all 30 Chapter Component IDs to dedicated specialized React components.
 * FallbackRoleActivity serves as safe fallback for any unmapped activities.
 */
export const agenticRolesRegistry: Record<string, React.ComponentType<ActivityComponentProps>> = {
  // 1. SEO Agentic Analyst (Days 1..5)
  'seo-day1-serp-intent': SerpIntentAuditActivity,
  'seo-day2-schema-graph': SchemaGraphExtractionActivity,
  'seo-day3-link-graph': InternalLinkPageRankActivity,
  'seo-day4-web-vitals': CoreWebVitalsHydrationActivity,
  'seo-day5-content-optimizer': ContentOptimizationAgentActivity,

  // 2. Agentic Accountant (Days 1..5)
  'accountant-day1-ledger-reconciliation': DoubleEntryReconciliationActivity,
  'accountant-day2-benford-fraud': BenfordFraudScanActivity,
  'accountant-day3-tax-nexus': TaxNexusComplianceActivity,
  'accountant-day4-decimal-precision': DecimalPrecisionAuditActivity,
  'accountant-day5-cashflow-forecast': CashFlowRunwayForecastActivity,

  // 3. Agentic Commerce Analyst (Days 1..5)
  'commerce-day1-price-elasticity': PriceElasticityScraperActivity,
  'commerce-day2-inventory-race-condition': InventoryRaceConditionActivity,
  'commerce-day3-cart-abandonment': CartAbandonmentAgentActivity,
  'commerce-day4-review-fraud': ReviewSentimentFraudActivity,
  'commerce-day5-cross-border-logistics': CrossBorderSurchargeActivity,

  // 4. Agentic Recommendation System Analyst (Days 1..5)
  'recommendation-day1-vector-cosine': VectorCosineAuditActivity,
  'recommendation-day2-two-tower-hnsw': TwoTowerRetrievalHnswActivity,
  'recommendation-day3-cross-encoder-reranker': CrossEncoderRerankerActivity,
  'recommendation-day4-cold-start-memory': ColdStartMemorySynthesisActivity,
  'recommendation-day5-filter-bubble-mitigation': FilterBubbleMitigationActivity,

  // 5. Data Preprocessing Agentic Specialist (Days 1..5)
  'preprocessing-day1-missing-values': MissingValueImputationActivity,
  'preprocessing-day2-schema-drift': SchemaDriftGuardrailsActivity,
  'preprocessing-day3-outlier-scrubbing': OutlierZscoreIqrScrubActivity,
  'preprocessing-day4-target-encoding': TargetEncodingLeakageActivity,
  'preprocessing-day5-polars-arrow-dag': PolarsArrowPipelineDagActivity,

  // 6. Data Visualization Agentic Specialist (Days 1..5)
  'visualization-day1-color-contrast': ColorContrastA11yActivity,
  'visualization-day2-hierarchical-sankey': HierarchicalSankeyActivity,
  'visualization-day3-webgl-heatmaps': WebGlHeatmapStreamActivity,
  'visualization-day4-eda-chart-critique': AutomatedEdaCritiqueActivity,
  'visualization-day5-shap-waterfall': ShapWaterfallExplainabilityActivity,
};

export default agenticRolesRegistry;
