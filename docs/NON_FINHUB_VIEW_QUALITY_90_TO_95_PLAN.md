# GPTX.VIP non-Finhub view quality plan: 9.0–9.5

**Plan date:** 2026-09-30  
**Status:** Source implementation in progress; target scores have not been earned.  
**Baseline:** [APP_VIEW_QUALITY_RATINGS_AND_EPISODIC_PROMPTS.md](./APP_VIEW_QUALITY_RATINGS_AND_EPISODIC_PROMPTS.md)  
**Route reference:** [APP_FRONTEND_ROUTE_MATRIX.md](./APP_FRONTEND_ROUTE_MATRIX.md), supplemented by the current catalog router, which adds `/agents/lab/:topicSlug`.

## Scope and score rule

Cover `/`, `/profile`, every Roadmap and Blogs route, `/agents`, `/agents/templates`, `/agents/templates/:slug`, `/agents/lab`, `/agents/lab/:topicSlug`, and the meaningful screens inside Agent Labs. Agent Labs Topics, Roles, and Workspace screens mostly share `/agents/lab`; **internal view** below means a view selected through router state, not a separate URL. Include direct-link error/empty states within their owning route. The legacy `/agent/*` redirect and unknown-path redirects are navigation behavior, not scoreable screens.

Exclude all `/finhub*` screens and the shared course implementation behind `/code_concepts*`, `/core_concepts*`, and `/math_primer*`. `/profile` stays in scope because it is a standalone endpoint, although its component lives in the Finhub source folder. Links to excluded destinations may remain in shared navigation; changing the excluded destination screens is outside this plan. The root page's Code Concepts promotional section may be judged for home-page clarity, without changing the course itself.

The left score in each row is the **current source-review estimate** from the baseline document; the right score is the **target after implementation and rendered review**. A 9.0 screen must make its purpose, next action, state, provenance, and exit clear at desktop and phone sizes. Scores of 9.3–9.5 additionally need exceptional content hierarchy, polished interaction details, and no unresolved core flow. New or changed content cannot earn a target score merely by adding decoration. Each named owning component and principal child should meet at least **9.0** in its own responsibility; the row target is the view goal. The direct topic route's 7.1 baseline is provisional because it has not been reviewed separately in a browser.

## Shared component and CSS work

| Existing component or pattern | Target | What to do |
|---|---:|---|
| Root `Navbar` / `Footer` used by `/` and the catalog | 9.2 | One compact navigation model with a visible current area, useful mobile menu grouping, consistent focus styling, and accurate destination labels. Keep route changes inside their owning root. |
| `RoadmapLayout` / `RoadmapSidebar` | 9.1 | Keep topic, chapter, and progress context visible without competing with reading or labs. Collapse to a labeled topic control on narrow screens. |
| `BlogsLayout` / article navigation | 9.2 | Use one editorial width and heading scale in standalone and embedded modes; adapt the return destination to each parent. |
| `DevLushLayout`, `DevLushSidebar`, `AgentLabsMobileTopicRail`, `AgentLabsMobileLearningNav` | 9.2 | Preserve the existing phone topic rail and Learn/Explore/Saved navigation. Add persistent selected and completed states; reserve safe-area space so runner actions are never covered. |
| `AgenticRolesLayout` | 9.1 | Keep role, difficulty, scenario progress, and exit in a stable frame; place the current task before terminal detail. |
| `AgentWorkspace` and its existing `AgentPreviewNotice` | 9.1 | Reuse the preview notice, add explicit source/freshness per finding, and give the ten agent apps one common return/status language. Do not repeat a generic banner inside every panel. |

**Proposed additions, only where the current view lacks the behavior:**

| Proposed component | First owner and reuse | Responsibility |
|---|---|---|
| `ViewContextBar` | Roadmap, Agent Labs, Roles | Compact parent → current view → next step line, with a Back destination. It reflects actual router state and does not invent URL paths. |
| `ProgressSummary` | Roadmap, Labs, Roles | Completed/total count and the next available activity. Show “progress unavailable” when there is no stored completion data. |
| `StatePanel` | Search, Reading, Articles, catalog | Reusable loading, no-result, unavailable-content, and failed-action body with a single relevant recovery action. |
| `SourceStatus` | Agent Workspace domain screens | Source type, sample/live status, and freshness next to the metric or finding it qualifies; it must be fed by real metadata, not a decorative “live” dot. |
| `ResponsiveDataFrame` | Agent Workspace dense tables/charts and lab widgets | Contains wide data with a labeled horizontal scroll region or stacked phone cards; never lets the whole page overflow. |
| `ActionSummary` | Labs and agent tools | State sequence: inputs → action → result → next step, including reset/retry where the action can fail. |

