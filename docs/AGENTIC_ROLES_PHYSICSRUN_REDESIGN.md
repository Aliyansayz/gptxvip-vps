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

- `RoleActivityFrame` establishes the sequence: explore the evidence, use its controls, then make a decision. It replaces the repeated dark title bars and nested 7/5 activity splits.
- `CandidateAssessmentWidget` provides native radio choices, keyboard interaction, visible focus, targeted incorrect-answer feedback, retry, and an explicit Continue action. Feedback stays visible until the learner continues. Completion callbacks run once per decision.
- `RoleConceptVisual` provides an interactive four-stage reading diagram for each of the 30 cases. The case-specific descriptions live in `caseLearningFlows.ts` rather than being repeated inside activity components.
- `AgenticRolesRunner` defaults to full-width evidence with Theory below. Optional side theory starts at a wider breakpoint. The reading diagram responds to its own container width, including in the narrow side panel.
- `agenticLearning.css` scopes natural heading capitalization, focus behavior, text wrapping, and reduced-motion support to Agentic Roles.

The existing route-state navigation, shared Agent Labs sidebar and mobile navigation, favorites, Study Notebook, role registry, and completion storage remain the integration points.

## Palette case correction

The color palette activity now presents a labeled bar-chart example, original and revised palette choices, four illustrative vision previews, and a real contrast calculation. Category names and values stay outside color fills; the revised chart adds a pattern.

The audit names the tested source sRGB pair and canvas `#0F172A`. It evaluates essential graphics separately from normal text. It does not attach a single “AAA” ratio to a whole palette or describe approximate vision previews as certification. The corresponding lesson descriptions and sample logs now match these measurements.

## Validation

Validation covers the production build, TypeScript, all registered views at desktop and 320px widths in both themes, and decision selection, retry, and continuation. Browser checks use the actual `/agents/lab` app and its route-state contract. Additional checks cover multiple-decision cases, theory layouts, role hubs, search, Back/Forward, sliders, palette changes, and calculated contrast results.

The browser evidence is recorded after the checks complete; an automated layout check does not establish full WCAG conformance. Visual review and keyboard checks supplement the source review.
