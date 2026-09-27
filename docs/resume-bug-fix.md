# Resume the frontend bug-fix audit

Resume this audit in `gptxvip`. The user asked to focus on frontend views, endpoints, routing, navigation, and return paths. Do not inspect or edit bugs inside `src/finhub/tools/**`; checking that the parent Trading Tools route opens is in scope.

## Current source-level status

- The route and return inventory is in [APP_FRONTEND_ROUTE_MATRIX.md](APP_FRONTEND_ROUTE_MATRIX.md).
- Finite, bounded work episodes are in [APP_RELIABILITY_EPISODIC_PROMPTS.md](APP_RELIABILITY_EPISODIC_PROMPTS.md). Continue with its Episodes 3, 5, 6, 7, and 8; their scope now excludes Finhub tools utility internals.
- Source fixes already cover the app-root path boundaries, legacy `/agent` redirect, invalid route canonicalization, Finhub section selection, Code Concepts deep links and mobile learning navigation, catalog filters, Blogs and Roadmap history, Agent Labs internal navigation, and root/parent returns.
- The latest continuation fixes Finhub in-app tab scrolling, Code Concepts Saved-to-Search history preservation, and Roadmap favorite launch/return. Roadmap favorites now open the saved chapter. A title alias canonicalizes to the topic ID while retaining the `roadmapChapterEntry` state, so the chapter's Back returns to the page that launched the favorite.
- Current source inspection matched each Finhub sidebar section ID to a rendered target. Local JSON files used by Overview, Key Terms, Documentation Map, Project Journey, and Code Concepts were checked for existence.
- Topic Theory Auto Import now maps each of its 18 topic choices to that topic's own bundled data, reports only new unique theories, and no longer requests missing Bio/Med data paths. Both Agent Labs and DevLush-root import dialogs handle duplicates and missing collections; the dialogs support Escape close and keyboard focus management. Both collection panes also expose labeled keyboard controls and screenshot feedback.
- Agent catalog filter changes no longer force the page to the top, and filter selections expose pressed state. Both theory library collection cards now use keyboard-operable open actions with separately named rename/delete controls.
- Finhub home carousel, preset, FAQ, Order Book, and navigation controls now expose selected/expanded/current state and keyboard focus where previously absent.
- eCommerce and DevTools Agent dashboard workflow cards no longer pose as ready buttons without actions; they are labeled informational workflow concepts.
- Scanner Queue review now opens read-only details, and production authorization/Exploit Verifier controls clearly report unavailable integrations instead of remaining inert.
- Blog Table of Contents links remain usable without IntersectionObserver; the active-heading highlight now degrades without crashing the article.
- Scanner tutorial recap replays its tour; Red Team report export and local simulation-setting persistence now have working feedback. Upcoming Agent Types entries are semantically disabled.
- The remaining static button scan outside `src/finhub/tools/**` found no enabled button without an action. Sample commerce, redline, terminal, catalog, and chart actions now produce local feedback; the chart actions are explicitly paper trades.
- Code Concepts now surfaces failed curriculum-file requests and can retry them; Finhub's non-tools JSON reads were checked against their public data resources and response/error handling.
- Agent Labs Reading and Articles “Browse topics” actions are now wired to the interactive topic view; this also resolves two TypeScript errors found during the full check.
- Scanner settings now show disconnected integrations without dummy credential fields. Custom target submission is controlled and rejects blank input; scripted scans no longer override a different sidebar choice when their timers finish, and their timers clean up on unmount.
- Security Tools Reset Simulation now clears its answer/result state; the JSX audit found no remaining empty event handlers or placeholder anchors outside `src/finhub/tools/**`.
- Editable input/select/textarea controls outside that tree all have change/input/key handling, or are explicitly read-only/disabled. All app data fetches in scope resolve to local JSON files; no live Axios/WebSocket/EventSource client was found.
- The empty simulation-completion callbacks have been removed from both Agent Labs roots; `DevLushContainer` accepts the optional callback while keeping its existing completion toast and return action.
- DevLush saved lesson indices are clamped to valid activities; DevLush scroll/progress storage failures no longer crash views. Empty DevLush/Roadmap lessons show a message with a working return action. Agent Theory saved items validate persisted records and report write failures.
- The shared Code Concepts simulation shell now defaults its engine-data panel closed on phones, opens it as an overlay, uses mobile viewport sizing, and removes a floating shortcut that overlapped the completion control. Project Journey section dots now have keyboard-visible focus and touch-sized targets.
- MainLayout now tolerates browsers without `IntersectionObserver` and gives its sidebar parent/subsection controls explicit expanded/current state and keyboard focus.
- The remaining Code Concepts walkthrough and Finhub chart observer uses now guard against missing browser observer APIs; the chart falls back to window resize, while optional scroll highlighting is skipped.
- Finhub footer actions declare button behavior explicitly and show consistent keyboard focus while preserving their current navigation targets.
- Algo Trading pivot confirmation now remains valid when further right-side bars are revealed, and its controls expose all sample bars. This fixes a concrete false “unconfirmed” state in the new curriculum currently present in the worktree.
- Agent marketplace entry points for Agent Labs now stay inside the `/agents` router; exiting Agent Labs returns through its router to the catalog so browser history and the shared shell remain active. Browse drops whitespace-only `q` values so they cannot appear as active filters when all results are shown.
- Favorites can delete their active collection and return to “All Items”; its controls now expose keyboard and screen-reader semantics. The Agentic Roles hub reports completion for the selected role, and the mobile drawer supports Escape, focus trapping, and focus return. Agent Labs top-level navigation clears stale role selection while preserving it in earlier Back entries.
- The fixed-position Ask AI popover now uses viewport coordinates, so scrolling no longer offsets it from the selected text; it has a keyboard-accessible close action. Agent Labs navbar controls have keyboard focus/touch states and Escape dismissal. The AI chat panel now fits narrow screens and exposes its open/close state accessibly.
- Reading topic selection now participates in browser history: Back returns to its list, Forward restores the topic, and focus returns to the selected card.
- DevLush sidebar Search now opens through the same history state as the navbar. Close returns to the parent entry instead of adding another entry that would reopen Search on Back; the sidebar controls now have focus-visible and touch-sized targets.
- Selecting a different DevLush topic while Search or a lesson is active now replaces that nested history entry with the Topics hub, keeping Forward aligned with what the learner selected.
- Agent Workspace home-card destinations now match all supported workspace views; launch cards, the scanner sidebar, and the workspace Back action have keyboard/touch semantics. Unknown workspace-state values fall back to the workspace home.
- Scanner Agent's Theory panel now returns to its previous section, and vulnerability rows/detail navigation work by keyboard with a narrow-screen detail view. The sample scan remains local and its preview notice states that no request is sent.
- Red Team Training now source-checks every local section, the parent workspace return, and the Theory panel. Closing Theory restores its opener/previous section, the mobile panel overlays the view with Escape and focus trapping, and its sidebar collapses to labeled icon controls on narrow screens. The fixed scripted run now ends with an explicit completion state; tutorial, settings, tools, and reports describe sample data accurately. Theory saves can be removed from the same control that saved them.
- No connected security scanner or Red Team endpoint exists in these views: all reviewed actions are local storage, static content, browser report export, or fixed scripted preview events.

