import React, { useState } from 'react';
import { Settings, Shield, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

interface RedTeamSettings {
  inScope: string;
  outOfScope: string;
  safeMode: boolean;
  allowSmb: boolean;
  simulateDos: boolean;
}

const DEFAULT_SETTINGS: RedTeamSettings = {
  inScope: '10.0.0.0/24\n192.168.1.0/24\n*.example.com',
  outOfScope: '10.0.0.254, hr.example.com',
  safeMode: true,
  allowSmb: true,
  simulateDos: false,
};

const readSavedSettings = (): RedTeamSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem('red-team-simulation-settings');
    if (!raw) return DEFAULT_SETTINGS;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return DEFAULT_SETTINGS;
    const saved = value as Partial<RedTeamSettings>;
    return {
      inScope: typeof saved.inScope === 'string' ? saved.inScope : DEFAULT_SETTINGS.inScope,
      outOfScope: typeof saved.outOfScope === 'string' ? saved.outOfScope : DEFAULT_SETTINGS.outOfScope,
      safeMode: typeof saved.safeMode === 'boolean' ? saved.safeMode : DEFAULT_SETTINGS.safeMode,
      allowSmb: typeof saved.allowSmb === 'boolean' ? saved.allowSmb : DEFAULT_SETTINGS.allowSmb,
      simulateDos: typeof saved.simulateDos === 'boolean' ? saved.simulateDos : DEFAULT_SETTINGS.simulateDos,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export default function RedTeamSettingsView() {
  const [settings, setSettings] = useState<RedTeamSettings>(readSavedSettings);
  const [saveStatus, setSaveStatus] = useState('');
  const updateSetting = <K extends keyof RedTeamSettings>(key: K, value: RedTeamSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaveStatus('');
  };
  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      window.localStorage.setItem('red-team-simulation-settings', JSON.stringify(settings));
      setSaveStatus('Saved to this browser. These demo settings do not run scans.');
    } catch {
      toast.error('Could not save settings in this browser.');
    }
  };

  return (
    <form onSubmit={handleSave} className="flex-1 p-8 bg-slate-50 overflow-y-auto">
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
              <label htmlFor="red-team-in-scope" className="block text-sm font-medium text-slate-700 mb-1">In-Scope IP Ranges (CIDR)</label>
              <textarea 
                id="red-team-in-scope"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-600 h-24"
                value={settings.inScope}
                onChange={(event) => updateSetting('inScope', event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="red-team-out-of-scope" className="block text-sm font-medium text-slate-700 mb-1">Out-of-Scope (Blacklist)</label>
              <input 
                id="red-team-out-of-scope"
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-mono text-slate-600"
                value={settings.outOfScope}
                onChange={(event) => updateSetting('outOfScope', event.target.value)}
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
              <input type="checkbox" checked={settings.safeMode} onChange={(event) => updateSetting('safeMode', event.target.checked)} className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Enable automated exploitation (Safe Mode)</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.allowSmb} onChange={(event) => updateSetting('allowSmb', event.target.checked)} className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Allow lateral movement via SMB</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={settings.simulateDos} onChange={(event) => updateSetting('simulateDos', event.target.checked)} className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500" />
              <span className="text-sm font-medium text-slate-700">Simulate Denial of Service (DoS) conditions</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          {saveStatus && <p role="status" className="mr-auto text-sm text-emerald-700">{saveStatus}</p>}
          <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>

      </div>
    </form>
  );
}
