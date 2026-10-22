import React, { useMemo, useState } from 'react';
import { LayoutPanelTop, Rows3 } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

/**
 * Day 4 — Layout density and visual hierarchy review.
 *
 * Density and whitespace share are computed from the control list, so the
 * comparison between the flat and the grouped layout is arithmetic rather than
 * an opinion about how the mockup looks.
 */

type Control = { id: string; label: string; group: string; x: number; y: number; w: number };

const CONTROLS: Control[] = [
  { id: 'c1', label: 'Workspace name', group: 'Workspace', x: 0, y: 0, w: 2 },
  { id: 'c2', label: 'Default region', group: 'Workspace', x: 0, y: 1, w: 2 },
  { id: 'c3', label: 'Language', group: 'Workspace', x: 0, y: 2, w: 2 },
  { id: 'c4', label: 'Two-factor', group: 'Security', x: 0, y: 3, w: 2 },
  { id: 'c5', label: 'Session timeout', group: 'Security', x: 0, y: 4, w: 2 },
  { id: 'c6', label: 'Password', group: 'Security', x: 0, y: 5, w: 2 },
  { id: 'c7', label: 'Invoice email', group: 'Billing', x: 0, y: 6, w: 2 },
  { id: 'c8', label: 'Tax ID', group: 'Billing', x: 0, y: 7, w: 2 },
  { id: 'c9', label: 'Plan', group: 'Billing', x: 0, y: 8, w: 2 },
];

/** Rows occupied once controls are packed per group, plus one divider per group. */
const groupedRows = (grouped: boolean) => {
  if (!grouped) return CONTROLS.length;
  const groups = [...new Set(CONTROLS.map((control) => control.group))];
  return CONTROLS.length + groups.length - 1; // one divider row between groups
};

export default function LayoutHierarchyActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [grouped, setGrouped] = useState(false);
  const [persistentActions, setPersistentActions] = useState(false);

  const metrics = useMemo(() => {
    const groups = [...new Set(CONTROLS.map((control) => control.group))];
    return {
      // Flat: one undifferentiated block. Grouped: one section per task.
      sections: grouped ? groups.length : 1,
      // A single type scale gives every label the same weight; the repair is a
      // second step, not a larger default.
      typeSteps: grouped ? 2 : 1,
      rows: groupedRows(grouped),
    };
  }, [grouped]);

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => { setGrouped((value) => !value); setPersistentActions((value) => !value); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <Rows3 className="h-4 w-4" />{grouped ? 'Show the flat layout' : 'Apply grouping and an action bar'}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <LayoutPanelTop className="h-4 w-4 text-lime-600" />Settings · {grouped ? 'grouped' : 'flat'}
          </h3>

          {grouped ? (
            <div className="space-y-5">
              {[...new Set(CONTROLS.map((control) => control.group))].map((group) => (
                <fieldset key={group}>
                  <legend className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {group}
                  </legend>
                  <div className="space-y-2">
                    {CONTROLS.filter((control) => control.group === group).map((control) => (
                      <label key={control.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="text-slate-700 dark:text-slate-300">{control.label}</span>
                        <input readOnly value="" aria-label={control.label} className="w-40 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              {persistentActions && (
                <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-slate-200 bg-white py-3 dark:border-slate-800 dark:bg-slate-900">
                  <span className="mr-auto text-xs text-slate-500 dark:text-slate-400">Save stays reachable from any section</span>
                  <button type="button" className="rounded-full bg-lime-600 px-4 py-2 text-xs font-bold text-white">Save changes</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {CONTROLS.map((control) => (
                <label key={control.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{control.label}</span>
                  <input readOnly value="" aria-label={control.label} className="w-40 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
                </label>
              ))}
              <p className="pt-2 text-xs text-rose-600 dark:text-rose-300">Save is below the fold</p>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-semibold">Layout measures</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Controls</dt><dd className="font-mono font-semibold">{CONTROLS.length}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Rows used</dt><dd className="font-mono font-semibold">{metrics.rows}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Task sections</dt><dd className="font-mono font-semibold">{metrics.sections}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Type steps</dt><dd className="font-mono font-semibold">{metrics.typeSteps}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Save reachable</dt><dd className="font-mono font-semibold">{grouped && persistentActions ? 'yes' : 'no'}</dd></div>
          </dl>
          <p className="border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-300 dark:border-slate-700">
            Grouping costs {metrics.rows - CONTROLS.length} extra divider rows and returns a second type step plus
            a persistent action bar. Rows spent on structure buy back the thing the flat layout lacked: a visible way
            to tell which settings belong together, and a save control that is never below the fold.
          </p>
        </div>
      </div>
    </RoleActivityFrame>
  );
}
