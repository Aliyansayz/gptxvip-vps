# GPTX.VIP View Quality Ratings and Episodic Prompts

**Review date:** 2026-09-26  
**Scope:** User-facing GPTX.VIP routes and the principal views mounted inside them.  
**Rating basis:** Source-level UX and component-structure review; no browser session or visual screenshot review was available.

## How to read the ratings

Scores are out of 10. They estimate how well each surface communicates its purpose, organizes its content, supports the main interaction, handles feedback and states, and fits the app's component architecture. A score is a prioritization aid, not a usability-test result. The owning component and named child components are scored separately where the code gives them a distinct user-facing responsibility. A range means closely related screens share a shell or implementation and need a runtime pass before finer ranking.

The route inventory follows [APP_FRONTEND_ROUTE_MATRIX.md](./APP_FRONTEND_ROUTE_MATRIX.md). It includes mounted route views, meaningful internal screens, and the major Agent Workspace applications. It does not individually rate data records, every activity lesson, icon, primitive control, or Finhub simulator-engine utility. Those are called out in the episodes when they affect the parent view.

The review follows the repository instruction in `AGENTS.md`: preserve the existing app architecture, keep patterns consistent, and reuse root/shared components where that improves performance. The prompts below are scoped improvement episodes; they ask the implementer to inspect the current surface first, make a focused change, and stop at explicit acceptance criteria.

## View and component ratings

### Main site and Finhub

| Route / view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| `/` — GPTX.VIP home | **7.7** | `RootHomePage` **7.7** | Header/navigation 7.5; hero 7.8; intent cards 7.5; topic carousel 7.2; principles/CTA/footer 7.6 | Clear product entry and distinct calls to action. Improve topic discovery and explain the difference between the learning and workspace paths earlier. |
| `/finhub` — Finhub home | **7.3** | `HomeMainView` **7.3** | `HeroHeader` 7.5; `BentoGridFeatures` 7.5; `AssetSlider` 7.1; `CandlestickWithLOB` 7.4; `HorizontalOrderFlow` 7.2; `OrderBookLab` 7.3; `GlossaryIntro` 6.9; `MarqueeTicker` 6.7 | Strong interactive breadth and lazy-loaded panels. The long page needs a clearer task sequence and more consistent explanation of which data is simulated. |
| `/finhub/trade-type` — Trade Type | **6.8** | `TradeTypeView` **6.8** | `SingleTradeView` 6.9; `MultipleTradeView` 6.7; `BreakevenView` 6.8; `HedgeTradeView` 6.8 | The four examples share a useful parent, but the page is a long stack. Improve comparison, section orientation, and the relationship between each example and a user decision. |
| `/finhub/overview` — Strategy Overview | **6.9** | `OverviewView` **6.9** | Overview cards / data presentation 6.8 | Give the overview a sharper summary-to-detail hierarchy and make each model's assumptions and next action easy to scan. |
| `/finhub/map/doc-map` — Documentation Map | **7.1** | `MapView` **7.1** | `DocumentationMap` 7.2 | A useful structured reference surface. Strengthen selected-state visibility and clarify how to move from the map to the relevant working example. |
| `/finhub/map/project-journey` — Project Journey | **7.2** | `MapView` **7.1** | `ProjectJourneyView` 7.3 | A strong visual route through project stages. Prioritize mobile readability, step context, and orientation after selecting a node. |
| `/finhub/cointegration` — Cointegration | **6.8** | `CointegrationView` **6.8** | `CointegrationPage` 6.8; documentation section blocks 6.9 | The explanatory structure is present. Make the concept, assumptions, and practical interpretation more scannable and connect prose to evidence in the visual examples. |
| `/finhub/key-terms` — Key Terms | **7.4** | `KeyTermsView` **7.4** | `TermCard` 7.2; Dictionary / Volatility switch 7.5 | Data validation, loading, retry, empty states, and selected-state semantics are present. Improve term finding, grouping, and compactness for long definitions. |
| `/finhub/trading-tools` — Trading Tools | **6.8** | `TradingToolsView` **6.9** | Lazy lab selection and loading fallback 7.0 | This is a gateway to several dense workspaces. Make tool choice, readiness, and the expected first step more legible without rewriting the trading engines. |
| `/finhub/archive-tools` — Archived Tools | **6.5** | `TradingToolsView` **6.6** | Archive selection / loading fallback 6.8 | Distinguish archived status and compatibility from active tools at a glance, and make returning to current tools straightforward. |
| `/profile` — Profile | **6.7** | `ProfileInfo` **6.7** | Education / credential cards 6.8; skills groups 6.7; copy-contact action 7.0 | Information is comprehensive, but the page can better prioritize current focus and verified evidence over repeated metrics and decorative detail. |

### Learning and Roadmap

