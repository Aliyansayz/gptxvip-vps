import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

export const ShapWaterfallExplainabilityActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isComputingShap, setIsComputingShap] = useState(false);

  const shapData = [
    { feature: "Baseline Expected Value E[f(x)]", baselineValue: 0.65, shapContribution: 0.0, finalPrediction: 0.65, base: 0, width: 65, color: "bg-cyan-500" },
    { feature: "Debt-to-Income (DTI = 18%)", baselineValue: 0.65, shapContribution: 0.12, finalPrediction: 0.77, base: 65, width: 12, color: "bg-emerald-500", positive: true },
    { feature: "Credit Inquiries (6 in 90d)", baselineValue: 0.77, shapContribution: -0.22, finalPrediction: 0.55, base: 55, width: 22, color: "bg-rose-500", negative: true },
    { feature: "Derogatory Public Records (2)", baselineValue: 0.55, shapContribution: -0.17, finalPrediction: 0.38, base: 38, width: 17, color: "bg-rose-500", negative: true }
  ];

  const handleComputeShap = () => {
    setIsComputingShap(true);
    toast.info("Computing TreeSHAP additive feature attributions for loan decision audit...");
    setTimeout(() => {
      setIsComputingShap(false);
      toast.error("Adverse Action Breakdown: Baseline 65% Approval dropped to 38% (Denied) primarily due to Credit Inquiries (-22%) and Derogatory Records (-17%)!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleComputeShap}
            disabled={isComputingShap}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isComputingShap ? 'animate-spin' : ''}`} />
            {isComputingShap ? 'Attributing...' : 'Decompose SHAP Tree'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">TreeSHAP Additive Attribution Waterfall</span>
        <span className="text-rose-700 dark:text-rose-400 font-mono font-bold">f(x) = 38.0% (DENIED &lt; 50%)</span>
      </div>

      {/* Waterfall Floating Bars */}
      <div className="space-y-3 pt-1">
        {shapData.map((item, idx) => {
          const isBase = idx === 0;

          return (
            <div key={idx} className="space-y-1 font-mono text-sm">
              <div className="flex justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.feature}</span>
                <span className={item.positive ? "text-emerald-700 dark:text-emerald-400 font-bold" : item.negative ? "text-rose-700 dark:text-rose-400 font-bold" : "text-cyan-700 dark:text-cyan-400 font-bold"}>
                  {isBase ? "E[f(x)] = 65%" : item.positive ? `+${(item.shapContribution * 100).toFixed(0)}%` : `${(item.shapContribution * 100).toFixed(0)}%`}
                </span>
              </div>

              {/* Floating bar lane */}
              <div className="w-full bg-white dark:bg-slate-900 h-5 rounded overflow-hidden relative border border-slate-200 dark:border-slate-800">
                <div
                  className={`${item.color} h-full rounded transition-colors flex items-center justify-center text-sm text-slate-900 dark:text-white font-bold shadow-md`}
                  style={{
                    marginLeft: `${item.base}%`,
                    width: `${item.width}%`
                  }}
                >
                  {(item.finalPrediction * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-mono text-slate-600 dark:text-slate-400">
        <span>Final Probability Output: <span className="text-rose-700 dark:text-rose-400 font-bold">0.38</span></span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Additive Invariant Satisfied</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default ShapWaterfallExplainabilityActivity;
