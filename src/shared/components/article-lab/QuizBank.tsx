import React, { useState, useCallback } from 'react';
import { Award, ChevronRight } from 'lucide-react';
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
  const [completed, setCompleted] = useState(false);

  const totalQuestions = exercises.length;
  const currentExercise = exercises[currentIndex];
  const answeredCount = Object.keys(questionStates).length;
  const correctCount = Object.values(questionStates).filter((s) => s.correct).length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // CandidateAssessmentWidget fires onComplete once the learner confirms the correct decision
  const handleQuestionComplete = useCallback(() => {
    setQuestionStates((prev) => ({
      ...prev,
      [currentIndex]: { answered: true, correct: true },
    }));

    if (isLastQuestion) {
      setCompleted(true);
      onComplete?.();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, isLastQuestion, onComplete]);

  if (completed) {
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    return (
      <section
        role="status"
        aria-live="polite"
        className={cn(
          'role-fade-in rounded-3xl border border-stone-200 bg-stone-50 p-8 text-center dark:border-stone-800 dark:bg-stone-900 sm:p-12 space-y-6',
          className,
        )}
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400">
          <Award className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Lesson &amp; Check Complete
          </span>
          <h2 className="role-editorial-serif text-3xl font-bold text-stone-900 dark:text-white sm:text-4xl">
            You scored {correctCount} out of {totalQuestions}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {percentage}% mastery recorded for this case.
          </p>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          {exercises.map((_, idx) => (
            <span
              key={idx}
              className="rounded-full bg-emerald-100 px-3 py-1 font-mono text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              Q{idx + 1} · Verified
            </span>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setCurrentIndex(0);
              setQuestionStates({});
              setCompleted(false);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800 cursor-pointer"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
            </svg>
            Retake Check
          </button>
        </div>
      </section>
    );
  }

  if (!currentExercise) return null;

  return (
    <section className={cn('space-y-6', className)} aria-label={`Quiz question ${currentIndex + 1} of ${totalQuestions}`}>
      {/* Activity Header + Step Dots */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 block mb-1">
            Interactive Check
          </span>
          <h2 className="role-editorial-serif text-2xl sm:text-4xl font-bold text-stone-900 dark:text-white">
            Knowledge Check
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <div className="flex items-center gap-1.5">
            {exercises.map((_, index) => {
              const state = questionStates[index];
              const isCurrent = index === currentIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  disabled={index > answeredCount && !state?.answered}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`Question ${index + 1}${state?.answered ? ', completed' : ''}`}
                  className={cn(
                    'h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
                    isCurrent
                      ? 'w-7 bg-emerald-600 dark:bg-emerald-500'
                      : state?.answered
                        ? 'w-2.5 bg-emerald-400 dark:bg-emerald-700'
                        : 'w-2.5 bg-stone-300 dark:bg-stone-700',
                    index > answeredCount && !state?.answered && 'opacity-40 cursor-not-allowed',
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <CandidateAssessmentWidget
        key={currentExercise.id || currentExercise.question}
        exercise={currentExercise}
        onComplete={handleQuestionComplete}
      />

      {questionStates[currentIndex]?.answered && !isLastQuestion && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <span>Next Question</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
};
