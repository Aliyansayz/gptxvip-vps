import React from 'react';
import { Network, Key, ArrowRight, Database } from 'lucide-react';

export default function RedTeamLateralMovementView() {
  const lateralMovementTechniques = [
    {
      title: "Pass the Hash (PtH)",
      description: "Using captured password hashes to authenticate to remote systems without needing the plaintext password.",
      tools: ["Mimikatz", "Impacket (psexec.py)", "CrackMapExec"],
      mitigation: "Disable NTLM, enable Credential Guard, restrict local administrator access."
    },
    {
      title: "Kerberoasting",
      description: "Extracting service account credential hashes from Active Directory for offline cracking.",
      tools: ["Rubeus", "GetUserSPNs.py", "BloodHound"],
      mitigation: "Use strong service account passwords, implement Managed Service Accounts (gMSA)."
    },
    {
      title: "WMI & WinRM Exec",
      description: "Leveraging built-in Windows management protocols for remote code execution.",
      tools: ["wmiexec.py", "Evil-WinRM", "PowerShell Remoting"],
      mitigation: "Restrict WinRM/WMI access via firewall, monitor for suspicious WMI activity."
    },
    {
      title: "SSH Key Hijacking",
      description: "Compromising private SSH keys on a pivot host to jump to other Linux servers.",
      tools: ["ssh-agent extraction", "LinPEAS"],
      mitigation: "Use hardware tokens, enforce SSH agent forwarding restrictions, rotate keys."
    }
  ];

  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Network className="w-6 h-6 text-red-600" />
            Lateral Movement Cheat Sheet
          </h2>
          <p className="text-slate-500 mt-2">Static technique and mitigation notes. Nothing here connects to a network or runs a command.</p>
        </div>

        <div className="grid gap-4">
          {lateralMovementTechniques.map((tech, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowRight className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-slate-800">{tech.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{tech.description}</p>
              </div>
              
              <div className="md:w-1/3 border-l-0 md:border-l border-slate-100 md:pl-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Tools</h4>
                <div className="flex flex-col gap-2">
                  {tech.tools.map((tool, i) => (
                    <span key={i} className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:w-1/3 border-l-0 md:border-l border-slate-100 md:pl-6">
                <h4 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2">Defensive Mitigations</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{tech.mitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