**Layout rules.** Use a content rail around 72–80rem for hubs and dashboards and a 42–46rem measure for long reading. At 320–430 CSS px, make primary actions full width or comfortably tappable, use one column, and keep sticky controls above `env(safe-area-inset-bottom)`. At tablet widths, move from one column to a two-column topic/card grid where content allows. On desktop, use a sidebar/content or content/inspector split only if both columns carry a real task. A sticky header must not hide an anchor target. Review at 360, 390, 768, 1024, and 1440 CSS px plus a short landscape viewport.

**Effects.** Use one restrained system: 160–220ms color, border, and transform transitions; a 1–2px lift and soft shadow on actionable cards; a persistent inset or border accent for selection; and a 2px `:focus-visible` ring with sufficient contrast. Use subtle background gradients to separate major sections and skeleton or progress shimmer only while data really loads. Make completion feedback a brief color/shape change with a text announcement. Keep tool outputs, evidence, and disabled states stable; avoid animated numerical metrics, permanent glow, background parallax, or blur that reduces text contrast. Honor `prefers-reduced-motion: reduce` by removing nonessential transforms and smooth scrolling. Effects never carry meaning alone.

## Endpoint and view episodes

Each row is a standalone implementation episode. Improve the named **existing** components, add the proposed component only if its responsibility is absent, apply the listed layout/effect, and stop at the stated gate. Preserve current route, query, history, and favorite behavior. Targets are per view; the named principal components also need a 9.0 or higher component review.

### Main home and profile

| Episode / endpoint · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| H01 `/` · 7.7 → **9.4** | `RootHomePage` 9.4; root `Navbar` 9.2; carousel and intent cards 9.2 | A compact “choose your path” comparison with audience, time/effort, and result for each destination | Keep the hero two-column on wide screens and a single decision stack on phones. Separate editorial sections with quiet gradients; lift only clickable cards. | A new visitor can distinguish lessons, Agent Labs, project surfaces, and finance tools before scrolling past the first choice; carousel controls and destination labels work with keyboard and touch. |
| H02 `/profile` · 6.7 → **9.1** | `ProfileInfo` 9.1; credential, skills, and contact sections 9.0 | Evidence/link row for verifiable work and a concise current-focus summary | Narrow biographical text, two-column evidence/skills on desktop, one column on phone; use borders and typographic hierarchy instead of equal-weight cards. | Current role, proof, expertise, and contact path are scannable; copied contact feedback is announced and every outbound claim has a valid destination or is labeled as a summary. |

### Roadmap

| Episode / endpoint · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| R01 `/roadmap` · 7.3 → **9.3** | `RoadmapContainer`, `RoadmapHub`, `RoadmapLayout` 9.2; chapter cards 9.1 | `ProgressSummary` and a “start/continue” decision strip | Desktop topic rail plus primary course column; phone topic picker followed by one prominent next chapter. Selected topic gets a persistent accent, not hover-only styling. | First-time and returning learners can each find a next chapter in one scan, with honest progress if completion is absent. |
| R02 `/roadmap/:topic` · 7.3 → **9.2** | `RoadmapHub`, `RoadmapSidebar`, chapter cards 9.1 | `ViewContextBar` with topic outcome and chapter counts | Keep chapter cards in a readable one/two-column grid; collapse sidebar to a labeled picker on phones; use subtle completed/current borders. | Direct topic links show the topic goal, chapter type, completion state, and a clear way back to all topics. |
| R03 `/roadmap/search` · 7.0 → **9.1** | `RoadmapSearchView` and result cards 9.1 | Shared `StatePanel` for empty/loading/error; selected-result context | Search field first; optional filters in a compact row, then a one-column ranked result list. Highlight matched terms without reducing contrast. | Results show parent topic, activity type, and likely next action; opening and closing search restore focus and Back returns correctly. |
| R04 `/roadmap/:topic/:chapter` reading · 7.1 → **9.3** | `RoadmapReadingView` 9.3; favorite and Back/Complete controls 9.1 | `ViewContextBar`, chapter progress, completion confirmation | 42–46rem prose measure; optional sticky section index on desktop and inline index on phones; headings have generous scroll margin. | Direct links and search launches retain topic context; learner can finish, save, or return without losing position. |
| R05 `/roadmap/:topic/:chapter` lab · 6.9 → **9.1** | `RoadmapLabRunner` 9.1; settings/activity shell 9.0 | `ActionSummary` and `ResponsiveDataFrame` for wide activities | Setup summary above task, activity in a bounded central column, outcome panel below; sticky actions only if they do not cover content. Use a brief state transition on submit/reset. | Inputs, active step, result, reset, and completion are always distinguishable, including a direct chapter link and a 360px viewport. |

