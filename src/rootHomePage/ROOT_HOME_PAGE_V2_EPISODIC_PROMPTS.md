# GPTX.VIP Version 2 — Signal-First Landing Page and Agent Labs

**Status:** implementation-ready product and UI blueprint
**Scope:** root landing page, `/agents` information architecture, shared shell, and lab-topic discovery
**Primary outcome:** a calm, high-quality entry point that helps a visitor choose one useful surface quickly.

## 1. Product direction

Version 2 should feel like a focused technical product, not a collection of demos, commercial surfaces, and an operations console sharing one route.

The landing page has one job:

> Explain what GPTX.VIP is, show the two or three useful surfaces, and move the visitor into one deliberate next action.

The `/agents` endpoint has one job:

> Help a visitor discover and run agent-related lab topics.

The following principles govern every episode:

- One visual hierarchy per screen.
- One primary action and at most one secondary action in a hero.
- Lab learning is the default; commerce, account operations, and platform administration are secondary.
- Prefer progressive disclosure over simultaneous controls.
- Use real content and meaningful states instead of decorative metrics.
- Keep the shell stable while the active surface changes.
- Preserve existing lab logic and registries unless an episode explicitly migrates them.

## 2. Current architecture and evidence

The current route split is important:

| Surface | Current implementation | V2 interpretation |
| --- | --- | --- |
| `/` | `src/main.tsx` renders `App` and the root home branch | Clean public landing page |
| `/agents` | `src/main.tsx:24-32` renders the lead catalog app with `basename="/agents"` | Agent-lab and project-inquiry endpoint |
| Existing agent labs | `src/devLushArea/agentDevRootComponents/devLushAreaApp.tsx` | Reuse as the lab runtime, behind a simpler entry shell |
| Finhub | `src/finhub/homeMainView` and `src/finhub/tools` | Separate technical workspace |
| Blogs | `/blogs` and `BlogsView` | Optional resource link, not a primary landing-page destination |

The current `/agents` implementation is a lead-based Agent Labs catalog:

- `App.tsx` exposes only `/`, `/templates`, and `/templates/:slug`.
- `SiteHeader.tsx` exposes the catalog, featured surfaces, search, and a direct owner-contact action.
- `SiteFooter.tsx` exposes lightweight exploration links and `hello@gptx.vip`.
- `Home.tsx` presents lab topics first, then project surfaces, technical context, and direct email actions.
- `src/devLushArea/agentMarketplace` remains the implementation directory for the lead catalog and its 12 surface records.

The V2 root shell and the legacy Agent Labs runtime now share the same direction:

- `RootHomePage.tsx` provides the quiet navbar, controlled three-slide hero, three intent blocks, topic carousel, compact footer, and reduced-motion behavior.
- The runtime `Navbar.tsx` keeps Overview, Topics, Theory, and Workspace visible; reading, roles, favorites, assistant, energy, and lock controls are contextual tools.
- The runtime landing page is topic-first and no longer opens with telemetry, vertical sales blocks, ROI, governance, or testimonial claims.

There is no cart, checkout, pricing, licensing, or payment flow. A client reviews a surface and contacts the site owner by email.

## 3. Issues and noisy elements outside lab topics

### 3.1 Route identity mismatch

`/agents` is the lead catalog entry point, while the existing lab application remains a separate component with its own landing, reading, article, blog, favorites, theory, agent-role, and agent-workspace views.

**Impact:** visitors should understand that the catalog is for reviewing possible surfaces and starting a project conversation, while Agent Labs remain the learning runtime.

**V2 decision:** keep `/agents` as the simple lead catalog for now, with lab-topic discovery and direct contact as the primary actions.

### 3.2 Lead-only contact boundary

The catalog must not imply self-service purchasing. These elements are intentionally absent:

- Cart and checkout routes.
- Pricing, access tiers, and license selectors.
- Payment, sales, ratings, guarantees, and purchase claims.
- Add-to-cart, download, and self-service purchase actions.

**V2 replacement:** “View details”, “Contact owner”, and a prefilled email to `hello@gptx.vip`.

### 3.3 Catalog taxonomy before visitor intent

The catalog exposes eight broad categories—Analytics, E-commerce, SaaS, Finance, CRM, Marketing, Healthcare, and Crypto—before a visitor has selected a project direction.

