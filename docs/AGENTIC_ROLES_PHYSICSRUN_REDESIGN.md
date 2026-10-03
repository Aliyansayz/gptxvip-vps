# Agentic Roles: physicsrun reference redesign

## Reference and design direction

The diffusion and material physics experiences in the neighboring `physicsrun` project provide the reference for this redesign:

| Reference | Pattern used in Agentic Roles |
| --- | --- |
| `components/mathPrimerTopics/diffusion_learning/DDPMVisual.tsx` | A large demonstration followed by controls and a full-width question. |
| `components/MathPrimerView/MathPrimerTheoryBridge.tsx` | A reading companion with a concept diagram, analogy, and practical application. |
| `components/coreConceptsTopics/material-physics/StressStrainCurveExplorer.tsx` and `BandTheorySimulator.tsx` | Controls placed near the visual evidence they change, clear section spacing, and persistent feedback. |
| `components/CoreConceptsView/CoreConceptsTheoryBridge.tsx` | Readable theory sections with restrained, themed callouts. |
| `components/LearningExperience/ActivityRunnerFrame.tsx` | A consistent case header with Back, saved items, and theory controls. |

## Coverage

All six roles use the new presentation: SEO, Accounting, Commerce, Recommendations, Data Preprocessing, and Data Visualization. All 30 registered activities retain their dedicated evidence and simulation controls and use the same shared activity and decision components. The fallback uses the same contract.

The role hubs now display a numbered learning path with longer readable briefs, a clear Start/Continue action, capabilities, and completion progress. Search retains role and difficulty filters, saved items, and case navigation while using the same typography and surfaces.

## Shared components

- [`RoleActivityFrame`](../src/devLushArea/agenticRoles/views/components/RoleActivityFrame.tsx) establishes the sequence: explore the evidence, use its controls, then make a decision. It replaces the repeated dark title bars and nested 7/5 activity splits.
- [`CandidateAssessmentWidget`](../src/devLushArea/agenticRoles/views/components/CandidateAssessmentWidget.tsx) provides native radio choices, keyboard interaction, visible focus, targeted incorrect-answer feedback, retry, and an explicit Continue action. Feedback stays visible until the learner continues. Completion callbacks run once per decision.
- [`RoleConceptVisual`](../src/devLushArea/agenticRoles/views/components/RoleConceptVisual.tsx) provides an interactive four-stage reading diagram for each of the 30 cases. The case-specific descriptions live in `caseLearningFlows.ts` rather than being repeated inside activity components.
- `AgenticRolesRunner` defaults to full-width evidence with Theory below. Optional side theory starts at a wider breakpoint. The reading diagram responds to its own container width, including in the narrow side panel.
- `agenticLearning.css` scopes natural heading capitalization, focus behavior, text wrapping, and reduced-motion support to Agentic Roles.

The existing route-state navigation, shared Agent Labs sidebar and mobile navigation, favorites, Study Notebook, role registry, and completion storage remain the integration points.

## Palette case correction

The color palette activity now presents a labeled bar-chart example, original and revised palette choices, four illustrative vision previews, and a real contrast calculation. Category names and values stay outside color fills; the revised chart adds a pattern.

The audit names the tested source sRGB pair and canvas `#0F172A`. It evaluates essential graphics separately from normal text. It does not attach a single “AAA” ratio to a whole palette or describe approximate vision previews as certification. The corresponding lesson descriptions and sample logs now match these measurements.

## Validation

Completed on 3 October 2026 using Chromium against the local production preview of `/agents/lab` and the app's route-state navigation contract.

| Check | Result |
| --- | --- |
| TypeScript (`tsc --noEmit`) | Passed. |
| Production Vite build | Passed; existing large-chunk warning remains. |
| Activity presentation | All 30 cases at 1440px and 320px, in light and dark themes: 120 view states, no detected overflow or browser errors after fixes. |
| Decision flow | All 31 decisions at both widths: 62 wrong-answer → retry → correct-answer → Continue flows passed, including the two-decision SEO case. |
| Role hubs | All six roles at 1920px and 320px, in both themes: 24 checks passed. |
| Navigation and saved items | Start, Back/Forward, return to cases, search, favorites, and Study Notebook passed. |
| Reading | Default theory below, optional side theory, hide/show, four-stage diagram interaction, and complete descriptions for all 30 cases passed. |
| Evidence controls | Simulation controls and keyboard changes to the four range inputs passed. Palette switching, contrast measurements, and vision-preview changes passed. |
| Keyboard and scale | Native radio navigation and 200% CSS zoom passed. |
| Contrast utility | Black/white 21:1, identical colors 1:1, pair symmetry, and expected palette/canvas ratios passed. |

The first layout run exposed outward-pointing diagram arrows and long schema URLs. The arrows now stay inside their controls, and schema values wrap within their available space. The final 120-state layout pass was run against the rebuilt bundle.

Visual inspection covered the mobile palette activity, mobile role hub, desktop role activities, and the wide-screen side-theory layout. Browser screenshots used fallback fonts with external font requests disabled. Automated geometry checks, keyboard checks, and visual inspection support this review; they do not establish full WCAG conformance or replace assistive-technology testing.

For the original provisional 4/10 rating and the detailed component recommendations, see [the initial palette UI/UX review](./WCAG_AAA_PALETTE_SYNTHESIZER_UI_UX_REVIEW.md).
