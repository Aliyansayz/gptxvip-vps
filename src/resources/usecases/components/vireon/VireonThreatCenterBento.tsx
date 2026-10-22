import React, { useState, useEffect, useRef } from 'react';
import '../../bentoShowcases.css';

interface VireonThreatCenterBentoProps {
  onBookDemo?: () => void;
}

export const VireonThreatCenterBento: React.FC<VireonThreatCenterBentoProps> = ({
  onBookDemo,
}) => {
  // State for Block 1
  const [currentSidebarIndex, setCurrentSidebarIndex] = useState(0);
  const [animaticAutoplay, setAnimaticAutoplay] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'dashboard' | 'dualrail'>('dashboard');
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false);
  const [isHandClicking, setIsHandClicking] = useState(false);

  // State for Block 2 (Personas)
  const [activePersonaIndex, setActivePersonaIndex] = useState(0);
  const [isPersonaSwitching, setIsPersonaSwitching] = useState(false);

  // State for Block 3 (Threat Activity)
  const [isHostContained, setIsHostContained] = useState(false);
  const [activeAmenityIndex, setActiveAmenityIndex] = useState(0);

  // State for Block 4 (Orbit Map)
  const [selectedOrbitStage, setSelectedOrbitStage] = useState<number | null>(null);

  // State for Block 5 (Network Traffic Chart)
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | 'All'>('1D');
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number; totalM: string; awsM: string; azureM: string } | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Block 1 Dashboard Views
  const dashboardViews = [
    {
      id: 'threat-center',
      badge: 'Threat Center',
      title: 'Active Threats & Exposure Score',
      hint: '24×7 Monitoring • 126 Active Incidents • 78% Protection Score',
      content: (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 stagger-1">
            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Active Threats</span>
                <span className="text-[9.5px] font-bold text-[#0F766E] bg-[#CCFBF1] px-1.5 py-0.5 rounded">↑ 12.4%</span>
              </div>
              <div className="flex items-end justify-between mt-1">
                <span className="font-display font-extrabold text-[18px] text-slate-900 leading-none">126</span>
                <div className="flex items-end gap-[2px] h-5">
                  <span className="w-1 bg-[#38BDF8] h-2 rounded-xs"></span>
                  <span className="w-1 bg-[#2DD4BF] h-3.5 rounded-xs"></span>
                  <span className="w-1 bg-[#0EA5E9] h-5 rounded-xs"></span>
                  <span className="w-1 bg-[#2DD4BF] h-3 rounded-xs"></span>
                  <span className="w-1 bg-[#5EEAD4] h-4 rounded-xs"></span>
                </div>
              </div>
              <span className="text-[9.5px] text-slate-400 block mt-1">Active incidents detected</span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-500">Threat Exposure</span>
                <span className="text-[9.5px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">↓ 2.1%</span>
              </div>
              <div className="flex items-end justify-between mt-1">
                <span className="font-display font-extrabold text-[18px] text-slate-900 leading-none">78%</span>
                <span className="text-[10px] font-mono font-bold text-[#0EA5E9]">ZTNA ON</span>
              </div>
              <span className="text-[9.5px] text-slate-400 block mt-1">Network protection score</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs space-y-2 stagger-2">
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 pb-1 border-b border-slate-100">
              <span>Security Threats</span>
              <span>Asset / Status</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center text-xs font-bold">🔒</span>
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block leading-tight">Brute Force Attempt</span>
                  <span className="text-[9.5px] font-mono text-slate-400">SPH-101 • AWS Gateway #3</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-600">Blocked</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold">⚡</span>
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block leading-tight">API Abuse</span>
                  <span className="text-[9.5px] font-mono text-slate-400">VSG-309 • EU-West-1 API</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#CCFBF1] text-[#0F766E]">Investigating</span>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-slate-100 flex items-center justify-between stagger-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xs font-bold">👤</span>
              <div>
                <span className="text-[11px] font-semibold text-slate-800 block leading-tight">Suspicious Login (ITDR)</span>
                <span className="text-[9.5px] font-mono text-slate-400">VEM-204 • IAM User Session</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">MFA Challenge</span>
          </div>
        </div>
      ),
    },
    {
      id: 'mxdr-siem',
      badge: 'MXDR & SIEM',
      title: 'Threat Tactics Heatmap & Correlation',
      hint: 'SIEM + EDR + ITDR + Cloud Telemetry • 126 Events Correlated',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-800">Threat Tactics (MITRE ATT&CK)</span>
              <span className="text-[9.5px] font-mono text-slate-400">126 Active Events</span>
            </div>
            <div className="space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 w-28 truncate">Initial Access</span>
                <div className="flex gap-1">
                  <span className="w-4 h-3.5 rounded-xs bg-[#2DD4BF]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#5EEAD4]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#99F6E4]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 w-28 truncate">Execution (EDR)</span>
                <div className="flex gap-1">
                  <span className="w-4 h-3.5 rounded-xs bg-[#99F6E4]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#2DD4BF]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#38BDF8]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 w-28 truncate">Defense Evasion</span>
                <div className="flex gap-1">
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#5EEAD4]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#0EA5E9]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#2DD4BF]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#99F6E4]"></span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 w-28 truncate">Lateral Movement</span>
                <div className="flex gap-1">
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#2DD4BF]"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-slate-100"></span>
                  <span className="w-4 h-3.5 rounded-xs bg-[#5EEAD4]"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs stagger-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block mb-1.5">Compromised Account Signal Flow</span>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-700 bg-slate-50 p-1.5 rounded-lg">
              <span className="text-[#0D9488]">SIEM</span>→<span>ITDR</span>→<span>EDR</span>→<span className="text-[#0284C7]">MXDR</span>→<span>SOC</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-100 stagger-3">
            <span className="text-[10.5px] font-semibold text-slate-600">M365 Activity & DLP Guard</span>
            <span className="text-[10px] font-bold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded-md">Searchable Logs ON</span>
          </div>
        </div>
      ),
    },
    {
      id: 'incidents-dfir',
      badge: 'Incidents & DFIR',
      title: 'Incident Response Playbook & Triage',
      hint: 'Detection → Triage → Investigation → Containment → Recovery',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800">Playbook: Account Compromise</span>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">P1 Triage</span>
            </div>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[9.5px]">
              <div className="bg-[#CCFBF1] text-[#0F766E] p-1.5 rounded-lg font-bold">1. Detect</div>
              <div className="bg-[#CCFBF1] text-[#0F766E] p-1.5 rounded-lg font-bold">2. Triage</div>
              <div className="bg-[#0F172A] text-[#5EEAD4] p-1.5 rounded-lg font-bold">3. Contain</div>
              <div className="bg-slate-100 text-slate-500 p-1.5 rounded-lg font-medium">4. DFIR</div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="font-bold text-[11.5px] text-slate-800 block">Compromised Session Revocation</span>
              <span className="text-[10px] text-slate-400">Privileged Access IAM-204 • Zero Trust Policy</span>
            </div>
            <button
              onClick={() => showToast('Compromised session revoked & DFIR evidence locked!')}
              className="px-2.5 py-1 rounded-lg bg-[#0F172A] text-[#5EEAD4] text-[10px] font-semibold hover:bg-slate-800 transition"
            >
              Isolate
            </button>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-3">
            <div>
              <span className="font-bold text-[11.5px] text-slate-800 block">DFIR Digital Evidence Chain</span>
              <span className="text-[10px] text-slate-400">Post-Incident Review & Lessons Learned</span>
            </div>
            <span className="text-[10.5px] font-mono font-bold text-emerald-600">Preserved</span>
          </div>
        </div>
      ),
    },
    {
      id: 'compliance-grc',
      badge: 'Compliance GRC',
      title: 'Regulatory Frameworks & Audit Evidence',
      hint: 'NIST CSF 2.0 • SOC 2 Type II • CMMC 2.0 • HIPAA • PCI DSS',
      content: (
        <div className="space-y-2.5">
          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs stagger-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-800">Control Mapping & Audit Readiness</span>
              <span className="text-[10px] font-bold text-[#0F766E]">94% Mapped</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                <span className="font-semibold text-slate-700">NIST CSF 2.0</span>
                <span className="text-emerald-600 font-bold">96%</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                <span className="font-semibold text-slate-700">SOC 2 Type II</span>
                <span className="text-emerald-600 font-bold">Ready</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                <span className="font-semibold text-slate-700">CMMC 2.0 / CIS</span>
                <span className="text-[#0D9488] font-bold">Level 2</span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between">
                <span className="font-semibold text-slate-700">HIPAA / GDPR</span>
                <span className="text-emerald-600 font-bold">Aligned</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="font-bold text-[11.5px] text-slate-800 block">Compliance Gap Assessment</span>
              <span className="text-[10px] text-slate-400">3 Remediation Tracking items in backlog</span>
            </div>
            <button
              onClick={() => showToast('Audit Evidence Packet exported (SSAE 18 / SOC 2)')}
              className="px-2.5 py-1 rounded-lg bg-[#CCFBF1] text-[#0F766E] text-[10px] font-bold hover:bg-[#99F6E4] transition"
            >
              Evidence
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'bdr-resilience',
      badge: 'BDR Resilience',
      title: 'Immutable Backup & Disaster Recovery',
      hint: 'RTO Target: 4 Hours • RPO Target: 15 Minutes • AES-256',
      content: (
        <div className="space-y-2.5">
          <div className="bg-gradient-to-br from-[#0B131E] to-[#1E293B] text-white p-3.5 rounded-xl shadow-sm stagger-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Immutable Backup Vault (BaaS / DRaaS)</span>
              <span className="text-[#5EEAD4] font-mono font-semibold">AES-256</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-[9.5px] text-slate-400 block">Target RTO (Restore)</span>
                <span className="font-display font-extrabold text-[15px] text-[#5EEAD4]">4 Hours</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                <span className="text-[9.5px] text-slate-400 block">Target RPO (Max Loss)</span>
                <span className="font-display font-extrabold text-[15px] text-[#38BDF8]">15 Mins</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="text-[11.5px] font-semibold text-slate-800 block">Off-Site Recovery Validation</span>
              <span className="text-[10px] text-slate-400">Backup Integrity Check passed 14m ago</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">Verified</span>
          </div>
        </div>
      ),
    },
    {
      id: 'vciso-human-risk',
      badge: 'vCISO & Human',
      title: 'Human Risk & Security Maturity (SMLA)',
      hint: 'Phishing Click Rate: 2.8% • Training Completion: 97%',
      content: (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 stagger-1">
            <div className="bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9.5px] text-slate-400 block">Phishing Click Rate</span>
              <span className="font-display font-bold text-[15px] text-emerald-600">2.8%</span>
              <span className="text-[9px] text-slate-400 block">↓ from 14.2% baseline</span>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-[9.5px] text-slate-400 block">Role-Based Training</span>
              <span className="font-display font-bold text-[15px] text-[#0F172A]">97.4%</span>
              <span className="text-[9px] text-[#0D9488] font-semibold block">Compliance-Mandated</span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between stagger-2">
            <div>
              <span className="font-bold text-[11.5px] text-slate-800 block">PTaaS & Automated Web App Testing</span>
              <span className="text-[10px] text-slate-400">AWAT + IT Due Diligence (Pre/Post-LOI)</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#0F766E] bg-[#CCFBF1] px-2 py-0.5 rounded">0 Crit CVE</span>
          </div>

          <div className="bg-[#F0FDFA] px-3 py-2 rounded-xl border border-[#99F6E4] text-[10.5px] text-[#0F766E] font-medium stagger-3">
            🛡️ <strong>vCISO Roadmap:</strong> Insurance Questionnaire & SMLA Q4 Ready
          </div>
        </div>
      ),
    },
  ];

  // Animatic Auto-switching Loop
  useEffect(() => {
    if (!animaticAutoplay) return;
    const interval = window.setInterval(() => {
      setCurrentSidebarIndex((prev) => (prev + 1) % dashboardViews.length);
      setIsHandClicking(true);
      setTimeout(() => setIsHandClicking(false), 300);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [animaticAutoplay, dashboardViews.length]);

  const handleSelectSidebarView = (idx: number, isManual = true) => {
    setCurrentSidebarIndex(idx);
    setIsHandClicking(true);
    setTimeout(() => setIsHandClicking(false), 300);
    if (isManual && animaticAutoplay) {
      showToast(`Navigated to ${dashboardViews[idx].badge}`);
    }
  };

  // 2. Block 2 Personas Data
  const personasData = [
    {
      name: 'Noah Turner',
      role: 'vCISO Advisor',
      email: '@noah_turner',
      flag: 'Co-Managed MSSP',
      occupation: 'Virtual CISO & Risk Oversight',
      frameworks: 'NIST CSF 2.0 • SOC 2 • CMMC',
      deliverable: 'SMLA & Security Roadmap',
      status: '✓ Zero Trust + MFA Enforced',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Maya Lin',
      role: 'SOC Tier-3 / DFIR',
      email: '@maya_soc_ir',
      flag: '24×7 Fully Managed',
      occupation: 'Incident Response & Threat Hunting',
      frameworks: 'SIEM • EDR • ITDR • MXDR',
      deliverable: 'Containment & Digital Forensics',
      status: '✓ Compromised Session Guard',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Liam Vance',
      role: 'Alignment Eng.',
      email: '@liam_tae',
      flag: 'BDR & Cloud Sec',
      occupation: 'Technology Alignment Engineer',
      frameworks: 'CIS Controls • HIPAA • PCI DSS',
      deliverable: 'Immutable BDR (RTO 4h / RPO 15m)',
      status: '✓ AES-256 Air-Gapped Vault',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const handleSwitchPersona = (idx: number) => {
    setIsPersonaSwitching(true);
    setTimeout(() => {
      setActivePersonaIndex(idx);
      setIsPersonaSwitching(false);
    }, 140);
  };

  // 3. Block 3 Telemetry Domains
  const telemetryDomains = [
    {
      title: 'Brute Force Attempt',
      code: 'SPH-101',
      asset: 'Target Asset: AWS Gateway #3 (SIEM Log)',
      globe: 'SIEM Correlation • EU-West-1',
      msg: 'SIEM: Collects & correlates authentication and security event logs',
    },
    {
      title: 'Suspicious Login',
      code: 'VEM-204',
      asset: 'Target Asset: IAM User Session (ITDR)',
      globe: 'ITDR Identity Alert • M365 SSO',
      msg: 'ITDR: Detects compromised sessions, credential abuse & privilege escalation',
    },
    {
      title: 'Endpoint Malware',
      code: 'EDR-408',
      asset: 'Target Asset: FinOps Workstation #12',
      globe: 'EDR Containment • US-East-2',
      msg: 'EDR: Investigates & contains malicious processes on endpoint devices',
    },
    {
      title: 'API Abuse Attempt',
      code: 'VSG-309',
      asset: 'Target Asset: EU-West-1 API Gateway',
      globe: 'ZTNA Policy Check • EU-West-1',
      msg: 'ZTNA: Enforces Zero Trust identity & policy-based access control',
    },
    {
      title: 'Forensic Snapshot',
      code: 'DFIR-901',
      asset: 'Target Asset: Immutable Evidence Vault',
      globe: 'DFIR Chain of Custody • AES-256',
      msg: 'DFIR: Preserves digital forensics evidence & supports post-incident review',
    },
  ];

  const handleAmenitySelect = (idx: number) => {
    setActiveAmenityIndex(idx);
    showToast(telemetryDomains[idx].msg);
  };

  const handleToggleContainment = () => {
    setIsHostContained((prev) => {
      const next = !prev;
      if (next) {
        showToast('Threat Containment active: AWS Gateway #3 isolated via EDR playbook');
      } else {
        showToast('Standard firewall block policy restored');
      }
      return next;
    });
  };

  const handleCopyIoc = () => {
    navigator.clipboard?.writeText(
      'IOC-SPH-101 | EU-West-1 | AWS-GW-03 | SHA256: 9f86d081884c7d659a2feaa0c55ad015'
    );
    showToast('Threat IOC telemetry signature copied for SIEM hunting!');
  };

  // 4. Block 4 Orbit Stages
  const journeyStages = [
    {
      stage: '1. SIEM + ITDR',
      sub: 'Detection & Identity',
      text: '1. SIEM & ITDR: Collects authentication logs and detects suspicious identity/session activity',
    },
    {
      stage: '2. EDR + MXDR',
      sub: 'Cross-Domain Triage',
      text: '2. EDR & MXDR: Correlates endpoint malware telemetry with email, cloud, and network signals',
    },
    {
      stage: '3. Containment',
      sub: 'ZTNA & Session Lock',
      text: '3. Threat Containment: Limits attack spread by isolating hosts and revoking compromised sessions',
    },
    {
      stage: '4. DFIR Playbook',
      sub: 'Forensics & Evidence',
      text: '4. DFIR Investigation: Executes incident response playbook and preserves forensic evidence',
    },
    {
      stage: '5. BDR & Review',
      sub: 'RTO 4h • RPO 15m',
      text: '5. Recovery & Lessons Learned: Restores immutable backups (RTO 4h / RPO 15m) & updates policies',
    },
  ];

  // 5. Block 5 Datasets
  const chartDatasets: Record<string, { price: string; delta: string; aws: string; azure: string; sub: string; line: string; secLine: string; dotY: number }> = {
    '1D': {
      price: '40.3M',
      delta: '↑ 6.21%',
      aws: '23.2M',
      azure: '9.1M',
      sub: 'AWS + Azure SIEM',
      line: 'M0,68 C35,72 65,48 100,52 C135,56 165,38 200,55 C225,66 235,62 245,62 C275,45 310,36 345,42 C375,47 398,58 420,54',
      secLine: 'M0,118 C40,112 75,120 110,114 C145,108 180,116 215,109 C245,104 275,115 310,108 C350,102 385,112 420,106',
      dotY: 62,
    },
    '1W': {
      price: '128.4M',
      delta: '↑ 9.40%',
      aws: '78.1M',
      azure: '50.3M',
      sub: 'Searchable SIEM Logs',
      line: 'M0,88 C45,74 80,62 120,48 C160,55 200,32 245,44 C290,30 340,26 420,22',
      secLine: 'M0,126 C50,118 100,108 160,112 C210,98 260,102 330,92 C375,88 400,90 420,84',
      dotY: 44,
    },
    '1M': {
      price: '18.9M',
      delta: '↓ 1.85%',
      aws: '11.4M',
      azure: '7.5M',
      sub: 'ZTNA Policy Sessions',
      line: 'M0,95 C40,85 85,72 135,78 C185,60 220,52 245,50 C295,48 350,38 420,32',
      secLine: 'M0,130 C50,125 110,118 170,115 C220,112 280,105 340,100 C380,96 405,94 420,90',
      dotY: 50,
    },
    '3M': {
      price: '6.42M',
      delta: '↑ 4.12%',
      aws: '4.1M',
      azure: '2.32M',
      sub: 'DLP Policy Inspections',
      line: 'M0,105 C50,92 100,84 150,65 C200,72 225,58 245,56 C300,42 355,35 420,28',
      secLine: 'M0,134 C60,128 120,122 180,118 C240,110 300,108 360,102 C390,98 408,96 420,95',
      dotY: 56,
    },
    'All': {
      price: '412.0M',
      delta: '↑ 18.7%',
      aws: '264.0M',
      azure: '148.0M',
      sub: 'Full MXDR Telemetry',
      line: 'M0,115 C60,98 120,78 180,62 C215,52 235,42 245,38 C310,28 365,22 420,18',
      secLine: 'M0,138 C70,128 140,118 210,105 C270,96 330,90 380,82 C400,80 412,78 420,76',
      dotY: 38,
    },
  };

  const currentDataset = chartDatasets[activeTimeframe];

  const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(20, Math.min(rect.width - 15, e.clientX - rect.left));
    const svgX = Math.round((relX / rect.width) * 420);
    const waveY = Math.round(56 + Math.sin(svgX * 0.032) * 16);
    const totalM = (44.5 - waveY * 0.12).toFixed(1);
    const awsM = (Number(totalM) * 0.62).toFixed(1);
    const azureM = (Number(totalM) * 0.31).toFixed(1);

    setHoverPosition({
      x: svgX,
      y: waveY,
      totalM,
      awsM,
      azureM,
    });
  };

  const handleChartMouseLeave = () => {
    setHoverPosition(null);
  };

  const currentPersona = personasData[activePersonaIndex];
  const currentAmenity = telemetryDomains[activeAmenityIndex];

  return (
    <div className="w-full text-slate-900 select-none">
      {/* Top Interactive Control Bar */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5EEAD4] via-[#2DD4BF] to-[#0EA5E9] flex items-center justify-center shadow-sm border border-white">
            <svg className="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L4 5.5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5.5L12 2zm0 4.3l5 2.18v3.12L12 16.5 7 11.6V8.48l5-2.18z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-none">
                Vireon Threat Center — Managed Cybersecurity &amp; MXDR Bento Showcase
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                SOC 2 Type II • NIST CSF 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Click any sidebar module in Block 1 to inspect SIEM, ITDR, EDR, Incident Response, Compliance &amp; BDR live views
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setAnimaticAutoplay(!animaticAutoplay);
              showToast(
                !animaticAutoplay
                  ? 'Animatic SOC sidebar auto-switching enabled'
                  : 'Manual SOC navigation mode active'
              );
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition shadow-xs border ${
              animaticAutoplay
                ? 'bg-[#E6FFFA] text-[#0F766E] border-[#99F6E4] hover:bg-[#CCFBF1]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                animaticAutoplay ? 'bg-[#0D9488] animate-ping' : 'bg-slate-400'
              }`}
            />
            <span>Animatic Auto-Switch: {animaticAutoplay ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => {
              const next = !isWorkspaceExpanded;
              setIsWorkspaceExpanded(next);
              if (next) {
                setLayoutMode('dualrail');
                showToast('Expanded Block 1 Workspace to 8 columns');
              } else {
                setLayoutMode('dashboard');
                showToast('Reset 3-Column Bento Grid');
              }
            }}
            className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-white text-slate-700 hover:bg-slate-100 transition border border-slate-200 shadow-xs"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span>{isWorkspaceExpanded ? 'Reset 3-Column Bento Grid' : 'Expand Threat Center Workspace'}</span>
          </button>
        </div>
      </header>

      {/* MAIN BENTO GRID */}
      <main className={`bento-grid ${isWorkspaceExpanded ? 'dashboard-expanded' : ''}`}>

        {/* =================================================================== */}
        {/* BLOCK 1: VIREON THREAT CENTER + ANIMATIC SIDEBAR + LIVE DASHBOARD   */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-1 p-6 sm:p-7 flex flex-col justify-between min-h-[565px] bg-[#F8FAFC]/95 border border-slate-200/90 shadow-sm">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#0F172A] leading-snug tracking-tight">
                    Unified SOC &amp; MXDR navigation<br className="hidden sm:inline" /> for rapid threat containment
                  </h2>
                  <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5 max-w-md">
                    Correlating SIEM, EDR, ITDR, compliance, and BDR workflows into a single 24×7 Managed Security Threat Center
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-xs shrink-0">
                <button
                  onClick={() => {
                    setLayoutMode('dashboard');
                    showToast('Switched to SOC View');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    layoutMode === 'dashboard'
                      ? 'bg-[#0F172A] text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  SOC View
                </button>
                <button
                  onClick={() => {
                    setLayoutMode('dualrail');
                    showToast('Showing Collapsed SOC Icon Rail alongside Threat Center');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                    layoutMode === 'dualrail'
                      ? 'bg-[#0F172A] text-white'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  + Rail
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Container */}
          <div className="relative mt-5 flex-1 flex items-stretch gap-2.5 select-none overflow-hidden pt-1">
            {/* Animatic Hand Pointer Cursor */}
            {animaticAutoplay && (
              <div
                className={`animatic-cursor absolute flex items-center justify-center ${
                  isHandClicking ? 'clicking' : ''
                }`}
                style={{
                  top: `${112 + currentSidebarIndex * 40}px`,
                  left: sidebarCollapsed ? '42px' : '118px',
                }}
              >
                <div className={`w-7 h-7 rounded-full border-2 border-[#14B8A6] absolute -top-1.5 -left-1.5 ${isHandClicking ? 'cursor-ripple' : 'opacity-0'}`} />
                <svg className="w-6 h-6 drop-shadow-md" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M11.5 4.5C11.5 3.39543 12.3954 2.5 13.5 2.5C14.6046 2.5 15.5 3.39543 15.5 4.5V12.5H17.2C18.08 12.5 18.8 13.22 18.8 14.1V14.3C19.68 14.3 20.4 15.02 20.4 15.9V16.5C21.28 16.5 22 17.22 22 18.1V20.5C22 23.8137 19.3137 26.5 16 26.5H12.3C10.5 26.5 8.9 25.5 8.1 23.9L5.8 19.3C5.3 18.3 5.7 17.1 6.7 16.6C7.6 16.1 8.8 16.5 9.3 17.4L11.5 21V4.5Z"
                    fill="white"
                    stroke="#0F172A"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}

            {/* Application Frame */}
            <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-[0_12px_32px_-10px_rgba(15,23,42,0.07)] flex overflow-hidden min-h-[395px]">
              {/* Left Sidebar */}
              <aside
                className={`app-sidebar ${
                  sidebarCollapsed ? 'w-[58px]' : 'w-[166px] sm:w-[178px]'
                } border-r border-slate-100 py-4 px-3 flex flex-col justify-between bg-white shrink-0 relative z-10`}
              >
                <div>
                  <div className="flex items-center justify-between px-1.5 mb-5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#14B8A6] via-[#2DD4BF] to-[#38BDF8] flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L4 5.5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5.5L12 2zm0 4.3l5 2.18v3.12L12 16.5 7 11.6V8.48l5-2.18z" />
                        </svg>
                      </div>
                      {!sidebarCollapsed && (
                        <span className="font-display font-extrabold text-[13px] tracking-tight text-[#0F172A] whitespace-nowrap">
                          Vireon
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                      title="Collapse / Expand Sidebar"
                      className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600 transition shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  {!sidebarCollapsed && (
                    <div className="px-2 mb-2 text-[9.5px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
                      THREAT CENTER
                    </div>
                  )}

                  <nav className="relative space-y-1">
                    <div
                      className="nav-pill-indicator vireon-active-pill absolute left-0 right-0 h-[36px] rounded-xl pointer-events-none"
                      style={{ transform: `translateY(${currentSidebarIndex * 40}px)` }}
                    />

                    {dashboardViews.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSidebarView(idx, true)}
                        className={`relative z-10 w-full h-[36px] px-2.5 rounded-xl flex items-center gap-2.5 text-[12px] transition-colors ${
                          idx === currentSidebarIndex
                            ? 'font-semibold text-slate-950'
                            : 'font-medium text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span className="shrink-0">
                          {idx === 0 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <rect x="3" y="3" width="7" height="7" rx="2" />
                              <rect x="14" y="3" width="7" height="7" rx="2" />
                              <rect x="14" y="14" width="7" height="7" rx="2" />
                              <rect x="3" y="14" width="7" height="7" rx="2" />
                            </svg>
                          )}
                          {idx === 1 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3-8 4 16 3-8h4" />
                            </svg>
                          )}
                          {idx === 2 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                          )}
                          {idx === 3 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-4" />
                            </svg>
                          )}
                          {idx === 4 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <ellipse cx="12" cy="5" rx="9" ry="3" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                          )}
                          {idx === 5 && (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                            </svg>
                          )}
                        </span>
                        {!sidebarCollapsed && <span className="truncate">{item.badge}</span>}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between px-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {!sidebarCollapsed && (
                      <span className="text-[10.5px] font-medium text-slate-500">24×7 MSSP SOC</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[9.5px] font-mono font-bold text-[#0F766E] bg-[#CCFBF1] px-1.5 py-0.5 rounded">
                      ZTNA
                    </span>
                  )}
                </div>
              </aside>

              {/* Right Mini-Dashboard Viewport */}
              <div className="flex-1 bg-[#F8FAFC] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden relative">
                <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-200/70">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#CCFBF1] text-[#0F766E]">
                        {dashboardViews[currentSidebarIndex].badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {currentSidebarIndex + 1}/{dashboardViews.length}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-[13.5px] text-slate-900 mt-0.5">
                      {dashboardViews[currentSidebarIndex].title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] text-slate-400 font-mono">
                      ⌘ + Space
                    </span>
                    <button
                      onClick={() => handleSelectSidebarView((currentSidebarIndex + 1) % dashboardViews.length)}
                      title="Next SOC Module"
                      className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0D9488] hover:border-[#0D9488] transition"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Dynamic Stage */}
                <div key={currentSidebarIndex} className="flex-1 py-2.5 flex flex-col justify-between animate-view-switch">
                  {dashboardViews[currentSidebarIndex].content}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10.5px] text-slate-400">
                  <span className="truncate">{dashboardViews[currentSidebarIndex].hint}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {dashboardViews.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => handleSelectSidebarView(dotIdx)}
                        className={`h-1.5 rounded-full transition-all ${
                          dotIdx === currentSidebarIndex ? 'w-4 bg-[#0D9488]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Collapsed Icon Rail */}
            {layoutMode === 'dualrail' && (
              <div className="w-[52px] bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_-10px_rgba(15,23,42,0.06)] py-4 px-1.5 flex flex-col items-center justify-between shrink-0">
                <div className="flex flex-col items-center w-full">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#14B8A6] to-[#38BDF8] flex items-center justify-center mb-8 shadow-xs">
                    <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 5.5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5.5L12 2z" />
                    </svg>
                  </div>

                  <div className="relative space-y-1 w-full flex flex-col items-center">
                    <div
                      className="nav-pill-indicator vireon-active-pill absolute w-9 h-[36px] rounded-xl pointer-events-none"
                      style={{ transform: `translateY(${currentSidebarIndex * 40}px)` }}
                    />
                    {dashboardViews.map((_, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => handleSelectSidebarView(rIdx)}
                        className={`relative z-10 w-9 h-[36px] rounded-xl flex items-center justify-center transition ${
                          rIdx === currentSidebarIndex ? 'text-slate-950' : 'text-slate-600'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 2: EXECUTIVE GOVERNANCE & SECURITY PERSONAS (vCISO / SOC)     */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-2 p-6 sm:p-7 flex flex-col justify-between min-h-[565px] bg-[#F8FAFC]/95 border border-slate-200/90 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="4" width="18" height="16" rx="3" />
                <circle cx="9" cy="10" r="2" />
                <path strokeLinecap="round" d="M6 16c.8-1.5 2-2 3-2s2.2.5 3 2M15 9h3M15 13h3" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#0F172A] leading-snug tracking-tight">
                Tailoring governance to<br className="hidden sm:inline" /> security &amp; vCISO stakeholders
              </h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5">
                Bridging Co-Managed Security operations with executive risk reporting, SMLA maturity, and compliance oversight
              </p>
            </div>
          </div>

          {/* Persona Card Box */}
          <div className="my-auto pt-4">
            <div
              className={`bg-white rounded-2xl p-6 sm:p-6 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.07)] border border-slate-100/90 max-w-[395px] mx-auto transition-all duration-300 ${
                isPersonaSwitching ? 'opacity-40 scale-98' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex items-center gap-3.5 pb-4">
                <div className="relative shrink-0">
                  <img
                    src={currentPersona.avatar}
                    alt={currentPersona.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#5EEAD4]/60"
                  />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0"></span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-[16px] text-[#0F172A] truncate">
                      {currentPersona.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
                      <span>{currentPersona.role}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[12px] text-slate-400 font-mono">
                    <span>{currentPersona.email}</span>
                    <span>•</span>
                    <span className="font-sans text-xs font-medium text-slate-500">{currentPersona.flag}</span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-[12.5px]">
                <div className="py-3 flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-normal w-28 shrink-0">Primary Role</span>
                  <span className="font-semibold text-[#0F172A] text-right">{currentPersona.occupation}</span>
                </div>
                <div className="py-3 flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-normal w-28 shrink-0">Frameworks</span>
                  <span className="font-semibold text-[#0D9488] text-right font-mono text-[11.5px]">
                    {currentPersona.frameworks}
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-normal w-28 shrink-0">Key Deliverable</span>
                  <span className="font-semibold text-[#0F172A] text-right">{currentPersona.deliverable}</span>
                </div>
                <div className="pt-3 pb-0.5 flex items-center justify-between gap-2">
                  <span className="text-slate-400 font-normal w-28 shrink-0">Access Policy</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                    {currentPersona.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {personasData.map((p, pIdx) => (
                <button
                  key={p.name}
                  onClick={() => handleSwitchPersona(pIdx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] transition ${
                    pIdx === activePersonaIndex
                      ? 'font-semibold bg-[#0F172A] text-white shadow-xs'
                      : 'font-medium bg-white text-slate-500 hover:text-slate-800 border border-slate-200/80'
                  }`}
                >
                  {p.name.split(' ')[0]} ({p.role.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 3: THREAT ACTIVITY GLOBE & SECURITY THREATS COMPONENT         */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-3 p-6 sm:p-7 flex flex-col justify-between min-h-[565px] bg-[#F8FAFC]/95 border border-slate-200/90 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] sm:text-[20px] text-[#0F172A] leading-snug tracking-tight">
                Threat activity &amp; telemetry cards
              </h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5">
                Real-time threat correlation across endpoints, identity, cloud gateways, and network telemetry
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-stretch gap-3 max-w-[430px] mx-auto w-full">
            <div className="flex-1 bg-white rounded-2xl p-3 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.07)] border border-slate-100 flex flex-col justify-between">
              {/* Dark Cyber Globe Box */}
              <div className="relative rounded-xl cyber-globe-surface h-[175px] p-3 flex flex-col justify-between group">
                <svg className="absolute inset-0 w-full h-full opacity-90 pointer-events-none" viewBox="0 0 300 175" fill="none">
                  <defs>
                    <radialGradient id="vireonGlobeGlow" cx="50%" cy="85%" r="65%">
                      <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.42" />
                      <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.16" />
                      <stop offset="100%" stopColor="#0B131E" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="150" cy="155" r="118" fill="url(#vireonGlobeGlow)" stroke="#1E293B" strokeWidth="1" />
                  <circle cx="150" cy="155" r="118" stroke="#38BDF8" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 4" />
                  <ellipse cx="150" cy="155" rx="85" ry="118" stroke="#2DD4BF" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="2 3" />
                  <ellipse cx="150" cy="155" rx="45" ry="118" stroke="#2DD4BF" strokeOpacity="0.18" strokeWidth="1" />
                  <path d="M62 114 Q 135 42 224 86" stroke="#5EEAD4" strokeWidth="1.6" strokeDasharray="3 3" fill="none" />
                  <path d="M98 76 Q 165 65 204 128" stroke="#38BDF8" strokeWidth="1.3" strokeOpacity="0.75" fill="none" />
                  <circle cx="62" cy="114" r="12" fill="#2DD4BF" fillOpacity="0.22" stroke="#5EEAD4" strokeWidth="1.2" />
                  <circle cx="62" cy="114" r="4" fill="#5EEAD4" />
                  <circle cx="224" cy="86" r="13" fill="#2DD4BF" fillOpacity="0.22" stroke="#5EEAD4" strokeWidth="1.2" />
                  <circle cx="224" cy="86" r="4" fill="#5EEAD4" />
                  <circle cx="98" cy="76" r="7" fill="#0F172A" stroke="#64748B" strokeWidth="1.2" />
                  <circle cx="204" cy="128" r="7" fill="#0F172A" stroke="#5EEAD4" strokeWidth="1.2" />
                </svg>

                <div className="relative z-10 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15">
                    <span className="w-4 h-4 rounded-full bg-white text-slate-900 flex items-center justify-center text-[10px] font-bold">🌐</span>
                    <span className="text-[11px] font-semibold text-white">Threat Activity</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-[#5EEAD4] bg-[#0D9488]/30 border border-[#2DD4BF]/40 px-2 py-0.5 rounded-full">
                    MXDR LIVE
                  </span>
                </div>

                <div className="relative z-10 flex items-end justify-between gap-2">
                  <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4] animate-ping"></span>
                    <span className="text-[10.5px] font-medium text-slate-200">
                      {currentAmenity.globe}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <button
                      onClick={handleCopyIoc}
                      title="Copy IOC Artifact Hash"
                      className="w-6 h-6 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center justify-center text-xs transition"
                    >
                      +
                    </button>
                    <button
                      onClick={handleToggleContainment}
                      title="Contain Endpoint Host"
                      className={`w-6 h-6 rounded-full text-slate-200 border border-slate-600 flex items-center justify-center transition ${
                        isHostContained ? 'bg-teal-600 border-teal-400' : 'bg-slate-800/90 hover:bg-teal-600'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Threat Details */}
              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-[14.5px] text-[#0F172A] leading-tight">
                      {currentAmenity.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400">{currentAmenity.code}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{currentAmenity.asset}</p>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-400">Status</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold mt-0.5 border ${
                      isHostContained
                        ? 'bg-[#CCFBF1] text-[#0F766E] border-[#5EEAD4]'
                        : 'bg-rose-50 text-rose-600 border-rose-200/60'
                    }`}
                  >
                    {isHostContained ? 'Contained (EDR)' : 'Blocked'}
                  </span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Risk Level (CVSS 8.4)</span>
                  <div className="flex items-center gap-[2px] mt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((b) => (
                      <span key={b} className="w-1 h-2.5 rounded-xs bg-[#0EA5E9]" />
                    ))}
                    <span className="w-1 h-2.5 rounded-xs bg-slate-200" />
                    <span className="w-1 h-2.5 rounded-xs bg-slate-200" />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Threat Exposure</span>
                  <span className="font-display font-bold text-[13px] text-[#0F172A]">
                    78% <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">↓ 2.1%</span>
                  </span>
                </div>
              </div>

              <div className="mt-3 bg-[#F4F8FA] rounded-xl p-2.5 grid grid-cols-3 gap-1 border border-slate-100">
                <div>
                  <span className="block text-[9.5px] text-slate-400">Active Threats</span>
                  <span className="font-display font-bold text-[12px] text-[#0D9488]">126 <span className="text-[9.5px] text-emerald-600">↑12%</span></span>
                </div>
                <div>
                  <span className="block text-[9.5px] text-slate-400">Target RTO</span>
                  <span className="font-display font-bold text-[12px] text-[#0F172A]">4.0 hrs</span>
                </div>
                <div>
                  <span className="block text-[9.5px] text-slate-400">Target RPO</span>
                  <span className="font-display font-bold text-[12px] text-[#0D9488]">15 mins</span>
                </div>
              </div>
            </div>

            {/* Stacked 5 Domain Tiles */}
            <div className="w-[84px] flex flex-col justify-between gap-2 shrink-0">
              {['SIEM', 'ITDR', 'EDR', 'ZTNA', 'DFIR'].map((domain, dIdx) => (
                <button
                  key={domain}
                  onClick={() => handleAmenitySelect(dIdx)}
                  className={`flex-1 rounded-xl border shadow-2xs flex flex-col items-center justify-center p-1.5 transition group ${
                    dIdx === activeAmenityIndex
                      ? 'border-[#14B8A6] ring-2 ring-[#14B8A6] bg-[#F0FDFA]'
                      : 'bg-white border-slate-100 hover:border-[#14B8A6]'
                  }`}
                >
                  <span className="text-[10.5px] font-bold text-slate-700">{domain}</span>
                  <span className="text-[8.5px] text-slate-400">
                    {dIdx === 0 && 'Log Correl.'}
                    {dIdx === 1 && 'Identity'}
                    {dIdx === 2 && 'Endpoint'}
                    {dIdx === 3 && 'Zero Trust'}
                    {dIdx === 4 && 'Forensics'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 4: INCIDENT RESPONSE & MXDR CORRELATION ORBIT MAP             */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-4 p-6 sm:p-8 flex flex-col justify-between min-h-[485px] bg-[#F8FAFC]/95 border border-slate-200/90 shadow-sm">
          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 14a4 4 0 114-4 4 4 0 01-4 4z" />
                </svg>
              </div>
              <div>
                <h2 className="font-display font-bold text-[19px] sm:text-[21px] text-[#0F172A] leading-snug tracking-tight">
                  Incident Response &amp; Telemetry Correlation Map
                </h2>
                <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5 max-w-md">
                  Connecting SIEM, ITDR, EDR, and MXDR signals through SOC triage, containment, DFIR forensics, and immutable BDR recovery
                </p>
              </div>
            </div>
          </div>

          {/* Radar Circles */}
          <div className="relative flex-1 flex items-center justify-center min-h-[340px] mt-2 overflow-hidden">
            <div className="w-[340px] h-[340px] sm:w-[370px] sm:h-[370px] rounded-full border border-slate-200/80 flex items-center justify-center relative">
              <div className="w-[265px] h-[265px] sm:w-[290px] sm:h-[290px] rounded-full border border-slate-200/85 flex items-center justify-center">
                <div className="w-[190px] h-[190px] sm:w-[210px] sm:h-[210px] rounded-full border border-teal-200/80 flex items-center justify-center bg-gradient-to-b from-teal-50/50 to-sky-50/40">
                  <button
                    onClick={() => {
                      setSelectedOrbitStage(null);
                      showToast('24×7 Zero Trust SOC Core Active');
                    }}
                    className="w-[122px] h-[122px] sm:w-[132px] sm:h-[132px] rounded-full bg-white shadow-[0_15px_35px_-5px_rgba(13,148,136,0.16)] flex flex-col items-center justify-center border border-teal-100 hover:scale-105 transition cursor-pointer px-2 text-center"
                  >
                    <span className="font-display font-bold text-[14.5px] text-[#0D9488] leading-tight">
                      {selectedOrbitStage !== null ? journeyStages[selectedOrbitStage].stage : '24×7 SOC'}
                    </span>
                    <span className="text-[9.5px] font-mono text-slate-400 mt-1">
                      {selectedOrbitStage !== null ? journeyStages[selectedOrbitStage].sub : 'MXDR • Zero Trust'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Orbit Avatars */}
              <button
                onClick={() => setSelectedOrbitStage(0)}
                style={{ animationDelay: '0s' }}
                className="orbit-avatar absolute top-[28px] left-[32px] px-2.5 py-1.5 rounded-full bg-[#0F172A] text-white shadow-md border-2 border-[#5EEAD4] flex items-center gap-1.5 cursor-pointer"
                title="1. Detection: SIEM & ITDR"
              >
                <span className="w-2 h-2 rounded-full bg-[#5EEAD4]"></span>
                <span className="text-[10.5px] font-mono font-bold">1. SIEM + ITDR</span>
              </button>

              <button
                onClick={() => setSelectedOrbitStage(1)}
                style={{ animationDelay: '0.7s' }}
                className="orbit-avatar absolute top-[58px] right-[88px] px-2.5 py-1.5 rounded-full bg-[#CCFBF1] text-[#0F766E] shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                title="2. Triage & Correlation: EDR + MXDR"
              >
                <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>
                <span className="text-[10.5px] font-mono font-bold">2. EDR / MXDR</span>
              </button>

              <button
                onClick={() => setSelectedOrbitStage(2)}
                style={{ animationDelay: '1.4s' }}
                className="orbit-avatar absolute top-[152px] -right-[10px] px-2.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0369A1] shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                title="3. Threat Containment & Session Revoke"
              >
                <span className="w-2 h-2 rounded-full bg-[#0284C7]"></span>
                <span className="text-[10.5px] font-mono font-bold">3. Containment</span>
              </button>

              <button
                onClick={() => setSelectedOrbitStage(3)}
                style={{ animationDelay: '2.1s' }}
                className="orbit-avatar absolute bottom-[52px] left-[16px] px-2.5 py-1.5 rounded-full bg-[#FEF3C7] text-[#B45309] shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                title="4. DFIR & Evidence Handling"
              >
                <span className="w-2 h-2 rounded-full bg-[#D97706]"></span>
                <span className="text-[10.5px] font-mono font-bold">4. DFIR Playbook</span>
              </button>

              <button
                onClick={() => setSelectedOrbitStage(4)}
                style={{ animationDelay: '2.8s' }}
                className="orbit-avatar absolute bottom-[12px] right-[52px] px-2.5 py-1.5 rounded-full bg-[#EDE9FE] text-[#6D28D9] shadow-md border-2 border-white flex items-center gap-1.5 cursor-pointer"
                title="5. BDR Recovery (RTO 4h / RPO 15m) & Lessons Learned"
              >
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                <span className="text-[10.5px] font-mono font-bold">5. BDR &amp; Review</span>
              </button>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-full px-4 py-1.5 shadow-sm flex items-center gap-2 max-w-full overflow-hidden text-xs">
              <span className="w-2 h-2 rounded-full bg-[#0D9488] shrink-0"></span>
              <span className="font-medium text-slate-700 truncate">
                {selectedOrbitStage !== null
                  ? journeyStages[selectedOrbitStage].text
                  : 'Workflow: Detection → Triage → Investigation → Containment → Eradication → Recovery'}
              </span>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* BLOCK 5: NETWORK TRAFFIC TELEMETRY & CLOUD VISUALIZATION (40.3M)    */}
        {/* =================================================================== */}
        <section className="bento-card bento-item-5 p-6 sm:p-8 flex flex-col justify-between min-h-[485px] bg-[#F8FAFC]/95 border border-slate-200/90 shadow-sm">
          <div className="flex items-start gap-3.5 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16V12M12 16V8M16 16v-5" />
              </svg>
            </div>
            <div>
              <h2 className="font-display font-bold text-[19px] sm:text-[21px] text-[#0F172A] leading-snug tracking-tight">
                Multi-cloud network traffic &amp; SIEM telemetry
              </h2>
              <p className="text-[13px] text-[#64748B] leading-relaxed mt-1.5 max-w-md">
                Continuous 24×7 monitoring of AWS &amp; Azure packet flows, searchable log retention, and automated DLP anomaly inspection
              </p>
            </div>
          </div>

          <div className="relative mt-6 pt-3 flex-1 flex flex-col justify-end">
            {/* Circular Magnifying Loupe */}
            <div className="chart-loupe w-[170px] h-[170px] sm:w-[186px] sm:h-[186px] rounded-full absolute -top-2 left-1 sm:left-3 z-20 flex flex-col justify-center px-5 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[#0F172A] text-[#5EEAD4] flex items-center justify-center text-[10px] font-bold shadow-2xs">
                  ılı
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-800 leading-none">Network Traffic</span>
                  </div>
                  <span className="block text-[8.5px] text-slate-400 leading-none mt-0.5 font-mono">
                    {currentDataset.sub}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-extrabold text-[19px] sm:text-[20px] text-[#0F172A] tracking-tight">
                    {hoverPosition ? `${hoverPosition.totalM}M` : currentDataset.price}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">EVENTS</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#CCFBF1] text-[#0F766E]">
                    {currentDataset.delta}
                  </span>
                  <span className="text-[9.5px] text-slate-400">Traffic increase</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center gap-2 text-[9px] font-medium text-slate-500">
                <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-xs bg-[#0EA5E9] inline-block"></i>AWS</span>
                <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-xs bg-[#2DD4BF] inline-block"></i>Azure</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.07)] p-4 sm:p-5 pt-5 relative overflow-hidden">
              <div className="flex items-center justify-end gap-1.5 mb-6 relative z-30 flex-wrap">
                <div className="bg-[#F4F8FA] p-1 rounded-xl flex items-center gap-0.5 border border-slate-100">
                  {[
                    { key: '1D', label: '08-12 June' },
                    { key: '1W', label: 'SIEM' },
                    { key: '1M', label: 'ZTNA' },
                    { key: '3M', label: 'DLP' },
                    { key: 'All', label: 'All' },
                  ].map((tf) => (
                    <button
                      key={tf.key}
                      onClick={() => {
                        setActiveTimeframe(tf.key as any);
                        showToast(`Telemetry filter: ${tf.label}`);
                      }}
                      className={`px-2 py-1 rounded-lg text-[10.5px] transition ${
                        activeTimeframe === tf.key
                          ? 'font-bold bg-white text-slate-900 shadow-2xs'
                          : 'font-medium text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-stretch gap-3 pt-4">
                <div className="flex flex-col justify-between text-[10px] text-slate-300 font-medium select-none py-1 w-8 text-right shrink-0">
                  <span>25k</span>
                  <span>20k</span>
                  <span>15k</span>
                  <span>10k</span>
                  <span>5k</span>
                </div>

                <div
                  className="relative flex-1 h-[175px]"
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={handleChartMouseLeave}
                >
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 420 165" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="vireonAwsBlueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.24" />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="vireonAzureMintGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="vireonHighlightColGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.32" />
                      </linearGradient>
                    </defs>

                    <g stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3">
                      <line x1="20" y1="10" x2="20" y2="150" />
                      <line x1="95" y1="10" x2="95" y2="150" />
                      <line x1="170" y1="10" x2="170" y2="150" />
                      <line x1="245" y1="10" x2="245" y2="150" />
                      <line x1="320" y1="10" x2="320" y2="150" />
                    </g>

                    <rect x="218" y="52" width="55" height="98" rx="4" fill="url(#vireonHighlightColGrad)" />

                    <path
                      d={`${currentDataset.line} L420,150 L0,150 Z`}
                      fill="url(#vireonAwsBlueGrad)"
                      className="transition-all duration-500"
                    />
                    <path
                      d={currentDataset.line}
                      fill="none"
                      stroke="#0EA5E9"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />
                    <path
                      d={currentDataset.secLine}
                      fill="none"
                      stroke="#2DD4BF"
                      strokeWidth="2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-all duration-500"
                    />

                    {/* Guide line and dot */}
                    <line
                      x1={hoverPosition ? hoverPosition.x : 245}
                      y1="15"
                      x2={hoverPosition ? hoverPosition.x : 245}
                      y2="150"
                      stroke="#0EA5E9"
                      strokeWidth="1.2"
                      strokeDasharray="2 2"
                      opacity="0.75"
                    />
                    <circle
                      cx={hoverPosition ? hoverPosition.x : 245}
                      cy={hoverPosition ? hoverPosition.y : currentDataset.dotY}
                      r="5"
                      fill="#38BDF8"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </svg>

                  {/* Dark Floating Tooltip */}
                  <div
                    className="absolute bg-[#0F172A]/95 backdrop-blur-md text-white rounded-2xl px-3.5 py-2.5 shadow-xl border border-slate-700/80 pointer-events-none transition-all duration-150 min-w-[118px]"
                    style={{
                      left: hoverPosition ? `${Math.min(75, Math.max(10, (hoverPosition.x / 420) * 100))}%` : '44%',
                      top: '18px',
                    }}
                  >
                    <div className="flex items-center justify-between text-[9.5px] text-slate-400 font-medium">
                      <span>Sep, 2026</span>
                      <span>↗</span>
                    </div>
                    <div className="font-display font-extrabold text-[15px] text-white mt-0.5">
                      {hoverPosition ? `${hoverPosition.totalM}M` : currentDataset.price}
                    </div>
                    <div className="mt-1 space-y-0.5 text-[10px] font-medium">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <span className="w-2 h-2 rounded-xs bg-[#38BDF8]"></span>
                        <span>{hoverPosition ? `${hoverPosition.awsM}M` : currentDataset.aws}</span>
                        <span className="text-slate-400 text-[9px]">AWS</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <span className="w-2 h-2 rounded-xs bg-[#2DD4BF]"></span>
                        <span>{hoverPosition ? `${hoverPosition.azureM}M` : currentDataset.azure}</span>
                        <span className="text-slate-400 text-[9px]">Azure</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[9.5px] text-slate-400 px-2 mt-1">
                    <span>May</span><span>June</span><span>July</span><span>Aug</span><span>Sep</span><span>Oct</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-full shadow-xl border border-teal-500/40 flex items-center gap-2.5 text-xs font-medium animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
