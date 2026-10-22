import React, { useMemo, useState } from 'react';
import { Filter, TriangleAlert } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

/**
 * Day 3 — Onboarding funnel and activation drop-off.
 *
 * Step conversion is computed from the step rates rather than supplied, because
 * the case hinges on the difference between a per-step figure and an average of
 * them — and only the computed number makes that difference visible.
 */

const STEPS = [
  { id: 1, label: 'Account', retention: 91 },
  { id: 2, label: 'Workspace', retention: 89 },
  { id: 3, label: 'Team', retention: 88 },
  { id: 4, label: 'Billing', retention: 24 },
  { id: 5, label: 'First project', retention: 22 },
];

const TICKETS = [
  { step: 4, subject: 'Card declined on a corporate card', count: 41 },
  { step: 4, subject: 'Billing address rejected', count: 22 },
  { step: 5, subject: 'Where do I import existing work?', count: 9 },
  { step: 2, subject: 'Invite link expired', count: 4 },
];

export default function OnboardingFunnelActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [filter, setFilter] = useState<'all' | 'bottleneck'>('all');

  /** Per-step conversion = this step's retention over the previous step's. */
  const rows = useMemo(() => {
    let previous = 100;
    return STEPS.map((item) => {
      const conversion = Math.round((item.retention / previous) * 100);
      previous = item.retention;
      return { ...item, conversion, drop: 100 - conversion };
    });
  }, []);

  const worst = useMemo(
    () => rows.reduce((acc, row) => (row.drop > acc.drop ? row : acc), rows[0]),
    [rows],
  );
  /** Product of the step rates — the number an average of the rows hides. */
  const endToEnd = rows.reduce((total, row) => total * row.conversion, 0) / 100 ** (rows.length - 1);
  const ticketsByStep = useMemo(() => {
    const grouped = new Map<number, number>();
    TICKETS.forEach((ticket) => grouped.set(ticket.step, (grouped.get(ticket.step) ?? 0) + ticket.count));
    return grouped;
  }, []);

  const visible = filter === 'bottleneck' ? rows.filter((row) => row.drop === worst.drop) : rows;

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => setFilter((value) => (value === 'all' ? 'bottleneck' : 'all'))} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <Filter className="h-4 w-4" />{filter === 'all' ? 'Isolate the bottleneck' : 'Show every step'}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-semibold">Signup funnel · 5 steps</h3>
          <ul className="space-y-3">
            {visible.map((row) => {
              const isWorst = row.drop === worst.drop;
              const ticketCount = ticketsByStep.get(row.id) ?? 0;
              return (
                <li key={row.id}>
                  <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                    <span className="font-semibold">{row.id}. {row.label}</span>
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {row.conversion}% step · {row.retention}% of cohort
                    </span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-lg transition-[width] duration-500 ${isWorst ? 'bg-rose-500' : 'bg-lime-500'}`}
                      style={{ width: `${row.retention}%` }}
                    />
                  </div>
                  <p className={`mt-1 text-xs ${isWorst ? 'font-semibold text-rose-600 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {isWorst ? `Largest single-step loss · ${row.drop} points` : `${row.drop} point drop`}
                    {ticketCount > 0 && ` · ${ticketCount} support tickets`}
                  </p>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-300 dark:border-slate-700">
            End-to-end completion is <span className="font-mono font-semibold">{endToEnd.toFixed(1)}%</span>. Averaging the
            step rates instead would report roughly {Math.round(rows.reduce((sum, row) => sum + row.conversion, 0) / rows.length)}%,
            which describes no user who actually completes the flow.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <TriangleAlert className="h-4 w-4 text-amber-500" />Support tickets
          </h3>
          <ul className="space-y-2 text-sm">
            {TICKETS.map((ticket) => (
              <li key={ticket.subject} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-2.5 dark:bg-slate-950">
                <span className="min-w-0 text-slate-700 dark:text-slate-300">{ticket.subject}</span>
                <span className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">step {ticket.step} · {ticket.count}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-300 dark:border-slate-700">
            Tickets cluster on step {worst.id} ({ticketsByStep.get(worst.id) ?? 0} of {TICKETS.length} subjects), which
            matches the largest drop. Two independent signals pointing at one step is a finding; either alone is a guess.
          </p>
        </div>
      </div>
    </RoleActivityFrame>
  );
}
