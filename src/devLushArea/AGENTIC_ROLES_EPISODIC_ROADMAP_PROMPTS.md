# Agentic Roles: Complete Episodic Roadmap Engineering Blueprints & Prompts
**Location:** `gptxvip/src/devLushArea/`  
**Reference Architecture:** `gptxvip/src/devLushArea/devLushComponents/devLushTopics/`  
**Target View:** Beside DevLush Topics inside `gptxvip/src/devLushArea/`

---

## Executive Overview & Architectural Strategy

The **Agentic Roles** platform is an interactive, day-by-day career enablement sandbox tailored for next-generation AI agent practitioners. While *DevLush Topics* provides conceptual explorations across domains, **Agentic Roles** provides a structured, progressive **Day 1 to Day N Roadmap** for 6 distinct job titles:

1. **SEO Agentic Analyst**
2. **Agentic Accountant**
3. **Agentic Commerce Analyst**
4. **Agentic Recommendation System Analyst**
5. **Data Preprocessing Agentic Specialist**
6. **Data Visualization Agentic Specialist**

Each job role features:
* **Roadmap Progression:** Structured timeline from **Day 1** to **Day N**.
* **Difficulty Calibration:** Every activity is explicitly tagged as `easy`, `medium`, or `hard`.
* **Role Nature Customization:** Dynamic field schemas adjusted for each domain (e.g., SERP graphs for SEO, Benford/Ledger audits for Accounting, Price elasticity loops for Commerce, Vector cosine math for Recommendations, Imputation pipelines for Preprocessing, WebGL/D3 topologies for Visualization).
* **High-Fidelity Interactive Sandbox:** Live terminal logs, visual state machine simulators, candidate assessment questions, and theory bridges.

---

## Directory & File Structure Blueprint

```
gptxvip/src/devLushArea/
├── agenticRoles/
│   ├── agenticRoleTypes.ts                          <-- Extended Data Contracts & Interfaces
│   ├── agenticRolesRegistry.ts                      <-- Master Component Registry
│   ├── agenticThemeHelpers.ts                       <-- Theme, Color & Badge Utility Tokens
│   ├── AgenticRolesContainer.tsx                    <-- Main Module Coordinator & State
│   │
│   ├── data/                                        <-- Day 1..N Curriculum Datasets
│   │   ├── index.ts                                 <-- Aggregated Dataset Exporter
│   │   ├── seoAgenticAnalyst.json                   <-- SEO Agentic Roadmap (Days 1..5)
│   │   ├── agenticAccountant.json                   <-- Accountant Roadmap (Days 1..5)
│   │   ├── agenticCommerceAnalyst.json              <-- Commerce Roadmap (Days 1..5)
│   │   ├── agenticRecommendationAnalyst.json        <-- Recommender Roadmap (Days 1..5)
│   │   ├── dataPreprocessingAgentic.json            <-- Preprocessing Roadmap (Days 1..5)
│   │   └── dataVisualizationAgentic.json            <-- Visualization Roadmap (Days 1..5)
│   │
│   ├── views/                                       <-- Navigation & Workspace Views
│   │   ├── AgenticRolesSidebar.tsx                  <-- Role Navigation Sidebar
│   │   ├── AgenticRolesHub.tsx                      <-- Roadmap Hub with Day Milestones
│   │   ├── AgenticRolesRunner.tsx                   <-- Interactive Simulation Runner
│   │   ├── AgenticRolesLayout.tsx                   <-- Dual-Pane Layout Shell
│   │   ├── AgenticRolesSearchView.tsx               <-- Full-text Activity Search
│   │   └── components/
│   │       ├── RoadmapMilestoneCard.tsx             <-- Day Milestone Card with Difficulty Badge
│   │       ├── DifficultyBadge.tsx                  <-- Easy / Medium / Hard Badge
│   │       ├── AgentTerminalLog.tsx                 <-- Real-time Agent Log Streamer
│   │       └── CandidateAssessmentWidget.tsx        <-- MCQ & Reasoning Validation Widget
│   │
│   └── activities/                                  <-- Interactive Sandboxes for each Role
│       ├── seo/
│       │   ├── SerpIntentAuditActivity.tsx          <-- Day 1: SERP Intent & Semantic Gap (Easy)
│       │   ├── SchemaGraphExtractionActivity.tsx    <-- Day 2: Schema Graph & JSON-LD (Medium)
│       │   ├── InternalLinkPageRankActivity.tsx     <-- Day 3: Link Graph & PageRank (Medium)
│       │   ├── CoreWebVitalsHydrationActivity.tsx   <-- Day 4: CWV & Hydration Profiler (Hard)
│       │   └── ContentOptimizationAgentActivity.tsx <-- Day 5: Canonical Hallucination (Hard)
│       │
│       ├── accountant/
│       │   ├── DoubleEntryReconciliationActivity.tsx<-- Day 1: Multi-Currency Ledger (Easy)
│       │   ├── BenfordFraudScanActivity.tsx         <-- Day 2: Benford's Law Audit (Medium)
│       │   ├── TaxNexusComplianceActivity.tsx       <-- Day 3: Multi-Jurisdiction Tax (Medium)
│       │   ├── DecimalPrecisionAuditActivity.tsx    <-- Day 4: Decimal Float Leaks (Hard)
│       │   └── CashFlowRunwayForecastActivity.tsx   <-- Day 5: Autonomous Burn Rate (Hard)
│       │
│       ├── commerce/
│       │   ├── PriceElasticityScraperActivity.tsx   <-- Day 1: Competitor Price Scraping (Easy)
│       │   ├── InventoryRaceConditionActivity.tsx   <-- Day 2: Ghost Stock Collision (Medium)
│       │   ├── CartAbandonmentAgentActivity.tsx     <-- Day 3: Dynamic Incentive Dispatch (Medium)
│       │   ├── ReviewSentimentFraudActivity.tsx     <-- Day 4: Fraud Review Rings (Hard)
│       │   └── CrossBorderSurchargeActivity.tsx     <-- Day 5: Dynamic Tariffs & Logistics (Hard)
│       │
│       ├── recommendation/
│       │   ├── VectorCosineAuditActivity.tsx        <-- Day 1: Vector Embeddings Math (Easy)
│       │   ├── TwoTowerRetrievalHnswActivity.tsx    <-- Day 2: Two-Tower & HNSW Tuning (Medium)
│       │   ├── CrossEncoderRerankerActivity.tsx     <-- Day 3: Re-Ranking & Bandits (Medium)
│       │   ├── ColdStartMemorySynthesisActivity.tsx <-- Day 4: Cold-Start Persona Memory (Hard)
│       │   └── FilterBubbleMitigationActivity.tsx   <-- Day 5: Bias & Bubble Bursting (Hard)
│       │
│       ├── preprocessing/
│       │   ├── MissingValueImputationActivity.tsx   <-- Day 1: KNN & MICE vs Median (Easy)
│       │   ├── SchemaDriftGuardrailsActivity.tsx    <-- Day 2: Schema Drift & Types (Medium)
│       │   ├── OutlierZscoreIqrScrubActivity.tsx    <-- Day 3: Outlier Isolation (Medium)
│       │   ├── TargetEncodingLeakageActivity.tsx    <-- Day 4: Target Encoding Leaks (Hard)
│       │   └── PolarsArrowPipelineDagActivity.tsx   <-- Day 5: Polars/Arrow Memory DAG (Hard)
│       │
│       └── visualization/
│           ├── ColorContrastA11yActivity.tsx        <-- Day 1: WCAG AAA Color Synthesizer (Easy)
│           ├── HierarchicalSankeyActivity.tsx       <-- Day 2: Sankey & Flow Visualizer (Medium)
│           ├── WebGlHeatmapStreamActivity.tsx       <-- Day 3: High-Density Canvas Heatmap (Medium)
│           ├── AutomatedEdaCritiqueActivity.tsx     <-- Day 4: EDA Chart Critique (Hard)
│           └── ShapWaterfallExplainabilityActivity.tsx <-- Day 5: SHAP Feature Attribution (Hard)
```

