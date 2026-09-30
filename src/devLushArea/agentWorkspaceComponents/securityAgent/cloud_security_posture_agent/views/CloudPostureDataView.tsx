import React from 'react';
import { FileWarning, Key, Database, FileCode, Settings } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';

interface CloudPostureDataViewProps {
  viewType: 'drift' | 'iam_audit' | 'data_security' | 'compliance' | 'settings';
}

export default function CloudPostureDataView({ viewType }: CloudPostureDataViewProps) {
  const content = {
    drift: {
      title: "Infrastructure Drift Detection",
      icon: FileWarning,
      description: "Illustrative resource drift; no cloud account or infrastructure baseline is connected.",
      items: [
        { label: "Detected Drift", value: "AWS S3 Bucket 'prod-assets' public access block removed (Manual Change)" },
        { label: "Affected Resource", value: "arn:aws:s3:::prod-assets" },
        { label: "Proposed review", value: "Verify the bucket policy, owner, baseline, and change record before planning remediation." }
      ]
    },
    iam_audit: {
      title: "IAM Auditing & Least Privilege",
      icon: Key,
      description: "Example identity findings; role usage and policy state are not verified.",
      items: [
        { label: "Over-permissive Role", value: "DevOps-Admin (Has AdministratorAccess, unused for 90 days)" },
        { label: "Stale Credentials", value: "User 'j.doe' access key > 180 days old" },
        { label: "Recommendation", value: "Downscope DevOps-Admin role based on Access Analyzer history." }
      ]
    },
    data_security: {
      title: "Data Security Posture",
      icon: Database,
      description: "Example encryption and exposure findings; no data store is connected.",
      items: [
        { label: "Unencrypted RDS", value: "Database 'legacy-users-db' is missing KMS encryption at rest" },
        { label: "Public Snapshot", value: "RDS snapshot 'backup-2025' is publicly accessible" },
        { label: "Suggested review", value: "Verify snapshot exposure, ownership, and change approval before changing permissions or scheduling encryption work." }
      ]
    },
    compliance: {
      title: "Compliance Reports",
      icon: FileCode,
      description: "Example benchmark checks without attached audit evidence.",
      items: [
        { label: "CIS AWS Foundations", value: "78% Pass Rate (Failures in IAM password policy)" },
        { label: "SOC2 Security", value: "Missing MFA for root account" },
        { label: "Evidence", value: "No verified evidence is available to export for an auditor." }
      ]
    },
    settings: {
      title: "CSPM Settings",
      icon: Settings,
      description: "Configure scanning schedules and cloud provider integrations.",
      items: [
        { label: "Cloud Provider", value: "Example labels: AWS and GCP (connection not verified); Azure (not configured in this sample)" },
        { label: "Scan Frequency", value: "Example schedule: continuous; no live trigger status is available." },
        { label: "Alerting", value: "Example routing label: Slack #secops-alerts and PagerDuty; delivery is not verified." }
      ]
    }
  };

  const data = content[viewType];
  const Icon = data.icon;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-blue-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>Resource names, findings, account configuration, and remediation notes are illustrative. Confirm the account and current cloud state before making changes.</AgentPreviewNotice>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 sm:p-5 md:flex-row md:items-start md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="break-all text-sm font-medium text-slate-600">{item.value}</p>
                  <SourceStatus source="Built-in cloud posture scenario" freshness="No connected account or scan date" confidence="Unverified" />
                  <p className="mt-1 text-xs text-slate-500">Owner: unknown · Remediation: not started in this preview</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
