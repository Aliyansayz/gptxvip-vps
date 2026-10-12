# Software Manual — Basalt Style Absorption

**Status:** implementation-ready episodic blueprint
**Scope:** `/software_manual` only — catalog, shared ManualGuide (7 agent manuals), Sunshine manual
**Source of truth for style:** `src/alternateLandingPage/basalt-standalone.html` (served at `/basalt-standalone.html`)
**Constraint:** this work must not alter `/`, `/agents`, `/blogs`, or `/alternate-landing`

Each episode is independently reviewable. Do not begin the next episode until the
acceptance checks for the current episode pass.

---

## 1. Product direction

The Basalt standalone page is a dense, themeable marketing surface for a single
desktop command bar. The software manual is a documentation catalog with eight
manuals, seven field guides, and a search-and-filter grid.

The manual already looks like Basalt in several places — keycap buttons, the
Inter 600 headline, glass panels, the aurora and ribbon grounds. This document
covers what is **missing**, not what is already done.

The manual's job:

> Let someone find, judge, and open the right manual in as few decisions as possible.

Adopting Basalt should make the manual feel more *considered*, never more
*commercial*. Every episode below is judged against that.

---

## 2. What is absorbable, and what is not

The standalone is plain HTML + Tailwind CDN + Lucide CDN + inline JS. The manual
is React 19 + bundled Tailwind v4 + `lucide-react`. **Nothing can be pasted
literally.** What transfers is the design system and the interaction patterns,
re-expressed as React components and token-driven CSS.

### 2.1 Absorb

| Standalone feature | Manual home | Notes |
| --- | --- | --- |
| Five-theme token system (`data-theme`) | All three roots | Needs Episode 1 first |
| Fixed floating pill navbar | Catalog + guides | Manual topbar is currently `sticky` with a square rule |
| Theme dot picker | Navbar | New control |
| Interactive command launcher | Catalog `hero-console` | Currently a static metrics card |
| Keybinding customizer drawer | Command launcher | Needs state persistence |
| Terminal log stream | Command launcher | Motion + reduced-motion concerns |
| Feature showcase tabs + mockup frames | Catalog sections | Replaces static metric grids |
| FAQ accordion | Catalog or guide | Manual currently has no FAQ surface |
| Integration grid pattern | Catalog | Mapped to manual *topics*, not third-party tools |
| Status badge + footer | All roots | Replaces the plain footer text line |
| Ambient glow orbs | Hero | Must coexist with ribbon + aurora |

### 2.2 Do not absorb

- **Pricing grid, testimonials, "Contact Sales".** The manual has no commercial
  surface. Absorbing these would misrepresent it. The *card patterns* are
  reusable; the *content* is not.
- **`lucide` CDN and Tailwind CDN.** Both are already bundled in the app.
- **Brand icons.** `github`, `trello` and `figma` no longer exist in current
  Lucide (verified by probing the loaded build) and render as blank spaces in
  the standalone. Any absorbed icon must use names that resolve — and must be
  verified, not assumed.

### 2.3 Unresolved conflict — accent palette

The standalone's default theme is **amber → orange → red** (`#ffb347 → #ff6b4a → #ff2f3a`).
The manual is currently **aqua primary, red terminus**, per a prior explicit
decision.

Absorbing the standalone verbatim would silently revert that decision. This plan
assumes **aqua is preserved as the manual's identity** and the five themes are
rebased onto aqua. Amber survives as one theme among five. If amber should win,
resolve this before Episode 1.

---

## 3. The blocking architectural issue

All three roots apply the palette as an **inline style attribute**:

- `software_manual/Catalog.tsx:67`
- `software_manual/components/ManualGuide.tsx:32`
- `software_manual/sunshine_distribution_manual/App.tsx:46`

Inline styles outrank any stylesheet rule that lacks `!important`. A theme
switch built on attribute selectors — `html[data-theme="emerald"] .manual-catalog { --manual-primary: … }` —
**will not work** against the current inline `style={manualTheme}`.

There is a second leak to avoid: the standalone sets `data-theme` on `<html>`.
That attribute is global, so switching themes on `/software_manual` would also
restyle any other root. The manual's themes must be scoped to its own root
element.

Both are solved in Episode 1. Do not start a theme picker before it lands.

---

## 4. Episodic implementation prompts

