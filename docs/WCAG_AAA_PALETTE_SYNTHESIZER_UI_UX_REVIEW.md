# WCAG AAA Perceptual Color Palette Synthesizer: UI/UX review

**Historical review:** The implementation described here has since been redesigned across all Agentic Roles. See [the physicsrun reference redesign](./AGENTIC_ROLES_PHYSICSRUN_REDESIGN.md) for the current components and behavior.

**Route:** `/agents/lab` → Agentic Roles → Data Visualization Agentic Specialist → Day 01  
**Review date:** 3 October 2026  
**Scope:** The React implementation in `AgenticRolesRunner.tsx`, `ColorContrastA11yActivity.tsx`, and `dataVisualizationAgentic.json`. The public page did not load in the available browser tool, so this is a **source-based review**, not a verified visual or assistive-technology audit.

## Rating

**4/10 overall (provisional).** The lesson has a clear subject and a working decision flow, but the interface makes the learner read dense text inside a narrow nested panel while a decorative palette preview carries an unverified “AAA” claim. The main learning task should be easier to see, understand, and test.

| Area | Rating | Evidence |
| --- | ---: | --- |
| Information hierarchy | 4/10 | The runner and activity repeat the title, difficulty, and prompt. The activity introduces a second dark header inside the runner card. |
| Layout and readability | 3/10 | With Theory beside the case, the case receives 8/12 of the runner and the answer panel only 5/12 of that. Long answer text and four vision-mode tabs use `text-xs` or `text-[10px]`. |
| Interaction clarity | 5/10 | “Audit Contrast Ratios” suggests a real computation; it only waits one second and shows a predetermined success toast. “Apply Palette” submits a multiple-choice answer without changing the preview. |
| Accessibility credibility | 3/10 | The fixed 8.4:1 “AAA” badge does not represent every swatch, white hex text is hard to read on amber and green, and selection relies heavily on color. This rating is **not** a WCAG conformance verdict. |
| Learning value | 5/10 | The decision checks a useful concept, but three implausible distractors make the answer obvious; the learner cannot actually edit or audit a palette. |

## Why the view feels odd

1. **A nested grid squeezes the important work.** `AgenticRolesRunner.tsx` puts Theory beside the case at large widths (`lg:col-span-8` / `lg:col-span-4`). `ColorContrastA11yActivity.tsx` then divides the case into `lg:col-span-7` and `lg:col-span-5`. On an otherwise wide screen, the answer panel can end up near a quarter of the main content width after gaps and padding. The longest text occupies that smallest column.
2. **Three layers compete for attention.** The runner title and case briefing are followed by a second title bar, then a preview card and a question card. The repeated prompt makes the page feel assembled from separate dashboards rather than one lesson.
3. **The preview is too abstract.** Colored rectangles with hex codes do not show the promised executive chart, category labels, values, or patterns. The learner cannot see whether Q3 Churn and Q3 Expansion remain distinguishable.
4. **The control labels imply actions the screen does not perform.** The “Audit” button produces a timed toast; the ratio badges never change with vision mode. “Apply Palette” actually grades an answer. That breaks the connection between action and visible result.
5. **The page teaches AAA with inaccurate evidence.** The hardcoded “8.4:1 AAA” badge is attached to an entire four-color palette. Using the WCAG relative-luminance formula against the dataset's stated `#0F172A` canvas gives approximately **3.45:1 blue**, **8.31:1 amber**, **7.04:1 green**, and **4.22:1 purple**. A palette has no single contrast ratio without specifying a foreground/background pair and what the color communicates. The white hex labels on amber and green are approximately **2.15:1** and **2.54:1**. These are calculations from source hex values, not measurements of a rendered page.

## Recommended screen structure

Use the existing runner shell, Back action, progress, and Theory control. Make the case itself one coherent workbench:

```text
Case title + progress + Theory toggle                 [runner header]
Scenario: Q3 Churn versus Q3 Expansion               [one short briefing]

┌────────────────────────────────────────────────────────────┐
│ Chart preview: two labeled series, values, optional pattern│
│ Normal | Deuteranopia | Protanopia | Tritanopia             │
│ The preview visibly changes; labels and values remain      │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ Compare candidate palettes                                 │
│ Swatches + category names + per-pair contrast results       │
│ [Run audit] → inline results, method, pass/fail reason      │
└────────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────────┐
│ What should the agent change?                              │
│ Radio choices → [Check decision] → inline feedback          │
└────────────────────────────────────────────────────────────┘
Theory notes below or in an optional side panel at wide widths
```

At desktop widths, show the chart and candidate controls side by side **only when both remain comfortably readable**; keep the question full width below. At tablet and phone widths, use a single column. Use container width rather than viewport width to decide whether a split layout fits, because the sidebar and optional Theory panel consume space.

## Component and element specification

