import React, { useState } from 'react';
import { GitMerge, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

type AdSetNode = {
  id: string;
  name: string;
  audienceSize: number;
  dailySpendUsd: number;
  cpmUsd: number;
};

type OverlapPair = { source: string; target: string; overlapPct: number };

const DEFAULT_AD_SETS: AdSetNode[] = [
  { id: 'lal-1', name: 'AdSet-LAL-1%', audienceSize: 1800000, dailySpendUsd: 450, cpmUsd: 26.4 },
  { id: 'interest-saas', name: 'AdSet-Interest-SaaS', audienceSize: 2100000, dailySpendUsd: 420, cpmUsd: 28.1 },
  { id: 'retarget-30d', name: 'AdSet-Retarget-30D', audienceSize: 95000, dailySpendUsd: 180, cpmUsd: 34.5 },
];

const DEFAULT_PAIRS: OverlapPair[] = [
  { source: 'lal-1', target: 'interest-saas', overlapPct: 72 },
  { source: 'lal-1', target: 'retarget-30d', overlapPct: 41 },
  { source: 'interest-saas', target: 'retarget-30d', overlapPct: 38 },
];

export const AudienceOverlapGraphActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [consolidated, setConsolidated] = useState(false);
  const [excludeCustomers, setExcludeCustomers] = useState(false);

  const overlapData = (currentExercise?.roleSpecificData as any)?.data?.audienceOverlap;
  const adSets: AdSetNode[] = overlapData?.adSets || DEFAULT_AD_SETS;
  const pairs: OverlapPair[] = overlapData?.overlapPairs || DEFAULT_PAIRS;

  const estimatedCpm = consolidated
    ? excludeCustomers
      ? 19.2
      : 21.8
    : excludeCustomers
      ? 24.9
      : 28.1;

  const effectiveOverlap = (pair: OverlapPair) => {
    if (consolidated && pair.source === 'lal-1' && pair.target === 'interest-saas') return 0;
    if (excludeCustomers && pair.target === 'retarget-30d') return Math.max(4, pair.overlapPct - 35);
    return pair.overlapPct;
  };

  const handleConsolidate = () => {
    setConsolidated(true);
    setExcludeCustomers(true);
    toast.success('Merged overlapping prospecting sets and applied customer exclusions. Estimated CPM dropped 31.7%.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleConsolidate}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 cursor-pointer"
        >
          <GitMerge className="h-3.5 w-3.5" />
          Apply Consolidation Plan
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Pairwise Auction Overlap Matrix
          </span>
          <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-400">
            Blended CPM: ${estimatedCpm.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <svg viewBox="0 0 420 200" className="h-48 w-full" role="img" aria-label="Audience overlap diagram">
              {consolidated ? (
                <>
                  <circle cx="155" cy="100" r="64" fill="#3B82F6" fillOpacity="0.22" stroke="#2563EB" strokeWidth="2.5" />
                  <text x="155" y="96" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[11px] font-bold">
                    Unified Prospecting Pool
                  </text>
                  <text x="155" y="113" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[10px] font-mono">
                    $870/day · 0% internal overlap
                  </text>
                </>
              ) : (
                <>
                  <circle cx="135" cy="100" r="56" fill="#F43F5E" fillOpacity="0.2" stroke="#E11D48" strokeWidth="2" />
                  <circle cx="195" cy="100" r="56" fill="#3B82F6" fillOpacity="0.2" stroke="#2563EB" strokeWidth="2" />
                  <text x="108" y="96" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[10px] font-bold">
                    LAL-1%
                  </text>
                  <text x="225" y="96" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[10px] font-bold">
                    Interest-SaaS
                  </text>
                  <text x="165" y="108" textAnchor="middle" className="fill-rose-700 dark:fill-rose-300 text-[11px] font-mono font-bold">
                    72% overlap
                  </text>
                </>
              )}
              <circle
                cx={excludeCustomers ? 338 : 285}
                cy="100"
                r="42"
                fill="#10B981"
                fillOpacity="0.2"
                stroke="#059669"
                strokeWidth="2"
              />
              <text x={excludeCustomers ? 338 : 285} y="96" textAnchor="middle" className="fill-slate-900 dark:fill-white text-[10px] font-bold">
                Retarget-30D
              </text>
              <text x={excludeCustomers ? 338 : 285} y="112" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300 text-[9px] font-mono">
                {excludeCustomers ? 'Excluded' : '41% leak'}
              </text>
            </svg>

            <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              {pairs.map((pair) => {
                const pct = effectiveOverlap(pair);
                const sourceName = adSets.find((a) => a.id === pair.source)?.name || pair.source;
                const targetName = adSets.find((a) => a.id === pair.target)?.name || pair.target;
                return (
                  <div key={`${pair.source}-${pair.target}`} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-600 dark:text-slate-300">
                      {sourceName} ↔ {targetName}
                    </span>
                    <span className={`font-bold ${pct >= 30 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {pct}% overlap
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Structural Controls
            </p>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={consolidated}
                onChange={(e) => setConsolidated(e.target.checked)}
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <span>Merge LAL-1% and Interest-SaaS into unified prospecting ad set</span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={excludeCustomers}
                onChange={(e) => setExcludeCustomers(e.target.checked)}
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <span>Exclude active paying customers & 30d retargeting pool from prospecting</span>
            </label>
            <div className="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {consolidated && excludeCustomers
                ? 'Auction cannibalization resolved: pooled conversion signals exit learning faster with zero internal self-bidding.'
                : 'Active overlap above 30% inflates CPM and keeps fragmented ad sets stuck in Learning Limited.'}
            </div>
          </div>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default AudienceOverlapGraphActivity;
