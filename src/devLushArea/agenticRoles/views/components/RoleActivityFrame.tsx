import React, { useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AgenticRoleExercise } from '../../agenticRoleTypes';
import CandidateAssessmentWidget from './CandidateAssessmentWidget';
import { KnowledgeCheckPromptCard } from '../../../../shared/components/article-lab';
import { useRoleMcqContext } from './RoleMcqContext';

interface RoleActivityFrameProps {
  exercise: AgenticRoleExercise;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  onComplete?: () => void;
}

/**
 * The demonstration -> button-gated knowledge check sequence used by every role case.
 * The MCQ view remains hidden until the learner explicitly clicks "Start Activity".
 */
export default function RoleActivityFrame({ exercise, toolbar, children, onComplete }: RoleActivityFrameProps) {
  const ctx = useRoleMcqContext();
  const [localMcqOpen, setLocalMcqOpen] = useState(false);
  const localMcqRef = useRef<HTMLElement>(null);

  if (!exercise) return <p role="status">There are no decisions in this case yet.</p>;

  const isMcqOpen = ctx ? ctx.isMcqOpen : localMcqOpen;
  const totalQuestions = ctx ? ctx.totalQuestions : 1;
  const sectionRef = ctx?.mcqSectionRef || localMcqRef;

  const handleOpenMcq = () => {
    if (ctx) {
      ctx.openMcq();
    } else {
      setLocalMcqOpen(true);
      requestAnimationFrame(() => {
        localMcqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  };

  const handleCloseMcq = () => {
    if (ctx) {
      ctx.closeMcq();
    } else {
      setLocalMcqOpen(false);
    }
  };

  return (
    <div className="role-activity min-w-0 space-y-6">
      <section aria-label="Interactive evidence" className="role-enter min-w-0 rounded-[26px] bg-slate-100/80 p-2 dark:bg-slate-900/70">
        <header className="flex flex-col gap-3 px-3 pb-3.5 pt-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">01 · Explore the evidence</p>
            <h2 className="text-xl font-semibold leading-snug text-slate-900 text-balance dark:text-slate-100">{exercise.title}</h2>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 role-panel dark:bg-slate-950 dark:text-slate-300">
              <span aria-hidden="true" className="role-live-dot relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Interactive sample
            </span>
            {toolbar && <div className="role-toolbar flex flex-wrap items-center gap-2">{toolbar}</div>}
          </div>
        </header>
        <div className="role-stage min-w-0 space-y-2">{children}</div>
      </section>

      {!isMcqOpen ? (
        <KnowledgeCheckPromptCard
          questionCount={totalQuestions}
          buttonLabel="Start Activity"
          onStart={handleOpenMcq}
        />
      ) : (
        <section
          ref={sectionRef}
          id="knowledgeCheckSection"
          aria-label="Knowledge Check Activity"
          className="role-fade-in space-y-4 rounded-3xl border border-stone-200 bg-stone-50/70 p-4 dark:border-stone-800 dark:bg-stone-900/70 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="block font-mono text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Interactive Check
              </span>
              <h2 className="role-editorial-serif mt-1 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
                Knowledge Check
              </h2>
            </div>
            <button
              type="button"
              onClick={handleCloseMcq}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 cursor-pointer"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Hide Activity</span>
            </button>
          </div>
          <CandidateAssessmentWidget
            key={exercise.id || exercise.question}
            exercise={exercise}
            onComplete={onComplete}
          />
        </section>
      )}
    </div>
  );
}
