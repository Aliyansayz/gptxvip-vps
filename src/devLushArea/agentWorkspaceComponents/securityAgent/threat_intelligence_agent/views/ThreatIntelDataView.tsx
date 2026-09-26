import React from 'react';
import { Globe, Search, Lock, AlertTriangle, Settings } from 'lucide-react';
import { ThreatIntelSidebarView } from '../components/ThreatIntelAgentSidebar';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

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
        { label: "APT33 Activity", value: "Increased scanning activity targeting energy sector endpoints. (Confidence: High)" },
        { label: "Zero-Day Exploitation", value: "Active exploitation of CVE-2026-X in the wild by ransomware groups." },
        { label: "Botnet Takedown", value: "Operation disrupting 'Emotet' infrastructure confirmed by authorities." }
      ]
    },
    osint: {
      title: "OSINT Collection",
      icon: Search,
      description: "Intelligence gathered from public and open-source channels.",
      items: [
        { label: "Pastebin Dumps", value: "No matching corporate domains found in the last 24h." },
        { label: "Social Media Mentions", value: "3 potential phishing campaigns using typosquatted domains on Twitter." },
        { label: "GitHub Secrets", value: "Scanning public repositories for leaked API keys... (Clean)" }
      ]
    },
    darkweb: {
      title: "Dark Web Monitoring",
      icon: Lock,
      description: "Tracking illicit marketplaces, forums, and ransomware leak sites.",
      items: [
        { label: "Initial Access Brokers", value: "Found listing for VPN access to a similar-sized company in our vertical." },
        { label: "Leaked Credentials", value: "14 employee emails found in recent third-party breach 'CorpDB 2025'." },
        { label: "Ransomware Affiliates", value: "New affiliate program launched by 'LockBit' successor." }
      ]
    },
    cve_monitor: {
      title: "CVE & Vulnerability Monitor",
      icon: AlertTriangle,
      description: "Real-time tracking of new Common Vulnerabilities and Exposures.",
      items: [
        { label: "CVE-2026-1123 (Critical)", value: "RCE in popular Java framework. Exploit POC published. Patch available." },
        { label: "CVE-2026-4492 (High)", value: "Privilege escalation in Windows Kernel. Actively exploited." },
        { label: "Action", value: "Cross-referencing CVEs with internal asset inventory... (2 vulnerable hosts found)" }
      ]
    },
    settings: {
      title: "Intelligence Feeds & Integrations",
      icon: Settings,
      description: "Manage API keys for threat intel platforms and internal routing.",
      items: [
        { label: "MISP Integration", value: "Example configuration label; connection and sync state are not verified." },
        { label: "VirusTotal API", value: "Example quota label; API key and remaining quota are not verified." },
        { label: "Alert Routing", value: "High severity IoCs automatically pushed to Sentinel SIEM." }
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
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
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
