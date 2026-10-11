import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Search } from "lucide-react";
import RoadmapSidebar from "./rootComponents/RoadmapSidebar";
import RoadmapHub from "./rootComponents/RoadmapHub";
import RoadmapLabRunner from "./rootComponents/RoadmapLabRunner";
import RoadmapReadingView from "./rootComponents/RoadmapReadingView";
import { RoadmapSearchView } from "./rootComponents/RoadmapSearchView";
import { LabData, ConceptCourse } from "../roadmapSharedComponents/types";
import { toast } from "sonner";
import { cppTradingHFTData } from "../roadmapTopics/C++_Trading_HFT/index";
import { FavoritesProvider } from "../roadmapSharedComponents/FavoritesContext";
import { TheoryCollectionProvider } from "../roadmapSharedComponents/TheoryCollectionContext";

interface EnrichedConceptData extends ConceptCourse {
  chapters: LabData[];
}

interface RoadmapContainerProps {
  onExit?: () => void;
}

// Convert topics data to the format expected
const rawRoadmapCourseData = [cppTradingHFTData];
const ROADMAP_COMPLETED_STORAGE_KEY = "gptxvip_roadmap_completed_chapters";

const readCompletedChapterIds = (): string[] => {
  try {
    const stored = window.localStorage.getItem(ROADMAP_COMPLETED_STORAGE_KEY);
    const value: unknown = stored ? JSON.parse(stored) : [];
    return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string"))] : [];
  } catch {
    return [];
  }
};

