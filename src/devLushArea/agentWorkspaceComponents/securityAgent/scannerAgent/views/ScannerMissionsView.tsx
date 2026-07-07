import React from 'react';
import { Compass, Target, Play } from 'lucide-react';

export default function ScannerMissionsView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Compass className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Active Missions</h2>
      </div>
      <div className="space-y-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Weekly Perimeter Scan</h3>
              <p className="text-sm text-slate-500">Automated discovery and basic vulnerability scanning across all known external assets.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase rounded-full">In Progress</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-slate-500 text-right">45% Complete (Estimated 2h remaining)</p>
        </div>
      </div>
    </div>
  );
}
