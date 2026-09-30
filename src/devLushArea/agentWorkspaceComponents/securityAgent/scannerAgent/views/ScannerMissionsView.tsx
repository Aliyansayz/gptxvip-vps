import React from 'react';
import { Compass } from 'lucide-react';

export default function ScannerMissionsView() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-50 p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Compass className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Sample mission plan</h2>
      </div>
      <div className="space-y-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Weekly Perimeter Scan</h3>
              <p className="text-sm text-slate-500">Illustrative scope and review steps for an authorized perimeter exercise. No schedule or target is connected.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">Plan preview</span>
          </div>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-slate-600"><li>Confirm written scope and exclusions.</li><li>Collect approved evidence in a test environment.</li><li>Review candidates and assign a human verifier.</li><li>Record findings and remediation ownership.</li></ol>
          <p className="mt-4 text-xs text-slate-500">Status: not started · Owner: unassigned · Evidence: none attached</p>
        </div>
      </div>
    </div>
  );
}
