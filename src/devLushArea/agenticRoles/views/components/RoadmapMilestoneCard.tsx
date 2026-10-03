import React from 'react';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { AgenticRoleChapter } from '../../agenticRoleTypes';
import { getRoleTheme } from '../../agenticThemeHelpers';
import DifficultyBadge from './DifficultyBadge';

interface RoadmapMilestoneCardProps {
  chapter: AgenticRoleChapter;
  isCompleted?: boolean;
  onLaunch: (chapter: AgenticRoleChapter) => void;
}

export default function RoadmapMilestoneCard({ chapter, isCompleted = false, onLaunch }: RoadmapMilestoneCardProps) {
  const theme = getRoleTheme(chapter.roleDomain);
  const brief = chapter.interactive_questions[0]?.prompt || chapter.theory_content.practical_takeaway;
  return (
    <article className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600 sm:flex-row sm:gap-6 sm:p-7">
      <div aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-lg font-semibold ${theme.bgSoft} ${theme.text}`}>{String(chapter.day).padStart(2, '0')}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
          <span className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"><Clock className="h-4 w-4" />{chapter.estimatedMinutes || 25} min</span>
          {isCompleted && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400"><CheckCircle2 className="h-4 w-4" />Complete</span>}
        </div>
        <h3 className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-100">{chapter.chapter_title}</h3>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{brief}</p>
        {chapter.critical_concepts.length > 0 && <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400"><span className="font-medium text-slate-700 dark:text-slate-200">You'll explore: </span>{chapter.critical_concepts.slice(0, 2).map(c => c.concept).join(' · ')}</p>}
        <button type="button" onClick={() => onLaunch(chapter)} aria-label={`${isCompleted ? 'Review' : 'Open'} ${chapter.chapter_title}`} className={`mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${theme.borderSoft} ${theme.bgSoft} ${theme.text} hover:border-slate-400`}>
          {isCompleted ? 'Review case' : 'Open case'}<ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
