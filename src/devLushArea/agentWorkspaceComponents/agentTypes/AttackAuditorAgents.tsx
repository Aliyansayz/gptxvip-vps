import React from 'react';
import { Target, Code, Activity, ShieldAlert, Zap } from 'lucide-react';

interface AttackAuditorAgentsProps {
  onNavigate: (view: string) => void;
}

export const AttackAuditorAgents: React.FC<AttackAuditorAgentsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-orange-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
          <Target className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-orange-600 transition-colors">Attack & Auditor Agents</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Offensive security agents focused on source code auditing, red team simulations, and adversarial testing.
      </p>
      <div className="space-y-3">
        <button 
          onClick={() => onNavigate('sast-agent')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-orange-300 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-orange-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Source Code Auditor (SAST) Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Automated static code analysis & vulnerability discovery</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>
        
        <button 
          onClick={() => onNavigate('red-team-agent')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-red-300 hover:shadow-sm transition-all text-left mt-3"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Red Team Simulation Agent</div>
              <div className="text-[11px] text-slate-500 font-medium">Automated lateral movement & APT emulation</div>
            </div>
          </div>
          <Zap className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
