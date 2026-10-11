# Pulse Analytics

Overview, Funnels, Cohorts, Sessions, Reports / Builder. Stream is a browser simulation every three seconds with deterministic fixture records. Reports preserve selected channel/date window and widgets. Session drilldown and exports use matching ordered events.

## Architecture

`App.tsx` composes root shared controls and product views. `data.ts` owns typed contracts and fictional October 2026 fixtures; `formulas.ts` owns derived mathematics; `actions.ts` owns transitions. Shared root React/Vite runtime, no nested packages.

## State and formulas

Unique active users count distinct user IDs. Ordered funnels consume timestamps in order. Daily cohort retention divides returning users by original cohort size, filtered events only.

Independent versioned local browser state: `gptx.prototype.pulse-analytics.v1`. Confirmed Reset demo restores only this product. Light/dark theme and accessible mobile navigation are local. CSV is a real browser download; print opens an actual sample report. All records are fictional; there is no remote API, connected account, delivery or production guarantee.

## Run

From project root: `npm run dev`, then `/agents/prototypes/pulse-analytics`. Root owns lazy registry, showcase mapping and actual runtime screenshots. Agent C independently records runtime QA in `src/prototype/episodes`.
