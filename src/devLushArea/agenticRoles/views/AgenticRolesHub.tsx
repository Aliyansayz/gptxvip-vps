import React from 'react';
import { Award, Clock, Layers, Play, Sparkles } from 'lucide-react';
import { AgenticRoleDefinition, AgenticRoleChapter } from '../agenticRoleTypes';
import { getRoleTheme } from '../agenticThemeHelpers';
import RoadmapMilestoneCard from './components/RoadmapMilestoneCard';
import { getAgenticRoleIcon } from './components/roleIcons';

interface AgenticRolesHubProps {
  role: AgenticRoleDefinition;
  onLaunchChapter: (chapter: AgenticRoleChapter) => void;
  completedChapterIds?: string[];
}

export const AgenticRolesHub: React.FC<AgenticRolesHubProps> = ({
  role,
  onLaunchChapter,
  completedChapterIds = [],
}) => {
  const theme = getRoleTheme(role.roleDomain);
  const RoleIcon = getAgenticRoleIcon(role.iconName);
  const totalEstimatedMinutes = role.chapters.reduce(
    (total, chapter) => total + (chapter.estimatedMinutes || 25),
    0,
  );
  const completedForRole = role.chapters.filter((chapter) =>
    completedChapterIds.includes(chapter.labComponentId),
  ).length;
  const firstChapter = role.chapters[0];

  return (
    <div className="h-fit min-w-0 w-full bg-slate-50 dark:bg-black">
      <div className="p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl">
          <header className="relative mb-6 min-w-0 overflow-hidden rounded-3xl bg-slate-900/5 p-4 dark:bg-slate-900/40 sm:mb-8 sm:p-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
              <div
                className="absolute -right-24 -top-36 h-96 w-96 rounded-full blur-3xl"
                style={{ backgroundColor: theme.accentHex, opacity: 0.32 }}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-[0.035]`}
              />
            </div>

            <div className="relative z-10 flex min-w-0 flex-col gap-4">
              <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div
                  className={`shrink-0 rounded-2xl border border-white/20 bg-gradient-to-br p-3 text-white shadow-xl sm:p-4 ${theme.gradientFrom} ${theme.gradientTo} ${theme.shadowMd}`}
                >
                  <RoleIcon className="h-6 w-6 sm:h-10 sm:w-10" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`mb-1 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] sm:text-xs ${theme.text}`}>
                    <Sparkles className="h-3.5 w-3.5" /> Agentic role · case-based learning
                  </p>
                  <h1 className="break-words font-heading text-2xl font-bold leading-tight tracking-wide text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} bg-[size:200%_auto] animate-gradient`}>
                      {role.title}
                    </span>
                  </h1>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-300 sm:text-base">
                    {role.tagline}
                  </p>
                </div>
              </div>

              <p className="relative z-10 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
                {role.longDescription}
              </p>

              <div className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200/70 pt-4 text-xs font-semibold text-slate-600 dark:border-slate-700/70 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <Layers className={`h-4 w-4 ${theme.text}`} />
                  {role.chapters.length} {role.chapters.length === 1 ? 'case' : 'cases'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className={`h-4 w-4 ${theme.text}`} />
                  About {Math.max(1, Math.round(totalEstimatedMinutes / 60))} hours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Award className={`h-4 w-4 ${theme.text}`} />
                  {completedForRole} of {role.chapters.length} complete
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                  {role.careerLevel}
                </span>
              </div>

              {role.requiredSkills.length > 0 && (
                <div className="relative z-10 flex flex-wrap gap-2" aria-label="Role capabilities">
                  {role.requiredSkills.slice(0, 5).map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative z-10 flex flex-col gap-3 sm:hidden">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {role.chapters.length} {role.chapters.length === 1 ? 'case' : 'cases'} in this role
                </p>
                {firstChapter && (
                  <button
                    type="button"
                    onClick={() => onLaunchChapter(firstChapter)}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 text-sm font-bold text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${theme.gradientFrom} ${theme.gradientTo}`}
                  >
                    <Play className="h-4 w-4 fill-current" /> Start first case
                  </button>
                )}
              </div>
            </div>
          </header>

          <section aria-labelledby="agentic-role-cases-heading">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-5">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Practice path</p>
                <h2 id="agentic-role-cases-heading" className="mt-1 font-heading text-xl font-bold tracking-wide text-slate-900 dark:text-white sm:text-2xl">
                  Work through the case files
                </h2>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">
                {role.chapters.length} {role.chapters.length === 1 ? 'case' : 'cases'}
              </span>
            </div>

            {role.chapters.length === 0 ? (
              <p role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                There are no case files in this role yet. Choose another role to keep learning.
              </p>
            ) : (
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                {role.chapters.map((chapter) => (
                  <RoadmapMilestoneCard
                    key={chapter.labComponentId}
                    chapter={chapter}
                    isCompleted={completedChapterIds.includes(chapter.labComponentId)}
                    onLaunch={onLaunchChapter}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AgenticRolesHub;
