# Agent C independent quality and cross-validity plan

Scope: all 13 Project Showcase entries. Agent A specifies the remaining 11 using Project Management as the architectural reference; Agent B implements them; Agent C independently verifies implementation against prompts, catalog claims and runtime behavior. Existing uncommitted changes are preserved.

## Baseline (2026-10-05)

- `AGENTS.md` requires app architecture consistency and reuse of root components. Root shared controls and tokens are in `src/components/designSystem/`.
- Registry currently contains only Logistics (`logistics`, catalog `fulfillr`) and Project Management (`project-management`). Both use lazy imports and real screenshot cards; runtime has suspense, error handling and an unknown-ID fallback.
- Detail routes embed `/agents/prototypes/<id>` in an iframe; full runtime omits the showcase navbar/footer. Remaining 11 entries use generic surface previews, have no registered prototype and advertise unsupported large page/component counts and non-React frameworks in some cases. Final metadata must describe shipped React sample-data implementations accurately.
- Project Management has real activity/project/analytics/kanban modules; client, calendar and messaging routes are explicit under-construction placeholders. Search and several toolbar actions are inert. These are reference limitations, not behavior to reproduce in the new prototypes. Existing reference needs a deliberate scope/quality decision during final audit.
- Logistics composes dispatch/route/driver/fleet/exception/approval workflows with localStorage state and shared root form/button controls. Browser-only and simulated route limitations are stated honestly.
- At baseline only logistics/project-management screenshot files exist. No development server on port 3001 is live; a prior production preview on 5173 is running and may be stale. Runtime audits must use a confirmed current server.

## Required evidence for every catalog entry

1. Matching catalog `prototype` ID, lazy registered default export, unique title, direct runtime path, detail iframe path and current real screenshot. No generic thumbnail remains for registered projects.
2. Read App, data and all view modules; enumerate every navigation destination and catalog feature; match each to a real rendered component and state/data-backed behavior. No copied generic domain labels or unexplained dead controls.
3. Domain-specific core workflow: analytics segment/funnel/cohort drilldown; commerce order/inventory/reconciliation update; finance transaction reconciliation; CRM deal-stage/relationship activity; SaaS subscription lifecycle/retention; marketing campaign pacing/creative review; healthcare appointment/patient/staff scheduling; crypto portfolio/calendar/wallet/gas research; admin members/roles/settings/notification workflow; embedded analytics tenant/theme/security/report/embedding; fund capital/NAV/investor/report behavior. Exact cases will be bound to Agent A prompts.
4. Navigate every advertised page sequentially and exercise a meaningful primary mutation or query; assert changed records and derived metrics, validation/empty states and persistence where advertised. A success toast alone is insufficient evidence.
5. Record page exceptions, console errors, failed module/screenshot requests and missing assets. Verify reload/deep links and iframe launch independently.
6. Check desktop 1440×900 and mobile 390×844 (plus 320px for suspected overflow): navigation opens/closes, no page-level horizontal overflow, table overflow remains local, content and controls remain reachable, visible selected states, legible text.
7. Check keyboard-accessible controls and meaningful names; labels for inputs, focus visibility, dialog Escape/cancel and focus behavior; semantic status/error output. Review scoped selectors and route transitions for stylesheet leakage.
8. Confirm metadata/page and component claims match actual shipped files/views; no false backend/live-market/auth/security claims. Sample-data constraints should be clear without dominating the product flow.

## Existing reference regression cases

- Project Management: actual project selection/detail identity, all four implemented views, kanban drag and keyboard column selection, task count update, sidebar/mobile navigation, iframe/direct route and honest feature descriptions. Track remaining placeholder/dead-action limitations as findings.
- Logistics: search, invalid and valid assignments, new delivery validation/create, status transition, exception resolution, recommendation approval/rejection, derived metrics/activity, reload persistence, reset, mobile shell and dialog accessibility.

## Execution and reporting

- Source review and lightweight registry/catalog/file checks may run while implementation proceeds. Only own QA files/scripts are edited.
- Coordinate with root before browser/TypeScript/build checks; do not overlap heavy jobs. Use one browser context/page at a time and run prototypes sequentially to avoid memory pressure.
- Run root lint/build only through coordinated ownership; inspect command exit/results rather than infer from pending output.
- Final `qa-report.md` will list each template, prompt requirements, files, interactions, route/iframe/screenshots, responsive/accessibility evidence, failures and retest outcomes. Any missing or weak evidence remains unresolved.

## Binding to Agent A handoff

The complete `episodes/README.md` Episodes 0–12 was read. All acceptance paragraphs, contracts and advertised secondary workflows are binding for the remaining eleven; this table supplements rather than replaces those requirements. Existing reference placeholders are documented inherited limitations and are not a demand to rewrite the two original authored applications.

| Product | Key independent calculations / invariants | Required secondary and invalid cases |
| --- | --- | --- |
| Pulse | event → unique users/funnel/activation; known cohort retention; session IDs/event ordering | report widget add/remove/save/reload, date+segment+platform filters, stream pause/resume, current selection CSV |
| Storefront | order item totals; stock movement; mismatch count | invalid status transition/restock, detail history/customer links, cancel stock semantics, filtered export/selected print |
| Ledgerline | opening + credit − debit; isolated USD/EUR; statement amount/reference comparison | valid post/reload, mismatch rejection, match/unmatch and audit, account/date CSV, keyboard row selection |
| Orbit | stage counts + raw/weighted forecast; stable company/contact/deal relationships | create/edit validation, note/next action, owner/period filtering, duplicate merge without dangling IDs |
| SaaS | starting MRR + signed movements = ending MRR; plan-filtered metrics; recovery counted once | deterministic retry, repeated retry, upgrade/downgrade, formula denominators, presentation print/CSV |
| AdSphere | selected spend ÷ budget vs elapsed comparator; attribution allocations sum to conversion total | actual pause/resume, budget validation, required creative revision note, date/channel/status/digest filters/CSV |
| CliniCare | overlap validation for clinician and room; availability; flow queue counts | preserve invalid form input, check-in progression, every-view/CSV/print masking, lock block/remask, persisted schedule |
| ChainPulse | OHLC inequalities and SVG plotting; holding value/P&L/allocation; gas median | distinct asset/window depth/candles, pause/resume, holding validation/reload, wallet clusters, bookmarks, CSV |
| HQ | workspace record partition; final active-admin invariant; derived unread/onboarding counts | duplicate/email validation, role/status persistence, invite revoke, clear read, preference save, sign-in/out/error retry |
| Insight | tenant isolation in views/export/embed; role allowed metrics; board widget ownership | query-driven nonrecursive iframe, actual copied embed, accent/title/widget reorder persist, schedule CRUD, accessible colors |
| Fundview | commitment − calls; NAV/return bridge; benchmark rebasing; fund/quarter partition | invalid call/distribution, audit/persistence, sector totals, selected quarter/sections export+print, local share expiry/block |

Across all eleven: independent versioned storage/schema validation and failure fallback; reset confirmation only resets own domain; no stored-state loss on view/filter/theme switch; timer cleanup; light/dark local scoping; 390/768/1440 layouts; 44px mobile controls; all enabled actions purposeful; every modal focus containment/Escape/restoration; chart textual values; real exports. Root owns screenshots and coordinated lint/build; Agent C verifies outputs and provenance rather than starts duplicate heavy jobs.