**Impact:** category breadth can compete with the lab-topic hierarchy if it is presented as a sales taxonomy.

**V2 replacement:** three or four task-oriented choices such as:

- Understand agent architecture.
- Explore memory and reasoning.
- Run an industry scenario.
- Inspect safety and orchestration.

### 3.4 Duplicate navigation systems

The root landing navbar has desktop links, a mobile horizontal sub-row, two branded hub buttons, section anchors, a theme toggle, and a “Deploy Swarm” CTA. The lead catalog adds its own focused header and footer.

Inside the existing agent app, `agentDevRootComponents/Navbar.tsx` adds another navigation layer with search, theme, lock mode, energy, infinite energy, focus mode, AI assistant, reading, articles, blogs, favorites, theory, agentic roles, and agent workspace.

**Impact:** the visitor receives several competing definitions of the product before seeing a lab.

**V2 rule:** one global shell per endpoint. Lab-only utilities belong in a compact “Lab controls” menu, not the primary navigation.

### 3.5 Gamification and operational controls in the default lab chrome

The current agent application initializes an energy system, lock mode, infinite-energy toggle, energy recharge timer, focus mode, AI assistant, text-selection assistant, and theme state globally.

**Impact:** these controls create cognitive load and make the learning activity feel like a game or admin console.

**V2 treatment:**

- Keep theme and accessibility controls available.
- Move theory, AI help, and focus mode into contextual tools.
- Remove energy and lock mechanics from the default learning path unless a specific lab requires them.
- Do not show a persistent assistant over the landing page.

### 3.6 Commercial proof blocks that are not product proof

The catalog hero should use surface counts and project-conversation language, not prices, ratings, sales claims, or access language.

**V2 replacement:** show the number of active lab topics only when it is generated from the registry, plus concise proof such as “interactive”, “source-backed”, and “runs in the browser”.

### 3.7 Oversized implementation surface

The previous catalog snapshot included 53 UI primitive files for a small lead flow. The current lead path keeps only the four primitives it actually uses: button, badge, select, and separator.

**V2 treatment:** keep the catalog route isolated and prevent unused commerce or generic UI from returning to the lab-topic bundle. The V2 shell should depend on a small set of shared primitives.

### 3.8 Competing brand vocabulary

The codebase currently uses GPTX.VIP, AgentOS, devLush, devLush.OS, Finhub Lab, Agents, Blogs & Papers, and Deploy Swarm.

**V2 vocabulary:**

- Product: `GPTX.VIP`.
- Agent learning surface: `Agent Labs`.
- Finance surface: `Finhub`.
- Optional editorial surface: `Notes`.

Use one label consistently in visible navigation. Keep internal names and historical component names unchanged until migration is safe.

## 4. High-quality V2 template

### 4.1 Page anatomy

```text
AppShell
├── Header
│   └── QuietNavbar
├── Main
│   ├── HeroHeader
│   │   ├── value statement
│   │   ├── primary + secondary actions
│   │   └── controlled visual slider
│   ├── IntentBlocks
│   ├── TopicCarousel
│   ├── ProofBlock
│   └── ClosingAction
└── Footer
```

### 4.2 Visual language

- Warm neutral background, graphite text, one cyan/green accent, and one restrained secondary accent.
- Maximum content width: `72rem`; readable text width: `42rem`.
- Use one border treatment and one card radius family throughout the page.
- Keep gradients, glows, animated backgrounds, badges, and status pills out of the default shell.
- Use motion only for entry, carousel transitions, and meaningful state changes.
- Ensure strong contrast, visible focus rings, reduced-motion support, and keyboard-complete interactions.

### 4.3 Quiet navbar

Desktop navigation should contain only:

1. GPTX.VIP mark and home link.
2. `Agent Labs`.
3. `Finhub`.
4. `Notes` or `About`.
5. One primary `Open a lab` action.
6. A compact theme/accessibility menu.

Remove from the primary row:

- Version badges.
- Product descriptors below the brand.
- Duplicate hub labels such as `AGENTOS` and `VALUATION`.
- Section-anchor menus such as Fleet, Verticals, Visualizers, ROI Modeler, and Governance.
- “Deploy Swarm” language unless the page is specifically an enterprise deployment page.

