import React from 'react';
import { Inbox, Activity, Search, Shield, Settings } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';

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
      description: "Prepared sequence of example investigation events; no live event stream is connected.",
      items: [
        { label: "Step 1 · sample time 09:42:12", value: "Example collection request for 'WS-Finance-04'; no memory artifact is attached." },
        { label: "Step 2 · sample time 09:44:05", value: "Example YARA result: two illustrative signature matches; evidence is not attached." },
        { label: "Step 3 · sample time 09:45:30", value: "Example containment proposal for 'WS-Finance-04'; no isolation was executed." }
      ]
    },
    iocs: {
      title: "Indicators of Compromise (IoCs)",
      icon: Search,
      description: "Manage extracted hashes, IPs, domains, and artifacts.",
      items: [
        { label: "File Hash (SHA-256)", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855 (TrickBot payload)" },
        { label: "C2 Domain", value: "malicious-update-server[.]xyz" },
        { label: "Possible action", value: "Review and validate the indicators before considering a firewall blocklist change." }
      ]
    },
    containment: {
      title: "Containment & Remediation",
      icon: Shield,
      description: "Illustrative containment playbooks that require evidence, approval, and a connected system.",
      items: [
        { label: "Endpoint Isolation", value: "Uses CrowdStrike Falcon API to quarantine infected hosts." },
        { label: "Account Suspension", value: "Revokes active Okta sessions and forces password reset." },
        { label: "Malware Removal", value: "Deletes identified payload and removes persistence mechanisms (Run keys)." }
      ]
    },
    settings: {
      title: "DFIR Agent Settings",
      icon: Settings,
      description: "Example integration and preservation settings; no connection is verified.",
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
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
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
              <div key={idx} className="flex flex-col gap-2 p-4 sm:p-5 md:flex-row md:items-start md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="break-words text-sm font-medium text-slate-600">{item.value}</p>
                  <SourceStatus source="Built-in DFIR scenario" freshness="No evidence artifact or verified event time" confidence="Unverified" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
