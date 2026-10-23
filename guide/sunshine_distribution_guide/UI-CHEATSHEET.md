# Sunshine Distribution V2 — UI Design Cheatsheet

## Chosen direction
**Future Operations / Energetic Industrial UI**

A dark, high-contrast product interface inspired by modern command centers, developer tools and next-generation enterprise dashboards. It keeps Sunshine's yellow/purple identity while adding electric cyan, glass panels and live-system motion.

## 1. Visual language
- Background: near-black navy, never pure black.
- Primary energy color: Sunshine Yellow `#FFD21F`.
- Brand/future accent: Electric Violet `#8D65FF`.
- Data/telemetry accent: Cyan `#23E6FF`.
- Positive/safe state: Green `#38F2A1`.
- Use accents as signals, not as full-page fills.
- Surfaces: translucent navy panels with subtle white borders.

## 2. Typography
- Display: Space Grotesk — big, compressed-feeling headlines.
- UI/body: Inter — readable labels, forms and operational content.
- Headline rule: 2–6 words per line; strong contrast in one phrase.
- Micro-labels: uppercase, 7–10px, 0.12–0.18em letter spacing.
- Avoid long centered paragraphs in software interfaces.

## 3. Layout
- Fixed 68–76px top system bar.
- Optional 72px left rail for chapters/tools.
- Main content max width ~1500px.
- Hero: 40/60 or 45/55 split, text + live product visual.
- Feature architecture: bento grid rather than identical cards.
- Use large empty space around hero and section headings.

## 4. Cards & surfaces
- Radius: 22–30px for major panels, 10–16px for controls.
- Border: `1px solid rgba(255,255,255,.08–.12)`.
- Background: `rgba(15,18,38,.65–.85)`.
- Shadows: deep black shadow + low-opacity colored glow.
- Add one edge glow or radial accent per card, not multiple competing effects.

## 5. Futuristic effects
Use sparingly:
- fine grid overlay
- scanning line
- concentric orbit/radar rings
- small status pulse
- data bars and heatmaps
- ticker strip
- thin neon borders
- glass blur
- tiny system labels / readouts

Avoid:
- excessive lens flares
- many gradients on every card
- glowing all text
- unreadable sci-fi fonts
- too much animation

## 6. Motion
- Reveal on scroll: 500–750ms, 12–24px movement.
- Page/content transitions: 400–600ms cubic-bezier.
- Ambient animations: 5–20 seconds.
- Keep UI controls immediate (<200ms).
- Always support `prefers-reduced-motion`.

## 7. Information hierarchy
1. Massive product statement.
2. Short explanatory line.
3. Primary action.
4. Live metrics.
5. Core module map.
6. Operational flow.
7. Original documentation/manual.
8. Trust/security layer.

## 8. Component recipe
- **System Bar:** logo + status + command/search + CTA.
- **Rail:** numbered chapter navigation.
- **Hero Viewer:** real screenshot/manual inside a holographic frame.
- **Metric Readout:** label / value / state.
- **Bento Module:** icon + system code + title + 1-sentence purpose + visual data fragment.
- **Pipeline:** 4–6 operational states with strong directional reading.
- **Document Viewer:** page tabs + framed preview + keyboard arrows.
- **Trust Panel:** data locality + backup + roles + audit.

## 9. Color ratio
Use roughly:
- 75% dark neutral surfaces
- 15% white/gray typography and borders
- 6% violet/cyan system accent
- 4% yellow high-attention actions

## 10. Product-specific design rule
The manual is light and friendly. The V2 shell should **frame it, not recolor it**. Keep the original artwork intact while the surrounding site provides the futuristic identity.