| Route / view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| `/code_concepts/:category` — Code Concepts course | **7.3** | Shared `CodeConceptsView` **7.3** | `CoreConceptCard` 7.4; `CoreConceptRunner` 6.9; `SearchConceptsView` 7.2; `FavoritesView` 7.1; mobile learning nav 7.5 | Course discovery, progress, search, saved lessons, and mobile navigation are represented. The lesson runner carries the most interaction complexity and should get the strongest focus/feedback pass. |
| `/core_concepts/:category` — Core Concepts course | **7.2** | Shared `CodeConceptsView` **7.3** | `CoreConceptCard` 7.3; `CoreConceptRunner` 6.9; shared search/favorites 7.1–7.2 | Reuses the course shell well. Clarify which activities are conceptual reading, practice, or simulation in the course cards and runner. |
| `/math_primer/:category` — Math Primer course | **7.2** | Shared `CodeConceptsView` **7.3** | `CoreConceptCard` 7.3; `CoreConceptRunner` 6.9; shared search/favorites 7.1–7.2 | The shared learning path is a good base. Give equations, worked steps, and visual explanations more room and preserve readability on narrow screens. |
| `/roadmap` and `/roadmap/:topic` — Roadmap hub/topic | **7.3** | `RoadmapContainer` **7.2** | `RoadmapSidebar` 7.1; `RoadmapHub` 7.5; chapter cards 7.4; `RoadmapLayout` 7.1 | Topic and chapter structure is clear. Improve course orientation, progress visibility, and sidebar behavior when a chapter is active. |
| `/roadmap/search` — Roadmap Search | **7.0** | `RoadmapSearchView` **7.0** | Search controls / result cards 7.0; keyword shortcuts 6.8 | Useful search entry point. Strengthen result context, empty/loading feedback, and keyboard focus when the view opens or closes. |
| `/roadmap/:topic/:chapter` — Roadmap reading chapter | **7.1** | `RoadmapReadingView` **7.1** | Reading content, favorite, Back/Complete actions 7.0–7.2 | The reading route has a clear purpose. Improve progress and completion feedback, and keep the chapter's parent/topic visible. |
| `/roadmap/:topic/:chapter` — Roadmap lab chapter | **6.9** | `RoadmapLabRunner` **6.9** | Lab settings / favorite / activity shell 6.8–7.0 | Flexible registry-driven activities provide breadth. Reduce first-use uncertainty with a stable setup summary, clear activity state, and a concise completion path. |

### Blogs and Agent catalog

| Route / view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| `/blogs` — Blog index | **7.3** | `BlogsView` **7.2** | `BlogsLayout` 7.1; `BlogList` 7.4; `BlogCard` 7.2 | Clear editorial surface and article selection. Improve topic filtering, reading-time scanning, and the distinction between featured and regular posts. |
| `/blogs/:id` — Blog article | **7.2** | `BlogsView` **7.2** | `BlogArticle` 7.3; `BlogRenderer` 7.2; `BlogHero` 7.3; table of contents 7.0; interactive blocks 7.1 | Rich article patterns support technical topics. Check reading width, heading rhythm, interactive-block affordances, and return-to-index orientation. |
| `/agents` — Agent catalog home | **7.3** | Catalog `App` **7.2**; `Home` **7.4** | `SiteHeader` 7.3; `TemplateCard` 7.3; `TemplateThumb` 7.1; `SiteFooter` 7.0 | Multiple paths into learning and the catalog are available. Reduce duplicated calls to action and state plainly what a project surface is before asking users to browse. |
| `/agents/templates` — Template catalog | **7.5** | `Browse` **7.5** | Search and filter panel 7.5; `TemplateCard` 7.3; filter selects 7.2 | URL-backed search, filters, and sorting are strong foundations. Improve comparison between results and make active filters and result counts more prominent. |
| `/agents/templates/:slug` — Template detail | **7.2** | `TemplateDetail` **7.2** | `TemplateThumb` 7.1; feature/stack summary 7.2; contact action 7.2; related cards 7.0 | Good space for a decision, but users need a stronger summary of fit, limitations, and what happens after the contact action. |

### Agent Labs and embedded learning

| Route / internal view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| `/agents/lab` — Agent Labs landing | **6.9** | `LandingPage` **6.9** | `Navbar` 7.0; landing sections 6.9; `Footer` 6.8 | The shell exposes several useful destinations. Make the first learning action and the difference between Topics, Roles, Workspace, and reference content more explicit. |
| Agent Labs Topics hub | **7.0** | `DevLushContainer` **7.0** | `DevLushHub` 7.1; `DevLushSidebar` 7.0; `DevLushLayout` 7.0 | Broad topic coverage is a strength. Improve topic grouping, level/outcome labels, and visual consistency between topic families. |
| Agent Labs topic search | **7.0** | `DevLushSearchView` **7.0** | Result cards / search controls 7.0 | Keep result labels tied to a topic and expected activity, and improve empty-state and keyboard focus behavior. |
| Agent Labs topic chapter | **6.9** | `DevLushRunner` **6.9** | `DevLushTheoryBridge` 7.0; `DevLushTheoryVisual` 7.0; activity registry panels 6.7–7.1 | Interactive breadth is high. Make task instructions, current state, and success feedback more uniform across registered activities. |
| Agent Labs Reading | **6.9** | `ReadingView` **6.9** | Reading shell and progress 6.9 | Improve reading landmarks, progress context, and return links so the reference remains connected to the active course. |
| Agent Labs Articles | **6.5** | `ArticlesView` **6.5** | Article cards 6.5 | Treat this as an explicit article index with clear availability and next actions; avoid implying full articles exist when only summaries are available. |
| Agent Labs Blogs | **7.1** | Embedded `BlogsView` **7.2** | `BlogList` 7.4; `BlogArticle` 7.3; embedded return control 6.9 | The reusable blog system works inside the lab shell. Keep the return destination and embedded-vs-standalone behavior obvious. |
| Agent Labs Favorites | **7.0** | `FavoritesView` **7.0** | Favorite cards / launch actions 7.0 | Saved items span more than one learning system. Make item type, origin, and launch destination visible before opening. |
| Agent Labs Topic Theory | **6.9** | `TopicTheoryHub` **6.9** | Theory cards/grid 6.9; save/collection actions 7.0 | Collections help retain reference material. Improve empty states, collection context, and the path back to the originating topic. |

