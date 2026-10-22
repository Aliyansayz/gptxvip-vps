import React, { useMemo, useState } from 'react';
import { GitBranch, Route } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import AgentTerminalLog from '../../views/components/AgentTerminalLog';
import type { AgentLogEntry } from '../../agenticRoleTypes';

/**
 * Day 2 — Information architecture and navigation depth.
 *
 * Depth is computed by walking the tree rather than stored, so a candidate
 * restructure that claims to flatten the path is checked against the same
 * numbers the reader sees.
 */

type Page = { id: string; label: string; children?: Page[]; orphans?: string[]; redirects?: string[] };

const CURRENT: Page = {
  id: 'home',
  label: 'Home',
  children: [
    { id: 'solutions', label: 'Solutions', children: [{ id: 'platform', label: 'Platform', children: [{ id: 'campaign', label: 'Spring campaign' }] }] },
    { id: 'resources', label: 'Resources' },
    { id: 'pricing', label: 'Pricing' },
  ],
};

const FLATTENED: Page = {
  id: 'home',
  label: 'Home',
  children: [
    { id: 'solutions', label: 'Solutions', children: [{ id: 'platform', label: 'Platform' }] },
    { id: 'resources', label: 'Resources' },
    { id: 'pricing', label: 'Pricing' },
  ],
};

/** Walks the tree and returns each node's click depth from the root. */
function depths(root: Page): Map<string, number> {
  const result = new Map<string, number>();
  const walk = (node: Page, depth: number) => {
    result.set(node.id, depth);
    node.children?.forEach((child) => walk(child, depth + 1));
  };
  walk(root, 0);
  return result;
}

/** Flattens the tree into ordered rows so the move can be rendered, not described. */
function flatten(root: Page): Array<{ id: string; label: string; depth: number }> {
  const rows: Array<{ id: string; label: string; depth: number }> = [];
  const walk = (node: Page, depth: number) => {
    rows.push({ id: node.id, label: node.label, depth });
    node.children?.forEach((child) => walk(child, depth + 1));
  };
  walk(root, 0);
  return rows;
}

const CAMPAIGN = 'campaign';

export default function NavigationDepthActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [migrated, setMigrated] = useState(false);
  const [analysed, setAnalysed] = useState(false);

  const site = migrated ? FLATTENED : CURRENT;
  const depthMap = useMemo(() => depths(site), [site]);
  const rows = useMemo(() => flatten(site), [site]);
  const campaignDepth = depthMap.get(CAMPAIGN);

  const logs: AgentLogEntry[] = migrated
    ? [
        { timestamp: '00:00:01', level: 'info', message: 'CRAWL: 24 internal URLs indexed across 5 sections.' },
        { timestamp: '00:00:02', level: 'info', message: `DEPTH: "${CAMPAIGN}" sits ${campaignDepth} clicks from the root.` },
        { timestamp: '00:00:03', level: 'warn', message: 'MIGRATION: 6 URLs move. Redirect table is required before cutover.' },
      ]
    : [
        { timestamp: '00:00:01', level: 'info', message: 'CRAWL: 24 internal URLs indexed across 5 sections.' },
        { timestamp: '00:00:02', level: 'warn', message: `DEPTH: "${CAMPAIGN}" sits ${campaignDepth} clicks from the root.` },
        { timestamp: '00:00:03', level: 'info', message: 'ENTRY: 40% of new sessions land on that URL directly.' },
      ];

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => { setAnalysed(true); setMigrated((value) => !value); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <Route className="h-4 w-4" />{migrated ? 'Measure current structure' : 'Apply the proposed structure'}
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 flex items-center gap-2 text-base font-semibold">
            <GitBranch className="h-4 w-4 text-lime-600" />{migrated ? 'Proposed structure' : 'Current structure'}
          </h3>
          <ul className="space-y-1">
            {rows.map((row) => (
              <li key={row.id} style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
                <span className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${row.id === CAMPAIGN ? 'bg-lime-500/15 font-semibold text-lime-800 dark:text-lime-200' : 'text-slate-700 dark:text-slate-300'}`}>
                  {row.depth > 0 && <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">└</span>}
                  {row.label}
                  <span className="ml-auto font-mono text-xs text-slate-400">{row.depth} clicks</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-200 pt-4 text-sm leading-6 text-slate-600 dark:border-slate-300 dark:border-slate-700">
            Depth is counted by walking the tree from the root, so a node's position is derived from the structure rather
            than from a number somebody entered.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <AgentTerminalLog logs={analysed ? logs : logs.slice(0, 1)} isStreaming={false} />
          <dl className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Depth to {CAMPAIGN}</dt><dd className="font-mono font-semibold">{campaignDepth}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">Direct entries</dt><dd className="font-mono font-semibold">40%</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500 dark:text-slate-400">URLs moving</dt><dd className="font-mono font-semibold">{migrated ? 6 : 0}</dd></div>
          </dl>
        </div>
      </div>

      {analysed && (
        <section role="status" aria-label="Depth findings" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-2 text-lg font-semibold">Depth findings</h3>
          <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {migrated
              ? `Promoting the campaign page to the Solutions section takes it from ${(campaignDepth ?? 0) + 1} clicks to 2. Six URLs change address, so the redirect table is the deliverable — without it the depth saving is paid for with lost sessions.`
              : `The campaign page sits ${campaignDepth} clicks from the root and receives 40% of new sessions directly. Depth is charged to the sessions that do not arrive directly, and it is charged again at migration time if the URLs change without redirects.`}
          </p>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Publish the redirect table with the structure change, not after it. Recovered sessions are the measure that
            shows whether the flattening actually paid for itself.
          </p>
        </section>
      )}
    </RoleActivityFrame>
  );
}
