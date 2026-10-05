# AI Logistics Dispatcher prototype

A browser-only logistics workspace integrated into the app's Project Showcase as Fulfillr. Open `/agents/templates/fulfillr` for the embedded dashboard or `/agents/prototypes/logistics` for the full workspace.

Run the root app with `npm run dev`. Use root `npm run lint` and `npm run build`; this folder has no separate dependency installation or build configuration.

The dashboard includes delivery metrics, dispatch search and assignments, delivery creation, schematic routes, drivers, fleet readiness, exception resolution, agent approvals and an activity log. Demo changes persist in localStorage; the data adapter retains IndexedDB support for proof media. Assignment validation reports availability, capacity and maintenance conflicts.

Use **Approvals & settings → Reset demo data** to restore the sample records and clear saved proof media. Routes, recommendations and notifications are simulated; no external delivery service is connected.

`App.tsx` composes the views, `types.ts` defines the data contracts, `lib/api.ts` manages sample data and operations, and `components/` contains logistics-specific presentation. Shared form and button controls come from the root design system.

See [prototype registration](../README.md) for adding another dashboard.
