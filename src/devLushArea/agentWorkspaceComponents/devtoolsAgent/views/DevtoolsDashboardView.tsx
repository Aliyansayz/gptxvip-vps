import React, { useEffect, useRef, useState } from 'react';
import { GitPullRequest, Search, Zap, Activity, AlertCircle, Code, Play } from 'lucide-react';
import SourceStatus from '../../components/SourceStatus';
import { ActionSummary } from '../../../../shared/components/ActionSummary';

export default function DevtoolsDashboardView() {
  const [sampleStatus, setSampleStatus] = useState<'idle' | 'running' | 'done'>('idle');
  const sampleTimer = useRef<number | null>(null);
  useEffect(() => () => { if (sampleTimer.current !== null) window.clearTimeout(sampleTimer.current); }, []);
  const runSample = () => {
    setSampleStatus('running');
    sampleTimer.current = window.setTimeout(() => { setSampleStatus('done'); sampleTimer.current = null; }, 500);
  };
  const resetSample = () => {
    if (sampleTimer.current !== null) window.clearTimeout(sampleTimer.current);
    sampleTimer.current = null;
    setSampleStatus('idle');
  };
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
      {/* Global Header */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Code className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-mono text-slate-700">Repository: core-backend-service</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Review Agent: Preview only</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <GitPullRequest className="w-4 h-4 text-emerald-500" />
            <span>Example PRs: 14</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Example style flags: 42</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:p-6 max-w-7xl mx-auto w-full space-y-8">
        <aside className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-950">
          <strong>Repository preview.</strong> Repository names, counts, findings, and activity below are example content. Workflow cards explain possible tasks and do not run an analysis.
        </aside>
        <p className="text-sm text-slate-600"><strong>Start here:</strong> inspect the sample findings below, then use the sidebar to open the related workspace panel. Suggested changes still need review.</p>

        <section aria-labelledby="devtools-sample-task" className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">First task · deterministic sample</p><h2 id="devtools-sample-task" className="mt-1 text-xl font-bold text-slate-900">Trace a PR review finding</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Run the built-in example to see how a proposed finding moves from input to reviewer action. No repository or analyzer is connected.</p></div>
            <div className="flex gap-2"><button type="button" disabled={sampleStatus === 'running'} onClick={runSample} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-700 px-4 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"><Play className="h-4 w-4" /> {sampleStatus === 'done' ? 'Run again' : 'Run sample'}</button><button type="button" onClick={resetSample} className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">Reset</button></div>
          </div>
          <SourceStatus source="Built-in PR scenario" freshness="No connected repository or scan date" />
          <div className="mt-5" aria-live="polite"><ActionSummary input="Example PR #1042 contains a credential-shaped placeholder." action="Inspect the sample diff for a possible hardcoded secret." result="Potential secret in the example patch; severity and file context are unverified." nextStep="Review the real diff, revoke any exposed credential if confirmed, and require a human merge review." status={sampleStatus} /></div>
        </section>
        
        {/* Actionable Alerts & Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Example review candidates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                   <AlertCircle className="w-4 h-4" /> Possible hardcoded secret
                 </div>
                 <p className="text-xs text-red-700">A credential-shaped placeholder appears in sample PR #1042. Confirm the real diff before assigning severity.</p>
                 <SourceStatus source="Built-in PR example" freshness="No connected repository" confidence="Unverified" />
               </div>
               <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                   <Activity className="w-4 h-4" /> Possible complexity issue
                 </div>
                 <p className="text-xs text-amber-700">The example `processTransaction` function may exceed a chosen complexity threshold; no repository scan is available.</p>
                 <SourceStatus source="Built-in code example" freshness="No connected repository" confidence="Unverified" />
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Sample activity log
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-mono text-xs text-slate-600 space-y-2 h-[104px] overflow-y-auto">
              <div className="text-emerald-600">[09:14:01] ReviewAgent: Analyzing PR #1043...</div>
              <div className="text-slate-500">[09:14:15] ReviewAgent: Found 3 style issues, 1 potential bug.</div>
              <div className="text-slate-500">[09:15:42] RefactorAgent: Generating suggested fix for `utils.js`.</div>
              <div className="text-emerald-600">Example log complete</div>
            </div>
          </div>
        </div>

        {/* Live Use Cases Examples */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-500" /> Analysis Workflows
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800">Automated PR Review</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Analyze diffs for stylistic consistency, potential bugs, and security vulnerabilities.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800">Dependency Audit</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Scan package.json for outdated or vulnerable dependencies and suggest updates.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
             <article className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800">Legacy Refactoring</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Identify outdated patterns and automatically suggest modernized TypeScript implementations.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Workflow concept</span>
                </div>
             </article>
           </div>
        </div>

      </div>
    </div>
  );
}
