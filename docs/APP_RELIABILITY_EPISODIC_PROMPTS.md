# GPTX.VIP reliability episodes

Run these prompts in order. They are deliberately bounded to this repository and to named app slices so each episode has a concrete stop point. Record any finding outside the current slice in the final list for a later episode; do not silently expand scope.

Current source-level inventory: [APP_FRONTEND_ROUTE_MATRIX.md](APP_FRONTEND_ROUTE_MATRIX.md). Update it only when route behavior changes, and keep runtime verification status separate from source inspection.

## Episode 0 — Build the front-end route inventory

```text
Work only in gptxvip. Inspect src/main.tsx, src/App.tsx, src/utils/navigation.ts, src/layouts, src/rootHomePage, src/devLushArea/agentMarketplace/App.tsx, and src/devLushArea/agentDevRootComponents/BlogsView.tsx. Verify and update docs/APP_FRONTEND_ROUTE_MATRIX.md so every mounted front-end page has its URL, entry path, and visible parent/root return. Do not edit application code in this episode. Stop when every React-root branch and every URL branch in these files appears once in the matrix, with source-reviewed and runtime-verified statuses clearly distinguished.
```

## Episode 1 — Repair app entry, browser history, and root return

```text
Work only in gptxvip. Fix route dispatch and back/root navigation in src/main.tsx, src/App.tsx, src/layouts/MainLayout.tsx, src/finhub/Navbar.tsx, src/layouts/MainFooter.tsx, src/codeConcepts/codeConceptsTopics/codeConceptsView/CodeConceptsView.tsx, src/devLushArea/agentDevRootComponents/BlogsView.tsx, and src/devLushArea/agentMarketplace/App.tsx. Verify direct entry and browser Back/Forward for /, /finhub, every main Finhub tab, /code_concepts/:category/:activity, /blogs/:id, /agents, /agents/templates/:slug, and /agents/lab. Verify each visible back/home control reaches the correct parent or root. Stop when every listed route has a passing entry, Back, Forward, and root-return check; report any route that needs server rewrite configuration separately.
```

## Episode 2 — Repair route boundaries and path compatibility

```text
Work only in gptxvip. Inspect src/main.tsx and src/utils/navigation.ts. Verify exact path-segment matching, legacy `/agent` redirects, query/hash preservation, and cross-root transitions for `/`, `/finhub`, `/agents`, `/agents/lab`, and `/blogs`. Fix paths that enter the wrong React root or leave a stale URL. Stop when every mounted root has one explicit path boundary and every legacy path has a canonical destination.
```

## Episode 3 — Audit the Finhub views and controls

```text
Work only in gptxvip. Inspect src/views/{TradeTypeView,OverviewView,CointegrationView,KeyTermsView,MapView,TradingToolsView}.tsx, src/finhub/homeMainView/**, src/finhub/Navbar.tsx, and src/layouts/{MainLayout,MainFooter}.tsx. Do not inspect or edit src/finhub/tools/**; for Trading Tools, check only the parent view's route selection and return controls. For every displayed control in the named front-end views, trace its click/change handler to a visible state change, route, or documented disabled state. Check route-specific loading/empty states and root returns. Stop when every control in scope is accounted for in a small view/control/result table.
```

## Episode 4 — Finish the Solo Learn-style mobile learning flow

```text
Work only in gptxvip. Inspect src/codeConcepts/** and the learning navigation in src/layouts/MainLayout.tsx and src/finhub/Navbar.tsx. Keep the existing app architecture. On a 360px mobile viewport and a desktop viewport, verify course/category selection, search, saved lessons, lesson start/complete, progress persistence, direct lesson links, Back/Forward, and return to the learning hub. Shape missing mobile UI around a clear course path, visible lesson progress, readable activity cards, and persistent bottom navigation inspired by Solo Learn. Fix every broken control in this slice. Stop when all seven flows work at both viewport sizes and keyboard users can reach each control.
```

## Episode 5 — Audit Agent catalog and learning shell

```text
Work only in gptxvip. Inspect src/devLushArea/agentMarketplace/{App.tsx,pages,components,data}, src/devLushArea/devLushComponents/DevLushContainer.tsx, and src/devLushArea/agentDevRootComponents/{devLushAreaApp.tsx,LandingPage.tsx,ReadingView.tsx,ArticlesView.tsx,FavoritesView.tsx}. Fix broken template links, catalog and main-root returns, lab entry/exit, article/reading return controls, favorites actions, and visible disabled/loading/error states. Check each route directly and with browser Back/Forward. Stop when the catalog, template list/detail, lab, and named study views have a route/control checklist with no dead action.
```

## Episode 6 — Audit Agent Lab topic and interactive elements