### Blogs

| Episode / endpoint · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| B01 `/blogs` · 7.3 → **9.2** | `BlogsView`, `BlogList`, `BlogCard`, `BlogsLayout` 9.1 | Featured-story treatment and topic/filter summary | One featured article above a consistent two/three-column card grid; cards show topic, date, and reading time. Limit lift/shadow to links. | A reader can scan coverage and find an article by topic; empty filters have a reset; cards remain readable at phone width. |
| B02 `/blogs/:id` · 7.2 → **9.4** | `BlogArticle`, `BlogRenderer`, `BlogHero`, table of contents 9.2 | Reading progress and stable article return context | 42–46rem prose with an optional sticky desktop table of contents; inline/collapsible contents on phones. Use restrained active-heading highlight and scroll-margin. | Headings, figures, tables, and interactive blocks fit 360px; index/previous context survives direct entry, and invalid IDs recover to the index. |

### Agent catalog and direct Agent Labs endpoint

| Episode / endpoint · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| C01 `/agents` · 7.3 → **9.4** | Catalog `Home` 9.4, shared root navigation 9.2, `TemplateCard` / `TemplateThumb` 9.1 | A short “learn / inspect / contact” path selector | Hero two-column desktop, one-column phone; topic previews before catalog categories. Keep the existing preview art, with small card lift and clear focus ring. | Labs and project surfaces are explained as distinct destinations and every primary CTA reaches the promised view. |
| C02 `/agents/templates` · 7.5 → **9.3** | `Browse` 9.3; existing active filters/result count and `TemplateCard` 9.1 | A compare shortlist for 2–3 surfaces | Existing sticky desktop filters; a visible collapsible filter sheet on phones, results in 1/2/3 columns. Use an accent border for applied filters. | Query-linked search/category/framework/sort restore on reload; comparison exposes capabilities and limits; no-result recovery clears the right filters. |
| C03 `/agents/templates/:slug` · 7.2 → **9.2** | `TemplateDetail` 9.2; existing fit/limitations section, `TemplateThumb`, and related cards 9.1 | Contact preparation checklist tied to the existing fit summary | Visual and decision summary side by side on desktop, stacked on phones; sticky contact only when it does not hide content. Use section dividers, not competing glows. | User can decide fit and next step without guessing whether data, deployment, or support are included; unknown slugs return to catalog. |
| C04 `/agents/lab/:topicSlug` · 7.1 provisional → **9.2** | `LabRuntime` 9.2; selected `DevLushHub` / `DevLushRunner` 9.1 | Direct-entry context banner and `StatePanel` for unknown slug | Open directly into the selected topic with one clear first lesson; use the same topic rail and chapter layout as Labs. Invalid slug uses a calm, bounded recovery panel. | Reloading a valid slug preserves its selected topic, launch and Back are predictable, and a bad slug points to `/agents/lab` rather than an unrelated catalog home. |

### Agent Labs internal views under `/agents/lab`

