import React from 'react';
import { Settings, Key, Shield } from 'lucide-react';

export default function ScannerSettingsView() {
  return (
    <div className="p-8 h-full flex flex-col bg-slate-50">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-800">Settings & API Keys</h2>
      </div>
      <div className="max-w-2xl space-y-6">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-indigo-500"/> LLM Provider Configurations</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OpenAI API Key</label>
              <input type="password" value="sk-........................" readOnly className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Anthropic API Key</label>
              <input type="password" value="sk-ant-...................." readOnly className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500" />
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-emerald-500"/> Scanner Tool Configurations</h3>
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Shodan API Key</label>
              <input type="password" placeholder="Enter Shodan key for ReconAgent" className="w-full p-2 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