---

# Episodic Implementation Prompts & Acceptance Criteria

The following 8 sequential episodic prompts are structured for immediate modular execution. Each prompt includes detailed functional requirements, complete code patterns, UI styling, and **explicit, testable Acceptance Criteria**.

---

## Episode 1: Type System & Domain Schema Architecture

### Objective
Create the TypeScript contract file `gptxvip/src/devLushArea/agenticRoles/agenticRoleTypes.ts` that defines the schema for Agentic Roles, Day 1..N roadmaps, difficulty levels (`easy`, `medium`, `hard`), and role-specific metadata.

```markdown
### PROMPT: EPISODE 1 — Type System & Domain Schema Architecture

**Context:**
We are building the 'Agentic Roles' sub-application in `gptxvip/src/devLushArea/agenticRoles/`.
Agentic Roles provides structured Day 1..Day N roadmaps for candidates learning AI agent analysis across 6 specialized job titles.

**File to Create:**
`gptxvip/src/devLushArea/agenticRoles/agenticRoleTypes.ts`

**Requirements:**
1. Export standard types:
   - `Difficulty = 'easy' | 'medium' | 'hard'`
   - `RoleDomain = 'seo' | 'accountant' | 'commerce' | 'recommendation' | 'preprocessing' | 'visualization'`
   - `RoleNatureCategory = 'technical_execution' | 'business_governance' | 'forensic_audit' | 'pipeline_optimization' | 'ux_perception'`
2. Export interfaces:
   - `AgenticRoleConcept`: Concept name, definition, elaboration, industry application.
   - `AgenticRoleExercise`:
     - `id`: string
     - `componentId`: string
     - `dayNumber`: number (1, 2, 3...)
     - `difficulty`: Difficulty
     - `title`: string
     - `prompt`: string
     - `question`: string
     - `options`: string[]
     - `answer`: string
     - `explanation`: string
     - `tags`: string[]
     - Role-specific telemetry and state properties:
       - `roleSpecificData?: SeoDomainData | AccountantDomainData | CommerceDomainData | RecommendationDomainData | PreprocessingDomainData | VisualizationDomainData | Record<string, any>`
       - `expectedToolCalls?: Array<{ toolName: string; args: Record<string, any>; purpose: string; }>`
       - `logs?: Array<{ timestamp: string; level: 'info' | 'warn' | 'error' | 'success'; message: string; }>`
   - `AgenticRoleChapter` (Day Milestone):
     - `course`: string (e.g., 'SEO Agentic Analyst')
     - `roleDomain`: RoleDomain
     - `day`: number
     - `day_title`: string
     - `chapter_title`: string
     - `labComponentId`: string
     - `difficulty`: Difficulty
     - `estimatedMinutes`: number
     - `prerequisites`: string[]
     - `critical_concepts`: AgenticRoleConcept[]
     - `interactive_questions`: AgenticRoleExercise[]
     - `theory_content`: { title: string; content: string; practical_takeaway?: string; }
   - `AgenticRoleDefinition`:
     - `id`: string
     - `title`: string
     - `shortTitle`: string
     - `roleDomain`: RoleDomain
     - `tagline`: string
     - `description`: string
     - `longDescription`: string
     - `iconName`: string
     - `accentColor`: string
     - `totalDays`: number
     - `careerLevel`: 'Junior AI Analyst' | 'Mid AI Engineer' | 'Senior Agentic Architect'
     - `chapters`: AgenticRoleChapter[]

3. Export helper types: `AgenticRoleFilterState` (difficulty, dayRange, searchQuery, selectedRole).
```