## Remaining work

1. **Runtime route regression pass:** exercise every URL in the route matrix by direct entry, browser Back/Forward, and visible parent/root controls. Include the title-alias path used by Roadmap favorites and Saved opened from Code Concepts Search. Record each result in the route matrix.
2. **Finhub frontend controls:** the named pages, home, navbar, and footer now have a source-level control inventory. Direct route and runtime control checks are still open. Keep Trading Tools limited to its parent route/selection/return UI; skip `src/finhub/tools/**` internals.
3. **Agent catalog and learning shell:** catalog home, browse filters, detail/not-found, and blog routes have been source-checked; continue source checks for remaining Agent Labs mobile-shell controls and Reading, Articles, and Favorites return behavior.
4. **Agent Labs topic/workspace views:** continue one top-level feature folder at a time. Topic Theory import/collection controls, Agent Workspace entry/sidebar routing, Scanner Agent, and Red Team have source-level passes; other `devLushComponents/**` and `agentWorkspaceComponents/**` views still need route/entry, Back/close, root return, URL-link, and history checks. Prioritize Legal/Memory, then DFIR, Threat Intel, Cloud Posture, SAST, DevTools, and Commerce. Inspect activity internals only when they break navigation or leave a visible control without an exit.
5. **Blogs, Roadmap, Profile, and documents:** finish the per-view entry, parent/root return, anchors, filters, and local-data failure-state inventory.
6. **Deployed route fallback:** confirm the hosting server rewrites direct app paths to `index.html`; its config was not available during this pass.

The source-level control pass now also covers the remaining buttons discovered by the JSX scan. The broader view/data-source audit and interactive browser regression pass are still open; see the latest continuation in `APP_RELIABILITY_EPISODIC_PROMPTS.md`.

The 2026-09-27 mobile lesson, pivot, observer, and footer continuation passed `npm run lint`, `npm run build` (1 minute 48 seconds, with the known >500 kB chunk warning), and `git -c core.whitespace=cr-at-eol diff --check`. The latest Agent Labs view/history continuation also passed all three checks; its production build took 1 minute 56 seconds with the same chunk warning. The Agent Workspace entry/sidebar continuation passed the same checks; its build took 2 minutes 9 seconds. The Scanner Agent view/return continuation passed them as well; its build took 2 minutes 4 seconds.

The 2026-09-27 Red Team Training Agent source continuation fixed Theory-pane return/focus behavior, narrow-screen panel/sidebar behavior, tutorial keyboard dismissal/focus, and the scripted scenario's completion state. Settings, tutorial, tools, and report copy now match their local sample behavior; Theory save can toggle off. `npm run lint` and `git -c core.whitespace=cr-at-eol diff --check` passed after these changes; the production build result is recorded in the latest episodic log. Browser route/history interactions remain unverified.

## Verification limitation

Interactive browser behavior has not been verified in this environment. No browser executable or browser automation package was present, and `npm run preview -- --host 127.0.0.1 --port 4173` failed with `listen EPERM`. Recheck browser availability first when resuming. If still unavailable, continue source review, keep runtime status explicitly unverified, and do not claim that route Back/Forward has passed.

## Resume procedure

1. Read `AGENTS.md`, this file, and the latest audit log in `APP_RELIABILITY_EPISODIC_PROMPTS.md`.
2. Inspect current `git status` before editing; preserve unrelated work, especially existing Finhub tools utility changes.
3. Choose the next unfinished finite episode above, fix only its scoped findings, and update the route matrix/audit log. Episode 6 must remain split into one feature folder per continuation; the already reviewed workspace categories are listed above.
4. Run `npm run lint`, `npm run build`, and `git -c core.whitespace=cr-at-eol diff --check` after source changes. The build currently emits a large-chunk warning.
