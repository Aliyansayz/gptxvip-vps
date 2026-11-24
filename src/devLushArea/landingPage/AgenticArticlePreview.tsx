import React from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { agenticRoleDefinitions } from '../agenticRoles/data';
import { getAgenticRoleIcon } from '../agenticRoles/views/components/roleIcons';
import { cn } from '../../shared/components/article/cn';

interface AgenticArticlePreviewProps {
  onOpenArticle: (roleId: string) => void;
  /** `warm` matches the landing page's orange-red accent ramp. `soc` matches the Vireon SOC teal + sky-blue landing palette. Defaults to `cyan`. */
  accent?: 'cyan' | 'warm' | 'soc';
  className?: string;
}

export function AgenticArticlePreview({ onOpenArticle, accent = 'cyan', className = '' }: AgenticArticlePreviewProps) {
  const warm = accent === 'warm';
  const soc = accent === 'soc';
  const accentOnDark = soc ? 'text-[#5EEAD4]' : warm ? 'text-[#d8ff38]' : 'text-cyan-300';
  const accentRing = soc ? 'focus-visible:ring-[#5EEAD4]' : warm ? 'focus-visible:ring-[#343edb]' : 'focus-visible:ring-cyan-300';
  const accentCta = soc
    ? 'bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E] hover:brightness-105'
    : warm
      ? 'bg-[#d8ff38] text-[#101014] hover:bg-[#c6f028]'
      : 'bg-cyan-300 hover:bg-cyan-200 text-slate-950';
  const accentGlow = soc ? 'rgba(14,165,233,0.22)' : warm ? 'rgba(52,62,219,0.28)' : 'rgba(34,211,238,0.15)';

  return (
    <section aria-labelledby="agentic-article-preview-heading" className={`border-b ${soc ? 'border-slate-200' : 'border-[#e9e9ec]'} bg-white py-10 sm:py-12 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className={`mb-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] ${soc ? 'bg-[#E0F2FE] text-[#0369A1]' : warm ? 'bg-[#343edb]/10 text-[#343edb]' : 'bg-cyan-50 text-cyan-700'}`}>
              03 / DEEP TECHNICAL READING
            </span>
            <h2
              id="agentic-article-preview-heading"
              className={`text-2xl sm:text-4xl font-medium tracking-[-0.04em] ${soc ? 'text-[#0F172A]' : 'text-[#101014]'}`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Prefer reading? Get the <span className={soc ? 'text-[#0284C7]' : warm ? 'text-[#343edb]' : ''}>short article + quiz</span> version.
            </h2>
          </div>
          <p className={`max-w-md text-sm leading-relaxed ${soc ? 'text-slate-600' : 'text-[#555560]'}`}>
            Every case has a concise article with key concepts, mental models, and a built-in quiz — read, highlight, and test yourself.
          </p>
        </div>

        <div
          className={`relative overflow-hidden rounded-[1.5rem] border ${soc ? 'border-slate-700/60 shadow-[0_20px_56px_rgba(11,19,30,0.2)]' : 'border-[#2a3166]/70 shadow-[0_20px_56px_rgba(17,18,28,0.18)]'} text-white`}
          style={{
            background: soc
              ? 'radial-gradient(ellipse at 12% 8%, rgba(45,212,191,0.22) 0, transparent 44%), linear-gradient(135deg, #070d17 0%, #0B131E 65%, #0d2b45 100%)'
              : warm
                ? 'radial-gradient(ellipse at 12% 8%, rgba(52,62,219,0.34) 0, transparent 44%), linear-gradient(135deg, #0b0e1a 0%, #101633 65%, #16205a 100%)'
                : '#0d1824',
          }}
        >
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,${accentGlow},transparent_42%),linear-gradient(to_right,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:auto,44px_44px]`} />
          
          <div className="relative border-b border-white/10 px-5 py-3.5 sm:px-6">
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

          <div className="relative grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(20rem,0.92fr)_minmax(0,1.08fr)]">
            <div className="border-b border-white/10 p-3 lg:border-b-0 lg:border-r lg:p-3.5" aria-label="Choose an Agentic Role article">
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar lg:grid lg:grid-cols-2 lg:gap-1.5 lg:overflow-visible lg:pb-0">
                {agenticRoleDefinitions.map((role, index) => {
                  const RoleIcon = getAgenticRoleIcon(role.iconName);
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => onOpenArticle(role.id)}
                      className={cn(
                        'group flex min-h-11 min-w-[11rem] items-center gap-2.5 rounded-xl border px-2.5 py-1.5 text-left transition-[background-color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2',
                        accentRing,
                        'focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] lg:min-w-0',
                        soc
                          ? 'border-transparent text-slate-300 hover:border-[#2DD4BF]/45 hover:bg-white/5 hover:text-white'
                          : 'border-transparent text-slate-300 hover:border-[#d8ff38]/40 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-slate-200 transition-colors',
                          soc
                            ? 'group-hover:bg-gradient-to-br group-hover:from-[#5EEAD4] group-hover:to-[#38BDF8] group-hover:text-[#0B131E]'
                            : 'group-hover:bg-[#d8ff38] group-hover:text-[#101014]'
                        )}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          Role {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="block truncate text-xs font-semibold">{role.shortTitle}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between p-4 sm:p-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.14em]">
                  <span className={accentOnDark}>Reading mode</span>
                  <span className="rounded-full border border-white/15 px-3 py-0.5 text-slate-300">
                    {agenticRoleDefinitions.reduce((total, role) => total + role.chapters.length, 0)} articles
                  </span>
                </div>
                <div aria-live="polite" aria-atomic="true">
                  <h3 className="mt-3 max-w-xl text-xl sm:text-2xl font-medium tracking-tight text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Read the article, take the quiz
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-slate-300">
                    Each chapter becomes a short, illustrated article with key concepts and a button-gated MCQ quiz.
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                    {[
                      ['Concise prose', 'Theory content rewritten for quick reading'],
                      ['Key concepts', 'Numbered sections with definitions & examples'],
                      ['Quiz bank', 'MCQ questions with per-distractor feedback'],
                    ].map(([label, body]) => (
                      <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${accentOnDark}`}>{label}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-200">{body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-start gap-2.5 border-t border-white/10 pt-3 text-xs text-slate-300">
                    <Sparkles aria-hidden="true" className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accentOnDark}`} />
                    <span>
                      Try it: <strong className="font-semibold text-white">Append <code className={accentOnDark}>?mode=read</code> to any case URL</strong>
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenArticle(agenticRoleDefinitions[0]?.id || '')}
                className={`mt-4 inline-flex w-fit min-h-10 items-center justify-center gap-2 rounded-[30px] px-4 py-2 text-xs font-bold transition-[background-color,transform] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 ${accentRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1824] motion-reduce:transform-none ${accentCta}`}
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