### Acceptance Criteria for Episode 1:
- [x] **File Location:** `gptxvip/src/devLushArea/agenticRoles/agenticRoleTypes.ts` exists and is formatted according to TypeScript standards.
- [x] **Difficulty Types:** `Difficulty` is strictly typed to `'easy' | 'medium' | 'hard'` and `NormalizedDifficulty` is exported.
- [x] **Role Domains:** `RoleDomain` includes all 6 titles: `'seo' | 'accountant' | 'commerce' | 'recommendation' | 'preprocessing' | 'visualization'`.
- [x] **Domain Payloads:** Dedicated telemetry interfaces (`SeoDomainData`, `AccountantDomainData`, `CommerceDomainData`, `RecommendationDomainData`, `PreprocessingDomainData`, `VisualizationDomainData`) and the `RoleSpecificData` union are fully exported.
- [x] **Roadmap Contracts:** `AgenticRoleChapter` includes `day` (number), `day_title`, `difficulty`, `critical_concepts`, and `interactive_questions`.
- [x] **Compilation:** TypeScript validates `agenticRoleTypes.ts` with zero compilation or syntax errors.

---

## Episode 2: Complete Curriculum Datasets (JSON) for All 6 Roles

### Objective
Create structured curriculum JSON datasets in `gptxvip/src/devLushArea/agenticRoles/data/` for all 6 job titles, with progressive Day 1..Day 5 roadmaps, easy/medium/hard assignments, and comprehensive interactive questions.

```markdown
### PROMPT: EPISODE 2 — Curriculum Datasets for All 6 Agentic Roles

**Context:**
We need the complete JSON datasets for each of the 6 roles under `gptxvip/src/devLushArea/agenticRoles/data/`.

**Files to Create:**
1. `seoAgenticAnalyst.json`
2. `agenticAccountant.json`
3. `agenticCommerceAnalyst.json`
4. `agenticRecommendationAnalyst.json`
5. `dataPreprocessingAgentic.json`
6. `dataVisualizationAgentic.json`
7. `index.ts` (Aggregates and exports all data arrays)

**Data Specification for Each Role:**

#### 1. `seoAgenticAnalyst.json` (Role: SEO Agentic Analyst)
- **Day 1 (Easy):** "SERP Intent & Semantic Gap Auditing" — Ingest keyword clusters, parse SERP competitors, identify informational vs transactional intent voids.
- **Day 2 (Medium):** "Schema Graph & JSON-LD Entity Extraction" — Autonomous extraction and validation of Schema.org nested entities for Google Knowledge Graph.
- **Day 3 (Medium):** "Programmatic Link Graph & PageRank Flow" — Directed graph analysis of internal link equity and orphan page remediation.
- **Day 4 (Hard):** "Core Web Vitals & Hydration Profiling" — Agentic inspection of JavaScript payload size, TTFB, and LCP bottlenecks.
- **Day 5 (Hard):** "Agentic Content Generation with Canonical Guardrails" — Autonomous content drafting preventing duplicate content penalties and canonical misconfigurations.

#### 2. `agenticAccountant.json` (Role: Agentic Accountant)
- **Day 1 (Easy):** "Multi-Currency Double-Entry Ledger Reconciliation" — Balance sheet reconciliation across multi-currency transactions.
- **Day 2 (Medium):** "Benford's Law Forensic Fraud Anomaly Scanning" — First-digit logarithmic frequency distribution audit across vendor receipts.
- **Day 3 (Medium):** "Multi-Jurisdiction Sales Tax & Nexus Compliance" — Automated calculation of nexus thresholds and tax liability.
- **Day 4 (Hard):** "Decimal Precision & Floating-Point Leakage Audit" — IEEE-754 rounding error remediation in high-volume micro-transactions.
- **Day 5 (Hard):** "Autonomous Burn Rate & Cash Runway Forecasting" — Monte Carlo probabilistic cash-flow modeling.

#### 3. `agenticCommerceAnalyst.json` (Role: Agentic Commerce Analyst)
- **Day 1 (Easy):** "Competitor Price Scraping & Elasticity Modeling" — Dynamic pricing agent reaction to competitor price shifts.
- **Day 2 (Medium):** "Inventory Race Conditions & Ghost Stock Collision" — Parallel procurement agent deadlock detection and distributed locks.
- **Day 3 (Medium):** "Predictive Cart Abandonment & Triggered Incentives" — User intent modeling for timely coupon dispatch without margin erosion.
- **Day 4 (Hard):** "Marketplace Review Sentiment & Fraudulent Ring Detection" — Graph clustering of coordinated fake buyer accounts.
- **Day 5 (Hard):** "Cross-Border Tariffs & Dynamic Logistics Surcharging" — Real-time shipping container fee re-routing and landed cost calculation.

#### 4. `agenticRecommendationAnalyst.json` (Role: Agentic Recommendation System Analyst)
- **Day 1 (Easy):** "Vector Embeddings & Cosine Distance Auditing" — Semantic space vectorization of product catalogs.
- **Day 2 (Medium):** "Two-Tower Retrieval & Approximate Nearest Neighbor (HNSW)" — High-throughput candidate generation with HNSW index tuning.
- **Day 3 (Medium):** "Cross-Encoder Re-Ranking & Contextual Multi-Armed Bandits" — Real-time exploration vs exploitation reranking.
- **Day 4 (Hard):** "Cold-Start User Persona Synthesis with Memory Stores" — LLM episodic memory extraction for new user profile initialization.
- **Day 5 (Hard):** "Recommendation Bias Mitigation & Filter Bubble Bursting" — Serendipity metrics and popularity debiasing algorithms.

#### 5. `dataPreprocessingAgentic.json` (Role: Data Preprocessing Agentic Specialist)
- **Day 1 (Easy):** "Automated Missing Value Imputation (KNN vs MICE)" — Selective imputation strategy based on missing-at-random (MAR) tests.
- **Day 2 (Medium):** "Schema Drift Detection & Type Coercion Guardrails" — Pydantic/Zod runtime contract enforcement across upstream API changes.
- **Day 3 (Medium):** "Multimodal Outlier Scrubbing via IQR & Isolation Forests" — Anomaly detection across mixed tabular and unstructured metadata.
- **Day 4 (Hard):** "High-Cardinality Target Encoding & Leakage Prevention" — Out-of-fold target encoding preventing train-test data contamination.
- **Day 5 (Hard):** "Polars & Apache Arrow Memory DAG Pipeline Tuning" — Zero-copy streaming transformations and memory leak remediation.

#### 6. `dataVisualizationAgentic.json` (Role: Data Visualization Agentic Specialist)
- **Day 1 (Easy):** "WCAG AAA Perceptual Color Palette Synthesizer" — Colorblind-friendly palette generation for multi-series dashboards.
- **Day 2 (Medium):** "Hierarchical Sankey Diagrams & User Flow Visualizer" — Energy and conversion loss mapping with directed cyclic graphs.
- **Day 3 (Medium):** "High-Density WebGL / Canvas Heatmap Telemetry" — Rendering 100,000+ real-time telemetry nodes without UI thread blocking.
- **Day 4 (Hard):** "Automated EDA Chart Generation & Chart Junk Critique" — Tufte data-ink ratio optimization and deceptive scale detection.
- **Day 5 (Hard):** "Interactive Model Explainability (SHAP Waterfall Visualizer)" — Visualizing global and local feature contributions in tree models.
```

