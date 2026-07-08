import React, { useState, useEffect } from "react";
import RoadmapSidebar from "./RoadmapSidebar";
import RoadmapHub from "./RoadmapHub";
import RoadmapRunner from "./RoadmapRunner";
import { RoadmapSearchView } from "./RoadmapSearchView";
import { LabData, ConceptCourse } from "../roadmapSharedComponents/types";
import { toast } from "sonner";
import { cppTradingHFTData } from "../roadmapTopics/C++_Trading_HFT/data";

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

  const sidebarTopics = enrichedTopics.map((t) => ({
    id: t.id,
    title: t.title,
    icon: t.icon,
  }));

  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  // Save scroll position when the user scrolls
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    sessionStorage.setItem(
      "roadmap_scroll_pos_" + activeTopicId,
      e.currentTarget.scrollTop.toString(),
    );
  };

  const setScrollRef = (el: HTMLDivElement | null) => {
    if (el) {
      scrollContainerRef.current = el;
      const savedScroll = sessionStorage.getItem(
        "roadmap_scroll_pos_" + activeTopicId,
      );
      if (savedScroll) {
        const scrollTopVal = parseInt(savedScroll, 10);
        el.scrollTop = scrollTopVal;
        setTimeout(() => {
          if (el) el.scrollTop = scrollTopVal;
        }, 100);
      }
    } else {
      scrollContainerRef.current = null;
    }
  };

  useEffect(() => {
    if (!selectedChapter && scrollContainerRef.current) {
      const savedScroll =
        sessionStorage.getItem("roadmap_scroll_pos_" + activeTopicId) || "0";
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
            <RoadmapRunner
              chapter={selectedChapter as any}
              onBack={() => setSelectedChapter(null)}
              onComplete={() => {
                toast.success("Roadmap Chapter Completed Successfully!");
                setSelectedChapter(null);
              }}
            />
          ) : isSearchOpen ? (
            <RoadmapSearchView
              roadmapTopics={enrichedTopics}
              onStartChapter={handleStartChapter as any}
              onClose={() => setIsSearchOpen(false)}
            />
          ) : (
            <div
              ref={setScrollRef}
              onScroll={handleScroll}
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
  );
};

export default RoadmapContainer;
