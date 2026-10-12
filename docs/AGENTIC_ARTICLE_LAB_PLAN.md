# Agentic Lab → Landing-Accessible Article + Quiz

## 0. Question

> Can the interactive lab views be replicated as short, article-styled pages with
> colorful SVG illustrations and multiple True/False, MCQ and select-option questions —
> surfaced directly on the landing page, while keeping the labs?

**Answer: yes, and it is a view-layer change, not a rewrite.**

---

## 1. Why this is cheap — the content already exists

`AgenticRoleChapter` (`agenticRoleTypes.ts:288-308`) already separates prose from interactive chrome.

| Existing field | Article equivalent |
| --- | --- |
| `theory_content.title`, `theory_content.content` | Headline + intro body |
| `theory_content.analogy` | "Mental model" callout |
| `theory_content.practical_takeaway` | "Practical takeaway" callout |
| `theory_content.industry_case_study` | "In the field" callout |
| `critical_concepts[].concept` / `.definition` / `.elaboration` / `.industry_application` | Numbered sections + "In practice" note |
| `interactive_questions[].question` / `.options` / `.answer` / `.explanation` / `.wrong_answer_feedback` | The quiz bank, with per-distractor feedback |

### Measured inventory

| Source | Roles | Chapters | Exercises | Concepts |
| --- | --- | --- | --- | --- |
| `data/*.json` (6 files) | 6 | 30 | 31 | 36 |
| `data/industryRoleChapters.ts` | +4 domains | generated at runtime | generated | generated |

Domains present: `seo`, `accountant`, `commerce`, `recommendation`, `preprocessing`,
`visualization` (JSON) and `mobility`, `retail`, `procurement`, `contracts` (generated).

**Zero new prose needs to be written** to launch a reading + quiz experience.

---

## 2. Why it is low risk

`AgenticRolesRunner.tsx` already renders the article half and the lab half as
**independent, separately-conditioned blocks**:

- theory `<aside>` — lines 263–297 (prose, concepts, takeaway, analogy, `RoleConceptVisual`)
- activity — line 55: `agenticRolesRegistry[chapter.labComponentId] || FallbackRoleActivity`

The article page is that same `<aside>` promoted to full width, plus
`interactive_questions` rendered through the **already-existing**
`CandidateAssessmentWidget`, which already provides:

- radio semantics inside a `<fieldset>` + `<legend>` (screen-reader labelled)
- `useId`-scoped option group (no cross-question collisions)
- focus moved to feedback via `requestAnimationFrame`
- `role="status"` live region for the verdict
- retry-only-on-wrong flow, so the answer is never revealed without an attempt

**So the work is re-parenting existing components, not rebuilding them.**

---

## 3. Limitations to accept up front

### 3.1 True/False is not natively modelled

Every `AgenticRoleExercise` uses `options: string[]` with 4 choices. There is no
boolean form in the schema.

Two paths:

- **(a) Extend the schema** — add to `AgenticRoleExercise`:
  ```ts
  format?: 'mcq' | 'true-false';   // default 'mcq'
  statement?: string;              // used when format === 'true-false'
  isTrue?: boolean;                // used when format === 'true-false'
  ```
  Recommended. It is additive and optional, so all 31 existing exercises keep working
  untouched. `CandidateAssessmentWidget` gains a branch on `format` and reuses its
  existing state machine.
- **(b) Derive T/F** by pairing `answer` with a fabricated distractor — **rejected**,
  because the distractor would be invented at runtime and would be unverifiable.

**Cost:** schema addition + ~40 lines in `CandidateAssessmentWidget`. The T/F *content*
itself would be authored later as a separate pass, or skipped at launch.

---

## 4. Proposed architecture

Follows the root-component convention in `AGENTS.md`: shared building blocks live under
`src/shared/components`, and feature areas consume them.

```
src/shared/components/article-lab/          ← new root-level building blocks
  ArticleLabLayout.tsx     shell: header, icon band, prose column, quiz column
  ConceptSection.tsx       renders one AgenticRoleConcept as an article section
  QuizBank.tsx             iterates interactive_questions, owns score state
  conceptText.ts           pure adapter: AgenticRoleChapter -> article blocks

src/devLushArea/landingPage/
  AgenticArticlePreview.tsx   landing-page surface, routes into the above
```

