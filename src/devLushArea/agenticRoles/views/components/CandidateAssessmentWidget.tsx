import React, { useId, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { AgenticRoleExercise } from '../../agenticRoleTypes';

interface CandidateAssessmentWidgetProps {
  exercise: AgenticRoleExercise;
  onComplete?: () => void;
}

/** Native choices and persistent feedback shared by role activities. */
export default function CandidateAssessmentWidget({ exercise, onComplete }: CandidateAssessmentWidgetProps) {
  const groupId = useId();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [evaluated, setEvaluated] = useState(false);
  const [continued, setContinued] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const isCorrect = selectedOption === exercise.answer;
  const feedback = exercise.wrong_answer_feedback?.find(item => item.option === selectedOption)?.feedback;

  const checkDecision = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOption) return;
    setEvaluated(true);
    requestAnimationFrame(() => feedbackRef.current?.focus({ preventScroll: true }));
  };

  return (
    <form onSubmit={checkDecision} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <fieldset disabled={evaluated} className="min-w-0">
        <legend className="mb-5 w-full space-y-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">02 · Make your decision</span>
          <span className="block max-w-3xl text-lg font-semibold leading-relaxed text-slate-900 dark:text-slate-100">{exercise.question}</span>
        </legend>
        <div className="space-y-3">
          {exercise.options.map((option, index) => {
            const selected = selectedOption === option;
            return (
              <label key={option} className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm leading-6 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 sm:text-base ${selected ? 'border-indigo-500 bg-indigo-50 text-slate-900 dark:bg-indigo-950/40 dark:text-slate-100' : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:border-slate-500'}`}>
                <input type="radio" name={groupId} value={option} checked={selected} onChange={() => setSelectedOption(option)} className="mt-1 h-4 w-4 shrink-0 accent-indigo-600" />
                <span className="shrink-0 font-mono text-sm text-slate-500 dark:text-slate-400">{String.fromCharCode(65 + index)}.</span>
                <span className="min-w-0 break-words">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {evaluated && (
        <div ref={feedbackRef} tabIndex={-1} role="status" className={`mt-5 rounded-xl border-l-4 p-4 focus:outline-none ${isCorrect ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'border-amber-600 bg-amber-50 dark:bg-amber-950/30'}`}>
          <p className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">{isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="h-5 w-5 text-amber-700 dark:text-amber-400" />}{isCorrect ? 'Correct decision' : 'Reconsider your decision'}</p>
          <p className="max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">{!isCorrect && feedback ? feedback : exercise.explanation}</p>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">{evaluated ? (isCorrect ? 'Review the explanation, then continue.' : 'Use the evidence to try another response.') : 'Choose one response to check your reasoning.'}</p>
        {!evaluated ? (
          <button key="check" type="submit" disabled={!selectedOption} className="min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">Check decision</button>
        ) : isCorrect ? (
          <button type="button" disabled={continued} onClick={() => { setContinued(true); onComplete?.(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50">{continued ? 'Decision recorded' : 'Continue'}<ArrowRight className="h-4 w-4" /></button>
        ) : (
          <button key="retry" type="button" onClick={event => { event.preventDefault(); setEvaluated(false); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"><RotateCcw className="h-4 w-4" />Try again</button>
        )}
      </div>
    </form>
  );
}
