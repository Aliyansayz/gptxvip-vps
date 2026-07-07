import React from 'react';
import { Inbox, CheckCircle, Clock } from 'lucide-react';

export default function ScannerQueueView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Inbox className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Task Queue</h2>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800">Verify Blind SQLi on Staging</h4>
            <p className="text-sm text-slate-500">ExploitAgent requested human verification for an anomalous response.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Review</button>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800">Approve Aggressive Nmap Scan</h4>
            <p className="text-sm text-slate-500">ReconAgent wants to run a full port scan on production range. Requires authorization.</p>
          </div>
          <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">Authorize</button>
        </div>
      </div>
    </div>
  );
}
