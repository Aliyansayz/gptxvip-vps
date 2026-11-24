import React, { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BarChart3, Bot, CheckCircle2 } from 'lucide-react';
import { templates, type Template } from '../../devLushArea/agentMarketplace/data/templates';
import { getPrototypeUrl } from '../../prototype/registry';
import { Reveal, RevealGroup, RevealItem } from '../../shared/components/Reveal';
import { SurfaceChartWidget } from './SurfaceChartWidget';

export interface ProjectSurfaceShowcaseProps {
  onRequestAdaptation: (surfaceName: string, note?: string) => void;
  onBrowseAll?: () => void;
}

type SurfaceFilter = 'featured' | 'analytics-finance' | 'ops-crm' | 'agents-markets' | 'all';

const FEATURED_SLUGS = [
  'pulse-analytics',
  'ledgerline',
  'fulfillr',
  'taxi-demand-eda-agent',
] as const;

const ANALYTICS_FINANCE_SLUGS = new Set([
  'pulse-analytics',
  'ledgerline',
  'saas-metrics-kit',
  'fundview',
  'insight-boards',
]);

const OPS_CRM_SLUGS = new Set([
  'fulfillr',
  'orbit-crm',
  'storefront-pro',
  'project-management',
  'clinicare',
]);

const AGENTS_MARKETS_SLUGS = new Set([
  'taxi-demand-eda-agent',
  'chainpulse',
  'adsphere',
  'hq-admin',
]);

const CATEGORY_BADGE_MAP: Record<string, string> = {
  Analytics: 'bg-[#E0F2FE] text-[#0369A1]',
  Finance: 'bg-[#CCFBF1] text-[#0F766E]',
  SaaS: 'bg-[#EDE9FE] text-[#6D28D9]',
  CRM: 'bg-sky-50 text-sky-700',
  Marketing: 'bg-purple-50 text-purple-700',
  'E-commerce': 'bg-emerald-50 text-emerald-700',
  Healthcare: 'bg-teal-50 text-teal-700',
  Crypto: 'bg-indigo-50 text-indigo-700',
  'Project Management': 'bg-cyan-50 text-cyan-800',
  'Agent And System': 'bg-gradient-to-r from-[#CCFBF1] to-[#E0F2FE] text-[#0F766E]',
};

