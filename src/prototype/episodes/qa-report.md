# Prototype acceptance and cross-validity report

Verified on 2026-10-05 against the compiled production application at `http://127.0.0.1:3001`. Agent A authored the [episode prompts](README.md); Agent B implemented the domain workspaces; Agent C independently authored and ran the cross-product source, formula and browser checks. Root reran those checks against the final build, applied the reported corrections, refreshed all screenshots and consolidated the evidence below.

All thirteen catalog products map to distinct registered React workspaces, current rendered screenshots and working detail iframes. All eleven new domains have typed records, formulas, actions, domain-specific React views and workflow documentation. The generic preview renderer and unsupported page/component/framework claims have been removed.

## Verification gates

| Gate | Result | Evidence |
| --- | --- | --- |
| Named project showcase card buttons open their matching demo | 13/13 pass | [Card launch results](evidence/card-launch-results.json), [local release bundle](evidence/local-release-bundle.json) |
| Public catalog compared with local build | Live site currently has the button on only Project Management and Fulfillr; local build now has it on all 13 cards | [Observed public catalog](evidence/public-catalog-observation.json), [Pulse card screenshot](evidence/public-pulse-card-current.png) |
| Catalog / lazy modules / unique actual screenshots / truthful framework metadata | 13/13 pass | [Inventory](evidence/inventory-results.json), [screenshot hashes and capture provenance](evidence/capture-provenance.json) |
| Direct routes, every new navigation view, iframe, layout, theme, keyboard dialog | 13/13 pass | [Browser results](evidence/smoke-results.json) |
| Domain workflows, invalid inputs, current-context exports, reload, malformed storage recovery, domain-only reset | 11/11 pass | [Workflow results](evidence/domain-results.json) |
| Existing reference workflows, actual share blocking, storage unavailable recovery | 14/14 pass | [Foundation results](evidence/foundation-results.json) |
| Independent business calculations and record relationships | 22/22 pass | [Formula results](evidence/formula-results.json) |
| Domain record, action and validation contracts | 34/34 pass | [Contract results](evidence/contract-results.txt) |
| Manual navbar at 1440, 1024, 390 and 320px, active-section feedback and catalog return | 9/9 manuals pass | [Manual results](evidence/manual-results.json) |
| Production build | Pass, 5043 modules, 51.69s | [Build result](evidence/build-results.json) |
| TypeScript | Pass, final `npm run lint` exit 0 | [Compiler result](evidence/lint-results.json) |

## Product matrix

Each new-product row also passes all registered views at 1440px, document overflow checks at 768/390px, local light/dark switching and reload, mobile drawer selection/Escape, reset-modal focus containment/restoration, direct route and live showcase iframe. Console/page/HTTP failures were absent. Theme/chart/textual summaries and product composition were reviewed in source and rendered captures. The smoke tool labels domain acceptance as pending because it alone cannot prove workflows; the separate passing workflow and formula artifacts complete that evidence.

| Product / real workspace | Views, context, mutation, persistence, secondary actions, export and validation evidence | Verdict |
| --- | --- | --- |
| [pulse-analytics](/agents/prototypes/pulse-analytics) | all 5 navigation views; segment/date CSV exclusion; endpoint funnel; cohort denominator; ordered session CSV; report widgets/reload; stream pause/resume; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [storefront-pro](/agents/prototypes/storefront-pro) | all 4 navigation views; transition disabled guard/pack/ship/reload; restock invalid/valid/persistence; settlement adjustment/audit; warehouse CSV; empty search; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [ledgerline](/agents/prototypes/ledgerline) | all 4 navigation views; post/reload; signed mismatch rejection; match/unmatch state+audit; account isolation CSV; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [orbit-crm](/agents/prototypes/orbit-crm) | all 4 navigation views; stage/weighted change; note+next-action/reload; duplicate merge/link repair/reload; owner forecast CSV; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [saas-metrics-kit](/agents/prototypes/saas-metrics-kit) | all 4 navigation views; print current period+plan; retry decline/success/no-double-action/reload; plan movement/reload; period+plan CSV; metric definitions; presentation operations hidden; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [adsphere](/agents/prototypes/adsphere) | all 4 navigation views; campaign pause/reload; invalid/valid budget + derived export; creative validation/reload; first/last/linear values; date-filtered CSV; empty search; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [clinicare](/agents/prototypes/clinicare) | all 4 navigation views; default masking and real CSV; conflict validation/input retention; short booking/reload; flow transitions in Karachi timezone; reschedule guard; reveal/lock/remask/operation block; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [chainpulse](/agents/prototypes/chainpulse) | all 4 navigation views; asset/window/candle CSV; sample stream update/pause + chronological timezone correctness; holding validation/reload/export; wallet cluster/activity; calendar bookmark/reload; network gas median; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [hq-admin](/agents/prototypes/hq-admin) | all 5 navigation views; final-admin guard; duplicate invitation validation/pending reload/revoke; workspace member+notification partition; read/clear empty state; error/retry; local sign-in/out; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [insight-boards](/agents/prototypes/insight-boards) | all 4 navigation views; tenant/role CSV isolation; widget add/remove and board ownership; brand/reload; query iframe tenant+role/no recursion; schedule CRUD/reload; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [fulfillr](/agents/prototypes/logistics) | Dispatch search; invalid/valid delivery creation; driver assignment and status; exception resolution; approval; reload persistence. Direct/showcase routes and actual screenshot verified. | Pass |
| [fundview](/agents/prototypes/fundview) | all 4 navigation views; capital limit rejection/post/audit/reload; fund partitions and quarter CSV; share enable/expiry/disable; malformed saved-state recovery; domain-only confirmed reset | Pass |
| [project-management](/agents/prototypes/project-management) | Implemented dashboard, project detail identity, analytics and keyboard kanban transition; direct/showcase routes and actual screenshot verified. | Pass |

