import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, RotateCcw, Activity, Sparkles, ShieldCheck, Gauge, Layers, Clock } from 'lucide-react';
import { getDifficultyBadge } from '../../agenticThemeHelpers';

export const CoreWebVitalsHydrationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeMetric, setActiveMetric] = useState<'lcp' | 'inp' | 'cls'>('lcp');

  const [metrics, setMetrics] = useState({
    lcpMs: 3800,
    inpMs: 450,
    clsScore: 0.22,
    blockingTasks: [
      { name: 'Monolithic Client Hydration (bundle.js)', durationMs: 380, blocking: true },
      { name: 'Third-Party Analytics Tracking Script', durationMs: 160, blocking: true },
      { name: 'DOM Layout & Style Recalculation', durationMs: 100, blocking: true }
    ]
  });

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Profiling headless Chrome DevTools Performance timeline & Long Tasks...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.error("LCP 3,800ms (Fail) • INP 450ms (Fail) • Total Blocking Time: 640ms detected!");
    }, 1000);
  };

  const handleVerify = () => {
    if (!selectedOption) {
      toast.error("Please choose a candidate response.");
      return;
    }
    const correct = selectedOption === currentExercise.answer;
    setIsCorrect(correct);
    setIsEvaluated(true);
    if (correct) {
      toast.success("Correct performance remediation!");
      if (onComplete) onComplete();
    } else {
      toast.error("Incorrect. Check hydration blockages and modern Islands architecture.");
    }
  };

  const badge = getDifficultyBadge(currentExercise?.difficulty || 'hard');

  // SVG Gauge calculations
  const gaugeAngle = (metrics.lcpMs / 5000) * 180;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Gauge className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              {currentExercise?.title || 'Core Web Vitals & Hydration Performance Profiling'}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                PROFILER HUD
              </span>
            </h2>
            <p className="text-xs text-slate-400">SEO Agentic Analyst • Day 4 Mission • Headless Chrome Trace</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${badge.badgeClass}`}>
            {badge.label}
          </span>
          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Profiling DOM...' : 'Profile Web Vitals'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Radial Gauge & Long Task Scrubber (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Radial Metric Gauges */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setActiveMetric('lcp')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeMetric === 'lcp'
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block">LCP (Render Speed)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{metrics.lcpMs}ms</div>
              <span className="text-[10px] text-rose-500 font-semibold">Poor (Target &lt;2.5s)</span>
            </button>

            <button
              onClick={() => setActiveMetric('inp')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeMetric === 'inp'
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block">INP (Responsiveness)</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">{metrics.inpMs}ms</div>
              <span className="text-[10px] text-amber-500 font-semibold">Needs Work (&lt;200ms)</span>
            </button>

            <button
              onClick={() => setActiveMetric('cls')}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                activeMetric === 'cls'
                  ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-500/10'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 block">CLS (Layout Shift)</span>
              <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{metrics.clsScore}</div>
              <span className="text-[10px] text-rose-500 font-semibold">Poor (Target &lt;0.10)</span>
            </button>
          </div>

          {/* Long Tasks Waterfall Breakdown */}
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-3 shadow-xl">
            <div className="text-slate-400 font-bold pb-2 border-b border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Main-Thread Long Tasks Timeline (TBT: 640ms)
              </span>
              <span className="text-rose-400 text-[11px] font-bold">CRITICAL BOTTLENECK</span>
            </div>

            <div className="space-y-2">
              {metrics.blockingTasks.map((task, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">{task.name}</span>
                    <span className="text-rose-400 font-bold">{task.durationMs}ms</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                      style={{ width: `${(task.durationMs / 400) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Recommended Architecture: Astro / Qwik Islands with Progressive Partial Hydration.</span>
            </div>
          </div>
        </div>

        {/* Right: Assessment Challenge (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 shadow-xl flex flex-col h-full justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Vitals Engineering Challenge
              </span>
              <p className="text-xs text-slate-400">{currentExercise?.prompt}</p>
              <h3 className="text-sm font-semibold text-white">{currentExercise?.question}</h3>

              <div className="space-y-2 pt-1">
                {currentExercise?.options?.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  let style = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700';
                  if (isEvaluated) {
                    if (opt === currentExercise.answer) style = 'border-emerald-500 bg-emerald-500/15 text-emerald-300 font-semibold';
                    else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-500/15 text-rose-300';
                  } else if (isSelected) {
                    style = 'border-emerald-500 bg-emerald-500/10 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isEvaluated}
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full p-3 rounded-lg border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer ${style}`}
                    >
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {isEvaluated && (
                <div className={`p-3 rounded-lg text-xs border ${isCorrect ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300' : 'bg-rose-950/30 border-rose-800 text-rose-300'}`}>
                  <p className="font-semibold mb-1">{isCorrect ? 'Analysis Confirmed:' : 'Evaluation:'}</p>
                  <p className="text-slate-300 text-[11px]">{currentExercise.explanation}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {isEvaluated ? (
                <button
                  onClick={() => { setIsEvaluated(false); setSelectedOption(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              ) : <div className="text-[11px] text-slate-500 font-mono">Select performance fix</div>}

              {!isEvaluated && (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Deploy Optimization
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoreWebVitalsHydrationActivity;
