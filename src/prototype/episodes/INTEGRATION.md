# Showcase integration and reproducible checks

Agent A's implementation prompts are in `README.md`. Agent B owns eleven domain apps. Root owns the shared foundation and catalog/registry/thumbnails. Agent C owns independent QA artifacts and final acceptance.

The new prototypes reuse the root React/Tailwind application and design-system controls. Catalog framework badges describe that implementation. Unsupported page/component counts have been removed from catalog data and the detail UI; the detail shows the actual browser-demo workspace and data model instead. Capabilities must match shipped actions and views rather than aspirational integrations.

From the repository root:

```sh
npm install
npm run dev -- --port 3001
# In a second terminal, after the app is ready:
npm run qa:prototype-inventory
QA_BASE_URL=http://localhost:3001 npm run qa:showcase-card-launch
npm run qa:prototype-capture -- http://localhost:3001
npm run qa:prototype-formulas
npm run qa:prototype-contracts
QA_BASE_URL=http://localhost:3001 npm run qa:prototype-browser
QA_BASE_URL=http://localhost:3001 npm run qa:prototype-domains
QA_BASE_URL=http://localhost:3001 npm run qa:prototype-foundation
QA_BASE_URL=http://localhost:3001 npm run qa:manual-navigation
npm run lint
npm run build
```

Install Chromium for Playwright once if it is unavailable: `npx playwright install chromium`.

Capture accepts optional registry IDs, for example `npm run qa:prototype-capture -- http://localhost:3001 pulse-analytics orbit-crm`. It opens each app in a fresh sample-data context, waits for its workspace and fonts, checks runtime exceptions, and captures the rendered app at 1440×1000. Thumbnails are actual app screenshots, not generated mockups. `npm run qa:showcase-card-launch` verifies the visible “Open Prototype” action on every catalog card and checks that each opens its mapped route. Capture and browser QA should run sequentially with compiler/build checks on small-memory hosts.

Final browser checks and evidence paths will be recorded in Agent C's `qa-report.md`. Source/prompt inventory alone does not establish that interactions or formulas are correct.
