import React from 'react';
import { Globe, AlertTriangle, Activity, CheckCircle, ArrowRight, Rss, Target, HelpCircle } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface ThreatIntelDashboardViewProps {
  onInvestigateTarget: () => void;
  onRunTutorial: () => void;
}

export default function ThreatIntelDashboardView({ onInvestigateTarget, onRunTutorial }: ThreatIntelDashboardViewProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar threat-intel-dashboard-header">
      <AgentPreviewNotice>These feed items are examples, not verified intelligence. Source timestamps and confidence are not supplied; check a trusted source before acting on an indicator.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Threat Intelligence Command Center</h1>
          <p className="text-slate-500 mt-1">Global Threat Monitoring and Contextual Filtering</p>
          <button 
            onClick={onRunTutorial}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 shadow-sm transition-colors text-xs font-medium mt-3"
          >
            <HelpCircle className="w-4 h-4" />
            Tutorial Recap
          </button>
        </div>
        <button 
          onClick={onInvestigateTarget}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <Target className="w-4 h-4" />
          Investigate Targeted Alert
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Campaigns', value: '12', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Zero-Days Tracked', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Targeted Alerts', value: '1', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Global Sensors', value: 'Online', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      <h2 className="text-xl font-bold text-slate-800 mb-4 threat-intel-feed">Global Threat Feed & CVEs</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Threat Level</th>
              <th className="px-6 py-4">Intelligence Subject</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Relevance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {[
              { sev: 'CRITICAL', desc: 'CVE-2026-8899: Zero-Day in Nginx (RCE)', source: 'Dark Web Forum chatter', relevance: 'Direct Match (Asset: Web-01)', status: 'Action Required' },
              { sev: 'HIGH', desc: 'New Ransomware Variant (LockBit 4.0)', source: 'Security Advisory', relevance: 'Industry Match (Healthcare)', status: 'Monitoring' },
              { sev: 'MEDIUM', desc: 'Phishing Campaign targeting DevOps', source: 'OSINT Feed', relevance: 'Low (No current activity)', status: 'Archived' },
            ].map((alert, i) => (
              <tr key={i} className={`hover:bg-slate-50 transition-colors ${alert.relevance.includes('Direct Match') ? 'bg-purple-50/50' : ''}`}>
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
                <td className="px-6 py-4 text-slate-500 text-xs">{alert.source}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${alert.relevance.includes('Direct') ? 'text-purple-600' : 'text-slate-500'}`}>{alert.relevance}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium">{alert.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" disabled={!alert.relevance.includes('Direct')} onClick={alert.relevance.includes('Direct') ? onInvestigateTarget : undefined} className={`${alert.relevance.includes('Direct') ? 'text-purple-600 hover:text-purple-800' : 'text-slate-400 cursor-not-allowed'} font-medium flex items-center gap-1 justify-end w-full`}>
                    Contextualize <ArrowRight className="w-4 h-4" />
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
