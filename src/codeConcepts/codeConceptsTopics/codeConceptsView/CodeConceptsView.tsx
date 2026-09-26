import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BookmarkCheck,
  Check,
  ChevronRight,
  CircleCheck,
  Code2,
  Heart,
  Layers3,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import { CodeConceptsPayload, InteractiveQuestion } from "../../../types";
import { CODE_CONCEPT_CATEGORIES, CategoryType } from "../../../constants/codeConcepts";
import { CoreConceptCard } from "./CoreConceptCard";
import { CoreConceptRunner } from "./CoreConceptRunner";
import { SearchConceptsView } from "../searchFeature/SearchConceptsView";
import { FavoritesProvider, useFavorites } from "../addtoFavorites/FavoritesContext";
import { FavoritesView } from "../addtoFavorites/FavoritesView";

interface CodeConceptsViewProps {
  activeCategory: CategoryType | "favorites" | string;
  setActiveCategory: (category: CategoryType | "favorites" | string) => void;
  onToggleUI?: (show: boolean) => void;
  onExitSearch?: () => void;
  initialActivityId?: string;
}

const CONCEPT_DATA_FILES: Record<string, string[]> = {
  general: ["index.json"],
  cpp_hello_world: ["index.json"],
  cpp_engine_design: ["index.json"],
  HFT: ["index.json"],
  python: ["index.json", "advanced_topics.json"],
};

const COMPLETED_LESSONS_STORAGE_KEY = "code_concepts_completed_lessons";

const isFullScreenType = (type: string | undefined) =>
  type === "scroll_code_walkthrough" ||
  type === "simulation_runner" ||
  type === "circuit_board" ||
  type === "code_explainer_plus_visualizer" ||
  type === "hft_journey_explainer" ||
  type === "code_explainer_drag_drop" ||
  type === "code_rewriter_by_typing" ||
  type === "code_explainer_production_analogy";

