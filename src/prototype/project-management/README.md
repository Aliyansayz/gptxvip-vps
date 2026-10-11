# Project management prototype

Open `/agents/templates/project-management` for the showcase preview or `/agents/prototypes/project-management` for the full dashboard. Use the repository's root development, lint and build scripts.

`App.tsx` provides the workspace navigation. Sample records live in `data.ts`; activity, analytics, kanban and project views have separate modules. The kanban board supports dragging cards between columns and a keyboard-accessible column selector, with counts derived from the actual cards. Selecting a project opens its title and progress in the detail view.

This is a sample-data UI prototype. Changes to the kanban board are kept while its view is mounted. Client, calendar, messaging and several secondary toolbar controls are presentation placeholders.

See [prototype registration](../README.md) to reuse this architecture for a new dashboard.
