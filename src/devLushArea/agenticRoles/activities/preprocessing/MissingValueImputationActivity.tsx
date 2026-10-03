import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const MissingValueImputationActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isImputing, setIsImputing] = useState(false);
  const [isImputed, setIsImputed] = useState(false);

  // Simulated 6x8 cell missingness matrix grid
  const featureCols = ["Age", "BUN", "Creatinine", "BP_Sys", "BP_Dia", "Glucose"];

  const handleImpute = () => {
    setIsImputing(true);
    toast.info("Fitting MICE multivariate chained regression on Age, Creatinine, and BUN...");
    setTimeout(() => {
      setIsImputing(false);
      setIsImputed(true);
      toast.success("MICE Imputation Complete! 800 missing Creatinine cells imputed with preserved covariance.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleImpute}
            disabled={isImputing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isImputing ? 'animate-spin' : ''}`} />
            {isImputing ? 'Chaining Equations...' : 'Run MICE Imputation'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Feature Missingness Profiler Matrix (10k Rows)</span>
        <span className={isImputed ? "text-emerald-700 dark:text-emerald-400 font-mono font-bold" : "text-rose-700 dark:text-rose-400 font-mono font-bold"}>
          {isImputed ? "0 NULL CELLS (MICE IMPUTED)" : "800 NULL CREATININE CELLS"}
        </span>
      </div>

      {/* Matrix Visualizer Table */}
      <div className="grid grid-cols-6 gap-2 text-center text-sm font-mono">
        {featureCols.map((col, idx) => (
          <div key={col} className="space-y-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-bold block">{col}</span>
            {/* Vertical mini sparkline blocks */}
            <div className="space-y-1">
              {[1, 2, 3, 4].map((row) => {
                const isMissingCell = col === "Creatinine" && row >= 2;
                return (
                  <div
                    key={row}
                    className={`h-6 rounded flex items-center justify-center text-[9px] font-bold transition-colors ${
                      isMissingCell
                        ? isImputed
                          ? 'bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 animate-pulse'
                          : 'bg-rose-500/30 text-rose-700 dark:text-rose-300 border border-rose-500/40'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {isMissingCell ? (isImputed ? "1.12*" : "NULL") : "OK"}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Statistical Diagnostics */}
      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
        <span className="text-slate-600 dark:text-slate-400">Little's MCAR Test: <span className="text-rose-700 dark:text-rose-400 font-bold">p &lt; 0.001 (MAR)</span></span>
        <span className="text-cyan-700 dark:text-cyan-400 font-bold">Covariance Preserved (r = 0.74)</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default MissingValueImputationActivity;
