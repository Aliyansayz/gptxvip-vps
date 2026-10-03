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
    <div className="role-activity min-w-0 space-y-8">
      <section aria-label="Interactive evidence" className="min-w-0 space-y-4">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">01 · Explore the evidence</p>
            <h2 className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100">{exercise.title}</h2>
          </div>
          {toolbar && <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end"><span className="text-xs text-slate-500 dark:text-slate-400">Interactive sample</span>{toolbar}</div>}
        </header>
        <div className="min-w-0 space-y-5">{children}</div>
      </section>
      <CandidateAssessmentWidget key={exercise.id || exercise.question} exercise={exercise} onComplete={onComplete} />
    </div>
  );
}
