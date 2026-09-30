import React from 'react';
import { Activity } from 'lucide-react';
import SourceStatus from '../../../components/SourceStatus';

export default function ScannerActivityView() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Activity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Scripted activity example</h2>
      </div>
      <p className="mb-4 text-sm leading-6 text-slate-600">The events below are a fixed training trace. No domain was discovered, scanned, or tested by this preview.</p>
      <div className="mb-4"><SourceStatus source="Built-in scanner trace" freshness="Illustrative timestamps only" confidence="Unverified" /></div>
      <div className="max-h-[30rem] flex-1 space-y-3 overflow-y-auto break-words rounded-xl border border-slate-800 bg-gray-900 p-4 font-mono text-xs text-slate-200 sm:text-sm">
        <div><span className="text-slate-400">Step 1</span> · Example subdomain label: staging.internal-api.com</div>
        <div><span className="text-slate-400">Step 2</span> · Review a prepared service list for the example scope.</div>
        <div><span className="text-slate-400">Step 3</span> · Example open ports: 80, 443, 8080; no network scan occurred.</div>
        <div><span className="text-slate-400">Step 4</span> · Compare a prepared response for an illustrative SQLi signal.</div>
        <div><span className="text-slate-400">Step 5</span> · Candidate requires human verification in an authorized environment.</div>
      </div>
    </div>
  );
}
