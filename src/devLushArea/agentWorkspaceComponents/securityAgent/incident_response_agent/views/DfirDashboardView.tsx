import React from 'react';
import { Shield, AlertTriangle, Clock, Activity, CheckCircle, ArrowRight } from 'lucide-react';

interface DfirDashboardViewProps {
  onStartInvestigation: () => void;
}

export default function DfirDashboardView({ onStartInvestigation }: DfirDashboardViewProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar dfir-dashboard-header">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">DFIR Command Center</h1>
          <p className="text-slate-500 mt-1">Incident Response and Threat Containment Operations</p>
        </div>
        <button 
          onClick={onStartInvestigation}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          Triage New Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Incidents', value: '2', icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Contained Threats', value: '14', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Analysis', value: '5', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'System Status', value: 'Online', icon: CheckCircle, color: 'text-sky-600', bg: 'bg-sky-50' },
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

      <h2 className="text-xl font-bold text-slate-800 mb-4 dfir-incident-queue">Recent Alerts (SIEM)</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left">
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
            {[
              { sev: 'CRITICAL', desc: 'Anomalous Outbound Traffic to Known C2 Server', ip: '192.168.1.104', time: '2 mins ago', status: 'Unassigned' },
              { sev: 'HIGH', desc: 'Multiple Failed Login Attempts (Brute Force)', ip: '10.0.0.52', time: '15 mins ago', status: 'Investigating' },
              { sev: 'MEDIUM', desc: 'Suspicious PowerShell Execution', ip: '192.168.1.200', time: '1 hr ago', status: 'Contained' },
            ].map((alert, i) => (
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
                <td className="px-6 py-4 font-medium text-slate-800">{alert.desc}</td>
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
      </div>
    </div>
  );
}
