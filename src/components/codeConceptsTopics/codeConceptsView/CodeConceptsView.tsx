import React, { useState, useEffect } from "react";
import { Blocks, Presentation, Beaker, Atom, Microscope } from "lucide-react";
import { motion } from "motion/react";
import { CodeConceptsPayload, InteractiveQuestion } from "../../../types";
import { CODE_CONCEPT_CATEGORIES, CategoryType } from "../../../constants/codeConcepts";
import { CoreConceptCard } from "./CoreConceptCard";
import { CoreConceptRunner } from "./CoreConceptRunner";
import { TheoryPane } from "./TheoryPane";
import { SearchConceptsView } from "../searchFeature/SearchConceptsView";
import { FavoritesProvider } from "../addtoFavorites/FavoritesContext";
import { FavoritesView } from "../addtoFavorites/FavoritesView";
import { SettingsGear } from "../addtoFavorites/SettingsGear";

interface CodeConceptsViewProps {
  activeCategory: CategoryType | 'favorites' | string;
  setActiveCategory: (category: CategoryType | 'favorites' | string) => void;
  onToggleUI?: (show: boolean) => void;
  onExitSearch?: () => void;
  initialActivityId?: string;
}

// @ts-ignore
const allConceptFiles = import.meta.glob('/public/code_concepts/**/*.json', { eager: true });

export const CodeConceptsView: React.FC<CodeConceptsViewProps> = (props) => {
  return (
    <FavoritesProvider>
      <CodeConceptsViewContent {...props} />
    </FavoritesProvider>
  );
};

