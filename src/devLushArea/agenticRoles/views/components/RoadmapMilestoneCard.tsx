import React, { useState } from 'react';
import { CheckCircle2, Clock, Play, Sparkles } from 'lucide-react';
import { AgenticRoleChapter } from '../../agenticRoleTypes';
import { getRoleTheme } from '../../agenticThemeHelpers';
import DifficultyBadge from './DifficultyBadge';

interface RoadmapMilestoneCardProps {
  chapter: AgenticRoleChapter;
  isCompleted?: boolean;
  onLaunch: (chapter: AgenticRoleChapter) => void;
}

export const RoadmapMilestoneCard: React.FC<RoadmapMilestoneCardProps> = ({
  chapter,
  isCompleted = false,
  onLaunch,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [spotlightVisible, setSpotlightVisible] = useState(false);
  const theme = getRoleTheme(chapter.roleDomain);
  const leadExercise = chapter.interactive_questions[0];
  const storyBrief = leadExercise?.prompt || chapter.theory_content?.practical_takeaway || chapter.chapter_title;
  const caseCount = chapter.interactive_questions.length;

  return (
    <article
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        setMousePosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      }}
      onMouseEnter={() => setSpotlightVisible(true)}
      onMouseLeave={() => setSpotlightVisible(false)}
      className="group relative min-w-0 overflow-hidden rounded-2xl bg-slate-200 p-[2px] shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-slate-800"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity: spotlightVisible ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${theme.spotlightRgb}, 0.8), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex h-full min-w-0 flex-col overflow-hidden rounded-[14px] bg-white p-4 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}>
              Case {String(chapter.day).padStart(2, '0')}
            </span>
            <DifficultyBadge difficulty={chapter.difficulty} size="sm" />
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Clock className="h-3.5 w-3.5" /> {chapter.estimatedMinutes || 25} min
          </span>
        </div>

        <div className="mt-4 min-w-0">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{chapter.course}</p>
          <h3 className={`break-words font-heading text-lg font-bold leading-6 tracking-wide text-slate-900 transition-colors dark:text-white sm:text-xl ${theme.groupHoverText}`}>
            {chapter.chapter_title || chapter.day_title}
          </h3>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/70">
          <p className={`mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider ${theme.text}`}>
            <Sparkles className="h-3 w-3" /> Case brief
          </p>
          <p className="line-clamp-3 text-sm leading-5 text-slate-600 dark:text-slate-300">
            {storyBrief}
          </p>
        </div>

        {chapter.critical_concepts.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {chapter.critical_concepts.slice(0, 3).map((concept) => (
              <span
                key={concept.concept}
                className={`max-w-full break-words rounded-md border px-2.5 py-1 text-[10px] font-semibold ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}
              >
                {concept.concept}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
            {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />}
            {isCompleted ? 'Completed' : `${caseCount} ${caseCount === 1 ? 'decision' : 'decisions'}`}
          </span>
          <button
            type="button"
            onClick={() => onLaunch(chapter)}
            aria-label={`${isCompleted ? 'Review' : 'Start'} case: ${chapter.chapter_title}`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 text-xs font-bold text-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${theme.gradientFrom} ${theme.gradientTo} ${theme.shadowMd}`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isCompleted ? 'Review case' : 'Start case'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default RoadmapMilestoneCard;
