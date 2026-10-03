import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const CashFlowRunwayForecastActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isSimulating, setIsSimulating] = useState(false);
  const [monthlyBurn, setMonthlyBurn] = useState(200000);

  const currentCash = 2400000;
  const p50Runway = (currentCash / monthlyBurn).toFixed(1);
  const p95Runway = ((currentCash / monthlyBurn) * 0.6).toFixed(1);

  const handleSimulate = () => {
    setIsSimulating(true);
    toast.info("Executing 10,000 stochastic Monte Carlo iterations with volatile receivable delay parameters...");
    setTimeout(() => {
      setIsSimulating(false);
      toast.success(`Monte Carlo Complete: P50 (Median) = ${p50Runway} Months • P95 (Conservative) = ${p95Runway} Months!`);
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Simulating 10k paths...' : 'Run Monte Carlo'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm relative overflow-hidden space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">12-Month Stochastic Treasury Trajectory ($2.4M Initial)</span>
        <div className="flex items-center gap-2 font-mono text-sm text-slate-600 dark:text-slate-400">
          <span>Burn:</span>
          <input aria-label="Monthly burn rate"
            type="range"
            min="100000"
            max="400000"
            step="25000"
            value={monthlyBurn}
            onChange={(e) => setMonthlyBurn(parseInt(e.target.value))}
            className="w-20 accent-amber-500 cursor-pointer"
          />
          <span className="text-amber-700 dark:text-amber-400 font-bold">${(monthlyBurn / 1000).toFixed(0)}k/mo</span>
        </div>
      </div>

      {/* SVG Fan Chart */}
      <div className="w-full h-[260px] sm:h-[360px] bg-white dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800/80 p-3 relative flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 400 140">
          {/* Zero-Cash Line */}
          <line x1="20" y1="120" x2="380" y2="120" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />
          <text className="text-slate-700 dark:text-slate-300" x="380" y="116" textAnchor="end" fill="currentColor" fontSize="8" fontFamily="monospace">$0 (Insolvency)</text>

          {/* Shaded P10-P90 Fan Envelope */}
          <polygon
            points="20,20 120,45 220,85 300,120 220,105 120,65 20,20"
            fill="#F59E0B"
            fillOpacity="0.15"
          />

          {/* P95 Conservative Trajectory Line (Red) */}
          <polyline
            points="20,20 100,55 180,95 240,120"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            className={isSimulating ? "animate-pulse" : ""}
          />

          {/* P50 Median Trajectory Line (Amber) */}
          <polyline
            points="20,20 100,45 200,75 300,105 360,120"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.5"
          />

          {/* Initial Node */}
          <circle cx="20" cy="20" r="4" fill="#10B981" />
          <text className="text-slate-700 dark:text-slate-300" x="28" y="24" fill="currentColor" fontSize="9" fontWeight="bold" fontFamily="monospace">$2.4M (M0)</text>

          {/* P95 Zero Cash Point */}
          <circle cx="240" cy="120" r="4" fill="#F43F5E" />
          <text className="text-slate-700 dark:text-slate-300" x="240" y="134" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">P95: {p95Runway} Mo</text>

          {/* P50 Zero Cash Point */}
          <circle cx="360" cy="120" r="4" fill="#F59E0B" />
          <text className="text-slate-700 dark:text-slate-300" x="360" y="134" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">P50: {p50Runway} Mo</text>
        </svg>
      </div>

      {/* Metric Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center pt-1 font-mono text-sm">
        <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">TREASURY CASH</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">$2.40M</span>
        </div>
        <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">P50 RUNWAY</span>
          <span className="text-amber-700 dark:text-amber-400 font-bold text-sm">{p50Runway} Mo</span>
        </div>
        <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-rose-500/30">
          <span className="text-sm text-slate-500 block">P95 CONSERVATIVE</span>
          <span className="text-rose-700 dark:text-rose-400 font-bold text-sm">{p95Runway} Mo</span>
        </div>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default CashFlowRunwayForecastActivity;