### Acceptance Criteria for Episode 2:
- [x] **File Presence:** All 6 JSON files and `gptxvip/src/devLushArea/agenticRoles/data/index.ts` exist.
- [x] **Curriculum Completeness:** Exactly 30 roadmap day chapters are defined (5 days per role x 6 roles).
- [x] **Roadmap Day Progression:** Each role contains Day 1 (`easy`), Day 2 (`medium`), Day 3 (`medium`), Day 4 (`hard`), and Day 5 (`hard`) missions in sequential order.
- [x] **Schema Compliance:** Every chapter matches the `AgenticRoleChapter` interface with valid `critical_concepts`, `interactive_questions`, and `theory_content`.
- [x] **Interactive Payload Quality:** Each question includes realistic `options`, `answer`, `explanation`, `logs`, and `roleSpecificData` tailored to the job title.
- [x] **Data Export Integrity:** `data/index.ts` aggregates all arrays and exports `agenticRolesChaptersRaw` along with role-specific constants.

---

## Episode 3: Activity Component Registry & Theme Design Tokens

### Objective
Create `agenticThemeHelpers.ts` for styling tokens and `agenticRolesRegistry.ts` mapping each `labComponentId` to its interactive React component.

```markdown
### PROMPT: EPISODE 3 — Component Registry & Theme Design Tokens

**Context:**
We need the master registry and theme helpers for Agentic Roles.

**Files to Create:**
1. `gptxvip/src/devLushArea/agenticRoles/agenticThemeHelpers.ts`
2. `gptxvip/src/devLushArea/agenticRoles/agenticRolesRegistry.ts`

**Specifications:**

#### `agenticThemeHelpers.ts`:
- Define theme color configurations for each of the 6 roles:
  - `seo`: Emerald / Teal (e.g. `border-emerald-500`, `bg-emerald-500/10`, `text-emerald-400`)
  - `accountant`: Amber / Yellow (e.g. `border-amber-500`, `bg-amber-500/10`, `text-amber-400`)
  - `commerce`: Rose / Fuchsia (e.g. `border-rose-500`, `bg-rose-500/10`, `text-rose-400`)
  - `recommendation`: Indigo / Violet (e.g. `border-indigo-500`, `bg-indigo-500/10`, `text-indigo-400`)
  - `preprocessing`: Cyan / Blue (e.g. `border-cyan-500`, `bg-cyan-500/10`, `text-cyan-400`)
  - `visualization`: Purple / Pink (e.g. `border-purple-500`, `bg-purple-500/10`, `text-purple-400`)
- Difficulty color tokens:
  - `easy`: Green badge (`bg-emerald-500/20 text-emerald-400 border-emerald-500/30`)
  - `medium`: Amber badge (`bg-amber-500/20 text-amber-400 border-amber-500/30`)
  - `hard`: Red badge (`bg-rose-500/20 text-rose-400 border-rose-500/30`)
- Helper functions:
  - `getRoleTheme(domain: string)`
  - `getDifficultyBadge(difficulty: 'easy' | 'medium' | 'hard')`
  - `getCareerLevelBadge(level: string)`

#### `agenticRolesRegistry.ts`:
- Import all 30 activity components (5 days x 6 roles).
- Map each unique `labComponentId` (e.g. `'seo-day1-serp-intent'`, `'accountant-day2-benford-fraud'`, `'commerce-day1-price-elasticity'`, etc.) to its React component.
- Provide a robust fallback component for any missing activity with a preview simulator.
```

### Acceptance Criteria for Episode 3:
- [x] **Design Tokens:** `agenticThemeHelpers.ts` exports distinct, accessible color tokens for all 6 role domains and difficulty pills.
- [x] **Badge Resolvers:** `getDifficultyBadge('easy' | 'medium' | 'hard')` returns proper styling classes, icons, and labels.
- [x] **Complete Registry Mapping:** `agenticRolesRegistry.ts` contains entries for all 30 `labComponentId` strings.
- [x] **Fallback Component:** If an activity ID is unmapped or loading, a styled `FallbackRoleActivity` renders rather than throwing a runtime error.
- [x] **Strict Typing:** Registry is typed as `Record<string, React.ComponentType<any>>` and exported as both named and default export.

