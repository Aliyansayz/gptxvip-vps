import React, { useId, useMemo, useState } from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import type { QuestionResult, QuizQuestion } from './quizTypes';
import { isGraded, isSelectionCorrect } from './quizTypes';
import QuestionFeedback from './QuestionFeedback';

interface QuizBlockProps {
  question: QuizQuestion;
  /** 1-based position, used for the "03 ·" step label. */
  index?: number;
  onAnswered?: (result: QuestionResult) => void;
  onContinue?: () => void;
  continueLabel?: string;
}

/**
 * Renders one question and dispatches on `kind`:
 *
 * - `boolean`  two large opposing buttons
 * - `single`   radio list, one correct answer
 * - `multi`    checkbox list, all-or-nothing
 *
 * The list variants deliberately reuse the option-row styling from
 * `CandidateAssessmentWidget` so article and lab views feel like one product.
 */
export const QuizBlock: React.FC<QuizBlockProps> = ({
  question,
  index,
  onAnswered,
  onContinue,
  continueLabel = 'Continue',
}) => {
  const groupId = useId();
  const [selected, setSelected] = useState<number[]>([]);
  const [evaluated, setEvaluated] = useState(false);
  const [continued, setContinued] = useState(false);

  const graded = useMemo(() => isGraded(question), [question]);
  const correct = useMemo(() => isSelectionCorrect(question, selected), [question, selected]);

  const isBoolean = question.kind === 'boolean';
  const isMulti = question.kind === 'multi';
  const hasSelection = selected.length > 0;

  const toggle = (optionIndex: number) => {
    if (evaluated) return;
    setSelected((current) => {
      if (isMulti) {
        return current.includes(optionIndex)
          ? current.filter((value) => value !== optionIndex)
          : [...current, optionIndex].sort((a, b) => a - b);
      }
      // Single and boolean are exclusive: re-clicking clears the choice.
      return current.includes(optionIndex) ? [] : [optionIndex];
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!hasSelection || evaluated) return;
    setEvaluated(true);
    onAnswered?.({
      questionId: question.id,
      selected,
      correct: isSelectionCorrect(question, selected),
    });
  };

  const retry = () => {
    setEvaluated(false);
    setSelected([]);
  };

  const targetedFeedback = !correct
    ? selected
        .map((optionIndex) => question.feedbackByOption?.[question.options[optionIndex]])
        .find(Boolean)
    : undefined;

  const optionRowClass = (active: boolean) =>
    active
      ? 'border-indigo-500 bg-indigo-50 text-slate-900 dark:bg-indigo-950/40 dark:text-slate-100'
      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500';

  return (
    <form
      onSubmit={submit}
      className="article-quiz rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:p-6"
    >
      <div className="mb-4 flex items-baseline gap-3">
        {index !== undefined ? (
          <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {String(index).padStart(2, '0')}
          </span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {isBoolean ? 'True / False' : isMulti ? 'Select all that apply' : 'Single choice'}
        </span>
      </div>

      {question.prompt ? (
        <p className="mb-3 text-sm italic leading-6 text-slate-600 dark:text-slate-400">
          {question.prompt}
        </p>
      ) : null}

      <p className="mb-4 text-base font-semibold leading-7 text-slate-900 dark:text-slate-100">
        {question.question}
      </p>

      {/*
       * `role="radiogroup"`/`role="group"` rather than a bare list: the two
       * selection models are not interchangeable, and a screen reader needs to
       * hear whether it is in "pick one" or "pick many" mode before the options.
       */}
      <div
        role={isMulti ? 'group' : 'radiogroup'}
        aria-label={question.question}
        className={
          isBoolean
            ? 'grid grid-cols-1 gap-3 sm:grid-cols-2'
            : 'flex flex-col gap-2.5'
        }
      >
        {question.options.map((option, optionIndex) => {
          const active = selected.includes(optionIndex);
          const inputId = `${groupId}-${optionIndex}`;

          return (
            <label
              key={option}
              htmlFor={inputId}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-indigo-500 ${optionRowClass(
                active,
              )} ${evaluated ? 'cursor-default opacity-90' : ''}`}
            >
              <input
                id={inputId}
                type={isMulti ? 'checkbox' : 'radio'}
                name={groupId}
                checked={active}
                disabled={evaluated}
                onChange={() => toggle(optionIndex)}
                className="h-4 w-4 shrink-0 accent-indigo-600"
              />
              <span className="leading-6">{option}</span>
            </label>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {evaluated ? (
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest text-slate-700 transition-colors hover:border-slate-500 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Try again
          </button>
        ) : (
          <button
            type="submit"
            disabled={!hasSelection}
            className="rounded-lg bg-indigo-600 px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answer
          </button>
        )}

        {evaluated && onContinue && !continued ? (
          <button
            type="button"
            onClick={() => {
              setContinued(true);
              onContinue();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 font-sans text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {continueLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {evaluated ? (
        <QuestionFeedback
          correct={correct}
          targetedFeedback={targetedFeedback}
          explanation={question.explanation}
          graded={graded}
        />
      ) : null}
    </form>
  );
};

export default QuizBlock;

