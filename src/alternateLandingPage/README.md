# Basalt alternate landing page

Open **`/alternate-landing`** after running `npm run dev`. This is a separate lazy-loaded entry in `src/main.tsx`; `smartNavigate` recognizes its application root.

The page implements the supplied Basalt hero concept: a near-black canvas, four warm aurora light blades, SVG film grain and vignette, floating navigation, a two-line headline with one gradient word, raised OS buttons, a glass command launcher, Product Hunt badge, and one Learn more pill. The desktop composition fits a 1440 × 900 viewport. Mobile navigation collapses, download buttons stack, and the launcher adapts to the available width.

## Components

- `AuroraBackground`: four independent 15–22 second CSS drift/breathing loops. Each loop begins at its brightest state. Reduced motion preserves that composed first frame.
- `Navigation` and `Marks`: responsive pill navigation and inline SVG brand/OS marks.
- `CommandLauncher`: search, active selection, keyboard shortcuts, empty results, dismissal, and reopening.
- `PreviewDialog`: accessible native dialogs for navigation, downloads, and selected commands.

Inter and Geist Mono are bundled locally in `assets/` with their font licenses. All styles are scoped with `basalt-` classes. The hero headline explicitly defines its size and weight to withstand global heading styles.

## Preview behavior

This is an interactive landing-page concept. Installer files, authentication, checkout, and project execution are not connected. Download buttons display OS-specific installation command previews with clipboard copying and a fallback. Other navigation opens local information panels. Selecting a command previews the action without executing it.

In the launcher, use Arrow Up/Down and Enter; Escape dismisses it. Cmd/Ctrl + K outside the launcher reopens it. Within the launcher, Cmd/Ctrl + B, O, and K preview the build, project, and AI commands.

## Validation

Run `npm run lint` and `npm run build`. Check at 1440 × 900, 1440 × 800, 1024 × 900, 768 × 1024, 390 × 844, and 320 × 900. Verify one desktop viewport, no horizontal overflow or overlapping controls, font roles, the composed reduced-motion frame, active animation in normal motion, menu and dialog focus, search and shortcuts, and both clipboard outcomes.