---

## Episode 4: Interactive Activity Components & Simulators

### Objective
Implement the interactive activity components for each role under `gptxvip/src/devLushArea/agenticRoles/activities/`.

```markdown
### PROMPT: EPISODE 4 — Interactive Role Activities & Visual Sandboxes

**Context:**
Create rich, interactive activity components with live state manipulation, step execution, logs, and answer verification.

**Directory:** `gptxvip/src/devLushArea/agenticRoles/activities/`

**Key Component Requirements:**
Every activity component must receive props:
```typescript
interface ActivityProps {
  step: number;
  exercises: AgenticRoleExercise[];
  infoVisible: boolean;
  infoPlacement: 'side' | 'bottom';
  settings?: any;
}
```

**Common Interactive Features in Each Activity:**
1. **Simulation Control Bar:** "Run Agent Analysis", "Reset Environment", "Step Forward".
2. **Real-Time Agent Terminal Stream:** Showing realistic CLI logs with timestamps, agent decisions, and tool calls.
3. **Domain-Specific Visualizer:**
   - **SEO:** SERP snippet previews, keyword gap matrix, JSON-LD tree validator.
   - **Accountant:** Double-entry journal table, Benford's Law frequency bar chart, currency converter.
   - **Commerce:** Live pricing war graph, cart abandonment funnel, fake review cluster graph.
   - **Recommendation:** 2D/3D vector space scatterplot, Cosine similarity ranker, Cold-start profile card.
   - **Preprocessing:** Missing value heatmap, schema drift diff viewer, Arrow DAG node graph.
   - **Visualization:** Palette contrast tester (WCAG AAA ratio), Sankey flow diagram, SHAP waterfall chart.
4. **Assessment Console:** Multiple-choice options with immediate explanation and toast feedback.
5. **Theory Bridge:** Collapsible panel explaining real-world business context and engineering tradeoffs.
```

### Acceptance Criteria for Episode 4:
- [x] **Modular Directory Structure:** All 6 subdirectories exist under `activities/` (`seo/`, `accountant/`, `commerce/`, `recommendation/`, `preprocessing/`, `visualization/`).
- [x] **30 Interactive Sandboxes:** All 30 activity files are created and implemented with interactive React state.
- [x] **Live Simulation Workbench:** Every activity provides an interactive action (e.g. "Run Simulation", "Audit Graph", "Verify Ingestion") that dynamically updates telemetry and streams realistic CLI logs.
- [x] **Domain Visuals:** Rich visualizations render (e.g. SVG graphs, bar charts, data tables, memory counters) without external heavy library dependencies.
- [x] **Assessment Flow:** Candidate choice selection locks in, triggers success/error Sonner toasts, and displays technical explanations.
- [x] **No Dead Ends:** Activity components gracefully handle step resets and previous/next step state transitions.

---

## Episode 4.5: Visual Quality Audit, Polish & Interactive Aesthetics Enhancement

### Objective
Audit all 30 interactive activity components created in Episode 4 for visual design flaws, ergonomics, aesthetic polish, and interactive visual feedback. Upgrade key visualizers with SVG vector graphics, interactive dials, live parameter sliders, glassmorphic container aesthetics, and rich micro-animations.

```markdown
### PROMPT: EPISODE 4.5 — Visual Quality Audit & Interactive Aesthetics Polish

**Context:**
The core functionality of all 30 activities in Episode 4 is verified, but several activities rely on static tables or basic text previews. To achieve the "WOW" factor required by enterprise web standards and DevLush aesthetics, we must systematically polish the visual layer across all 6 domains.

**Visual Flaws Identified in Initial Version:**
1. **Flat Previews:** Some activities present data as plain text lists rather than graphical interactive diagrams.
2. **Missing Live Interaction in Visuals:** Users cannot drag, slide parameters, or toggle view modes (e.g., colorblind filters, vector angles, DAG stages) directly inside the visual canvas.
3. **Monochrome Containers:** Dark surfaces lacked depth, subtle glowing accents (`spotlightRgb`), and glassmorphism.
4. **Terminal Log Immersion:** Terminal logs lacked collapsible line views, copy-to-clipboard actions, and visual pulse indicators during active subagent execution.

**Target Enhancements Across Domains:**

1. **SEO Visual Polish:**
   - `InternalLinkPageRankActivity.tsx`: Render an interactive SVG Directed Graph with glowing nodes, directional animated arrows, and PageRank heat halos.
   - `CoreWebVitalsHydrationActivity.tsx`: Add a visual speedometer gauge for LCP/INP with red/amber/green arc zones and interactive hydration timeline breakdown.
   - `SerpIntentAuditActivity.tsx`: Enhance SERP previews with Google snippet card replicas and intent distribution donut/bar meters.

2. **Accountant Visual Polish:**
   - `BenfordFraudScanActivity.tsx`: Dual-layer SVG bar chart overlaying the smooth logarithmic theoretical curve $P(d) = \log_{10}(1 + 1/d)$ against actual observed bars with animated anomaly spikes.
   - `DoubleEntryReconciliationActivity.tsx`: Render a visual balance scale with interactive balance tilt physics showing debit vs credit equilibrium.
   - `CashFlowRunwayForecastActivity.tsx`: Render a Monte Carlo fan chart displaying shaded P10-P50-P90 cash trajectory probability envelopes over 12 months.

3. **Commerce Visual Polish:**
   - `PriceElasticityScraperActivity.tsx`: Render an interactive price timeline chart showing the competitor's undercutting steps and the immutable red dashed margin floor.
   - `InventoryRaceConditionActivity.tsx`: Visual multi-threaded concurrency ladder with animated lock tokens acquiring Redis slots.
   - `ReviewSentimentFraudActivity.tsx`: Render an interactive bipartite buyer-seller graph highlighting the clustered Sybil ring in crimson.

4. **Recommendation Visual Polish:**
   - `VectorCosineAuditActivity.tsx`: Render an interactive 2D Cartesian plane with user vector arrow, candidate vector arrows, and angular arc $\theta$ with live cosine readout.
   - `TwoTowerRetrievalHnswActivity.tsx`: Multi-layer hierarchical graph visualization showing expressway top-layer skip connections down to the dense base layer.
   - `CrossEncoderRerankerActivity.tsx`: Interactive Beta distribution curve visualizer showing probability density functions $\text{Beta}(\alpha, \beta)$ for Thompson Sampling.

5. **Data Preprocessing Visual Polish:**
   - `MissingValueImputationActivity.tsx`: Render a grid heatmap representing missingness patterns across features with before/after MICE imputation toggles.
   - `SchemaDriftGuardrailsActivity.tsx`: Render a split-pane JSON contract diff viewer with color-coded additions, type mutations, and regex validator badges.
   - `PolarsArrowPipelineDagActivity.tsx`: Render an interactive horizontal DAG node pipeline with animated streaming pulse particles between scan, filter, and sink stages.

6. **Data Visualization Visual Polish:**
   - `ColorContrastA11yActivity.tsx`: Add an interactive color vision deficiency toggle (Normal, Deuteranopia, Protanopia, Tritanopia) that transforms the entire palette preview in real time with live contrast ratio meters.
   - `HierarchicalSankeyActivity.tsx`: Render smooth curved SVG Bézier ribbons connecting funnel nodes with hover tooltips and exit leak indicators.
   - `WebGlHeatmapStreamActivity.tsx`: Render a live HTML5 Canvas particle generator with interactive density slider (10k to 150k points) and real-time FPS counter.
   - `ShapWaterfallExplainabilityActivity.tsx`: Render a horizontal waterfall attribution chart with floating positive (emerald) and negative (rose) feature contribution bars.
```

