import React from 'react';
import { Cloud, AlertTriangle, FileWarning, CheckCircle, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface CloudPostureDashboardViewProps {
  onAuditResource: () => void;
}

export default function CloudPostureDashboardView({ onAuditResource }: CloudPostureDashboardViewProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar cloud-posture-dashboard-header">
      <AgentPreviewNotice>Findings, resource identifiers, account names, and status values are illustrative. Confirm the cloud account and current resource state before changing configuration.</AgentPreviewNotice>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Cloud Security Posture (CSPM)</h1>
          <p className="text-slate-500 mt-1">Multi-Cloud Auditing and Automated Remediation</p>
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
          { label: 'Critical Misconfigs', value: '1', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'IaC Drift Events', value: '3', icon: FileWarning, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'IAM Issues', value: '12', icon: Key, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Compliance Score', value: '92%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      <h2 className="text-xl font-bold text-slate-800 mb-4 cloud-posture-feed">Detected Misconfigurations</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-left">
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
            {[
              { sev: 'CRITICAL', desc: 'S3 Bucket with PII is publicly accessible', resource: 'arn:aws:s3:::prod-customer-data-01', env: 'AWS Production', status: 'Requires Action' },
              { sev: 'HIGH', desc: 'IAM Role has AdministratorAccess policy attached', resource: 'role/Jenkins-Deploy-Role', env: 'AWS Staging', status: 'Analyzing' },
              { sev: 'MEDIUM', desc: 'PostgreSQL Database not encrypted at rest', resource: 'db-primary-eu-west-1', env: 'AWS Production', status: 'Pending Review' },
            ].map((alert, i) => (
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
                <td className="px-6 py-4 font-medium text-slate-800">{alert.desc}</td>
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
      </div>
    </div>
  );
}
