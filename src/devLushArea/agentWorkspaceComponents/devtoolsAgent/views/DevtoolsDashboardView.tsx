import React from 'react';
import { GitPullRequest, Search, Zap, Activity, AlertCircle, ArrowRight, Code, Play } from 'lucide-react';

export default function DevtoolsDashboardView() {
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
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Review Agent: Active</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <GitPullRequest className="w-4 h-4 text-emerald-500" />
            <span>Open PRs: 14</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Style Violations: 42</span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Actionable Alerts & Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Code Quality Alerts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                   <AlertCircle className="w-4 h-4" /> Hardcoded Secret Detected
                 </div>
                 <p className="text-xs text-red-600/80">API Key found in PR #1042. Immediate remediation required before merge.</p>
               </div>
               <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                   <Activity className="w-4 h-4" /> High Cyclomatic Complexity
                 </div>
                 <p className="text-xs text-amber-600/80">Function `processTransaction` in `billing.ts` exceeds complexity threshold.</p>
               </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Live Agent Activity
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-mono text-xs text-slate-600 space-y-2 h-[104px] overflow-y-auto">
              <div className="text-emerald-600">[09:14:01] ReviewAgent: Analyzing PR #1043...</div>
              <div className="text-slate-500">[09:14:15] ReviewAgent: Found 3 style issues, 1 potential bug.</div>
              <div className="text-slate-500">[09:15:42] RefactorAgent: Generating suggested fix for `utils.js`.</div>
              <div className="animate-pulse text-emerald-600">_</div>
            </div>
          </div>
        </div>

        {/* Live Use Cases Examples */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-500" /> Analysis Workflows
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Automated PR Review</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Analyze diffs for stylistic consistency, potential bugs, and security vulnerabilities.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Dependency Audit</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Scan package.json for outdated or vulnerable dependencies and suggest updates.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Legacy Refactoring</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Identify outdated patterns and automatically suggest modernized TypeScript implementations.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Status: Ready</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
