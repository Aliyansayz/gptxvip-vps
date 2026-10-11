# Strata UI documentation

Open `/ui-ux` with `npm run dev`. The board is lazy-loaded from `src/main.tsx` and supports deep links such as `/ui-ux#components`.

## Architecture

- `src/components/designSystem/tokens.ts` owns primitive palettes, semantic colors, spacing, radii, elevation, and typography. Documentation specimens, JSON export, and CSS variables derive from this module.
- `src/components/designSystem/index.tsx` provides reusable buttons, text fields, status badges, and navigation items. Buttons and badges reuse the app's existing UI primitives.
- `ui_docs/sections/` contains the seven documentation sections. `DocParts`, `Playground`, and `CopyCode` share documentation presentation and behavior.
- `useDocumentationNavigation` handles hash navigation, scroll tracking, and mobile focus trapping, Escape, overlay dismissal, and focus restoration.

## Reuse in product screens

```tsx
import {
  SystemButton,
  TextField,
  StatusBadge,
  tokenStyles,
} from "./src/components/designSystem";

export function WorkflowForm() {
  return (
    <div style={tokenStyles}>
      <TextField label="Workflow name" hint="Use a descriptive name." />
      <SystemButton>Create workflow</SystemButton>
      <StatusBadge status="neutral">Draft</StatusBadge>
    </div>
  );
}
```

Adjust import paths for the consuming file. Apply `tokenStyles` to a parent surface; component CSS is imported with the shared component module. Wire product behavior through standard React event handlers. The product patterns on the board use local demo state and simulated requests.

## Maintenance and checks

Update tokens instead of duplicating values in specimens, exports, or product CSS. Decorative illustration colors may remain local to documentation. Keep default, hover, pressed, keyboard focus, disabled, loading, and validation states observable. Add new families and sections to the displayed metrics when extending the board.

Run `npm run lint` and `npm run build`. Review at 1440, 768, 720, 390, and 320px. Verify hash links, scroll selection, mobile Tab/Shift+Tab/Escape and focus return, both clipboard outcomes, playground states, form validation, loading and retry, and confirmation cancel/delete. Contrast ratios shown on the board cover the listed text pairs, not a certification of every product screen.
