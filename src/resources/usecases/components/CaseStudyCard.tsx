import React from 'react';
import { Building2, MapPin, MonitorPlay } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  index?: number;
  onSelect: (slug: string) => void;
  viewMode?: 'grid' | 'list';
}

export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  index = 0,
  onSelect,
  viewMode = 'grid',
}) => {
  const isList = viewMode === 'list';
  const primaryMetric = caseStudy.heroStats[0];

  // Match Boulevard .visual-one / .visual-two / .feature-blue artwork styles
  const visualStyle =
    index % 3 === 0
      ? {
          background:
            'radial-gradient(ellipse at 80% 110%, #4739ff, transparent 42%), linear-gradient(145deg, #030305, #15151b 65%, #30303a)',
        }
      : index % 3 === 1
      ? {
          background:
            'radial-gradient(circle at 80% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
        }
      : {
          background: 'linear-gradient(125deg, #14152a 0%, #343edb 52%, #aeb9ff 100%)',
        };

  return (
    <article
      onClick={() => onSelect(caseStudy.slug)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#e9e9ec] bg-white p-3 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#343edb] hover:shadow-xl ${
        isList ? 'md:flex-row md:items-stretch gap-5' : ''
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Boulevard Work Visual Cover */}
      <div
        className={`relative overflow-hidden rounded-lg p-6 text-white flex flex-col justify-between ${
          isList ? 'md:w-5/12 lg:w-4/12 min-h-[240px]' : 'h-64 w-full'
        }`}
        style={visualStyle}
      >
        {/* Top badges inside cover */}
        <div className="flex items-center justify-between gap-2 z-10">
          <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-xs">
            {caseStudy.industry}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#d8ff38] px-2.5 py-1 text-[10px] font-bold text-[#101014]">
            <MonitorPlay className="h-3 w-3" />
            Interactive
          </span>
        </div>

        {/* Center / Bottom Display Typography + Lime Arrow Button */}
        <div className="relative z-10 flex items-end justify-between gap-3">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
              {caseStudy.service}
            </span>
            <strong
              className="block text-2xl sm:text-3xl font-medium leading-[0.96] tracking-[-0.05em] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {caseStudy.slug === 'compliance-legal-agent'
                ? 'LexGuard Legal'
                : caseStudy.slug === 'vireon-threat-center'
                ? 'Vireon Security'
                : 'Property Invest'}
            </strong>
          </div>

          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d8ff38] text-sm font-bold text-[#101014] transition-transform duration-200 group-hover:scale-110">
            ↗
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between px-2 pt-4 pb-2">
        <div>
          <div className="flex items-center justify-between text-xs text-[#777780] mb-1.5">
            <span className="inline-flex items-center gap-1 font-medium text-[#101014]">
              <Building2 className="h-3.5 w-3.5 text-[#343edb]" />
              {caseStudy.client}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#777780]" />
              {caseStudy.clientProfile.timeframe}
            </span>
          </div>

          <h3
            className="text-lg font-medium leading-snug tracking-[-0.03em] text-[#101014] group-hover:text-[#343edb] transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {caseStudy.title}
          </h3>

          <p className="mt-2 text-xs text-[#666670] line-clamp-3 leading-relaxed">
            {caseStudy.summary}
          </p>
        </div>

        {/* Bottom Metric & Action */}
        <div className="mt-4 pt-3 border-t border-[#e9e9ec] flex items-center justify-between gap-2">
          {primaryMetric ? (
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-lg font-bold text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {primaryMetric.value}
              </span>
              <span className="text-[11px] font-medium text-[#555560]">
                {primaryMetric.label}
              </span>
            </div>
          ) : <div />}

          <span className="text-xs font-bold text-[#101014] group-hover:text-[#343edb] transition-colors">
            Open Use Case →
          </span>
        </div>
      </div>
    </article>
  );
};

export default CaseStudyCard;
