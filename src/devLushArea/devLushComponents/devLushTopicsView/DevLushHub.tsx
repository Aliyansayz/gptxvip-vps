import React from "react";
import { LabData, ConceptCourse } from "../devLushTypes";
import {
  Play,
  Bot,
  AlertTriangle,
  ShieldCheck,
  HelpCircle,
  Atom,
  Beaker,
  Microscope,
  CheckCircle2,
  Zap,
  TrendingUp,
  Lock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Terminal,
} from "lucide-react";
import { RandomKeywordsList } from "./RandomKeywordsList";
import { getThemeColorClass } from "../themeHelpers";
import { SpotlightBorderCard } from "../../components/SpotlightBorderCard";

interface EnrichedConceptData extends ConceptCourse {
  chapters: LabData[];
}

interface DevLushHubProps {
  devLushTopics: EnrichedConceptData[];
  isLoading: boolean;
  onStartChapter: (chapter: LabData) => void;
  activeTopicId: string;
  completedChapterIds: string[];
}

const DevLushChapterCard: React.FC<{
  chapter: LabData;
  onStart: () => void;
  isCompleted: boolean;
}> = ({ chapter, onStart, isCompleted }) => {
  const totalExercises = chapter.interactive_questions.length;
  const themeColors = getThemeColorClass(chapter.course);

  return (
    <SpotlightBorderCard
      spotlightRgb="99, 102, 241"
      baseColorClassName={isCompleted ? 'bg-emerald-400 dark:bg-emerald-700' : undefined}
      innerClassName="flex h-full flex-col p-4 sm:p-6"
    >
        <div className="relative">
          {isCompleted && <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"><CheckCircle2 className="h-3.5 w-3.5" /> Completed</span>}
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{totalExercises} {totalExercises === 1 ? "exercise" : "exercises"} · interactive lab</p>
          <h3 className={`break-words font-heading text-xl tracking-wide text-slate-900 transition-colors duration-300 dark:text-white sm:text-2xl ${themeColors.groupHoverText}`}>
            {chapter.chapter_title}
          </h3>
        </div>

        <p className="relative z-10 mb-4 mt-2 flex-grow text-sm leading-6 text-slate-600 line-clamp-3 dark:text-slate-300 sm:line-clamp-2">
          {chapter.critical_concepts?.[0]?.elaboration ||
            (chapter.critical_concepts && chapter.critical_concepts.length > 0
              ? `Explores core concepts including ${chapter.critical_concepts.map(c => c.concept).join(', ')}.`
              : `Master essential concepts through hands-on scenarios.`)}
        </p>

        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap gap-2 relative z-10">
          {chapter.critical_concepts && chapter.critical_concepts.length > 0
            ? chapter.critical_concepts.slice(0, 3).map((c) => (
              <span
                key={c.concept}
                className={`max-w-full break-words ${themeColors.bgSoft} ${themeColors.text} px-2.5 py-1 rounded-md font-mono border ${themeColors.borderSoft}`}
              >
                {c.concept}
              </span>
            ))
            : chapter.tags && chapter.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className={`max-w-full break-words ${themeColors.bgSoft} ${themeColors.text} px-2.5 py-1 rounded-md font-mono border ${themeColors.borderSoft} capitalize`}
              >
                {t}
              </span>
            ))}
        </div>

        <button
          type="button"
          onClick={onStart}
          aria-label={`${isCompleted ? 'Review' : 'Start'} ${chapter.chapter_title}`}
          className={`relative z-10 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r p-3 font-bold text-white shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ${themeColors.gradientFrom} ${themeColors.gradientTo}`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isCompleted ? 'Review lab' : 'Start lab'}</span>
        </button>
    </SpotlightBorderCard>
  );
};