## Corrections and retest outcomes

- Shared storage now validates versioned structure plus domain relationships, recovers malformed records and reports storage failure honestly. All eleven unavailable-storage browser contexts remain usable. Confirmed reset preserves an unrelated storage sentinel.
- Shared controls have exact accessible dropdown names. Dialog and drawer focus, Escape, focus restoration, inert background and mobile scrolling pass. Local tokens provide readable light and dark text/status/focus; Pulse chart strokes and Insight/Fund links use their theme-aware accent variables.
- Pulse uses ordered unique-user funnels, original cohort denominators and actual returning events; saved report widgets use their advertised metrics. Its strengthened persistence schema rejects dangling session/user relationships and invalid report contexts; final stream/reload workflow and independent relationship checks pass.
- Ledger date ranges and currency/account boundaries, SaaS signed MRR bridge and one-time recovery, AdSphere attribution numerator/denominator context, and CliniCare chronological short-appointment flow were corrected and verified by independent calculations and browser workflows.
- HQ syntax, last-admin guard and actual saved appearance preferences pass. Insight rejects inaccessible accents and isolates tenant/role data in CSV and the actual nonrecursive copied iframe. Fund prevents dated ledger overdrafts and reconciles every seeded NAV bridge; enabled, expired and disabled preview URLs were exercised directly.
- Storefront’s adjustment dialog intentionally stays open to display its audit detail. The test now closes that dialog before navigating; no product mutation was needed. The corrected full workflow passes.

## Scope and existing limitations

The new workspaces use fictional records and local browser persistence. Their READMEs document formula definitions and contextual limitations. Simulated ticks, sample sign-in, local access previews, schedules and sharing are named accordingly; no connected backend is implied.

The original Project Management prototype still has inherited unavailable Clients/Calendar/Messages sections and some inert toolbar actions; its implemented overview/project/kanban/analytics behavior was preserved and regression tested. The original Logistics delivery dialog has less complete keyboard handling than the new shared modal. These are documented inherited reference limitations, not behavior copied into the eleven new apps.

The public site has not received this local build. `dist` contains the final compiled release, and a production preview at `http://127.0.0.1:3002` passed the 13-card browser launch check. The live `gptx.vip` catalog still has the action on only Project Management and Fulfillr; publishing the pending workspace changes to the public site requires explicit authorization. Build output retains the repository’s existing large-chunk advisory for unrelated modules.

## Reproduce

Use the commands in [INTEGRATION.md](INTEGRATION.md). The QA scripts are independent and can run against dev or a production preview through `QA_BASE_URL`. Formula checks also run in `Asia/Karachi`; browser workflow dates are tested in that timezone. Public screenshots were captured at 1440×1000 with fresh sample state, loaded fonts and reduced motion. Full light/dark/mobile screenshots, downloaded CSVs, printed HTML and manual screenshots are in `/tmp/gptx-prototype-qa`; the durable pass results and screenshot hashes are under `episodes/evidence/`.

Every product card has the same filled, visible “Open Prototype” action. Its accessible name also includes the specific app name; the compiled-app browser check verifies all 13 buttons and their mapped routes in [card launch results](evidence/card-launch-results.json).
