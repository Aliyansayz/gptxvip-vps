import React, { useState, useEffect, useRef } from "react";
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

export const RoadmapContainer: React.FC<RoadmapContainerProps> = ({
  onExit,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>("cpp-trading-hft");
  const [selectedChapter, setSelectedChapter] = useState<LabData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Deep linking logic can be added here if needed in the future

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
  };

  const sidebarTopics = rawRoadmapCourseData.map((course) => ({
    id: course.id,
    title: course.title,
    icon: course.icon,
  }));

  const activeTopic = enrichedTopics.find((t) => t.id === activeTopicId);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = () => {
    if (!selectedChapter && activeTopicId && scrollContainerRef.current) {
      const currentScroll = scrollContainerRef.current.scrollTop;
      sessionStorage.setItem(`roadmap-scroll-${activeTopicId}`, currentScroll.toString());
    }
  };

  const setScrollRef = (el: HTMLDivElement) => {
    scrollContainerRef.current = el;
  };

  useEffect(() => {
    if (selectedChapter) return;
    
    const savedScroll = sessionStorage.getItem(`roadmap-scroll-${activeTopicId}`);
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

  return (
    <FavoritesProvider>
      <TheoryCollectionProvider>
        <div className="flex h-full overflow-hidden bg-slate-50 dark:bg-black w-full relative">
          <RoadmapSidebar
            topics={sidebarTopics}
            activeTopicId={activeTopicId}
            onTopicSelect={(id) => {
              setActiveTopicId(id);
              setSelectedChapter(null);
              setIsSearchOpen(false);
            }}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onSearchClick={() => setIsSearchOpen(true)}
            onExit={onExit}
          />

          <div className="flex-1 overflow-hidden relative flex flex-col">
            <main className="flex-1 bg-slate-50 dark:bg-black overflow-hidden relative flex flex-col">
              {selectedChapter ? (
                selectedChapter.readingComponentId ? (
                  <RoadmapReadingView
                    chapter={selectedChapter as any}
                    onBack={() => setSelectedChapter(null)}
                    onComplete={() => {
                      toast.success("Roadmap Reading Activity Completed Successfully!");
                      setSelectedChapter(null);
                    }}
                  />
                ) : (
                  <RoadmapLabRunner
                    chapter={selectedChapter as any}
                    onBack={() => setSelectedChapter(null)}
                    onComplete={() => {
                      toast.success("Roadmap Lab Activity Completed Successfully!");
                      setSelectedChapter(null);
                    }}
                  />
                )
              ) : isSearchOpen ? (
                <RoadmapSearchView
                  roadmapTopics={enrichedTopics}
                  onStartChapter={handleStartChapter as any}
                  onClose={() => setIsSearchOpen(false)}
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
