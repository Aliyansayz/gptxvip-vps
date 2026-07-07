import React from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { SvgEmptyState } from '../components/ScannerIllustrations';

export default function ScannerAnalyticsView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <TrendingUp className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Analytics & Cost Tracking</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Total Token Usage (30d)</p>
          <h3 className="text-2xl font-bold text-slate-800">4.2M</h3>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Estimated API Cost (30d)</p>
          <h3 className="text-2xl font-bold text-slate-800">$142.50</h3>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500 mb-1">Vulnerabilities Found</p>
          <h3 className="text-2xl font-bold text-emerald-600">24</h3>
        </div>
      </div>
      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
        <SvgEmptyState title="Detailed Analytics" message="Charts and timeline views will be rendered here once sufficient data is collected." />
      </div>
    </div>
  );
}
