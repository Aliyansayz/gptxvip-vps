import React, { useState } from 'react';
import { Activity, RefreshCw, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

type TrendPoint = { day: string; frequency: number; ctrPct: number; cpaUsd: number };

const DEFAULT_TRENDS: TrendPoint[] = [
  { day: 'D1', frequency: 1.4, ctrPct: 2.15, cpaUsd: 24 },
  { day: 'D4', frequency: 2.2, ctrPct: 1.88, cpaUsd: 27 },
  { day: 'D7', frequency: 3.3, ctrPct: 1.34, cpaUsd: 35 },
  { day: 'D10', frequency: 4.3, ctrPct: 0.92, cpaUsd: 49 },
];

export const CreativeFatigueMonitorActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [frequencyCap, setFrequencyCap] = useState(3.0);
  const [rotationMode, setRotationMode] = useState<'none' | 'challenger' | 'reset'>('none');

  const fatigueData = (currentExercise?.roleSpecificData as any)?.data?.creativeFatigue;
  const trends: TrendPoint[] = fatigueData?.dailyTrends || DEFAULT_TRENDS;
  const targetCpa = 30;

  const latest = trends[trends.length - 1];
  const projectedCpa =
    rotationMode === 'challenger' ? 26 : rotationMode === 'reset' ? 44 : latest.cpaUsd;
  const projectedCtr =
    rotationMode === 'challenger' ? 1.96 : rotationMode === 'reset' ? 1.15 : latest.ctrPct;
  const projectedFreq =
    rotationMode === 'challenger' ? Math.min(frequencyCap, 2.4) : latest.frequency;

  const handleStageRotation = () => {
    setRotationMode('challenger');
    toast.success('Staged 2 challenger hooks into testing slot; preserved parent ad-set learning.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleStageRotation}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Stage Challenger Rotation
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Creative Saturation Telemetry (`ad_hero_ugc_04`)
          </span>
          <label className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-400">
            <span>7d Freq Guardrail:</span>
            <input
              aria-label="7-day frequency guardrail"
              type="range"
              min={2.0}
              max={5.0}
              step={0.2}
              value={frequencyCap}
              onChange={(e) => setFrequencyCap(parseFloat(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="font-bold text-blue-700 dark:text-blue-400">{frequencyCap.toFixed(1)}x</span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Projected 7d Freq</span>
            <p className={`mt-1 text-xl font-bold font-mono ${projectedFreq > frequencyCap ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {projectedFreq.toFixed(1)}x
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Ceiling: {frequencyCap.toFixed(1)}x</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Outbound CTR</span>
            <p className={`mt-1 text-xl font-bold font-mono ${projectedCtr < 1.3 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {projectedCtr.toFixed(2)}%
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">D1 baseline: 2.15%</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Projected CPA</span>
            <p className={`mt-1 text-xl font-bold font-mono ${projectedCpa > targetCpa ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ${projectedCpa}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Target ceiling: ${targetCpa}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2">Day</th>
                <th className="px-3 py-2">7d Frequency</th>
                <th className="px-3 py-2">Outbound CTR</th>
                <th className="px-3 py-2">Observed CPA</th>
                <th className="px-3 py-2">Guardrail Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {trends.map((row) => {
                const breached = row.frequency > frequencyCap || row.cpaUsd > targetCpa;
                return (
                  <tr key={row.day}>
                    <td className="px-3 py-2 font-bold">{row.day}</td>
                    <td className="px-3 py-2">{row.frequency.toFixed(1)}x</td>
                    <td className="px-3 py-2">{row.ctrPct.toFixed(2)}%</td>
                    <td className="px-3 py-2">${row.cpaUsd}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-bold ${breached ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'}`}>
                        {breached ? 'Fatigue Alert' : 'Healthy'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Simulate Action:</span>
          {[
            { id: 'none', label: 'No Action (Keep Saturated Ad)' },
            { id: 'reset', label: 'Delete & Rebuild Campaign' },
            { id: 'challenger', label: 'Challenger Slot Rotation' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={rotationMode === option.id}
              onClick={() => setRotationMode(option.id as 'none' | 'challenger' | 'reset')}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                rotationMode === option.id
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {rotationMode !== 'none' && (
          <div role="status" className="flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {rotationMode === 'challenger'
                ? 'Learning-safe rotation: shifting delivery to net-new hooks drops projected CPA to $26 while preserving pixel optimization history.'
                : 'Campaign reset penalty: wiping optimization history forces a cold learning phase and keeps CPA elevated at $44.'}
            </span>
          </div>
        )}
      </div>
    </RoleActivityFrame>
  );
};

export default CreativeFatigueMonitorActivity;
