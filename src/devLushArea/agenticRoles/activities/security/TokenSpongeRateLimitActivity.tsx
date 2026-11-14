import React, { useState } from 'react';
import { Flame, Gauge, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

export const TokenSpongeRateLimitActivity: React.FC<ActivityComponentProps> = ({
  step,
  exercises,
  onComplete,
}) => {
  const currentExercise = exercises[step] || exercises[0];
  const [maxSteps, setMaxSteps] = useState(14);
  const [maxOutputTokens, setMaxOutputTokens] = useState(4096);
  const [tokenBucketActive, setTokenBucketActive] = useState(false);

  const requestsPerMinute = 8;
  const tokensPerMin = requestsPerMinute * maxSteps * maxOutputTokens;
  const rawHourlyCost = Math.round((tokensPerMin * 60 * 0.015) / 1000);
  const hourlyBudgetCap = 40;
  const effectiveHourlyCost = tokenBucketActive ? Math.min(rawHourlyCost, hourlyBudgetCap) : rawHourlyCost;
  const withinBudget = effectiveHourlyCost <= hourlyBudgetCap && maxSteps <= 5 && maxOutputTokens <= 2048;

  const handleApplyGuardrails = () => {
    setMaxSteps(4);
    setMaxOutputTokens(1024);
    setTokenBucketActive(true);
    toast.success('Enforced max_steps=4, max_tokens=1024, and per-tenant token-bucket circuit breaker.');
  };

  return (
    <RoleActivityFrame
      exercise={currentExercise}
      onComplete={onComplete}
      toolbar={
        <button
          type="button"
          onClick={handleApplyGuardrails}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-500 cursor-pointer"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          Enforce DoW Circuit Breaker
        </button>
      }
    >
      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 text-sm dark:border-slate-800">
          <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Gauge className="h-4 w-4 text-red-600 dark:text-red-400" />
            Denial-of-Wallet (DoW) & Loop Amplification Simulator
          </span>
          <span className="font-mono text-xs text-slate-500">
            Ingress: {requestsPerMinute} HTTP RPM (Passes 20 RPM L7 Limit)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Max Agent Loop Depth</span>
            <p className={`mt-1 text-xl font-bold font-mono ${maxSteps > 5 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {maxSteps} steps
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Recommended cap: ≤ 5 steps</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Token Velocity / Min</span>
            <p className="mt-1 text-xl font-bold font-mono text-slate-900 dark:text-white">
              {(tokensPerMin / 1000).toFixed(0)}k tok/m
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Max per step: {maxOutputTokens}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">Projected Hourly Burn</span>
            <p className={`mt-1 text-xl font-bold font-mono ${effectiveHourlyCost > hourlyBudgetCap ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ${effectiveHourlyCost}/hr
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tenant ceiling: ${hourlyBudgetCap}/hr</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-3">
          <label className="space-y-1.5 text-xs font-mono">
            <span className="block font-semibold text-slate-700 dark:text-slate-300">
              Recursion Cap (`max_steps`: {maxSteps})
            </span>
            <input
              aria-label="Max agent recursion steps"
              type="range"
              min={2}
              max={16}
              step={1}
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </label>

          <label className="space-y-1.5 text-xs font-mono">
            <span className="block font-semibold text-slate-700 dark:text-slate-300">
              Step Completion Cap (`max_tokens`: {maxOutputTokens})
            </span>
            <input
              aria-label="Max output tokens per step"
              type="range"
              min={512}
              max={4096}
              step={512}
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
            <input
              type="checkbox"
              checked={tokenBucketActive}
              onChange={(e) => setTokenBucketActive(e.target.checked)}
              className="h-4 w-4 accent-red-600"
            />
            <span>Enforce Redis Per-Tenant Token-Bucket ($40/hr Circuit Breaker)</span>
          </label>
        </div>

        <div
          role="status"
          className={`flex items-start gap-2 rounded-lg p-3 text-xs leading-5 ${
            withinBudget
              ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200'
              : 'border border-rose-500/30 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200'
          }`}
        >
          <Flame className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {withinBudget
              ? 'Denial-of-Wallet neutralized: bounded loop depth, capped per-call output tokens, and active per-tenant token-bucket keep burn well below the $40/hr ceiling.'
              : 'Denial-of-Wallet risk: HTTP request rate limiters alone cannot stop multi-step token amplification. Cap max_steps, max_tokens, and enable the tenant token-bucket.'}
          </span>
        </div>
      </div>
    </RoleActivityFrame>
  );
};

export default TokenSpongeRateLimitActivity;
