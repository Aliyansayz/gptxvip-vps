import React, { Suspense } from "react";
import { LabData, RoadmapActivityLabels } from "../types";
import { ChevronLeft, BookOpenText } from "lucide-react";
import FavoriteButton from "../../roadmapSharedComponents/FavoriteButton";
import { getThemeColorClass } from "../shared/themeHelpers";
import { roadmapRegistry } from "../../registries/roadmapRegistry";

interface RoadmapReadingViewProps {
  chapter: LabData;
  onBack: () => void;
  onComplete: () => void;
}

const RoadmapReadingView: React.FC<RoadmapReadingViewProps> = ({
  chapter,
  onBack,
  onComplete,
}) => {
  const componentId = chapter.readingComponentId || "";
  const ReadingComponent = roadmapRegistry[componentId];

  const themeColors = getThemeColorClass(chapter.course);

  if (!ReadingComponent) {
    return (
      <div className="w-full max-w-4xl mx-auto p-8 bg-white dark:bg-slate-900 border border-red-200 dark:border-red-950/30 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-rose-500">
          Error: Reading Component Not Found
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Content not found for ID: {componentId}
        </p>
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-lg transition-all"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto custom-scrollbar w-full p-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${themeColors.text} uppercase tracking-widest mb-1 flex items-center gap-1`}>
                <BookOpenText className="w-3.5 h-3.5" /> {RoadmapActivityLabels.READING} {chapter.roadmap && `| Day ${chapter.roadmap}`}
              </span>
              <h2 className="text-4xl md:text-5xl font-heading tracking-wide text-slate-900 dark:text-white">
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeColors.gradientFrom} ${themeColors.gradientVia} ${themeColors.gradientTo} bg-[size:200%_auto] animate-gradient`}>
                  {chapter.chapter_title}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FavoriteButton
              id={componentId}
              type="roadmap_reading"
              title={chapter.chapter_title}
              courseId={chapter.course}
            />
            
            <button
              onClick={onComplete}
              className={`px-4 py-2 ${themeColors.bg} ${themeColors.hoverBg} text-white rounded-xl font-bold shadow-md ${themeColors.shadowMd} transition-all`}
            >
              Mark as Read
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="relative z-10 flex-1 flex flex-col p-6">
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-4 border-slate-200 border-t-current animate-spin ${themeColors.text}`}></div>
                  <p className={`text-sm font-medium ${themeColors.text} font-mono tracking-wider`}>LOADING CONTENT...</p>
                </div>
              </div>
            }>
              <ReadingComponent
                chapter={chapter}
                onComplete={onComplete}
                onBack={onBack}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapReadingView;
