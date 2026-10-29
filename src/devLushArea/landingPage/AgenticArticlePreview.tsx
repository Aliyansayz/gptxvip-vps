import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { getAgenticRoleIcon } from '../agenticRoles/views/components/roleIcons';
import { cn } from '../../shared/components/article/cn';

interface AgenticArticlePreviewProps {
  onOpenArticle: (roleId: string) => void;
  /** `warm` matches the landing page's orange-red accent ramp. Defaults to `cyan`. */
  accent?: 'cyan' | 'warm';
  className?: string;
}

export function AgenticArticlePreview({ onOpenArticle, accent = 'cyan', className = '' }: AgenticArticlePreviewProps) {
  const warm = accent === 'warm';
  const accentOnDark = warm ? 'text-[#d8ff38]' : 'text-cyan-300';
  const accentOnLight = warm ? 'text-[#343edb]' : 'text-cyan-700 dark:text-cyan-300';
  const accentRing = warm ? 'focus-visible:ring-[#343edb]' : 'focus-visible:ring-cyan-300';
  const accentCta = warm ? 'bg-[#d8ff38] text-[#101014] hover:bg-[#c6f028]' : 'bg-cyan-300 hover:bg-cyan-200 text-slate-950';
  const accentGlow = warm ? 'rgba(52,62,219,0.25)' : 'rgba(34,211,238,0.15)';
  const accentRail = warm ? 'border-[#343edb] bg-[#343edb]/20' : 'border-cyan-400/50 bg-cyan-300/10';
  const accentRailIcon = warm ? 'bg-[#d8ff38] text-[#101014]' : 'bg-cyan-300 text-slate-950';

  return (
    <section aria-labelledby="agentic-article-preview-heading" className={`border-b border-ink/10 bg-white/65 py-16 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 max-w-2xl sm:mb-10">
          <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#343edb] mb-2">
            03 / DEEP TECHNICAL READING
          </span>
          <h2 id="agentic-article-preview-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 font-display">
            Prefer reading? Get the short article + quiz version.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
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
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar lg:flex-col lg:overflow-visible lg:pb-0">
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

            <div className="min-w-0 p-4 sm:p-6 lg:p-7">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                <span className={accentOnDark}>Reading mode</span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-slate-300">
                  {agenticRoleDefinitions.reduce((total, role) => total + role.chapters.length, 0)} articles
                </span>
              </div>
              <div aria-live="polite" aria-atomic="true">
                <h3 className="mt-4 max-w-xl text-xl sm:text-2xl font-medium tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Read the article, take the quiz
                </h3>
                <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
                  Each chapter becomes a short, illustrated article with key concepts and a multiple-choice quiz.
                  Your progress is saved automatically.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Concise prose', 'Theory content rewritten for quick reading'],
                    ['Key concepts', 'Numbered sections with definitions & examples'],
                    ['Quiz bank', 'MCQ questions with per-distractor feedback'],
                  ].map(([label, body]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                      <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accentOnDark}`}>{label}</p>
                      <p className="mt-1.5 text-xs leading-5 text-slate-200">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-start gap-2.5 border-t border-white/10 pt-4 text-xs text-slate-300">
                  <Sparkles aria-hidden="true" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accentOnDark}`} />
                  <span>
                    Try it: <strong className="font-semibold text-white">Append <code className="text-[#d8ff38]">?mode=read</code> to any case URL</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenArticle(agenticRoleDefinitions[0]?.id || '')}
                className={`mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-[30px] px-4 py-2 text-xs font-bold transition-[background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${accentRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] motion-reduce:transform-none ${accentCta}`}
              >
                Try first article <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}