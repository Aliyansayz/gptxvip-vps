import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Check } from 'lucide-react';

export const TargetEncodingLeakageActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Auditing target correlation before and after K-Fold train/test split...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.error("Target Leakage Detected! Full-dataset target encoding caused 41% validation generalization collapse (Train AUC 0.99 vs Test AUC 0.58).");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing...' : 'Audit Data Leakage'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Feature Leakage Impact Analysis (Merchant ID: 40,000 Levels)</span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">41% GENERALIZATION GAP</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-rose-500/40 space-y-1 text-center">
          <span className="text-sm text-slate-500">TRAIN AUC (OVERFITTED)</span>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-mono">0.992</div>
          <span className="text-sm text-rose-700 dark:text-rose-400 font-bold">Target Encoded pre-split</span>
        </div>
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-rose-500/40 space-y-1 text-center">
          <span className="text-sm text-slate-500">TEST AUC (GENERALIZATION)</span>
          <div className="text-2xl font-bold text-rose-700 dark:text-rose-400 font-mono">0.581</div>
          <span className="text-sm text-rose-500 font-bold">Collapses on unseen rows</span>
        </div>
      </div>

      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-emerald-500/30 text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> Remediated K-Fold OOF Architecture:
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Fit TargetEncoder on 4 folds, transform 5th fold with m-estimate smoothing m=10.0. Restores validation AUC to 0.884.
        </p>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default TargetEncodingLeakageActivity;
