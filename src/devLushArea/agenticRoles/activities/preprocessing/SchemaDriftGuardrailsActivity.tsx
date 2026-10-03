import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const SchemaDriftGuardrailsActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isEnforcing, setIsEnforcing] = useState(false);

  const rules = (currentExercise?.roleSpecificData as any)?.data?.schemaDriftRules || [
    { field: "postal_code", expectedType: "int32", actualDetectedType: "string ('M5V 2T6', '90210-4412')", coercionSafe: true }
  ];

  const handleEnforce = () => {
    setIsEnforcing(true);
    toast.info("Enforcing runtime Pydantic / Zod schema contract on incoming batch...");
    setTimeout(() => {
      setIsEnforcing(false);
      toast.success("Schema Drift Handled: Evolved postal_code to VARCHAR(16) with regex validation. 0 records dropped!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleEnforce}
            disabled={isEnforcing}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isEnforcing ? 'animate-spin' : ''}`} />
            {isEnforcing ? 'Enforcing...' : 'Enforce Contract'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Data Contract Type Drift Alert</span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">TYPE MISMATCH</span>
      </div>

      <div className="space-y-2">
        {rules.map((rule: any, idx: number) => (
          <div key={idx} className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-900 dark:text-white font-bold">{rule.field}</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 text-sm font-bold">
                SCHEMA EVOLUTION REQUIRED
              </span>
            </div>
            <div className="text-sm flex justify-between text-slate-600 dark:text-slate-400">
              <span>Expected Contract: <code className="text-cyan-700 dark:text-cyan-300">{rule.expectedType}</code></span>
              <span>Received Ingest: <code className="text-rose-700 dark:text-rose-300">{rule.actualDetectedType}</code></span>
            </div>
          </div>
        ))}
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default SchemaDriftGuardrailsActivity;
