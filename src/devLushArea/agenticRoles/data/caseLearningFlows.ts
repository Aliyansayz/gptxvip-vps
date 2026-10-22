export interface CaseLearningFlow {
  input: string;
  check: string;
  action: string;
  outcome: string;
}

/** Case-specific reading diagrams. These describe the lesson, not live tool execution. */
export const caseLearningFlows: Record<string, CaseLearningFlow> = {
  'seo-day1-serp-intent': { input: 'Search results and competitor snippets', check: 'Identify the query intent', action: 'Choose a matching content format', outcome: 'A response aligned with the searcher’s task' },
  'seo-day2-schema-graph': { input: 'Page entities and their relationships', check: 'Inspect structured-data types', action: 'Connect entities in a schema graph', outcome: 'A coherent machine-readable description' },
  'seo-day3-link-graph': { input: 'Pages and internal links', check: 'Trace link equity and orphan pages', action: 'Improve the internal link structure', outcome: 'Important pages become easier to discover' },
  'seo-day4-web-vitals': { input: 'Rendering and interaction timings', check: 'Locate blocking tasks', action: 'Reduce unnecessary client hydration', outcome: 'A faster, more responsive page' },
  'seo-day5-content-optimizer': { input: 'Duplicate URLs and entity coverage', check: 'Find canonical and content gaps', action: 'Consolidate URLs and improve useful content', outcome: 'Clearer content with fewer duplicate signals' },
  'accountant-day1-ledger-reconciliation': { input: 'Debits, credits, and exchange rates', check: 'Test the balance invariant', action: 'Record the correct settlement and FX adjustment', outcome: 'A traceable, balanced ledger' },
  'accountant-day2-benford-fraud': { input: 'First digits of invoice amounts', check: 'Compare observed and expected frequencies', action: 'Investigate unusual clusters', outcome: 'An anomaly to review, rather than proof of fraud' },
  'accountant-day3-tax-nexus': { input: 'Sales totals by jurisdiction', check: 'Compare the case thresholds', action: 'Flag registration and collection duties', outcome: 'A jurisdiction-specific compliance decision' },
  'accountant-day4-decimal-precision': { input: 'Currency values and arithmetic', check: 'Inspect binary rounding errors', action: 'Use decimal arithmetic and a rounding policy', outcome: 'Reproducible monetary calculations' },
  'accountant-day5-cashflow-forecast': { input: 'Cash reserves and monthly burn', check: 'Compare runway assumptions', action: 'Evaluate baseline and conservative scenarios', outcome: 'A decision grounded in uncertainty' },
  'commerce-day1-price-elasticity': { input: 'Our price and competitor offers', check: 'Respect the minimum margin', action: 'Apply a guarded repricing decision', outcome: 'Competitive pricing within the case constraints' },
  'commerce-day2-inventory-race-condition': { input: 'Concurrent orders for limited stock', check: 'Identify competing reservations', action: 'Acquire an atomic inventory lock', outcome: 'Stock allocated without duplicate reservations' },
  'commerce-day3-cart-abandonment': { input: 'Cart value and inactivity', check: 'Assess purchase intent', action: 'Choose a proportionate recovery offer', outcome: 'A recovery action with controlled cost' },
  'commerce-day4-review-fraud': { input: 'Reviews and connected accounts', check: 'Look for coordinated patterns', action: 'Quarantine suspicious clusters for review', outcome: 'Review signals that can be investigated' },
  'commerce-day5-cross-border-logistics': { input: 'Shipping routes, duties, and surcharges', check: 'Compare total landed costs', action: 'Select the appropriate fulfillment route', outcome: 'A decision based on the full delivery cost' },
  'recommendation-day1-vector-cosine': { input: 'User and product vectors', check: 'Compare vector direction', action: 'Calculate similarity', outcome: 'Candidates ranked by affinity' },
  'recommendation-day2-two-tower-hnsw': { input: 'User embeddings and an item index', check: 'Balance retrieval recall and latency', action: 'Tune the search configuration', outcome: 'A useful candidate set within the latency budget' },
  'recommendation-day3-cross-encoder-reranker': { input: 'Retrieved candidate items', check: 'Evaluate user–item pairs together', action: 'Rerank the candidate set', outcome: 'A more relevant final ordering' },
  'recommendation-day4-cold-start-memory': { input: 'A new user’s contextual signals', check: 'Identify supported preferences', action: 'Build an initial preference profile', outcome: 'Recommendations that can adapt to new feedback' },
  'recommendation-day5-filter-bubble-mitigation': { input: 'A ranked recommendation feed', check: 'Inspect relevance and diversity', action: 'Balance familiar and exploratory items', outcome: 'A feed with broader useful coverage' },
  'preprocessing-day1-missing-values': { input: 'Columns with missing observations', check: 'Assess missingness and data type', action: 'Choose an appropriate imputation method', outcome: 'A dataset with a documented treatment of gaps' },
  'preprocessing-day2-schema-drift': { input: 'Expected schema and new payloads', check: 'Detect incompatible field types', action: 'Apply safe coercion or quarantine', outcome: 'A validated input boundary' },
  'preprocessing-day3-outlier-scrubbing': { input: 'Column distributions and extreme values', check: 'Compare z-score and IQR boundaries', action: 'Choose a justified outlier treatment', outcome: 'Cleaner data with useful variation preserved' },
  'preprocessing-day4-target-encoding': { input: 'Categorical features and target values', check: 'Detect information crossing the split', action: 'Fit encoding within training folds', outcome: 'A validation result with less target leakage' },
  'preprocessing-day5-polars-arrow-dag': { input: 'Transformations and data buffers', check: 'Inspect copies and memory use', action: 'Plan an efficient columnar pipeline', outcome: 'A transformation graph with fewer unnecessary copies' },
  'visualization-day1-color-contrast': { input: 'Category colors and a chart canvas', check: 'Measure contrast and inspect vision previews', action: 'Add direct labels and redundant patterns', outcome: 'A chart that communicates beyond hue alone' },
  'visualization-day2-hierarchical-sankey': { input: 'Counts across onboarding stages', check: 'Trace flow conservation and losses', action: 'Identify the major drop-off', outcome: 'An interpretable view of the bottleneck' },
  'visualization-day3-webgl-heatmaps': { input: 'A large stream of data points', check: 'Compare rendering and memory costs', action: 'Choose a suitable rendering pipeline', outcome: 'A responsive view of dense data' },
  'visualization-day4-eda-chart-critique': { input: 'Charts, scales, and distributions', check: 'Look for misleading visual encodings', action: 'Correct the chart design', outcome: 'A comparison that reflects the data' },
  'visualization-day5-shap-waterfall': { input: 'A baseline and feature contributions', check: 'Trace positive and negative effects', action: 'Build the contribution breakdown', outcome: 'An explanation of the prediction relative to baseline' },
  'uiux-day1-accessibility-audit-across-contrast-semantics-and-focus-order': { input: 'Colour tokens, headings, and DOM order', check: 'Measure contrast and trace focus order', action: 'Fix each failing requirement at its source', outcome: 'A flow that completes with assistive technology' },
  'uiux-day2-information-architecture-and-navigation-depth': { input: 'Site map and internal link graph', check: 'Count clicks from the root to key pages', action: 'Flatten the structure and stage redirects', outcome: 'Key pages reachable without losing sessions' },
  'uiux-day3-onboarding-funnel-and-activation-drop-off': { input: 'Step events, cohorts, and ticket volume', check: 'Compare per-step conversion against support load', action: 'Investigate the step that loses the most users', outcome: 'A bottleneck named with two independent signals' },
  'uiux-day4-layout-density-and-visual-hierarchy-review': { input: 'Control inventory, spacing tokens, and type scale', check: 'Measure density and grouping on screen', action: 'Group by task and keep the primary action reachable', outcome: 'A screen where the next action is legible' },
  'uiux-day5-interaction-latency-and-perceived-performance-budget': { input: 'Event timings, long tasks, and render counts', check: 'Compare the long task against the budget', action: 'Virtualise the render and keep the interaction inside budget', outcome: 'An interaction that responds instead of a spinner that hides' },
  'uiux-day6-design-token-drift-and-component-consistency': { input: 'Component sources and token definitions', check: 'Match literal values against the token', action: 'Replace literals and guard the component layer', outcome: 'A system that stays consistent after the first fix' },
};
