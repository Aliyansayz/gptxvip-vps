# Software manuals

The former standalone `index.html` and DOM scripts are now React components in the existing GPTX app. Vite builds the manual routes and imported artwork along with the main site.

- `/software` and `/software-manual` — aliases that open `/software_manual` (including manual subpaths)
- `/software_manual` — catalog (`App.tsx`, `Catalog.tsx`, `catalogData.ts`)
- `/software_manual/sunshine_distribution_manual` — Sunshine manual (`sunshine_distribution_manual/App.tsx`)
- The former `index.html` URLs redirect to their corresponding React routes, preserving the query string and section hash.

The original grids, cover illustrations, typography, motion, and responsive breakpoints are retained. Colors reference only the original landing page's Tailwind palette (`RootHomePage.tsx`, `Navbar.tsx`, and `Footer.tsx`); each surface scopes its CSS to prevent collisions. `shared.tsx` owns theme variables, reveal effects, and reusable manual cards.

All eight catalog entries now open readable manuals. Sunshine retains its original reader. Seven directories add Data Analyst, Competitive Intelligence, Market Intelligence, Customer Support, Vulnerability Remediation, Insurance Claims, and ColdChain ERP. Each directory owns its content and uses a shared responsive reader with section navigation. Four new guides include supplied artwork, keyboard-operated page tabs, zoom, and original-picture links; the other three are text workflow guides because matching images were not supplied.

`pictures_source_for_next_version/README.md` and `labels.json` label all 16 original pictures, preserve their original names and hashes, and map them to their destination. Supply Chain, E-commerce, and Sales Development pictures are retained for future catalog entries. The image bytes remain unchanged.

Sunshine includes section navigation, a link back to the catalog, and an accessible three-page image viewer with tabs, previous/next buttons, and arrow-key navigation when focused. Original manual artwork is preserved.

Run `npm run dev` or `npm run build` from the `gptxvip` project root.

## Manual presentation

The seven field handbooks reuse Sunshine's stylesheet and visual structure: glass header, section rail, split hero, holographic preview, module cards, workflow chain, chapter index, interactive document controller, and review panel. `components/ManualGuide.tsx` composes the shared reader; `ManualPreview.tsx` and `ManualIllustrations.tsx` own the two previews. `manualPresentation.ts` supplies each handbook's brand, headline, icon, and stage names. `manualGuide.css` scopes extensions to `.sunshine-manual.manual-guide`, keeping Sunshine's original appearance intact.
