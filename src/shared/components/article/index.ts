/**
 * Editorial article system — the standard long-form reading surface.
 *
 * Ported from the Tablet Magazine reference design and adapted to this app's
 * conventions. Substitutions made deliberately, all to avoid adding a second
 * copy of a dependency the app already has:
 *
 * | Reference       | Used here        | Why                                    |
 * | --------------- | ---------------- | -------------------------------------- |
 * | Tailwind CDN    | Tailwind v4      | `@tailwindcss/vite` is the app's setup |
 * | MathJax         | KaTeX            | Already a dependency                   |
 * | Chart.js        | recharts         | Already a dependency                   |
 * | Font Awesome    | lucide-react     | Already a dependency                   |
 * | Custom toast    | sonner           | `<Toaster>` already mounted 3×         |
 * | `prose` plugin  | hand-rolled CSS  | Typography plugin is not installed     |
 *
 * The reference's author-bio card is intentionally not ported — see
 * `EditorialArticle` for the reasoning.
 *
 * Content layers, in dependency order: `cn` → `useReadingProgress` → the
 * primitives (`prose`, `MathBlock`, `EditorialFigure`, `ShareBar`,
 * `ReadingRibbon`) → `EditorialArticle` → the quiz layer
 * (`quizTypes`, `QuizBlock`, `QuestionFeedback`).
 */

export { cn } from './cn';
export { useReadingProgress } from './useReadingProgress';
export type { ReadingProgress, Options as ReadingProgressOptions } from './useReadingProgress';

export { ReadingRibbon } from './ReadingRibbon';
export { ShareBar } from './ShareBar';
export { EditorialFigure } from './EditorialFigure';
export { MathBlock, MathText } from './MathBlock';
export {
  LeadParagraph,
  NotesSection,
  PullQuote,
  SectionHeading,
  FootnoteRef,
} from './prose';

/*
 * Theory-pane content. These mirror what the agentic-roles theory pane already
 * renders — analogy, practical takeaway, case study, critical concepts — so the
 * article view is not a lossy subset of the lab.
 */
export { Callout, InTheField, MentalModel, PracticalTakeaway } from './callouts';
export type { CalloutAccent } from './callouts';
export { ConceptChips, ConceptList } from './ConceptList';
export type { Concept } from './ConceptList';
export { TheoryPanel } from './TheoryPanel';
export type { TheoryContent } from './TheoryPanel';

export { EditorialArticle } from './EditorialArticle';
export type { EditorialArticleProps, ArticleRelatedItem } from './EditorialArticle';

export { QuizBlock } from './QuizBlock';
export { QuestionFeedback } from './QuestionFeedback';
export { isGraded, isSelectionCorrect } from './quizTypes';
export type { QuestionKind, QuestionResult, QuizQuestion } from './quizTypes';
