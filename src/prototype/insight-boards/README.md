# Insight Boards

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/insight-boards` directly or use the live preview in `/agents/templates/insight-boards`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Board; Tenants / Usage; Embed; Reports / Access.

Switch tenant and preview role; edit board title/accent; add/remove/reorder allowed widgets. Copy iframe markup, open its route or view its actual iframe preview. Create, pause/enable and delete local schedules. Export tenant/role-scoped records from either toolbar or Access.

## Records, calculations and sample assumptions

Three tenants each own branding, a board and usage records. Widget definitions are shared but board order and membership are tenant-specific. Board chart/table/CSV are derived from the same selected tenant and allowed metrics. Admin previews sessions/signups/revenue; Member previews sessions/signups only, including the iframe and CSV. This is a client-side display simulation for fictional records, not secure row-level enforcement.

The direct route accepts ?tenant=<id>&role=Member|Admin&embed=1. Embedded mode renders only that tenant’s board, never another iframe. Copied standard iframe markup uses this exact route. Widget edits are deduplicated and reference actual definitions. Accent saves require a six-digit color with at least 4.5:1 white-text contrast; malformed or inaccessible saved accents are rejected during state recovery. Schedules are tenant/board scoped local records with Weekly/Monthly cadence and an explicit fixture next-run preview; no delivery service exists.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.insight-boards.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=insight-boards node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
