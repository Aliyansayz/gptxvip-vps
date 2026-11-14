import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Scale } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

export const AttributionIncrementalityActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [viewMode, setViewMode] = useState<'platform' | 'holdout'>('platform');
  const [rebalanced, setRebalanced] = useState(false);

  const attr = (currentExercise?.roleSpecificData as any)?.data?.attributionLift;
  const platformRoas = attr?.platformReportedRoas ?? 8.6;
  const capiRoas = attr?.capiDeduplicatedRoas ?? 5.2;
  const holdoutRoas = attr?.geoHoldoutIncrementalRoas ?? 1.15;
  const blendedMer = attr?.blendedMer ?? 3.45;

  const prospectingRoas = viewMode === 'platform' ? 2.8 : 3.1;
  const retargetingRoas = viewMode === 'platform' ? platformRoas : holdoutRoas;

  const handleRebalance = () => {
    setViewMode('holdout');
    setRebalanced(true);
    toast.success('Reallocated 35% of marginal retargeting spend toward incremental upper-funnel prospecting.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleRebalance}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 cursor-pointer"
        >
          <Scale className="h-3.5 w-3.5" />
          Reconcile & Rebalance Budget
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Attribution Lens Reconciliation
          </span>
          <div className="flex gap-1.5">
            <button
              type="button"
              aria-pressed={viewMode === 'platform'}
              onClick={() => setViewMode('platform')}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                viewMode === 'platform'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              Ad Manager (1d View + 7d Click)
            </button>
            <button
              type="button"
              aria-pressed={viewMode === 'holdout'}
              onClick={() => setViewMode('holdout')}
              className={`rounded-md border px-2.5 py-1 text-xs font-semibold cursor-pointer ${
                viewMode === 'holdout'
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              Geo-Holdout Causal Lift
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Retargeting ROAS</span>
            <p className={`mt-1 text-xl font-bold font-mono ${retargetingRoas < 2 ? 'text-rose-600 dark:text-rose-400' : 'text-blue-700 dark:text-blue-400'}`}>
              {retargetingRoas.toFixed(2)}x
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {viewMode === 'platform' ? 'Includes 74% view-through' : 'True incremental lift'}
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Prospecting Video ROAS</span>
            <p className="mt-1 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {prospectingRoas.toFixed(2)}x
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {viewMode === 'platform' ? 'Under-credited upper funnel' : 'Highest causal lift'}
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">CAPI Dedup / Blended MER</span>
            <p className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {capiRoas.toFixed(1)}x / {blendedMer.toFixed(2)}x
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Finance-ledger anchor</span>
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          {[
            { label: 'Retargeting Ad Set', roas: retargetingRoas, max: 10, color: viewMode === 'platform' ? 'bg-amber-500' : 'bg-rose-500' },
            { label: 'Prospecting Video', roas: prospectingRoas, max: 10, color: 'bg-emerald-500' },
          ].map((row) => (
            <div key={row.label} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{row.label}</span>
                <span className="font-bold">{row.roas.toFixed(2)}x</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className={`h-full rounded-full transition-all duration-300 ${row.color}`} style={{ width: `${(row.roas / row.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        {rebalanced && (
          <div role="status" className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Budget rebalanced: shifted 35% from 1.15x view-through retargeting into 3.10x incremental prospecting video, anchored by CAPI event_id deduplication and blended MER ({blendedMer}x).
            </span>
          </div>
        )}
      </div>
    </RoleActivityFrame>
  );
};

export default AttributionIncrementalityActivity;
