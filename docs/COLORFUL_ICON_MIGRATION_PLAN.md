# Colorful PNG Icon Migration — Implementation Plan

**Status:** Phases 2–6 gated on review · Phase 1 (foundation) ready to execute
**Goal:** Replace generic monochrome Lucide SVGs with the supplied colorful PNG icon packs on three surfaces:
main landing page, software manual, and the Agentic Roles (agents) area.

---

## 1. Asset audit — what exists

All zips extracted. Verified programmatically (`RGBA depth=8`, transparent background, square canvas).

| Pack | Style | PNG folder | Count | Max size | Notes |
|---|---|---|---|---|---|
| `50-Accounting-Finance-Filled-33340025` | **Linear Multicolor** | `…13.Linear Multicolor (A1 B99)\PNG\1024 x 1024` | 50 | 1024², avg 22.8 KB | **Primary finance set** |
| `50-Delivery-and-Logistics-Line-33340299` | **Linear Multicolor** | `…13.Linear Multicolor (A1 B99)\PNG\1024 x 1024` | 50 | 1024², avg 19.9 KB | **Primary ops set** |
| `Cyber-Security-Icon-Pack-37303033` | **Filled Color** | `Filled Color\PNG` | 25 | 512², avg 22.2 KB | **Primary security set** |
| `45-Information-Technology-Flat-Icons-83944049` | **Flat Multicolor** | `196.S2 - … 10.Flat Multicolor (A4 B99)\PNG` | 45 | 1024², avg 29.1 KB | **Primary IT/AI set** |
| `50-Astronomy-Filled-Line-Icons-89380903` | Filled Line | `…PNG` | 50 | — | spare |
| `Space-Exploration-Flat-880945` | Flat | `Space - PNG` | 50 | — | spare |
| `Outer-Space-Filled-Color-Icon-912438` | Filled Color | `PNG` | 16 | — | **generic `Artboard N.png` names → unusable, skip** |
| `Computer-security-icon-set-13291735` | — | — | 1 | — | **single preview PNG, skip** |
| `Space-set-color-icon-785221`, `space-exploration-planet-icons-set-91517461` | — | — | 0 PNG | — | vector-only, skip |

**Usable catalog: 170 uniquely-named colorful icons** from 4 packs (50 + 50 + 25 + 45).

---

## 2. Current state — what gets replaced

Icons are **all inline Lucide components** (no SVG files). Three distinct mechanism styles:

### Surface 1 — Main landing page (`src/rootHomePage/`, 21 components)
| File | Current icons |
|---|---|
| `PillarsShowcase.tsx` | `BarChart3`, `Bot`, `BookOpen`, `ArrowRight`, `Activity`, `Cpu`, `ShieldCheck`, `Zap`, `Sparkles`, `CheckCircle2` — icons stored as **JSX elements** in the `pillars` array (`icon: <BarChart3 className="w-6 h-6 …" />`) |
| `VerticalSolutions.tsx` | `FileSignature`, `Sliders`, `Ship`, `CheckCircle2`, `ShieldAlert`, `ArrowRight`, `Zap`, `RefreshCw`, `BarChart2` |
| `FleetCatalog`, `BlockGallery`, `HeroSection`, `TrustedConnectors`, `RoiCalculator`, `GovernanceFramework`, `FaqSection`, `Footer`, `Navbar`, `LeadCaptureModal`, `LeadMagnetSection`, `StickyConversionBar`, `TestimonialsSection` | audit on touch (Phase 5) |

### Surface 2 — Software manual (`software_manual/`)
`components/manualPresentation.ts` — a clean `Record<string, ManualPresentation>` keyed by manual title with a typed `icon: LucideIcon`. **Best possible migration target: 8 entries, single file, no JSX.**

```ts
icon: BarChart3            // AI Data Analyst Agent
icon: Radar                // Competitive Intelligence Agent
icon: TrendingUp           // Market Intelligence Agent
icon: ShieldCheck          // Vulnerability Remediation Agent
icon: FileCheck2           // Insurance Claims Agent
icon: Boxes                // ColdChain ERP
icon: Headphones           // Customer Support Agent
```

### Surface 3 — Agents (`src/devLushArea/agenticRoles/`)
`views/components/roleIcons.ts` — the canonical **string-keyed icon map** for the whole area:

