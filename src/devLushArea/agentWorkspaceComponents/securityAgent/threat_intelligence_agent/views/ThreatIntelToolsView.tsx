import React from 'react';
import { Wrench, Search, Radio, Database, Shield, Zap, Globe, FileCode } from 'lucide-react';
import AgentPreviewNotice from '../../../components/AgentPreviewNotice';

interface ToolInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  whatItIs: string;
  whatItDoes: string;
  category: string;
  capabilities: string[];
}

const threatIntelTools: ToolInfo[] = [
  {
    id: 'osint-engine',
    name: 'OSINT Aggregator',
    icon: Search,
    category: 'Collection',
    whatItIs: 'An Open-Source Intelligence (OSINT) collection and processing engine.',
    whatItDoes: 'Scrapes public forums, social media, pastebins, and security blogs to identify emerging threats, leaked credentials, and discussions about new attack vectors.',
    capabilities: ['Keyword tracking', 'Sentiment analysis', 'Pastebin scraping']
  },
  {
    id: 'darkweb-monitor',
    name: 'Dark Web Sentinel',
    icon: Radio,
    category: 'Monitoring',
    whatItIs: 'A specialized scraper designed to monitor Tor hidden services and underground marketplaces.',
    whatItDoes: 'Detects discussions regarding zero-day exploits, sale of stolen credentials, and chatter from known ransomware cartels and APT groups.',
    capabilities: ['Tor network indexing', 'Threat actor tracking', 'Initial access broker monitoring']
  },
  {
    id: 'cve-tracker',
    name: 'CVE & Advisory Tracker',
    icon: Database,
    category: 'Vulnerability',
    whatItIs: 'A real-time synchronization engine with global vulnerability databases (NVD, vendor advisories).',
    whatItDoes: 'Monitors for newly published CVEs and correlates them against the organization\'s internal asset inventory to prioritize patching efforts.',
    capabilities: ['NVD synchronization', 'Asset correlation', 'Exploit availability tracking']
  },
  {
    id: 'mitre-mapper',
    name: 'ATT&CK Contextualizer',
    icon: Globe,
    category: 'Analysis',
    whatItIs: 'A framework alignment tool that maps raw intelligence to the MITRE ATT&CK framework.',
    whatItDoes: 'Translates unstructured threat data into structured Tactics, Techniques, and Procedures (TTPs) to help SOC teams understand attacker behavior and build precise defenses.',
    capabilities: ['TTP extraction', 'Adversary emulation planning', 'Defensive gap analysis']
  },
  {
    id: 'siem-connector',
    name: 'SIEM Integration Pipeline',
    icon: FileCode,
    category: 'Integration',
    whatItIs: 'An automated feed that pushes actionable intelligence directly into the organization\'s security tools.',
    whatItDoes: 'Transforms gathered IoCs (IPs, domains, hashes) into formats digestible by SIEMs (like Splunk or Elastic) and firewalls for automated blocking and alerting.',
    capabilities: ['STIX/TAXII output', 'Automated IoC blocking', 'Rule generation']
  }
];

export default function ThreatIntelToolsView() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">Intelligence Tools</h1>
          <p className="text-slate-500 mt-1">
            Understanding the automated collection and analysis tools deployed by the Threat Intelligence Agent.
          </p>
        </div>
      </div>

      <AgentPreviewNotice>Capability descriptions are informational examples; feed sources and integrations are not connected or verified in this preview.</AgentPreviewNotice>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {threatIntelTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 mb-1">{tool.category}</div>
                <h3 className="text-xl font-bold text-slate-800">{tool.name}</h3>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-400" />
                  What it is
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {tool.whatItIs}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  What it does
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {tool.whatItDoes}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Key Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {tool.capabilities.map((cap, i) => (
                    <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md border border-purple-100">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
