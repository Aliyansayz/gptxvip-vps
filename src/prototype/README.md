# Showcase prototypes

Prototypes run inside the main app with its React, TypeScript, Tailwind and shared design system. No separate installs, servers or builds are needed.

From the repository root:

```sh
npm install
npm run dev
npm run lint
npm run build
```

- Logistics: `/agents/templates/fulfillr` → `/agents/prototypes/logistics`
- Project management: `/agents/templates/project-management` → `/agents/prototypes/project-management`

Template details put the live dashboard in a full-width iframe above the project description, giving each workspace its own viewport. Full-screen dashboard routes omit the catalog navigation and footer. Catalog cards use screenshots captured from the running prototypes in `public/prototype-previews/`; dashboards load on demand through the registry.

## Add a prototype quickly

1. Create `src/prototype/<name>/App.tsx` with a default exported React component.
2. Reuse `src/components/designSystem` controls, apply their `tokenStyles` to the workspace parent, and keep sample data separate from views.
3. Scope CSS to a unique workspace class.
4. Capture the running dashboard into `public/prototype-previews/<name>.png`, then add a lazy import, title and screenshot path to `registry.ts`.
5. Set the matching catalog template's `prototype` field to that registry key. The detail preview and dashboard link appear automatically.
6. Run the root lint and build scripts, then check the detail preview and direct route.

Every catalog entry has a registered, interactive workspace. Generic concept mockups have been removed. The eleven domain workspaces share accessible navigation, theme controls, browser persistence and reset; each has a README describing its workflows. See [episode prompts and acceptance criteria](episodes/README.md), [integration guide](episodes/INTEGRATION.md) and [QA results](episodes/qa-report.md).
