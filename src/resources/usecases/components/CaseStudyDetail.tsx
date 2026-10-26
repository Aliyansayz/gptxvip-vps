import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  MapPin,
  MonitorPlay,
  FileCode2,
} from 'lucide-react';
import { CaseStudy } from '../types';
import { ContactForm } from '../../../shared/components/ContactForm';
import { CASE_STUDIES } from '../data/caseStudiesData';
import { VireonThreatCenterBento } from './vireon/VireonThreatCenterBento';
import { InvestmentBentoGrid } from './investment/InvestmentBentoGrid';
import { ComplianceLegalBento } from './compliance/ComplianceLegalBento';

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
    document.title = `${caseStudy.client} Use Case — GPTX.VIP`;
    return () => {
      document.title = prevTitle;
    };
  }, [caseStudy.slug, caseStudy.client]);

  const relatedStudies = CASE_STUDIES.filter((item) =>
    caseStudy.relatedSlugs.includes(item.slug)
  ).slice(0, 2);

  const isVireon = caseStudy.slug === 'vireon-threat-center' || caseStudy.slug === 'vireon';
  const isInvestment =
    caseStudy.slug === 'real-estate-investment-platform' ||
    caseStudy.slug === 'investment-platform-tokenized-real-estate' ||
    caseStudy.slug === 'investment-platform';
  const isCompliance =
    caseStudy.slug === 'compliance-legal-agent' ||
    caseStudy.slug === 'compliance' ||
    caseStudy.slug === 'legal';

  const hasInteractiveWidget = isVireon || isInvestment || isCompliance;

  return (
    <div
      className="bg-white min-h-screen text-[#101014]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Boulevard Royal Cobalt Hero (.top) */}
      <section
        className="relative overflow-hidden text-white pt-8 pb-10 px-4 sm:px-8"
        style={{
          background:
            'radial-gradient(ellipse at 78% 25%, #6f78ff 0, transparent 38%), radial-gradient(ellipse at 63% 76%, #1528b7 0, transparent 42%), linear-gradient(115deg, #11121c 5%, #272bc3 58%, #7f8cff 100%)',
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Top Breadcrumb & Back */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center justify-between gap-3"
          >
            <button
              onClick={onBack}
              className="group inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-xs transition hover:bg-white/20 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#d8ff38]" />
              Back to All Use Cases
            </button>

            <div className="flex items-center gap-2 text-xs text-white/75">
              <span>Use Cases</span>
              <span>/</span>
              <span className="font-semibold text-[#d8ff38] truncate max-w-[240px]">
                {caseStudy.client}
              </span>
            </div>
          </nav>

          {/* Badges & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#d8ff38] px-3 py-1 text-xs font-bold text-[#101014]">
                {caseStudy.industry}
              </span>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {caseStudy.service}
              </span>
              <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs text-white/85 font-mono">
                {caseStudy.clientProfile.timeframe}
              </span>
            </div>

            {hasInteractiveWidget && (
              <div role="tablist" aria-label="View format" className="flex items-center rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-xs">
                <button
                  role="tab"
                  id="tab-interactive"
                  aria-selected={activeTab === 'interactive'}
                  onClick={() => setActiveTab('interactive')}
                  className={`inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff38] cursor-pointer ${
                    activeTab === 'interactive'
                      ? 'bg-[#d8ff38] text-[#101014] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <MonitorPlay className="h-4 w-4" />
                  Interactive Workspace
                </button>
                <button
                  role="tab"
                  id="tab-blueprint"
                  aria-selected={activeTab === 'blueprint'}
                  onClick={() => setActiveTab('blueprint')}
                  className={`inline-flex min-h-[44px] items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff38] cursor-pointer ${
                    activeTab === 'blueprint'
                      ? 'bg-[#d8ff38] text-[#101014] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <FileCode2 className="h-4 w-4" />
                  How It Works
                </button>
              </div>
            )}
          </div>

          {/* Headline & Plain-English Tagline */}
          <h1
            className="max-w-4xl text-2xl sm:text-4xl lg:text-5xl font-normal leading-[1.04] tracking-[-0.05em] text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {caseStudy.title}
          </h1>

          <p className="mt-4 max-w-3xl text-sm sm:text-lg text-white/85 leading-relaxed">
            {caseStudy.tagline}
          </p>

          {/* Client Profile Strip */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/15 bg-black/25 p-4 backdrop-blur-md sm:grid-cols-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Organization
              </span>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-[#d8ff38] shrink-0" />
                <span className="truncate">{caseStudy.client}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Locations
              </span>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#d8ff38] shrink-0" />
                <span className="truncate">{caseStudy.clientProfile.location}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Team Scale
              </span>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-[#d8ff38] shrink-0" />
                <span className="truncate">{caseStudy.clientProfile.companySize}</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                Time to Launch
              </span>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-[#d8ff38] shrink-0" />
                <span className="truncate">{caseStudy.clientProfile.timeframe}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
        {/* Boulevard 4-Column Stats Ribbon */}
        <section className="mb-12 rounded-2xl border border-[#e9e9ec] bg-[#f5f5f7] p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#343edb]">
              Key Business Results at a Glance
            </span>
            <span className="text-xs text-[#777780] font-medium">
              Verified Production Outcomes
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {caseStudy.heroStats.map((stat, idx) => (
              <div
                key={idx}
                className="border-l border-[#e9e9ec] pl-4 first:border-l-0 first:pl-0"
              >
                <strong
                  className="block text-3xl sm:text-4xl font-medium tracking-[-0.06em] text-[#343edb]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.value}
                </strong>
                <p className="mt-1 text-xs sm:text-sm font-bold text-[#101014]">
                  {stat.label}
                </p>
                {stat.detail && (
                  <p className="mt-0.5 text-xs text-[#777780] leading-normal">
                    {stat.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Subwidget Showcase (Preserved intact!) */}
        {activeTab === 'interactive' && hasInteractiveWidget ? (
          <section className="mb-14">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#343edb] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#101014]">
                  Live Interactive Workspace — Click Elements Below to Explore
                </span>
              </div>
              <span className="text-xs text-[#777780]">
                Interactive Prototype • Real-Time Controls
              </span>
            </div>

            {isVireon && <VireonThreatCenterBento />}
            {isInvestment && <InvestmentBentoGrid />}
            {isCompliance && <ComplianceLegalBento />}
          </section>
        ) : null}

        {/* Plain-English Story Grid: Before vs After & Boulevard Numbered Steps */}
        <div className="grid gap-10 lg:grid-cols-12 mb-14">
          {/* Left 8 Columns */}
          <div className="lg:col-span-8 space-y-10">
            {/* The Everyday Business Problem */}
            <section className="rounded-2xl border border-[#e9e9ec] bg-white p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#343edb]">
                01 / THE EVERYDAY CHALLENGE
              </span>
              <h2
                className="mt-2 text-2xl sm:text-3xl font-medium tracking-[-0.045em] text-[#101014]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="hl-circle-sketch">{caseStudy.challenge.headline}</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#555560] leading-relaxed">
                {caseStudy.challenge.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {caseStudy.challenge.bulletPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-4 text-xs sm:text-sm text-[#101014]"
                  >
                    <span
                      className="font-bold text-[#343edb] shrink-0"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      0{index + 1}.
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works — Boulevard Service Row List (01. / 02. / 03.) */}
            <section className="rounded-2xl border border-[#e9e9ec] bg-white p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#343edb]">
                02 / HOW IT WORKS IN 3 SIMPLE STEPS
              </span>
              <h2
                className="mt-2 text-2xl sm:text-4xl font-medium leading-[1.2] tracking-[-0.06em] text-[#101014]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                <span className="hl-brutalist">{caseStudy.solution.headline}</span>
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#555560] leading-relaxed">
                {caseStudy.solution.description}
              </p>

              {/* Boulevard .service-row numbered list */}
              <div className="mt-8 border-t border-[#e9e9ec]">
                {caseStudy.solution.phases.map((phase, idx) => (
                  <div
                    key={idx}
                    className="grid gap-4 border-b border-[#e9e9ec] py-6 sm:grid-cols-12 items-start"
                  >
                    <div
                      className="sm:col-span-2 text-lg font-medium text-[#343edb]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {phase.phaseNumber}.
                    </div>
                    <div className="sm:col-span-4">
                      <h3
                        className="text-lg font-medium tracking-[-0.03em] text-[#101014]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {phase.title}
                      </h3>
                    </div>
                    <div className="sm:col-span-6 space-y-2">
                      <p className="text-xs sm:text-sm text-[#555560] leading-relaxed">
                        {phase.description}
                      </p>
                      <div className="inline-block rounded-full bg-[#f5f5f7] px-3 py-1 text-[11px] font-semibold text-[#101014] border border-[#e9e9ec]">
                        Result: {phase.deliverable}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Highlights */}
              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777780] mb-4">
                  What Your Team Gets Out of the Box
                </h4>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {caseStudy.solution.architecturalFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-4"
                    >
                      <h5
                        className="text-sm font-bold text-[#101014]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {feature.title}
                      </h5>
                      <p className="mt-1 text-xs text-[#555560] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Measurable Business Impact */}
            <section className="rounded-2xl border border-[#e9e9ec] bg-white p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-widest text-[#343edb]">
                03 / MEASURABLE OUTCOMES
              </span>
              <h2
                className="mt-2 text-2xl sm:text-3xl font-medium tracking-[-0.045em] text-[#101014]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="hl-circle-sketch">{caseStudy.results.headline}</span>
              </h2>
              <p className="mt-2.5 text-sm sm:text-base text-[#555560] leading-relaxed">
                {caseStudy.results.description}
              </p>

              <div className="mt-6 space-y-2.5">
                {caseStudy.results.businessOutcomes.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl bg-[#f5f5f7] p-3.5 text-xs sm:text-sm text-[#101014]"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#343edb] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Boulevard Quote Grid Testimonial */}
            {caseStudy.testimonial && (
              <section className="grid gap-4 sm:grid-cols-12 rounded-2xl border border-[#e9e9ec] bg-[#f5f5f7] p-6">
                <div
                  className="sm:col-span-4 rounded-xl p-6 text-white flex flex-col justify-between"
                  style={{
                    background:
                      'radial-gradient(circle at 80% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
                  }}
                >
                  <span className="text-3xl leading-none text-[#d8ff38]">“</span>
                  <div>
                    <p
                      className="font-bold text-base text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {caseStudy.testimonial.author}
                    </p>
                    <p className="text-xs text-white/80 mt-0.5">
                      {caseStudy.testimonial.title}
                    </p>
                    <p className="text-[11px] text-[#d8ff38] font-semibold mt-1">
                      {caseStudy.testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-8 flex flex-col justify-between p-2 sm:p-4">
                  <p
                    className="text-lg sm:text-2xl font-normal leading-snug tracking-[-0.03em] text-[#101014]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    “{caseStudy.testimonial.quote}”
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[#e9e9ec] pt-3 text-xs text-[#777780]">
                    <span>Verified Client Feedback</span>
                    <span className="font-bold text-[#343edb]">★ 5.0 / 5.0 Impact Rating</span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right 4 Columns: Included Tools & Quick Contact */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-[#e9e9ec] bg-[#f5f5f7] p-6">
              <h3
                className="text-sm font-bold uppercase tracking-wider text-[#101014] mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                What’s Included Under the Hood
              </h3>
              <div className="space-y-4">
                {caseStudy.techStack.map((category, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <span className="text-xs font-bold text-[#343edb]">
                      {category.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {category.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-[#e9e9ec] bg-white px-3 py-1 text-xs font-medium text-[#101014]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#e9e9ec] bg-white p-6 shadow-xs">
              <h3
                className="text-lg font-medium text-[#101014] mb-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Want This Working for Your Team?
              </h3>
              <p className="text-xs text-[#666670] mb-4 leading-relaxed">
                Tell us what workflow you want to speed up. We’ll show you a tailored live demo in plain English.
              </p>
              <ContactForm
                variant="compact"
                tone="light"
                accent="warm"
                title="Book a 15-Minute Walkthrough"
                description="Friendly, no-jargon walkthrough with our product team."
                subject={`Walkthrough Request: ${caseStudy.client}`}
              />
            </div>
          </aside>
        </div>

        {/* Related Use Cases */}
        {relatedStudies.length > 0 && (
          <section className="border-t border-[#e9e9ec] pt-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-medium tracking-[-0.04em] text-[#101014]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Explore More Interactive Use Cases
                </h2>
                <p className="text-xs text-[#777780]">
                  Click any use case below to try its live interactive workspace.
                </p>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-bold text-[#343edb] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                View All Use Cases <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {relatedStudies.map((study) => (
                <div
                  key={study.id}
                  onClick={() => onSelectRelated(study.slug)}
                  className="group cursor-pointer rounded-2xl border border-[#e9e9ec] bg-[#f5f5f7] p-6 transition-all hover:border-[#343edb] hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-full bg-[#343edb] px-2.5 py-0.5 text-[10px] font-bold text-white">
                      {study.industry}
                    </span>
                    <span className="text-xs text-[#777780] font-medium">
                      {study.service}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-medium text-[#101014] group-hover:text-[#343edb] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {study.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#555560] line-clamp-2">
                    {study.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#101014]">
                    <span className="text-[#343edb]">
                      {study.heroStats[0]?.value} {study.heroStats[0]?.label}
                    </span>
                    <span className="inline-flex items-center gap-1 group-hover:text-[#343edb]">
                      Try Interactive Workspace <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CaseStudyDetail;