### Agentic Roles

| Internal view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| Agentic Roles hub | **7.1** | `AgenticRolesContainer` **7.0** | `AgenticRolesLayout` 7.1; `AgenticRolesHub` 7.2; difficulty controls 7.0 | Role and chapter organization is promising. Put role outcomes and prerequisites ahead of decorative terminal detail. |
| Agentic Roles search | **7.1** | `AgenticRolesSearchView` **7.1** | Search controls/results 7.1 | Make result role, difficulty, and expected action visible; retain robust keyboard and close behavior. |
| Agentic Roles chapter runner | **6.9** | `AgenticRolesRunner` **6.9** | `AgentTerminalLog` 7.0; `CandidateAssessmentWidget` 6.9; `RoadmapMilestoneCard` 6.9 | Operational scenarios are engaging. Separate instructions, live output, and assessment feedback so the learner can tell what they should do next. |

### Agent Workspace

These applications are selected within Agent Labs and use same-path router state for their internal views. The rating is for the application entry surface and its main screen family, including the named dashboards/data/tools views where present.

| Internal view | View | Owning component and score | Principal component scores | Review note |
|---|---:|---|---|---|
| Agent Workspace home | **6.9** | `AgentWorkspace` **7.1**; `AgentWorkspaceHome` **6.9** | `SecOpsAgents`, `ECommerceAgents`, `DevToolsAgents`, `AttackAuditorAgents`, `LegalComplianceAgents`, `AgentLabs` cards 6.8–7.1 | The category entry point covers many agents. Improve comparison, label prototype/simulation status, and make the best starting point for each audience clear. |
| Scanner Agent | **6.9** | `ScannerAgentMainView` **6.9** | Dashboard, activity, agents, analytics, missions, memory, queue, recon, skills, settings, candidate panels 6.7–7.0 | Consolidate the many operational destinations around a small set of primary tasks; ensure each panel shares status, filtering, and empty-state patterns. |
| E-commerce Agent | **6.8** | `EcommerceAgentMainView` **6.8** | `EcommerceDashboardView` 6.9; `EcommerceDataView` 6.7; sidebar 6.8 | Clarify business outcomes, data provenance, and how dashboard metrics connect to data and actions. |
| DevTools Agent | **6.9** | `DevtoolsAgentMainView` **6.9** | `DevtoolsDashboardView` 6.9; sidebar 6.8 | Give the dashboard a clear first task and explain the relationship between tools, status, and results. |
| Incident Response / DFIR Agent | **6.8** | `DfirAgentMainView` **6.8** | `DfirDashboardView` 6.9; `DfirDataView` 6.7; `DfirToolsView` 6.7 | Make incident severity and analyst next steps dominant, while keeping evidence and tool output traceable. |
| Threat Intelligence Agent | **6.8** | `ThreatIntelAgentMainView` **6.8** | `ThreatIntelDashboardView` 6.9; `ThreatIntelDataView` 6.7; `ThreatIntelToolsView` 6.7 | Distinguish observed indicators, confidence, and suggested action; prevent dense data panels from obscuring uncertainty. |
| Cloud Security Posture Agent | **6.8** | `CloudPostureAgentMainView` **6.8** | `CloudPostureDashboardView` 6.9; `CloudPostureDataView` 6.7; `CloudPostureToolsView` 6.7 | Surface risk priority and remediation status before infrastructure detail; state clearly when findings are sample data. |
| Source Code Auditor / SAST Agent | **6.9** | `SastAgentMainView` **6.9** | `SastDashboardView` 7.0; `SastDataView` 6.8 | Tie findings to file/line context, severity rationale, and a safe remediation path. |
| Red Team Agent | **6.7** | `RedTeamAgentMainView` **6.7** | Dashboard, recon, lateral movement, reporting, settings, tools 6.6–6.9 | Make authorization and lab boundaries visible, and organize the experience as a controlled scenario with clear stop/reset points. |
| Legal Contract Agent | **6.9** | `LegalContractAgentMainView` **6.9** | `LegalContractDashboardView` 7.0; `LegalContractDataView` 6.8 | Distinguish extracted text, proposed edits, and review status; prioritize clause context and human review. |
| Memory Types Lab | **7.0** | `ComprehensiveMemoryTypesLab` **7.0** | Episodic, semantic, procedural, prospective, parametric, in-context, and external memory panels 6.8–7.1 | The topic map is valuable. Give each memory type a consistent example, trade-off, and comparison back to the other types. |

## Highest-value improvement themes

1. **Make each screen's next action obvious.** Finhub and Agent Workspace have rich content but several entry surfaces compete for attention.
2. **Explain the evidence and data status.** Label simulations, sample telemetry, assumptions, and confidence where users interpret metrics or operational output.
3. **Unify dense interaction patterns.** Course runners, trading panels, and agent dashboards need consistent instructions, status, result, retry/reset, and completion feedback.
4. **Carry context through navigation.** Keep the active topic, parent screen, progress, and expected Back destination visible in nested routes and same-path internal views.
5. **Review narrow screens and keyboard flows.** The source includes responsive layouts and some accessible state, but these ratings cannot confirm actual viewport behavior, focus order, contrast, or motion.

## Episodic improvement prompts

