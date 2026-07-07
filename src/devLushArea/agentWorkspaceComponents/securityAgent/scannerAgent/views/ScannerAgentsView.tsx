import React from 'react';
import { Users, Bot, Zap } from 'lucide-react';

export default function ScannerAgentsView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Agent Roster</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['ReconAgent', 'ScannerAgent', 'ExploitAgent', 'ReportingAgent'].map(agent => (
          <div key={agent} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{agent}</h3>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span> Online
                </p>
              </div>
            </div>
            <div className="text-sm text-slate-600 border-t border-slate-100 pt-3">
              Specialized in {agent.replace('Agent', '').toLowerCase()} tasks.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