export const RoadmapContainer: React.FC<RoadmapContainerProps> = ({
  onExit,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>("cpp-trading-hft");
  const [selectedChapter, setSelectedChapter] = useState<LabData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [completedChapterIds, setCompletedChapterIds] = useState<string[]>(readCompletedChapterIds);
  const loading = false;

  useEffect(() => {
    try {
      window.localStorage.setItem(ROADMAP_COMPLETED_STORAGE_KEY, JSON.stringify(completedChapterIds));
    } catch {
      // Keep progress in this session if local storage is unavailable.
    }
  }, [completedChapterIds]);

  const enrichedTopics: EnrichedConceptData[] = rawRoadmapCourseData.map((course) => ({
    id: course.id,
    title: course.title,
    description: "", // Fallback or add to data if needed
    longDescription: course.longDescription,
    icon: course.icon,
    chapters: course.chapters as any,
  }));

  // Auto sidebar collapse during active runner simulation
  useEffect(() => {
    setIsSidebarOpen(!selectedChapter);
  }, [selectedChapter]);

  const handleStartChapter = (chapter: LabData) => {
    setSelectedChapter(chapter);
    setIsSearchOpen(false);
    window.history.pushState({ roadmapChapterEntry: true }, "", `/roadmap/${activeTopicId}/${encodeURIComponent(chapter.labComponentId)}`);
  };

  const sidebarTopics = rawRoadmapCourseData.map((course) => ({
    id: course.id,
    title: course.title,
    icon: course.icon,
  }));

  const selectTopic = (id: string) => {
    setActiveTopicId(id);
    setSelectedChapter(null);
    setIsSearchOpen(false);
    const path = `/roadmap/${id}`;
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setSelectedChapter(null);
    if (window.location.pathname !== "/roadmap/search") {
      window.history.pushState({ roadmapSearchEntry: true }, "", "/roadmap/search");
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (!selectedChapter && activeTopicId && scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop;
      try {
        sessionStorage.setItem(`roadmap-scroll-${activeTopicId}`, currentScroll.toString());
      } catch {
        // Keep the roadmap usable when browser storage is disabled.
      }
    }
  };

  const setScrollRef = useCallback((el: HTMLDivElement | null) => {
    scrollContainerRef.current = el;
  }, []);

  const replaceRoadmapRoute = (path: string) => {
    window.history.replaceState({}, "", `${path}${window.location.search}${window.location.hash}`);
  };

  const returnFromChapter = () => {
    setSelectedChapter(null);
    if (window.history.state?.roadmapChapterEntry === true) {
      window.history.back();
      return;
    }
    replaceRoadmapRoute(`/roadmap/${activeTopicId}`);
  };

  const completeSelectedChapter = () => {
    if (!selectedChapter) return;
    setCompletedChapterIds((current) => current.includes(selectedChapter.labComponentId)
      ? current
      : [...current, selectedChapter.labComponentId]);
    toast.success("Chapter completed. Your Roadmap progress is saved on this device.");
    returnFromChapter();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    window.requestAnimationFrame(() => {
      const triggerId = window.matchMedia("(max-width: 1023px)").matches
        ? "roadmap-mobile-search-trigger"
        : "roadmap-desktop-search-trigger";
      document.getElementById(triggerId)?.focus();
    });
    if (window.history.state?.roadmapSearchEntry === true) {
      window.history.back();
      return;
    }
    replaceRoadmapRoute(`/roadmap/${activeTopicId}`);
  };

  useEffect(() => {
    if (selectedChapter) return;
    
    let savedScroll: string | null = null;
    try {
      savedScroll = sessionStorage.getItem(`roadmap-scroll-${activeTopicId}`);
    } catch {
      // Scrolling still works when a saved position cannot be read.
    }
    if (savedScroll && scrollContainerRef.current) {
      const scrollTopVal = parseInt(savedScroll, 10);
      scrollContainerRef.current.scrollTop = scrollTopVal;
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTopVal;
        }
      }, 100);
    }
  }, [activeTopicId, selectedChapter]);

  const syncRoadmapRoute = useCallback(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    if (segments[0] !== "roadmap") return;
    const decodeSegment = (segment?: string) => {
      if (!segment) return "";
      try {
        return decodeURIComponent(segment);
      } catch {
        return segment;
      }
    };
    const replaceRouteIfNeeded = (path: string) => {
      if (window.location.pathname !== path) {
        window.history.replaceState(window.history.state, "", `${path}${window.location.search}${window.location.hash}`);
      }
    };
    if (segments[1] === "search") {
      replaceRouteIfNeeded("/roadmap/search");
      setIsSearchOpen(true);
      setSelectedChapter(null);
      return;
    }

    const requestedTopicId = decodeSegment(segments[1]);
    const requestedChapterId = decodeSegment(segments[2]);
    const requestedTopic = rawRoadmapCourseData.find((course) =>
      course.id === requestedTopicId || course.title.toLowerCase() === requestedTopicId.toLowerCase(),
    ) || rawRoadmapCourseData.find((course) =>
      course.chapters.some((chapter) => chapter.labComponentId === requestedChapterId),
    );
    const topicId = requestedTopic?.id || rawRoadmapCourseData[0]?.id;
    if (topicId) setActiveTopicId(topicId);
    setIsSearchOpen(false);
    const chapter = requestedTopic?.chapters.find((item) => item.labComponentId === requestedChapterId);
    setSelectedChapter(chapter || null);
    const canonicalPath = chapter && topicId
      ? `/roadmap/${topicId}/${chapter.labComponentId}`
      : topicId ? `/roadmap/${topicId}` : "/roadmap";
    replaceRouteIfNeeded(canonicalPath);
  }, []);

  useEffect(() => {
    syncRoadmapRoute();
    window.addEventListener("popstate", syncRoadmapRoute);
    return () => window.removeEventListener("popstate", syncRoadmapRoute);
  }, [syncRoadmapRoute]);

  return (
    <FavoritesProvider>
      <TheoryCollectionProvider>
        <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-black w-full relative">
          <RoadmapSidebar
            topics={sidebarTopics}
            activeTopicId={activeTopicId}
            onTopicSelect={selectTopic}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onSearchClick={openSearch}
            onExit={onExit}
          />

          <div className="flex-1 overflow-hidden relative flex flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
              <button type="button" onClick={onExit} aria-label="Exit Roadmap to GPTX.VIP home" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200"><ArrowLeft className="h-4 w-4" /></button>
              <label className="sr-only" htmlFor="roadmap-mobile-topic">Roadmap topic</label>
              <select id="roadmap-mobile-topic" value={activeTopicId} onChange={(event) => selectTopic(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                {sidebarTopics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}
              </select>
              <button id="roadmap-mobile-search-trigger" type="button" onClick={openSearch} aria-label="Search Roadmap" className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:text-slate-200"><Search className="h-4 w-4" /></button>
            </div>
            <main className="flex-1 bg-slate-50 dark:bg-black overflow-hidden relative flex flex-col">
              {selectedChapter ? (
                selectedChapter.readingComponentId ? (
                  <RoadmapReadingView
                    chapter={selectedChapter as any}
                    onBack={returnFromChapter}
                    onComplete={() => {
                      completeSelectedChapter();
                    }}
                  />
                ) : (
                  <RoadmapLabRunner
                    chapter={selectedChapter as any}
                    onBack={returnFromChapter}
                    onComplete={() => {
                      completeSelectedChapter();
                    }}
                  />
                )
              ) : isSearchOpen ? (
                <RoadmapSearchView
                  roadmapTopics={enrichedTopics}
                  onStartChapter={handleStartChapter as any}
                  onClose={closeSearch}
                />
              ) : (
                <div
                  ref={setScrollRef as any}
                  onScroll={handleScroll as any}
                  className="flex-1 overflow-y-auto custom-scrollbar flex relative"
                >
                  <div className="flex-1 flex flex-col min-h-fit pb-16">
                    <RoadmapHub
                      roadmapTopics={enrichedTopics}
                      isLoading={loading}
                      activeTopicId={activeTopicId}
                      completedChapterIds={completedChapterIds}
                      onStartChapter={handleStartChapter as any}
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </TheoryCollectionProvider>
    </FavoritesProvider>
  );
};

export default RoadmapContainer;