| Episode / internal view · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| L01 landing · 6.9 → **9.3** | `LandingPage`, Labs `Navbar`, destination cards 9.2 | One recommended first lesson and an honest availability label for reference content | Single hero/next action, then Topics/Roles/Workspace choices; use a quiet background gradient and one dominant button. | A newcomer knows where to begin and what each destination contains, with no dead-end suggestion of full articles or an existing reading library. |
| L02 Topics hub · 7.4 → **9.3** | `DevLushContainer`, `DevLushHub`, `DevLushSidebar`, mobile topic rail 9.2 | Goal grouping and `ProgressSummary` when completion exists | Keep existing horizontal phone rail and Learn/Explore/Saved bar; desktop sidebar beside a chapter grid. Selected topic uses an accent border and `aria-current`. | All topics remain reachable, current topic stays visible after selection, first lesson is prominent, and completed counts are real or explicitly unavailable. |
| L03 topic search · 7.3 → **9.2** | `DevLushSearchView` 9.2; suggestions/result cards 9.1 | `StatePanel` for no match and result-origin labels | Field and suggestions above a one-column results list, clear of the phone learning bar. Use matched-term highlight plus keyboard focus ring. | Suggestion navigation, Escape/close, result launch, no results, and returned focus work with keyboard and screen reader. |
| L04 topic chapter · 7.1 → **9.2** | `DevLushRunner`, `DevLushTheoryBridge`, `DevLushTheoryVisual` 9.1; registry panels ≥9.0 | `ActionSummary` and `ResponsiveDataFrame` where activities overflow | Phone: task → activity → theory → outcome; desktop: activity with an optional theory side panel. Keep controls above the mobile safe area. | Representative charts, terminals, forms, and drag targets from every activity family work at 360/390/768px; energy, reset, feedback, and completion are unambiguous. |
| L05 Reading · 6.9 → **9.0** | `ReadingView` 9.0 | Available-content index and `StatePanel` for an empty library | Editorial reading measure and simple section landmarks; progress appears only for real entries. No animated empty shell. | The current empty dataset is described plainly and a learner can reach available topic lessons; later added readings have source, section, and return context. |
| L06 Articles · 6.5 → **9.0** | `ArticlesView` and article cards 9.0 | Preview status label and `StatePanel` until full articles exist | Compact editorial card list with topic and summary; avoid a faux article-detail layout. | Cards do not promise an article route that does not exist; each has a valid next action. Full-article work is separately scoped if content is supplied. |
| L07 embedded Blogs · 7.1 → **9.2** | Embedded `BlogsView`, `BlogList`, `BlogArticle` 9.1 | `ViewContextBar` with “Back to Agent Labs” | Reuse standalone editorial widths; constrain the embedded scroll area without nested page-wide scroll. | Article and index return to Labs, standalone blog URLs remain unchanged, and both variants share one readable renderer. |
| L08 Favorites · 7.0 → **9.1** | `FavoritesView`, existing type/origin labels, and favorite cards 9.1 | Stale-item `StatePanel` where a launch target is gone | Group by item type or course, one-column phone/two-column desktop; use a small saved-state transition and visible persistent state. | A saved item shows origin and destination before launch; missing content offers remove/recover, and returning from a lesson restores the saved list. |
| L09 Topic Theory · 6.9 → **9.1** | `TopicTheoryHub`, theory cards, existing source-link and collection controls 9.1 | Clear collection context alongside saved theory | Two-column reading/collection split on wide screens, one-column cards on phone; use selected borders and a quiet modal backdrop. | Users can tell saved theory from source material, recover empty collections, and return to a source lab when it exists. |

### Agentic Roles internal views

| Episode / internal view · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| A01 Roles hub · 7.1 → **9.2** | `AgenticRolesContainer`, `AgenticRolesHub`, `AgenticRolesLayout` 9.1 | Role outcome/prerequisite summary and `ProgressSummary` | Role selector beside chapter path on desktop, stacked on phones; use selected-role accent and clear locked-state contrast. | Every role says what it teaches, what is required, and which chapter to take next. |
| A02 Roles search · 7.1 → **9.1** | `AgenticRolesSearchView` 9.1 | `StatePanel` and result context fields | Input, suggested terms, then a one-column result list with role/difficulty/action. Keep close control visible at phone width. | Search results launch the correct role/chapter; empty recovery and focus/Back behavior work. |
| A03 Roles runner · 6.9 → **9.2** | `AgenticRolesRunner`, `AgentTerminalLog`, `CandidateAssessmentWidget`, `RoadmapMilestoneCard` 9.1 | `ActionSummary` and explicit sample-output label | Task and success criteria above terminal/assessment split; stack on phone. Keep terminal scrolling inside its panel and use restrained step-complete feedback. | Learner can separate instructions, sample output, submitted action, feedback, energy lock, and completion without guessing. |

