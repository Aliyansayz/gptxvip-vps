import React from 'react';
import { FileText, Download, GitMerge } from 'lucide-react';
import { toast } from 'sonner';

interface RedTeamReportingViewProps {
  scenarioLogs: string[];
  scenarioComplete: boolean;
  onOpenScenario: () => void;
}

export default function RedTeamReportingView({ scenarioLogs, scenarioComplete, onOpenScenario }: RedTeamReportingViewProps) {
  const attackPaths = [
    {
      id: "PATH-01",
      severity: "critical",
      target: "Production Database Server",
      steps: [
        "External recon identified exposed dev sub-domain.",
        "Exploited SSRF in PDF generator endpoint.",
        "Extracted AWS IAM credentials from instance metadata.",
        "Pivoted to internal network using compromised keys.",
        "Dumped database using misconfigured security group."
      ]
    },
    {
      id: "PATH-02",
      severity: "high",
      target: "Domain Controller",
      steps: [
        "Phishing simulation captured credentials for a low-priv user.",
        "Gained initial access to VPN.",
        "Found Kerberoastable service account.",
        "Cracked service account hash offline.",
        "Escalated privileges to Domain Admin."
      ]
    }
  ];

  const handleExportReport = () => {
    try {
      const report = [
        'Scripted training preview. No target was contacted or defense validated.',
        scenarioLogs.length ? `Current scenario trace:\n${scenarioLogs.join('\n')}` : 'Current scenario trace: no scenario run yet.',
        'Reference paths below are illustrative examples, not findings from this trace.',
        ...attackPaths.map((path) => [
        `${path.id} — ${path.target} (${path.severity.toUpperCase()})`,
        ...path.steps.map((step, index) => `${index + 1}. ${step}`),
      ].join('\n'))].join('\n\n');
      const url = URL.createObjectURL(new Blob([report], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'red-team-attack-paths.txt';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      toast.success('Sample report downloaded.');
    } catch {
      toast.error('Could not export the report. Please try again.');
    }
  };

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" />
              Attack Paths & Reporting
            </h2>
            <p className="text-slate-500 mt-2">Illustrative sample attack paths for study. They are not findings from a scan or recent engagement.</p>
          </div>
          <button type="button" onClick={handleExportReport} className="min-h-11 self-start flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-500">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <section aria-labelledby="red-team-trace-title" className="rounded-xl border border-red-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-red-700">Current scenario · sample evidence</p>
          <h3 id="red-team-trace-title" className="mt-1 text-lg font-semibold text-slate-900">Evidence-to-report trace</h3>
          <p className="mt-1 text-sm text-slate-600">{scenarioComplete ? 'The scripted sequence is complete. These are the exact events shown in the terminal.' : scenarioLogs.length ? 'The scripted sequence is still in progress or was stopped. Its trace is partial.' : 'No scenario has run. The reference paths below are separate examples.'}</p>
          {scenarioLogs.length > 0 ? <ol className="mt-4 space-y-2 rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-100">{scenarioLogs.map((log, index) => <li key={`${index}-${log}`} className="break-words">{log}</li>)}</ol> : <button type="button" onClick={onOpenScenario} className="mt-4 min-h-11 rounded-lg border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Open sample scenario</button>}
        </section>

        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">Separate reference paths</h3>
          {attackPaths.map((path) => (
            <div key={path.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    path.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {path.severity}
                  </div>
                  <h3 className="font-bold text-slate-800">{path.target}</h3>
                </div>
                <span className="text-slate-400 font-mono text-sm">{path.id}</span>
              </div>
              
              <div className="p-6">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-slate-400" />
                  Exploitation Chain
                </h4>
                <div className="space-y-4">
                  {path.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-xs font-bold text-red-600">
                          {idx + 1}
                        </div>
                        {idx < path.steps.length - 1 && <div className="w-px h-full bg-slate-200 my-1" />}
                      </div>
                      <div className="pb-4 text-sm text-slate-600 font-medium pt-0.5">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
