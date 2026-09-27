import React from 'react';
import { Search, Globe, Network, Shield } from 'lucide-react';

export default function RedTeamReconView() {
  const reconData = [
    {
      phase: "Passive Reconnaissance",
      icon: Globe,
      techniques: [
        "OSINT (Open Source Intelligence)",
        "WHOIS & DNS Enumeration",
        "Search Engine Dorking",
        "Social Media Profiling"
      ],
      tools: ["Maltego", "Shodan", "theHarvester", "Recon-ng"]
    },
    {
      phase: "Active Reconnaissance",
      icon: Search,
      techniques: [
        "Port Scanning",
        "Vulnerability Scanning",
        "Banner Grabbing",
        "Network Mapping"
      ],
      tools: ["Nmap", "Masscan", "Nessus", "Nikto"]
    },
    {
      phase: "Target Identification",
      icon: Network,
      techniques: [
        "Subdomain Brute-forcing",
        "Directory Enumeration",
        "Cloud Storage Discovery",
        "API Endpoint Mapping"
      ],
      tools: ["Amass", "Gobuster", "FFuF", "TruffleHog"]
    }
  ];

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Search className="w-6 h-6 text-red-600" />
            Reconnaissance Cheat Sheet
          </h2>
          <p className="text-slate-500 mt-2">Static methodology notes for an authorized lab. These examples do not discover or contact targets.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reconData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-red-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3">{item.phase}</h3>
              
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Techniques</h4>
                <ul className="space-y-1">
                  {item.techniques.map((tech, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-red-400" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Automated Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tools.map((tool, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
