import React from 'react';
import { FlaskConical, BrainCircuit, Activity } from 'lucide-react';

interface AgentLabsProps {
  onNavigate: (view: string) => void;
}

export const AgentLabs: React.FC<AgentLabsProps> = ({ onNavigate }) => {
  return (
    <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col group hover:border-emerald-300 hover:shadow-md transition-all shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
          <FlaskConical className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-800 group-hover:text-emerald-600 transition-colors">Agent Labs</h2>
      </div>
      <p className="text-slate-500 mb-6 flex-1 text-sm leading-relaxed">
        Interactive labs and reading activities focused on the core architecture and theory of autonomous agents.
      </p>
      <div className="space-y-3">
        <button 
          onClick={() => onNavigate('memory-types-lab')}
          className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 hover:shadow-sm transition-all text-left"
        >
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="font-semibold text-sm text-slate-800">Comprehensive Memory Types</div>
              <div className="text-[11px] text-slate-500 font-medium">Explore the 7 memory types used by agents</div>
            </div>
          </div>
          <Activity className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </div>
  );
};
