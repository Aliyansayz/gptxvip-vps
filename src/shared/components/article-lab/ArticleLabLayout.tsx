import React from 'react';
import { BookOpen, Sparkles, Briefcase } from 'lucide-react';
import { cn } from '../article/cn';
import { TheoryPanel } from '../article/TheoryPanel';
import { ConceptSection } from './ConceptSection';
import type { ArticleBlocks } from './conceptText';

interface ArticleLabLayoutProps {
  blocks: ArticleBlocks;
  roleDomain: string;
  roleShortTitle: string;
  chapterTitle: string;
  chapterDay: number;
  theme: {
    bgSoft: string;
    borderSoft: string;
    text: string;
    gradientFrom: string;
    gradientTo: string;
  };
  onBack: () => void;
  onSaveTheory?: () => void;
  isTheorySaved?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const domainIconMap: Record<string, React.ReactNode> = {
  seo: <Sparkles className="h-5 w-5" />,
  accountant: <Briefcase className="h-5 w-5" />,
  commerce: <Sparkles className="h-5 w-5" />,
  recommendation: <Sparkles className="h-5 w-5" />,
  preprocessing: <Sparkles className="h-5 w-5" />,
  visualization: <Sparkles className="h-5 w-5" />,
  mobility: <Sparkles className="h-5 w-5" />,
  retail: <Sparkles className="h-5 w-5" />,
  procurement: <Sparkles className="h-5 w-5" />,
  contracts: <Sparkles className="h-5 w-5" />,
};

const domainLabelMap: Record<string, string> = {
  seo: 'SEO',
  accountant: 'Accounting',
  commerce: 'Commerce',
  recommendation: 'Recommendations',
  preprocessing: 'Preprocessing',
  visualization: 'Visualization',
  mobility: 'Mobility',
  retail: 'Retail',
  procurement: 'Procurement',
  contracts: 'Contracts',
};

export const ArticleLabLayout: React.FC<ArticleLabLayoutProps> = ({
  blocks,
  roleDomain,
  roleShortTitle,
  chapterTitle,
  chapterDay,
  theme,
  onBack,
  onSaveTheory,
  isTheorySaved,
  className,
  children,
}) => {
  const DomainIcon = domainIconMap[roleDomain] || <BookOpen className="h-5 w-5" />;
  const domainLabel = domainLabelMap[roleDomain] || roleDomain;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Header / Icon Band */}
      <header className="shrink-0 rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Agentic Role cases"
              className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-800 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 sm:px-4"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Cases</span>
            </button>
            <div className="min-w-0">
              <p className={`mb-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${theme.text}`}>
                <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${theme.bgSoft}`}>
                  {DomainIcon}
                </span>{' '}
                {roleShortTitle} · case {String(chapterDay).padStart(2, '0')}
              </p>
              <h1 className="break-words font-heading text-lg font-bold leading-tight text-slate-900 dark:text-white sm:text-3xl">
                {chapterTitle}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 text-xs font-bold ${theme.bgSoft} ${theme.text} ${theme.borderSoft}`}>
              {DomainIcon}
              {domainLabel}
            </span>
            {onSaveTheory && (
              <button
                type="button"
                onClick={onSaveTheory}
                aria-pressed={isTheorySaved}
                className={`flex min-h-10 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isTheorySaved
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {isTheorySaved ? (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                      <line x1="9" y1="9" x2="9.01" y2="9.01" />
                      <line x1="15" y1="9" x2="15.01" y2="9.01" />
                    </svg>
                    Save
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1440px] p-3 pb-8 sm:p-5 lg:p-7">
          {/* Progress bar */}
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo}`}
              style={{ width: '100%' }}
              role="progressbar"
              aria-valuenow={100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Article reading progress"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Prose Column */}
            <article className="min-w-0 space-y-6" aria-label="Article content">
              {/* Intro */}
              <section aria-labelledby="article-intro-heading">
                <h2 id="article-intro-heading" className="sr-only">
                  Introduction
                </h2>
                <div className="article-prose max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600 dark:text-slate-300">
                  {blocks.intro.content || 'Article content will appear here.'}
                </div>
              </section>

              {/* Callouts */}
              {blocks.callouts.length > 0 && (
                <div className="space-y-4" aria-label="Key insights">
                  {blocks.callouts.map((callout, index) => (
                    <div
                      key={callout.type}
                      className={cn('rounded-xl p-4', {
                        'bg-slate-50 dark:bg-slate-950': callout.type === 'analogy',
                        [theme.bgSoft]: callout.type === 'takeaway',
                        'bg-white/5 dark:bg-white/5 border border-white/10': callout.type === 'caseStudy',
                      })}
                    >
                      <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {callout.label}
                      </p>
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{callout.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Concepts Sections */}
              {blocks.sections.length > 0 && (
                <section aria-labelledby="concepts-heading" className="border-t border-slate-100 pt-6 dark:border-slate-800">
                  <h2 id="concepts-heading" className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key concepts
                  </h2>
                  <div className="mt-4 space-y-4">
                    {blocks.sections.map((section) => (
                      <ConceptSection key={section.number} section={section} theme={theme} />
                    ))}
                  </div>
                </section>
              )}
            </article>

            {/* Sidebar - Table of Contents / Quick Actions */}
            <aside className="h-fit min-w-0 space-y-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24" aria-label="Article navigation">
              <nav aria-label="Article sections">
                <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  In this article
                </h2>
                <ol className="space-y-2">
                  <li>
                    <a
                      href="#article-intro-heading"
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <BookOpen className="h-4 w-4" />
                      Introduction
                    </a>
                  </li>
                  {blocks.callouts.map((callout) => (
                    <li key={callout.type}>
                      <a
                        href={`#callout-${callout.type}`}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Sparkles className="h-4 w-4" />
                        {callout.label}
                      </a>
                    </li>
                  ))}
                  {blocks.sections.length > 0 && (
                    <li>
                      <a
                        href="#concepts-heading"
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Briefcase className="h-4 w-4" />
                        Key concepts ({blocks.sections.length})
                      </a>
                    </li>
                  )}
                </ol>
              </nav>

              {onSaveTheory && (
                <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onSaveTheory}
                    aria-pressed={isTheorySaved}
                    className={`w-full flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isTheorySaved
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isTheorySaved ? (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Saved to Study Notebook
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" y1="9" x2="9.01" y2="9.01" />
                          <line x1="15" y1="9" x2="15.01" y2="9.01" />
                        </svg>
                        Save to Study Notebook
                      </>
                    )}
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>

        {children && (
          <div className="mx-auto w-full max-w-[1440px] px-3 pb-8 sm:px-5 lg:px-7">
            {children}
          </div>
        )}

      </main>
    </div>
  );
};