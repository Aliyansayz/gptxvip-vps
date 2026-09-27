import React from 'react';
import { Shield, Search, Activity, Lock, Globe, Cloud } from 'lucide-react';

interface SecOpsAgentsProps {
  onNavigate: (view: string) => void;
}

export const SecOpsAgents: React.FC<SecOpsAgentsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-red-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-red-600 transition-colors">SecOps Agents</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Explore sample workflows for vulnerability triage, incident response, threat intelligence, and cloud posture review.
      </p>
      <div className="space-y-3">
        <button 
          type="button"
          onClick={() => onNavigate('scanner-agent')}
          className="w-full min-h-11 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 hover:shadow-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Scanner Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Review example findings and a scripted scan preview</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>
        
        <button 
          type="button"
          onClick={() => onNavigate('dfir-agent')}
          className="w-full min-h-11 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 hover:shadow-sm transition-all text-left mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Incident Response (DFIR) Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Walk through a sample incident and evidence views</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          type="button"
          onClick={() => onNavigate('threat-intel-agent')}
          className="w-full min-h-11 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-purple-300 hover:shadow-sm transition-all text-left mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Threat Intelligence Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Inspect example indicators and source context</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          type="button"
          onClick={() => onNavigate('cloud-posture-agent')}
          className="w-full min-h-11 flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all text-left mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex items-center gap-3">
            <Cloud className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Cloud Security Posture Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Review sample cloud risks and remediation notes</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
