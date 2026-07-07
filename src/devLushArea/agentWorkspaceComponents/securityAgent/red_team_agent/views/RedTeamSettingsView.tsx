import React from 'react';
import { Settings, Shield, Globe, Zap, Save } from 'lucide-react';

export default function RedTeamSettingsView() {
  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-red-600" />
            Simulation Settings
          </h2>
          <p className="text-slate-500 mt-2">Configure Rules of Engagement (RoE) and simulation parameters.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <Globe className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-800">Target Scope</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">In-Scope IP Ranges (CIDR)</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-600 h-24"
                defaultValue={"10.0.0.0/24\n192.168.1.0/24\n*.example.com"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Out-of-Scope (Blacklist)</label>
              <input 
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-600"
                defaultValue="10.0.0.254, hr.example.com"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <Shield className="w-5 h-5 text-slate-400" />
            <h3 className="font-bold text-slate-800">Engagement Rules</h3>
          </div>
          <div className="p-5 space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Enable automated exploitation (Safe Mode)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Allow lateral movement via SMB</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Simulate Denial of Service (DoS) conditions</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>

      </div>
    </div>
  );
}
