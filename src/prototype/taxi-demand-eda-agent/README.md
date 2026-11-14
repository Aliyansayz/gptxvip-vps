# Taxi Demand EDA Agent

Multi-agent exploratory data analysis workspace integrated into Project Surfaces under **Agent And System**.

## Structure

- `workflow/edaEngine.ts` — Pure filtering, KPI computation, chart series binning, statistical aggregation, and deterministic insight synthesis.
- `utils/csvParser.ts` — RFC-compliant CSV parser with alias header matching.
- `data/sampleTaxiData.ts` — Seeded 180-interval urban mobility dataset, 4 agent archetype descriptors, catalog metadata, and state validator.
- `themeSettings/` — Centralized color tokens, UI copy overlays, and copilot preset widgets.
- `components/` — Platform Home, Agent Directory, Taxi Workspace charts/tables/filters/copilot, Data Catalog, and interactive Logicflow & Code views.
- `App.tsx` — Root Shell and `useDemo` state integration.
