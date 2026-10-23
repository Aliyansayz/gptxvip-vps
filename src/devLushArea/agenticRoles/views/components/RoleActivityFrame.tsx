import React from 'react';
import { AgenticRoleExercise } from '../../agenticRoleTypes';
import CandidateAssessmentWidget from './CandidateAssessmentWidget';

interface RoleActivityFrameProps {
  exercise: AgenticRoleExercise;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  onComplete?: () => void;
}

/** The demonstration → controls → decision sequence used by every role case. */
export default function RoleActivityFrame({ exercise, toolbar, children, onComplete }: RoleActivityFrameProps) {
  if (!exercise) return <p role="status">There are no decisions in this case yet.</p>;
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
      <CandidateAssessmentWidget key={exercise.id || exercise.question} exercise={exercise} onComplete={onComplete} />
    </div>
  );
}
