import React, { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuestionFeedbackProps {
  correct: boolean;
  /** Per-option remediation when the learner picked a known wrong option. */
  targetedFeedback?: string;
  explanation: string;
  /** False when the answer is unresolvable; shows the explanation as a note. */
  graded: boolean;
}

/**
 * Shared answer reveal. Mirrors the feedback block in
 * `CandidateAssessmentWidget` so the article and lab views read identically.
 */
export const QuestionFeedback: React.FC<QuestionFeedbackProps> = ({
  correct,
  targetedFeedback,
  explanation,
  graded,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Announce the reveal and move focus so keyboard users do not have to hunt.
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
  }, []);

  const tone = !graded
    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30'
    : correct
      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30'
      : 'border-amber-600 bg-amber-50 dark:bg-amber-950/30';

  const headline = !graded
    ? 'Answer key'
    : correct
      ? 'Correct'
      : 'Not quite';

  const body = !correct && targetedFeedback ? targetedFeedback : explanation;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className={`mt-5 rounded-xl border-l-4 p-4 focus:outline-none ${tone}`}
    >
      <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
        {graded ? (
          correct ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
          )
        ) : null}
        {headline}
      </p>
      <p className="max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">{body}</p>
    </div>
  );
};

export default QuestionFeedback;