### Episode 0 — Contract and inventory

**Objective:** fix the boundary before writing visual code.

**Prompt:**
> Audit `software_manual/` against `src/alternateLandingPage/basalt-standalone.html`
> and produce the mapping table from §2. Confirm which standalone sections are
> commercial-only and record them as excluded. Resolve the amber-versus-aqua
> accent question in §2.3 with the requester and record the decision in this
> document. Inventory every `--manual-*` consumer across `styles.css`,
> `manualGuide.css`, `manualNavigation.css` and the Sunshine `styles.css`.

**Acceptance:** the absorb/exclude table is confirmed; the accent decision is
written down; the full list of `--manual-*` consumers is enumerated with counts.

---

### Episode 1 — Theme engine foundation

**Objective:** unblock every later episode by making the palette cascade-driven.

**Prompt:**
> Move the manual palette out of the inline `style={manualTheme}` attribute and
> into CSS on the manual root element. Define the five themes from the standalone
> — obsidian, emerald, indigo, cyberpunk, slate — as CSS custom property blocks
> selected by a `data-manual-theme` attribute **on the manual root, not on
> `<html>`**, so switching themes cannot leak into `/`, `/agents`, or
> `/alternate-landing`. Rebase the palette onto aqua/red per §2.3. Keep
> `manualTheme` exported for any consumer that still reads it, but have it emit
> only non-overridable values. Persist the selection to `localStorage` and apply
> it before first paint to avoid a flash of the wrong theme.

**Acceptance:** changing `data-manual-theme` re-themes all three manual roots
instantly with no reload; `/`, `/agents` and `/alternate-landing` are visually
unchanged when the attribute changes; no inline style blocks the cascade; the
choice survives a reload without a flash.

---

### Episode 2 — Floating pill navigation and theme picker

**Objective:** replace the sticky bar with the Basalt shell.

**Prompt:**
> Convert the manual topbar from `position: sticky` with a square bottom rule
> (`styles.css:30`) into the Basalt floating pill: fixed, fully rounded,
> translucent with `backdrop-filter: blur(24px)` plus the `-webkit-` prefix, and
> constrained to `min(1120px, 100% - 32px)`. Add the theme dot picker as an
> accessible `radiogroup` — the standalone uses bare `div` click handlers, which
> is not keyboard reachable. Preserve the existing section links, back-to-home
> and search affordances. Provide an `@supports not (backdrop-filter)` fallback
> so the pill stays opaque and legible. Keep the existing mobile menu behaviour.

**Acceptance:** the nav is reachable and operable by keyboard alone; the theme
picker announces its state; no horizontal overflow at 375 / 768 / 1280; the
pill remains legible with backdrop-filter disabled.

---

### Episode 3 — Interactive command launcher

**Objective:** convert the static `hero-console` into the Basalt launcher.

**Prompt:**
> Replace the static VAULT INDEX card (`Catalog.tsx:105-116`) with a command
> launcher that searches the eight manuals in `catalogData.ts`. Implement arrow-key
> navigation, Enter to open, and a no-results state. Preserve `role="listbox"` /
> `role="option"` and `aria-selected`. Use real manual titles and categories —
> the standalone's deploy/build commands are its own product and must not be
> copied. Filter must react to the existing search box and category filters
> rather than duplicating state. Respect `prefers-reduced-motion`.

**Acceptance:** typing filters to real manuals; arrows move selection; Enter
opens the manual; screen readers announce result count and selection; the
existing catalog grid filter still works and stays in sync.

---

### Episode 4 — Keybindings drawer and terminal stream

**Objective:** port the two most stateful Basalt behaviours.

**Prompt:**
> Add the keybinding customizer drawer and the terminal log stream to the
> launcher. Store shortcuts in `localStorage` under a manual-namespaced key and
> guard against malformed JSON on read — the standalone calls
> `JSON.parse(...) || default` directly, which throws on corrupt values rather
> than falling back. Type the log stream as a simulation that makes no network
> call and asserts no real deployment. Honour `prefers-reduced-motion`: the
> standalone's staggered `setTimeout` log has no reduced-motion path.

**Acceptance:** shortcuts persist and reload; corrupt storage falls back to
defaults without throwing; the log stream is clearly labelled as simulated;
reduced-motion users get an instant or static result rather than staggered lines.

---

