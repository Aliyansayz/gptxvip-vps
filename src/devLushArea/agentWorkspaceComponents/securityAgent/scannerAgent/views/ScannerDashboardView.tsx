import React, { useState } from 'react';
import { WebVulnCandidate } from '../utility/schema';
import { Shield, Target, DollarSign, Activity, AlertCircle, Play, Bug, Terminal, Zap, ArrowRight, Search, ShieldCheck, HelpCircle } from 'lucide-react';

interface ScannerDashboardViewProps {
  candidates: WebVulnCandidate[];
  onStartScan: (target: string) => void;
  onViewAllFindings: () => void;
}

export default function ScannerDashboardView({ candidates, onStartScan, onViewAllFindings }: ScannerDashboardViewProps) {
  return (
    <div className="w-full h-full flex flex-col bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar">
      
      {/* Global Header */}
      <div id="tutorial-header" className="sticky top-0 z-10 flex flex-wrap items-center justify-between p-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur-md gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Target className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-mono text-slate-700">Target: *.internal-sandbox.com</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-slate-200 shadow-sm">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="text-sm font-medium text-slate-700">Recon Agent: Active</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Pending: $4,250</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <Bug className="w-4 h-4 text-purple-500" />
            <span>Resolved: 12</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Rank: 42</span>
          </div>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md border border-indigo-200 shadow-sm transition-colors text-sm font-medium"
          >
            <HelpCircle className="w-4 h-4" />
            Tutorial Recap
          </button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Actionable Alerts & Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div id="tutorial-alerts" className="md:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Actionable Alerts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl border border-red-200 bg-red-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                   <AlertCircle className="w-4 h-4" /> Critical SSRF Candidate
                 </div>
                 <p className="text-xs text-red-600/80">Found on /api/webhook/test. Immediate verification required.</p>
               </div>
               <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex flex-col gap-2 shadow-sm">
                 <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                   <Search className="w-4 h-4" /> 3 New Subdomains
                 </div>
                 <p className="text-xs text-blue-600/80">Discovered via passive enumeration. Ready for active scanning.</p>
               </div>
            </div>
          </div>
          
          <div id="tutorial-activity" className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" /> Activity Stream
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm font-mono text-xs text-slate-600 space-y-2 h-[104px] overflow-y-auto">
              <div className="text-emerald-600">[10:42:01] ReconAgent: Enumerating staging.internal...</div>
              <div className="text-slate-500">[10:42:05] ReconAgent: Found 14 alive endpoints.</div>
              <div className="text-slate-500">[10:43:12] VulnAgent: Starting fuzzing on auth service.</div>
              <div className="animate-pulse text-emerald-600">_</div>
            </div>
          </div>
        </div>

        {/* Live Use Cases Examples */}
        <div id="tutorial-quick-start" className="space-y-4">
           <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-500" /> Live Use Cases / Quick Start
           </h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <button onClick={() => onStartScan('https://ecommerce.example.com/checkout')} className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">E-Commerce Checkout</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Deep SSRF & IDOR scan on payment webhook endpoints.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Target: /checkout/api</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button onClick={() => onStartScan('https://api.example.com/graphql')} className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">GraphQL Introspection</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">Check for introspection, rate limits, and excessive data exposure.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Target: /graphql</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
             <button onClick={() => onStartScan('https://admin.legacy.example.com')} className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-emerald-300 hover:shadow-md transition-all text-left group shadow-sm">
                <h4 className="font-semibold text-sm mb-1 text-slate-800 group-hover:text-emerald-600 transition-colors">Legacy Admin Fuzzing</h4>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">SQLi and Command Injection payload spray on legacy forms.</p>
                <div className="text-xs font-mono text-emerald-600 flex items-center justify-between">
                  <span>Target: admin.legacy</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
             </button>
           </div>
        </div>

        {/* Custom Target Input */}
        <div id="tutorial-custom-target" className="flex flex-col sm:flex-row items-center gap-4 p-1.5 rounded-xl border border-slate-200 bg-white shadow-sm">
           <div className="flex-1 flex items-center w-full px-3">
             <Search className="w-5 h-5 text-slate-400 mr-2" />
             <input 
                type="text"
                placeholder="Enter custom target URL or IP range..."
                className="w-full bg-transparent border-none py-3 text-sm focus:outline-none font-mono text-slate-700 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onStartScan(e.currentTarget.value);
                }}
             />
           </div>
           <button 
             onClick={(e) => {
               const input = e.currentTarget.parentElement?.querySelector('input');
               if (input?.value) onStartScan(input.value);
             }}
             className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap shadow-sm"
           >
             Scan Asset
           </button>
        </div>

        <div className="pt-4">
          
          {/* Priority Queue */}
          <div id="tutorial-priority-queue" className="space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-purple-500" /> Priority Queue (To Verify)
               </h3>
               <button onClick={onViewAllFindings} className="text-xs text-purple-600 hover:text-purple-700 transition-colors font-medium hover:underline">View All Findings</button>
             </div>
             <div className="space-y-3">
                {candidates.slice(0, 3).map(candidate => (
                  <div key={candidate.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group shadow-sm" onClick={onViewAllFindings}>
                    <div className="flex items-center gap-4">
                      <div className={`px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold ${
                        candidate.confidenceScore.includes('High') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {candidate.confidenceScore.split(' ')[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{candidate.vulnClass}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{candidate.endpoint}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                  </div>
                ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
