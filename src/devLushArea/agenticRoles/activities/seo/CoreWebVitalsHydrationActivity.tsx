import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Sparkles, Gauge, Clock } from 'lucide-react';

export const CoreWebVitalsHydrationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

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

  // SVG Gauge calculations
  const gaugeAngle = (metrics.lcpMs / 5000) * 180;

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Profiling DOM...' : 'Profile Web Vitals'}
          </button>}>

    {/* Radial Metric Gauges */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button type="button"               aria-pressed={activeMetric === 'lcp'} onClick={() => setActiveMetric('lcp')}
        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
          activeMetric === 'lcp'
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-500/10'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400 block">LCP (Render Speed)</span>
        <div className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-0.5">{metrics.lcpMs}ms</div>
        <span className="text-sm text-rose-500 font-semibold">Poor (Target &lt;2.5s)</span>
      </button>

      <button type="button"               aria-pressed={activeMetric === 'inp'} onClick={() => setActiveMetric('inp')}
        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
          activeMetric === 'inp'
            ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400 block">INP (Responsiveness)</span>
        <div className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400 mt-0.5">{metrics.inpMs}ms</div>
        <span className="text-sm text-amber-500 font-semibold">Needs Work (&lt;200ms)</span>
      </button>

      <button type="button"               aria-pressed={activeMetric === 'cls'} onClick={() => setActiveMetric('cls')}
        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
          activeMetric === 'cls'
            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-500/10'
            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'
        }`}
      >
        <span className="text-sm font-mono uppercase text-slate-600 dark:text-slate-400 block">CLS (Layout Shift)</span>
        <div className="text-xl font-bold font-mono text-rose-700 dark:text-rose-400 mt-0.5">{metrics.clsScore}</div>
        <span className="text-sm text-rose-500 font-semibold">Poor (Target &lt;0.10)</span>
      </button>
    </div>

    {/* Long Tasks Waterfall Breakdown */}
    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3 shadow-sm">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
          Main-Thread Long Tasks Timeline (TBT: 640ms)
        </span>
        <span className="text-rose-700 dark:text-rose-400 text-sm font-bold">CRITICAL BOTTLENECK</span>
      </div>

      <div className="space-y-2">
        {metrics.blockingTasks.map((task, idx) => (
          <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-900 dark:text-white font-medium">{task.name}</span>
              <span className="text-rose-700 dark:text-rose-400 font-bold">{task.durationMs}ms</span>
            </div>
            <div className="w-full bg-slate-50 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full"
                style={{ width: `${(task.durationMs / 400) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
        <span>Recommended Architecture: Astro / Qwik Islands with Progressive Partial Hydration.</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default CoreWebVitalsHydrationActivity;
