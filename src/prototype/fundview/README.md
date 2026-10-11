# Fundview

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/fundview` directly or use the live preview in `/agents/templates/fundview`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Performance; Capital Ledger; Investors; Quarterly Report / Sharing.

Switch fund/quarter/benchmark; inspect investor commitments and dated statements. Record validated positive-cent demo calls/distributions in the selected quarter with linked audit. Select report sections for real print/CSV outputs; reporting/export follows the selected fund/quarter. Enable a local preview for one hour, disable it or simulate expiry. Preview reads saved records in this browser; unknown, disabled or expired shares render unavailable, with a timer checking expiry. This is browser-only access simulation, not secure/public sharing.

## Records, calculations and sample assumptions

Two fictional USD funds own opening NAV, quarterly gain/NAV/benchmark fixtures, investor commitments, capital events and holdings. NAV bridge is opening + calls − distributions + recorded gain = closing. Opening includes previous dated flows and prior period gains, so a new capital event changes subsequent NAV correctly. Chart NAV and benchmark are each rebased to 100 at the first displayed quarter; NAV contains capital flows and is not a time-weighted return or IRR.

Contributions consume commitment; distributions do not restore it. Remaining = commitment − contributions. Available contributed capital = contributions − distributions. Calls cannot exceed overall remaining commitment. Distribution validation evaluates the entire dated investor ledger, preventing both immediate overdraft and an earlier action consuming capital needed for a later saved distribution. Gains are explicit fixture amounts, not fabricated performance calculations. Sector exposure derives from a clearly labeled fixed Q4 holdings snapshot; capital mutations update NAV rather than that static research allocation.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.fundview.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=fundview node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