Use each episode independently. Work in `gptxvip`, inspect the named implementation before editing, preserve route behavior and existing data contracts, and reuse current root/shared components. Do not broaden an episode into unrelated screens. When browser verification is available, check one narrow mobile viewport and one desktop viewport, plus keyboard use for the primary controls.

### Episode 01 — GPTX.VIP home (`/`)

```text
Work only in gptxvip. Improve the first-visit experience in src/rootHomePage/RootHomePage.tsx. First map the header, hero, intent blocks, topic carousel, principles, final CTA, and footer to their user goals. Then simplify the visual hierarchy so a new visitor can choose Agent Labs, Finhub, or Notes and understand the difference in one screen. Keep the existing navigation callbacks, responsive menu, reduced-motion behavior, and truthful product claims. Reuse the established page styles and avoid adding a second design system. Stop when every CTA has one clear destination and the topic path is understandable at mobile and desktop widths.
```

### Episode 02 — Finhub home (`/finhub`)

```text
Work only in gptxvip. Improve src/finhub/homeMainView/index.tsx and its already-mounted home panels: HeroHeader, BentoGridFeatures, AssetSlider, CandlestickWithLOB, HorizontalOrderFlow, OrderBookLab, GlossaryIntro, and MarqueeTicker. First map the page into a short user journey. Then make the primary interaction, simulated/live data status, and next step explicit; reduce repeated visual emphasis and move secondary material behind clear section headings. Preserve lazy loading, current callbacks, and the shared Finhub layout. Stop when the page has a scannable section outline, clear chart/control labels, and a coherent narrow-screen reading order.
```

### Episode 03 — Trade Type (`/finhub/trade-type`)

```text
Work only in gptxvip. Improve src/views/TradeTypeView.tsx and its SingleTradeView, MultipleTradeView, BreakevenView, and HedgeTradeView children. First identify what question each example answers and which chart/input is essential. Then add a compact comparison/orientation layer and consistent section headings, controls, and result explanations without changing trading calculations. Preserve section IDs used by navigation. Stop when a reader can compare the four trade patterns, jump to a section, and understand the assumptions behind its result.
```

### Episode 04 — Strategy Overview (`/finhub/overview`)

```text
Work only in gptxvip. Improve src/views/OverviewView.tsx. Trace the displayed data and classify each item as a summary, assumption, or detailed explanation. Then establish a clear summary-first hierarchy, improve card scanability, and expose the next relevant Finhub action without inventing performance claims. Preserve the current data source and root navigation. Stop when a user can explain what the overview covers and where to inspect a model in more depth.
```

### Episode 05 — Documentation Map (`/finhub/map/doc-map`)

```text
Work only in gptxvip. Improve the DocumentationMap surface mounted through src/views/MapView.tsx. Inspect its phase/class selection and responsive behavior. Then strengthen selected and deselected states, show how the map connects to a useful next page, and preserve its existing data validation and keyboard/close behavior. Keep the current root component structure. Stop when selection state is unmistakable and the user can move from an overview to a concrete reference without losing context.
```

### Episode 06 — Project Journey (`/finhub/map/project-journey`)

```text
Work only in gptxvip. Improve ProjectJourneyView mounted by src/views/MapView.tsx. Map the journey nodes, detail state, progress control, and touch/keyboard navigation before editing. Then clarify current step, previous/next context, and what selecting a node changes; retain validated data, accessible controls, and reduced-motion-aware transitions. Stop when the journey remains legible on a narrow screen and keyboard users can inspect every step and return to the map context.
```

### Episode 07 — Cointegration (`/finhub/cointegration`)

```text
Work only in gptxvip. Improve src/views/CointegrationView.tsx and src/finhub/documentationTopics/CointegrationPage.tsx. Reorder the explanation around concept → assumptions → method → interpretation → limitations. Make equations and visual examples answer a nearby question, and use consistent section blocks without changing the underlying finance content. Stop when a reader can tell what evidence would support or weaken the concept and where the method can fail.
```

### Episode 08 — Key Terms (`/finhub/key-terms`)

```text
Work only in gptxvip. Improve src/views/KeyTermsView.tsx and src/finhub/glossaryTerms/TermCard.tsx. Preserve schema validation, loading/retry, empty states, and accessible pressed states. Add a practical way to find or scan terms, reduce unnecessary vertical travel, and keep each definition/example/visual tied together. Stop when both dictionary sections are easy to search or scan and the selected section and term context remain clear on mobile.
```

### Episode 09 — Trading Tools (`/finhub/trading-tools`)

```text
Work only in gptxvip. Inspect src/views/TradingToolsView.tsx and the existing parent-shell controls that select its tools. Do not refactor trading-engine or simulator utility internals in this episode. Improve the user-facing choice of active tool, first-run orientation, loading/failure feedback, and return path; clearly distinguish a live connection from a simulation or unavailable connection based on existing state. Stop when a user can identify the selected tool, know what it needs, and recover from a loading or connection problem.
```

### Episode 10 — Archived Tools (`/finhub/archive-tools`)

```text
Work only in gptxvip. Inspect the archive selection path through src/views/TradingToolsView.tsx and its parent navigation. Make archive status, compatibility, and the route back to active tools explicit while preserving the existing tool implementations. Do not imply an archived tool is current or supported unless the existing data says so. Stop when archived and active destinations are visually distinct and the user can leave the archive without losing their Finhub context.
```

### Episode 11 — Profile (`/profile`)