`conceptText.ts` is pure and unit-testable — the only place that knows the shape of
`AgenticRoleChapter`. That keeps the components dumb and the data coupling in one file.

### Routing

The landing page already links into role chapters. Add a **mode flag** rather than a new
route tree, so both experiences stay reachable:

```
/agentic-roles/:roleId/:labComponentId            → lab (existing, unchanged)
/agentic-roles/:roleId/:labComponentId?mode=read  → article + quiz (new)
```

`AgenticRolesRunner` reads `mode=read` and swaps its body for `ArticleLabLayout`. No
route change, no component duplication, and the labs remain fully intact — satisfying
*"I want to keep them."*

---

## 5. Implementation phases

### Phase 1 — Adapter + components (no data change)
- [ ] `src/shared/components/article-lab/conceptText.ts` — map chapter → `{ intro, callouts, sections }`
- [ ] `ConceptSection.tsx` — section number, title, definition, elaboration, "In practice"
- [ ] `ArticleLabLayout.tsx` — two-column on `lg`, single column below; domain icon band
- [ ] Unit check: all 30 JSON chapters produce non-empty `intro` and `sections`

### Phase 2 — Quiz reuse
- [ ] `QuizBank.tsx` — progress counter, per-question `CandidateAssessmentWidget`, score
- [ ] Verify keyboard-only completion and that `role="status"` still announces
- [ ] Confirm retry-on-wrong prevents answer exposure

### Phase 3 — Mode flag + landing entry
- [ ] `AgenticRolesRunner` gains `mode=read` branch delegating to `ArticleLabLayout`
- [ ] `AgenticArticlePreview.tsx` on the landing page with a "Read instead" affordance
- [ ] Confirm existing `/agentic-roles/...` lab URLs are unchanged (no regression)

### Phase 4 — Illustrations
- [ ] `roleDomain` → `public/icons/*` mapping
- [ ] `RoleConceptVisual` fallback driven by `critical_concepts`
- [ ] Guard: transparent PNGs must sit on a defined background in both themes

### Phase 5 — True/False (optional)
- [ ] Add `format` / `statement` / `isTrue` to `AgenticRoleExercise` (all optional)
- [ ] `CandidateAssessmentWidget` T/F branch reusing existing state machine
- [ ] Author T/F statements for flagship chapters only

---

## 6. Risks

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Quiz duplicates lab logic, drifts over time | High | Reuse `CandidateAssessmentWidget`; never fork it |
| Answer exposed without attempt | Medium | Inherited retry-gated flow; add a test before extending |
| Colorful PNGs invisible in dark mode | Medium | Place on solid surface; verify both themes in Phase 4 |
| `theory_content` missing on some chapters | Medium | Adapter must default gracefully |
| T/F invented at runtime is unverifiable | Medium | Reject derivation; require explicit authored statements |
| Landing page LCP regression from PNGs | Low | 24 icons ≈ 190 KB, already `srcset`-ed 64/256 |

---

## 7. Recommendation

Ship **Phases 1–4**. That yields a landing-accessible article page with colorful domain
illustrations and MCQ quizzes over all 30+ existing chapters, **with no data migration and
no risk to the labs**.

Treat **Phase 5 (True/False) as a separate content project**, not part of this build —
the engineering is ~40 lines, but the *content* is real authoring effort.


### 3.2 Illustrations only exist where `caseLearningFlows` has an entry

`RoleConceptVisual.tsx:16-17`:
```ts
const flow = caseLearningFlows[chapter.labComponentId];
if (!flow) return null;
```
So it renders only the 4-stage (Observe → Reason → Act → Verify) figure, and only for
lab IDs registered in `caseLearningFlows.ts`. For every other chapter it renders nothing.

Mitigation options, in order of preference:

1. **Domain-level colorful icon band** — map `roleDomain` → one of the 24 colorful PNGs
   already in `public/icons/` (see `docs/COLORFUL_ICON_MIGRATION_PLAN.md`). Always
   renders, cheap, consistent.
2. **Stage figure fallback** — let `RoleConceptVisual` fall back to `critical_concepts`
   as stage content when `caseLearningFlows` has no entry.
3. **Per-chapter `caseLearningFlows` entries** — highest quality, highest cost.

Recommend **(1) for launch, then (2)**. Option 3 only for flagship chapters.
