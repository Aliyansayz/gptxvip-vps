import React from 'react';
import { FileWarning, Key, Database, FileCode, Settings } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface CloudPostureDataViewProps {
  viewType: 'drift' | 'iam_audit' | 'data_security' | 'compliance' | 'settings';
}

export default function CloudPostureDataView({ viewType }: CloudPostureDataViewProps) {
  const content = {
    drift: {
      title: "Infrastructure Drift Detection",
      icon: FileWarning,
      description: "Identify resources that have deviated from their infrastructure-as-code baseline.",
      items: [
        { label: "Detected Drift", value: "AWS S3 Bucket 'prod-assets' public access block removed (Manual Change)" },
        { label: "Affected Resource", value: "arn:aws:s3:::prod-assets" },
        { label: "Remediation", value: "Re-apply Terraform state or run automated rollback." }
      ]
    },
    iam_audit: {
      title: "IAM Auditing & Least Privilege",
      icon: Key,
      description: "Analyze Identity and Access Management policies for overly permissive roles.",
      items: [
        { label: "Over-permissive Role", value: "DevOps-Admin (Has AdministratorAccess, unused for 90 days)" },
        { label: "Stale Credentials", value: "User 'j.doe' access key > 180 days old" },
        { label: "Recommendation", value: "Downscope DevOps-Admin role based on Access Analyzer history." }
      ]
    },
    data_security: {
      title: "Data Security Posture",
      icon: Database,
      description: "Monitor encryption, backup, and public exposure of data stores.",
      items: [
        { label: "Unencrypted RDS", value: "Database 'legacy-users-db' is missing KMS encryption at rest" },
        { label: "Public Snapshot", value: "RDS snapshot 'backup-2025' is publicly accessible" },
        { label: "Suggested review", value: "Verify snapshot exposure, ownership, and change approval before changing permissions or scheduling encryption work." }
      ]
    },
    compliance: {
      title: "Compliance Reports",
      icon: FileCode,
      description: "Check infrastructure against SOC2, HIPAA, and CIS benchmarks.",
      items: [
        { label: "CIS AWS Foundations", value: "78% Pass Rate (Failures in IAM password policy)" },
        { label: "SOC2 Security", value: "Missing MFA for root account" },
        { label: "Export", value: "Generate PDF evidence for auditor." }
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
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
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
              <div key={idx} className="p-5 flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="text-sm text-slate-600 font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
