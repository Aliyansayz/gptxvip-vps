import React from 'react';
import { ArrowRight, CheckCircle2, Building2, MapPin, Sparkles } from 'lucide-react';
import { CaseStudy } from '../types';
import { CaseStudyGraphic } from './CaseStudyGraphic';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  onSelect: (slug: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  onSelect,
  viewMode = 'grid',
}) => {
  const isList = viewMode === 'list';
  const primaryMetric = caseStudy.heroStats[0];

  return (
    <article
      onClick={() => onSelect(caseStudy.slug)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-900/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-900/20 hover:shadow-xl dark:border-white/10 dark:bg-zinc-900/90 ${
        isList ? 'md:flex-row md:items-stretch' : ''
      }`}
    >
      {/* Visual illustration top / left */}
      <div className={isList ? 'md:w-5/12 lg:w-4/12 flex-shrink-0' : 'w-full'}>
        <CaseStudyGraphic
          type={caseStudy.abstractGraphicType}
          accentColor={caseStudy.accentColor}
          variant="card"
          className="h-48 md:h-full rounded-none border-0"
        />
      </div>

      {/* Content body */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Tag row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
              {caseStudy.industry}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
              <Sparkles className="h-3 w-3" />
              {caseStudy.service}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-950 transition-colors group-hover:text-cyan-700 dark:text-white dark:group-hover:text-cyan-400 line-clamp-2">
            {caseStudy.title}
          </h3>

          {/* Client info */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-zinc-300">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              {caseStudy.client}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {caseStudy.clientProfile.location}
            </span>
          </div>

          {/* Summary */}
          <p className="mt-3 text-sm text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {caseStudy.summary}
          </p>

          {/* Primary Metric Pill */}
          {primaryMetric && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-50/70 px-3 py-1.5 dark:bg-emerald-950/40">
              <span className="text-base font-extrabold tracking-tight text-emerald-700 dark:text-emerald-300">
                {primaryMetric.value}
              </span>
              <span className="text-xs text-emerald-800/80 dark:text-emerald-200/80 font-medium">
                {primaryMetric.label}
              </span>
            </div>
          )}
        </div>

        {/* Footer / Tech stack & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {caseStudy.techStack[0]?.tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="rounded bg-slate-50 px-2 py-0.5 text-[11px] font-mono text-slate-600 dark:bg-white/5 dark:text-zinc-400"
              >
                {tool}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-cyan-600 dark:text-zinc-200 dark:group-hover:text-cyan-400 transition-colors">
            Read Case Study
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
