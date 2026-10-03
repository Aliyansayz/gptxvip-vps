import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play } from 'lucide-react';

export const CartAbandonmentAgentActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isEvaluating, setIsEvaluating] = useState(false);

  const funnel = (currentExercise?.roleSpecificData as any)?.data?.cartAbandonmentFunnel || {
    intentScore: 0.88,
    cartValue: 185.00,
    timeIdleSeconds: 90,
    triggeredIncentivePct: 8.1,
    predictedConversionLift: 34.2
  };

  const handleEvaluate = () => {
    setIsEvaluating(true);
    toast.info("Scoring cart exit propensity vs customer lifetime value...");
    setTimeout(() => {
      setIsEvaluating(false);
      toast.success("Intent Score: 0.88 • Friction Point: Shipping Step • Recommended Incentive: Free Shipping ($15).");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleEvaluate}
            disabled={isEvaluating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            {isEvaluating ? 'Evaluating...' : 'Score Cart Intent'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Checkout Funnel Telemetry & Exit Risk</span>
        <span className="text-rose-700 dark:text-rose-400 font-bold">CART: ${funnel.cartValue.toFixed(2)}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">INTENT SCORE</span>
          <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{(funnel.intentScore * 100).toFixed(0)}%</span>
        </div>
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">IDLE ON SHIPPING</span>
          <span className="text-lg font-bold text-amber-700 dark:text-amber-400">{funnel.timeIdleSeconds}s</span>
        </div>
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-500 block">PREDICTED LIFT</span>
          <span className="text-lg font-bold text-rose-700 dark:text-rose-400">+{funnel.predictedConversionLift}%</span>
        </div>
      </div>

      <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm space-y-1">
        <span className="text-slate-600 dark:text-slate-400 font-bold">Friction Diagnosis:</span>
        <p className="text-slate-700 dark:text-slate-300">
          User hesitating specifically on the $15.00 shipping calculation step. Absorbing $15 preserves $170 in merchandise margin vs a $92.50 discount slash.
        </p>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default CartAbandonmentAgentActivity;
