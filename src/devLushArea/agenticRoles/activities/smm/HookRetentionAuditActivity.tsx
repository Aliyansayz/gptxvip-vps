import React, { useMemo, useState } from 'react';
import { Film, Play, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

type HookVariant = {
  id: string;
  label: string;
  thumbStopPct: number;
  hold30sPct: number;
  completionPct: number;
  curve: number[];
};

const DEFAULT_VARIANTS: HookVariant[] = [
  {
    id: 'baseline',
    label: 'Variant A · Brand Logo Intro',
    thumbStopPct: 16.4,
    hold30sPct: 13.8,
    completionPct: 11.2,
    curve: [100, 42, 22, 16.4, 15.6, 14.9, 14.3, 13.8, 12.6, 11.2],
  },
  {
    id: 'pattern-interrupt',
    label: 'Variant B · Problem-First Hook',
    thumbStopPct: 41.8,
    hold30sPct: 34.6,
    completionPct: 28.9,
    curve: [100, 74, 53, 41.8, 39.2, 37.5, 35.8, 34.6, 31.4, 28.9],
  },
];

const TIMESTAMPS = ['0s', '1s', '2s', '3s', '5s', '10s', '15s', '20s', '25s', '30s'];

export const HookRetentionAuditActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [selectedVariantId, setSelectedVariantId] = useState<'baseline' | 'pattern-interrupt'>('baseline');
  const [activeTab, setActiveTab] = useState<'curve' | 'logs'>('curve');
  const [audited, setAudited] = useState(false);

  const hookAudit = (currentExercise?.roleSpecificData as any)?.data?.hookAudit;
  const variants = useMemo<HookVariant[]>(() => {
    if (!hookAudit?.variants?.length) return DEFAULT_VARIANTS;
    return DEFAULT_VARIANTS.map((fallback, index) => {
      const incoming = hookAudit.variants[index];
      if (!incoming) return fallback;
      return {
        ...fallback,
        id: incoming.id || fallback.id,
        label: incoming.label || fallback.label,
        thumbStopPct: incoming.thumbStopPct ?? fallback.thumbStopPct,
        hold30sPct: incoming.hold30sPct ?? fallback.hold30sPct,
        completionPct: incoming.completionPct ?? fallback.completionPct,
      };
    });
  }, [hookAudit]);

  const activeVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const conditionalHoldAfterHook = Math.min(
    99,
    Math.round((activeVariant.completionPct / Math.max(activeVariant.thumbStopPct, 1)) * 100),
  );

  const handleRunAudit = () => {
    setAudited(true);
    toast.success(
      activeVariant.thumbStopPct < 35
        ? `Hook audit complete: ${activeVariant.thumbStopPct}% 3s thumb-stop flagged below 35% benchmark.`
        : `Hook audit complete: ${activeVariant.thumbStopPct}% 3s thumb-stop clears top-quartile threshold.`,
    );
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleRunAudit}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-blue-500 cursor-pointer"
        >
          <Play className="h-3.5 w-3.5" />
          Run Retention Audit
        </button>
      }
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={activeTab === 'curve'}
              onClick={() => setActiveTab('curve')}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'curve'
                  ? 'bg-blue-500/15 font-bold text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              Retention Curve
            </button>
            <button
              type="button"
              aria-pressed={activeTab === 'logs'}
              onClick={() => setActiveTab('logs')}
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-blue-500/15 font-bold text-blue-700 dark:text-blue-300'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              Agent Logs
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                aria-pressed={selectedVariantId === variant.id}
                onClick={() => {
                  setSelectedVariantId(variant.id as 'baseline' | 'pattern-interrupt');
                  setAudited(false);
                }}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                  selectedVariantId === variant.id
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {activeTab === 'curve' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">3s Thumb-Stop</span>
                  <p className={`mt-1 text-xl font-bold font-mono ${activeVariant.thumbStopPct < 35 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {activeVariant.thumbStopPct}%
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Target benchmark: 35%+</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Hold Past 3s</span>
                  <p className="mt-1 text-xl font-bold font-mono text-blue-700 dark:text-blue-400">
                    {conditionalHoldAfterHook}%
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Conditional body retention</span>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">30s Hold / Complete</span>
                  <p className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
                    {activeVariant.hold30sPct}% / {activeVariant.completionPct}%
                  </p>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Full-funnel watch depth</span>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-3 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>Second-by-Second Viewer Retention (%)</span>
                  <span>Hook Window: 0s–3s</span>
                </div>
                <div className="grid grid-cols-10 items-end gap-2 h-36 pt-4">
                  {activeVariant.curve.map((pct, idx) => {
                    const isHookZone = idx <= 3;
                    return (
                      <div key={TIMESTAMPS[idx]} className="flex h-full flex-col items-center justify-end gap-1">
                        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">{Math.round(pct)}%</span>
                        <div className="flex w-full flex-1 items-end rounded bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                          <div
                            className={`w-full rounded-t transition-all duration-300 ${
                              isHookZone && activeVariant.thumbStopPct < 35
                                ? 'bg-rose-500'
                                : isHookZone
                                  ? 'bg-blue-500'
                                  : 'bg-emerald-500'
                            }`}
                            style={{ height: `${Math.max(4, pct)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">{TIMESTAMPS[idx]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {audited && (
                <div role="status" className="rounded-lg border border-blue-500/30 bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:text-blue-200">
                  {activeVariant.thumbStopPct < 35
                    ? 'Diagnosis: Opening 0–3s hook drop-off is the bottleneck while post-hook retention stays strong. Remix only the first 3 seconds with a visual pattern interrupt.'
                    : 'Diagnosis: Problem-first hook clears the 35% thumb-stop threshold (+25.4 pts vs baseline) and lifts end-to-end completion without changing the core script.'}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 font-mono text-sm text-slate-700 dark:text-slate-300">
              {(currentExercise?.logs || []).map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">[{log.level.toUpperCase()}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default HookRetentionAuditActivity;