```ts
export const agenticRoleIconMap: Record<string, ComponentType<{ className?: string }>> = { Search, Calculator, ShoppingBag, Compass, Database, BarChart2: BarChart3, BarChart3, CarTaxiFront, PackageSearch, ClipboardList, FileText };
export const getAgenticRoleIcon = (iconName: string) => agenticRoleIconMap[iconName] || Layers;
```

Consumers (do **not** touch these — they resolve through the map):
- `views/AgenticRolesHub.tsx:16` → `<RoleIcon className="h-6 w-6" />`
- `views/AgenticRolesLayout.tsx:55`
- `landingPage/AgenticRoleUseCases.tsx:75` → `<RoleIcon className="h-4 w-4" />`

Role `iconName` values come from `data/index.ts`: `Search`, `Calculator`, `ShoppingBag`, `Compass`, `Database`, `BarChart2` (visualization), `CarTaxiFront` (mobility), `PackageSearch` (retail), `ClipboardList` (procurement), `FileText` (contracts).

---
## 3. Icon mapping table

### 3.1 Software manual — `manualPresentation.ts` (1:1, no ambiguity)

| Manual title | Replaces | New PNG | Pack |
|---|---|---|---|
| AI Data Analyst Agent | `BarChart3` | `10836 - Financial Statistics.png` | accounting |
| Competitive Intelligence Agent | `Radar` | `9298.S2---Telescope.png` | it |
| Market Intelligence Agent | `TrendingUp` | `10834 - Financial Graph Growth.png` | accounting |
| Vulnerability Remediation Agent | `ShieldCheck` | `shield.png` | cyber |
| Insurance Claims Agent | `FileCheck2` | `10835 - Financial Report.png` | accounting |
| ColdChain ERP | `Boxes` | `10972 - Container.png` | delivery |
| Customer Support Agent | `Headphones` | `11004 - Support.png` | delivery |
| *(fallback)* | `FileCheck2` | `10826 - Contract.png` | accounting |

### 3.2 Agents — `roleIcons.ts` keyed by `iconName`

| `iconName` | Replaces | New PNG | Pack |
|---|---|---|---|
| `Search` | `Search` | `9292.S2---Search-from-Code.png` | it |
| `Calculator` | `Calculator` | `10861 - Tax Calculator.png` | accounting |
| `ShoppingBag` | `ShoppingBag` | `9329.S2---Add-to-Basket.png` | it |
| `Compass` | `Compass` | `10987 - Gps.png` | delivery |
| `Database` | `Database` | `server.png` | cyber |
| `BarChart2` / `BarChart3` | `BarChart3` | `10832 - Financial Analytics.png` | accounting |
| `CarTaxiFront` | `CarTaxiFront` | `10964 - Air Transport.png` | delivery |
| `PackageSearch` | `PackageSearch` | `10994 - Package For Delivery.png` | delivery |
| `ClipboardList` | `ClipboardList` | `10979 - Delivery List.png` | delivery |
| `FileText` | `FileText` | `10978 - Delivery File.png` | delivery |
| *(fallback)* | `Layers` | `10993 - Open Box.png` | delivery |

### 3.3 Main landing page — `PillarsShowcase.tsx` `pillars[]`

| `pillar.id` | Replaces | New PNG | Pack |
|---|---|---|---|
| `finhub` | `BarChart3` | `10834 - Financial Graph Growth.png` | accounting |
| `devlush` | `Bot` | `9293.S2---Robot.png` | it |
| `blogs` | `BookOpen` | `9320.S2---Articles.png` | it |

### 3.4 Main landing page — `VerticalSolutions.tsx`

| Context | Replaces | New PNG | Pack |
|---|---|---|---|
| Legal & IP | `FileSignature` | `10826 - Contract.png` | accounting |
| Legal & IP controls | `Sliders` | `9305.S2---Laptop-Settings.png` | it |
| Supply Chain | `Ship` | `10969 - Cargo Boat.png` | delivery |
| Risk banner | `ShieldAlert` | `alert.png` | cyber |
| Margin sim | `BarChart2` | `10836 - Financial Statistics.png` | accounting |
| Checkmark lists | `CheckCircle2` | **keep Lucide** — 3.5px inline glyph, PNG unreadable | — |

**Explicitly keep Lucide** everywhere: `ArrowRight`, `ChevronDown/Up`, `X`, `Menu`, `Search` (in toolbars),
`CheckCircle2`, and any icon rendered below `w-4 h-4`. `better-ui/icons.md` §"Design at render size" —
colorful detail icons at ≤16px render as mush.

