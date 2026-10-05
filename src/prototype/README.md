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

Template details embed the live dashboard in an iframe to give each workspace its own viewport. Full-screen dashboard routes omit the catalog navigation and footer. Catalog cards stay lightweight; dashboards load on demand through the registry.

## Add a prototype quickly

1. Create `src/prototype/<name>/App.tsx` with a default exported React component.
2. Reuse `src/components/designSystem` controls, apply their `tokenStyles` to the workspace parent, and keep sample data separate from views.
3. Scope CSS to a unique workspace class.
4. Add a lazy import and title to `registry.ts`.
5. Set the matching catalog template's `prototype` field to that registry key. The detail preview and dashboard link appear automatically.
6. Run the root lint and build scripts, then check the detail preview and direct route.

Only templates with an explicit prototype mapping show a live dashboard. The other catalog entries keep their concept previews.
