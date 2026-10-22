import React, { useMemo, useState } from 'react';
import { Braces, ShieldCheck } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';

/**
 * Day 6 — Design token drift and component consistency.
 *
 * Drift is detected by comparing each component's literal values against the
 * token, so the audit reports the components that disagree rather than asking
 * the reader to spot them by eye.
 */

type Token = { name: string; value: string; kind: 'radius' | 'shadow' | 'space' | 'color' };

const TOKENS: Token[] = [
  { name: 'radius.card', value: '8px', kind: 'radius' },
  { name: 'shadow.card', value: '0 1px 2px rgba(15,23,42,.08)', kind: 'shadow' },
  { name: 'space.gutter', value: '16px', kind: 'space' },
];

type Component = { name: string; radius: string; shadow: string; gutter: string; usesTokens: boolean };

const COMPONENTS: Component[] = [
  { name: 'CardDefault', radius: '8px', shadow: '0 1px 2px rgba(15,23,42,.08)', gutter: '16px', usesTokens: true },
  { name: 'CardPromo', radius: '8px', shadow: '0 1px 2px rgba(15,23,42,.08)', gutter: '16px', usesTokens: true },
  { name: 'CardCompact', radius: '8px', shadow: '0 1px 2px rgba(15,23,42,.08)', gutter: '16px', usesTokens: true },
  { name: 'CardLegacy', radius: '12px', shadow: '0 2px 4px rgba(15,23,42,.12)', gutter: '16px', usesTokens: false },
  { name: 'CardMarketing', radius: '12px', shadow: '0 2px 4px rgba(15,23,42,.12)', gutter: '20px', usesTokens: false },
  { name: 'CardEmbed', radius: '16px', shadow: '0 1px 3px rgba(15,23,42,.16)', gutter: '20px', usesTokens: false },
  { name: 'CardCheckout', radius: '12px', shadow: '0 2px 4px rgba(15,23,42,.12)', gutter: '16px', usesTokens: false },
];

const tokenFor = (kind: Token['kind']) => TOKENS.find((token) => token.kind === kind)!;

export default function DesignTokenDriftActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [scanned, setScanned] = useState(false);
  const [guardEnabled, setGuardEnabled] = useState(false);

  const expected = {
    radius: tokenFor('radius').value,
    shadow: tokenFor('shadow').value,
    gutter: tokenFor('space').value,
  };

  const drift = useMemo(
    () =>
      COMPONENTS.filter((component) => !component.usesTokens).map((component) => ({
        name: component.name,
        findings: [
          { label: 'radius', expected: expected.radius, actual: component.radius },
          { label: 'shadow', expected: expected.shadow, actual: component.shadow },
          { label: 'gutter', expected: expected.gutter, actual: component.gutter },
        ].filter((finding) => finding.expected !== finding.actual),
      })),
    [expected.gutter, expected.radius, expected.shadow],
  );

  const compliant = COMPONENTS.length - drift.length;
  const adoption = Math.round((compliant / COMPONENTS.length) * 100);

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => { setScanned(true); setGuardEnabled((value) => !value); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <Braces className="h-4 w-4" />{scanned ? (guardEnabled ? 'Disable the build guard' : 'Enable the build guard') : 'Scan component sources'}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-base font-semibold">Card components</h3>
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">Card components compared against the shared token values</caption>
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
                <th scope="col" className="py-2 pr-3">Component</th>
                <th scope="col" className="py-2 pr-3">radius</th>
                <th scope="col" className="py-2 pr-3">gutter</th>
                <th scope="col" className="py-2">token use</th>
              </tr>
            </thead>
            <tbody>
              {COMPONENTS.map((component) => {
                const drifted = drift.find((item) => item.name === component.name);
                const radiusOff = drifted?.findings.find((item) => item.label === 'radius');
                const gutterOff = drifted?.findings.find((item) => item.label === 'gutter');
                return (
                  <tr key={component.name} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <th scope="row" className="py-2.5 pr-3 font-mono text-xs font-semibold">{component.name}</th>
                    <td className={`py-2.5 pr-3 font-mono text-xs ${radiusOff ? 'font-bold text-rose-600 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400'}`}>{component.radius}</td>
                    <td className={`py-2.5 pr-3 font-mono text-xs ${gutterOff ? 'font-bold text-rose-600 dark:text-rose-300' : 'text-slate-600 dark:text-slate-400'}`}>{component.gutter}</td>
                    <td className="py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${component.usesTokens ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                        {component.usesTokens ? 'token' : 'literal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-300 dark:border-slate-700">
            Changing <code className="font-mono text-xs">{expected.radius}</code> to <code className="font-mono text-xs">12px</code> to make
            the four agree would break the {compliant} components that already match. The inconsistency lives in the components
            that drifted, so that is where the fix belongs.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            <ShieldCheck className="h-4 w-4 text-lime-600" />Token adoption
          </h3>
          <p className="font-mono text-3xl font-bold text-slate-900 dark:text-white">{adoption}%</p>
          <dl className="space-y-2 border-t border-slate-200 pt-3 text-sm dark:border-slate-800">
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Components</dt><dd className="font-mono font-semibold">{COMPONENTS.length}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Drifted</dt><dd className="font-mono font-semibold">{drift.length}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Build guard</dt><dd className="font-mono font-semibold">{guardEnabled ? 'on' : 'off'}</dd></div>
          </dl>
          {scanned && (
            <p className="rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {guardEnabled
                ? 'The guard now fails the build on raw values in the component layer, so the next literal is caught before it ships rather than in a visual regression diff.'
                : 'Without the guard, drift returns one component per release and is only noticed when a reviewer compares screenshots.'}
            </p>
          )}
        </div>
      </div>
    </RoleActivityFrame>
  );
}
