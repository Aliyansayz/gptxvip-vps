import React from 'react';
import { FileText, Download, GitMerge, AlertCircle } from 'lucide-react';

export default function RedTeamReportingView() {
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

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600" />
              Attack Paths & Reporting
            </h2>
            <p className="text-slate-500 mt-2">Documented attack vectors and successful exploitation chains from recent simulations.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="space-y-6">
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
