import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  FlaskConical,
  Layers,
} from 'lucide-react';
import { agenticRoleDefinitions } from '../devLushArea/agenticRoles/data';
import { templates } from '../devLushArea/agentMarketplace/data/templates';
import { ContactForm } from '../shared/components/ContactForm';
import { Reveal } from '../shared/components/Reveal';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import {
  AgentArchetypeSimulator,
  HeroAgentSurfaceWidget,
  ProjectSurfaceShowcase,
  ScopeBuilderWidget,
  StickyWalkthroughBar,
  SystemLogicflowWidget,
  type ScopeSelection,
} from './widgets';

export interface RootHomePageProps {
  onNavigateFinhub?: () => void;
  onNavigateCodeConcepts?: () => void;
  onNavigateAlgoTrading?: () => void;
  onNavigateDevLush?: () => void;
  onNavigateAgents?: () => void;
  onNavigateAgentWorkspace?: () => void;
  onNavigateBlogs?: () => void;
  onNavigateSoftware?: () => void;
  onNavigateAgentArea?: () => void;
  onNavigateContact?: () => void;
}

export const RootHomePage: React.FC<RootHomePageProps> = ({
  onNavigateFinhub = () => window.location.assign('/finhub'),
  onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
  onNavigateDevLush,
  onNavigateAgents,
  onNavigateAgentWorkspace,
  onNavigateBlogs = () => window.location.assign('/blogs'),
  onNavigateSoftware = () => window.location.assign('/guide'),
  onNavigateContact,
}) => {
  const navigateAgents =
    onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
  const navigateProjectSurfaces = () => window.location.assign('/agents/templates');

  const navigateUseCases = () => {
    if ((window as any).smartNavigate) {
      (window as any).smartNavigate('/resources/usecases');
    } else {
      window.location.assign('/resources/usecases');
    }
  };

  const [selectedSurface, setSelectedSurface] = useState<string | null>(null);
  const [inquirySubject, setInquirySubject] = useState<string>('Adapt a Project Surface');
  const [prefilledMessage, setPrefilledMessage] = useState<string>('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'GPTX.VIP — Interactive Systems, Dashboards & AI Agent Surfaces';
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const scrollToContact = () => {
    const section = document.getElementById('contact-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (onNavigateContact) {
      onNavigateContact();
    } else {
      window.location.assign('/contact');
    }
  };

  const handleRequestAdaptation = (surfaceName: string, note?: string) => {
    setSelectedSurface(surfaceName);
    setInquirySubject('Adapt a Project Surface');
    if (note) {
      setPrefilledMessage(note);
    }
    scrollToContact();
  };

  const handleApplyScope = (selection: ScopeSelection) => {
    setSelectedSurface(selection.surface);
    setInquirySubject('Custom Agent & System Build');
    setPrefilledMessage(selection.brief);
  };

  return (
    <div
      className="premium-surface min-h-screen overflow-x-hidden bg-white text-[#0F172A] selection:bg-[#CCFBF1] selection:text-[#0F766E]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar
        variant="default"
        showPrototypesSubnav={false}
        showAreaBadge={false}
        ctaLabel="Start a Project"
        onNavigateFinhub={onNavigateFinhub}
        onNavigateCodeConcepts={onNavigateCodeConcepts}
        onNavigateAgentWorkspace={onNavigateAgentWorkspace}
        onNavigateAgents={navigateAgents}
        onNavigateUseCases={navigateUseCases}
        onNavigateProjectSurfaces={navigateProjectSurfaces}
        onNavigateBlogs={onNavigateBlogs}
        onNavigateSoftware={onNavigateSoftware}
        onBookDemo={scrollToContact}
      />

      <main>
        {/* -------------------------------------------------------- Hero (Calm SOC Obsidian + subtle teal/sky depth, zero specular glare) */}
        <section
          className="relative overflow-hidden text-white"
          style={{
            background:
              'radial-gradient(ellipse at 76% 24%, rgba(14, 165, 233, 0.16) 0, transparent 52%), linear-gradient(160deg, #070d17 0%, #0B131E 60%, #0d2238 100%)',
          }}
          aria-labelledby="hero-heading"
        >
          <div className="relative z-10 mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:pb-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
              <div>
                <Reveal from="up" duration={0.45}>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#5EEAD4]">
                    Operational Systems &amp; AI Agents
                  </p>
                  <h1
                    id="hero-heading"
                    className="max-w-[16ch] text-balance text-3xl font-medium leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Interactive systems &amp; agents —{' '}
                    <span className="text-[#5EEAD4]">
                      built to test first.
                    </span>
                  </h1>
                </Reveal>

                <Reveal from="up" duration={0.5} delay={0.08}>
                  <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate-300">
                    Inspect live analytics funnels, financial ledgers, and multi-agent workflows directly in your browser. Test real chart widgets before scoping your custom build.
                  </p>
                </Reveal>

                <Reveal from="up" duration={0.45} delay={0.14}>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={scrollToContact}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-[#5EEAD4] via-[#2DD4BF] to-[#38BDF8] px-5 py-2.5 text-xs font-bold text-[#0B131E] shadow-[0_8px_20px_rgba(45,212,191,0.22)] transition-[filter,transform] duration-150 ease-out hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B131E] motion-reduce:transform-none"
                    >
                      <span>Scope a Build</span>
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0B131E] text-[10px] text-[#5EEAD4]">
                        →
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('project-surfaces-showcase');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        else navigateProjectSurfaces();
                      }}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-100 transition-[background-color,border-color,transform] duration-150 ease-out hover:border-[#38BDF8]/50 hover:bg-white/[0.08] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                    >
                      <span>Explore Widgets</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#38BDF8]" aria-hidden="true" />
                    </button>
                  </div>
                </Reveal>

                <Reveal from="up" duration={0.45} delay={0.18}>
                  <p className="mt-6 border-t border-white/10 pt-4 text-xs font-medium text-slate-400">
                    {templates.length} live surfaces · {agenticRoleDefinitions.length} agent roles · Deterministic client-side execution
                  </p>
                </Reveal>
              </div>

              {/* Widget A: Live Systems & Agents Workbench */}
              <Reveal from="left" duration={0.55} delay={0.12}>
                <HeroAgentSurfaceWidget onRequestAdaptation={handleRequestAdaptation} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 01 / Widget B: Interactive Surface Chart Widgets */}
        <ProjectSurfaceShowcase
          onRequestAdaptation={handleRequestAdaptation}
          onBrowseAll={navigateProjectSurfaces}
        />

        {/* 02 / Widget C: System & Agent Engine Architecture */}
        <SystemLogicflowWidget onRequestAdaptation={handleRequestAdaptation} />

        {/* 03 / Widget D: Core Systems & Agent Archetypes */}
        <AgentArchetypeSimulator
          onRequestAdaptation={handleRequestAdaptation}
          onExploreRoles={
            onNavigateAgentWorkspace || (() => window.location.assign('/workspace'))
          }
        />

        {/* Compact Secondary Proof Links */}
        <section
          aria-label="Additional technical proof"
          className="border-b border-slate-200 bg-[#F8FAFC] py-6"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 sm:flex-row sm:items-center sm:px-8">
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              <strong className="font-semibold text-[#0F172A]">
                Evaluating deeper technical patterns?
              </strong>{' '}
              Inspect our enterprise SOC &amp; compliance case studies or explore the interactive Agent Labs curriculum.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={navigateUseCases}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#5EEAD4] bg-[#F0FDFA] px-4 py-2 text-xs font-bold text-[#0F766E] transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[#0D9488] hover:bg-[#CCFBF1] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
              >
                <Layers className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
                <span>View Case Studies</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => window.location.assign('/agents/lab')}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-sky-200 bg-[#E0F2FE]/60 px-4 py-2 text-xs font-bold text-[#0369A1] transition-[border-color,background-color,transform] duration-150 ease-out hover:border-[#0EA5E9] hover:bg-[#E0F2FE] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9]"
              >
                <FlaskConical className="h-3.5 w-3.5 text-[#0284C7]" aria-hidden="true" />
                <span>Open Labs</span>
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* 04 / Widget E + Upgraded Project Inquiry ContactForm */}
        <section
          id="contact-section"
          className="bg-white py-12 sm:py-16"
          aria-labelledby="contact-heading"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div
              className="relative overflow-hidden rounded-2xl p-4 text-white sm:p-10"
              style={{
                background:
                  'radial-gradient(ellipse at 78% 22%, rgba(45, 212, 191, 0.28) 0, transparent 42%), radial-gradient(ellipse at 60% 78%, rgba(14, 165, 233, 0.36) 0, transparent 48%), radial-gradient(ellipse at 14% 80%, rgba(124, 58, 237, 0.22) 0, transparent 40%), linear-gradient(120deg, #070d17 5%, #0B131E 50%, #0e385c 100%)',
              }}
            >
              <div className="relative z-10 grid min-w-0 items-start gap-7 lg:grid-cols-12 lg:gap-8">
                <Reveal className="min-w-0 lg:col-span-6">
                  <ScopeBuilderWidget onApplyScope={handleApplyScope} />
                </Reveal>

                <Reveal
                  className="min-w-0 rounded-2xl bg-white p-4 text-[#0F172A] shadow-xl sm:p-7 lg:col-span-6"
                  from="up"
                  distance={20}
                  duration={0.55}
                >
                  <ContactForm
                    variant="full"
                    inquiryMode="project"
                    tone="light"
                    accent="soc"
                    title="Request a Custom Build or Walkthrough"
                    description="Your inquiry routes directly to the builder inbox — usually answered within 1 business day."
                    subject={inquirySubject}
                    submitLabel="Request System Walkthrough"
                    defaultMessage={prefilledMessage}
                    surfaceContext={selectedSurface}
                    onClearSurfaceContext={() => setSelectedSurface(null)}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        accent="soc"
        onNavigateFinhub={onNavigateFinhub}
        onNavigateCodeConcepts={onNavigateCodeConcepts}
        onNavigateDevLush={navigateAgents}
        onNavigateAgentWorkspace={onNavigateAgentWorkspace}
        onNavigateProjectSurfaces={navigateProjectSurfaces}
        onNavigateBlogs={onNavigateBlogs}
        onNavigateUseCases={navigateUseCases}
      />

      {/* Widget F: Scroll-Triggered Contextual Walkthrough Pill + Modal */}
      <StickyWalkthroughBar
        activeSurface={selectedSurface}
        defaultMessage={prefilledMessage}
        contactSectionId="contact-section"
        onClearSurface={() => setSelectedSurface(null)}
      />
    </div>
  );
};

export default RootHomePage;