### Agent Workspace internal views

The existing domain dashboards already label much preview data. Keep `AgentPreviewNotice` at the workspace level and attach `SourceStatus` only to individual findings that need source/freshness. Do not imply a live connector where none exists. Every app row includes its child screens named in the baseline review; selection between those child screens is local app state and remains part of the same view rating.

| Episode / internal view · current → target | Existing components to improve; component target | Add | Layout and CSS treatment | Stop when |
|---|---|---|---|---|
| W01 Workspace home · 6.9 → **9.3** | `AgentWorkspaceHome`, category cards, `AgentWorkspace` 9.2 | Goal-based comparison and “best first agent” guide | Category tabs/rail plus concise agent cards; 1/2/3-column responsive grid. Selected goal has persistent accent; hover lift only on links. | User can choose among ten apps by task, see prototype status, and return from an app to the same workspace position. |
| W02 Scanner · 6.9 → **9.1** | `ScannerAgentMainView`; dashboard, activity, missions, queue, recon, settings panels 9.0 | Shared scan status, `SourceStatus`, empty queue state | Task-first overview, then a bounded detail workspace; tables use `ResponsiveDataFrame`; severity uses icon/text plus color. | Scope, scan state, finding source, and next analyst action agree across panels; no example output looks like a live scan. |
| W03 E-commerce · 6.8 → **9.1** | `EcommerceAgentMainView`, dashboard/data views, sidebar 9.0 | Metric provenance and action-to-data drilldown | KPI summary above a two-column insight/data split, one column on phone; subtle metric grouping and selected tab border. | Each business metric has period/source, related detail, and a meaningful next action; sample data is marked. |
| W04 DevTools · 6.9 → **9.1** | `DevtoolsAgentMainView`, dashboard, sidebar 9.0 | “Run a sample task” start card and `ActionSummary` | One primary task panel with tools/results adjacent on desktop; stack on phone, bounded terminal output. | First task, input, running/done/error state, and result are legible; simulated operations are explicit. |
| W05 DFIR · 6.8 → **9.2** | `DfirAgentMainView`, dashboard/data/tools 9.1 | Incident timeline and evidence provenance | Incident priority list plus selected case detail; mobile cards replace wide tables. Highlight current severity without flashing or alarm animation. | Analyst sees severity, evidence chain, decision, and next step in order, with sample findings labeled. |
| W06 Threat Intelligence · 6.8 → **9.1** | `ThreatIntelAgentMainView`, dashboard/data/tools 9.0 | Indicator confidence/source strip | Overview, ranked indicator list, then detail drawer; wrap long hashes/domains inside a bounded data frame. | Observation, confidence, source date, and suggested action are separately visible. |
| W07 Cloud Posture · 6.8 → **9.2** | `CloudPostureAgentMainView`, dashboard/data/tools 9.1 | Risk-to-remediation tracker | Risk summary and prioritized findings above resource detail; phone finding cards replace dense grid. Use progress color only with text/status. | Every finding names affected resource, severity basis, sample/live status, owner or unknown owner, and remediation state. |
| W08 SAST · 6.9 → **9.2** | `SastAgentMainView`, dashboard/data 9.1 | Finding-to-file context and remediation checklist | Finding list plus code/evidence panel on desktop; stacked list/detail on phone; code scrolls inside its own region. | File/line, severity rationale, safe proposed fix, and verification step connect without implying an actual repository scan. |
| W09 Red Team · 6.7 → **9.0** | `RedTeamAgentMainView`; dashboard, recon, lateral movement, report, tools/settings 9.0 | Scenario boundary, stop/reset control, evidence-to-report trace | Scenario steps in a rail, active exercise in the center, output below; small-screen steps collapse to a selector. Keep danger states static and text-labeled. | Authorized lab scope, current step, simulated output, reset, and report evidence remain visible through the scenario. |
| W10 Legal Contract · 6.9 → **9.2** | `LegalContractAgentMainView`, dashboard/data views 9.1 | Clause review queue and source/proposal diff | Clause list and selected-clause detail on desktop, stacked on phone; use restrained added/removed highlights with text labels. | Source wording, example finding, proposed edit, uncertainty, and human review status never merge into one claim. |
| W11 Memory Types · 7.0 → **9.1** | `ComprehensiveMemoryTypesLab` and seven memory panels 9.0 | Comparison matrix and common example frame | Type overview above a comparison grid; phone uses one memory type per card, wide tables stay bounded. Use a selected-type accent rather than animated diagrams. | Every type has the same store/retrieve/example/limit/trade-off fields, and learners can compare types without opening seven unrelated screens. |

