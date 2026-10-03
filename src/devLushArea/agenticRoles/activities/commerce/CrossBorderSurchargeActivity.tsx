import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Check } from 'lucide-react';

export const CrossBorderSurchargeActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isRouting, setIsRouting] = useState(false);

  const handleRoute = () => {
    setIsRouting(true);
    toast.info("Calculating landed cost, preferential trade tariffs, and multi-hub freight...");
    setTimeout(() => {
      setIsRouting(false);
      toast.success("UK-Hub Selected: $12 freight + 0% tariff ($12.00 total) vs US-East ($32.40 total). Saved $20.40/unit!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleRoute}
            disabled={isRouting}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white  transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isRouting ? 'animate-spin' : ''}`} />
            {isRouting ? 'Routing...' : 'Optimize Landed Cost'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 font-mono text-sm text-slate-700 dark:text-slate-300 space-y-3">
      <div className="text-slate-600 dark:text-slate-400 font-bold pb-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span>Destination: Munich, Germany (Order #DE-88392)</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">DDP GUARANTEED</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <div className="text-slate-600 dark:text-slate-400 font-bold">Route A: US-East 3PL</div>
          <div className="text-sm text-slate-700 dark:text-slate-300">Freight: $18.00</div>
          <div className="text-sm text-rose-700 dark:text-rose-400 font-bold">EU Import Tariff: +$14.40 (12%)</div>
          <div className="pt-1 text-slate-500 text-sm border-t border-slate-200 dark:border-slate-800">Total: $32.40 • Transit: 6-9 Days</div>
        </div>

        <div className="p-3 rounded bg-white dark:bg-slate-900 border border-emerald-500/40 space-y-1">
          <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Route B: UK-Hub 3PL
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300">Freight: $12.00</div>
          <div className="text-sm text-emerald-700 dark:text-emerald-400 font-bold">Preferential Tariff: $0.00 (0%)</div>
          <div className="pt-1 text-emerald-500 text-sm border-t border-slate-200 dark:border-slate-800">Total: $12.00 • Transit: 2 Days</div>
        </div>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default CrossBorderSurchargeActivity;
