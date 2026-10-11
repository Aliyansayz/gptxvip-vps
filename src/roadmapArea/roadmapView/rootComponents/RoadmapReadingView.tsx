import React, { Suspense, useState } from "react";
import { LabData, RoadmapActivityLabels } from "../types";
import { ChevronLeft, BookOpenText } from "lucide-react";
import FavoriteButton from "../../roadmapSharedComponents/FavoriteButton";
import { getThemeColorClass } from "../shared/themeHelpers";
import { roadmapRegistry } from "../../registries/roadmapRegistry";
import { StatePanel } from "../../../shared/components/StatePanel";

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
  const [readingProgress, setReadingProgress] = useState(0);

  const themeColors = getThemeColorClass(chapter.course);

  if (!ReadingComponent) {
    return (
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-8"><StatePanel eyebrow={`Roadmap · ${chapter.course}`} title="This reading is unavailable" description="The chapter remains in the roadmap, but its reading content is missing. Return to the topic to choose another chapter." actionLabel="Back to topic" onAction={onBack} /></div>
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
              <h2 className="text-2xl font-heading tracking-wide text-slate-900 dark:text-white sm:text-4xl">{chapter.chapter_title}</h2>
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

        <div className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div role="progressbar" aria-label="Reading position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={readingProgress} className="h-1.5 w-full bg-slate-100 dark:bg-slate-800"><div className="h-full bg-emerald-600 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${readingProgress}%` }} /></div>
          <div onScroll={(event) => { const element = event.currentTarget; const total = element.scrollHeight - element.clientHeight; setReadingProgress(total > 0 ? Math.round(element.scrollTop / total * 100) : 100); }} className="relative z-10 flex-1 overflow-y-auto p-5 custom-scrollbar sm:p-8">
            <div className="mx-auto max-w-[46rem] [&_h2]:scroll-mt-6 [&_h3]:scroll-mt-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto">
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
        </div>
      </section>
  );
};

export default RoadmapReadingView;
