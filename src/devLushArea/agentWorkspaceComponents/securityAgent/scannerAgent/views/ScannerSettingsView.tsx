import React from 'react';
import { Settings, Key, Shield, CircleOff } from 'lucide-react';

const ConnectionStatus = ({ name }: { name: string }) => (
  <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
    <span className="text-sm font-medium text-slate-700">{name}</span>
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      <CircleOff className="h-3.5 w-3.5" aria-hidden="true" /> Not connected
    </span>
  </div>
);

export default function ScannerSettingsView() {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-5 sm:p-8">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
        <Settings className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        <h2 className="text-xl font-bold text-slate-800">Settings &amp; API Connections</h2>
      </div>
      <div className="max-w-2xl space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="provider-settings-heading">
          <h3 id="provider-settings-heading" className="mb-2 flex items-center gap-2 font-bold text-slate-800">
            <Key className="h-4 w-4 text-indigo-500" aria-hidden="true" /> LLM Provider Connections
          </h3>
          <p className="mb-4 text-sm text-slate-500">This preview has no provider backend. Credentials cannot be entered or used here.</p>
          <div className="space-y-3">
            <ConnectionStatus name="OpenAI" />
            <ConnectionStatus name="Anthropic" />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="scanner-settings-heading">
          <h3 id="scanner-settings-heading" className="mb-2 flex items-center gap-2 font-bold text-slate-800">
            <Shield className="h-4 w-4 text-emerald-500" aria-hidden="true" /> Scanner Integrations
          </h3>
          <p className="mb-4 text-sm text-slate-500">Scanner actions in this workspace play sample output and send no network requests.</p>
          <ConnectionStatus name="Shodan Recon" />
        </section>
      </div>
    </div>
  );
}