## Execution and re-rating

1. Build shared context/state/data primitives first, but add them to a view only when it has a real need. Preserve existing app roots, routing state, and root component reuse required by `AGENTS.md`.
2. Implement H, R, B, C, L, A, then W episodes in small groups by shared owner. For each episode, inspect the live component and data model before creating a new abstraction. Keep the current baseline score until the change is rendered.
3. Re-rate each row only after reviewing its default, loading/empty/error, direct entry, return, phone, desktop, keyboard, and reduced-motion states. Review the named child components separately against their assigned target. Record evidence and unresolved gaps in the baseline document's execution ledger.
4. A view with unavailable underlying content may earn **9.0 for honest, useful empty/preview UX**, but must not claim 9.3–9.5 as a complete reading/article experience until real content and destinations exist. A view whose core action fails cannot pass 9.0 regardless of visual polish.

**Reusable episode prompt:** “Work only in `gptxvip`. Take episode `<ID>` from this plan. Inspect the named current component, its child screens, current data, and its route/state entry. Apply the specified component, layout, and CSS changes using existing shared primitives where possible. Preserve navigation and honest sample/empty status. Stop when the row's gate holds at phone and desktop widths, with keyboard, reduced motion, and direct-entry/return behavior reviewed. Update the source-review rating only after rendered evidence supports it.”

## Implementation checkpoint — 2026-09-30

This checkpoint records source changes against the episode gates. It does **not** award 9.x scores: the runtime has no browser binary for rendered phone, desktop, touch, keyboard, and reduced-motion review. The existing baseline ratings remain historical estimates. `npm run lint` (`tsc --noEmit`) and `npm run build` passed after the source pass. Vite reports a large main bundle; this remains a performance review item.

