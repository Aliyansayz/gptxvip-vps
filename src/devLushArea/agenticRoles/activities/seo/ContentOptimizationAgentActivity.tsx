import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Check } from 'lucide-react';

export const ContentOptimizationAgentActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    toast.info("Scoring semantic entity coverage and EEAT authenticity...");
    setTimeout(() => {
      setIsOptimizing(false);
      toast.success("Entity coverage lifted from 42% to 88% with zero repetitive keyword stuffing.");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Run Content Agent'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Canonical URL Governance & Duplicate Taxonomy</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">ACTIVE PROTOCOL</span>
      </div>
      <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="text-slate-600 dark:text-slate-400 text-sm">Parameterized Ingestion URLs:</div>
        <div className="text-rose-700 dark:text-rose-400 font-mono text-sm">https://example.com/shoes?color=blue&sort=asc&session=9941</div>
        <div className="text-rose-700 dark:text-rose-400 font-mono text-sm">https://example.com/shoes?utm_source=fb&variant=33</div>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm">
          <Check className="w-3.5 h-3.5" />
          <span>Enforced Master Canonical: &lt;link rel="canonical" href="https://example.com/shoes" /&gt;</span>
        </div>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default ContentOptimizationAgentActivity;
