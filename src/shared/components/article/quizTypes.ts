/**
 * Quiz primitives shared by every article-style surface (agent labs, software
 * manual, blog posts).
 *
 * These types are deliberately free of any agentic-role concepts so that
 * `shared/` never depends on a feature area. Domain adapters translate their own
 * content into `QuizQuestion` — see
 * `src/devLushArea/articleView/roleArticleAdapter.ts`.
 */

/**
 * - `single`  exactly one option is correct (radio)
 * - `multi`   every correct option must be selected, and no incorrect one
 *             (checkbox, all-or-nothing)
 * - `boolean` two opposing options (True/False, Yes/No)
 */
export type QuestionKind = 'single' | 'multi' | 'boolean';

export interface QuizQuestion {
  /** Stable within its parent article. Used as the radio group name and result key. */
  id: string;
  kind: QuestionKind;
  /** Scenario or stem shown above the question. */
  prompt?: string;
  question: string;
  options: string[];
  /** Indexes into `options`. Empty means the answer is unresolvable. */
  correctIndexes: number[];
  explanation: string;
  /** Per-option remediation, keyed by the option text. */
  feedbackByOption?: Record<string, string>;
}

export interface QuestionResult {
  questionId: string;
  /** Indexes the learner selected, in option order. */
  selected: number[];
  correct: boolean;
}

/**
 * A question is only gradeable when at least one correct index is resolvable.
 * Unresolvable answers show the explanation without claiming a score.
 */
export function isGraded(question: QuizQuestion): boolean {
  return question.correctIndexes.length > 0;
}

/** Set-equality in option order, so selection order never affects the grade. */
export function isSelectionCorrect(question: QuizQuestion, selected: number[]): boolean {
  if (!isGraded(question)) return false;
  const chosen = [...selected].sort((a, b) => a - b);
  const expected = [...question.correctIndexes].sort((a, b) => a - b);
  if (chosen.length !== expected.length) return false;
  return expected.every((value, index) => value === chosen[index]);
}
