import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { getAgenticRoleIcon } from '../agenticRoles/views/components/roleIcons';
import { cn } from '../../shared/components/article/cn';

interface AgenticArticlePreviewProps {
  onOpenArticle: (roleId: string) => void;
  /** `warm` matches the landing page's orange-red accent ramp. Defaults to `cyan`. */
  accent?: 'cyan' | 'warm';
}

export function AgenticArticlePreview({ onOpenArticle, accent = 'cyan' }: AgenticArticlePreviewProps) {
  const warm = accent === 'warm';
  const accentOnDark = warm ? 'text-accent-400' : 'text-cyan-300';
  const accentOnLight = warm ? 'text-accent-700 dark:text-accent-400' : 'text-cyan-700 dark:text-cyan-300';
  const accentRing = warm ? 'focus-visible:ring-accent-500' : 'focus-visible:ring-cyan-300';
  const accentCta = warm ? 'bg-accent-600 hover:bg-accent-700' : 'bg-cyan-300 hover:bg-cyan-200';
  const accentGlow = warm ? 'rgba(224,65,42,0.2)' : 'rgba(34,211,238,0.15)';
  const accentRail = warm ? 'border-accent-400/50 bg-accent-500/15' : 'border-cyan-400/50 bg-cyan-300/10';
  const accentRailIcon = warm ? 'bg-accent-500 text-white' : 'bg-cyan-300 text-slate-950';

  return (
    <section aria-labelledby="agentic-article-preview-heading" className="border-y border-zinc-200 bg-[#eef3f4] px-4 py-16 dark:border-zinc-800 dark:bg-[#0a1118] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <p className={`text-xs font-bold uppercase tracking-[0.18em] ${accentOnLight}`}>Agentic Roles · reading mode</p>
          <h2 id="agentic-article-preview-heading" className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            Prefer reading? Get the short article + quiz version.
          </h2>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Every case has a concise article with key concepts, mental models, and a built-in quiz.
            No simulation required — just read, learn, and test your understanding.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-700/80 bg-[#0d1824] text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,${accentGlow},transparent_38%),linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px]`} />
          
          <div className="relative border-b border-white/10 px-5 py-5 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] ${accentOnDark}`}>
                <BookOpen className="h-4 w-4" />
                Article + Quiz preview
              </span>
              <span className="text-xs font-medium text-slate-300">
                {agenticRoleDefinitions.length} roles · {agenticRoleDefinitions.reduce((total, role) => total + role.chapters.length, 0)} articles
              </span>
            </div>
          </div>

          <div className="relative grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(15rem,0.76fr)_minmax(0,1.24fr)]">
            <div className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r lg:p-4" aria-label="Choose an Agentic Role article">
              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {agenticRoleDefinitions.map((role, index) => {
                  const RoleIcon = getAgenticRoleIcon(role.iconName);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => onOpenArticle(role.id)}
                      className={cn(
                        'group flex min-h-14 min-w-[12rem] items-center gap-3 rounded-xl border px-3 py-2 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2',
                        accentRing,
                        'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] lg:min-w-0',
                        'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-200`}>
                        <RoleIcon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Role {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="block truncate text-sm font-semibold">{role.shortTitle}</span>
                      </span>
                      <ArrowRight aria-hidden="true" className={`hidden h-4 w-4 shrink-0 ${accentOnDark} lg:block`} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                <span className={accentOnDark}>Reading mode</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">
                  {agenticRoleDefinitions.reduce((total, role) => total + role.chapters.length, 0)} articles
                </span>
              </div>
              <div aria-live="polite" aria-atomic="true">
                <h3 className="mt-6 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Read the article, take the quiz
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                  Each chapter becomes a short, illustrated article with key concepts and a multiple-choice quiz.
                  Your progress is saved automatically.
                </p>
                <div className="mt-7 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Concise prose', 'Theory content rewritten for quick reading'],
                    ['Key concepts', 'Numbered sections with definitions & examples'],
                    ['Quiz bank', 'MCQ questions with per-distractor feedback'],
                  ].map(([label, body]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accentOnDark}`}>{label}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-sm text-slate-300">
                  <Sparkles aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${accentOnDark}`} />
                  <span>
                    Try it: <strong className="font-semibold text-white">Append <code className="text-cyan-300">?mode=read</code> to any case URL</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenArticle(agenticRoleDefinitions[0]?.id || '')}
                className={`mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-[background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${accentRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] motion-reduce:transform-none sm:w-auto ${warm ? `${accentCta} text-white` : `${accentCta} text-slate-950`}`}
              >
                Try first article <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}