const DevLushHub: React.FC<DevLushHubProps> = ({
  devLushTopics,
  isLoading,
  onStartChapter,
  activeTopicId,
  completedChapterIds,
}) => {
  const activeTopic = devLushTopics.find((t) => t.id === activeTopicId);
  const completedCount = activeTopic?.chapters.filter((chapter) => completedChapterIds.includes(chapter.labComponentId)).length || 0;
  const nextChapter = activeTopic?.chapters.find((chapter) => !completedChapterIds.includes(chapter.labComponentId)) || activeTopic?.chapters[0];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400 text-xl font-heading tracking-wide animate-pulse">
          Initializing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[size:200%_auto] animate-gradient">
            devLush Sandboxes
          </span>
          ...
        </p>
      </div>
    );
  }

  const themeColors = activeTopic ? getThemeColorClass(activeTopic.title) : getThemeColorClass("");

  return (
    <div className="h-fit min-w-0 w-full bg-slate-50 dark:bg-black">
      <div className="p-4 sm:p-6">
        <div className="mx-auto w-full max-w-7xl">
          {activeTopic ? (
            <>
              <header className="relative mb-5 min-w-0 overflow-hidden rounded-3xl bg-slate-900/5 p-4 dark:bg-slate-900/40 sm:mb-10 sm:p-6">
                {/* Abstract SVG Illustration Background */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden mix-blend-overlay dark:mix-blend-screen">
                  <svg className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%]" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
                        <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.1 }} />
                      </linearGradient>
                      <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.05 }} />
                        <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 0.3 }} />
                        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0.05 }} />
                      </linearGradient>
                      <radialGradient id="grad3" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style={{ stopColor: 'currentColor', stopOpacity: 0.2 }} />
                        <stop offset="100%" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
                      </radialGradient>
                    </defs>
                    <g className={themeColors.text}>
                      {/* Grid / Network lines */}
                      <path d="M0 200 Q 400 0, 800 200 T 1600 200" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10 10" />
                      <path d="M0 400 Q 400 200, 800 400 T 1600 400" fill="none" stroke="url(#grad2)" strokeWidth="3" opacity="0.7" />
                      <path d="M0 600 Q 400 400, 800 600 T 1600 600" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="20 15" />

                      <circle cx="200" cy="400" r="15" fill="url(#grad3)" />
                      <circle cx="200" cy="400" r="4" fill="currentColor" opacity="0.8" />

                      <circle cx="600" cy="200" r="25" fill="url(#grad3)" />
                      <circle cx="600" cy="200" r="6" fill="currentColor" opacity="0.8" />

                      <circle cx="400" cy="600" r="20" fill="url(#grad3)" />
                      <circle cx="400" cy="600" r="5" fill="currentColor" opacity="0.8" />

                      {/* Interconnecting abstract geometric shapes */}
                      <polygon points="200,400 600,200 400,600" fill="url(#grad3)" stroke="url(#grad1)" strokeWidth="1" opacity="0.3" />
                    </g>
                  </svg>
                  {/* Decorative glowing orb */}
                </div>

                <div className="relative z-10 mb-3 flex items-center gap-3 sm:mb-4 sm:flex-col sm:items-start sm:gap-4">
                  <div className={`rounded-2xl border border-white/20 bg-gradient-to-br p-3 text-white shadow-xl backdrop-blur-md sm:p-4 ${themeColors.gradientFrom} ${themeColors.gradientTo} ${themeColors.shadowMd}`}>
                    <activeTopic.icon className="h-6 w-6 sm:h-10 sm:w-10" />
                  </div>
                  <h2 className="min-w-0 break-words font-heading text-2xl leading-tight tracking-wide text-slate-900 dark:text-white sm:mt-2 sm:text-5xl lg:text-6xl">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientVia} ${themeColors.gradientTo}`}>
                      {activeTopic.title}
                    </span>
                  </h2>
                </div>
                <p className="relative z-10 max-w-3xl text-sm font-medium leading-6 text-slate-700 dark:text-slate-300 sm:text-xl sm:leading-relaxed">
                  {activeTopic.longDescription}
                </p>
                <div className="relative z-10 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 p-3 text-sm dark:border-slate-700 dark:bg-slate-950/70 sm:mt-5 sm:max-w-2xl sm:p-4">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{completedCount} of {activeTopic.chapters.length} labs completed</p>
                  {nextChapter && <button type="button" onClick={() => onStartChapter(nextChapter)} className="hidden min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 sm:inline-flex">{completedCount === activeTopic.chapters.length ? 'Review a lab' : 'Continue learning'} <ArrowRight className="h-4 w-4" /></button>}
                </div>
                <div className="relative z-10 mt-4 flex flex-col gap-3 sm:hidden">
                  {nextChapter && (
                    <button type="button" onClick={() => onStartChapter(nextChapter)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
                      <Play className="h-4 w-4" /> {completedCount === activeTopic.chapters.length ? 'Review a lab' : completedCount > 0 ? 'Continue next lab' : 'Start first lab'}
                    </button>
                  )}
                </div>
              </header>

              <div className="mb-8 hidden sm:block">
                <RandomKeywordsList chapters={activeTopic.chapters || []} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                {activeTopic.chapters.length === 0 && (
                  <p role="status" className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">This topic has no labs yet. Choose another topic above.</p>
                )}
                {activeTopic.chapters.map((chapter, index) => (
                    <DevLushChapterCard
                      key={`${chapter.labComponentId}-${index}`}
                      chapter={chapter}
                      isCompleted={completedChapterIds.includes(chapter.labComponentId)}
                      onStart={() => onStartChapter(chapter)}
                    />
                  ))}
              </div>
            </>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400 mt-20 h-full flex flex-col items-center justify-center">
              <Bot className="w-16 h-16 text-indigo-400 mb-4 animate-bounce" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading tracking-wider">
                Select an Agent Core Module
              </h2>
              <p className="mt-2 max-w-md">
                Choose a cyber security, ecommerce negotiation, or financial
                auditing track from the sidebar to inspect interactive workflows
                and pain points.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevLushHub;
