import React, { useState, useEffect } from 'react';
import { Navbar } from '../../rootHomePage/Navbar';
import { Footer } from '../../rootHomePage/Footer';
import { UseCasesDirectory } from './UseCasesDirectory';
import { CaseStudyDetail } from './components/CaseStudyDetail';
import { CASE_STUDIES } from './data/caseStudiesData';

interface UseCasesPageProps {
  initialSlug?: string;
  onNavigateHome?: () => void;
  onNavigateFinhub?: () => void;
  onNavigateCodeConcepts?: () => void;
  onNavigateDevLush?: () => void;
  onNavigateAgents?: () => void;
  onNavigateAgentWorkspace?: () => void;
  onNavigateProjectSurfaces?: () => void;
  onNavigateBlogs?: () => void;
  onNavigateContact?: () => void;
}

export const UseCasesPage: React.FC<UseCasesPageProps> = ({
  initialSlug,
  onNavigateFinhub,
  onNavigateCodeConcepts,
  onNavigateDevLush,
  onNavigateAgents,
  onNavigateAgentWorkspace,
  onNavigateProjectSurfaces,
  onNavigateBlogs,
  onNavigateContact,
}) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(initialSlug || null);

  // Canonicalize slug aliases
  const resolveCanonicalSlug = (rawSlug: string): string => {
    if (rawSlug === 'vireon') return 'vireon-threat-center';
    if (
      rawSlug === 'investment-platform' ||
      rawSlug === 'investment-platform-tokenized-real-estate' ||
      rawSlug === 'investment'
    ) {
      return 'real-estate-investment-platform';
    }
    if (
      rawSlug === 'compliance' ||
      rawSlug === 'legal' ||
      rawSlug === 'compliance-legal'
    ) {
      return 'compliance-legal-agent';
    }
    return rawSlug;
  };

  // Sync state with URL if user navigates back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const segments = path.split('/').filter(Boolean);
      // /resources/usecases/:slug or /usecases/:slug
      if (segments[0] === 'resources' && segments[1] === 'usecases' && segments[2]) {
        setActiveSlug(resolveCanonicalSlug(segments[2]));
      } else if (segments[0] === 'usecases' && segments[1]) {
        setActiveSlug(resolveCanonicalSlug(segments[1]));
      } else {
        setActiveSlug(null);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectCaseStudy = (slug: string) => {
    const canonical = resolveCanonicalSlug(slug);
    setActiveSlug(canonical);
    const newPath = `/resources/usecases/${encodeURIComponent(canonical)}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const handleBackToDirectory = () => {
    setActiveSlug(null);
    const newPath = '/resources/usecases';
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  const selectedStudy = activeSlug
    ? CASE_STUDIES.find(
        (item) => item.slug === activeSlug || resolveCanonicalSlug(item.slug) === activeSlug
      ) || CASE_STUDIES[0]
    : null;

  return (
    <div
      className="flex min-h-screen flex-col bg-white text-[#101014] selection:bg-[#d8ff38] selection:text-[#101014]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Root Navigation Bar */}
      <Navbar
        variant="default"
        onNavigateFinhub={onNavigateFinhub || (() => window.location.assign('/finhub'))}
        onNavigateCodeConcepts={onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'))}
        onNavigateAgents={onNavigateAgents || (() => window.location.assign('/agents'))}
        onNavigateDevLush={onNavigateDevLush || (() => window.location.assign('/agents'))}
        onNavigateAgentWorkspace={onNavigateAgentWorkspace || (() => window.location.assign('/workspace'))}
        onNavigateProjectSurfaces={onNavigateProjectSurfaces || (() => window.location.assign('/agents/templates'))}
        onNavigateBlogs={onNavigateBlogs || (() => window.location.assign('/blogs'))}
        onBookDemo={onNavigateContact || (() => window.location.assign('/contact'))}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedStudy ? (
          <CaseStudyDetail
            caseStudy={selectedStudy}
            onBack={handleBackToDirectory}
            onSelectRelated={handleSelectCaseStudy}
          />
        ) : (
          <UseCasesDirectory onSelectCaseStudy={handleSelectCaseStudy} />
        )}
      </main>

      {/* Root Footer (Boulevard style with hello@gptx.vip) */}
      <Footer
        onNavigateFinhub={onNavigateFinhub || (() => window.location.assign('/finhub'))}
        onNavigateDevLush={onNavigateDevLush || (() => window.location.assign('/agents'))}
        onNavigateBlogs={onNavigateBlogs || (() => window.location.assign('/blogs'))}
        onNavigateCodeConcepts={onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'))}
        onNavigateAgentWorkspace={onNavigateAgentWorkspace}
        onNavigateProjectSurfaces={onNavigateProjectSurfaces}
        theme="light"
        accent="cyan"
      />
    </div>
  );
};

export default UseCasesPage;