Mobile should use one menu button and one vertical menu. Do not create a second horizontal navigation row that duplicates the desktop links.

### 4.4 Hero header

Recommended copy shape:

> Interactive systems for understanding agents and markets.

Supporting copy should explain the two primary surfaces in two sentences or fewer. The hero has:

- Primary action: `Explore Agent Labs`.
- Secondary action: `Open Finhub`.
- One visual proof panel, not a collage of metrics.

### 4.5 Hero slider

Use a three-slide, manually controllable slider:

1. **Agent architecture:** visualize perception → reasoning → tools → memory.
2. **Lab interaction:** show a real topic card becoming an interactive simulation.
3. **Finhub depth:** show a clean market/valuation surface without exposing the entire tool suite.

Requirements:

- Button controls with accessible labels.
- Visible slide count and current position.
- Keyboard arrow support.
- Pause/resume if autoplay is introduced.
- No autoplay on mobile by default.
- Lazy-load non-active visual content.
- Preserve the active slide in local state only; do not make it part of routing.

### 4.6 Intent blocks

Use three blocks, not a feature wall:

- **Learn the mechanism** — agent types, memory, orchestration, evaluation.
- **Run the scenario** — finance, security, healthcare, supply chain, or another registered lab.
- **Inspect the system** — theory, source, assumptions, and observable outcomes.

Each block has one sentence, one icon or restrained visual, and one action. Avoid pricing, sales, testimonial, connector, or governance claims unless the visitor has explicitly entered that context.

### 4.7 Topic carousel

The carousel is for registered lab topics only. Each item should expose:

- Topic title.
- One-line learning outcome.
- Topic family.
- `Open topic` action.

Use a responsive grid on desktop and a snap carousel on mobile. Do not combine topic cards with product templates, shopping cards, or unrelated blogs.

### 4.8 Footer

The V2 footer is compact and useful:

- GPTX.VIP description.
- Explore: Agent Labs, Finhub, Notes.
- Resources: accessibility, source/architecture notes, contact.
- A small copyright/status line.

The catalog footer may include one direct contact link to `hello@gptx.vip`; exclude cart, checkout, pricing, licensing, and simulated-purchase language.

## 5. V2 information architecture

```text
/
├── Agent Labs          → /agents
├── Finhub              → /finhub
└── Notes               → /blogs

/agents
├── Lab landing and topic discovery
├── /agents/labs/:topicId     (optional deep link)
├── /agents/theory/:topicId   (optional contextual theory)
└── /agents/search            (optional progressive disclosure)
```

The lead catalog owns `/agents`, while the existing lab runtime stays available as a separate implementation path.

The dedicated runtime path is now `/agents/lab`; `/agents` remains the catalog and direct-inquiry entry point.

## 6. Component and data architecture

Implemented root landing files:

```text
src/rootHomePage/
├── RootHomePage.tsx       # V2 shell, slider, blocks, topic carousel, footer
└── Navbar.tsx             # reusable quiet shell
```

Implemented agent endpoint boundary:

```text
src/devLushArea/
├── agentLabsData.ts                         # shared topic source
├── agentMarketplace/                        # `/agents` lead catalog
│   ├── pages/Home.tsx                       # topics first, surfaces second
│   └── pages/LabRuntime.tsx                 # `/agents/lab` adapter
└── landingPage/LandingPage.tsx              # runtime topic landing
```

The root shell, lead catalog, and runtime landing derive their topic cards from `agentLabsData.ts`. Existing lab registries and runners remain the source of truth for interactive behavior.

## 7. Episodic implementation prompts

Each episode is independently reviewable. Do not begin the next episode until the acceptance checks for the current episode pass.

### Episode 0 — Route and content contract

**Objective:** establish the V2 boundary before changing visual code.

**Prompt:**

> Audit `/`, `/agents`, `/finhub`, and `/blogs`. Define the lead catalog boundary for `/agents`, identify the existing lab registries and data files that can supply topic cards, and confirm that every inquiry action targets `hello@gptx.vip`. Remove cart, checkout, pricing, licensing, and payment routes. Add route-level notes and a migration checklist.

**Acceptance:** `/agents` has one documented owner; lab data has one source of truth; every conversion path is a direct email inquiry.

### Episode 1 — V2 shell and design tokens

**Objective:** create the shared high-quality layout foundation.

