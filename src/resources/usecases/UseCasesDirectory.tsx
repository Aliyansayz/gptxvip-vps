import React, { useState, useMemo } from 'react';
import { IndustryType, ServiceType } from './types';
import { CASE_STUDIES } from './data/caseStudiesData';
import { CaseStudyCard } from './components/CaseStudyCard';
import { UseCasesFilterBar } from './components/UseCasesFilterBar';
import { LeadGenerationSection } from './components/LeadGenerationSection';

interface UseCasesDirectoryProps {
  onSelectCaseStudy: (slug: string) => void;
}

export const UseCasesDirectory: React.FC<UseCasesDirectoryProps> = ({
  onSelectCaseStudy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType>('All');
  const [selectedService, setSelectedService] = useState<ServiceType>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCaseStudies = useMemo(() => {
    return CASE_STUDIES.filter((item) => {
      if (selectedIndustry !== 'All' && item.industry !== selectedIndustry) {
        return false;
      }
      if (selectedService !== 'All' && item.service !== selectedService) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inTitle = item.title.toLowerCase().includes(query);
        const inClient = item.client.toLowerCase().includes(query);
        const inSummary = item.summary.toLowerCase().includes(query);
        const inIndustry = item.industry.toLowerCase().includes(query);
        const inService = item.service.toLowerCase().includes(query);
        const inTech = item.techStack.some((cat) =>
          cat.tools.some((t) => t.toLowerCase().includes(query))
        );
        return inTitle || inClient || inSummary || inIndustry || inService || inTech;
      }
      return true;
    });
  }, [searchQuery, selectedIndustry, selectedService]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedService('All');
  };

  return (
    <div className="bg-white text-[#101014]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Boulevard Hero Section (.top) */}
      <section
        className="relative overflow-hidden text-white pt-10 pb-8 px-5 sm:px-10"
        style={{
          background:
            'radial-gradient(ellipse at 78% 25%, #6f78ff 0, transparent 38%), radial-gradient(ellipse at 63% 76%, #1528b7 0, transparent 42%), linear-gradient(115deg, #11121c 5%, #272bc3 58%, #7f8cff 100%)',
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/80">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-semibold tracking-wide text-white">
              <span className="h-2 w-2 rounded-full bg-[#d8ff38]" />
              Real Business Solutions • Live Interactive Demos
            </span>
            <span className="font-mono text-[11px] text-[#d8ff38]">
              03 LIVE USE CASES
            </span>
          </div>

          <div className="max-w-xl pt-4 pb-8">
            <h1
              className="text-3xl sm:text-5xl font-normal leading-[1.04] tracking-[-0.05em] text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              See How Teams Save Hours Every Week with <span className="hl-circle-sketch">Simple</span>, <span className="hl-brutalist">Smart AI Workspaces.</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed">
              Explore real-world examples: review contracts in under 4 minutes, protect company systems around the clock, and make property investing accessible starting at $50. All explained in plain business language with zero confusing jargon.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectCaseStudy('compliance-legal-agent')}
                className="inline-flex items-center gap-3.5 rounded-[30px] bg-[#d8ff38] px-4 py-2.5 text-xs font-bold text-[#101014] transition hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Try Contract Review Agent</span>
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#101014] text-[10px] text-white">
                  ↗
                </span>
              </button>
              <a
                href="#usecases-catalog"
                className="inline-flex items-center gap-2 rounded-[30px] border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <span>Explore All Use Cases</span>
                <span className="text-[#d8ff38]">↓</span>
              </a>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-white/75">Scroll to explore ↓</div>
          <div
            className="mt-2 select-none whitespace-nowrap font-medium leading-[0.92] tracking-[-0.095em] text-white"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(62px, 14vw, 162px)',
            }}
            aria-hidden="true"
          >
            Use Cases
          </div>
        </div>
      </section>

      {/* Main Editorial Container */}
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
        {/* Boulevard Intro Line & 3-Card Feature Grid */}
        <section className="mb-14">
          <div className="mb-7 flex items-start justify-between gap-6">
            <h2
              className="max-w-xl text-2xl sm:text-3xl font-medium leading-[1.15] tracking-[-0.055em] text-[#101014]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Built for real business teams — <span className="hl-circle-sketch">simple screens</span>, quick decisions, and <span className="hl-brutalist">measurable time saved</span> every day.
            </h2>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#101014] text-xs text-white">
              ✳
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Feature Blue */}
            <article
              onClick={() => onSelectCaseStudy('compliance-legal-agent')}
              className="flex min-h-[290px] cursor-pointer flex-col justify-between rounded-lg p-6 text-white transition hover:-translate-y-1"
              style={{
                background:
                  'radial-gradient(circle at 80% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl leading-none">✳</span>
                <span className="rounded-full bg-[#d8ff38] px-2.5 py-0.5 text-[10px] font-bold text-[#101014]">
                  NEW AGENT
                </span>
              </div>
              <div>
                <h3
                  className="mb-2 text-2xl font-medium leading-[1.04] tracking-[-0.06em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Contract &amp; Compliance Agent.
                </h3>
                <p className="text-xs leading-relaxed text-white/85">
                  Review agreements in 3.5 minutes, spot legal risks in plain English, and stay audit-ready for GDPR, SOC 2, and HIPAA automatically.
                </p>
              </div>
            </article>

            {/* Feature Black */}
            <article
              onClick={() => onSelectCaseStudy('vireon-threat-center')}
              className="flex min-h-[290px] cursor-pointer flex-col justify-between rounded-lg p-6 text-white transition hover:-translate-y-1"
              style={{
                background:
                  'radial-gradient(circle at 60% 35%, rgba(255,255,255,.16), transparent 36%), linear-gradient(140deg, #222, #050506)',
              }}
            >
              <div className="text-[11px] text-white/65">24/7 Security Command</div>
              <div>
                <h3
                  className="mb-2 text-2xl font-medium leading-[1.04] tracking-[-0.06em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  All your protection in one place.
                </h3>
                <p className="text-xs leading-relaxed text-white/80">
                  Stop suspicious logins in under 60 seconds and keep tamper-proof backups ready without jumping between half a dozen consoles.
                </p>
              </div>
            </article>

            {/* Feature White */}
            <article
              onClick={() => onSelectCaseStudy('real-estate-investment-platform')}
              className="flex min-h-[290px] cursor-pointer flex-col justify-between rounded-lg border border-[#e9e9ec] bg-[#f5f5f7] p-6 text-[#101014] transition hover:-translate-y-1"
            >
              <div className="text-[11px] text-[#777780]">Faster Business Outcomes</div>
              <div
                className="text-5xl sm:text-6xl font-medium leading-none tracking-[-0.08em] text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                +85%
              </div>
              <p className="text-xs leading-relaxed text-[#555560]">
                Faster contract approvals, simpler investor onboarding, and clearer daily numbers across every department.
              </p>
            </article>
          </div>
        </section>

        {/* Boulevard Section Header + Filter Bar */}
        <section id="usecases-catalog" className="mb-10 pt-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-[#343edb] mb-2">
                01 / REAL BUSINESS EXAMPLES
              </span>
              <h2
                className="text-4xl sm:text-6xl font-medium leading-[0.94] tracking-[-0.075em] text-transparent bg-clip-text"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  backgroundImage: 'linear-gradient(100deg, #2534bf, #8d9dff)',
                }}
              >
                Explore<br />Use Cases
              </h2>
            </div>
            <p className="max-w-md text-xs sm:text-sm text-[#777780] leading-relaxed">
              Click any use case below to test the live interactive workspace right in your browser, with clear steps and plain-English explanations.
            </p>
          </div>

          <UseCasesFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedIndustry={selectedIndustry}
            onSelectIndustry={setSelectedIndustry}
            selectedService={selectedService}
            onSelectService={setSelectedService}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            totalCount={CASE_STUDIES.length}
            filteredCount={filteredCaseStudies.length}
            onClearFilters={handleClearFilters}
          />
        </section>

        {/* Case Studies Cards Listing */}
        <section className="mb-16">
          {filteredCaseStudies.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                  : 'space-y-6'
              }
            >
              {filteredCaseStudies.map((study, index) => (
                <CaseStudyCard
                  key={study.id}
                  caseStudy={study}
                  index={index}
                  onSelect={onSelectCaseStudy}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d8d8e0] bg-[#f5f5f7] p-12 text-center">
              <p
                className="text-lg font-medium text-[#101014]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                No use cases matched your search.
              </p>
              <p className="mt-1 text-xs text-[#777780]">
                Try a simpler keyword or click Reset Filters to view all use cases.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-4 rounded-full bg-[#343edb] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#2534bf]"
              >
                Show All Use Cases
              </button>
            </div>
          )}
        </section>

        {/* Boulevard Stats Bar */}
        <section className="mb-16 border-t border-[#e9e9ec] pt-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="border-l border-[#e9e9ec] pl-4 first:border-l-0 first:pl-0">
              <strong
                className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="hl-brutalist">3.5m</span>
              </strong>
              <span className="text-xs text-[#777780]">
                Average contract review time with LexGuard Agent
              </span>
            </div>
            <div className="border-l border-[#e9e9ec] pl-4">
              <strong
                className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="hl-circle-sketch">&lt; 60s</span>
              </strong>
              <span className="text-xs text-[#777780]">
                Time to stop suspicious logins in Vireon Threat Center
              </span>
            </div>
            <div className="border-l border-[#e9e9ec] pl-4">
              <strong
                className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                94%
              </strong>
              <span className="text-xs text-[#777780]">
                Investor sign-up completion on our property platform
              </span>
            </div>
            <div className="border-l border-[#e9e9ec] pl-4">
              <strong
                className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="hl-brutalist">100%</span>
              </strong>
              <span className="text-xs text-[#777780]">
                Audit-ready records across GDPR, SOC 2 &amp; HIPAA
              </span>
            </div>
          </div>
        </section>

        {/* Conversion & Lead Capture Block */}
        <LeadGenerationSection className="mt-12" />
      </div>
    </div>
  );
};

export default UseCasesDirectory;