| Priority | Component / element | What it should do | Suggested owner |
| --- | --- | --- | --- |
| P0 | `CaseBriefing` | Display the scenario once in plain language, followed by the decision goal. Remove the duplicate activity title, difficulty, and repeated prompt. | `AgenticRolesRunner.tsx` and activity |
| P0 | `AccessibleChartPreview` | Render a small bar chart for Q3 Churn and Q3 Expansion using direct category names, values, and a secondary cue such as patterns or markers. Keep text readable when color simulation changes. | New shared role activity component |
| P0 | `PaletteAuditResults` | Calculate and display each relevant foreground/background contrast pair, its exact ratio, criterion, and pass/fail state. Explain that AAA 7:1 concerns normal text; large text uses 4.5:1, while essential non-text UI needs 3:1 under its separate AA criterion. Never badge a whole palette “AAA” from one number. | New shared accessibility utility and component |
| P0 | `DecisionFieldset` | Present options as native radio inputs with a `legend`, a persistent selected indicator, visible focus, and one “Check decision” button. Show feedback inline next to the decision. | Activity, optionally shared across role cases |
| P0 | `VisionModeControl` | Use an accessible radio group or tabs with an announced active state, visible focus, readable labels, and touch targets at least 24×24 CSS px with spacing; 44×44 is a better design target. Explain that modes are **illustrative simulations**, not proof of universal color-vision safety. | Activity / shared control |
| P1 | `PaletteComparisonCard` | Show each swatch with its name and hex code outside the colored surface; show its relationship to the chart background. Use readable typography and avoid white text directly on every swatch. | New shared role activity component |
| P1 | `AuditMethodDisclosure` | Explain the canvas color, tested pairs, WCAG formula, and the distinction between contrast and category distinguishability. Allow learners to inspect results without a toast disappearing. | Activity |
| P1 | `TheoryPanel` | Keep existing theory content, but default it below the main exercise for this visually dense case, or use a responsive panel that does not narrow the question. | `AgenticRolesRunner.tsx` |
| P2 | `AgentActionTimeline` | If the lesson aims to teach agentic behavior, show a concise sequence: inspect palette → test contrast → simulate perception → add redundant encoding → verify chart. Use the existing `expectedToolCalls` and `logs` only when they correspond to actual displayed results. | Activity / role data |

### Visual rules

- Use one surface language across the runner and activity. The runner already supports light and dark modes; remove hardcoded `bg-slate-900`/`bg-slate-950` surfaces that make this case permanently dark in light mode.
- Reserve purple for one primary action and selected state. Use neutral panels, a restrained border, and a clear type scale: body copy at about 14–16px, controls at least 14px, and short labels no smaller than necessary.
- Keep the chart as the visual focal point. Hex values are supporting data. Place swatch labels outside color fills so their legibility does not depend on the swatch hue.
- Replace shadow and glow layers with spacing and alignment. Keep success and failure cues textual and icon-based as well as colored.
- Make transitions respect `prefers-reduced-motion`, and keep audit feedback in a persistent result region with `aria-live="polite"` for status updates.

### Behavior rules

- “Run audit” must calculate from the currently displayed colors or be relabeled “Show sample audit” if it remains a scripted demonstration.
- “Check decision” must grade the selected answer. A correct answer can complete the case, but feedback should remain visible; an incorrect answer should explain the relevant distinction and allow a retry without resetting the whole screen.
- Simulation changes the chart preview and its legend, not only a strip of swatches. Contrast calculations should describe the actual source colors and canvas; do not claim that the same numeric WCAG ratio was independently proven for every simulated mode.
- Replace obviously absurd distractors with plausible alternatives, such as changing hue without adding direct labels, changing only the background, or adding patterns while leaving unreadable text. Give targeted feedback for each choice.

## Implementation order and acceptance checks

1. **Correct claims and labels first.** Remove the hardcoded 8.4:1/AAA badge and timed success toast until measurements use actual color pairs. Remove unsupported claims such as guaranteed perceptual uniformity or legal compliance from the lesson data. Check the dataset's `chartType: "scatter"` against the bar-segment scenario.
2. **Simplify hierarchy.** Use the runner's existing title and briefing; replace the nested activity header with a short “Compare palettes” section heading. Put the question below the preview and candidates, full width.
3. **Build the real preview and audit.** Display category names, values, and redundant encodings; compute ratios for text and essential graphical elements using the relevant criterion. Show the tested background and methods next to results.
4. **Make controls accessible.** Use native form semantics, keyboard selection, visible focus, active mode announcement, 200% text zoom, and a narrow viewport check. Verify both themes.
5. **Validate the learning flow.** A learner should be able to explain what failed, choose a remediation, inspect why it works, and retry after an incorrect decision without relying on a toast.

**Done when:** At 320px and typical desktop widths there is no horizontal clipping; the question is readable without a narrow nested column; keyboard and screen-reader users can identify selected mode and answer; every displayed ratio names its tested pair and criterion; the example chart remains interpretable without color; and no UI text asserts AAA for the whole palette.

## Skills considered through `find-skills`

The [skills.sh leaderboard](https://skills.sh/) already covers this design review need, so a CLI search was unnecessary. I used the published guidance on intentional hierarchy, typography, and accessible interface review while writing this specification. These are **recommendations**, not installed project dependencies.

| Skill | Why it fits | Popularity / source check | Install command |
| --- | --- | --- | --- |
| [frontend-design](https://www.skills.sh/anthropics/skills/frontend-design) | Helps choose a coherent visual direction and type hierarchy for the lesson. | About 950K installs; Anthropic source; about 179K repository stars on skills.sh at review time. | `npx skills add anthropics/skills@frontend-design` |
| [web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | Provides a code-oriented accessibility and interaction review checklist. | About 695K installs; Vercel source; about 32K repository stars on skills.sh at review time. | `npx skills add vercel-labs/agent-skills@web-design-guidelines` |

## Standards referenced

- [WCAG 2.2 Understanding 1.4.6, Contrast (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html): AAA text thresholds and ratio formula context.
- [WCAG 2.2 Understanding 1.4.11, Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): essential graphical and UI indicators.
- [WCAG 2.2 Understanding 1.4.1, Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html): information needs a cue beyond color.
- [WCAG 2.2 Understanding 2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): pointer target minimum and spacing exceptions.

This review is a design and source-code assessment. A conformance claim needs testing of the rendered page, its actual colors and states, keyboard flow, zoom, and assistive-technology output.
