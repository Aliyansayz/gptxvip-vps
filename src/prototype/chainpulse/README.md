# ChainPulse

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/chainpulse` directly or use the live preview in `/agents/templates/chainpulse`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Market; Portfolio; Wallets; Token Calendar / Gas.

Switch asset/window, pause/resume simulation; add/edit nonnegative sample holdings (one per asset). Choose wallet cluster and wallet detail; bookmark token events and select gas network. Export the selected asset/window candles, or holdings when Portfolio is open.

## Records, calculations and sample assumptions

ETH/BTC candles are explicit October fixtures with positive OHLC, low ≤ open/close ≤ high and chronological half-hour timestamps. The SVG body and wick are positioned from those values and an accessible OHLC table provides exact values. Order depth is a deterministic sample around the selected close. Holdings own asset/quantity/average cost, and valuation is quantity × last close; cost is quantity × average cost and P/L is their difference. Allocation is each holding value / total value.

Simulated ticks advance the selected asset by 30 minutes using UTC string arithmetic and update its current candle data. The interval is disposed on pause, asset change and unmount. Ethereum and Arbitrum gas values are separate fictional series; medians and thresholds refer only to the selected network. Wallet clusters filter the directory and selected-wallet activity.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.chainpulse.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=chainpulse node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