```text
Work only in gptxvip. Improve src/finhub/profileInfo/index.tsx. Group the profile around current focus, verifiable credentials, skills, and contact; make status and date claims easy to interpret and avoid repeating the same metric in several cards. Preserve credential destinations and clipboard failure feedback. Stop when a reader can understand the person's current focus quickly and open or copy contact details accessibly.
```

### Episode 12 — Code Concepts (`/code_concepts/:category`)

```text
Work only in gptxvip. Improve the Code Concepts course path in src/codeConcepts/codeConceptsTopics/codeConceptsView/CodeConceptsView.tsx and the shared CoreConceptCard/CoreConceptRunner only where needed. Keep the route, search, favorites, progress storage, and mobile Learn/Explore/Saved navigation intact. Make course outcomes, lesson type, progress, and the primary start action easier to scan; in the runner, make instructions and answer feedback easier to follow. Stop when a learner can choose, start, resume, save, and complete a lesson without losing course context.
```

### Episode 13 — Core Concepts (`/core_concepts/:category`)

```text
Work only in gptxvip. Improve the Core Concepts mode of the shared CodeConceptsView and its lesson cards/runner. Inspect the current curriculum data and identify reading, question, and simulation activities. Give each activity a plain-language format label and a consistent start/progress/completion pattern while preserving the shared architecture, direct lesson URLs, favorites, and history behavior. Stop when a learner can distinguish understanding content from practicing or running an activity before opening it.
```

### Episode 14 — Math Primer (`/math_primer/:category`)

```text
Work only in gptxvip. Improve the Math Primer mode of the shared CodeConceptsView, CoreConceptCard, and CoreConceptRunner. Inspect existing math content and preserve its curriculum and route contracts. Improve equation sizing, worked-example steps, variable definitions, and visual-to-equation relationships at narrow and desktop widths. Stop when math content can be read without horizontal overflow and every worked step explains the transformation being made.
```

### Episode 15 — Roadmap hub and topic (`/roadmap`, `/roadmap/:topic`)

```text
Work only in gptxvip. Improve RoadmapContainer, RoadmapSidebar, RoadmapHub, and chapter cards. First map topic selection, progress, search, favorites, and the chapter entry points. Then make the learning path, current topic, and next recommended chapter visible while preserving current route and scroll restoration behavior. Reuse roadmap shared components. Stop when a learner can identify where they are, choose a sensible next chapter, and return to the same topic position.
```

### Episode 16 — Roadmap Search (`/roadmap/search`)

```text
Work only in gptxvip. Improve src/roadmapArea/roadmapView/rootComponents/RoadmapSearchView.tsx. Make query entry, result context, topic/chapter identity, and launch action clear. Preserve the query/filter behavior and parent return behavior. Add explicit empty and no-match guidance if missing, and verify keyboard focus when opening, selecting, and closing. Stop when a result can be chosen confidently without leaving the user uncertain which topic will open.
```

### Episode 17 — Roadmap reading chapter

```text
Work only in gptxvip. Improve src/roadmapArea/roadmapView/rootComponents/RoadmapReadingView.tsx and its reading content presentation. Keep chapter routing, favorites, Back, and Complete actions. Clarify topic/chapter context, reading progress, key takeaways, and completion feedback without adding unsupported instructional claims. Stop when a reader can tell how far they have progressed and what happens after completing or leaving the chapter.
```

### Episode 18 — Roadmap lab chapter

```text
Work only in gptxvip. Improve src/roadmapArea/roadmapView/rootComponents/RoadmapLabRunner.tsx and the shared activity shell, not individual activity logic unless the shell prevents a user from completing it. Establish a consistent setup summary, controls, running/paused/completed states, reset path, and outcome explanation. Preserve the registry-driven architecture and favorites. Stop when different registered labs still feel like one understandable workspace and the user always knows how to continue or exit.
```

### Episode 19 — Blog index (`/blogs`)

```text
Work only in gptxvip. Improve BlogsView, BlogList, and BlogCard. Make topic, audience, reading time, and featured status easier to scan using existing article metadata. Preserve direct article URLs, invalid-route fallback, and the correct return destination in standalone and embedded use. Stop when users can find a relevant article quickly and know where the Back action will take them.
```

### Episode 20 — Blog article (`/blogs/:id`)

```text
Work only in gptxvip. Improve BlogArticle, BlogRenderer, BlogHero, TableOfContents, and shared interactive blocks. Preserve article data and valid heading/citation links. Refine reading width, heading rhythm, code/visual captions, and interaction instructions; make the table of contents useful on mobile and retain a visible article-index return. Stop when an article can be read linearly or navigated by section without ambiguous controls.
```

### Episode 21 — Agent catalog home (`/agents`)

```text
Work only in gptxvip. Improve src/devLushArea/agentMarketplace/pages/Home.tsx and its catalog header/footer/cards. Clarify the difference between Agent Labs learning, project-surface browsing, and the contact path. Reduce repeated calls to action, state what users can inspect before contacting the owner, and preserve all existing route destinations. Stop when a first-time visitor has one clear next step for each intent.
```

### Episode 22 — Template catalog (`/agents/templates`)

```text
Work only in gptxvip. Improve src/devLushArea/agentMarketplace/pages/Browse.tsx, TemplateCard, and filter controls. Preserve URL-backed search/category/framework/sort filters and query normalization. Improve result comparison, active-filter visibility, result count, and no-match recovery; keep controls keyboard accessible and mobile-friendly. Stop when users can narrow the catalog and understand why each visible template matches.
```

