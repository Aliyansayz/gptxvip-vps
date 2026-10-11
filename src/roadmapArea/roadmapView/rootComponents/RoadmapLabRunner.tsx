import React, { useState, useEffect, Suspense } from "react";
import { LabData, RoadmapActivityLabels, CourseType } from "../types";
import {
  ChevronLeft,
  ChevronRight,
  Columns,
  Rows,
  BookOpen,
  Sparkles,
} from "lucide-react";
import FavoriteButton from "../../roadmapSharedComponents/FavoriteButton";
import {
  LabSettingsMenu,
  LabSettings,
  loadSavedSettings,
} from "../../roadmapSharedComponents/LabSettingsMenu";
import { LabProvider } from "../../roadmapSharedComponents/LabContext";
import { getThemeColorClass } from "../shared/themeHelpers";
import { roadmapRegistry } from "../../registries/roadmapRegistry";
import { StatePanel } from "../../../shared/components/StatePanel";

interface RoadmapLabRunnerProps {
  chapter: LabData;
  onBack: () => void;
  onComplete: () => void;
}

const RoadmapLabRunner: React.FC<RoadmapLabRunnerProps> = ({
  chapter,
  onBack,
  onComplete,
}) => {
  const componentId = chapter.labComponentId || "";
  const totalSteps = chapter.interactive_questions?.length || 1;

  const readSavedStep = () => {
    try {
      const saved = sessionStorage.getItem(`devlush_step_${componentId}`);
      const parsed = saved ? Number.parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 ? Math.min(parsed, totalSteps - 1) : 0;
    } catch {
      return 0;
    }
  };

  const [step, setStep] = useState(readSavedStep);

  useEffect(() => {
    setStep(readSavedStep());
  }, [componentId]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`devlush_step_${componentId}`, step.toString());
    } catch {
      // The lab remains usable when browser storage is unavailable.
    }
  }, [step, componentId]);

  const [settings, setSettings] = useState<LabSettings>(loadSavedSettings());
  const [infoVisible, setInfoVisible] = useState(!settings.hideTheoryDefault);
  const [infoPlacement, setInfoPlacement] = useState<"side" | "bottom">("side");

  const labContextValue = {
    courseType: CourseType.ROADMAP, 
    labId: componentId,
    chapterTitle: chapter.chapter_title,
  };

  useEffect(() => {
    if (settings.disableTheory) {
      setInfoVisible(false);
    }
  }, [settings.disableTheory]);

  const LabComponent = roadmapRegistry[componentId];

  if (!LabComponent) {
    return (
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-8"><StatePanel eyebrow={`Roadmap · ${chapter.course}`} title="This activity is unavailable" description="The chapter remains in the roadmap, but its interactive component is missing. Return to the topic to choose another chapter." actionLabel="Back to topic" onAction={onBack} /></div>
    );
  }

  if (chapter.interactive_questions?.length === 0) {
    return (
      <div role="alert" className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center dark:border-amber-900 dark:bg-amber-950/30">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">This chapter has no activities yet.</h2>
        <button type="button" onClick={onBack} className="rounded-lg bg-slate-200 px-4 py-2 font-bold text-slate-800 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">Back to Roadmap</button>
      </div>
    );
  }

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      try {
        sessionStorage.removeItem(`devlush_step_${componentId}`);
      } catch {
        // Completion does not depend on browser storage.
      }
      onComplete();
    }
  };

  const themeColors = getThemeColorClass(chapter.course);

  return (
    <LabProvider value={labContextValue}>
      <div className="w-full h-full flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar w-full p-4 pb-20 sm:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBack}
                aria-label="Return to Roadmap chapters"
                className="flex items-center gap-1.5 px-4 py-3 text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Hub
              </button>
              <div className="flex flex-col">
                <span className={`text-xs font-bold ${themeColors.text} uppercase tracking-widest mb-1 flex items-center gap-1`}>
                  <Sparkles className="w-3.5 h-3.5" /> {RoadmapActivityLabels.LAB} {chapter.roadmap && `| Day ${chapter.roadmap}`}
                </span>
                <p className="text-xs font-semibold text-slate-500">Roadmap · {chapter.course}</p>
                <h2 className="text-2xl font-heading tracking-wide text-slate-900 dark:text-white sm:text-4xl">{chapter.chapter_title}</h2>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <FavoriteButton
                id={componentId}
                type="roadmap_lab"
                title={chapter.chapter_title}
                courseId={chapter.course}
              />

              <LabSettingsMenu
                settings={settings}
                onSettingsChange={setSettings}
              />

              {!settings.disableTheory && (
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setInfoVisible(!infoVisible)}
                    aria-label={infoVisible ? "Hide theory blueprint" : "Show theory blueprint"}
                    aria-expanded={infoVisible}
                    title={
                      infoVisible
                        ? "Hide Theory Blueprint"
                        : "Show Theory Blueprint"
                    }
                    className={`p-2 rounded-lg transition-colors ${infoVisible ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  {infoVisible && (
                    <>
                      <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
                      <button
                        type="button"
                        onClick={() => setInfoPlacement("side")}
                        aria-label="Place theory in side panel"
                        aria-pressed={infoPlacement === "side"}
                        title="Split Side Panel"
                        className={`p-2 rounded-lg transition-colors ${infoPlacement === "side" ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                      >
                        <Columns className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInfoPlacement("bottom")}
                        aria-label="Place theory below the exercise"
                        aria-pressed={infoPlacement === "bottom"}
                        title="Bottom Panel View"
                        className={`p-2 rounded-lg transition-colors ${infoPlacement === "bottom" ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                      >
                        <Rows className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {!settings.disableQuestion && (
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        hideQuestionDefault: !prev.hideQuestionDefault,
                      }))
                    }
                    aria-label={settings.hideQuestionDefault ? "Show verification form" : "Hide verification form"}
                    aria-pressed={!settings.hideQuestionDefault}
                    title={
                      settings.hideQuestionDefault
                        ? "Maximize Sandbox Visual"
                        : "Show Verification Form"
                    }
                    className={`p-2 px-3 rounded-lg text-xs font-bold transition-all ${!settings.hideQuestionDefault ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Form
                  </button>
                </div>
              )}
            </div>
          </div>

          <section aria-label="Current exercise task" className="mb-4 max-w-4xl rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"><p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Step {step + 1} of {totalSteps} · {chapter.interactive_questions?.[step]?.title || 'Interactive activity'}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{chapter.interactive_questions?.[step]?.prompt || 'Explore the activity, then review its feedback before moving to the next step.'}</p><p className="mt-2 text-xs text-slate-500">Use the activity feedback below to assess your answer. The chapter navigation records progress; it does not grade this step.</p></section>
          <div role="group" aria-label="Exercise navigation" className="flex justify-between items-center mb-4 px-1.5 mt-2">
            <div className="flex items-center gap-2">
              {totalSteps > 0 && (
                <span aria-live="polite" className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wider">
                  EXERCISE{" "}
                  <span className={`${themeColors.text} font-bold`}>{step + 1}</span>{" "}
                  OF {totalSteps}
                </span>
              )}
            </div>
            <div className={`flex items-center gap-1.5 ${themeColors.bgSoft} p-1 rounded-full border ${themeColors.borderSoft} ${themeColors.shadow} shadow-sm`}>
              {totalSteps > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 0}
                  aria-label="Previous exercise"
                  title="Previous Exercise"
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                aria-label={step >= totalSteps - 1 ? "Complete Roadmap chapter" : "Go to next exercise"}
                title={
                  step >= totalSteps - 1
                    ? "Complete Workspace"
                    : "Next Exercise"
                }
                className={`min-h-11 pl-4 pr-3 ${themeColors.bg} ${themeColors.hoverBg} text-white rounded-full text-xs font-semibold flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2`}
              >
                <span>{step >= totalSteps - 1 ? "Complete" : "Next"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <section aria-label={`${chapter.chapter_title} exercise`} className="relative flex min-h-[24rem] w-full flex-1 flex-col overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:min-h-[500px]">
            <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-[0.15] mix-blend-multiply dark:mix-blend-screen z-0">
              <svg className="absolute w-full h-full" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={themeColors.text} opacity="0.3" />
                  </pattern>
                  <linearGradient id="fadeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" />
                <rect width="100%" height="100%" fill="url(#fadeGrad)" className={themeColors.text} />
                <g className={themeColors.text} opacity="0.6">
                  <circle cx="10%" cy="20%" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                  <circle cx="90%" cy="80%" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M -100 300 Q 500 -100, 1100 500" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  <path d="M -100 400 Q 500 0, 1100 600" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 flex-1 flex flex-col p-2 bg-transparent">
              <Suspense fallback={
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-4 border-slate-200 border-t-current animate-spin ${themeColors.text}`}></div>
                    <p className={`text-sm font-medium ${themeColors.text} font-mono tracking-wider`}>INITIALIZING ENVIRONMENT...</p>
                  </div>
                </div>
              }>
                <LabComponent
                  labData={chapter}
                  exercises={chapter.interactive_questions}
                  step={step}
                  setStep={setStep}
                  onComplete={onComplete}
                  onBack={onBack}
                  infoVisible={infoVisible}
                  setInfoVisible={setInfoVisible}
                  infoPlacement={infoPlacement}
                  setInfoPlacement={setInfoPlacement}
                  settings={settings}
                />
              </Suspense>
            </div>
          </section>
        </div>
      </div>
    </LabProvider>
  );
};

export default RoadmapLabRunner;
