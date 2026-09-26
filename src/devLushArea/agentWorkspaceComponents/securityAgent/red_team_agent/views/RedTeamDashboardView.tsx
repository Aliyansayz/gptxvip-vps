import React from 'react';
import { Target, ShieldAlert, Crosshair, Network, FileText, Play, Search } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface RedTeamDashboardViewProps {
  onStartSimulation: () => void;
}

export default function RedTeamDashboardView({ onStartSimulation }: RedTeamDashboardViewProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <AgentPreviewNotice>This training preview runs scripted events for the fixed 10.0.x.x/24 scenario; it does not contact a target. Use only in an explicitly authorized lab.</AgentPreviewNotice>
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-48 h-48 text-red-600" />
          </div>
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
              <ShieldAlert className="w-4 h-4" />
              Advanced Persistent Threat (APT) Simulator
            </div>
            <h2 className="text-3xl font-bold font-heading text-slate-800 mb-4 leading-tight">
              Bounded training scenario
            </h2>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Review a predefined sequence of simulated events and the defensive signals they produce. This preview does not scan a live network or apply changes.
            </p>
            
            <button 
              type="button"
              onClick={onStartSimulation}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              Run simulated scenario
            </button>
          </div>
        </div>

        {/* Capabilities Grid */}
        <div>
          <h3 className="text-lg font-bold font-heading text-slate-800 mb-4 px-1">Simulation Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-300 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Advanced Reconnaissance</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Discover exposed assets and services.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-300 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Crosshair className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Vulnerability Chaining</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Combine low-severity bugs for high-impact compromise.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-300 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Network className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Lateral Movement</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Extract credentials and pivot across the network.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-300 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-800 mb-1">Defense Validation</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Generate attack path graphs and verify detection mechanisms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