### Episode 23 — Template detail (`/agents/templates/:slug`)

```text
Work only in gptxvip. Improve src/devLushArea/agentMarketplace/pages/TemplateDetail.tsx. Establish a short fit summary, capabilities/components, stack/assumptions, limitations, related surfaces, and a clear contact next step using the existing data only. Preserve unknown-slug behavior and catalog breadcrumbs. Stop when a visitor can decide whether to discuss this surface and knows what information to include.
```

### Episode 24 — Agent Labs landing and shell

```text
Work only in gptxvip. Improve the Agent Labs landing experience in devLushAreaApp.tsx, LandingPage, and the shared Navbar. Explain Topics, Agentic Roles, Agent Workspace, Reading, and saved/reference destinations in user-centered terms. Preserve `/agents/lab`, same-path view history, root/catalog exits, and shared root components. Stop when every top-level destination has a clear outcome and the shell tells users where they are.
```

### Episode 25 — Agent Labs topic hub and search

```text
Work only in gptxvip. Improve DevLushHub, DevLushSidebar, DevLushLayout, and DevLushSearchView. Organize existing topics by recognizable goal or level, show the expected outcome before launch, and make active topic/search/close states obvious. Preserve chapter launch, lock/energy feedback, and route-state behavior. Stop when the same topic is easy to find by browsing or search and search close returns to its actual parent.
```

### Episode 26 — Agent Labs topic runner

```text
Work only in gptxvip. Improve DevLushRunner and the shared TheoryBridge/visual framing. Inspect a representative activity from each major topic family before changing the shared shell. Normalize task instructions, available controls, live state, success/failure feedback, reset, and exit while keeping each activity's specific learning purpose. Stop when a learner can tell what to do and what changed across the representative activities without hiding important activity-specific controls.
```

### Episode 27 — Agent Labs Reading

```text
Work only in gptxvip. Improve ReadingView and the Agent Labs reading shell. Make current topic, section landmarks, reading progress, and the path back to the originating learning surface clear. Preserve text selection and any existing assistant handoff behavior. Stop when long-form content is scannable, keyboard navigable, and does not feel detached from the active course.
```

### Episode 28 — Agent Labs Articles

```text
Work only in gptxvip. Improve ArticlesView as an honest article index. Inspect which article content is actually available, distinguish previews from full articles, and show the next available action for each item. Preserve its current route-state behavior and avoid presenting inert actions as active links. Stop when availability and navigation are clear for every card.
```

### Episode 29 — Agent Labs embedded Blogs

```text
Work only in gptxvip. Improve the embedded BlogsView use inside devLushAreaApp.tsx. Preserve shared BlogList/BlogArticle components, keep selection inside `/agents/lab`, and make the embedded Back destination visibly say Agent Labs. Check that the standalone `/blogs` behavior is unchanged. Stop when the same article component communicates the right parent in both contexts.
```

### Episode 30 — Agent Labs Favorites

```text
Work only in gptxvip. Improve FavoritesView and the favorite item presentation. Show item type, source course/role, saved title, and launch destination before the user opens an item. Preserve migration handling, stale-item feedback, and correct routing for roadmap, role, and topic favorites. Stop when mixed favorites are distinguishable and unavailable items explain how to recover.
```

### Episode 31 — Agent Labs Topic Theory

```text
Work only in gptxvip. Improve TopicTheoryHub and its theory cards, collections, and save controls. Clarify collection membership, empty states, and the source topic for each theory item. Reuse existing theory-card/root components and preserve save/import behavior. Stop when a user can save, locate, and return to the topic that supplied a theory item.
```

### Episode 32 — Agentic Roles hub

```text
Work only in gptxvip. Improve AgenticRolesHub and AgenticRolesLayout. Put role purpose, expected outcome, difficulty, and available chapters ahead of decorative telemetry. Preserve role selection, filtering, completion markers, energy/lock feedback, and location-state history. Stop when the learner can compare roles and choose an appropriate chapter with a clear return path.
```

### Episode 33 — Agentic Roles search

```text
Work only in gptxvip. Improve AgenticRolesSearchView. Make every result identify its role, chapter, difficulty, and expected activity; provide clear no-match and close states. Preserve the shared chapter-launch checks and focus behavior. Stop when a result launched from search opens the right role/chapter and Back returns to the same search context.
```

### Episode 34 — Agentic Roles chapter runner

```text
Work only in gptxvip. Improve AgenticRolesRunner, AgentTerminalLog, CandidateAssessmentWidget, and milestone feedback. Separate the task prompt from simulated output and assessment; label sample output, expose progress, and explain why an answer is correct or needs revision. Preserve completion and history state. Stop when the user can distinguish their action, system response, assessment, and next step.
```

### Episode 35 — Agent Workspace home

```text
Work only in gptxvip. Improve AgentWorkspaceHome and its agent category cards. Group the existing security, commerce, devtools, legal, and learning agents by user goal; label sample/demo status and give each card one meaningful preview and next action. Preserve the current navigation state values and Back-to-Agents behavior. Stop when a visitor can choose an agent without needing to infer its purpose from its name alone.
```

### Episode 36 — Scanner Agent

```text
Work only in gptxvip. Improve ScannerAgentMainView and its dashboard, recon, missions, queue, analytics, memory, agents, skills, activity, and settings panels. Map the primary analyst workflow first, then reduce competing navigation and establish consistent severity, filter, empty, and remediation patterns. Preserve existing scan logic and clearly label sample findings. Stop when an analyst can move from a finding to evidence and a safe next action.
```