### Acceptance Criteria for Episode 4.5:
- [x] **Visual Depth & Glassmorphism:** All activity containers use polished dark themes (`bg-slate-900/90`, `border-slate-800`, `shadow-xl`) with role-specific accent glow borders.
- [x] **Interactive Visual Canvases:** Key activities feature rich SVG/Canvas interactive diagrams (e.g. 2D Vector plane, Benford distribution curve overlay, SVG Sankey ribbons, animated DAG streaming particles, and colorblind simulation filters).
- [x] **Dynamic Parameter Controls:** Interactive sliders, toggles, and view-mode switchers exist to let users explore parameter changes live (e.g. adjusting vector coordinates, toggling colorblind modes, changing HNSW search depth).
- [x] **Micro-Animations & Feedback:** Buttons, badges, charts, and terminal logs feature smooth CSS transitions, glowing hover effects, and animated loading states.
- [x] **Zero Performance Degradation:** All animations and Canvas/SVG renderings maintain smooth 60 FPS without memory leaks or heavy external dependencies.
- [x] **TypeScript Strictness:** All upgraded activity components compile with zero TypeScript errors under `--jsx react-jsx --esModuleInterop`.

---

## Episode 5: Sidebar, Hub & Roadmap Milestone UI

### Objective
Create the navigation sidebar, the roadmap hub with day-by-day progression cards, difficulty filters, and the runner view.

```markdown
### PROMPT: EPISODE 5 — Navigation Sidebar, Roadmap Hub & Milestone UI

**Context:**
Build the UI view components for Agentic Roles under `gptxvip/src/devLushArea/agenticRoles/views/`.

**Files to Create:**
1. `AgenticRolesSidebar.tsx`
2. `AgenticRolesHub.tsx`
3. `AgenticRolesRunner.tsx`
4. `AgenticRolesLayout.tsx`
5. `AgenticRolesSearchView.tsx`
6. `components/RoadmapMilestoneCard.tsx`
7. `components/DifficultyBadge.tsx`
8. `components/AgentTerminalLog.tsx`
9. `components/CandidateAssessmentWidget.tsx`

**Feature Specifications:**

#### 1. `AgenticRolesSidebar.tsx`:
- Collapsible sidebar (w-64 expanded, w-20 collapsed).
- Displays all 6 Job Titles with icons (Search, Calculator, ShoppingBag, Compass, Database, BarChart2).
- Shows progress indicators for each role (e.g. "Day 3/5 Completed").
- Quick difficulty filter buttons (`All`, `Easy`, `Medium`, `Hard`).
- Exit and search buttons matching DevLush aesthetics.

#### 2. `AgenticRolesHub.tsx`:
- Hero header showing Role Title, Career Level badge, total activities, and estimated hours.
- Day-by-Day Roadmap Timeline (Day 1 -> Day 2 -> Day 3 -> Day 4 -> Day 5).
- Filter controls by Difficulty (`Easy`, `Medium`, `Hard`) and search query.
- Interactive `RoadmapMilestoneCard`:
  - Day badge (`DAY 01`, `DAY 02`...).
  - Difficulty pill (`easy` in green, `medium` in amber, `hard` in red).
  - Estimated completion time (e.g., `25 mins`).
  - Core concepts chips.
  - Spotlight hover gradient effect.
  - "Launch Day Mission" action button.

#### 3. `AgenticRolesRunner.tsx`:
- Header with back navigation, Day indicator, progress stepper (Step 1 of N).
- Settings toggles (Theme, Theory panel placement side/bottom, auto-run logs).
- Split-pane layout rendering the active Activity Component alongside the theory drawer.
- Energy consumption hook integration.
```

