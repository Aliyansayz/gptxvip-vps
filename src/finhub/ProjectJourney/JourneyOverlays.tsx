import React from "react";

interface Props {
  progress: number;
  status: string;
  onProgressChange: (nextProgress: number) => void;
  progressDisabled?: boolean;
}

export const JourneyOverlays: React.FC<Props> = ({ progress, status, onProgressChange, progressDisabled = false }) => {
  return (
    <div className="pointer-events-auto absolute inset-x-2 bottom-2 z-30 rounded-2xl border border-slate-200 bg-white/95 px-3 py-3 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/95 sm:inset-x-4 sm:bottom-4 sm:px-5 sm:py-4 lg:inset-x-10 lg:bottom-8">
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 sm:text-[10px]">Global Status</div>
            <div className="truncate text-sm font-bold tracking-tight text-slate-800 dark:text-zinc-100 sm:text-lg">{status}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400 sm:text-[10px]">Track Progress</div>
            <div className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:text-lg">{Math.round(progress * 100)}%</div>
          </div>
        </div>
        <label className="sr-only" htmlFor="project-journey-progress">Journey progress</label>
        <input
          id="project-journey-progress"
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={progress}
          disabled={progressDisabled}
          onChange={(event) => onProgressChange(Number(event.currentTarget.value))}
          aria-valuetext={`${Math.round(progress * 100)} percent`}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800"
        />
        <p id="project-journey-help" className="text-center text-[9px] leading-tight text-slate-500 dark:text-zinc-400 sm:text-[10px]">
          Drag the timeline, scroll, swipe, or use the arrow keys to explore.
        </p>
      </div>
    </div>
  );
};
