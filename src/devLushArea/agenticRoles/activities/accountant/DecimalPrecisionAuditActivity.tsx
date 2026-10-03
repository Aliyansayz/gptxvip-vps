import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Bug, Check } from 'lucide-react';

export const DecimalPrecisionAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isAuditing, setIsAuditing] = useState(false);

  const handleAudit = () => {
    setIsAuditing(true);
    toast.info("Auditing IEEE-754 binary floating-point drift across micro-billing rows...");
    setTimeout(() => {
      setIsAuditing(false);
      toast.error("Float Drift Detected: 10M requests * $0.00035 = -$420.18 accumulated bank variance!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-amber-600 hover:bg-amber-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing...' : 'Audit Float Math'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>IEEE-754 vs Arbitrary Precision Comparison</span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">DRIFT: -$420.18</span>
      </div>
      <div className="space-y-2">
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-rose-700 dark:text-rose-400 font-bold flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Unsafe Schema: `unit_price FLOAT4`
          </div>
          <div className="text-slate-600 dark:text-slate-400 text-sm">
            0.1 + 0.2 = 0.30000000000000004 (Binary Representation Flaw)
          </div>
          <div className="text-slate-500 text-sm">
            10,000,000 requests computed total: $3,499,579.82 (Bank expected: $3,500,000.00)
          </div>
        </div>

        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-emerald-500/30 space-y-1">
          <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
            <Check className="w-4 h-4" />
            Remediated Schema: `unit_price NUMERIC(18, 6)`
          </div>
          <div className="text-slate-700 dark:text-slate-300 text-sm">
            Exact integer micro-cent arithmetic with Banker's Rounding (Round-Half-to-Even)
          </div>
        </div>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default DecimalPrecisionAuditActivity;
