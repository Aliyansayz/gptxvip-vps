import React from "react";
import { Activity, ArrowUpRight, BookOpenText, CheckCircle2, Lightbulb } from "lucide-react";

export interface AlgoTradingVisualLabProps {
  eyebrow: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  controls: React.ReactNode;
  insight: React.ReactNode;
  formula?: React.ReactNode;
  onComplete?: () => void;
}

export const AlgoTradingChoiceButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={[
      "rounded-xl border px-3 py-2 text-sm font-semibold transition",
      active
        ? "border-emerald-500 bg-emerald-500 text-emerald-950 shadow-sm"
        : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-400 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-emerald-300",
    ].join(" ")}
  >
    {children}
  </button>
);

export const AlgoTradingSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  displayValue?: string;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step = 1, displayValue, onChange }) => (
  <label className="block space-y-2">
    <span className="flex items-center justify-between gap-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
      <span>{label}</span>
      <span className="rounded-md bg-emerald-50 px-2 py-1 font-mono text-xs text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
        {displayValue || value}
      </span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full accent-emerald-500"
    />
    <span className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-400">
      <span>{min}</span>
      <span>{max}</span>
    </span>
  </label>
);

export const AlgoTradingVisualLab: React.FC<AlgoTradingVisualLabProps> = ({
  eyebrow,
  title,
  description,
  visual,
  controls,
  insight,
  formula,
  onComplete,
}) => (
  <section className="mx-auto w-full max-w-6xl space-y-4 text-zinc-900 dark:text-zinc-100">
    <header className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-5 dark:border-emerald-900/60 dark:from-zinc-950 dark:to-emerald-950/30 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300">
          <Activity className="h-3.5 w-3.5" />
          {eyebrow}
        </div>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{description}</p>
      </div>
      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 sm:flex">
        <ArrowUpRight className="h-6 w-6" />
      </div>
    </header>

    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.8fr)]">
      <div className="flex min-h-[320px] min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70 sm:p-5">
        {visual}
      </div>

      <aside className="flex min-w-0 flex-col gap-4">
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
            <Activity className="h-4 w-4 text-emerald-500" />
            Change the inputs
          </div>
          {controls}
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-300">
            <Lightbulb className="h-4 w-4" />
            What changed
          </div>
          <div className="text-sm leading-relaxed text-emerald-950 dark:text-emerald-100">{insight}</div>
        </section>

        {formula && (
          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-400">
              <BookOpenText className="h-3.5 w-3.5" />
              Formula / code link
            </div>
            <div className="font-mono text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">{formula}</div>
          </section>
        )}
      </aside>
    </div>

    {onComplete && (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-black text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-[0.98]"
        >
          <CheckCircle2 className="h-4 w-4" />
          Mark activity learned
        </button>
      </div>
    )}
  </section>
);
