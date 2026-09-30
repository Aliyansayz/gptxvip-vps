import React from 'react';
import { Cloud, AlertTriangle, FileWarning, CheckCircle, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';
import ResponsiveDataFrame from '../../../components/ResponsiveDataFrame';

const postureFindings = [
  { sev: 'CRITICAL', desc: 'S3 Bucket with PII is publicly accessible', resource: 'arn:aws:s3:::prod-customer-data-01', env: 'AWS Production', status: 'Requires Action' },
  { sev: 'HIGH', desc: 'IAM Role has AdministratorAccess policy attached', resource: 'role/Jenkins-Deploy-Role', env: 'AWS Staging', status: 'Analyzing' },
  { sev: 'MEDIUM', desc: 'PostgreSQL Database not encrypted at rest', resource: 'db-primary-eu-west-1', env: 'AWS Production', status: 'Pending Review' },
];

interface CloudPostureDashboardViewProps {
  onAuditResource: () => void;
}

export default function CloudPostureDashboardView({ onAuditResource }: CloudPostureDashboardViewProps) {
  return (
    <div className="px-4 py-6 sm:p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar cloud-posture-dashboard-header">
      <AgentPreviewNotice>Findings, resource identifiers, account names, and status values are illustrative. Confirm the cloud account and current resource state before changing configuration.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Cloud Security Posture (CSPM)</h1>
          <p className="text-slate-500 mt-1">Prepared cloud findings and remediation review</p>
        </div>
        <button 
          onClick={onAuditResource}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" />
          Review critical finding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Example critical findings', value: '1', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Example drift events', value: '3', icon: FileWarning, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Example IAM issues', value: '12', icon: Key, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Example score', value: '92%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      <h2 className="text-xl font-bold text-slate-800 mb-4 cloud-posture-feed">Example misconfigurations</h2>
      <div className="space-y-3 lg:hidden">
        {postureFindings.map((finding) => <article key={finding.resource} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900">{finding.sev}</span><span className="text-xs font-semibold text-slate-600">{finding.status}</span></div>
          <h3 className="mt-3 text-sm font-bold leading-6 text-slate-900">{finding.desc}</h3>
          <p className="mt-2 break-all font-mono text-xs text-slate-600">{finding.resource} · {finding.env}</p>
          <SourceStatus source="Built-in cloud scenario" freshness="No connected account" />
          {finding.sev === 'CRITICAL' && <button type="button" onClick={onAuditResource} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-200 px-3 text-sm font-semibold text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Review example finding <ArrowRight className="h-4 w-4" /></button>}
        </article>)}
      </div>
      <ResponsiveDataFrame label="Example cloud posture findings" className="mb-8 hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <table className="min-w-[58rem] w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Issue Description</th>
              <th className="px-6 py-4">Resource ID</th>
              <th className="px-6 py-4">Environment</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {postureFindings.map((alert, i) => (
              <tr key={i} className={`hover:bg-slate-50 transition-colors ${alert.sev === 'CRITICAL' ? 'bg-red-50/50' : ''}`}>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    alert.sev === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                    alert.sev === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {alert.sev}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{alert.desc}<SourceStatus source="Built-in cloud scenario" freshness="No connected account" /></td>
                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{alert.resource}</td>
                <td className="px-6 py-4 text-slate-500">{alert.env}</td>
                <td className="px-6 py-4">
                  <span className="text-slate-600 font-medium">{alert.status}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button type="button" disabled={alert.sev !== 'CRITICAL'} onClick={alert.sev === 'CRITICAL' ? onAuditResource : undefined} className={`${alert.sev === 'CRITICAL' ? 'text-blue-600 hover:text-blue-800' : 'text-slate-400 cursor-not-allowed'} font-medium flex items-center gap-1 justify-end w-full`}>
                    Review finding <ArrowRight className="w-4 h-4" />
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
