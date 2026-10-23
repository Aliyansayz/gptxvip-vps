import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  ArrowUpRight,
  Lock,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface ClauseItem {
  id: string;
  title: string;
  section: string;
  riskLevel: 'High Risk' | 'Needs Review' | 'Safe';
  originalText: string;
  plainSummary: string;
  suggestedFix: string;
  playbookRule: string;
}

const CONTRACT_CLAUSES: ClauseItem[] = [
  {
    id: 'indemnity',
    title: 'Unlimited Liability & Indemnification',
    section: 'Section 8.2 • Vendor MSA',
    riskLevel: 'High Risk',
    originalText:
      'Provider shall indemnify and hold Client harmless against any and all direct, indirect, consequential, or special damages without monetary cap.',
    plainSummary:
      'This clause makes our company responsible for unlimited financial damages, which goes against our standard 12-month fee cap policy.',
    suggestedFix:
      'Cap total aggregate liability at 12 months of fees paid under this Agreement, excluding gross negligence or willful misconduct.',
    playbookRule: 'Company Playbook Rule #04: Mutual Cap at 1x Annual Contract Value',
  },
  {
    id: 'data-retention',
    title: 'Customer Data Sharing & AI Training',
    section: 'Section 11.4 • Data Privacy Addendum',
    riskLevel: 'Needs Review',
    originalText:
      'Vendor may retain anonymized customer usage data indefinitely for service improvement and foundation model training.',
    plainSummary:
      'Allows the vendor to keep customer data forever and train external AI models unless we explicitly opt out.',
    suggestedFix:
      'Require deletion of all customer data within 30 days of contract end and prohibit use of company data for training shared models.',
    playbookRule: 'GDPR & Privacy Rule #12: Zero Third-Party Model Training',
  },
  {
    id: 'auto-renewal',
    title: 'Auto-Renewal & 90-Day Notice Window',
    section: 'Section 4.1 • Commercial Terms',
    riskLevel: 'Needs Review',
    originalText:
      'Agreement automatically renews for successive 24-month terms unless cancelled in writing at least 90 days prior to renewal.',
    plainSummary:
      'Locks us into a 2-year renewal automatically if we miss the 90-day cancellation reminder.',
    suggestedFix:
      'Change renewal to 12-month periods with a 30-day notice window and automatic email reminder to Finance.',
    playbookRule: 'Procurement Rule #02: Max 12-Month Renewal & 30-Day Notice',
  },
  {
    id: 'security-breach',
    title: '24-Hour Security Incident Notification',
    section: 'Section 14.1 • Information Security',
    riskLevel: 'Safe',
    originalText:
      'Vendor shall notify Client Security Operations within 24 hours of confirming any unauthorized access to Client Confidential Information.',
    plainSummary:
      'Meets our strict requirement that vendors alert us within 24 hours if a security issue happens.',
    suggestedFix: 'No changes needed — matches our gold-standard security requirement.',
    playbookRule: 'SOC 2 & ISO 27001 Rule #01: ≤ 24h Breach Notice',
  },
];

interface FrameworkStatus {
  id: string;
  name: string;
  subtitle: string;
  score: number;
  controlsPassed: string;
  lastChecked: string;
  highlights: string[];
}

const FRAMEWORKS: Record<string, FrameworkStatus> = {
  GDPR: {
    id: 'GDPR',
    name: 'GDPR & Data Privacy',
    subtitle: 'EU & UK Customer Data Protection',
    score: 99,
    controlsPassed: '42 / 42 Checks Passed',
    lastChecked: 'Verified 4 mins ago',
    highlights: [
      'All vendor DPAs signed and stored with 30-day deletion clauses',
      'Automated customer data export and erasure requests under 2 hours',
      'Zero unauthorized cross-border data transfers detected',
    ],
  },
  SOC2: {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    subtitle: 'Security, Availability & Confidentiality',
    score: 98,
    controlsPassed: '86 / 87 Checks Passed',
    lastChecked: 'Verified 2 mins ago',
    highlights: [
      'Employee access permissions reviewed automatically every week',
      'All production changes linked to approved pull requests',
      'Continuous encryption and backup checks across every database',
    ],
  },
  HIPAA: {
    id: 'HIPAA',
    name: 'HIPAA Safeguards',
    subtitle: 'Healthcare & Patient Privacy',
    score: 100,
    controlsPassed: '36 / 36 Checks Passed',
    lastChecked: 'Verified 9 mins ago',
    highlights: [
      'Business Associate Agreements (BAAs) active for all sub-processors',
      'Sensitive records automatically masked in support and analytics logs',
      'Full audit trail for every record view and export',
    ],
  },
  AI_ACT: {
    id: 'AI_ACT',
    name: 'EU AI Act & Governance',
    subtitle: 'Safe & Transparent AI Usage',
    score: 97,
    controlsPassed: '28 / 29 Checks Passed',
    lastChecked: 'Verified 6 mins ago',
    highlights: [
      'Human-in-the-loop sign-off enforced for all high-impact legal decisions',
      'Complete source citations attached to every AI-drafted redline',
      'Zero customer data used to train external public AI models',
    ],
  },
};