### Episode 37 — E-commerce Agent

```text
Work only in gptxvip. Improve EcommerceAgentMainView, EcommerceDashboardView, EcommerceDataView, and its sidebar. Connect every displayed business metric to its source data and operational decision; distinguish observed values from illustrative values. Preserve existing calculations. Stop when a user can understand the metric, inspect its data, and identify the next action without switching context blindly.
```

### Episode 38 — DevTools Agent

```text
Work only in gptxvip. Improve DevtoolsAgentMainView, DevtoolsDashboardView, and its sidebar. Identify the single first task this tool supports, then make status, input, output, and retry/reset actions consistent. Preserve tool behavior and mark simulated operations explicitly. Stop when a new user can complete or inspect one representative workflow without relying on unexplained terminal text.
```

### Episode 39 — Incident Response / DFIR Agent

```text
Work only in gptxvip. Improve DfirAgentMainView, DfirDashboardView, DfirDataView, DfirToolsView, and its sidebar. Make incident severity, timeline, evidence source, and recommended analyst next step clear; retain evidence provenance and avoid destructive-looking controls without confirmation in the interface. Preserve existing data flow. Stop when the dashboard supports triage and the data/tools views retain incident context.
```

### Episode 40 — Threat Intelligence Agent

```text
Work only in gptxvip. Improve ThreatIntelAgentMainView, ThreatIntelDashboardView, ThreatIntelDataView, ThreatIntelToolsView, and its sidebar. Separate indicators from confidence and recommended action; show source/time context and explain stale or low-confidence data. Preserve existing integrations and label simulations. Stop when a user can trace a threat claim to its evidence and understand uncertainty.
```

### Episode 41 — Cloud Security Posture Agent

```text
Work only in gptxvip. Improve CloudPostureAgentMainView, CloudPostureDashboardView, CloudPostureDataView, CloudPostureToolsView, and its sidebar. Prioritize risk, affected resource, remediation status, and safe next action; show account/sample-data context near the findings. Preserve current posture logic. Stop when the most urgent issue is scannable and remediation can be tracked across panels.
```

### Episode 42 — Source Code Auditor / SAST Agent

```text
Work only in gptxvip. Improve SastAgentMainView, SastDashboardView, SastDataView, and its sidebar. Tie each finding to file/line context, severity rationale, confidence, and a focused remediation path; keep code excerpts readable and avoid treating a suggested fix as applied. Preserve analyzer output. Stop when users can inspect a finding and understand what a human reviewer should verify.
```

### Episode 43 — Red Team Agent

```text
Work only in gptxvip. Improve RedTeamAgentMainView and its dashboard, recon, lateral movement, reporting, settings, and tools views. Make authorized lab scope, current scenario step, allowed target, and stop/reset controls visible throughout the flow. Preserve existing simulation boundaries and do not expand operational capabilities. Stop when the workflow reads as a bounded training exercise and outputs are clearly marked as simulated or sourced.
```

### Episode 44 — Legal Contract Agent

```text
Work only in gptxvip. Improve LegalContractAgentMainView, LegalContractDashboardView, LegalContractDataView, and its sidebar. Distinguish source clause, extracted data, proposed change, and human review status; keep surrounding clause context visible. Preserve existing analysis behavior and avoid presenting suggestions as legal conclusions. Stop when a reviewer can trace each proposed edit back to its source and review state.
```

### Episode 45 — Memory Types Lab

```text
Work only in gptxvip. Improve ComprehensiveMemoryTypesLab and the Episodic, Semantic, Procedural, Prospective, Parametric, In-Context, and External Memory examples. Give every type the same comparison structure: what it stores, how it is retrieved, a concrete example, a limitation, and a trade-off. Reuse common visual primitives and keep examples technically distinct. Stop when a learner can compare the types without navigating away to reconstruct the distinctions.
```

## Suggested execution order

Start with Episodes 01–11 for the main site and Finhub, then Episodes 12–20 for learning and editorial content, Episodes 21–34 for the catalog and Agent Labs, and Episodes 35–45 for Agent Workspace. Re-rate a surface after its episode is implemented and reviewed in a browser; keep the source-review score as historical context rather than treating it as a test result.

## Fast execution strategy

The 45 episodes describe acceptance goals, not 45 separate code passes. Several views share one mounted root, so implement their common behavior together and handle mode-specific content in the same change. This reduces repeated file reads, styling passes, and route regressions without dropping any surface from scope.