---

## 4. Architecture — `ColorfulIcon` root component

Per `AGENTS.md` ("allow usage of root components for better performance"), build **one** shared component
rather than sprinkling `<img>` tags across 3 surfaces.

**New file:** `src/shared/components/icons/ColorfulIcon.tsx`

```tsx
import { useId } from 'react';

export type IconPack = 'accounting' | 'delivery' | 'cyber' | 'it';

export interface ColorfulIconProps {
  /** PNG basename without extension, kebab-case, e.g. "tax-calculator" */
  name: string;
  pack: IconPack;
  /** render size in px; drives width/height AND the srcset request */
  size?: number;
  className?: string;
  /** supply when the icon carries meaning; omit for decoration (default) */
  title?: string;
}

const VARIANTS = [64, 256] as const;

const PACK_DIR: Record<IconPack, string> = {
  accounting: 'accounting',
  delivery: 'delivery',
  cyber: 'cyber',
  it: 'it',
};

export function ColorfulIcon({ name, pack, size = 24, className, title }: ColorfulIconProps) {
  const dir = PACK_DIR[pack];
  const src = `/icons/${dir}/${name}-256.png`;
  const srcSet = VARIANTS.map((v) => `/icons/${dir}/${name}-${v}.png ${v}w`).join(', ');
  const labelId = useId();

  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={title ?? ''}
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : true}
      aria-labelledby={title ? labelId : undefined}
      draggable={false}
      className={`shrink-0 object-contain ${className ?? ''}`}
    />
  );
}
export default ColorfulIcon;
```

**Key design decisions:**

- **`name` + `pack` instead of a path** — callers can't fat-finger a directory; a pack rename is a one-line change.
- **`alt=""` + `aria-hidden` + `role="presentation"` by default.** Every existing Lucide icon on these surfaces
  is decorative, so this preserves current (weak) semantics while adding a `title` escape hatch for meaning.
- **`object-contain`** — these packs have non-uniform internal padding; `object-cover` would crop glyphs.
- **`draggable={false}`** — prevents ghost-drag inside clickable cards.
- **`useId()` for `aria-labelledby`** keeps SSR/hydration safe without a global counter.
- **No `onError` fallback initially**; add a `React.lazy` → Lucide fallback in Phase 5 if the audit finds gaps.

**Barrel:** `src/shared/components/icons/index.ts` re-exports `ColorfulIcon`, `IconPack`, and the pack constants.

### Adapter shims (preserve existing call signatures)

**`software_manual/components/manualPresentation.ts`** — change `icon: LucideIcon` to a descriptor
`{ name: string; pack: IconPack }` and update the 8 entries. Then update `ManualGuide.tsx` / `ManualPreview.tsx`
where `<Icon className=…/>` becomes `<ColorfulIcon size={…} />`. **The lookup keyed by `manual.title` is
untouched**, so `catalogData.ts` needs zero changes.

**`src/devLushArea/agenticRoles/views/components/roleIcons.ts`** — change the map to hold descriptors but keep
the resolver name and return shape so all 3 consumers compile unchanged:

```ts
// Bound ONCE at module scope — never inside the function body, or every
// render allocates a new component identity and remounts the subtree.
export const agenticRoleIconComponents: Record<string, ComponentType<{ className?: string }>> =
  Object.fromEntries(
    Object.entries(agenticRoleIconMap).map(([key, d]) => [
      key,
      (props) => <ColorfulIcon {...d} size={24} {...props} />,
    ])
  );

export const getAgenticRoleIcon = (iconName: string) =>
  agenticRoleIconComponents[iconName] ?? agenticRoleIconComponents.__fallback;
```

Caveat: `AgenticRoleUseCases.tsx:78` renders at `h-4 w-4` (16px) — below the PNG legibility floor. That one
call site needs an explicit override to keep Lucide (or bump to `h-5 w-5`), decided in Phase 3.

---

## 5. Asset pipeline

1. **Copy + normalize** into `public/icons/{accounting,delivery,cyber,it}/`.
   - Flatten filenames to kebab-case: `10861 - Tax Calculator.png` → `tax-calculator.png`.
   - Emit **only `-64.png` and `-256.png`** per icon. Do **not** ship 1024².
   - Cyber pack is already 512² — resample to the same 64/256 pair.
   - Only copy the ~24 icons actually referenced in §3 (not all 170) → **≈48 files, ≈0.85 MB**.
     Shipping all 170 would be ≈3.4 MB of dead weight.
