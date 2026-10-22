import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  MapPin,
  Quote,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Cpu,
  MonitorPlay,
  FileCode2,
} from 'lucide-react';
import { CaseStudy } from '../types';
import { ContactForm } from '../../../shared/components/ContactForm';
import { CASE_STUDIES } from '../data/caseStudiesData';
import { VireonThreatCenterBento } from './vireon/VireonThreatCenterBento';
import { InvestmentBentoGrid } from './investment/InvestmentBentoGrid';

interface CaseStudyDetailProps {
  caseStudy: CaseStudy;
  onBack: () => void;
  onSelectRelated: (slug: string) => void;
}

export const CaseStudyDetail: React.FC<CaseStudyDetailProps> = ({
  caseStudy,
  onBack,
  onSelectRelated,
}) => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'blueprint'>('interactive');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const prevTitle = document.title;
    document.title = `${caseStudy.client} Case Study — GPTX.VIP Resources`;
    return () => {
      document.title = prevTitle;
    };
  }, [caseStudy.slug]);

  const relatedStudies = CASE_STUDIES.filter((item) =>
    caseStudy.relatedSlugs.includes(item.slug)
  ).slice(0, 2);

  const isVireon = caseStudy.slug === 'vireon-threat-center' || caseStudy.slug === 'vireon';
  const isInvestment =
    caseStudy.slug === 'real-estate-investment-platform' ||
    caseStudy.slug === 'investment-platform-tokenized-real-estate' ||
    caseStudy.slug === 'investment-platform';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 sm:py-10 bg-[#F8FAFC]/50 min-h-screen text-slate-900">
      {/* Back button & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-slate-500" />
          Back to Case Studies Directory
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Resources</span>
          <span>/</span>
          <span>Use Cases</span>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-[220px]">
            {caseStudy.client}
          </span>
        </div>
      </nav>

      {/* Hero Header in Clean Light Theme */}
      <header className="mb-8 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
              {caseStudy.industry}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              {caseStudy.service}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 font-mono">
              {caseStudy.clientProfile.timeframe}
            </span>
          </div>

          {/* Interactive vs Blueprint Switcher Tabs */}
          {(isVireon || isInvestment) && (
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('interactive')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'interactive'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MonitorPlay className="h-3.5 w-3.5 text-teal-600" />
                Live Bento Showcase
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'blueprint'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode2 className="h-3.5 w-3.5 text-slate-500" />
                Architecture Spec
              </button>
            </div>
          )}
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl leading-snug">
          {caseStudy.title}
        </h1>

        <p className="mt-3 text-base text-slate-600 leading-relaxed max-w-4xl">
          {caseStudy.tagline}
        </p>

        {/* Client Profile Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 sm:grid-cols-4">
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Client</span>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="truncate">{caseStudy.client}</span>
            </p>
          </div>
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Location</span>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="truncate">{caseStudy.clientProfile.location}</span>
            </p>
          </div>
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Scale</span>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="truncate">{caseStudy.clientProfile.companySize}</span>
            </p>
          </div>
          <div>
            <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Timeline</span>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="truncate">{caseStudy.clientProfile.timeframe}</span>
            </p>
          </div>
        </div>
      </header>

      {/* Key Metric Impact Bar in Clean Light Theme */}
      <section className="mb-10 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488]">
            Measurable Performance Breakthroughs
          </span>
          <span className="text-xs text-slate-400 font-medium">Audited Production Telemetry</span>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 pt-1">
          {caseStudy.heroStats.map((stat, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </span>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                ) : stat.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-teal-600" />
                ) : null}
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-700">{stat.label}</p>
              {stat.detail && (
                <p className="mt-0.5 text-xs text-slate-400 leading-normal">{stat.detail}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Render Subwidget or Blueprint based on active tab */}
      {activeTab === 'interactive' && (isVireon || isInvestment) ? (
        <section className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Interactive React Bento Grid
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Live Responsive Prototype • Full Control State
            </span>
          </div>

          {isVireon && <VireonThreatCenterBento />}
          {isInvestment && <InvestmentBentoGrid />}
        </section>
      ) : null}

      {/* Main Content Grid: Challenge & Architecture Blueprint */}
      <div className="grid gap-10 lg:grid-cols-12 mb-14">
        {/* Left Column: Challenge, Solution, Outcomes */}
        <div className="lg:col-span-8 space-y-10">
          {/* The Challenge */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 text-rose-600 mb-2">
              <ShieldAlert className="h-4 w-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">The Challenge</h2>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950">
              {caseStudy.challenge.headline}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {caseStudy.challenge.description}
            </p>

            <div className="mt-5 space-y-2.5">
              {caseStudy.challenge.bulletPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/40 p-3 text-xs sm:text-sm text-slate-700"
                >
                  <span className="flex-shrink-0 mt-1 h-2 w-2 rounded-full bg-rose-500" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* The Engineering Solution & Implementation Roadmap */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 text-[#0D9488] mb-2">
              <Cpu className="h-4 w-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">The Strategy & Execution</h2>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950">
              {caseStudy.solution.headline}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {caseStudy.solution.description}
            </p>

            {/* Phased Roadmap */}
            <div className="mt-7 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Implementation Roadmap
              </h4>
              <div className="space-y-3.5">
                {caseStudy.solution.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 before:absolute before:left-2 before:top-3 before:h-full before:w-0.5 before:bg-slate-200 last:before:hidden"
                  >
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-[#0D9488] bg-white" />
                    <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#0D9488]">
                          {phase.phaseNumber}: {phase.title}
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600">
                        {phase.description}
                      </p>
                      <div className="mt-2 text-xs font-medium text-slate-500">
                        <strong className="text-slate-800">Key Deliverable:</strong> {phase.deliverable}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className="mt-7 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Architectural Highlights
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseStudy.solution.architecturalFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-2xs"
                  >
                    <h5 className="text-xs font-bold text-slate-900">
                      {feature.title}
                    </h5>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Results & Business Outcomes */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Business Impact & ROI</h2>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-950">
              {caseStudy.results.headline}
            </h3>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {caseStudy.results.description}
            </p>

            <div className="mt-5 space-y-2">
              {caseStudy.results.businessOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Executive Testimonial Quote */}
          {caseStudy.testimonial && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-teal-50/40 p-7 shadow-sm">
              <Quote className="absolute right-5 top-5 h-12 w-12 text-slate-200 pointer-events-none" />
              <p className="text-base sm:text-lg italic text-slate-800 leading-relaxed font-serif">
                "{caseStudy.testimonial.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D9488] font-bold text-white text-sm shadow-xs">
                  {caseStudy.testimonial.author[0] || 'T'}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">{caseStudy.testimonial.author}</p>
                  <p className="text-xs text-slate-500">
                    {caseStudy.testimonial.title} · {caseStudy.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tech Stack & Lead Capture */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Tech Stack Matrix */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Technologies & Infrastructure
            </h3>
            <div className="space-y-4">
              {caseStudy.techStack.map((category, idx) => (
                <div key={idx} className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {category.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-slate-200/80 bg-[#F8FAFC] px-2 py-1 text-xs font-mono text-slate-700"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Lead Capture Form in Light Theme */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-950 mb-1">
              Have a Similar Architecture Need?
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-normal">
              Speak with our senior solutions architects to design a scoped migration or custom bento dashboard.
            </p>
            <ContactForm
              variant="compact"
              tone="light"
              accent="warm"
              title="Schedule a Discovery Consultation"
              description="Confidential architecture review with our principal systems engineers."
              subject={`Inquiry regarding ${caseStudy.client} Case Study`}
            />
          </div>
        </aside>
      </div>

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="border-t border-slate-200/80 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">
                Explore Other Case Studies
              </h2>
              <p className="text-xs text-slate-500">
                Discover related enterprise technical architectures and live bento showcases.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#0D9488] hover:text-[#0F766E] inline-flex items-center gap-1"
            >
              View Directory <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedStudies.map((study) => (
              <div
                key={study.id}
                onClick={() => onSelectRelated(study.slug)}
                className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                    {study.industry}
                  </span>
                  <span className="text-[11px] text-[#0D9488] font-medium">
                    {study.service}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#0D9488] transition-colors">
                  {study.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                  {study.summary}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span className="text-emerald-600">
                    {study.heroStats[0]?.value} {study.heroStats[0]?.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-slate-900">
                    Launch Interactive Showcase <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CaseStudyDetail;