```text
Work only in gptxvip. Inspect src/devLushArea/devLushComponents/**, src/devLushArea/agentWorkspaceComponents/**, and the registries/data those components import. Split findings by the existing top-level feature folder and handle one folder per change set. Focus on view entry, browser Back/Forward, visible Back/close, route links, and return-to-root paths; audit activity-specific simulation logic only when it breaks navigation or leaves a visible control without an exit. For Topic Theory Auto Import, verify that each selected topic maps to its own bundled data, duplicate items are not reported as newly imported, every active data path exists, and the modal supports keyboard focus and close behavior. Fix broken imports and handlers only within the current feature folder. Stop each folder when every exported view has a known entry, parent/root return, and history behavior; list untouched folders for the next run.
```

## Episode 7 — Audit Blogs, Roadmap, Profile, and document views

```text
Work only in gptxvip. Inspect src/devLushArea/agentDevRootComponents/blogs/**, src/roadmapArea/roadmapView/**, src/finhub/profileInfo/**, src/finhub/documentationTopics/**, src/finhub/ProjectJourney/**, and the remaining files in src/views. Check direct links, browser history, root return, filters/search, empty/loading/failure states, and all displayed controls. Fix issues within these paths. Stop when every exported view has one verified entry path, one verified return path, and a completed control checklist.
```

## Episode 8 — Close the regression matrix

```text
Work only in gptxvip. Use the route/control matrices from Episodes 0–7. Re-run the production build and TypeScript check, then exercise direct entry, browser Back/Forward, and visible root-return controls for every listed route. Fix only regressions in the audited slices. Report routes that require a deployed rewrite rule and mark them as environment-dependent. Stop when each matrix row is passing or has one explicit, reproducible external blocker; include the exact command and result for every check.
```

## Episode 6 continuation slices — one feature folder per pass

Use these prompts separately and in order. Each pass is limited to its named feature directory plus the shared workspace mount only when an entry or return path is broken. Do not inspect or edit `src/finhub/tools/**`.

### Episode 6A — Legal Contract Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/legalContractAgent/**`. Trace every rendered view's workspace entry, sidebar controls, visible Back/close action, browser-history behavior, and the workspace/root return. Check form fields, empty/error states, and any URL targets. Fix broken front-end behavior only in this feature and the shared mount if required. Stop with a per-view entry/control/return checklist and lint/build/diff results.
```

### Episode 6B — Memory Types Lab

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/memoryTypesLab/**`. Trace every lesson/tab selector, Back action, workspace/root return, and browser-history behavior. Check empty lesson content, storage use, keyboard operation, and mobile overflow. Fix only this feature's front-end issues. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6C — Incident Response / DFIR Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/securityAgent/incident_response_agent/**`. Trace Dashboard/Data/Tools/Tutorial entry, sidebar selection, Back/close, history, and workspace return. Check local data loading and every displayed control for a visible result or explicit disabled state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6D — Threat Intelligence Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/securityAgent/threat_intelligence_agent/**`. Trace Dashboard/Data/Tools/Tutorial entry, sidebar selection, Back/close, history, and workspace return. Check local data loading and every displayed control for a visible result or explicit disabled state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6E — Cloud Security Posture Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/securityAgent/cloud_security_posture_agent/**`. Trace Dashboard/Data/Tools/Tutorial entry, sidebar selection, Back/close, history, and workspace return. Check local data loading and every displayed control for a visible result or explicit disabled state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6F — Source Code Auditor Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/securityAgent/source_code_auditor_agent/**`. Trace Dashboard/Data/Tutorial entry, sidebar selection, Back/close, history, and workspace return. Check forms, sample-data states, and every displayed control for a visible result or explicit disabled state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6G — DevTools Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/devtoolsAgent/**`. Trace Dashboard entry, sidebar selection, Back/close, history, and workspace return. Check each launch/action control, local data, and empty/error state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6H — E-commerce Agent