### Acceptance Criteria for Episode 5:
- [x] **Collapsible Sidebar:** `AgenticRolesSidebar.tsx` smoothly toggles between expanded (256px) and icon-only (80px) states with active role highlights.
- [x] **Roadmap Hub Layout:** `AgenticRolesHub.tsx` renders a Day 1 to Day 5 timeline view with day milestone numbers (`DAY 01`..`DAY 05`).
- [x] **Difficulty Filter Chips:** Clicking `Easy`, `Medium`, or `Hard` filters the visible roadmap cards in real-time.
- [x] **Card Spotlight Interaction:** `RoadmapMilestoneCard.tsx` renders an interactive cursor-following radial gradient spotlight.
- [x] **Runner Dual-Pane Shell:** `AgenticRolesRunner.tsx` supports side-by-side or stacked orientation, session step persistence, and exit/back navigation.

---

## Episode 6: Master Container & Top-Level Application Integration

### Objective
Create `AgenticRolesContainer.tsx` and integrate the new view into `Navbar.tsx` and `DevLabsAgentWorkspaceView.tsx`.

```markdown
### PROMPT: EPISODE 6 — Master Container & Application Integration

**Context:**
Integrate Agentic Roles into the top-level application navigation.

**Files to Create / Modify:**
1. **[NEW]** `gptxvip/src/devLushArea/agenticRoles/AgenticRolesContainer.tsx`
2. **[MODIFY]** `gptxvip/src/devLushArea/agentDevRootComponents/Navbar.tsx`
3. **[MODIFY]** `gptxvip/src/devLushArea/DevLabsAgentWorkspaceView.tsx`

**Integration Steps:**

#### 1. `AgenticRolesContainer.tsx`:
- Manage active role selection (`activeRoleId`, default: `'seo-agentic-analyst'`).
- Manage active chapter / day selection (`selectedChapter`).
- Deep-linking support from search and favorites.
- Manage search overlay state and sidebar collapse toggle.

#### 2. Update `Navbar.tsx`:
- Extend the `View` union type to include `'agentic-roles'`:
  ```typescript
  type View = ... | 'devlush' | 'agentic-roles' | 'agent-workspace';
  ```
- Add the "Agentic Roles" skewed isometric navigation button beside "devLush Topics":
  ```tsx
  {
    id: 'agentic-roles' as View,
    label: 'Agentic Roles',
    isActive: currentView === 'agentic-roles',
    onClick: () => onViewChange('agentic-roles'),
  }
  ```
- Update mobile drawer menu to include Agentic Roles.

#### 3. Update `DevLabsAgentWorkspaceView.tsx`:
- Add `'agentic-roles'` to `currentView` state.
- Render `<AgenticRolesContainer />` when `currentView === 'agentic-roles'`.
- Pass `consumeEnergy`, `isInteractionLocked`, and deep-linking handlers.
```

### Acceptance Criteria for Episode 6:
- [ ] **Navbar Tab:** "Agentic Roles" skewed isometric button is visible in the desktop navbar and mobile drawer menu.
- [ ] **State Routing:** Clicking "Agentic Roles" in `Navbar.tsx` switches `currentView` to `'agentic-roles'` without page reload.
- [ ] **Container Coordination:** `AgenticRolesContainer.tsx` manages role switching, runner modal states, and search dialogs cleanly.
- [ ] **Energy Integration:** Launching a day mission calls `onConsumeEnergy()` and respects lockout when study energy is depleted.
- [ ] **Responsive Transition:** Switching between DevLush Topics, Agent Workspace, and Agentic Roles preserves theme and energy state.

---

 Episode 7: Search, Bookmarks & Theory Bridge Integration

### Objective
Wire full-text search across all 6 roles, favorites/bookmark persistence, and theory collection notes.

```markdown
### PROMPT: EPISODE 7 — Search, Bookmarks & Knowledge Persistence

**Context:**
Ensure candidates can search activities by keyword, difficulty, or role, and bookmark their favorite missions and theories.

**Files to Create / Modify:**
1. `gptxvip/src/devLushArea/agenticRoles/views/AgenticRolesSearchView.tsx`
2. Connect `FavoritesContext` and `TheoryCollectionContext` inside `AgenticRolesRunner.tsx`.
3. Add search indexing for all 6 roles' concepts, prompts, and keywords.

**Requirements:**
- Full-text search with instant highlight matching.
- Filter chips: `All Roles`, `SEO`, `Accountant`, `Commerce`, `Recommendation`, `Preprocessing`, `Visualization`.
- Filter chips for Difficulty: `All`, `Easy`, `Medium`, `Hard`.
- Favorite toggle button storing `courseType: 'agentic-role'`, `labId`, and `chapterTitle` in `localStorage`.
- "Save Theory to Notebook" button saving rich Markdown summaries into `TheoryCollectionContext`.
```

### Acceptance Criteria for Episode 7:
- [x] **Instant Search Modal:** `AgenticRolesSearchView.tsx` filters all 30 activities in real-time as the user types keywords or concept tags.
- [x] **Multi-Dimensional Filters:** Search view supports combined filtering by Role Domain (`SEO`, `Accountant`, etc.) and Difficulty (`Easy`, `Medium`, `Hard`).
- [x] **Favorite Toggle Persistence:** Clicking the Star/Favorite button stores the activity in `FavoritesProvider` and appears in the global Favorites view.
- [x] **Theory Notebook Export:** "Save Theory" button successfully writes concept summaries and analogies to `TheoryCollectionProvider`.
- [x] **Direct Deep Linking:** Clicking any search result or favorite item immediately opens the corresponding day mission in `AgenticRolesRunner.tsx`.

---

## Episode 8: Quality Assurance, Verification & Visual Polish

