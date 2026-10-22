import React, { useState } from 'react';
import { Gauge, Loader2 } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

/**
 * Day 5 — Interaction latency and the perceived-performance budget.
 *
 * The blocking task is what makes the interaction late, so the budget verdict
 * is computed from the long task against the budget rather than read off a
 * label. A spinner changes nothing about either number, which is the lesson.
 */

type Mode = 'shipped' | 'masked' | 'budgeted';

type Profile = { mode: Mode; rowsRendered: number; longTaskMs: number; skeleton: boolean; optimistic: boolean };

const PROFILES: Profile[] = [
  { mode: 'shipped', rowsRendered: 2400, longTaskMs: 610, skeleton: false, optimistic: false },
  { mode: 'masked', rowsRendered: 2400, longTaskMs: 610, skeleton: true, optimistic: false },
  { mode: 'budgeted', rowsRendered: 40, longTaskMs: 78, skeleton: true, optimistic: true },
];

const BUDGET_MS = 200;
/** Latency buckets for the filtered set, plus the set size they describe. */
const ROWS = [
  { id: 'r1', label: 'Above 400 ms', count: 1840 },
  { id: 'r2', label: '200–400 ms', count: 430 },
  { id: 'r3', label: 'Under 200 ms', count: 130 },
];
const TOTAL_ROWS = ROWS.reduce((total, row) => total + row.count, 0);

export default function InteractionLatencyActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [modeIndex, setModeIndex] = useState(0);
  const [measured, setMeasured] = useState(false);
  const profile = PROFILES[modeIndex];
  const overBudget = profile.longTaskMs > BUDGET_MS;
  const inputLatency = Math.max(0, profile.longTaskMs - 20);

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => { setMeasured(true); setModeIndex((index) => (index + 1) % PROFILES.length); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <Gauge className="h-4 w-4" />{measured ? 'Measure the next build' : 'Measure this interaction'}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Filtered results · {TOTAL_ROWS.toLocaleString()} rows</h3>
            {profile.skeleton && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {measured ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}Skeleton {measured ? 'visible' : 'not yet measured'}
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {ROWS.map((row, index) => (
              <div key={row.id} className={`flex items-center justify-between gap-3 px-3 py-2.5 text-sm ${index === 0 ? 'bg-rose-500/10' : 'bg-white dark:bg-slate-950'}`}>
                <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.count}</span>
              </div>
            ))}
            {profile.rowsRendered < TOTAL_ROWS && (
              <div className="border-t border-dashed border-slate-300 px-3 py-2.5 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                Virtualised: the window renders {profile.rowsRendered} rows and recycles the rest as the user scrolls.
              </div>
            )}
          </div>

          <fieldset className="mt-5 space-y-2">
            <legend className="mb-2 text-sm font-semibold">Filter build</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {PROFILES.map((item, index) => (
                <label key={item.mode} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm capitalize ${modeIndex === index ? 'border-lime-500 bg-lime-50 dark:bg-lime-950/40' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="uiux-latency-build" checked={modeIndex === index} onChange={() => { setModeIndex(index); setMeasured(false); }} className="h-4 w-4 accent-lime-600" />
                  {item.mode}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-semibold">Interaction budget</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Long task</dt><dd className="font-mono font-semibold">{profile.longTaskMs} ms</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Input latency</dt><dd className="font-mono font-semibold">{inputLatency} ms</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Rows rendered</dt><dd className="font-mono font-semibold">{profile.rowsRendered}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Skeleton</dt><dd className="font-mono font-semibold">{profile.skeleton ? 'yes' : 'no'}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Optimistic</dt><dd className="font-mono font-semibold">{profile.optimistic ? 'yes' : 'no'}</dd></div>
          </dl>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={`h-full rounded-full transition-[width] duration-500 ${overBudget ? 'bg-rose-500' : 'bg-lime-500'}`} style={{ width: `${Math.min(100, (profile.longTaskMs / (BUDGET_MS * 3)) * 100)}%` }} />
          </div>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Budget is {BUDGET_MS} ms. {overBudget
              ? `This build is ${profile.longTaskMs - BUDGET_MS} ms over. Adding a skeleton changes what the user sees without changing either number.`
              : 'This build is inside the budget, so the skeleton confirms progress instead of covering for it.'}
          </p>
        </div>
      </div>
    </RoleActivityFrame>
  );
}
