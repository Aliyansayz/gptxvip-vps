import React, { useState, useMemo } from 'react';
import { Sparkles, ShieldCheck, CheckCircle2, MonitorPlay } from 'lucide-react';
import { IndustryType, ServiceType } from './types';
import { CASE_STUDIES } from './data/caseStudiesData';
import { CaseStudyCard } from './components/CaseStudyCard';
import { UseCasesFilterBar } from './components/UseCasesFilterBar';
import { LeadGenerationSection } from './components/LeadGenerationSection';
import { Reveal } from '../../shared/components/Reveal';

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
      // Industry match
      if (selectedIndustry !== 'All' && item.industry !== selectedIndustry) {
        return false;
      }
      // Service match
      if (selectedService !== 'All' && item.service !== selectedService) {
        return false;
      }
      // Search query match
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
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 text-slate-900 bg-[#F8FAFC]/40">
      {/* Hero Header in Clean Light Theme */}
      <header className="mb-12 text-center sm:text-left">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            Client Success Stories &amp; Interactive Bento Grid Prototypes
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl leading-tight">
            Proven Enterprise IT Solutions &amp; Interactive Bento Showcases.
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore how enterprise organizations deploy 24×7 Managed Cybersecurity, multi-cloud MXDR telemetry, and tokenized fractional real estate platforms with interactive bento architectures.
          </p>
        </Reveal>

        {/* Global Aggregate Metrics Ribbon */}
        <Reveal delay={0.18}>
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:grid-cols-4">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                40.3M
              </span>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Telemetry Events Inspected
              </p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-600">
                99.999%
              </span>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Production System Uptime
              </p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0D9488]">
                &lt; 4.0 hrs
              </span>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Target RTO Disaster Recovery
              </p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-600">
                100%
              </span>
              <p className="mt-1 text-xs font-medium text-slate-500">
                SOC 2 &amp; NIST CSF 2.0 Aligned
              </p>
            </div>
          </div>
        </Reveal>
      </header>

      {/* Filter and Search Bar */}
      <section className="mb-10">
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
                ? 'grid gap-6 md:grid-cols-2'
                : 'space-y-6'
            }
          >
            {filteredCaseStudies.map((study) => (
              <CaseStudyCard
                key={study.id}
                caseStudy={study}
                onSelect={onSelectCaseStudy}
                viewMode={viewMode}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-semibold text-slate-900">
              No case studies matched your filter criteria.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search terms or clearing your industry and solution filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Conversion & Lead Capture Block */}
      <LeadGenerationSection className="mt-16" />
    </div>
  );
};

export default UseCasesDirectory;