### Episode 5 — Section patterns

**Objective:** reuse Basalt's card and accordion patterns for documentation content.

**Prompt:**
> Apply the Basalt patterns to manual-appropriate content: a tabbed feature
> showcase for the manual families, a FAQ accordion for "how do I open a manual",
> an integration-style grid mapped to manual topics rather than third-party
> tools, and the status-badge footer. Exclude pricing and testimonials per §2.2.
> Map every icon through `lucide-react` and verify each name resolves — do not
> reuse `github` / `trello` / `figma`, which silently render blank.

**Acceptance:** every icon renders visibly; the accordion is keyboard operable
with correct `aria-expanded`; no commercial content appears; the footer keeps
`aliyan@gptx.vip` reachable.

---

### Episode 6 — Theme-aware backgrounds

**Objective:** make the ribbon and aurora respond to the theme.

**Prompt:**
> Make `HeroRibbon` (`components/HeroRibbon.tsx`) and the shared
> `AuroraBackground` (`src/shared/components/atmosphere/`) read their colours
> from the active manual theme instead of hard-coded values, while leaving the
> landing page and Basalt roots untouched. The ribbon's four gradient stops, its
> bloom and its scrim are currently fixed blues; the aurora takes a `ground` prop
> already. Add an opt-in prop rather than reading global state, so the shared
> component keeps serving three unrelated roots. Preserve the scrim that keeps
> hero copy legible over the tube.

**Acceptance:** each theme produces a distinct but legible ground; hero copy
holds its measured contrast in every theme; `/` and `/alternate-landing` render
byte-identically to before; no theme removes the legibility scrim.

---

### Episode 7 — Accessibility and responsive QA

**Objective:** prove the absorbed patterns are sound.

**Prompt:**
> Audit all three manual roots. Verify focus visibility on every new control,
> `aria-*` correctness on the launcher and accordion, heading order, and colour
> contrast in **all five themes**. Use canvas-normalised colour sampling rather
> than `rgb()` string parsing — Tailwind v4 emits `oklch()`, which a naive parser
> silently drops, and that has already produced a false pass once in this
> codebase. Check 375 / 768 / 1280 / 1920 for overflow. Confirm
> `prefers-reduced-motion` and the `backdrop-filter` fallback, neither of which
> has yet been exercised in a live browser.

**Acceptance:** zero contrast failures in every theme; no overflow at any
breakpoint; reduced-motion and no-blur paths verified in a real browser and
recorded, not inferred from the stylesheet.

---

### Episode 8 — Regression and documentation

**Objective:** confirm the blast radius is contained.

**Prompt:**
> Verify `/`, `/agents`, `/agents/lab`, `/blogs`, `/software_manual`,
> `/software_manual/:slug` (all 8), and `/alternate-landing` render correctly
> after every episode. Confirm `tsc --noEmit` is clean and `vite build` passes.
> Update `software_manual/README.md` with the theme contract, the `--manual-*`
> token list, and the new component inventory. Remove the temporary
> `public/basalt-standalone.html` copy once absorption is complete, or move the
> canonical file to `public/` and delete the duplicate in `src/` so only one
> copy exists.

**Acceptance:** all routes render; build is clean; no duplicated Basalt file;
README documents the theme contract.

---

## 5. Definition of done

- Five themes work across all three manual roots with no flash on load.
- Theme state is scoped to `/software_manual` and leaks nowhere else.
- The manual keeps its aqua/red identity; amber is a theme, not a replacement.
- Command launcher, keybinding drawer and terminal stream work by keyboard.
- Every new control is reachable, labelled, and contrast-checked in all themes.
- No inline style blocks the theme cascade.
- `/`, `/agents` and `/alternate-landing` are untouched.

---

## 6. Suggested first slice

Episode 0 then Episode 1, and nothing else. Episode 1 is the load-bearing one:
until the palette leaves the inline `style` attribute, no theme picker, no
theme-aware background, and no per-theme contrast guarantee is possible. Every
other episode depends on it.

---

## 7. Open questions

1. **Amber or aqua as the manual's identity?** (§2.3) — blocks Episode 1.
2. Should the keybinding customizer ship at all, given the manual has one
   meaningful action per manual (open it)? Episode 4 may be worth dropping.
3. Is the terminal stream honest in a documentation context, or does it read as
   decoration? Same episode.