import React, { useState, useEffect, useRef, Suspense } from "react";
import { LabData } from "../devLushTypes";
import { devLushRegistry } from "../devLushRegistry";
import {
  ChevronLeft,
  ChevronRight,
  Columns,
  Rows,
  BookOpen,
  Sparkles,
} from "lucide-react";
import FavoriteButton from "../../agentDevRootComponents/FavoriteButton";
import {
  LabSettingsMenu,
  LabSettings,
  loadSavedSettings,
} from "../../agentDevRootComponents/LabSettingsMenu";
import { LabProvider } from "../../agentDevRootComponents/LabContext";
import { getThemeColorClass } from "../themeHelpers";
import { StatePanel } from "../../../shared/components/StatePanel";

interface DevLushRunnerProps {
  chapter: LabData;
  onBack: () => void;
  onComplete: () => void;
}

const DevLushRunner: React.FC<DevLushRunnerProps> = ({
  chapter,
  onBack,
  onComplete,
}) => {
  const runnerTitleRef = useRef<HTMLHeadingElement>(null);
  const totalSteps = chapter.interactive_questions?.length ?? 0;
  const stepStorageKey = `devlush_step_${chapter.labComponentId}`;
  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem(stepStorageKey);
      const parsed = saved ? Number.parseInt(saved, 10) : 0;
      return Number.isFinite(parsed) && parsed >= 0 && totalSteps > 0
        ? Math.min(parsed, totalSteps - 1)
        : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(stepStorageKey);
      const parsed = saved ? Number.parseInt(saved, 10) : 0;
      setStep(Number.isFinite(parsed) && parsed >= 0 && totalSteps > 0 ? Math.min(parsed, totalSteps - 1) : 0);
    } catch {
      setStep(0);
    }
  }, [stepStorageKey, totalSteps]);

  useEffect(() => {
    try {
      sessionStorage.setItem(stepStorageKey, step.toString());
    } catch {
      // Progress remains usable for this session when browser storage is unavailable.
    }
  }, [step, stepStorageKey]);

  useEffect(() => {
    runnerTitleRef.current?.focus();
  }, [chapter.labComponentId]);
  const [settings, setSettings] = useState<LabSettings>(loadSavedSettings());
  const [infoVisible, setInfoVisible] = useState(!settings.hideTheoryDefault);
  const [infoPlacement, setInfoPlacement] = useState<"side" | "bottom">("side");

  const labContextValue = {
    courseType: "devLush" as const,
    labId: chapter.labComponentId,
    chapterTitle: chapter.chapter_title,
  };

  // Keep theory hidden if disabled in settings
  useEffect(() => {
    if (settings.disableTheory) {
      setInfoVisible(false);
    }
  }, [settings.disableTheory]);

  const LabComponent = devLushRegistry[chapter.labComponentId];

  if (!LabComponent) {
    return (
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-8"><StatePanel eyebrow={`Agent Labs · ${chapter.course}`} title="This activity is unavailable" description="The lesson exists in the curriculum, but its interactive component could not be loaded. Return to the topic to choose an available chapter." actionLabel="Back to topics" onAction={onBack} /></div>
    );
  }

  if (totalSteps === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl p-5 sm:p-8"><StatePanel eyebrow={`Agent Labs · ${chapter.course}`} title="This lesson has no activity yet" description="Return to the topic to choose a chapter with an available interactive activity." actionLabel="Back to topics" onAction={onBack} /></div>
    );
  }

  const isMultiStep = totalSteps > 1;

  const handlePrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      try {
        sessionStorage.removeItem(stepStorageKey);
      } catch {
        // Completion does not depend on browser storage.
      }
      onComplete();
    }
  };

  const themeColors = getThemeColorClass(chapter.course);

  return (
    <LabProvider value={labContextValue}>
      <div className="flex h-full min-w-0 w-full flex-col">
        <div className="min-h-0 w-full flex-1 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] custom-scrollbar sm:p-6 sm:pb-20">
          {/* Simulation Header Panel */}
          <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 sm:mb-6 sm:gap-4 lg:flex-row lg:items-center">
            <div className="flex min-w-0 items-start gap-2 sm:gap-4">
              <button
                type="button"
                onClick={onBack}
                aria-label="Back to Agent Labs topics"
                className="flex min-h-11 shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-3 text-sm font-bold text-slate-800 transition-all hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:px-4"
              >
                <ChevronLeft className="w-4 h-4" />
                Topics
              </button>
              <div className="flex min-w-0 flex-col">
                <span className={`mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest sm:text-xs ${themeColors.text}`}>
                  <Sparkles className="w-3.5 h-3.5" /> Agent Labs · {chapter.course}
                </span>
                <h2 ref={runnerTitleRef} tabIndex={-1} className="break-words font-heading text-xl leading-tight tracking-wide text-slate-900 focus:outline-none dark:text-white sm:text-2xl lg:text-4xl xl:text-5xl">
                  {chapter.chapter_title}
                </h2>
              </div>
            </div>

            {/* Simulation Controls Menu */}
            <div className="flex w-full flex-wrap items-center gap-2 sm:gap-3 lg:w-auto">
              <FavoriteButton
                id={chapter.labComponentId}
                type="devlush_lab"
                title={chapter.chapter_title}
                courseId={chapter.course}
                menuAlign="left"
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
                    aria-pressed={infoVisible}
                    title={
                      infoVisible
                        ? "Hide Theory Blueprint"
                        : "Show Theory Blueprint"
                    }
                    className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors ${infoVisible ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  {infoVisible && (
                    <>
                      <div className="mx-1 hidden h-4 w-px bg-slate-200 dark:bg-slate-800 lg:block" />
                      <button
                        type="button"
                        onClick={() => setInfoPlacement("side")}
                        aria-label="Show theory beside the lab on wide screens"
                        aria-pressed={infoPlacement === "side"}
                        title="Split Side Panel"
                        className={`hidden min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors lg:flex ${infoPlacement === "side" ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                      >
                        <Columns className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInfoPlacement("bottom")}
                        aria-label="Show theory below the lab"
                        aria-pressed={infoPlacement === "bottom"}
                        title="Bottom Panel View"
                        className={`hidden min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors lg:flex ${infoPlacement === "bottom" ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                      >
                        <Rows className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Option Visibility Toggle */}
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
                    title={
                      settings.hideQuestionDefault
                        ? "Maximize Sandbox Visual"
                        : "Show Verification Form"
                    }
                    aria-label={settings.hideQuestionDefault ? 'Show verification form' : 'Hide verification form'}
                    aria-pressed={!settings.hideQuestionDefault}
                    className={`min-h-11 rounded-lg px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${!settings.hideQuestionDefault ? `${themeColors.bgSoftGlow} ${themeColors.text}` : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  >
                    Form
                  </button>
                </div>
              )}
            </div>
          </div>

          <section aria-label="Current activity task" className="mb-4 max-w-4xl rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5"><p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">Step {step + 1} of {totalSteps} · {chapter.interactive_questions[step]?.title || 'Interactive activity'}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{chapter.interactive_questions[step]?.prompt || 'Explore the activity and review its feedback before moving to the next step.'}</p><p className="mt-2 text-xs text-slate-500">Activity feedback appears in the panel below. Advancing the chapter records progress; it does not grade this step.</p></section>

          {/* Activity navigation */}
          <div className="mb-4 mt-2 flex min-w-0 items-center justify-between gap-2 px-1 sm:px-1.5">
            <div className="flex items-center gap-2">
              {totalSteps > 0 && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wider">
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
                  title="Previous Exercise"
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-full border border-slate-200/60 bg-white text-slate-700 shadow-xs transition-all hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 ${step !== 0 ? themeColors.hoverShadow : ''}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                title={
                  step >= totalSteps - 1
                    ? "Complete Workspace"
                    : "Next Exercise"
                }
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white shadow-md transition-all ${themeColors.bg} ${themeColors.hoverBg} ${themeColors.shadowMd}`}
              >
                <span>{step >= totalSteps - 1 ? "Complete" : "Next"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Registered Sandbox Component */}
          <div className="relative flex min-h-[55vh] min-w-0 w-full flex-1 flex-col overflow-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 sm:min-h-[500px]">

            {/* Contextual Abstract SVG Visual Background for the Runner */}
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

                {/* Floating abstract tech geometry */}
                <g className={themeColors.text} opacity="0.6">
                  <circle cx="10%" cy="20%" r="100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                  <circle cx="90%" cy="80%" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M -100 300 Q 500 -100, 1100 500" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  <path d="M -100 400 Q 500 0, 1100 600" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                </g>
              </svg>
            </div>

            <div className="relative z-10 flex min-w-0 flex-1 flex-col bg-transparent p-2">
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
          </div>
        </div>
      </div>
    </LabProvider>
  );
};

export default DevLushRunner;
