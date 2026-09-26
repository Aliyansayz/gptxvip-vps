import React from 'react';
import { Inbox, Activity, Search, Shield, Settings } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface DfirDataViewProps {
  viewType: 'queue' | 'activity' | 'iocs' | 'containment' | 'settings';
}

export default function DfirDataView({ viewType }: DfirDataViewProps) {
  const content = {
    queue: {
      title: "Incident Queue",
      icon: Inbox,
      description: "Triage and prioritize incoming security alerts and incidents.",
      items: [
        { label: "INC-9942", value: "Suspicious PowerShell activity on endpoint 'WS-Finance-04'. (Severity: High)" },
        { label: "INC-9943", value: "Multiple failed login attempts from Tor exit node. (Severity: Medium)" },
        { label: "INC-9944", value: "Impossible travel detected for user 'alice.m'. (Severity: High)" }
      ]
    },
    activity: {
      title: "Sample DFIR Activity",
      icon: Activity,
      description: "Real-time stream of agent investigations and automated actions.",
      items: [
        { label: "09:42:12 UTC", value: "Agent acquiring memory dump from 'WS-Finance-04'." },
        { label: "09:44:05 UTC", value: "YARA scan completed. 2 matches found for 'TrickBot' signatures." },
        { label: "09:45:30 UTC", value: "Automated network isolation triggered for 'WS-Finance-04'." }
      ]
    },
    iocs: {
      title: "Indicators of Compromise (IoCs)",
      icon: Search,
      description: "Manage extracted hashes, IPs, domains, and artifacts.",
      items: [
        { label: "File Hash (SHA-256)", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (TrickBot payload)" },
        { label: "C2 Domain", value: "malicious-update-server[.]xyz" },
        { label: "Action", value: "Pushed IoCs to perimeter firewall blocklist." }
      ]
    },
    containment: {
      title: "Containment & Remediation",
      icon: Shield,
      description: "Automated playbooks for neutralizing active threats.",
      items: [
        { label: "Endpoint Isolation", value: "Uses CrowdStrike Falcon API to quarantine infected hosts." },
        { label: "Account Suspension", value: "Revokes active Okta sessions and forces password reset." },
        { label: "Malware Removal", value: "Deletes identified payload and removes persistence mechanisms (Run keys)." }
      ]
    },
    settings: {
      title: "DFIR Agent Settings",
      icon: Settings,
      description: "Configure integrations, playbooks, and evidence preservation.",
      items: [
        { label: "Evidence Storage", value: "AWS S3 (arn:aws:s3:::dfir-evidence-vault) with WORM lock enabled." },
        { label: "Automation Level", value: "Semi-Automated (Requires human approval for network isolation)" },
        { label: "Integrations", value: "Splunk (SIEM), CrowdStrike (EDR), Jira (Ticketing)" }
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
            <Icon className="w-6 h-6 text-indigo-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>These are example records; evidence artifacts are not attached. Containment entries describe a playbook pattern and do not show an executed action or approval record.</AgentPreviewNotice>
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
