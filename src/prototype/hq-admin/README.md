# HQ Admin

Default React/TypeScript App built for the root Vite application. Open `/agents/prototypes/hq-admin` directly or use the live preview in `/agents/templates/hq-admin`. Run `npm install` and `npm run dev` from the repository root; no nested server or package is required.

## Navigation and workflow

Overview; Members / Roles; Workspaces; Notifications; Settings / Onboarding.

Invite a validated email into the local pending queue, revoke invitations, edit role/status, mark notifications read/unread or clear read records in the current workspace. Settings save display name and appearance; workspace audit exports actual recorded actions. Demo sign-out locks the content and sample-account sign-in restores it. Workspace status has a deterministic simulate-error action and a retry that restores the actual ready state.

## Records, calculations and sample assumptions

Workspace IDs partition members, invitations, notifications and audit. Seed includes three different workspaces, a suspended member and a workspace with no invitations or notifications. Member roles are admin/editor/viewer and statuses active/suspended. Demoting or suspending the final active workspace admin is blocked.

Preferences save current workspace, display name and appearance. System follows prefers-color-scheme and changes when the OS preference changes; Light/Dark override it. The shell header switch updates this same saved preference. Onboarding is derived from workspace/name/team/appearance rather than a fixed percentage. Invitation duplicate checks apply only to current workspace members and pending invitations; revoked addresses may be invited again.

## Architecture and persistence

`App.tsx` composes navigation, state and local forms; `data.ts` defines typed contracts, explicit seeds and semantic validation; `formulas.ts` contains derived calculations; `actions.ts` contains immutable domain transitions; `Views.tsx` renders domain-specific views. Shared Shell, accessible controls/dialog, storage, charts and export helpers reuse the root design system. Styles/theme stay local to the workspace.

State is independently saved at `gptx.prototype.hq-admin.v1` with schema version 1. Shared structural validation plus domain ID/enum/context/numeric validators recover malformed data to this domain’s seed. Storage errors keep the app usable in the current session. Reset demo requests confirmation and resets only this domain. Local changes are fictional browser records: there is no API, connected service or production account. Fixture dates are explicit October 2026 scenarios. Extended constraints above describe what the browser demo actually computes.

## Verification

Run `node src/prototype/episodes/qa-domain-contracts.mjs` for authored record, formula, guard and mutation regressions in Episodes 6–11. Independent cross-product formula checks are `node src/prototype/episodes/qa-formulas.mjs`. Agent C’s runtime workflows are `QA_SLUGS=hq-admin node src/prototype/episodes/qa-domains.mjs` against `QA_BASE_URL` (default `http://127.0.0.1:3001`). Cross-route/layout/accessibility/capture evidence is maintained in `src/prototype/episodes/qa-report.md`; this README is implementation documentation, not a claim of a browser check that has not been run.
