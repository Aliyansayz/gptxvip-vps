import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Briefcase, Sparkles } from 'lucide-react';
import { cn } from '../article/cn';
import type { ArticleBlocks } from './conceptText';
import type { AgenticRoleChapter } from '../../../devLushArea/agenticRoles/agenticRoleTypes';
import { EditorialTheorySection } from './EditorialTheorySection';
import { KnowledgeCheckPromptCard } from './KnowledgeCheckPromptCard';

interface ArticleLabLayoutProps {
  blocks: ArticleBlocks;
  chapter?: AgenticRoleChapter;
  roleDomain: string;
  roleShortTitle: string;
  roleTagline?: string;
  chapterTitle: string;
  chapterDay: number;
  theme: {
    bgSoft: string;
    borderSoft: string;
    text: string;
    gradientFrom: string;
    gradientTo: string;
  };
  onBack: () => void;
  onSaveTheory?: () => void;
  isTheorySaved?: boolean;
  visualDiagramSlot?: React.ReactNode;
  questionCount?: number;
  className?: string;
  children?: React.ReactNode;
}

const domainIconMap: Record<string, React.ReactNode> = {
  seo: <Sparkles className="h-5 w-5" />,
  smm: <Sparkles className="h-5 w-5" />,
  security: <Sparkles className="h-5 w-5" />,
  accountant: <Briefcase className="h-5 w-5" />,
  commerce: <Sparkles className="h-5 w-5" />,
  recommendation: <Sparkles className="h-5 w-5" />,
  preprocessing: <Sparkles className="h-5 w-5" />,
  visualization: <Sparkles className="h-5 w-5" />,
  mobility: <Sparkles className="h-5 w-5" />,
  retail: <Sparkles className="h-5 w-5" />,
  procurement: <Sparkles className="h-5 w-5" />,
  contracts: <Sparkles className="h-5 w-5" />,
};

const domainLabelMap: Record<string, string> = {
  seo: 'SEO',
  smm: 'SMM',
  security: 'LLM/Web Security',
  accountant: 'Accounting',
  commerce: 'Commerce',
  recommendation: 'Recommendations',
  preprocessing: 'Preprocessing',
  visualization: 'Visualization',
  mobility: 'Mobility',
  retail: 'Retail',
  procurement: 'Procurement',
  contracts: 'Contracts',
  uiux: 'UI/UX',
};

export const ArticleLabLayout: React.FC<ArticleLabLayoutProps> = ({
  blocks,
  chapter,
  roleDomain,
  roleShortTitle,
  roleTagline,
  chapterTitle,
  chapterDay,
  theme,
  onBack,
  onSaveTheory,
  isTheorySaved,
  visualDiagramSlot,
  questionCount,
  className,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const mcqSectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const DomainIcon = domainIconMap[roleDomain] || <BookOpen className="h-5 w-5" />;
  const domainLabel = domainLabelMap[roleDomain] || roleDomain;
  const totalQuestions = questionCount ?? chapter?.interactive_questions?.length ?? 1;

  // Reset button-gated MCQ state whenever the active chapter changes
  useEffect(() => {
    setIsQuizOpen(false);
    setScrollProgress(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [chapter?.labComponentId, chapterTitle]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight;
      const pct = scrollable > 0 ? Math.min(100, Math.max(0, (el.scrollTop / scrollable) * 100)) : 0;
      setScrollProgress(pct);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const handleOpenQuiz = () => {
    setIsQuizOpen(true);
    requestAnimationFrame(() => {
      mcqSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // Fallback synthetic chapter when ArticleLabLayout is used without full chapter prop
  const resolvedChapter: AgenticRoleChapter = chapter || {
    course: roleShortTitle,
    roleDomain: roleDomain as AgenticRoleChapter['roleDomain'],
    day: chapterDay,
    day_title: chapterTitle,
    chapter_title: chapterTitle,
    labComponentId: `${roleDomain}-day${chapterDay}`,
    difficulty: 'medium',
    estimatedMinutes: 25,
    tags: [],
    critical_concepts: blocks.sections.map((s) => ({
      concept: s.concept,
      definition: s.definition,
      elaboration: s.elaboration,
      industry_application: s.industryApplication,
    })),
    interactive_questions: [],
    theory_content: {
      title: blocks.intro.title,
      content: blocks.intro.content,
      highlight: blocks.intro.highlight,
      analogy: blocks.callouts.find((c) => c.type === 'analogy')?.content,
      practical_takeaway: blocks.callouts.find((c) => c.type === 'takeaway')?.content,
      industry_case_study: blocks.callouts.find((c) => c.type === 'caseStudy')?.content,
      card_titles: blocks.cards.map((c) => c.heading),
      card_a: blocks.cards[0]?.text,
      card_b: blocks.cards[1]?.text,
      card_c: blocks.cards[2]?.text,
    },
  };

  return (
    <div className={cn('relative flex h-full min-h-0 flex-col bg-white dark:bg-[#121212]', className)}>
      {/* Top Scroll Reading Progress Bar */}
      <div className="h-1 w-full shrink-0 bg-stone-100 dark:bg-stone-800" aria-hidden="true">
        <div
          className="h-full bg-emerald-600 transition-all duration-150 dark:bg-emerald-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Compact Sticky App Header */}
      <header className="shrink-0 border-b border-stone-200/80 bg-white/95 backdrop-blur-md dark:border-stone-800/80 dark:bg-[#121212]/95">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to Agentic Role cases"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-stone-100 px-3.5 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 sm:text-sm cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Cases</span>
            </button>
            <div className="min-w-0">
              <p className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${theme.text}`}>
                {roleShortTitle} · Case {String(chapterDay).padStart(2, '0')}
              </p>
              <h1 className="role-editorial-serif truncate text-lg font-bold text-stone-900 dark:text-white sm:text-2xl">
                {chapterTitle}
              </h1>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${theme.bgSoft} ${theme.text}`}>
            {DomainIcon}
            {domainLabel}
          </span>
        </div>
      </header>

      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto custom-scrollbar">
        <div className="mx-auto w-full max-w-[960px] px-4 py-8 sm:px-10 sm:py-12 space-y-10">
          <EditorialTheorySection
            chapter={resolvedChapter}
            roleShortTitle={roleShortTitle}
            roleTagline={roleTagline}
            scrollContainerRef={scrollContainerRef}
            onSaveTheory={onSaveTheory}
            isTheorySaved={isTheorySaved}
            visualDiagramSlot={visualDiagramSlot}
            theme={theme}
            footerActionSlot={
              children && !isQuizOpen ? (
                <KnowledgeCheckPromptCard
                  questionCount={totalQuestions}
                  buttonLabel="Start Activity"
                  onStart={handleOpenQuiz}
                />
              ) : null
            }
          />

          {children && isQuizOpen && (
            <div
              ref={mcqSectionRef}
              id="knowledgeCheckSection"
              className="role-fade-in pt-4 border-t border-stone-200 dark:border-stone-800"
            >
              {children}
              <div className="mt-6 flex justify-start">
                <button
                  type="button"
                  onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="inline-flex items-center gap-2 py-2 text-sm font-medium text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  <span>Back to Lesson</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
