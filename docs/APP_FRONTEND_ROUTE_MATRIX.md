# GPTX.VIP front-end route matrix

Scope: browser-facing app roots, their URL branches, and visible parent/root returns. Finhub tools utility code is excluded. Paths below reflect the current route dispatch and view parsing in `src/main.tsx`, `src/App.tsx`, the Agent catalog router, and the standalone Blogs view.

## App roots

| Browser path | Mounted React root | Route/view behavior | Parent or root return |
|---|---|---|---|
| `/` | Main app | Root GPTX.VIP home | Root navbar brand stays at `/`; feature links open `/finhub`, `/agents`, `/agents/lab`, or `/blogs`. |
| `/finhub` | Main app | Finhub home, default section `liquidity-depth` | Navbar exit and the footer brand return to `/`; Agent Labs and Notes links open their roots. Mobile drawer selections close the drawer; desktop sidebar remains open. |
| `/blogs` | Standalone Blogs view | Blog index | “Back to GPTX.VIP home” returns to `/`. |
| `/blogs/:id` | Standalone Blogs view | Direct blog article when ID exists; invalid IDs and extra segments canonicalize to `/blogs` | Article Back returns through its parent history entry, or to the blog index for a direct link; index return goes to `/`. |
| `/agents` | Agent catalog router (`basename="/agents"`) | Catalog home | GPTX.VIP brand returns to `/`. |
| `/agents/templates` | Agent catalog router | Filterable project-surface catalog; query string carries search/category/framework/sort filters; invalid category, framework, and sort values are removed while search and unrelated query values are preserved | Catalog navigation returns to `/agents`; GPTX.VIP brand returns to `/`. |
| `/agents/templates/:slug` | Agent catalog router | Template detail; unknown slug renders its not-found state | Back to catalog returns to `/agents/templates`; breadcrumbs reach catalog or `/agents`; GPTX.VIP brand returns to `/`. |
| `/agents/lab` | Agent catalog router | Agent Labs runtime | Runtime exit returns to `/agents`; catalog brand returns to `/`; Finhub action returns to `/finhub`. Internal Agent Labs views, topic chapters, Agentic Roles chapters/search, and Agent Workspace subviews are stored in React Router location state, not extra path segments. Browser or visible Back returns to the prior hub/search/workspace entry. Closing topic search returns to Topics and leaves search available to reopen. |
| `/agent` and `/agent/*` | Redirected before root selection | Legacy singular prefix is rewritten to `/agents` while preserving search and hash | Canonical Agent catalog root is `/agents`. |

## Main-app path branches

All non-`/blogs` and non-`/agents` paths mount the main React app. Unknown main-app paths canonicalize to `/`.

| Browser path | Main-app view | Route state and return behavior |
|---|---|---|
| `/finhub/home` or `/finhub` | Finhub home | Optional `/:section` selects and scrolls a known subsection; invalid sections are repaired to the tab default. Root return is `/`. |
| `/finhub/trade-type` | Trade Type | Optional known section path; navbar/sidebar select tabs and subsection; root return is `/`. |
| `/finhub/overview` | Strategy Overview; extra section segments canonicalize back to this path because Overview has no subsections. | Root return is `/`. |
| `/finhub/map` | Documentation Map | Optional `doc-map` or `project-journey` section; root return is `/`. |
| `/finhub/cointegration` | Cointegration | Root return is `/`. |
| `/finhub/key-terms` | Key Terms | Optional `terms-list` section; root return is `/`. |
| `/finhub/trading-tools` | Trading Tools | Optional tool section; root return is `/`. |
| `/finhub/archive-tools` | Archived Tools | Optional tool section; root return is `/`. |
| `/profile` | Profile | Main navbar/root controls return to `/`. |
| `/code_concepts/:category/:activity?` | Code Concepts | Category and lesson are deep-linkable; invalid categories/lesson IDs canonicalize after curriculum data loads. Search loads every configured curriculum file, including Python advanced lessons. Mobile Learn/Explore/Saved controls switch views; Saved Back returns through its marked entry and preserves a Search parent. Lesson Back/Complete returns through the lesson's parent history entry, or to its category for a direct link. Search Exit returns through the search-entry history, or to General for a direct search URL. Selecting a category closes the mobile drawer. |
| `/core_concepts/:category/:activity?` | Core Concepts | Shares Code Concepts route handling and lesson return behavior. |
| `/math_primer/:category/:activity?` | Math Primer | Shares Code Concepts route handling and lesson return behavior. |
| `/roadmap` | Roadmap hub | Topic, search, and chapter paths below select internal views; the Roadmap exit returns to `/`. |
| `/roadmap/search` | Roadmap search | Search close returns through its parent history entry, or to the current topic for a direct search link; starting a result opens its chapter route and Back returns to Search. |
| `/roadmap/:topic` | Topic hub | Unknown topic IDs canonicalize to the first available topic; chapter controls open a nested route. |
| `/roadmap/:topic/:chapter` | Roadmap reading or lab | Chapter is resolved within the selected topic; a saved course-title alias or a chapter ID resolves to its owning topic and is canonicalized to the topic ID. Back/Complete returns through its parent history entry, or to `/roadmap/:topic` for a direct chapter link. |

## History notes and verification

- Main-app `pushState` navigation is synchronized with the app's `popstate` route parser. In-app Finhub tab changes scroll to the same addressed section as direct entry and browser history navigation. Roadmap and standalone Blogs views also listen for browser history changes.
- Agent catalog pages use React Router. Agent Labs top-level internal views, topic chapters, Agentic Roles chapters/search, and Agent Workspace subviews use location state; embedded Blogs articles stay in component state so they do not overwrite `/agents/lab` with `/blogs/:id`.
- The source-level route and return targets have been reviewed and the production build and TypeScript check pass. Interactive direct-entry, browser Back/Forward, and root-return behavior remain unverified: this environment has no browser executable and Vite preview cannot bind to localhost (`listen EPERM`).
- Direct deep links in a deployed environment require its web server to rewrite application paths to `index.html`; deployment rewrite configuration was not available for inspection.