**Prompt:**

> Build `RootHomePageV2` with a responsive AppShell, a constrained content grid, semantic regions, a quiet visual system, consistent spacing, focus states, dark/light behavior, and reduced-motion support. Use the existing project stack and avoid adding dependencies. Keep all current routes working while the V2 page is developed behind a controlled entry point.

**Acceptance:** desktop, tablet, and mobile layouts have no horizontal overflow; semantic landmarks exist; focus is visible; no decorative animation is required for comprehension.

### Episode 2 — Quiet navbar and header

**Objective:** replace navigation overload with a predictable shell.

**Prompt:**

> Implement the V2 navbar with GPTX.VIP, Agent Labs, Finhub, Notes/About, one primary action, and a compact utility menu. Remove duplicate mobile rows, version/product badges, noisy labels, and competing CTAs from the V2 shell. Implement the hero header with one clear statement, two actions maximum, and a short supporting paragraph.

**Acceptance:** the navbar has one desktop row, one mobile menu, no duplicate link set, and a clear active/current state.

### Episode 3 — Slider, blocks, and carousel

**Objective:** add high-quality visual storytelling without noise.

**Prompt:**

> Add a controlled three-slide hero slider, three intent blocks, and a lab-topic carousel. Make each interactive control keyboard accessible and screen-reader understandable. Use real topic data, lazy-load non-active visuals, and keep motion restrained. Do not include cart, checkout, pricing, licensing, payment, sales, testimonials, or generic purchase CTAs.

**Acceptance:** controls work with keyboard and pointer; mobile uses snap behavior or a responsive grid; reduced motion is respected; cards lead to a valid lab or workspace action.

### Episode 4 — Agent Labs endpoint

**Objective:** make `/agents` useful on first visit.

**Prompt:**

> Build a focused Agent Labs entry surface from the existing lab registry/data. Show topic families and a small set of meaningful topic cards. Add one clear path from a card to the existing lab runner. Move theory, search, favorites, assistant, blogs, and role/workspace utilities behind contextual or secondary controls. Preserve existing lab behavior and deep-link compatibility.

**Acceptance:** `/agents` no longer presents a store-first experience; a visitor can select and launch `/agents/lab` in two actions or fewer; existing lab topics still render.

### Episode 5 — Footer, content cleanup, and responsive QA

**Objective:** finish the template as a coherent product surface.

**Prompt:**

> Add the compact V2 footer. Remove or defer commerce language from the V2 route. Audit every visible label, tooltip, badge, metric, and CTA for duplication or unsupported claims. Test responsive behavior, keyboard navigation, reduced motion, loading states, empty states, and direct navigation to `/`, `/agents`, `/finhub`, and `/blogs`.

**Acceptance:** no commerce language appears in the V2 learning shell; all primary links and email CTAs work; no layout shift or clipped mobile controls is introduced.

### Episode 6 — Performance and maintainability

**Objective:** keep the clean experience fast.

**Prompt:**

> Lazy-load route-level surfaces and non-active hero visuals. Keep the V2 shell dependent on a small set of primitives. Measure unused catalog UI imports and isolate them from the lab bundle. Avoid duplicating registry data or navigation state. Add a concise architecture note for future contributors.

**Acceptance:** route boundaries are visible in the bundle strategy; no duplicate topic catalog is introduced; the shell remains understandable from its component tree.

## 8. Definition of done

- `/` communicates one product story within the first viewport.
- The navbar has no duplicated desktop/mobile link system.
- The hero has one primary action and a purposeful visual slider.
- Blocks and carousel content are derived from real, relevant topics.
- `/agents` is clearly an Agent Labs endpoint, not an unexpected commercial surface.
- Commerce surfaces are isolated or explicitly deferred.
- Existing lab registries and simulations remain usable.
- Footer content is compact and task-oriented.
- Keyboard, screen-reader, reduced-motion, loading, and mobile states are tested.
- The implementation adds no unnecessary dependency and no second source of truth for lab topics.

## 9. Suggested first implementation slice

Start with Episodes 0–2: route contract, shell, quiet navbar, and hero header. This establishes the visual and information architecture before adding the slider or migrating the agent endpoint. The first review should judge only clarity, hierarchy, responsive behavior, and route ownership—not the number of sections shipped.