const CodeConceptsViewContent: React.FC<CodeConceptsViewProps> = ({ activeCategory, setActiveCategory, onToggleUI, onExitSearch, initialActivityId }) => {
  const [activeConcept, setActiveConcept] = useState<InteractiveQuestion | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState<string>("basic");
  const [showFavorites, setShowFavorites] = useState(false);
  
  const [conceptsData, setConceptsData] = useState<Record<string, CodeConceptsPayload | null>>({
    general: null,
    cpp_hello_world: null,
    cpp_engine_design: null,
    HFT: null,
    "C++": null,
    python: null
  });

  useEffect(() => {
    setActiveConcept(null);
    if (onToggleUI) onToggleUI(true);
    
    // Aggregate data dynamically from glob
    const aggregatedPayloads: Record<string, CodeConceptsPayload> = {};

    Object.entries(allConceptFiles).forEach(([path, moduleExport]) => {
      // Path example: /public/code_concepts/cpp_hello_world/index.json
      const parts = path.split('/');
      if (parts.length < 4) return;
      const categoryDir = parts[parts.length - 2]; // e.g., cpp_hello_world
      
      const fileData = (moduleExport as any).default || moduleExport as any;
      
      if (!aggregatedPayloads[categoryDir]) {
        aggregatedPayloads[categoryDir] = {
          course: fileData.course || "",
          chapter_title: fileData.chapter_title || "",
          critical_concepts: [],
          interactive_questions: []
        };
      }
      
      if (fileData.course && !aggregatedPayloads[categoryDir].course) {
          aggregatedPayloads[categoryDir].course = fileData.course;
      }
      if (fileData.chapter_title && !aggregatedPayloads[categoryDir].chapter_title) {
          aggregatedPayloads[categoryDir].chapter_title = fileData.chapter_title;
      }
      
      if (Array.isArray(fileData.critical_concepts)) {
        aggregatedPayloads[categoryDir].critical_concepts.push(...fileData.critical_concepts);
      }
      if (Array.isArray(fileData.interactive_questions)) {
        aggregatedPayloads[categoryDir].interactive_questions.push(...fileData.interactive_questions);
      }
    });

    setConceptsData(prev => ({
      ...prev,
      ...aggregatedPayloads
    }));
  }, [activeCategory, onToggleUI]);

  useEffect(() => {
    const activeData = conceptsData[activeCategory as string];
    if (initialActivityId && activeData && activeData.interactive_questions) {
      const found = activeData.interactive_questions.find(q => q.componentId === initialActivityId);
      if (found && !activeConcept) {
        setActiveConcept(found);
        if (isFullScreenType(found.type) && onToggleUI) {
          onToggleUI(false);
        }
      }
    }
  }, [initialActivityId, activeCategory, conceptsData, onToggleUI, activeConcept]);

  const activeData = conceptsData[activeCategory as string];
  const isLoading = false;

  const activeCategoryInfo = CODE_CONCEPT_CATEGORIES.find(c => c.id === activeCategory);

  if (activeCategory === "search") {
    return (
      <SearchConceptsView 
        onSelectTopic={setActiveCategory as any} 
        onExitSearch={onExitSearch}
        onSelectConcept={(categoryId, concept) => {
          setActiveCategory(categoryId as any);
          setActiveConcept(concept);
          if (isFullScreenType(concept.type) && onToggleUI) {
            onToggleUI(false);
          }
          
          let pathPrefix = '/core_concepts';
          if (window.location.pathname.startsWith('/math_primer')) {
            pathPrefix = '/math_primer';
          } else if (window.location.pathname.startsWith('/code_concepts')) {
            pathPrefix = '/code_concepts';
          }
          window.history.pushState({}, '', `${pathPrefix}/${categoryId}/${concept.componentId}`);
        }}
      />
    );
  }

  const isFullScreenType = (type: string | undefined) => 
    type === 'scroll_code_walkthrough' || type === 'simulation_runner' || type === 'circuit_board' || type === 'code_explainer_plus_visualizer' || type === 'hft_journey_explainer' || type === 'code_explainer_drag_drop' || type === 'code_rewriter_by_typing' || type === 'code_explainer_production_analogy';

  const handleStartConcept = (concept: InteractiveQuestion) => {
    setActiveConcept(concept);
    if (isFullScreenType(concept.type) && onToggleUI) {
      onToggleUI(false);
    }
    
    // Update the URL to reflect the deep link path for the active concept
    let pathPrefix = '/core_concepts';
    if (window.location.pathname.startsWith('/math_primer')) {
      pathPrefix = '/math_primer';
    } else if (window.location.pathname.startsWith('/code_concepts')) {
      pathPrefix = '/code_concepts';
    }
    window.history.pushState({}, '', `${pathPrefix}/${activeCategory}/${concept.componentId}`);
  };

  if (showFavorites) {
    return (
      <FavoritesView 
        onStartConcept={handleStartConcept}
        onBack={() => setShowFavorites(false)}
      />
    );
  }

  const hasDifficulties = activeCategory !== 'general';

  const overviewQuestion: InteractiveQuestion = {
    componentId: `overview_${activeCategory}`,
    type: "overview",
    difficulty: hasDifficulties ? activeDifficulty as any : "basic",
    concept_tested: "Theory & Overview",
    title: "Module Overview",
    question: "Review the theoretical foundations and core concepts that define this module before getting into the interactive exercises.",
    explanation: "Understanding these core principles is essential for mastering the module.",
    theory: activeData?.critical_concepts
  };

  const filteredQuestions = activeData?.interactive_questions?.filter(q => {
    if (!hasDifficulties) return true;
    return (q.difficulty || 'basic').toLowerCase() === activeDifficulty.toLowerCase();
  }).sort((a, b) => {
    const isAWalkthrough = a.type === 'scroll_code_walkthrough' ? 1 : 0;
    const isBWalkthrough = b.type === 'scroll_code_walkthrough' ? 1 : 0;
    return isBWalkthrough - isAWalkthrough;
  }) || [];

  const displayQuestions = activeData?.critical_concepts ? [overviewQuestion, ...filteredQuestions] : filteredQuestions;

  const handleBackFromConcept = () => {
    if (isFullScreenType(activeConcept?.type) && onToggleUI) {
      onToggleUI(true);
    }
    setActiveConcept(null);
    
    // Revert the URL to the category base level
    let pathPrefix = '/core_concepts';
    if (window.location.pathname.startsWith('/math_primer')) {
      pathPrefix = '/math_primer';
    } else if (window.location.pathname.startsWith('/code_concepts')) {
      pathPrefix = '/code_concepts';
    }
    window.history.pushState({}, '', `${pathPrefix}/${activeCategory}`);
  };

  // If a Concept Card is clicked, render the individual CoreConceptRunner
  if (activeConcept) {
    return (
       <CoreConceptRunner 
         concept={activeConcept} 
         onBack={handleBackFromConcept}
         courseId={activeCategoryInfo?.title}
         categoryId={activeCategoryInfo?.id}
         themeColor={activeCategoryInfo?.theme || "indigo"}
       />
    );
  }

  // Original list rendering with tiles
  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#050505] transition-colors duration-500 overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
           {/* Decorative elements for C++ */}
           {activeCategory.startsWith('cpp') && (
             <>
               <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
               <div
                 className="absolute inset-0 opacity-[0.03] pointer-events-none"
                 style={{
                   backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                   backgroundSize: '30px 30px'
                 }}
               />
             </>
           )}

           <div className="flex flex-1 overflow-hidden relative">
             {/* Content Panel */}
             <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 relative">
                <div className="absolute top-4 right-4 z-10">
                  <SettingsGear onOpenFavorites={() => setShowFavorites(true)} />
                </div>
                <div id="code-concepts-list" className="max-w-5xl mx-auto pb-20">
                  <header className={`${hasDifficulties ? 'text-left mb-16' : 'text-center mb-12 max-w-2xl mx-auto'}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-sm mb-4 ${
                      activeCategoryInfo?.theme === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      activeCategoryInfo?.theme === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    }`}>
                       {activeCategoryInfo && <activeCategoryInfo.icon className="w-12 h-12" />}
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 m-0">
                       {activeCategoryInfo?.title || "Code Concepts"}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg">
                       {activeData?.course ? `${activeData.course} - ${activeData.chapter_title}` : activeCategoryInfo?.description || "Select a topic to explore interactive labs."}
                    </p>
                  </header>

                  {/* Display Interactive Questions Grid */}
                  <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 mb-6">
                    <h3 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                       <Presentation className={`w-5 h-5 ${
                         activeCategoryInfo?.theme === 'emerald' ? 'text-emerald-500' :
                         activeCategoryInfo?.theme === 'blue' ? 'text-blue-500' :
                         'text-indigo-500'
                       }`} /> Interactive Labs
                    </h3>
                    {hasDifficulties && (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Active_Node:: {activeDifficulty}
                      </div>
                    )}
                  </div>
                  
                  {/* Interactive Labs Navigation - Vertical Relative */}
                  {hasDifficulties && (
                    <div className="flex flex-col items-start gap-4 mb-8">
                      {[
                        { id: 'basic', icon: <Atom size={12} /> },
                        { id: 'intermediate', icon: <Beaker size={12} /> },
                        { id: 'advanced', icon: <Microscope size={12} /> }
                      ].map((item) => {
                        const isActive = activeDifficulty === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveDifficulty(item.id)}
                            className="group relative focus:outline-none flex flex-row items-center gap-3"
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                width: isActive ? 16 : 4,
                                backgroundColor: isActive ? '#3b82f6' : '#a1a1aa'
                              }}
                              className="h-[2px] rounded-full"
                            />
                            <motion.span
                              initial={false}
                              animate={{
                                color: isActive ? '#3b82f6' : '#71717a',
                                x: isActive ? 4 : 0
                              }}
                              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                              className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] cursor-pointer select-none"
                              style={{
                                fontFamily: '"Righteous", cursive',
                              }}
                            >
                              {item.icon}
                              {item.id}
                            </motion.span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {isLoading ? (
                       <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400">
                         <span className="animate-pulse">Loading curriculum data...</span>
                       </div>
                    ) : displayQuestions.length > 0 ? (
                      displayQuestions.map((question) => (
                         <CoreConceptCard
                           key={question.componentId}
                           concept={question}
                           onStart={() => handleStartConcept(question)}
                           courseId={activeCategoryInfo?.title}
                         />
                      ))
                    ) : (
                      <div className="col-span-full border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-16 text-zinc-500 text-center flex flex-col items-center gap-4">
                        <Blocks className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
                        <div className="max-w-xs">
                          <p className="font-bold text-lg mb-1">Node Empty</p>
                          <p className="text-sm">No interactive questions mapped for {activeDifficulty} level in this module.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};