export const ComplianceLegalBento: React.FC = () => {
  const [selectedClauseId, setSelectedClauseId] = useState<string>(CONTRACT_CLAUSES[0].id);
  const [approvedClauses, setApprovedClauses] = useState<Record<string, boolean>>({
    'security-breach': true,
  });
  const [activeFramework, setActiveFramework] = useState<string>('GDPR');

  const activeClause =
    CONTRACT_CLAUSES.find((c) => c.id === selectedClauseId) || CONTRACT_CLAUSES[0];
  const framework = FRAMEWORKS[activeFramework] || FRAMEWORKS.GDPR;

  const toggleApproveClause = (id: string) => {
    setApprovedClauses((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const approvedCount = Object.values(approvedClauses).filter(Boolean).length;

  return (
    <div
      className="rounded-2xl border border-[#e9e9ec] bg-white p-4 sm:p-6 shadow-sm"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Top Studio Header Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e9ec] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#343edb] text-white">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-base font-bold text-[#101014]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                LexGuard™ Legal &amp; Compliance Agent
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#d8ff38] px-2.5 py-0.5 text-[11px] font-bold text-[#101014]">
                ● Live Agent Workspace
              </span>
            </div>
            <p className="text-xs text-[#777780]">
              Click any contract clause or compliance standard below to test how the agent reviews agreements in plain English.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] px-3.5 py-2 text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#777780]">
              Avg. Review Speed
            </span>
            <strong
              className="text-sm font-bold text-[#343edb]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="hl-circle-sketch">3.5 mins</span> (vs. 5 days)
            </strong>
          </div>
          <div className="rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] px-3.5 py-2 text-right">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[#777780]">
              Clauses Cleared
            </span>
            <strong
              className="text-sm font-bold text-[#101014]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="hl-brutalist">{approvedCount} of {CONTRACT_CLAUSES.length} Ready</span>
            </strong>
          </div>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid gap-4 lg:grid-cols-12">
        {/* Bento Card 1: Interactive Contract Clause List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-4">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#343edb]">
                01. Incoming Vendor Contract
              </span>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#101014] border border-[#e9e9ec]">
                Acme Cloud MSA_2025.pdf
              </span>
            </div>

            <div className="space-y-2.5">
              {CONTRACT_CLAUSES.map((clause) => {
                const isSelected = clause.id === selectedClauseId;
                const isApproved = !!approvedClauses[clause.id];
                return (
                  <button
                    key={clause.id}
                    type="button"
                    onClick={() => setSelectedClauseId(clause.id)}
                    className={`w-full text-left rounded-xl p-3.5 transition-all border ${
                      isSelected
                        ? 'bg-[#101014] text-white border-[#101014] shadow-md'
                        : 'bg-white text-[#101014] border-[#e9e9ec] hover:border-[#343edb]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-[#d8ff38]' : 'text-[#777780]'
                        }`}
                      >
                        {clause.section}
                      </span>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Approved
                        </span>
                      ) : clause.riskLevel === 'High Risk' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-500">
                          <AlertTriangle className="h-3 w-3" /> High Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                          <Clock className="h-3 w-3" /> Needs Review
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {clause.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-white p-3 border border-[#e9e9ec] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#555560]">
              <Lock className="h-4 w-4 text-[#343edb]" />
              <span>Every AI suggestion is checked against your company playbook</span>
            </div>
            <span className="text-[11px] font-bold text-[#343edb]">100% Traceable</span>
          </div>
        </div>

        {/* Bento Card 2: Plain-English Redline Assistant (7 cols) */}
        <div
          className="lg:col-span-7 rounded-xl p-5 text-white flex flex-col justify-between"
          style={{
            background:
              'radial-gradient(circle at 85% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
          }}
        >
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-[#d8ff38]">
                <Sparkles className="h-3.5 w-3.5" />
                02. Plain-English Legal Assistant
              </span>
              <span className="text-xs text-white/80 font-medium">
                {activeClause.playbookRule}
              </span>
            </div>

            <h3
              className="text-xl sm:text-2xl font-medium tracking-tight text-white mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {activeClause.title}
            </h3>

            {/* Original vs Plain-English Explanation */}
            <div className="grid gap-3 sm:grid-cols-2 mb-4">
              <div className="rounded-xl bg-black/25 p-3.5 border border-white/15">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/65 block mb-1">
                  What the Contract Says (Legal Text)
                </span>
                <p className="text-xs text-white/90 leading-relaxed italic">
                  "{activeClause.originalText}"
                </p>
              </div>

              <div className="rounded-xl bg-white/12 p-3.5 border border-white/25">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d8ff38] block mb-1">
                  What It Means for Your Business
                </span>
                <p className="text-xs text-white leading-relaxed font-medium">
                  {activeClause.plainSummary}
                </p>
              </div>
            </div>

            {/* Recommended Safer Wording */}
            <div className="rounded-xl bg-[#101014]/85 p-4 border border-[#d8ff38]/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d8ff38]">
                  Recommended One-Click Revision
                </span>
                <span className="text-[11px] text-white/70">Pre-approved by General Counsel</span>
              </div>
              <p className="text-xs sm:text-sm text-white leading-relaxed">
                "{activeClause.suggestedFix}"
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs text-white/85">
              <UserCheck className="h-4 w-4 text-[#d8ff38]" />
              <span>
                {approvedClauses[activeClause.id]
                  ? 'Approved & logged in the audit trail'
                  : 'Waiting for legal or business owner approval'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => toggleApproveClause(activeClause.id)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d8ff38] px-4 py-2 text-xs font-bold text-[#101014] transition hover:-translate-y-0.5 shadow-md cursor-pointer"
            >
              <span>
                {approvedClauses[activeClause.id]
                  ? '✓ Revision Applied (Undo)'
                  : 'Apply Safer Wording'}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bento Card 3: Always-On Regulatory Checklist (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#e9e9ec] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#343edb]">
                03. Continuous Compliance Monitor
              </span>
              <h4
                className="text-lg font-bold text-[#101014]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Always Audit-Ready Across Global Standards
              </h4>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {Object.keys(FRAMEWORKS).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFramework(key)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition cursor-pointer ${
                    activeFramework === key
                      ? 'bg-[#343edb] text-white'
                      : 'bg-[#f5f5f7] text-[#555560] hover:bg-[#e9e9ec]'
                  }`}
                >
                  {key.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 mb-4 rounded-xl bg-[#f5f5f7] p-4 border border-[#e9e9ec]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780]">
                Standard
              </span>
              <p
                className="text-sm font-bold text-[#101014] mt-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {framework.name}
              </p>
              <span className="text-[11px] text-[#777780]">{framework.subtitle}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780]">
                Readiness Score
              </span>
              <p
                className="text-2xl font-bold text-[#343edb] mt-0.5"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {framework.score}%
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {framework.controlsPassed}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#777780]">
                Last Automated Check
              </span>
              <p className="text-xs font-bold text-[#101014] mt-1 flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5 text-[#343edb]" />
                {framework.lastChecked}
              </p>
              <span className="text-[11px] text-[#777780]">Evidence saved automatically</span>
            </div>
          </div>

          <div className="space-y-2">
            {framework.highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 rounded-lg border border-[#e9e9ec] bg-white px-3.5 py-2.5 text-xs text-[#101014]"
              >
                <ShieldCheck className="h-4 w-4 text-[#343edb] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Card 4: Executive Sign-Off & Audit Trail (5 cols) */}
        <div
          className="lg:col-span-5 rounded-xl p-5 text-white flex flex-col justify-between"
          style={{
            background:
              'radial-gradient(circle at 60% 35%, rgba(255,255,255,.14), transparent 36%), linear-gradient(140deg, #222226, #050506)',
          }}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d8ff38]">
              04. Clear Approval Trail
            </span>
            <h4
              className="mt-1 text-xl font-medium text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Every Decision Recorded. Zero Surprises at Audit Time.
            </h4>
            <p className="mt-2 text-xs text-white/75 leading-relaxed">
              Instead of chasing approvals across email threads and spreadsheets, every contract edit and policy check is saved in one clean timeline.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2.5 border border-white/10 text-xs">
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-[#d8ff38]" />
                  1. Agent scans contract &amp; flags risks
                </span>
                <span className="text-[10px] font-bold text-[#d8ff38]">12s</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2.5 border border-white/10 text-xs">
                <span className="flex items-center gap-2">
                  <FileCheck2 className="h-3.5 w-3.5 text-[#d8ff38]" />
                  2. Suggests pre-approved plain-English fixes
                </span>
                <span className="text-[10px] font-bold text-[#d8ff38]">Instant</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2.5 border border-white/10 text-xs">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-3.5 w-3.5 text-[#d8ff38]" />
                  3. Legal &amp; Finance sign off in one click
                </span>
                <span className="text-[10px] font-bold text-emerald-400">Logged</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-3">
            <div>
              <span className="block text-[10px] uppercase tracking-wider text-white/60">
                Time Saved Per Agreement
              </span>
              <strong
                className="text-lg font-bold text-[#d8ff38]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                85% Faster Turnaround
              </strong>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
              Ready for E-Signature
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceLegalBento;
