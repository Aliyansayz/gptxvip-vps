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
          type="button"
          onClick={onBack}
          className="mt-6 rounded-lg bg-slate-100 px-4 py-2 font-bold text-slate-800 transition-all hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Back to Hub
        </button>
      </div>
    );
  }

  return (
    <section aria-label={`Roadmap reading chapter: ${chapter.chapter_title}`} className="flex h-full w-full flex-col overflow-hidden bg-slate-50 p-4 pb-20 dark:bg-slate-950 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex min-h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
              Hub
            </button>
            <div className="flex flex-col">
              <span className={`mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${themeColors.text}`}>
                <BookOpenText className="w-3.5 h-3.5" /> {RoadmapActivityLabels.READING} {chapter.roadmap && `| Day ${chapter.roadmap}`}
              </span>
              <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Roadmap · {chapter.course}</p>
              <h2 className="text-2xl font-heading tracking-wide text-slate-900 dark:text-white sm:text-4xl">
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
              type="button"
              onClick={onComplete}
              className={`min-h-11 rounded-xl px-4 py-2 font-bold text-white shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${themeColors.bg} ${themeColors.hoverBg} ${themeColors.shadowMd}`}
            >
              Mark as read &amp; complete
            </button>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="relative z-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar p-6">
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-4 border-slate-200 border-t-current animate-spin ${themeColors.text}`}></div>
                  <p role="status" className={`text-sm font-medium ${themeColors.text} font-mono tracking-wider`}>Loading chapter content...</p>
                </div>
              </div>
            }>
              <ReadingComponent
                chapter={chapter}
                exercise={chapter}
                onComplete={onComplete}
                onBack={onBack}
              />
            </Suspense>
          </div>
        </div>
      </section>
  );
};

export default RoadmapReadingView;
