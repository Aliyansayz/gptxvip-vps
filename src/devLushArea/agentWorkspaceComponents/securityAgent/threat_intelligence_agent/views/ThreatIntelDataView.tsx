import React from 'react';
import { Globe, Search, Lock, AlertTriangle, Settings } from 'lucide-react';
import { ThreatIntelSidebarView } from '../components/ThreatIntelAgentSidebar';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';
import SourceStatus from '../../../components/SourceStatus';

interface ThreatIntelDataViewProps {
  viewType: ThreatIntelSidebarView;
}

export default function ThreatIntelDataView({ viewType }: ThreatIntelDataViewProps) {
  const content = {
    global_feed: {
      title: "Global Threat Feed",
      icon: Globe,
      description: "Example threat-feed layout; source links and observation times are not provided.",
      items: [
        { label: "APT33 Activity", value: "Example claim of increased scanning activity. The original source and confidence basis are unavailable." },
        { label: "Zero-Day Exploitation", value: "Illustrative exploitation claim; the CVE identifier and external reporting are not verified." },
        { label: "Botnet Takedown", value: "Example disruption claim without a source record or confirmation date." }
      ]
    },
    osint: {
      title: "OSINT Collection",
      icon: Search,
      description: "Example open-source collection records; no live collection is connected.",
      items: [
        { label: "Pastebin Dumps", value: "No recent check is available; this preview cannot assert a clean result." },
        { label: "Social Media Mentions", value: "3 potential phishing campaigns using typosquatted domains on Twitter." },
        { label: "GitHub Secrets", value: "Example search category. No repository scan or clean result is available." }
      ]
    },
    darkweb: {
      title: "Dark Web Monitoring",
      icon: Lock,
      description: "Illustrative monitoring claims without connected sources.",
      items: [
        { label: "Initial Access Brokers", value: "Found listing for VPN access to a similar-sized company in our vertical." },
        { label: "Leaked Credentials", value: "14 employee emails found in recent third-party breach 'CorpDB 2025'." },
        { label: "Ransomware Affiliates", value: "New affiliate program launched by 'LockBit' successor." }
      ]
    },
    cve_monitor: {
      title: "CVE & Vulnerability Monitor",
      icon: AlertTriangle,
      description: "Example vulnerability-monitor records; no current CVE feed is connected.",
      items: [
        { label: "CVE-2026-1123 (Critical)", value: "RCE in popular Java framework. Exploit POC published. Patch available." },
        { label: "CVE-2026-4492 (High)", value: "Privilege escalation in Windows Kernel. Actively exploited." },
        { label: "Suggested action", value: "Check a verified CVE record and internal asset inventory before prioritizing remediation." }
      ]
    },
    settings: {
      title: "Intelligence Feeds & Integrations",
      icon: Settings,
      description: "Manage API keys for threat intel platforms and internal routing.",
      items: [
        { label: "MISP Integration", value: "Example configuration label; connection and sync state are not verified." },
        { label: "VirusTotal API", value: "Example quota label; API key and remaining quota are not verified." },
        { label: "Alert Routing", value: "Example Sentinel routing rule; delivery is not connected or verified." }
      ]
    },
    dashboard: { title: "", icon: Settings, description: "", items: [] },
    tools: { title: "", icon: Settings, description: "", items: [] },
    theory: { title: "", icon: Settings, description: "", items: [] }
  };

  const data = content[viewType];
  const Icon = data?.icon;

  if (!Icon) return null;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Icon className="w-6 h-6 text-red-600" />
            {data.title}
          </h2>
          <p className="text-slate-500 mt-2">{data.description}</p>
        </div>

        <AgentPreviewNotice>Indicators and statuses are examples, not verified intelligence. Source timestamps and confidence are not supplied; validate them before acting.</AgentPreviewNotice>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {data.items.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-4 sm:p-5 md:flex-row md:items-start md:gap-6">
                <div className="md:w-1/3">
                  <h4 className="text-sm font-bold text-slate-700">{item.label}</h4>
                </div>
                <div className="md:w-2/3">
                  <p className="break-all text-sm font-medium text-slate-600">{item.value}</p>
                  <SourceStatus source="Built-in intelligence example" freshness="No original report date" confidence="Unverified" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
