import React from 'react';
import { Terminal, Code, Network, Target, Box, Database, Lock, Wrench } from 'lucide-react';

export default function RedTeamToolsView() {
  const categories = [
    {
      title: "Reconnaissance & Discovery",
      icon: Target,
      tools: [
        { name: "Nmap Scripting Engine (NSE)", description: "Advanced network discovery and port scanning with custom scripts." },
        { name: "Amass", description: "In-depth DNS enumeration and attack surface mapping." },
        { name: "BloodHound", description: "Identify highly complex Active Directory attack paths." }
      ]
    },
    {
      title: "Exploitation & Initial Access",
      icon: Terminal,
      tools: [
        { name: "Metasploit Framework", description: "Develop and execute exploit code against a remote target machine." },
        { name: "SQLmap", description: "Automatic SQL injection and database takeover tool." },
        { name: "Responder", description: "LLMNR, NBT-NS and MDNS poisoner, with built-in HTTP/SMB/MSSQL/FTP/LDAP rogue authentication server." }
      ]
    },
    {
      title: "Lateral Movement & Privilege Escalation",
      icon: Network,
      tools: [
        { name: "Mimikatz", description: "Extract plaintexts passwords, hash, PIN code and kerberos tickets from memory." },
        { name: "Impacket", description: "Collection of Python classes for working with network protocols (e.g., psexec, wmiexec)." },
        { name: "PowerSploit", description: "Collection of Microsoft PowerShell modules that can be used to aid penetration testers." }
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50 h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-heading text-slate-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-red-600" />
            Red Team Arsenal
          </h2>
          <p className="text-slate-500 mt-2">
            A curated collection of offensive security tools utilized by the automated agent during attack simulations.
          </p>
        </div>

        <div className="space-y-6">
          {categories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                <category.icon className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-slate-700">{category.title}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {category.tools.map((tool, toolIdx) => (
                  <div key={toolIdx} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                      <Code className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{tool.name}</h4>
                      <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
