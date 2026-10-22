import React, { useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  Quote,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { CaseStudy } from '../types';
import { CaseStudyGraphic } from './CaseStudyGraphic';
import { ContactForm } from '../../../shared/components/ContactForm';
import { CASE_STUDIES } from '../data/caseStudiesData';

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

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
      {/* Back button & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to All Case Studies
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <span>Resources</span>
          <span>/</span>
          <span>Use Cases</span>
          <span>/</span>
          <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-[200px]">
            {caseStudy.client}
          </span>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-white/10 dark:text-zinc-200">
            {caseStudy.industry}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            {caseStudy.service}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-white/5 dark:text-zinc-400 font-mono">
            {caseStudy.clientProfile.timeframe} Rollout
          </span>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl leading-tight">
          {caseStudy.title}
        </h1>

        <p className="mt-4 text-lg text-slate-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
          {caseStudy.tagline}
        </p>

        {/* Client Profile Card */}
        <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-slate-900/10 bg-slate-50/80 p-5 dark:border-white/10 dark:bg-zinc-900/60 sm:grid-cols-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Client</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              {caseStudy.client}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Location</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-400" />
              {caseStudy.clientProfile.location}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Scale</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-slate-400" />
              {caseStudy.clientProfile.companySize}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Timeline</span>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              {caseStudy.clientProfile.timeframe}
            </p>
          </div>
        </div>

        {/* Visual Graphic Banner */}
        <div className="mt-8">
          <CaseStudyGraphic
            type={caseStudy.abstractGraphicType}
            accentColor={caseStudy.accentColor}
            variant="hero"
          />
        </div>
      </header>

      {/* Key Metric Impact Bar */}
      <section className="mb-14 rounded-2xl border border-slate-900/10 bg-slate-950 p-6 text-white shadow-xl dark:border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
            Measurable Performance Breakthroughs
          </span>
          <span className="text-xs text-slate-400">Audited Production Metrics</span>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10 pt-2">
          {caseStudy.heroStats.map((stat, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </span>
                {stat.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                ) : stat.trend === 'down' ? (
                  <TrendingDown className="h-5 w-5 text-cyan-400" />
                ) : null}
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-200">{stat.label}</p>
              {stat.detail && (
                <p className="mt-0.5 text-xs text-slate-400">{stat.detail}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid: Challenge & Solution */}
      <div className="grid gap-12 lg:grid-cols-12 mb-14">
        {/* Left Column: Deep Dive */}
        <div className="lg:col-span-8 space-y-12">
          {/* The Challenge */}
          <section className="rounded-2xl border border-slate-900/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-3">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider">The Challenge</h2>
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              {caseStudy.challenge.headline}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-zinc-300 leading-relaxed">
              {caseStudy.challenge.description}
            </p>

            <div className="mt-6 space-y-3">
              {caseStudy.challenge.bulletPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 text-sm text-slate-700 dark:border-rose-950/40 dark:bg-rose-950/20 dark:text-zinc-300"
                >
                  <span className="flex-shrink-0 mt-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </section>

          {/* The Engineering Solution & Phases */}
          <section className="rounded-2xl border border-slate-900/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-3">
              <Cpu className="h-5 w-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider">The Strategy & Execution</h2>
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              {caseStudy.solution.headline}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-zinc-300 leading-relaxed">
              {caseStudy.solution.description}
            </p>

            {/* Phased Roadmap */}
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Implementation Phases
              </h4>
              <div className="space-y-4">
                {caseStudy.solution.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 before:absolute before:left-2 before:top-3 before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-zinc-800 last:before:hidden"
                  >
                    <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-cyan-500 bg-white dark:bg-zinc-900" />
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/5 dark:bg-white/5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-cyan-700 dark:text-cyan-400">
                          {phase.phaseNumber}: {phase.title}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600 dark:text-zinc-300">
                        {phase.description}
                      </p>
                      <div className="mt-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
                        <strong className="text-slate-700 dark:text-zinc-200">Key Deliverable:</strong> {phase.deliverable}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className="mt-8 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Core Architectural Highlights
              </h4>
              <div className="grid gap-3 sm:grid-cols-3">
                {caseStudy.solution.architecturalFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-zinc-800/60"
                  >
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {feature.title}
                    </h5>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-zinc-300 leading-normal">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Results & Business Outcomes */}
          <section className="rounded-2xl border border-slate-900/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
              <CheckCircle2 className="h-5 w-5" />
              <h2 className="text-xs font-bold uppercase tracking-wider">Business Impact & ROI</h2>
            </div>
            <h3 className="text-xl font-bold text-slate-950 dark:text-white">
              {caseStudy.results.headline}
            </h3>
            <p className="mt-3 text-slate-600 dark:text-zinc-300 leading-relaxed">
              {caseStudy.results.description}
            </p>

            <div className="mt-6 space-y-2.5">
              {caseStudy.results.businessOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-zinc-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Executive Testimonial Quote */}
          {caseStudy.testimonial && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-900/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-white shadow-xl">
              <Quote className="absolute right-6 top-6 h-16 w-16 text-white/5 pointer-events-none" />
              <p className="text-lg italic text-slate-200 leading-relaxed font-serif">
                "{caseStudy.testimonial.quote}"
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-slate-950 text-sm">
                  {caseStudy.testimonial.author[0] || 'C'}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{caseStudy.testimonial.author}</p>
                  <p className="text-xs text-slate-400">
                    {caseStudy.testimonial.title} · {caseStudy.testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Tech Stack & Lead Capture */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Tech Stack Matrix */}
          <div className="rounded-2xl border border-slate-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Technologies Deployed
            </h3>
            <div className="space-y-4">
              {caseStudy.techStack.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                    {category.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {category.tools.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-mono text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Lead Capture Form */}
          <div className="rounded-2xl border border-slate-900/10 bg-slate-50/90 p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900/90">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-1">
              Have a Similar Challenge?
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mb-4">
              Speak with our senior solutions architects to design a scoped migration or security roadmap.
            </p>
            <ContactForm
              variant="compact"
              tone="light"
              accent="warm"
              title="Schedule a Technical Discovery"
              description="Confidential architecture review with our lead engineers."
              subject={`Inquiry regarding ${caseStudy.client} Case Study`}
            />
          </div>
        </aside>
      </div>

      {/* Related Case Studies */}
      {relatedStudies.length > 0 && (
        <section className="border-t border-slate-200 pt-12 dark:border-white/10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                Related Success Stories
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                Explore similar enterprise transformations and architectural blueprints.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 inline-flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedStudies.map((study) => (
              <div
                key={study.id}
                onClick={() => onSelectRelated(study.slug)}
                className="group cursor-pointer rounded-2xl border border-slate-900/10 bg-white p-5 shadow-sm transition-all hover:border-slate-900/20 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-white/10 dark:text-zinc-300">
                    {study.industry}
                  </span>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                    {study.service}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-400 transition-colors">
                  {study.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-zinc-400 line-clamp-2">
                  {study.summary}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-zinc-200">
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {study.heroStats[0]?.value} {study.heroStats[0]?.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-slate-900 dark:text-zinc-400 dark:group-hover:text-white">
                    Read Story <ArrowRight className="h-3.5 w-3.5" />
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
