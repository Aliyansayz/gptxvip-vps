# AdSphere

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/adsphere` directly or use the live preview in `/agents/templates/adsphere`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Campaigns; Creatives; Pacing; Attribution / Digest.

Change a budget using positive USD input; pause/resume a campaign. Review creative with a required note, approving or requesting changes. Export or print the current campaign digest, including selected range, budget, spend and pacing.

## Records, calculations and sample assumptions

Campaigns own USD budgets in cents, channel, date span and active/paused state. DailyPerformance links to campaign IDs. Creative review records link to campaigns; review notes and status are saved. TouchpointConversion has first/last channel and a recorded channel path.

Campaign search, status, channel and date range select performance rows and the digest. Spend, clicks, conversions and pacing derive from those rows. Pacing is selected spend divided by saved campaign budget; elapsed fraction uses the last selected fixture date within the campaign span. Pausing preserves historical performance. Attribution is explicitly a channel/date report across all campaign history: search/status apply to the campaign digest only. First/last models allocate full value to one channel; Linear splits equally across recorded channels. Attribution ROAS uses matching channel/date spend, and a zero denominator displays “No spend”.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.adsphere.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=adsphere node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
