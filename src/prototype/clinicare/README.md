# CliniCare

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/clinicare` directly or use the live preview in `/agents/templates/clinicare`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Today / Flow; Appointments; Staff; Privacy.

Book or reschedule a scheduled appointment; advance the queue, inspect flow history and edit staff availability. Date/clinician/room select schedule, queue, stats and export. Masking changes all patient labels and DOB fields, including print/CSV. Reveal explicitly in Privacy. Idle lock (1/5/15 minutes) resets on pointer/keyboard activity, closes operational dialogs and remasks; manual unlock is a local demonstration.

## Records, calculations and sample assumptions

Patient, Appointment, Clinician and FlowEvent records use explicit stable ID relationships. All names, DOB and care roles are invented. Scheduling timestamps are Asia/Karachi wall-clock strings without offsets; calculation appends Z only to preserve arithmetic independently of the browser timezone. These are dated fixtures, not current clinical records.

Appointments require start before end on one day, clinician availability and no clinician/room overlap. Adjacent slots are valid. Staff availability can be changed and existing exceptions are visibly flagged. Scheduled → checked-in → in-room → completed is the only forward flow. Simulated check-in is the slot start; in-room is its midpoint and completion is its end, so even short slots produce chronological history. Average wait uses recorded check-in/in-room events for the selected appointments.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.clinicare.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=clinicare node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
