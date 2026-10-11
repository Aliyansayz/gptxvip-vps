import React, { useState, useEffect } from "react";
import { LabData, ConceptCourse } from "../../roadmapSharedComponents/types";
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
import { getThemeColorClass } from "../shared/themeHelpers";

interface EnrichedConceptData extends ConceptCourse {
  chapters: LabData[];
}

interface RoadmapHubProps {
  roadmapTopics: EnrichedConceptData[];
  isLoading: boolean;
  onStartChapter: (chapter: LabData) => void;
  activeTopicId: string;
  completedChapterIds: string[];
}

const RoadmapChapterCard: React.FC<{
  chapter: LabData;
  onStart: () => void;
  isCompleted: boolean;
}> = ({ chapter, onStart, isCompleted }) => {
  const totalExercises = chapter.interactive_questions?.length || 0;
  const themeColors = getThemeColorClass(chapter.course);
  
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-md dark:bg-slate-900 ${isCompleted ? 'border-emerald-300 dark:border-emerald-700' : 'border-slate-200 hover:border-indigo-300 dark:border-slate-800 dark:hover:border-indigo-700'}`}
    >
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="relative">
          {isCompleted && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" /> Completed
            </span>
          )}
          <h4 className={`font-heading text-2xl tracking-wide text-slate-900 dark:text-white transition-colors duration-300 ${themeColors.groupHoverText}`}>
            {chapter.chapter_title}
          </h4>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4 flex-grow relative z-10 line-clamp-2">
          {chapter.critical_concepts?.[0]?.elaboration || 
           (chapter.critical_concepts && chapter.critical_concepts.length > 0 
             ? `Explores core concepts including ${chapter.critical_concepts.map(c => c.concept).join(', ')}.` 
             : `Master essential concepts through hands-on scenarios.`)}
        </p>

        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap gap-2 relative z-10">
          <span className={`${themeColors.bgSoft} ${themeColors.text} rounded-md border ${themeColors.borderSoft} px-2.5 py-1 font-semibold`}>
            {chapter.roadmap ? `Day ${chapter.roadmap}` : "Chapter"}
          </span>
          {totalExercises > 0 && <span>{totalExercises} exercise{totalExercises === 1 ? "" : "s"}</span>}
          {chapter.critical_concepts && chapter.critical_concepts.length > 0
            ? chapter.critical_concepts.slice(0, 3).map((c) => (
                <span
                  key={c.concept}
                  className={`${themeColors.bgSoft} ${themeColors.text} px-2.5 py-1 rounded-md font-mono border ${themeColors.borderSoft}`}
                >
                  {c.concept}
                </span>
              ))
            : chapter.tags && chapter.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className={`${themeColors.bgSoft} ${themeColors.text} px-2.5 py-1 rounded-md font-mono border ${themeColors.borderSoft} capitalize`}
                >
                  {t}
                </span>
              ))}
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onStart(); }}
          className={`w-full flex min-h-11 items-center justify-center gap-2 rounded-xl p-3 font-bold text-white bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientTo} shadow-sm transition-[filter] duration-200 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 relative z-10`}
        >
          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isCompleted ? "Review chapter" : "Start chapter"}</span>
        </button>
      </div>
    </article>
  );
};

const RoadmapHub: React.FC<RoadmapHubProps> = ({
  roadmapTopics,
  isLoading,
  onStartChapter,
  activeTopicId,
  completedChapterIds,
}) => {
  const activeTopic = roadmapTopics.find((t) => t.id === activeTopicId);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    if (activeTopic && activeTopic.chapters && activeTopic.chapters.length > 0) {
      const firstDay = Math.min(...activeTopic.chapters.map(c => c.roadmap || 1));
      setSelectedDay(firstDay);
    }
  }, [activeTopic?.id]);

  const availableDays = activeTopic
    ? Array.from(new Set(activeTopic.chapters.map(ch => ch.roadmap || 1))).sort((a, b) => a - b)
    : [];

  const filteredChapters = activeTopic
    ? activeTopic.chapters.filter(ch => (ch.roadmap || 1) === selectedDay)
    : [];
  const completedCount = activeTopic?.chapters.filter((chapter) => completedChapterIds.includes(chapter.labComponentId)).length || 0;
  const topicProgress = activeTopic?.chapters.length ? Math.round((completedCount / activeTopic.chapters.length) * 100) : 0;
  const nextChapter = activeTopic?.chapters.find((chapter) => !completedChapterIds.includes(chapter.labComponentId)) || activeTopic?.chapters[0];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400 text-xl font-heading tracking-wide animate-pulse">
          Initializing{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[size:200%_auto] animate-gradient">
            roadmap Sandboxes
          </span>
          ...
        </p>
      </div>
    );
  }

  const themeColors = activeTopic ? getThemeColorClass(activeTopic.title) : getThemeColorClass("");

  return (
    <div className="w-full bg-slate-50 dark:bg-black h-fit">
      <div className="p-4 md:p-6">
        <div className="w-full max-w-[80rem] mx-auto">
          {activeTopic ? (
            <>
              <header className="mb-8 relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40">
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
                      <path d="M0 200 Q 400 0, 800 200 T 1600 200" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="10 10"/>
                      <path d="M0 400 Q 400 200, 800 400 T 1600 400" fill="none" stroke="url(#grad2)" strokeWidth="3" opacity="0.7"/>
                      <path d="M0 600 Q 400 400, 800 600 T 1600 600" fill="none" stroke="url(#grad1)" strokeWidth="2" strokeDasharray="20 15"/>
                      
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

                <div className="relative z-10 flex flex-col items-start gap-4 mb-4">
                  <div className={`p-4 bg-gradient-to-br ${themeColors.gradientFrom} ${themeColors.gradientTo} text-white rounded-2xl border border-white/20`}>
                    <activeTopic.icon className="w-10 h-10" />
                  </div>
                  
                  {/* Day Slider Component */}
                  {availableDays.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2 custom-scrollbar max-w-full mt-2">
                      {availableDays.map(dayNum => (
                        <button
                          key={dayNum}
                          type="button"
                          aria-pressed={selectedDay === dayNum}
                          onClick={() => setSelectedDay(dayNum)}
                          className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                            selectedDay === dayNum
                              ? 'bg-blue-900/80 text-green-400 shadow-md border-green-500/50'
                              : 'bg-black/40 text-slate-400 hover:bg-slate-800 hover:text-green-300 border-blue-900/50'
                          }`}
                        >
                          Day {dayNum}
                        </button>
                      ))}
                    </div>
                  )}
                  <h2 className="text-5xl md:text-6xl font-heading tracking-wide text-slate-900 dark:text-white mt-2">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientVia} ${themeColors.gradientTo}`}>
                      {activeTopic.title}
                    </span>
                  </h2>
                </div>
                <p className="relative z-10 text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
                  {activeTopic.longDescription}
                </p>
                <div className="relative z-10 mt-6 max-w-lg rounded-xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-300">Topic progress</span>
                    <span className="text-slate-700 dark:text-slate-200">{completedCount} of {activeTopic.chapters.length} chapters · {topicProgress}%</span>
                  </div>
                  <div role="progressbar" aria-label={`${activeTopic.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={topicProgress} className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className={`h-full bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientTo} transition-[width] duration-500`} style={{ width: `${topicProgress}%` }} />
                  </div>
                </div>
                {nextChapter && (
                  <div className="relative z-10 mt-4 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-950/30 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">{completedCount === activeTopic.chapters.length ? 'Review a chapter' : completedCount > 0 ? 'Continue your topic' : 'Start here'}</p>
                      <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{nextChapter.chapter_title}</p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Day {nextChapter.roadmap || 1} · {nextChapter.readingComponentId ? 'Reading' : 'Interactive lab'}</p>
                    </div>
                    <button type="button" onClick={() => onStartChapter(nextChapter)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 text-sm font-bold text-white hover:bg-indigo-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:bg-indigo-500 dark:text-slate-950">{completedCount === activeTopic.chapters.length ? 'Review chapter' : 'Open next chapter'} <ArrowRight className="h-4 w-4" /></button>
                  </div>
                )}
              </header>

              <div className="mb-8">
                <RandomKeywordsList chapters={activeTopic.chapters || []} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter, index) => (
                    <RoadmapChapterCard
                      key={`${chapter.labComponentId}-${index}`}
                      chapter={chapter}
                      isCompleted={completedChapterIds.includes(chapter.labComponentId)}
                      onStart={() => onStartChapter(chapter)}
                    />
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 col-span-full">No chapters available for this day.</p>
                )}
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

export default RoadmapHub;
