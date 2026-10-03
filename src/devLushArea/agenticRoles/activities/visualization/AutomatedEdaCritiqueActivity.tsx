import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, AlertTriangle, Check } from 'lucide-react';

export const AutomatedEdaCritiqueActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isCritiquing, setIsCritiquing] = useState(false);

  const handleCritique = () => {
    setIsCritiquing(true);
    toast.info("Auditing Edward Tufte Data-Ink ratios and non-zero baseline distortions...");
    setTimeout(() => {
      setIsCritiquing(false);
      toast.error("Deceptive Chart Scale Flagged: Y-axis baseline begins at 97.0%, visually exaggerating a minor 0.8% difference into a 4x bar height distortion!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleCritique}
            disabled={isCritiquing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isCritiquing ? 'animate-spin' : ''}`} />
            {isCritiquing ? 'Critiquing...' : 'Audit Data-Ink'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Deceptive Axis Truncation vs Grounded Baseline</span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">DELTA: +0.8%</span>
      </div>

      <div className="p-3 rounded bg-white dark:bg-slate-900 border border-rose-500/30 space-y-2">
        <div className="text-rose-700 dark:text-rose-400 font-bold text-sm flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4" /> Deceptive Truncated Scale [97.0% - 98.5%]
        </div>
        <div className="flex items-end gap-6 h-28 pt-2">
          <div className="flex-1 text-center space-y-1">
            <div className="bg-rose-500/80 rounded-t h-20 flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm">
              98.2%
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Competitor Bar (Looks 4x Taller)</span>
          </div>
          <div className="flex-1 text-center space-y-1">
            <div className="bg-purple-500/80 rounded-t h-5 flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm">
              97.4%
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Our Bar (Artificially Crushed)</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-emerald-500/30 text-sm text-slate-700 dark:text-slate-300 space-y-1">
        <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" /> Ethical Redesign:
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Ground Y-axis baseline at 0.0%, or present a labeled dot plot with confidence intervals and an explicit "+0.8% difference" callout banner.
        </p>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default AutomatedEdaCritiqueActivity;
