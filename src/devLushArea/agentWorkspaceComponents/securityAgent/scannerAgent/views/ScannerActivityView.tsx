import React from 'react';
import { Activity, Terminal, Clock } from 'lucide-react';

export default function ScannerActivityView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Activity className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Live Activity Feed</h2>
      </div>
      <div className="flex-1 bg-gray-900 rounded-xl border border-slate-800 p-4 shadow-sm overflow-y-auto font-mono text-sm">
        <div className="text-emerald-400 mb-2"><span className="text-gray-500">[10:42:01]</span> [ReconAgent] Discovered new subdomain: staging.internal-api.com</div>
        <div className="text-emerald-400 mb-2"><span className="text-gray-500">[10:42:15]</span> [ScannerAgent] Initiating aggressive port scan on staging.internal-api.com</div>
        <div className="text-blue-400 mb-2"><span className="text-gray-500">[10:43:05]</span> [ScannerAgent] Open ports found: 80, 443, 8080</div>
        <div className="text-yellow-400 mb-2"><span className="text-gray-500">[10:44:12]</span> [ExploitAgent] Attempting basic SQL injection payloads on port 8080...</div>
        <div className="text-red-400 mb-2"><span className="text-gray-500">[10:45:00]</span> [ExploitAgent] CRITICAL: Potential blind SQLi detected. Need human verification.</div>
        <div className="animate-pulse text-emerald-500 mt-4">_</div>
      </div>
    </div>
  );
}