### Objective
Comprehensive testing across all viewports, dark/light modes, keyboard shortcuts, and simulation execution.

```markdown
### PROMPT: EPISODE 8 — Verification, Testing & Polish

**Context:**
Verify and stress-test the entire Agentic Roles implementation.

**Verification Checklist:**
1. **Compilation & Linting:** Ensure TypeScript builds cleanly with zero `any` regressions on key interfaces.
2. **Navigation Flow:**
   - Click "Agentic Roles" in the navbar -> lands on Agentic Roles Hub.
   - Switch between all 6 roles via the sidebar.
   - Filter by Difficulty (`easy`, `medium`, `hard`) -> verifies proper card filtering.
   - Click "Launch Day Mission" -> loads runner with the corresponding interactive activity.
3. **Interactive Simulation:**
   - Verify terminal log streaming and step transitions.
   - Verify multiple choice question evaluation and toast feedback.
   - Verify energy consumption deduction on start.
4. **Theme & Responsiveness:**
   - Test in Light and Dark mode.
   - Test on mobile (<768px) and desktop (>1024px) viewport widths.
5. **State Persistence:**
   - Verify step progress saved in `sessionStorage`.
   - Verify favorites persist across page reloads.
```

### Acceptance Criteria for Episode 8:
- [ ] **Zero TypeScript Errors:** `npx tsc --noEmit` compiles all files under `agenticRoles/` with zero type errors.
- [ ] **End-to-End User Journey:** A candidate can select any role, view the Day 1..Day 5 roadmap, launch an activity, run the agent simulation, answer questions, and proceed to the next day.
- [ ] **Dark & Light Mode Polish:** All text, badges, borders, terminal windows, and code blocks maintain high contrast (WCAG AA/AAA) in both themes.
- [ ] **Responsive Viewports:** Layout functions seamlessly across 375px mobile screens, tablets, and wide desktop displays without horizontal scroll overflow.
- [ ] **Session & State Persistence:** Resuming a mission restores the active step from `sessionStorage`.

---

## Role Curriculum Summary Table

| Role Title | Day | Mission Title | Difficulty | Core Technique |
| :--- | :---: | :--- | :---: | :--- |
| **SEO Agentic Analyst** | 1 | SERP Intent & Semantic Gap Auditing | `easy` | Keyword clustering & intent classification |
| | 2 | Schema Graph & JSON-LD Entity Extraction | `medium` | Knowledge Graph entity validation |
| | 3 | Programmatic Link Graph & PageRank Flow | `medium` | Directed graph internal link equity |
| | 4 | Core Web Vitals & Hydration Profiling | `hard` | JS payload & TTFB bottleneck analysis |
| | 5 | Agentic Content Generation & Canonicals | `hard` | Duplicate content & canonical enforcement |
| **Agentic Accountant** | 1 | Multi-Currency Double-Entry Reconciliation | `easy` | Currency conversion & ledger balancing |
| | 2 | Benford's Law Forensic Fraud Anomaly Scan | `medium` | First-digit logarithmic distribution |
| | 3 | Multi-Jurisdiction Sales Tax Nexus Audit | `medium` | Economic nexus & tax bracket logic |
| | 4 | Decimal Precision & Float Leakage Audit | `hard` | IEEE-754 rounding error correction |
| | 5 | Autonomous Burn Rate & Cash Runway Forecast | `hard` | Monte Carlo cash flow simulations |
| **Agentic Commerce Analyst** | 1 | Competitor Price Scraping & Elasticity | `easy` | Dynamic price adjustment loops |
| | 2 | Inventory Race Conditions & Ghost Stock | `medium` | Distributed lock & deadlock mitigation |
| | 3 | Predictive Cart Abandonment Incentives | `medium` | Behavioral propensity discount triggers |
| | 4 | Marketplace Review Sentiment & Fraud Rings | `hard` | Coordinated bot ring graph clustering |
| | 5 | Cross-Border Tariffs & Dynamic Logistics | `hard` | Landed cost optimization engine |
| **Agentic Recommendation System Analyst** | 1 | Vector Embeddings & Cosine Distance Audits | `easy` | High-dimensional embedding math |
| | 2 | Two-Tower Retrieval & HNSW Index Tuning | `medium` | Approximate Nearest Neighbor scaling |
| | 3 | Cross-Encoder Re-Ranking & Bandit Tuning | `medium` | Multi-armed bandit exploration |
| | 4 | Cold-Start User Persona Synthesis | `hard` | LLM episodic memory extraction |
| | 5 | Recommendation Bias & Filter Bubble Burst | `hard` | Popularity debiasing & serendipity |
| **Data Preprocessing Agentic Specialist** | 1 | Automated Missing Value Imputation | `easy` | MAR testing & KNN/MICE imputation |
| | 2 | Schema Drift Detection & Type Guardrails | `medium` | Runtime contract enforcement |
| | 3 | Multimodal Outlier Scrubbing via IQR | `medium` | Isolation forest & IQR filtering |
| | 4 | Target Encoding & Leakage Prevention | `hard` | Out-of-fold target encoding |
| | 5 | Polars & Apache Arrow Memory DAG Tuning | `hard` | Zero-copy streaming transformations |
| **Data Visualization Agentic Specialist** | 1 | WCAG AAA Perceptual Color Synthesizer | `easy` | Color contrast & colorblind mapping |
| | 2 | Hierarchical Sankey & User Flow Visualizer| `medium` | Directed cyclic graph layout |
| | 3 | High-Density WebGL / Canvas Heatmaps | `medium` | 100k+ point canvas rendering |
| | 4 | Automated EDA Chart Critique | `hard` | Tufte data-ink ratio optimization |
| | 5 | Interactive SHAP Waterfall Explainability | `hard` | Feature attribution visual decomposition |

---