| Pass | Episodes | Shared implementation to inspect first | Fast completion gate |
|---|---:|---|---|
| A. Entry and Finhub home | 01–02 | `RootHomePage`, `HomeMainView`, `MainLayout`, `FinhubNavbar` | Home choices describe their destination accurately; the home demo labels its data and the long page has a usable section path. |
| B. Finhub information surfaces | 03–10 | `TradeTypeView` plus its four children; `OverviewView`; `MapView` and its two children; `CointegrationPage`; `KeyTermsView`/`TermCard`; `TradingToolsView` | Compare sections and assumptions consistently; preserve IDs and routes; tools clearly state selection, data status, and recovery. |
| C. Profile | 11 | `ProfileInfo` | Current focus, credentials, skills, and contact have a clear hierarchy; claims and destinations remain accurate. |
| D. Three learning modes | 12–14 | One `CodeConceptsView`, `CoreConceptCard`, and `CoreConceptRunner` pass, then check Code/Core/Math data modes | Shared navigation/progress behavior works in all three modes; mode-specific activity labels and math readability are covered without forking the shell. |
| E. Roadmap | 15–18 | `RoadmapContainer`, `RoadmapSidebar`, hub/search/reading/lab roots | Topic, search, reading, and lab states retain one context and consistent setup/progress/return behavior. |
| F. Blog system | 19–20 and 29 | `BlogsView`, `BlogList`, `BlogArticle`, `BlogRenderer`, `BlogsLayout` | Standalone and embedded views share presentation, while each keeps the correct URL and parent return behavior. |
| G. Agent catalog | 21–23 | Catalog `App`, `SiteHeader`/`SiteFooter`, cards, browse and detail roots | Home, filters, details, and contact actions form one coherent discovery path; query state and unknown-slug behavior remain intact. |
| H. Agent Labs learning shell | 24–31 | `devLushAreaApp`, Navbar, `DevLushContainer`, topic/theory/reading/favorite roots | Top-level destinations are clear; topic hub/search/runner and reference/favorite views share consistent context and feedback. |
| I. Agentic Roles | 32–34 | `AgenticRolesContainer`, layout, hub, search, runner | Role selection, search launch, and chapter completion share one role/chapter/progress model. |
| J. Agent Workspace | 35–45 | `AgentWorkspace`, `AgentWorkspaceHome`, `AgentSidebar` patterns, then each domain app root | The workspace entry compares choices; each of the ten apps makes its first task, evidence, status, and exit legible using existing domain logic. |

For each pass, use this three-step loop: (1) compare the current worktree to that pass's acceptance gate and keep any existing improvements; (2) make the smallest shared-component change that satisfies the common goals, followed by mode/domain-specific changes; (3) inspect all affected routes and controls from the route matrix before moving to the next pass. Do not redo a surface whose current source already meets the gate. Do not mark a whole pass done based only on a successful build: source review must cover every named route and state, and browser claims require browser evidence.

### Execution ledger

| Pass | Status | Evidence |
|---|---|---|
| A. Entry and Finhub home | Complete at source level | Episode 01 clarifies the Notes destination, topic-card action, and carousel pause/keyboard behavior. Episode 02 labels the generated market stream as a simulation, improves its control label, adds reduced-motion handling to the hero animation, and gives the asset selector an announced group/current value. |
| B. Finhub information surfaces | Complete at source level | Episodes 03–04 add generated-chart context, semantic trade sections, and a Strategy Overview section index. Episode 07 adds Cointegration section navigation and fixed-sample labels. Episode 08 adds Key Terms search/no-match feedback. Episodes 09–10 identify the selected tool and distinguish archive versions. The current Documentation Map (05) and Project Journey (06) implementations already provide validated-data/error states and accessible selection/progress controls. Route behavior and actual viewport rendering still need browser review. |
| C. Profile | Complete at source level | Episode 11's current implementation groups focus, credentials, skills, and contact and includes copy feedback. Browser readability and destination checks remain open. |
| D. Three learning modes | Complete at source level with a curriculum limitation | Episodes 12–14 share course-mode context, activity labels, progress/search/favorites, runner feedback, and narrow-screen code/equation handling. The Math Primer route now explains that it has no dedicated lesson files and points to the available HFT examples; creating a distinct math curriculum requires lesson content that is not in this repository. |
| E. Roadmap | Complete at source level | Episodes 15–18 retain topic/chapter route context and local completion state, improve search and reading orientation, and add resilient saved-step handling plus accessible lab controls. Browser keyboard, storage, and responsive review remain open. |
| F. Blog system | Complete at source level | Episodes 19–20 and 29 share the standalone/embedded renderer, improve article metadata and section navigation, and identify the correct return destination for each parent. Direct URL and mobile table-of-contents behavior still need browser review. |
| G. Agent catalog | Complete at source level | Episodes 21–23 clarify learning/catalog/contact paths, show active filters and result counts, improve empty recovery, and describe template fit/assumptions from available data. Browser query-string and unknown-slug checks remain open. |
| H. Agent Labs learning shell | Source improvements complete; reference content is unavailable | Episodes 24–26 clarify top-level destinations, topic search/result recovery, keyboard close/focus, and runner focus. Episodes 27–28 now show reading progress when content exists, identify the empty Reading Library honestly, mark article cards as previews, and offer a route to topic labs. Episode 30 exposes mixed favorite types and stale-launch feedback; Episode 31 shows saved theory provenance and opens its DevLush source chapter when available. The reading dataset is empty and the article cards have no full-article routes, so those content gaps remain visible rather than being represented as completed material. |
| I. Agentic Roles | Complete at source level | Episodes 32–34 clarify role/chapter outcomes, enrich search result context and no-match recovery, and separate sample runner output from the learner task and assessment feedback. Browser route-history, energy-lock, and completion checks remain open. |
| J. Agent Workspace | Complete at source level with sample-data limitations | Episodes 35–45 group agents by goal and label preview data across Scanner, E-commerce, DevTools, DFIR, Threat Intelligence, Cloud Posture, SAST, Red Team, Legal Contract, and Memory Types. Domain views distinguish example findings from source evidence and suggested action; Legal Contract now separates clause availability, example finding, proposed next step, and review status. No live connectors, real contract clauses, or verified domain datasets are present in these screens. Browser review remains open. |

**Validation note:** These statuses record source implementation and source inspection only. No tests/build or browser session was run for this execution, so the original ratings remain source-review estimates and responsive/runtime gates remain pending.
