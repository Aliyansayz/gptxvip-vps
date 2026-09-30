import React from 'react';
import { Globe, AlertTriangle, Activity, CheckCircle, ArrowRight, Rss, Target, HelpCircle } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';
import ResponsiveDataFrame from '../../../components/ResponsiveDataFrame';

const feedItems = [
  { sev: 'CRITICAL', desc: 'CVE-2026-8899: Zero-Day in Nginx (RCE)', source: 'Dark Web Forum chatter', relevance: 'Direct Match (Asset: Web-01)', status: 'Action Required' },
  { sev: 'HIGH', desc: 'New Ransomware Variant (LockBit 4.0)', source: 'Security Advisory', relevance: 'Industry Match (Healthcare)', status: 'Monitoring' },
  { sev: 'MEDIUM', desc: 'Phishing Campaign targeting DevOps', source: 'OSINT Feed', relevance: 'Low (No current activity)', status: 'Archived' },
];

interface ThreatIntelDashboardViewProps {
  onInvestigateTarget: () => void;
  onRunTutorial: () => void;
}

export default function ThreatIntelDashboardView({ onInvestigateTarget, onRunTutorial }: ThreatIntelDashboardViewProps) {
  return (
    <div className="px-4 py-6 sm:p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar threat-intel-dashboard-header">
      <AgentPreviewNotice>These feed items are examples, not verified intelligence. Source timestamps and confidence are not supplied; check a trusted source before acting on an indicator.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Threat Intelligence Command Center</h1>
          <p className="text-slate-500 mt-1">Prepared indicator review without a connected feed</p>
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
          Run sample analysis
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Example campaigns', value: '12', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Example CVE claims', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Example alerts', value: '1', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Feed connection', value: 'None', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
      <div className="space-y-3 lg:hidden">
        {feedItems.map((item) => <article key={item.desc} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-800">{item.sev}</span><span className="text-xs font-semibold text-slate-600">{item.status}</span></div>
          <h3 className="mt-3 text-sm font-bold leading-6 text-slate-900">{item.desc}</h3>
          <p className="mt-2 text-xs text-slate-600">Relevance: {item.relevance}</p>
          <SourceStatus source={`Scenario label: ${item.source}`} freshness="Original source and date unavailable" confidence="Unverified" />
          {item.relevance.includes('Direct') && <button type="button" onClick={onInvestigateTarget} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-purple-200 px-3 text-sm font-semibold text-purple-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600">Inspect example context <ArrowRight className="h-4 w-4" /></button>}
        </article>)}
      </div>
      <ResponsiveDataFrame label="Example threat intelligence feed" className="mb-8 hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="min-w-[58rem] w-full text-left">
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
            {feedItems.map((alert, i) => (
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
                <td className="px-6 py-4 font-medium text-slate-800">{alert.desc}<SourceStatus source={`Scenario label: ${alert.source}`} freshness="Original source and date unavailable" confidence="Unverified" /></td>
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
      </ResponsiveDataFrame>
    </div>
  );
}
