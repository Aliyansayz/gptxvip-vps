import React from 'react';
import { Database, BrainCircuit, HardDrive } from 'lucide-react';

export default function ScannerMemoryView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Database className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Memory Management</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg"><BrainCircuit className="w-5 h-5 text-indigo-600" /></div>
            <h3 className="font-bold text-slate-800 text-lg">Short-term Context (Session)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Holds variables, credentials, and state for currently active missions.</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-500">
            Current Session Token: REDACTED<br/>
            Active Targets: 2<br/>
            Injected Payloads: 142
          </div>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg"><HardDrive className="w-5 h-5 text-emerald-600" /></div>
            <h3 className="font-bold text-slate-800 text-lg">Long-term Memory (Vector DB)</h3>
          </div>
          <p className="text-sm text-slate-600 mb-4">Stores historical vulnerability patterns, past reports, and organizational context.</p>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-500">
            Total Embeddings: 45,210<br/>
            Last Index Update: 12 hours ago<br/>
            Collections: exploits, recon_data, policy
          </div>
        </div>
      </div>
    </div>
  );
}
