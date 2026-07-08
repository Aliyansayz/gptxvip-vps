import React, { useState, useEffect } from "react";
import { LabData, ConceptCourse } from "../../devLushArea/agentDevRootComponents/types";
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
import { getThemeColorClass } from "./themeHelpers";

interface EnrichedConceptData extends ConceptCourse {
  chapters: LabData[];
}

interface RoadmapHubProps {
  roadmapTopics: EnrichedConceptData[];
  isLoading: boolean;
  onStartChapter: (chapter: LabData) => void;
  activeTopicId: string;
}

const RoadmapChapterCard: React.FC<{
  chapter: LabData;
  onStart: () => void;
}> = ({ chapter, onStart }) => {
  const totalExercises = chapter.interactive_questions?.length || 0;
  const themeColors = getThemeColorClass(chapter.course);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  const getSpotlightColor = () => {
    if (themeColors.bg.includes('fuchsia')) return '192, 38, 211';
    if (themeColors.bg.includes('violet')) return '124, 58, 237';
    if (themeColors.bg.includes('emerald')) return '16, 185, 129';
    if (themeColors.bg.includes('amber')) return '245, 158, 11';
    if (themeColors.bg.includes('rose')) return '225, 29, 72';
    if (themeColors.bg.includes('blue')) return '37, 99, 235';
    return '99, 102, 241'; // indigo
  };
  
  const spotlightColor = getSpotlightColor();

  return (
    <div
      onClick={onStart}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800 p-[2px] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Gradient Spotlight Layer that follows the cursor */}
      <div 
        className="absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(${spotlightColor}, 0.8), transparent 40%)`
        }}
      />
      
      {/* Inner Content Container - solid bg-white masks the center of the spotlight */}
      <div className="relative z-10 flex flex-col h-full bg-white dark:bg-slate-900 rounded-[14px] p-6 overflow-hidden">
        <div className="relative">
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
          onClick={(e) => { e.stopPropagation(); onStart(); }}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-white bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientTo} shadow-md transition-all opacity-90 hover:opacity-100 hover:${themeColors.shadowMd} relative z-10`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Agent Sandbox</span>
        </button>
      </div>
    </div>
  );
};

const RoadmapHub: React.FC<RoadmapHubProps> = ({
  roadmapTopics,
  isLoading,
  onStartChapter,
  activeTopicId,
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
        <div className="w-full mx-auto">
          {activeTopic ? (
            <>
              <header className="mb-12 relative overflow-hidden bg-slate-900/5 dark:bg-slate-900/40 p-6">
                {/* Abstract SVG Illustration Background */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden mix-blend-overlay dark:mix-blend-screen">
                  <svg className="absolute w-[150%] h-[150%] top-[-25%] left-[-25%] animate-spin-slow" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
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
                  <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${themeColors.gradientFrom} ${themeColors.gradientTo} rounded-full blur-[100px] opacity-20 transform translate-x-1/3 -translate-y-1/3`} />
                </div>

                <div className="relative z-10 flex flex-col items-start gap-4 mb-4">
                  <div className={`p-4 bg-gradient-to-br ${themeColors.gradientFrom} ${themeColors.gradientTo} text-white rounded-2xl shadow-xl ${themeColors.shadowMd} backdrop-blur-md border border-white/20 transform transition-transform hover:scale-105 duration-300`}>
                    <activeTopic.icon className="w-10 h-10" />
                  </div>
                  
                  {/* Day Slider Component */}
                  {availableDays.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2 custom-scrollbar max-w-full mt-2">
                      {availableDays.map(dayNum => (
                        <button 
                          key={dayNum}
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
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientVia} ${themeColors.gradientTo} bg-[size:200%_auto] animate-gradient`}>
                      {activeTopic.title}
                    </span>
                  </h2>
                </div>
                <p className="relative z-10 text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed font-medium">
                  {activeTopic.longDescription}
                </p>
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