```text
Work only in gptxvip. Audit `src/devLushArea/agentWorkspaceComponents/ecommerceAgent/**`. Trace Dashboard/Data entry, sidebar selection, Back/close, history, and workspace return. Check forms, sample-data states, and every displayed control for a visible result or explicit disabled state. Fix this feature only. Stop with a per-view checklist and lint/build/diff results.
```

### Episode 6I — Agent Labs root views

```text
Work only in gptxvip. Finish the remaining source audit for `src/devLushArea/devLushComponents/**` and `src/devLushArea/agentDevRootComponents/**`, excluding views already recorded as source-checked in `resume-bug-fix.md`. Check each exported view's entry, parent/root return, browser-history state, search/filter controls, loading/empty/error states, and visible actions. Fix one top-level feature folder per change set. Stop with the exact folders checked and untouched.
```

## Audit log — 2026-09-27 Red Team Training Agent continuation

- Theory Wiki now remembers the section that opened it; its close button and Escape return to that section and restore focus. Narrow screens use a full-view dialog with focus trapping, while the sidebar contracts to named icon controls.
- Tutorial close, Escape, Tab handling, and focus return work; missing tutorial content has a recoverable state. Tutorial copy now describes the local sample instead of implying automated target activity.
- The scripted run now ends at a visible completion state and stops its activity cursor. Stop/return controls have explicit destinations; report export is labeled as sample data. Recon, lateral movement, Arsenal, Settings, and Reports no longer claim live operations or recent generated findings.
- Theory Save now toggles saved state and handles browser-storage removal failures. The workspace Back-to-Agents button is the fallback focus target after onboarding closes.
- Red Team sections remain local view state inside `/agents/lab`; the workspace return goes to Agents and browser Back returns to the entry that launched the workspace. The route matrix documents this distinction.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 42.82 seconds; Vite continues to warn about chunks larger than 500 kB (the Agent app bundle remains the largest).
- `git -c core.whitespace=cr-at-eol diff --check` — passed after the documentation update.
- Browser Back/Forward, focus behavior, and mobile layout remain source-checked only. This environment has no browser executable, and preview cannot bind to localhost (`listen EPERM`).

## Audit log — 2026-09-26 continuation

This log records findings fixed during one bounded continuation of Episodes 3 and 7. The application still has more source files and controls than this pass inspected, so this is not a whole-repository completion claim.

- `DocumentationMap`: phase/class JSON is now validated before rendering; deselecting a phase clears its class pane synchronously; class selection can toggle off, close by button or Escape, restore focus to its opener, and report its pressed state. Empty class lists have a message.
- `ProjectJourney`: node, phase-detail, canvas, SVG-path, and status-map data is checked before use. Invalid or zero-length paths reach the retry state. Touch swipes, keyboard navigation, and a usable progress slider cover mobile and keyboard interaction. Unused active-node state was removed.
- `KeyTermsView`: both data files are shape-checked down to term fields, tab buttons expose selection state, and empty/error states remain visible.
- `CodeSnippetViewer`: an empty snippet list now has an explicit status; Copy reports clipboard failure instead of showing a false success and clears its timer when unmounted.
- Finhub home: the documentation CTA now targets an existing section. Horizontal order-flow Buy/Sell controls add paper-trade log entries with a visible status, identify the selected simulated asset, and keep depth levels stable between price updates.
- `StoryBlock`: the invalid nested close target was removed; focused cards collapse by activating the same keyboard-accessible card or pressing Escape, and hidden cards leave the tab order.

Checks for this continuation:

- `npm run lint` — passed.
- `npm run build` — passed; Vite still reports existing chunks over 500 kB, including the Agent app chunk.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.

## Audit log — 2026-09-26 route and return-path continuation

- `getAppRoot` now matches complete path segments and maps `/agent` and `/agents` to the Agent catalog root. Similar prefixes such as `/agents-old` and `/blogs-extra` no longer mount those apps by accident.
- The legacy `/agent` redirect keeps its query and hash. `main.tsx` chooses the app root through the shared path classifier.
- `smartNavigate` now checks origin plus exact root path and emits `popstate` after same-root `pushState`, so manual history listeners and React Router both render internal paths; cross-root/external paths use full navigation.
- An unknown `/finhub...` prefix no longer selects the Finhub home; unknown main-app paths canonicalize to `/` during direct entry or browser history changes. Unknown blog article IDs and extra path segments canonicalize to `/blogs`.
- Finhub nested section paths now validate the requested section, canonicalize unknown section names, and scroll to the addressed section on direct entry and browser history navigation after lazy content mounts.
- Code Concepts now repairs unknown categories and invalid lesson IDs to the course path once lesson data is available; valid interactive lessons and generated Module Overview lessons resolve from direct URLs.
- Roadmap topic/chapter URLs now resolve chapters within their selected topic and repair unknown topics, chapters, and extra segments to a valid Roadmap path. Agent catalog catch-all URLs redirect to its home route.
- The Agent catalog now has an explicit main-site return through its logo, mobile menu, and footer. Its “Agent Labs” navigation still returns to the catalog root.
- Agent Labs footer placeholders that all pointed to `#` were removed; the visible contact action opens the configured email address.

Checks for this continuation:

- `npm run lint` — passed after the Finhub section, Roadmap, Agent wildcard, and Code Concepts deep-link changes. A rerun after the final Agent root-return anchor edits printed the TypeScript command but did not finish within 60 seconds; it was interrupted.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- `npm run build` — passed after all route and return-link changes when run by itself. Vite reports large existing chunks, including the main app bundle.
- Direct route and browser Back/Forward checks remain unverified because this environment has no browser and the local preview server cannot bind to localhost.

## Audit log — 2026-09-26 topic-sidebar and root-control pass

- Agent Labs and Roadmap topic selectors are buttons instead of fragment links, expose their selected state, and no longer advertise a fake `#` destination. Both sidebar toggles and topic navigation have accessible names; the Roadmap sidebar no longer duplicates its exit action and its title/search label identify the Roadmap.
- The Agent Labs landing brand is now a real link to GPTX.VIP home. Its separate exit controls name the actual destination (Agent catalog when embedded in `/agents/lab`, GPTX.VIP home when standalone).
- `BlogsView` now separates standalone URL routing from its embedded Agent Labs use. Article selection in `/agents/lab` stays under that route; its visible return goes to the Agent Labs landing. The standalone `/blogs` return goes to GPTX.VIP home instead of incorrectly opening the Agent catalog.
- Finhub tab, subsection, and course-category selections close the mobile navigation drawer, while desktop navigation retains its sidebar.
- Code Concepts Search “Exit” now returns to the screen that opened Search through the marked history entry; a directly opened Search URL falls back to the General course instead of exiting to GPTX.VIP root.
- The narrow-screen Code Concepts Search exit icon now has an accessible name and explicit button type.
- Agent Labs Articles cards no longer expose inert “Read More” actions. Since no article bodies/routes exist in this repository, each now presents an explicit disabled full-article state.
- The Finhub footer’s Code Concepts action now resets a retained Search category to General before entering the learning view; its brand is a root link and its contact email is a mail link. Unpublished policy labels in the root footer no longer use link-like hover/cursor styling.
- Agent Labs topic search now returns its parent state to Topics when closed, so the navbar and sidebar can reopen it without first navigating away.
- Finhub route parsing now rejects subsection segments for tabs without subsections; malformed `/finhub/overview/:section` paths canonicalize to `/finhub/overview`.
- Checked the Agent Labs landing navbar section targets; each target ID exists in its matching section.
- Checked the Blog table of contents and citation fragments against rendered heading and citation IDs; all current article data resolves without duplicate heading slugs or missing citation targets.
- Added [APP_FRONTEND_ROUTE_MATRIX.md](APP_FRONTEND_ROUTE_MATRIX.md) as the current source-level inventory of mounted app roots, route patterns, and visible return targets. Runtime verification is explicitly marked separately.

Checks for this pass:

- `npm run build` — passed after the final Finhub section validation change (Vite completed in 41.86 seconds); existing large-chunk warning remains.
- `npm run lint` — passed after the final Finhub section validation change (`tsc --noEmit` exit code 0; completed in about 60 seconds).
- `git -c core.whitespace=cr-at-eol diff --check` — passed; the front-end source scan found no remaining literal `href="#"` placeholders outside excluded Finhub tools.
- Browser verification remains blocked in this environment: no browser executable is installed, and `npm run preview -- --host 127.0.0.1 --port 4173` fails with `listen EPERM`. Direct route and Back/Forward interactions are therefore not verified here.

## Audit log — catalog query normalization continuation

- The Code Concepts curriculum and registry are consolidated under `src/codeConcepts`; the main app imports the feature through its barrel entry. The learning view uses a course path, progress, lesson cards, and persistent mobile Learn/Explore/Saved navigation.
- Agent catalog query parsing now drops unsupported category, framework, and sort values with a replace navigation. It retains the search query and unrelated query parameters, and avoids presenting a false empty result or invalid sort selection for malformed links.
- The catalog search input has an accessible name, and the mobile Filters toggle exposes its expanded state and controls its filter panel.
- Profile copy-email now waits for the clipboard write, reports failures, and clears its feedback timer on unmount; the edX credential link uses HTTPS.
- Code Concepts search and lesson loading now share one curriculum-file manifest. Search includes Python's `advanced_topics.json` lessons, and search failure feedback counts failed files rather than whole courses.
- Lesson entries now carry a history marker; the in-app Back and Complete actions use the actual parent history entry, while a directly opened lesson falls back to its course route.
- Roadmap chapter/search entries and standalone Blog article entries now mark their parent history entries. Their visible Back/Close actions return to the actual parent without leaving duplicate routes; direct URLs still fall back to the corresponding index/topic.
- Agent Labs topic chapters now use React Router state entries, so browser Back/Forward restores the topic runner and its Topics/Search parent without changing the `/agents/lab` path.
- Agentic Roles chapters, role changes, and the search overlay now use React Router state entries. Back/Forward restores the runner or hub and returns search results to the prior search overlay; switching top-level Agent Labs views clears stale runner/search markers.
- Agentic Roles Search results now use the same launch handler as the hub, so app locks and energy depletion prevent both paths consistently.
- Agentic Roles lessons now have their own Favorites type and launch into the correct role runner with energy and stale-item checks. Previously saved role lessons migrate by their role ID; normal Agent Labs favorites continue to use the topic runner.
- Agent Workspace subviews now add and restore same-path React Router state entries. Its visible Back returns to the workspace home, and browser Back/Forward restores the prior subview/home rather than leaving Agent Labs.
- Finhub navbar/sidebar tab changes now scroll to their selected section after the new view mounts and cancel stale scroll observers. Every current `sidebarItems` section ID was matched to a rendered section.
- Code Concepts Saved now returns through its own marked history entry, preserving the Search entry marker when Saved was opened from Search.
- Roadmap favorites now open their saved chapter directly. The route parser resolves encoded course-title aliases or a valid chapter ID to its topic, then replaces the alias with the canonical topic ID.

## Audit log — 2026-09-27 Agent Labs view and mobile control continuation

- Favorites can now delete the currently selected collection; after deletion, its items are returned to the default collection and the view selects “All Items.” Collection controls expose pressed state, keyboard focus, touch-sized delete actions, and explicit accessible names.
- Reading topic details now use same-path React Router state entries. Visible Back and browser Back return to the topic list, Forward restores the detail, and focus returns to the topic card.
- DevLush sidebar Search now enters the same React Router search history state as the navbar; closing it returns to the actual parent entry, and browser Back no longer reopens a dismissed Search view.
- Choosing a topic from the DevLush sidebar while Search or a lesson runner is open now replaces that nested history state with the Topics hub, preventing the old search/lesson from reappearing on Forward.
- Switching top-level Agent Labs views clears a stale selected Agentic Role from the new history entry. Browser history retains the role in its earlier entry, so Back can still restore it.
- Agentic Roles now reports completion counts for the active role instead of counting completed lessons from every role. Its filters, sidebar, and mobile drawer have labeled controls, keyboard focus, Escape close, and focus trapping/return for the drawer.
- Text selection actions now use viewport coordinates with their fixed positioning, so the “Ask AI” control stays beside selected text after scrolling. Its controls are keyboard visible and touch sized, and Escape closes the popover.
- The Agent Labs navigation menu now closes on Escape; its toggles expose current state and its controls have explicit button types, focus styles, and touch targets.
- The AI chat panel now fits narrow viewports, uses dynamic viewport height limits, and exposes expanded state, a named region, and accessible close/send controls.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 56 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Runtime Back/Forward and mobile visual checks remain unavailable in this environment; see [resume-bug-fix.md](resume-bug-fix.md).

## Audit log — 2026-09-27 Finhub parent-view control inventory

The Episode 3 source pass traced controls in the named Finhub views and kept Trading Tools limited to its parent selection/return shell. Runtime click and route checks are still pending.

| View | Control path checked | Result |
|---|---|---|
| Trade Type | Main-layout section links target the four execution examples; the view itself has no form controls and identifies its charts as generated samples. | Source checked; runtime scroll not verified. |
| Overview | Local JSON loading/error/retry and per-section in-page links. | Retry and anchor targets are present; runtime scroll not verified. |
| Cointegration | Reused Cointegration article view, in-page section navigation, and global Finhub parent/root navigation. | Source checked; runtime anchors not verified. |
| Key Terms | Terms/volatility tabs, controlled query input, clear actions, and route subsection selection. | Source checked; empty/error states and tab state are present. |
| Documentation Map | Local JSON retry, phase/class selection, detail close/Escape, and parent route navigation. | Source checked; map/data errors expose retry. |
| Project Journey | Local JSON retry, keyboard/touch step selection, progress slider, and parent route navigation. | Source checked; no network service dependency. |
| Trading Tools | Parent sidebar selects a version; lazy-loaded shell shows a loading state; tab/root navigation stays in MainLayout. | Parent route checked; `src/finhub/tools/**` internals excluded. |
| Finhub Home | Carousel, preset selection, asset selection, engine start/pause, simulated paper orders, order-book tabs, and order actions. | Active state and local feedback are wired; no live order endpoint is called. |
| Navbar, layout, footer | Main tabs, subsection links, mobile drawer, root/parent exits, theme, profile, and cross-app links. | Source handlers and rendered destinations matched; runtime history remains open. |

The named Finhub view controls and parent navigation now have a source-level inventory. This does not mark the broader Episodes 5–8 view audit complete.

## Audit log — 2026-09-27 Agent Workspace entry and sidebar continuation

- Matched every Agent Workspace home-card destination to a supported workspace view and render branch. Unknown history view names resolve to the workspace home.
- The visible “Back to Agents” action returns through the workspace history entry; the app-level Agent Labs overview button remains the root return.
- Workspace launch cards and the Scanner Agent sidebar now declare button behavior, expose keyboard focus, and use touch-sized targets. Sidebar section controls report their expanded state and control a persistent hidden section region.
- Optional workspace navigation callbacks are now required where the home always supplies them, so enabled launch buttons cannot silently do nothing.
- Explicit “Coming soon” cards remain disabled and labeled as future work; preview-only panels continue to state that their sample data/actions are not connected integrations.

This slice is source-checked. Browser Back/Forward and focus restoration after returning to a card remain unverified; other Agent Workspace subviews are still open in Episode 6.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 2 minutes 9 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- The 17 Python activities across `index.json` and `advanced_topics.json` have unique component IDs, so search results and direct lesson routes resolve without collisions.
- Checked local data endpoints used by Strategy Overview, Key Terms, Documentation Map, Project Journey, and Code Concepts against files under `public/`; all referenced JSON files exist.
- Blog heading and citation anchors were checked against their rendered targets; all current articles have unique heading slugs and valid citation references.

## Audit log — 2026-09-27 Scanner Agent view and return continuation

- Closing the Scanner Theory pane now returns to the section that was open before Theory. The fallback Theory Wiki toggle remains available when the panel is closed.
- Vulnerability findings are keyboard-operable selection buttons with pressed state. The detail panel moves to a full-screen mobile view with a working “Back to findings” action and returns focus to the selected row.
- Finding-class filters expose selection state and keyboard focus. If a findings view has no remediation callback, the action now reports that state instead of silently doing nothing.
- The remediation walkthrough's header and completion controls return to findings. Theory panel and remediation controls have keyboard-visible focus; the Theory panel overlays narrow screens instead of forcing a 450px side column.
- The scanner dashboard controls and local scripted-scan path were reviewed. Its preview notice correctly states that target scans are simulated and send no requests; the Agent Workspace “Back to Agents” control remains the root return.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 2 minutes 4 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Runtime browser Back/Forward and phone-size layout checks remain unverified in this environment.
- `python3 -m compileall -q server_fastapi` — passed; generated `__pycache__` directories were removed afterward.
- Interactive browser and Back/Forward behavior were not manually exercised. `vite preview` could not bind to localhost in this restricted environment (`listen EPERM`), and no browser automation is available here.

Next bounded slices remain Episodes 3, 5, 6, 7, and 8, with route-level browser history checks still to be exercised in an environment that permits a browser and local server.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit` exit code 0).
- `npm run build` — passed in 1 minute 40 seconds; Vite still reports existing chunks over 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Interactive route entry and browser Back/Forward remain unverified for the browser/server environment reasons recorded above.

## Audit log — 2026-09-26 Agent Labs navigation continuation

- Agent Labs topic chapters and Agentic Roles chapters/search now push same-path React Router state entries; Back/Forward restores their parent view without changing `/agents/lab`.
- Agent Workspace's nested tool views also push history entries; its visible Back and browser Back return to its home view.
- Agentic Roles Search results use the same energy/lock checks as hub launches, and selecting the active role no longer creates a redundant entry.
- Agentic Role favorites now use a distinct type and launch the correct role/chapter after energy and stale-item checks. Existing saved role items migrate using their role ID.
- Top-level Agent Labs navigation clears stale chapter, search, and workspace markers. The source route matrix now records the nested return behavior.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 42 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser interaction remains unverified: this environment has no browser executable, and the preview server cannot bind to localhost (`listen EPERM`).

The wider view/control audit in Episodes 3, 5, 6, and 7 is still in progress; this continuation closes Agent Labs return-path issues only.

## Audit log — 2026-09-26 Topic Theory Auto Import continuation

- The selected Auto Import topics now resolve to their matching bundled JSON datasets. The previous handler returned the entire DevLush curriculum for every selected topic, and the Bio/Med paths referenced by the helper did not exist in the public data tree.
- Import counts now reflect unique theories that are new to the selected collection. Empty selections, no matching theories, duplicate-only imports, and missing collections produce clear feedback.
- The topic-selecting dialog now has keyboard focus entry and return, Escape close, Tab trapping, a labeled collection selector, and accessible selected states for topic buttons. Its UI now describes the selectable units as topics rather than chapters.
- The parallel DevLush-root import dialog now accurately counts newly added theories, handles an absent/deleted collection, and has keyboard focus entry/return, Escape close, and Tab trapping.
- All 18 bundled topic data files were checked for lab/question container shape and duplicate import identities using the same key as the collection store.
- Both theory collection panes now provide labeled Back, view-mode, remove, slider, aspect-ratio, and screenshot controls. Screenshot success/failure is announced, and lazy loading falls back to rendering all items if `IntersectionObserver` is unavailable.

## Audit log — 2026-09-26 catalog and theory collection controls continuation

- Agent catalog scroll-to-top now runs on route changes only. Changing search, category, framework, or sort query parameters keeps the browse list at its current scroll position.
- Catalog category/framework filters expose pressed state and explicit button behavior; the sort control and desktop/mobile catalog search inputs have accessible names.
- Both theory collection hubs now open cards through keyboard-focusable buttons. Rename and delete controls have accessible names and stay independently operable.

## Audit log — 2026-09-26 eCommerce workspace control pass

- The eCommerce dashboard's three workflow cards were rendered as buttons and said “Ready” but had no action handlers or matching destination views. They are now informational workflow articles labeled “Workflow concept,” so the dashboard no longer offers dead actions.

## Audit log — 2026-09-26 DevTools workspace control pass

- The DevTools dashboard had the same inert-button pattern across its PR review, dependency audit, and legacy refactoring cards. They are now informational workflow articles instead of dead “Ready” actions.

## Audit log — 2026-09-26 Scanner workspace control pass

- Scanner Queue “Review” now opens a read-only detail panel with a return-to-queue control. The production scan authorization action and Exploit Verifier are explicitly unavailable because this workspace has no service connected for either action; they no longer appear as live, inert controls.
- The Blog article contents observer now degrades without `IntersectionObserver`; the article links remain usable when active-section highlighting is unsupported.
- Scanner Dashboard Tutorial Recap now restarts the existing guided tour, and Agent Types “Coming soon” entries now use disabled button semantics.
- Red Team report export now downloads the sample report and reports failures. Simulation settings save and reload from browser storage, with a visible confirmation that these demo settings do not launch scans.
- Finhub home asset controls and volatility preset choices now have explicit types, keyboard focus, and selected-state labels. Order Book mode and auto-run controls expose their active state, the glossary disclosures expose expanded state, and section-dot navigation identifies its current location.
- Finhub's desktop/mobile navigation exposes the active section, and its brand home control has a keyboard focus ring and accessible name.
- Fixed the mismatched heading close tag in `src/views/MultipleTradeView.tsx` that prevented the project TypeScript check from parsing.
- Fixed `RoadmapReadingView`'s malformed Suspense fallback and section closing tags, which the production bundler caught after the wider JSX transform.

Checks for the Topic Theory and catalog continuations:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 47.40 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Source data check — all 18 DevLush JSON files had valid lab/question arrays, valid theory title/content fields, and no duplicate import identities.
- Browser interactions remain unverified: no browser executable is available, and the preview server cannot bind to localhost (`listen EPERM`).

Checks for the later Finhub, Roadmap, and Agent workspace edits:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 45.59 seconds; Vite continues to report chunks over 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser route interactions remain unverified in this environment.

## Audit log — 2026-09-26 final navigation continuation

- Finhub navbar/sidebar tab changes now scroll to the URL's selected section after the view mounts; stale section observers are cancelled. The existing per-tab section targets were source-matched to their rendered IDs.
- Code Concepts Saved Back now returns through its marked history entry. If Saved was opened from Search, the parent Search entry marker remains available to Search Exit.
- Roadmap favorites now open the exact saved chapter via an encoded course-title alias. The route parser resolves the title or chapter ID to its topic and canonicalizes to the topic ID without dropping the `roadmapChapterEntry` marker. Visible Back therefore returns to the launching favorites view.
- Created [resume-bug-fix.md](resume-bug-fix.md) with the unfinished view/control sweeps, runtime route pass, deployment rewrite check, and scope reminder to exclude Finhub tools utility internals.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 43 seconds; Vite reports bundles larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser direct-entry and Back/Forward remain unverified. There is no browser executable, and Vite preview cannot bind to localhost (`listen EPERM`).

The wider frontend source audit and runtime matrix remain in progress; open work is tracked in [resume-bug-fix.md](resume-bug-fix.md).

## Audit log — 2026-09-27 Agent catalog route handoff continuation

- Source-checked the Agent marketplace home, browse/search query parameters, detail/not-found routes, header/footer destinations, and standalone Agent Labs entry. Those routes resolve through the existing `/agents` BrowserRouter basename.
- Converted same-root “Open a lab” actions in the catalog header, footer, and home page from full-page `/agents/lab` loads to React Router links. The Agent Labs Exit control now navigates to the catalog through React Router, preserving the shell and expected browser history. Finhub remains a separate root handoff.
- Browse now removes a whitespace-only `q` parameter, which otherwise displayed an active Search chip while showing every template.
- Updated the route matrix and resume checklist. Direct-entry route fallback remains unverified because no deployment rewrite configuration is present in the current repository.

Checks for this continuation:

- `npm run lint`, `npm run build`, and `git -c core.whitespace=cr-at-eol diff --check` — pending.
- Browser entry, Back/Forward, and mobile menu interaction remain unverified; see [resume-bug-fix.md](resume-bug-fix.md).

## Audit log — 2026-09-27 mobile lesson and indicator interaction continuation

- The shared Code Concepts simulation shell now opens its engine-data panel by default only at desktop widths. On smaller screens the panel overlays the lesson instead of shrinking the chart, and the header control can open or close it. Responsive viewport height and spacing account for mobile browser chrome.
- Removed the simulation shell's floating data-panel shortcut because it overlapped the fixed “Mark as learned” action on narrow screens. Reset, Exit, and Engine Data controls now have touch-sized targets; the panel toggle exposes expanded state.
- The Algo Trading pivot lab now checks the required nearest right-side bars instead of requiring an exact count. Revealing more history no longer removes a confirmed pivot. Its slider and Reveal next bar action now cover all five right-side sample bars, and the status describes confirmation timing accurately.
- Finhub Project Journey's section dots now have 44px targets, visible keyboard focus, focusable labels, and a named navigation landmark.
- The shared Finhub shell now skips scroll-observer setup when `IntersectionObserver` is unavailable instead of throwing during mount. Sidebar parent and subsection actions expose current/expanded state and keyboard focus.
- Remaining Code Concepts walkthrough and Finhub chart observers now fall back to window resize or skip scroll highlighting when the observer APIs are unavailable; the source sweep found no other unguarded observer construction outside the excluded tools tree.
- Finhub footer navigation and theme actions now use explicit button types and consistent keyboard focus styling, preserving their existing section, workspace, and root targets.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 48 seconds; Vite continues to warn about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser interaction and small-screen visual behavior remain unverified; see [resume-bug-fix.md](resume-bug-fix.md).

## Audit log — 2026-09-26 demo control interaction continuation

- Blog commerce visuals now let readers add a sample product or bundle and perform a clearly labeled local demo checkout; animated loops clean up when their components unmount.
- Contract Redline's finding can be opened with mouse or keyboard, closed explicitly, applied to the sample clause, or ignored. Focus changes no longer dismiss the finding before its action can be clicked.
- Auth Flaws admin panel actions now report a local demo selection instead of appearing to operate a connected system.
- Agent Terminal accepts a non-empty instruction and reports that it was captured locally, without implying a remote agent ran it.
- Fleet Catalog's Inspect Agent Spec buttons open an Escape/backdrop-dismissible specification dialog; category controls expose selected state.
- Advanced Chart BUY/SELL controls record a paper order at the displayed price and visibly confirm that no live order was sent.
- A static JSX scan found no enabled buttons without a handler or submit action outside the excluded `src/finhub/tools/**` utility tree.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 48.40 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Runtime clicks, routing, and browser Back/Forward remain unverified because this environment has no browser executable and the preview server cannot bind to localhost (`listen EPERM`).

## Audit log — 2026-09-26 data endpoint and Agent Labs return continuation

- Code Concepts now reports partial or complete failures across its curriculum JSON requests and exposes a retry control. Previously the learning path silently skipped failed files and could resemble a valid empty course; Search already had its own partial-data notice and retry.
- Finhub's non-tools data reads were matched to their public JSON resources. Documentation Map, Project Journey, Strategy Overview, and Key Terms validate responses and provide retry feedback; Code Concepts category files are centralized in its data-file manifest.
- The Agent Labs root had two TypeScript errors because Reading and Articles were mounted without their required `onBrowseTopics` action. Their topic links now return to the interactive topics view.
- Local static analysis found no other `fetch()` calls outside the excluded Finhub tools utility tree, apart from the documented sample code snippets.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 43 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser interactions and deployed direct-route rewrites remain unverified; see [resume-bug-fix.md](resume-bug-fix.md).

## Audit log — 2026-09-26 Scanner settings and scripted navigation continuation

- Scanner Settings no longer displays fabricated API-key placeholders or an apparently editable Shodan key. It states that provider and scanner integrations are not connected and that credentials cannot be entered in this preview.
- Custom scanner targets now use a labeled controlled form, submit consistently from Enter or the button, trim the input, and do not start a scan for whitespace.
- Scripted scan timers are canceled before another scan and on unmount. Finishing a scan no longer steals navigation if the user has left the execution view; opening Scans while idle now reports “No Active Scan” instead of falsely showing an active run.
- The empty Reset Simulation handler in Security Tools now clears the selected answer and result, and stays disabled until there is state to reset.
- A second static event-handler and anchor scan found no empty JSX handlers, inert enabled buttons, anchors without destinations/actions, or `javascript:`/bare-`#` links outside `src/finhub/tools/**`.
- The input/select/textarea scan found no editable fields without a change, input, or key handler (or explicit read-only/disabled state) outside that same excluded tree. All application data `fetch()` calls found outside the excluded tree point to local JSON resources; no Axios/WebSocket/EventSource client is used there.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 49 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed after removing three trailing spaces in the legal-agent sidebar.
- Browser interactions remain unverified in this environment.

## Audit log — 2026-09-26 empty callback cleanup

- The shared DevLush container's `onSimulationComplete` callback is now optional, and both Agent Labs roots no longer pass empty callback functions. Successful completion still shows the container's completion feedback and returns to the topic view.
- A TSX function-body scan now finds no empty function bodies outside `src/finhub/tools/**`.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 40 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.

## Audit log — 2026-09-26 storage resilience continuation

- DevLush lesson progress now clamps old saved indices to the current activity list, and browser storage failures no longer crash the lesson. Lessons with no activities show an explanation and a Back to Module Hub action.
- DevLush topic-scroll save and restore now tolerate blocked `sessionStorage`.
- Roadmap lessons with no activities show an explanation and a Back to Roadmap action.
- Agent Theory saved-item data is validated before rendering. Storage write failures are returned to the caller and shown to the user instead of producing a false success message; save IDs have a fallback when `crypto.randomUUID` is unavailable.

Checks for this continuation:

- `npm run lint` — passed (`tsc --noEmit`, exit code 0).
- `npm run build` — passed in 1 minute 45 seconds; Vite still warns about chunks larger than 500 kB.
- `git -c core.whitespace=cr-at-eol diff --check` — passed.
- Browser storage-disabled behavior and lesson controls remain source-verified, not interactively exercised.