export const ProjectSurfaceShowcase: React.FC<ProjectSurfaceShowcaseProps> = ({
  onRequestAdaptation,
  onBrowseAll = () => window.location.assign('/agents/templates'),
}) => {
  const [filter, setFilter] = useState<SurfaceFilter>('featured');

  const visibleTemplates = useMemo<Template[]>(() => {
    if (filter === 'analytics-finance') {
      return templates.filter((item) => ANALYTICS_FINANCE_SLUGS.has(item.slug));
    }
    if (filter === 'ops-crm') {
      return templates.filter((item) => OPS_CRM_SLUGS.has(item.slug));
    }
    if (filter === 'agents-markets') {
      return templates.filter((item) => AGENTS_MARKETS_SLUGS.has(item.slug));
    }
    if (filter === 'all') {
      return templates;
    }
    return FEATURED_SLUGS.flatMap((slug) => {
      const found = templates.find((item) => item.slug === slug);
      return found ? [found] : [];
    });
  }, [filter]);

  const filterOptions: Array<{ id: SurfaceFilter; label: string; count: number }> = [
    { id: 'featured', label: 'Systems & Agents Spotlight', count: FEATURED_SLUGS.length },
    { id: 'analytics-finance', label: 'Analytics & Finance', count: ANALYTICS_FINANCE_SLUGS.size },
    { id: 'ops-crm', label: 'Operations & CRM', count: OPS_CRM_SLUGS.size },
    { id: 'agents-markets', label: 'Agents, Markets & Admin', count: AGENTS_MARKETS_SLUGS.size },
    { id: 'all', label: 'All Widgets', count: templates.length },
  ];

  return (
    <section
      id="project-surfaces-showcase"
      className="border-b border-slate-200 bg-white py-14 sm:py-16"
      aria-labelledby="project-surfaces-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <div className="max-w-2xl">
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#CCFBF1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F766E]">
                <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
                01 / Surface Chart Widgets · Systems &amp; Agents
              </span>
              <h2
                id="project-surfaces-heading"
                className="text-2xl font-medium leading-[1.06] tracking-[-0.04em] text-[#0F172A] sm:text-4xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Live visual widgets from{' '}
                <span className="text-[#0D9488]">
                  real systems and agents.
                </span>
              </h2>
              <p className="mt-2.5 max-w-[56ch] text-base leading-relaxed text-slate-600">
                Interact directly with each surface’s live chart and telemetry widget instead of static screenshots — then open the system or request a custom build.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label="Filter project surface chart widgets"
            >
              {filterOptions.map((option) => {
                const selected = filter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setFilter(option.id)}
                    className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 ${
                      selected
                        ? 'border-transparent bg-gradient-to-r from-[#0D9488] to-[#0284C7] text-white shadow-xs'
                        : 'border-slate-200 bg-[#F8FAFC] text-slate-700 hover:border-[#2DD4BF] hover:text-[#0F172A]'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        selected ? 'text-[#CCFBF1]' : 'text-slate-400'
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <RevealGroup
          key={filter}
          className="mt-9 grid gap-6 md:grid-cols-2"
          stagger={0.06}
        >
          {visibleTemplates.map((template, index) => {
            const isAgentOrOps =
              template.category === 'Agent And System' || template.slug === 'fulfillr';
            const badgeStyle =
              CATEGORY_BADGE_MAP[template.category] || 'bg-slate-100 text-slate-700';

            return (
              <RevealItem key={template.id} index={index} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#38BDF8] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] motion-reduce:transform-none">
                  {/* Custom Interactive Visual Chart Widget */}
                  <SurfaceChartWidget prototype={template.prototype} />

                  {/* Details + Clear Primary/Secondary Actions (Hick's & Fitts's Law) */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}
                          >
                            {isAgentOrOps && <Bot className="h-3 w-3" aria-hidden="true" />}
                            {template.category}
                          </span>
                        </div>
                        <h3
                          className="text-lg font-medium tracking-[-0.025em] text-[#0F172A]"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {template.name}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {template.tagline}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 grid gap-2 border-t border-slate-200 pt-3.5 sm:grid-cols-2">
                      {template.features.slice(0, 4).map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-1.5 text-xs text-slate-600"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0D9488]"
                            aria-hidden="true"
                          />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                      <a
                        href={getPrototypeUrl(template.prototype)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-[#0F172A] transition-[border-color,color,transform] duration-150 ease-out hover:border-[#0284C7] hover:text-[#0284C7] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] focus-visible:ring-offset-2"
                      >
                        <span>Open Surface</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          onRequestAdaptation(
                            template.name,
                            `Interested in adapting the ${template.name} system (${template.category}) for our workflow: ${template.tagline}.`,
                          )
                        }
                        className="inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0D9488] to-[#0EA5E9] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-[filter,transform] duration-150 ease-out hover:brightness-110 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2"
                      >
                        <span>Adapt Surface</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>

        {/* Footer Action Strip */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center">
          <div className="max-w-[60ch] text-sm text-slate-600">
            <strong className="font-semibold text-[#0F172A]">
              {templates.length} working systems &amp; agent surfaces
            </strong>{' '}
            available to inspect side by side — clean React + TypeScript source included on custom engagements.
          </div>
          <button
            type="button"
            onClick={onBrowseAll}
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#0EA5E9]/40 bg-[#E0F2FE]/60 px-5 py-2.5 text-xs font-bold text-[#0369A1] transition-[background-color,border-color,color,transform] duration-150 ease-out hover:border-[#0284C7] hover:bg-[#0284C7] hover:text-white active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7]"
          >
            <span>Compare Surfaces</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProjectSurfaceShowcase;
