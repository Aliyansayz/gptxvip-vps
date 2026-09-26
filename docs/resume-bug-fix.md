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

## Remaining work

1. **Runtime route regression pass:** exercise every URL in the route matrix by direct entry, browser Back/Forward, and visible parent/root controls. Include the title-alias path used by Roadmap favorites and Saved opened from Code Concepts Search. Record each result in the route matrix.
2. **Finhub frontend controls:** finish the per-view/control inventory for the named Finhub pages, home view, navbar, and footer. Keep Trading Tools limited to its parent route/selection/return UI; skip `src/finhub/tools/**` internals.
3. **Agent catalog and learning shell:** finish the source-level control/return checklist for catalog home, browse filters, detail/not-found, Agent Labs shell, and its named reading/blog/favorites views.
4. **Agent Labs topic/workspace views:** continue one top-level feature folder at a time. Topic Theory import and collection-pane controls have a source-level pass; other `devLushComponents/**` and `agentWorkspaceComponents/**` views still need route/entry, Back/close, root return, URL-link, and history checks. Inspect activity internals only when they break navigation or leave a visible control without an exit.
5. **Blogs, Roadmap, Profile, and documents:** finish the per-view entry, parent/root return, anchors, filters, and local-data failure-state inventory.
6. **Deployed route fallback:** confirm the hosting server rewrites direct app paths to `index.html`; its config was not available during this pass.

The source-level control pass now also covers the remaining buttons discovered by the JSX scan. The broader view/data-source audit and interactive browser regression pass are still open; see the latest continuation in `APP_RELIABILITY_EPISODIC_PROMPTS.md`.

The latest source state passes `npm run lint`, `npm run build` (1 minute 45 seconds, with the known >500 kB chunk warning), and `git -c core.whitespace=cr-at-eol diff --check`.

## Verification limitation

Interactive browser behavior has not been verified in this environment. No browser executable or browser automation package was present, and `npm run preview -- --host 127.0.0.1 --port 4173` failed with `listen EPERM`. Recheck browser availability first when resuming. If still unavailable, continue source review, keep runtime status explicitly unverified, and do not claim that route Back/Forward has passed.

## Resume procedure

1. Read `AGENTS.md`, this file, and the latest audit log in `APP_RELIABILITY_EPISODIC_PROMPTS.md`.
2. Inspect current `git status` before editing; preserve unrelated work, especially existing Finhub tools utility changes.
3. Choose the next unfinished finite episode above, fix only its scoped findings, and update the route matrix/audit log.
4. Run `npm run lint`, `npm run build`, and `git -c core.whitespace=cr-at-eol diff --check` after source changes. The build currently emits a large-chunk warning.
