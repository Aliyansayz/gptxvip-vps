import React from 'react';
import { Shield, AlertTriangle, Clock, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';
import ResponsiveDataFrame from '../../../components/ResponsiveDataFrame';

const recentAlerts = [
  { sev: 'CRITICAL', desc: 'Anomalous Outbound Traffic to Known C2 Server', ip: '192.168.1.104', time: '2 mins ago', status: 'Unassigned' },
  { sev: 'HIGH', desc: 'Multiple Failed Login Attempts (Brute Force)', ip: '10.0.0.52', time: '15 mins ago', status: 'Investigating' },
  { sev: 'MEDIUM', desc: 'Suspicious PowerShell Execution', ip: '192.168.1.200', time: '1 hr ago', status: 'Contained' },
];

interface DfirDashboardViewProps {
  onStartInvestigation: () => void;
}

export default function DfirDashboardView({ onStartInvestigation }: DfirDashboardViewProps) {
  return (
    <div className="px-4 py-6 sm:p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar dfir-dashboard-header">
      <AgentPreviewNotice>Incident counts, identities, timestamps, and alerts are sample entries. Verify original event evidence before taking containment action.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">DFIR Command Center</h1>
          <p className="text-slate-500 mt-1">Prepared incident triage and evidence-review examples</p>
        </div>
        <button 
          onClick={onStartInvestigation}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          Run sample triage
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Example incidents', value: '2', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Example containments', value: '14', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Example pending', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Evidence connection', value: 'None', icon: CheckCircle, color: 'text-sky-600', bg: 'bg-sky-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4 dfir-incident-queue">Example alert queue</h2>
      <div className="space-y-3 lg:hidden">
        {recentAlerts.map((alert) => <article key={alert.ip} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800">{alert.sev}</span><span className="text-xs font-semibold text-slate-600">{alert.status}</span></div>
          <h3 className="mt-3 text-sm font-bold leading-6 text-slate-900">{alert.desc}</h3>
          <p className="mt-1 break-all font-mono text-xs text-slate-600">Source IP: {alert.ip} · example time: {alert.time}</p>
          <SourceStatus source="Built-in incident scenario" freshness="No live event timestamp" />
          <button type="button" onClick={onStartInvestigation} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-sky-200 px-3 text-sm font-semibold text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">Triage example alert <ArrowRight className="h-4 w-4" /></button>
        </article>)}
      </div>
      <ResponsiveDataFrame label="Example incident alerts" className="mb-8 hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="min-w-[56rem] w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Alert Description</th>
              <th className="px-6 py-4">Source IP</th>
              <th className="px-6 py-4">Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {recentAlerts.map((alert, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    alert.sev === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    alert.sev === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.sev}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{alert.desc}<SourceStatus source="Built-in incident scenario" freshness="No live event timestamp" /></td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{alert.ip}</td>
                <td className="px-6 py-4 text-slate-500">{alert.time}</td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium">{alert.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={onStartInvestigation} className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 justify-end w-full">
                    Triage <ArrowRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveDataFrame>
    </div>
  );
}
