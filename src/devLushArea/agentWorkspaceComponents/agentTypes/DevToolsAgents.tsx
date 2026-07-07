import React from 'react';
import { Code, Database, GitPullRequest, GitMerge, Search } from 'lucide-react';

interface DevToolsAgentsProps {
  onNavigate?: (view: string) => void;
}

export const DevToolsAgents: React.FC<DevToolsAgentsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-emerald-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <Code className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-emerald-600 transition-colors">DevTools Agents</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Agents that assist with code reviews, CI/CD pipeline optimization, and automated refactoring.
      </p>
      
      <div className="space-y-3">
        <button 
          onClick={() => onNavigate && onNavigate('devtools-agent')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <GitPullRequest className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Code Review Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Automated PR analysis & style enforcement</div>
            </div>
          </div>
        </button>
        
        <button 
          onClick={() => onNavigate && onNavigate('sast-agent')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all text-left mt-3"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Source Code Auditor (SAST)</div>
              <div className="text-[11px] text-slate-500 font-medium">Automated vulnerability scanning in CI/CD</div>
            </div>
          </div>
        </button>
        
        <button 
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed text-left"
        >
          <div className="flex items-center gap-3">
            <GitMerge className="w-5 h-5 text-slate-400" />
            <div>
              <div className="font-semibold text-sm text-slate-600">Refactoring Agent</div>
              <div className="text-[11px] text-slate-400 font-medium">Legacy code modernization (Coming soon)</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
