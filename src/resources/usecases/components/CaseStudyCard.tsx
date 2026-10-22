import React from 'react';
import { ArrowRight, Building2, MapPin, Sparkles, MonitorPlay } from 'lucide-react';
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
  const isInteractiveBento =
    caseStudy.slug === 'vireon-threat-center' ||
    caseStudy.slug === 'real-estate-investment-platform';

  return (
    <article
      onClick={() => onSelect(caseStudy.slug)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl ${
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

      {/* Content body in Light Theme */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          {/* Tag row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {caseStudy.industry}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200/60">
              <Sparkles className="h-3 w-3 text-teal-600" />
              {caseStudy.service}
            </span>
            {isInteractiveBento && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-bold text-sky-800 border border-sky-200/80">
                <MonitorPlay className="h-3 w-3 text-sky-600" />
                Live Bento Prototype
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-950 transition-colors group-hover:text-[#0D9488] line-clamp-2">
            {caseStudy.title}
          </h3>

          {/* Client info */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              {caseStudy.client}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              {caseStudy.clientProfile.location}
            </span>
          </div>

          {/* Summary */}
          <p className="mt-3 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {caseStudy.summary}
          </p>

          {/* Primary Metric Pill */}
          {primaryMetric && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-50/70 px-3 py-1.5">
              <span className="text-base font-extrabold tracking-tight text-emerald-700">
                {primaryMetric.value}
              </span>
              <span className="text-xs text-emerald-800/80 font-medium">
                {primaryMetric.label}
              </span>
            </div>
          )}
        </div>

        {/* Footer / Tech stack & CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {caseStudy.techStack[0]?.tools.slice(0, 3).map((tool) => (
              <span
                key={tool}
                className="rounded-md bg-slate-50 border border-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600"
              >
                {tool}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors">
            {isInteractiveBento ? 'Launch Interactive Showcase' : 'Read Case Study'}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