2. **Generate a manifest** `src/shared/components/icons/manifest.ts`:
   ```ts
   export const ICON_REGISTRY = { 'tax-calculator': 'accounting', /* … */ } as const;
   export type IconKey = keyof typeof ICON_REGISTRY;
   ```
   Gives import-level type-safety and lets a CI script assert every referenced icon exists on disk.
3. **`public/` is already the asset convention** here (`public/images/*.png`, `public/prototype-previews/*.png`),
   so absolute `/icons/...` URLs match existing practice and also work in the standalone HTML builds
   (`alternateLandingPage/basalt-standalone.html`, `software_manual/*/App.tsx`).

### Size budget

| | Files | Approx bytes |
|---|---|---|
| Referenced icons @256 | 24 | ~500 KB |
| Referenced icons @64 | 24 | ~350 KB |
| **Total** | **48** | **~0.85 MB** |

Vite copies `public/` verbatim — no bundling cost, and each icon is fetched only when its surface renders.
`srcset` means mobile pulls the 64 variant (~15 KB avg).

---

## 6. Phased execution

| Phase | Scope | Files | Risk |
|---|---|---|---|
| **1. Foundation** | extract assets → `public/icons/`, generate manifest, build `ColorfulIcon` + barrel | +3 new, 0 edits | none — additive |
| **2. Software manual** | swap 8 `manualPresentation.ts` entries + 2 render sites | ~4 files | low — isolated sub-app |
| **3. Agents** | swap `roleIcons.ts` to descriptors + stable bound components; resolve the 16px call site | 1 core + 3 callers | low — single choke point |
| **4. Landing page** | `PillarsShowcase` (3), `VerticalSolutions` (5) | 2 files | low — keep `CheckCircle2` |
| **5. Audit sweep** | scan remaining 13 `rootHomePage` components; add `React.lazy` fallback for missing icons | ~10 files | medium — many small swaps |
| **6. Verify** | `npm run build`, visual + dark-mode + retina check, bundle diff | 0 | — |

### Verification checklist (Phase 6)

- `npm run build` — no TS errors, no missing-asset 404s in output.
- No console warning about missing `width`/`height` (all sized explicitly).
- DevTools → Network: `/icons/...` requests return 200; **no 1024² request on any surface**.
- Dark mode: PNGs are self-colored, so confirm card backgrounds still read as surfaces — several pack colors
  are mid-tone cyan/purple and may need a `bg-white/5` ring or a subtle `drop-shadow`.
- Screen reader: decorative icons absent from the a11y tree; labelled icons present exactly once.
- `git status` — confirm no stray scripts or the `_inventory.csv` artifact get committed.

---

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **PNGs can't recolor** — hover states that currently rely on `text-cyan-500 → text-cyan-600` silently do nothing | Replace color-shift hover with `scale-105` / opacity, matching the `group-hover:scale-105` already in `PillarsShowcase.tsx:101` |
| **587 hardcoded hex fills** exist in theory visuals for `html-to-image` export reasons | Do **not** convert those; scope is UI glyphs only |
| **`Outer-Space` pack has `Artboard N.png` names** — unusable | Excluded; the 4 named packs suffice |
| **Icons below 16px** | Whitelist exclusion (§3.4); PNGs only at `size >= 20` |
| **Render-time component identity** (§4 shim) | Hoist bound components to module scope, never inside the resolver body |
| **AgenticRoleUseCases renders at 16px** | Keep Lucide there or bump to 20px — decision needed in Phase 3 |
| **Two identical `icons/` dirs** in `devLushArea` + `roadmapArea` | Out of scope, but `shared/components/icons/` is the correct home per `AGENTS.md`; future dedupe lands there |
| **Licensing** — these are purchased icon packs | Ship resampled rasters only; never re-author or re-export as SVG |

---

## 8. Out of scope

- `roadmapArea/roadmapSharedComponents/icons/` (~89 hand-rolled Lucide clones) — different surface.
- Theory visual SVGs (`RoadmapTheoryVisual`, `TheoryVisual`, `DevLushTheoryVisual`).
- `alternateLandingPage/components/Marks.tsx` brand marks — already correct `currentColor` pattern.
- Converting any PNG back to SVG (rights-holding artwork; treat as opaque assets).

