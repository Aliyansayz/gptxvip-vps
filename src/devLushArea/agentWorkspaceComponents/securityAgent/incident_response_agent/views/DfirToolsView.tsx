import React from 'react';
import { Wrench, HardDrive, Network, Lock, FileCode, Search, Shield, Zap } from 'lucide-react';

interface ToolInfo {
  id: string;
  name: string;
  icon: React.ElementType;
  whatItIs: string;
  whatItDoes: string;
  category: string;
  capabilities: string[];
}

const dfirTools: ToolInfo[] = [
  {
    id: 'mem-dump',
    name: 'Memory Dump Analyzer',
    icon: HardDrive,
    category: 'Forensics',
    whatItIs: 'A volatile memory (RAM) analysis engine capable of processing raw memory images from endpoints.',
    whatItDoes: 'Extracts running processes, active network connections, injected code, and hidden rootkits that operate solely in memory and leave no footprint on the hard drive.',
    capabilities: ['Volatility extraction', 'Process hollowing detection', 'In-memory malware signature scanning']
  },
  {
    id: 'pcap-analyzer',
    name: 'PCAP & Flow Engine',
    icon: Network,
    category: 'Network',
    whatItIs: 'A deep packet inspection (DPI) and network flow analysis tool.',
    whatItDoes: 'Reconstructs network sessions from Packet Captures (PCAPs) to identify Command & Control (C2) beacons, exfiltrated data payloads, and lateral movement across the internal network.',
    capabilities: ['Protocol decoding', 'Payload reconstruction', 'Beaconing pattern detection']
  },
  {
    id: 'ioc-scanner',
    name: 'IoC Sweeper',
    icon: Search,
    category: 'Detection',
    whatItIs: 'A rapid, distributed indicator of compromise (IoC) hunting agent.',
    whatItDoes: 'Scans thousands of endpoints simultaneously for known malicious file hashes, suspicious registry keys, bad IPs, or specific attacker tools (like Mimikatz).',
    capabilities: ['YARA rule matching', 'File hash verification', 'Registry and event log scraping']
  },
  {
    id: 'containment-module',
    name: 'Zero-Trust Containment Module',
    icon: Lock,
    category: 'Response',
    whatItIs: 'An automated policy enforcement engine integrated with EDR and network firewalls.',
    whatItDoes: 'Instantly quarantines compromised hosts by altering their network routes to a blackhole, except for a secure forensic pipeline. Disables compromised user credentials in Active Directory.',
    capabilities: ['Network isolation', 'Account suspension', 'Service termination']
  },
  {
    id: 'log-ingestor',
    name: 'SIEM Log Ingestor',
    icon: FileCode,
    category: 'Telemetry',
    whatItIs: 'A high-throughput log parser that connects directly to the Security Information and Event Management (SIEM) system.',
    whatItDoes: 'Normalizes logs from various sources (endpoints, firewalls, auth servers) into a unified timeline of events to trace the attacker\'s steps.',
    capabilities: ['Log normalization', 'Timeline reconstruction', 'Anomaly scoring']
  }
];

export default function DfirToolsView() {
  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto custom-scrollbar">
      <div className="mb-10 flex items-center gap-4">
        <div className="p-4 bg-sky-100 text-sky-600 rounded-xl">
          <Wrench className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800">DFIR Toolkit</h1>
          <p className="text-slate-500 mt-1">
            Understanding the automated tools deployed by the Incident Response Agent.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dfirTools.map((tool) => (
          <div key={tool.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
                <tool.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">{tool.category}</div>
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
                    <span key={i} className="px-2.5 py-1 bg-sky-50 text-sky-700 text-xs font-medium rounded-md border border-sky-100">
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