| Episode | Source change made | Gate still requiring review or work |
|---|---|---|
| H01 | Home compares four destinations by audience, result, and effort; navigation and primary Labs action are clearer. The scroll-revealed Agentic Roles widget also appears on public home and deep-links to the selected role. | Rendered first-choice scan, widget reveal, and carousel keyboard/touch review. |
| H02 | Profile has current focus, evidence paths, copy feedback, and calmer styling. | Verify every outbound destination and phone hierarchy in browser. |
| R01 | Roadmap hub shows persisted completion and a next-chapter action. | First/return visit and viewport review. |
| R02 | Topic selection has mobile picker, active state, and chapter context. | Direct topic URL and Back/focus review. |
| R03 | Search uses a shared no-match panel and a static suggestion layout. | Search launch, return focus, and result ranking review. |
| R04 | Reading has topic context, a 46rem measure, reading-position bar, and missing-content recovery. | Scroll behavior inside real chapter content, direct entry, and completion confirmation review. |
| R05 | Runner shows the current task, step count, honest grading note, bounded activity region, and missing-component recovery. | Exercise-family overflow and actual result/reset behavior at 360/390/768px. |
| B01 | Blog index has a featured story, restrained cards, and filter recovery. | Rendered topic scan, dates, and phone card review. |
| B02 | Article has a narrow measure and reading progress. | Figures, tables, embedded blocks, direct entry, and return-context review. |
| C01 | Catalog home distinguishes Labs, surface inspection, and owner contact; topic previews use real lesson routes. | Hero and CTA destination review at phone/desktop widths. |
| C02 | Catalog browse has a 2–3 item comparison shortlist. | Query restoration, mobile filter sheet, and no-result recovery review. |
| C03 | Detail has contact preparation and explicit fit assumptions. | Unknown slug, sticky contact, and related-card review. |
| C04 | Valid topic slugs enter the lesson; invalid slugs recover to Labs topics. | Reload, selected topic/first lesson, and Back in a browser. |
| L01 | Labs landing names a recommended first interactive lesson and includes the same scroll-revealed Agentic Roles use-case widget. | Render the widget through viewport entry, selection, role launch, and reduced-motion mode. |
| L02 | Hub groups topics by goal and uses actual stored completion counts. | Topic visibility, first lesson, phone rail, and return review. |
| L03 | Search suggestions are static and keyboard described; no-match uses `StatePanel`. | Screen-reader suggestion navigation, close focus, and phone learning-bar clearance. |
| L04 | Runner now shows the current task and step above the activity, resets saved steps when the chapter changes, uses the correct Labs context, and has honest missing-activity recovery. | Every activity family still needs a 360/390/768px interaction audit and outcome/reset review. |
| L05 | Reading describes the currently empty library and links to available lessons. | Later real entries need source/section review; current empty state needs rendered review. |
| L06 | Articles are labeled as topic previews with valid lesson destinations. | Full articles remain unavailable; preview layout needs rendered review. |
| L07 | Embedded Blogs uses the shared renderer and Labs return label. | Embedded scroll and standalone URL/back behavior need browser review. |
| L08 | Favorites now detects stale lesson IDs, disables dead launches, offers removal, and keeps origin/type labels. | Saved-list return, migration, and phone collection controls need browser review. |
| L09 | Theory collections now separate saved copies from sources; Agentic Roles notes return to their role chapter when available. | Old saved-note migration, empty collection, and collection/card interaction review. |
| A01 | Roles hub has role outcome, prerequisites, progress, and selected role state. | Per-role next chapter and locked-state review. |
| A02 | Search has role/difficulty context, shared no-match recovery, suggested role filters, and opener focus restore. | Search launch, Escape, Back, and assistive-technology review. |
| A03 | Runner and assessment separate case briefing, sample output, choice, feedback, and completion; terminal controls are labeled. | Representative activity, energy lock, and narrow terminal review. |
| W01 | Workspace entry has goal-based choices, a suggested starting set, and return-position storage. | All ten destinations and phone category navigation review. |
| W02 | Scanner dashboard, activity, mission plan, and terminal now label scripted examples, scope, and reset; the sidebar collapses to an icon rail on phones. | Queue/recon/settings consistency, severity details, and table overflow review. |
| W03 | E-commerce dashboard/data have source and measurement-window notes, a sample business question, data drilldown, and a phone icon rail. | Every metric-to-detail link and sidebar state review. |
| W04 | DevTools dashboard offers a deterministic sample task, source label, running/done/reset state, and `ActionSummary`; example alerts no longer assert a scan. | Remaining tools/output views and bounded terminal review. |
| W05 | DFIR dashboard/data now label provenance per record; its sample timeline has status/reset, and phone navigation uses an icon rail. | Original evidence is unavailable; data/tools evidence chain and rendered trace review. |
| W06 | Threat Intelligence dashboard/data distinguish sample source, uncertainty, and mobile cards; a bounded sample trace has status/reset. | Indicator detail, verified source date, and long-value wrapping across data/tools. |
| W07 | Cloud Posture dashboard/data label example findings, resource owner/status gaps, and mobile resources; the sample review has status/reset. | Actual owner/remediation tracker and data/tools continuity. |
| W08 | SAST dashboard/data label example findings and bound code excerpts. | File/line rationale, fix verification, and no-connected-repo review. |
| W09 | Red Team scenario now has fixed scope, stop/reset, status summary, and an event trace in its report, separate from reference paths. | Recon/lateral/settings consistency and complete scenario on phone. |
| W10 | Legal Contract data shows a review queue with source, finding, proposal, and human status separated. | Actual source wording is unavailable; dashboard and phone review remain. |
| W11 | Memory Types uses a shared comparison frame and phone cards for the same fields. | Seven type panels, example consistency, and screen-size review. |

Shared source primitives added in this pass: `StatePanel` for missing/empty states, `SourceStatus` for sample provenance, `ResponsiveDataFrame` for wide data, and `ActionSummary` for scripted task stages. These are used where the view needs them; they do not replace domain-specific content. The requested role widget lives in `AgenticRoleUseCases`, appears on public home and Labs landing, and opens the real Agentic Roles curriculum.
