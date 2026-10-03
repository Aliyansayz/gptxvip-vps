import React from 'react';
import { ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import { AgenticRoleDefinition, AgenticRoleChapter } from '../agenticRoleTypes';
import { getRoleTheme } from '../agenticThemeHelpers';
import RoadmapMilestoneCard from './components/RoadmapMilestoneCard';
import { getAgenticRoleIcon } from './components/roleIcons';

interface AgenticRolesHubProps {
  role: AgenticRoleDefinition;
  onLaunchChapter: (chapter: AgenticRoleChapter) => void;
  completedChapterIds?: string[];
}

export default function AgenticRolesHub({ role, onLaunchChapter, completedChapterIds = [] }: AgenticRolesHubProps) {
  const theme = getRoleTheme(role.roleDomain);
  const RoleIcon = getAgenticRoleIcon(role.iconName);
  const completed = role.chapters.filter(chapter => completedChapterIds.includes(chapter.labComponentId)).length;
  const next = role.chapters.find(chapter => !completedChapterIds.includes(chapter.labComponentId)) || role.chapters[0];
  const minutes = role.chapters.reduce((total, chapter) => total + (chapter.estimatedMinutes || 25), 0);
  return (
    <div className="min-h-full bg-slate-50 px-4 py-7 dark:bg-black sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
          <div className="mb-5 flex items-center gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.bgSoft} ${theme.text}`}><RoleIcon className="h-6 w-6" /></span><p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Agentic Roles · Guided practice</p></div>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{role.title}</h1>
          <p className={`mt-4 text-lg font-medium leading-7 ${theme.text}`}>{role.tagline}</p>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">{role.longDescription}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-2"><Layers className="h-4 w-4" />{role.chapters.length} cases</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" />{minutes} min of practice</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" />{role.careerLevel}</span>
          </div>
          {next && <button type="button" onClick={() => onLaunchChapter(next)} className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">{completed === 0 ? 'Start learning' : completed === role.chapters.length ? 'Review first case' : 'Continue learning'}<ArrowRight className="h-4 w-4" /></button>}
        </header>
        <section aria-labelledby="role-capabilities" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <h2 id="role-capabilities" className="text-lg font-semibold">What you'll practice</h2>
          <div className="mt-4 flex flex-wrap gap-2">{role.requiredSkills.map(skill => <span key={skill} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{skill}</span>)}</div>
          <div className="mt-6 flex items-center justify-between gap-3 text-sm text-slate-600 dark:text-slate-400"><span>{completed} of {role.chapters.length} cases complete</span><span>{role.chapters.length ? Math.round(completed / role.chapters.length * 100) : 0}%</span></div>
          <div role="progressbar" aria-label={`${role.shortTitle} completion`} aria-valuemin={0} aria-valuemax={role.chapters.length} aria-valuenow={completed} className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${role.chapters.length ? completed / role.chapters.length * 100 : 0}%` }} /></div>
        </section>
        <section aria-labelledby="agentic-role-cases-heading">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Learning path</p>
          <h2 id="agentic-role-cases-heading" className="mt-2 text-2xl font-semibold">Explore, decide, understand</h2>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">Each case pairs an interactive example with a decision and reading notes.</p>
          <div className="mt-6 space-y-4">{role.chapters.map(chapter => <RoadmapMilestoneCard key={chapter.labComponentId} chapter={chapter} isCompleted={completedChapterIds.includes(chapter.labComponentId)} onLaunch={onLaunchChapter} />)}</div>
          {role.chapters.length === 0 && <p role="status" className="mt-6 text-slate-600 dark:text-slate-300">There are no cases in this role yet. Choose another role to keep learning.</p>}
        </section>
      </div>
    </div>
  );
}
