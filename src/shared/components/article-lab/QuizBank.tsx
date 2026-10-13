import React, { useState, useCallback } from 'react';
import { CheckCircle2, Award, ChevronRight } from 'lucide-react';
import CandidateAssessmentWidget from '../../../devLushArea/agenticRoles/views/components/CandidateAssessmentWidget';
import type { AgenticRoleExercise } from '../../../devLushArea/agenticRoles/agenticRoleTypes';
import { cn } from '../article/cn';

interface QuizBankProps {
  exercises: AgenticRoleExercise[];
  onComplete?: () => void;
  className?: string;
}

interface QuestionState {
  answered: boolean;
  correct: boolean;
}

export const QuizBank: React.FC<QuizBankProps> = ({ exercises, onComplete, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const totalQuestions = exercises.length;
  const currentExercise = exercises[currentIndex];
  const answeredCount = Object.keys(questionStates).length;
  const correctCount = Object.values(questionStates).filter((s) => s.correct).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const handleQuestionComplete = useCallback(() => {
    const exercise = exercises[currentIndex];
    const isCorrect = questionStates[currentIndex]?.correct ?? false;

    setQuestionStates((prev) => ({
      ...prev,
      [currentIndex]: { answered: true, correct: isCorrect },
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (isLastQuestion) {
      setCompleted(true);
      onComplete?.();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, exercises, isLastQuestion, onComplete, questionStates]);

  const handleRetry = useCallback(() => {
    setQuestionStates((prev) => {
      const next = { ...prev };
      delete next[currentIndex];
      return next;
    });
  }, [currentIndex]);

  if (completed) {
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    return (
      <section
        role="status"
        aria-live="polite"
        className={cn(
          'rounded-2xl border p-6',
          'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/30',
          className
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
            <Award className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-200">
              Quiz complete
            </h2>
            <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-300">
              You scored {correctCount} out of {totalQuestions} ({percentage}%).
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/50 p-4 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Correct
            </p>
            <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {correctCount} / {totalQuestions}
            </p>
          </div>
          <div className="rounded-xl bg-white/50 p-4 dark:bg-slate-900/50">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Score
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {percentage}%
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0);
              setQuestionStates({});
              setScore(0);
              setCompleted(false);
            }}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            </svg>
            Retake quiz
          </button>
        </div>
      </section>
    );
  }

  if (!currentExercise) return null;

  return (
    <section className={cn('space-y-6', className)} aria-label={`Quiz question ${currentIndex + 1} of ${totalQuestions}`}>
      {/* Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="hidden h-1.5 w-32 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 sm:block">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
          {correctCount} / {answeredCount} correct
        </div>
      </div>

      {/* Question */}
      <CandidateAssessmentWidget
        exercise={currentExercise}
        onComplete={handleQuestionComplete}
      />

      {/* Navigation for answered questions */}
      {questionStates[currentIndex]?.answered && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {questionStates[currentIndex].correct
              ? 'Correct! Well reasoned.'
              : 'Not quite. Review the explanation above.'}
          </p>
          {isLastQuestion ? (
            <button
              type="button"
              onClick={() => {}}
              disabled
              className="min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
            >
              Complete quiz
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Next question
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Quick jump navigation */}
      <nav aria-label="Question navigator" className="hidden overflow-x-auto gap-1 p-2 sm:flex">
        {exercises.map((_, index) => {
          const state = questionStates[index];
          return (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              disabled={index > answeredCount && !state?.answered}
              aria-current={index === currentIndex ? 'step' : undefined}
              aria-label={`Question ${index + 1}${state ? state.correct ? ', correct' : ', answered' : ''}`}
              className={cn(
                'flex min-w-[2.5rem] min-h-[2.5rem] shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                index === currentIndex
                  ? 'bg-indigo-600 text-white'
                  : state?.answered
                  ? state.correct
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700',
                index > answeredCount && !state?.answered && 'opacity-40 cursor-not-allowed'
              )}
            >
              {index + 1}
            </button>
          );
        })}
      </nav>
    </section>
  );
};