const readCompletedLessons = (): string[] => {
  try {
    const stored = window.localStorage.getItem(COMPLETED_LESSONS_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
};

const getPathPrefix = () => {
  if (window.location.pathname.startsWith("/math_primer")) return "/math_primer";
  if (window.location.pathname.startsWith("/code_concepts")) return "/code_concepts";
  return "/core_concepts";
};

const loadConcepts = async () => {
  const payloads: Record<string, CodeConceptsPayload> = {};

  await Promise.all(
    Object.entries(CONCEPT_DATA_FILES).map(async ([categoryId, files]) => {
      const merged: CodeConceptsPayload = {
        course: "",
        chapter_title: "",
        critical_concepts: [],
        interactive_questions: [],
      };

      await Promise.all(files.map(async (fileName) => {
        try {
          const response = await fetch(`/code_concepts/${categoryId}/${fileName}`);
          if (!response.ok) return;
          const fileData = await response.json() as Partial<CodeConceptsPayload>;
          merged.course ||= fileData.course || "";
          merged.chapter_title ||= fileData.chapter_title || "";
          if (Array.isArray(fileData.critical_concepts)) {
            merged.critical_concepts.push(...fileData.critical_concepts);
          }
          if (Array.isArray(fileData.interactive_questions)) {
            merged.interactive_questions.push(...fileData.interactive_questions);
          }
        } catch {
          // Missing curriculum files are skipped; the remaining course content stays usable.
        }
      }));

      payloads[categoryId] = merged;
    }),
  );

  return payloads;
};

type MobileTab = "learn" | "search" | "saved";

const MobileLearningNav: React.FC<{
  activeTab: MobileTab;
  savedCount: number;
  onLearn: () => void;
  onSearch: () => void;
  onSaved: () => void;
}> = ({ activeTab, savedCount, onLearn, onSearch, onSaved }) => (
  <nav
    aria-label="Learning navigation"
    className="fixed inset-x-0 bottom-0 z-[90] grid grid-cols-3 border-t border-zinc-200/80 bg-white/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-zinc-500 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden"
  >
    {[
      { id: "learn" as const, label: "Learn", icon: BookOpen, onClick: onLearn },
      { id: "search" as const, label: "Explore", icon: Search, onClick: onSearch },
      { id: "saved" as const, label: "Saved", icon: Heart, onClick: onSaved, count: savedCount },
    ].map((item) => {
      const Icon = item.icon;
      const active = activeTab === item.id;
      return (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          aria-current={active ? "page" : undefined}
          className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold transition-colors ${
            active ? "text-emerald-600 dark:text-emerald-400" : "hover:text-zinc-900 dark:hover:text-zinc-100"
          }`}
        >
          <span className="relative">
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
            {item.id === "saved" && item.count ? (
              <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-rose-500 px-1 text-[9px] leading-4 text-white">
                {item.count}
              </span>
            ) : null}
          </span>
          {item.label}
        </button>
      );
    })}
  </nav>
);

export const CodeConceptsView: React.FC<CodeConceptsViewProps> = (props) => (
  <FavoritesProvider>
    <CodeConceptsViewContent {...props} />
  </FavoritesProvider>
);

const CodeConceptsViewContent: React.FC<CodeConceptsViewProps> = ({
  activeCategory,
  setActiveCategory,
  onToggleUI,
  onExitSearch,
  initialActivityId,
}) => {
  const [activeConcept, setActiveConcept] = useState<InteractiveQuestion | null>(null);
  const [activeDifficulty, setActiveDifficulty] = useState("basic");
  const [showFavorites, setShowFavorites] = useState(false);
  const [conceptsData, setConceptsData] = useState<Record<string, CodeConceptsPayload>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(readCompletedLessons);
  const hasHandledInitialActivity = useRef(false);
  const { collections } = useFavorites();
  const savedCount = collections.reduce((count, collection) => count + collection.items.length, 0);

  useEffect(() => {
    let cancelled = false;
    loadConcepts().then((payloads) => {
      if (!cancelled) setConceptsData(payloads);
    }).finally(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(COMPLETED_LESSONS_STORAGE_KEY, JSON.stringify(completedLessonIds));
    } catch {
      // Progress remains available for this session if browser storage is disabled.
    }
  }, [completedLessonIds]);

  useEffect(() => {
    if (!activeConcept) onToggleUI?.(true);
  }, [activeCategory, activeConcept, onToggleUI]);

  const activeData = conceptsData[activeCategory];
  const activeCategoryInfo = CODE_CONCEPT_CATEGORIES.find((category) => category.id === activeCategory);

  useEffect(() => {
    if (!initialActivityId || hasHandledInitialActivity.current || !activeData) return;
    hasHandledInitialActivity.current = true;
    const found = activeData.interactive_questions.find((question) => question.componentId === initialActivityId);
    if (found) {
      setActiveConcept(found);
      if (isFullScreenType(found.type)) onToggleUI?.(false);
    }
  }, [initialActivityId, activeData, onToggleUI]);

  const openSearch = () => {
    setShowFavorites(false);
    setActiveCategory("search");
  };

  const openSaved = () => setShowFavorites(true);

  const handleStartConcept = (concept: InteractiveQuestion, categoryId = activeCategory) => {
    setShowFavorites(false);
    if (categoryId !== activeCategory) setActiveCategory(categoryId);
    setActiveConcept(concept);
    if (isFullScreenType(concept.type)) onToggleUI?.(false);
    window.history.pushState({}, "", `${getPathPrefix()}/${categoryId}/${concept.componentId}`);
  };

  const handleBackFromConcept = () => {
    if (isFullScreenType(activeConcept?.type)) onToggleUI?.(true);
    setActiveConcept(null);
    window.history.pushState({}, "", `${getPathPrefix()}/${activeCategory}`);
  };

  const markCurrentLessonComplete = () => {
    if (!activeConcept) return;
    const lessonId = `${activeCategory}:${activeConcept.componentId}`;
    setCompletedLessonIds((current) => current.includes(lessonId) ? current : [...current, lessonId]);
    handleBackFromConcept();
  };

  const overviewQuestion: InteractiveQuestion = {
    componentId: `overview_${activeCategory}`,
    type: "overview",
    difficulty: activeCategory === "general" ? "basic" : activeDifficulty as any,
    concept_tested: "Theory & Overview",
    title: "Module Overview",
    question: "Build a clear foundation before you move into the interactive exercises.",
    explanation: "Understanding these core principles is essential for mastering the module.",
    theory: activeData?.critical_concepts,
  };

  const allCourseLessons = useMemo(() => {
    if (!activeData) return [];
    return [
      ...(activeData.critical_concepts.length ? [overviewQuestion] : []),
      ...activeData.interactive_questions,
    ];
  }, [activeData, activeCategory, activeDifficulty]);

  const displayQuestions = useMemo(() => {
    if (!activeData) return [];
    const hasDifficulties = activeCategory !== "general";
    const filteredQuestions = activeData.interactive_questions
      .filter((question) => !hasDifficulties || (question.difficulty || "basic").toLowerCase() === activeDifficulty)
      .sort((a, b) => Number(b.type === "scroll_code_walkthrough") - Number(a.type === "scroll_code_walkthrough"));
    return activeData.critical_concepts.length ? [overviewQuestion, ...filteredQuestions] : filteredQuestions;
  }, [activeData, activeCategory, activeDifficulty]);

  const courseCompleted = allCourseLessons.filter((lesson) =>
    completedLessonIds.includes(`${activeCategory}:${lesson.componentId}`),
  ).length;
  const courseProgress = allCourseLessons.length ? Math.round((courseCompleted / allCourseLessons.length) * 100) : 0;
  const nextLesson = displayQuestions.find((lesson) =>
    !completedLessonIds.includes(`${activeCategory}:${lesson.componentId}`),
  ) || displayQuestions[0];
  const hasDifficulties = activeCategory !== "general";
  const themeColor = activeCategoryInfo?.theme || "indigo";
  const themeStyles = themeColor === "emerald"
    ? { badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300", solid: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", soft: "bg-emerald-50 dark:bg-emerald-400/10" }
    : themeColor === "blue"
      ? { badge: "bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-300", solid: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", soft: "bg-blue-50 dark:bg-blue-400/10" }
      : { badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-400/15 dark:text-indigo-300", solid: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", soft: "bg-indigo-50 dark:bg-indigo-400/10" };

  const mobileNav = (activeTab: MobileTab) => (
    <MobileLearningNav
      activeTab={activeTab}
      savedCount={savedCount}
      onLearn={() => {
        setShowFavorites(false);
        if (activeCategory === "search") setActiveCategory("general");
      }}
      onSearch={openSearch}
      onSaved={openSaved}
    />
  );

  if (activeCategory === "search" && !activeConcept) {
    return (
      <div className="relative h-full min-h-[70vh] bg-zinc-50 dark:bg-zinc-950">
        <SearchConceptsView
          onSelectTopic={(categoryId) => {
            setShowFavorites(false);
            setActiveCategory(categoryId);
          }}
          onExitSearch={onExitSearch}
          onSelectConcept={(categoryId, concept) => handleStartConcept(concept, categoryId)}
        />
        {mobileNav("search")}
      </div>
    );
  }

  if (showFavorites && !activeConcept) {
    return (
      <div className="relative h-full min-h-[70vh] bg-zinc-50 dark:bg-zinc-950">
        <FavoritesView
          onStartConcept={(concept) => {
            const categoryId = Object.entries(conceptsData).find(([, data]) =>
              data.interactive_questions.some((question) => question.componentId === concept.componentId),
            )?.[0];
            handleStartConcept(concept, categoryId || activeCategory);
          }}
          onBack={() => setShowFavorites(false)}
        />
        {mobileNav("saved")}
      </div>
    );
  }

  if (activeConcept) {
    return (
      <div className="relative h-full min-h-[70vh] bg-zinc-50 dark:bg-zinc-950">
        <CoreConceptRunner
          concept={activeConcept}
          onBack={handleBackFromConcept}
          courseId={activeCategoryInfo?.title}
          categoryId={activeCategoryInfo?.id}
          themeColor={themeColor}
        />
        <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[130] flex justify-center px-4 pb-[env(safe-area-inset-bottom)] md:bottom-5">
          <button
            type="button"
            onClick={markCurrentLessonComplete}
            className="pointer-events-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-sm font-extrabold text-emerald-950 shadow-[0_12px_40px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400 active:scale-[0.98]"
          >
            <CircleCheck className="h-5 w-5" />
            Mark as learned
          </button>
        </div>
      </div>
    );
  }

  const courseTitle = activeData?.course || activeCategoryInfo?.title || "Code Concepts";
  const chapterTitle = activeData?.chapter_title || activeCategoryInfo?.description || "Choose a lesson and build a new skill.";

  return (
    <div className="relative h-full min-h-[70vh] overflow-hidden bg-zinc-50 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_68%)] pointer-events-none" />
      <div className="relative h-full overflow-y-auto overscroll-y-contain pb-28 md:pb-12">
        <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-5 sm:px-6 md:pt-8">
          <header className="mb-5 flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-emerald-300 shadow-lg dark:bg-white dark:text-emerald-700">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">Code learning</p>
                <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">Your learning path</h1>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search lessons"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-emerald-300 md:hidden"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openSaved}
                aria-label="Open saved lessons"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-rose-300"
              >
                <Heart className="h-4 w-4" />
                {savedCount > 0 ? <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-4 text-white">{savedCount}</span> : null}
              </button>
            </div>
          </header>

          <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Choose a course">
            {CODE_CONCEPT_CATEGORIES.filter((category) => category.id !== "search").map((category) => {
              const selected = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setShowFavorites(false);
                    setActiveCategory(category.id);
                  }}
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-bold transition-colors ${
                    selected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                      : "border-zinc-200 bg-white/80 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <category.icon className="h-3.5 w-3.5" />
                  {category.label}
                </button>
              );
            })}
          </div>

          <section className="relative mb-6 overflow-hidden rounded-[1.75rem] bg-zinc-900 p-5 text-white shadow-xl shadow-emerald-950/10 dark:bg-[#10231f] sm:p-7">
            <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-emerald-400/15 blur-3xl" />
            <div className="absolute bottom-0 right-4 hidden select-none font-mono text-8xl font-black text-white/[0.04] sm:block">&#123; &#125;</div>
            <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="max-w-2xl">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-200">Course in progress</span>
                  <Sparkles className="h-4 w-4 text-emerald-300" />
                </div>
                <p className="mb-1 text-xs font-semibold text-zinc-400">{activeCategoryInfo?.label || "Programming"}</p>
                <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">{courseTitle}</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-300">{chapterTitle}</p>
                <div className="mt-5 max-w-lg">
                  <div className="mb-2 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-zinc-300">Course progress</span>
                    <span className="text-emerald-300">{courseCompleted} of {allCourseLessons.length} lessons · {courseProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-emerald-400 transition-[width] duration-500" style={{ width: `${courseProgress}%` }} />
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={!nextLesson || isLoading}
                onClick={() => nextLesson && handleStartConcept(nextLesson)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 text-sm font-extrabold text-emerald-950 shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60 sm:min-w-44"
              >
                <Play className="h-4 w-4 fill-current" />
                {courseProgress === 100 && allCourseLessons.length ? "Review course" : "Continue learning"}
              </button>
            </div>
          </section>

          <div className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"><CircleCheck className="h-4 w-4" /></span>
              <span><strong className="block text-lg font-black leading-5">{courseCompleted}</strong><span className="text-[10px] font-semibold text-zinc-500">Lessons complete</span></span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/80">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300"><Layers3 className="h-4 w-4" /></span>
              <span><strong className="block text-lg font-black leading-5">{allCourseLessons.length}</strong><span className="text-[10px] font-semibold text-zinc-500">Lessons in course</span></span>
            </div>
            <button type="button" onClick={openSaved} className="col-span-2 flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 p-3.5 text-left transition hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-rose-900 sm:col-span-1">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300"><Heart className="h-4 w-4" /></span>
              <span><strong className="block text-lg font-black leading-5">{savedCount}</strong><span className="text-[10px] font-semibold text-zinc-500">Saved lessons</span></span>
              <ChevronRight className="ml-auto h-4 w-4 text-zinc-400 sm:hidden" />
            </button>
          </div>

          <section aria-labelledby="learning-path-heading">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Small steps, real progress</p>
                <h3 id="learning-path-heading" className="text-xl font-black tracking-tight sm:text-2xl">Learning path</h3>
              </div>
              {hasDifficulties && <span className="hidden text-xs font-semibold text-zinc-500 sm:block">Choose your pace</span>}
            </div>

            {hasDifficulties && (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter lessons by difficulty">
                {[
                  { id: "basic", label: "Beginner" },
                  { id: "intermediate", label: "Intermediate" },
                  { id: "advanced", label: "Advanced" },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    aria-pressed={activeDifficulty === level.id}
                    onClick={() => setActiveDifficulty(level.id)}
                    className={`min-h-9 shrink-0 rounded-full px-4 text-xs font-bold transition-colors ${
                      activeDifficulty === level.id
                        ? "bg-emerald-500 text-emerald-950 shadow-sm"
                        : "border border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            )}

            {isLoading ? (
              <div className="space-y-3" aria-label="Loading lessons">
                {[0, 1, 2].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/70" />)}
              </div>
            ) : displayQuestions.length ? (
              <ol className="space-y-3">
                {displayQuestions.map((question, index) => {
                  const lessonId = `${activeCategory}:${question.componentId}`;
                  const isCompleted = completedLessonIds.includes(lessonId);
                  const isNext = question.componentId === nextLesson?.componentId;
                  return (
                    <li key={question.componentId} className="relative pl-10 sm:pl-12">
                      {index < displayQuestions.length - 1 && <span aria-hidden="true" className="absolute bottom-[-0.9rem] left-[15px] top-10 w-0.5 bg-zinc-200 dark:bg-zinc-800 sm:left-[19px]" />}
                      <span className={`absolute left-0 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full border-4 border-zinc-50 text-[10px] font-black dark:border-zinc-950 sm:h-10 sm:w-10 ${
                        isCompleted ? "bg-emerald-500 text-white" : isNext ? "bg-zinc-900 text-emerald-300 ring-4 ring-emerald-400/20 dark:bg-white dark:text-emerald-700" : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <CoreConceptCard
                        concept={question}
                        onStart={() => handleStartConcept(question)}
                        courseId={activeCategoryInfo?.title}
                        lessonNumber={index + 1}
                        isCompleted={isCompleted}
                        isNext={isNext}
                      />
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-3xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-zinc-800">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${themeStyles.badge}`}><Code2 className="h-6 w-6" /></div>
                <h4 className="font-black">More lessons are on the way</h4>
                <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500">There are no {activeDifficulty} lessons in this course yet. Try another level or course.</p>
              </div>
            )}
          </section>

          <div className={`mt-7 flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white/80 p-4 dark:border-zinc-800 dark:bg-zinc-900/70`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${themeStyles.soft} ${themeStyles.text}`}><BookmarkCheck className="h-5 w-5" /></div>
            <p className="text-xs leading-5 text-zinc-500">Your lesson progress is saved on this device. Tap <span className="font-bold text-zinc-700 dark:text-zinc-200">Mark as learned</span> when you finish a lesson to update your path.</p>
          </div>
        </div>
      </div>
      {mobileNav("learn")}
    </div>
  );
};
