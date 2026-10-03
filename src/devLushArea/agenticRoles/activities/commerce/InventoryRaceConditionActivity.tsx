import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import React, { useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { Play, Lock, Check, X } from 'lucide-react';

export const InventoryRaceConditionActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete
}) => {
  const currentExercise = exercises[step] || exercises[0];

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedRequests, setSimulatedRequests] = useState([
    { id: 1, client: 'Buyer_Bot_Alpha', latencyMs: 1.2, acquiredLock: true, status: 'FULFILLED' },
    { id: 2, client: 'Mobile_App_User_99', latencyMs: 2.1, acquiredLock: true, status: 'FULFILLED' },
    { id: 3, client: 'Buyer_Bot_Beta', latencyMs: 3.4, acquiredLock: true, status: 'FULFILLED' },
    { id: 4, client: 'Web_Checkout_41', latencyMs: 4.8, acquiredLock: false, status: '409_EXHAUSTED' },
    { id: 5, client: 'Buyer_Bot_Gamma', latencyMs: 6.2, acquiredLock: false, status: '409_EXHAUSTED' }
  ]);

  const handleSimulate = () => {
    setIsSimulating(true);
    toast.info("Simulating 8 concurrent checkout requests hitting Redis Redlock within a 15ms window...");
    setTimeout(() => {
      setIsSimulating(false);
      toast.success("Redis Redlock: 3 Atomic units allocated in 3.4ms. 5 backorders cleanly prevented (0 oversells)!");
    }, 1000);
  };

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={<button type="button"
            onClick={handleSimulate}
            disabled={isSimulating}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Acquiring Locks...' : 'Simulate Flash Drop'}
          </button>}>

    <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 text-sm">
        <span className="font-mono text-slate-600 dark:text-slate-400">Distributed Lock Timeline (Available Stock: 3 Units)</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">0 OVERSELL DRIFT</span>
      </div>

      {/* Request Timeline Rows */}
      <div className="space-y-2">
        {simulatedRequests.map((req) => (
          <div
            key={req.id}
            className={`p-2.5 rounded-lg border flex flex-wrap items-center justify-between gap-3 text-sm font-mono transition-colors ${
              req.acquiredLock
                ? 'bg-white dark:bg-slate-900 border-emerald-500/40 text-slate-700 dark:text-slate-200'
                : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${req.acquiredLock ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
              <span className="text-slate-900 dark:text-white font-bold">{req.client}</span>
              <span className="text-slate-500 text-sm">+{req.latencyMs}ms</span>
            </div>

            <div className="flex items-center gap-2">
              {req.acquiredLock ? (
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> ATOMIC LOCK ACQUIRED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 text-sm font-bold flex items-center gap-1">
                  <X className="w-3 h-3" /> 409 STOCK EXHAUSTED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-mono text-slate-600 dark:text-slate-400">
        <span>Redis Cluster TTL: 300s</span>
        <span className="text-emerald-700 dark:text-emerald-400 font-bold">Optimistic Concurrency Enforced</span>
      </div>
    </div>

    </RoleActivityFrame>
  );
};

export default InventoryRaceConditionActivity;
