import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Car,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  FileCode2,
  Layers,
  Play,
  Radar,
  ScanLine,
  Sparkles,
  Truck,
  XCircle,
} from 'lucide-react';
import { AGENT_PROTOTYPES, seed } from '../../../../prototype/taxi-demand-eda-agent/data/sampleTaxiData';
import {
  computeAggregatedStats,
  runComputationalAnalysis,
} from '../../../../prototype/taxi-demand-eda-agent/workflow/edaEngine';
import { agenticRoleDefinitions } from '../../../../devLushArea/agenticRoles/data';
import { getPrototypeUrl, type PrototypeId } from '../../../../prototype/registry';
import { Reveal } from '../../../../shared/components/Reveal';
import { SurfaceChartWidget } from './SurfaceChartWidget';

export interface AgentArchetypeSimulatorProps {
  onRequestAdaptation: (surfaceName: string, note?: string) => void;
  onExploreRoles?: () => void;
}

interface SystemBlueprint {
  id: string;
  prototype: PrototypeId;
  name: string;
  category: string;
  role: string;
  description: string;
  inputs: string[];
  outputs: string[];
  widgets: string[];
}

const SYSTEM_BLUEPRINTS: SystemBlueprint[] = [
  {
    id: 'sys-analytics',
    prototype: 'pulse-analytics',
    name: 'Product Analytics Engine',
    category: 'Analytics System',
    role: 'Funnels, Cohorts & Session Path Tracker',
    description:
      'Turns raw product event streams into segmented activation funnels, cohort retention tables, and saved board reports.',
    inputs: ['ProductEvent[] stream', 'Channel & Platform filters', 'Cohort start windows'],
    outputs: ['Unique-user conversion %', 'Retention cohort matrix', 'CSV event export'],
    widgets: ['Activation Funnel', 'Daily User Trendline', 'Session Path Explorer'],
  },
  {
    id: 'sys-ledger',
    prototype: 'ledgerline',
    name: 'Multi-Currency Ledger System',
    category: 'Finance System',
    role: 'Account Ledgers & Bank Statement Matching',
    description:
      'Maintains separate currency ledgers with validated credit/debit postings, discrepancy detection, and full audit trails.',
    inputs: ['Account opening balances', 'Journal Entry[] postings', 'Bank StatementLine[]'],
    outputs: ['Verified closing balance', 'Match discrepancy delta', 'Reconciled audit log'],
    widgets: ['Cash-Flow Bridge', 'Statement Matcher', 'Currency Ledger Table'],
  },
  {
    id: 'sys-saas',
    prototype: 'saas-metrics-kit',
    name: 'SaaS Revenue & Recovery System',
    category: 'Revenue System',
    role: 'MRR Waterfall, Churn & Dunning Desk',
    description:
      'Connects subscription plans, expansion/churn movements, and failed invoice retries into auditable unit economics.',
    inputs: ['Subscription[] status', 'MonthlyMovement[] deltas', 'Past-due Invoice[]'],
    outputs: ['Net MRR movement bridge', 'Recovery rate metrics', 'Printable board pack'],
    widgets: ['MRR Waterfall Bridge', 'Plan Retention Matrix', 'Invoice Retry Queue'],
  },
  {
    id: 'sys-dispatch',
    prototype: 'logistics',
    name: 'Fleet & Dispatch Operations System',
    category: 'Operations System',
    role: 'Route SLA Monitor & Driver Assignment Desk',
    description:
      'Coordinates depot deliveries, driver capacity thresholds, exception triage, and human-approved route rebalancing.',
    inputs: ['DeliveryJob[] queue', 'Driver capacity & region', 'Route ETA snapshots'],
    outputs: ['On-time SLA rate %', 'Exception triage actions', 'Driver dispatch plan'],
    widgets: ['Fleet SLA Bars', 'Schematic Route Map', 'HITL Dispatch Approvals'],
  },
];

const ANALYZER_FINDINGS = [
  {
    id: 'F-01',
    title: 'Unauthenticated Admin GraphQL Mutation',
    endpoint: '/v1/graphql (deleteTenant)',
    impact: 'High',
    confidence: '94%',
  },
  {
    id: 'F-02',
    title: 'Exposed AWS Credentials in Static Client Bundle',
    endpoint: 'main.bundle.js:1402',
    impact: 'High',
    confidence: '99%',
  },
  {
    id: 'F-03',
    title: 'IDOR Parameter on Invoice Ledger Export',
    endpoint: '/api/v1/invoices?account_id={id}',
    impact: 'Medium',
    confidence: '78%',
  },
] as const;

const RECON_ENDPOINTS = [
  { host: 'api-v2.target.io', tag: 'REST API', status: '200 OK' },
  { host: 'admin-staging.target.io', tag: 'Auth Surface', status: '401 Protected' },
  { host: 'internal-k8s.staging.corp', tag: 'CT Log Hit', status: 'Flagged' },
] as const;

export const AgentArchetypeSimulator: React.FC<AgentArchetypeSimulatorProps> = ({
  onRequestAdaptation,
  onExploreRoles = () => window.location.assign('/workspace'),
}) => {
  const [domainTrack, setDomainTrack] = useState<'systems' | 'agents'>('systems');
  const [selectedSystemId, setSelectedSystemId] = useState<string>(SYSTEM_BLUEPRINTS[0].id);
  const [selectedAgentId, setSelectedAgentId] = useState<string>(AGENT_PROTOTYPES[0]?.id || 'taxi_demand');
  const [mode, setMode] = useState<'simulator' | 'schema'>('simulator');

  const [reconScanDone, setReconScanDone] = useState(false);
  const [reconScanning, setReconScanning] = useState(false);
  const [bundleChoice, setBundleChoice] = useState<'main' | 'auth'>('main');
  const [unmaskedSecret, setUnmaskedSecret] = useState(false);
  const [triageMap, setTriageMap] = useState<Record<string, 'confirmed' | 'dismissed'>>({});

  const activeSystem =
    SYSTEM_BLUEPRINTS.find((s) => s.id === selectedSystemId) || SYSTEM_BLUEPRINTS[0];
  const activeAgent =
    AGENT_PROTOTYPES.find((agent) => agent.id === selectedAgentId) || AGENT_PROTOTYPES[0];

  const taxiSummary = useMemo(() => {
    const stats = computeAggregatedStats(seed.records, seed.records);
    if (!stats) return null;
    return runComputationalAnalysis(
      stats,
      'Identify top rush-hour bottlenecks and seasonal demand drivers.',
    );
  }, []);

  const renderSystemIcon = (id: string) => {
    switch (id) {
      case 'sys-analytics':
        return BarChart3;
      case 'sys-ledger':
        return CreditCard;
      case 'sys-saas':
        return Layers;
      default:
        return Truck;
    }
  };

  const renderAgentIcon = (id: string) => {
    switch (id) {
      case 'taxi_demand':
        return Car;
      case 'recon_agent':
        return Radar;
      case 'scanner_agent':
        return ScanLine;
      default:
        return Sparkles;
    }
  };

  const runReconDemo = () => {
    if (reconScanning) return;
    setReconScanning(true);
    window.setTimeout(() => {
      setReconScanning(false);
      setReconScanDone(true);
    }, 420);
  };

  const confirmedCount = Object.values(triageMap).filter((v) => v === 'confirmed').length;

  return (
    <section
      id="agent-archetypes"
      className="border-b border-slate-200 bg-white py-14 sm:py-16"
      aria-labelledby="agent-archetypes-heading"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#EDE9FE] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6D28D9]">
                03 / Core Systems &amp; Agent Archetypes
              </span>
              <h2
                id="agent-archetypes-heading"
                className="text-2xl font-medium leading-[1.06] tracking-[-0.04em] text-[#0F172A] sm:text-4xl"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Inspect system modules{' '}
                <span className="text-[#0284C7]">
                  and agent boundaries live.
                </span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-base leading-relaxed text-slate-600">
              Toggle between operational Business Systems and autonomous Agent Archetypes to test live widgets or inspect schemas.
            </p>
          </div>
        </Reveal>

        <div
          className="mt-8 overflow-hidden rounded-2xl border border-slate-700/60 text-white shadow-[0_20px_56px_rgba(11,19,30,0.18)]"
          style={{
            background:
              'radial-gradient(ellipse at 92% 8%, rgba(45,212,191,0.16) 0, transparent 45%), linear-gradient(155deg, #070d17 0%, #0B131E 65%, #0d263d 100%)',
          }}
        >
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
            <div className="inline-flex gap-1.5 rounded-xl border border-white/15 bg-white/5 p-1" role="tablist" aria-label="Choose Systems or Agents workbench">
              <button
                type="button"
                role="tab"
                aria-selected={domainTrack === 'systems'}
                onClick={() => setDomainTrack('systems')}
                className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                  domainTrack === 'systems'
                    ? 'bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Business Systems (4)
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={domainTrack === 'agents'}
                onClick={() => setDomainTrack('agents')}
                className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                  domainTrack === 'agents'
                    ? 'bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Agent Archetypes (4)
              </button>
            </div>

            <div
              className="inline-flex gap-1.5 rounded-xl border border-white/15 bg-white/5 p-1"
              role="tablist"
              aria-label="Inspect widget or schema"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'simulator'}
                onClick={() => setMode('simulator')}
                className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                  mode === 'simulator'
                    ? 'bg-white text-[#0B131E]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Live Widget
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'schema'}
                onClick={() => setMode('schema')}
                className={`min-h-11 cursor-pointer rounded-lg px-3.5 py-2 text-xs font-bold transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                  mode === 'schema'
                    ? 'bg-white text-[#0B131E]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                I/O Schema
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Rail */}
            <div className="border-b border-white/10 p-3.5 lg:col-span-4 lg:border-r lg:border-b-0 lg:p-4">
              {domainTrack === 'systems' ? (
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {SYSTEM_BLUEPRINTS.map((sys, index) => {
                    const Icon = renderSystemIcon(sys.id);
                    const selected = sys.id === activeSystem.id;
                    return (
                      <button
                        key={sys.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedSystemId(sys.id)}
                        className={`group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                          selected
                            ? 'border-[#2DD4BF]/60 bg-[#0D9488]/25 text-white'
                            : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#38BDF8]/40 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? 'bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                              : 'bg-white/10 text-slate-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#38BDF8]">
                            0{index + 1} Â· {sys.category}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-bold text-white sm:text-sm">
                            {sys.name}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {AGENT_PROTOTYPES.map((agent, index) => {
                    const Icon = renderAgentIcon(agent.id);
                    const selected = agent.id === activeAgent.id;
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSelectedAgentId(agent.id)}
                        className={`group flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4] ${
                          selected
                            ? 'border-[#2DD4BF]/60 bg-[#0D9488]/25 text-white'
                            : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-[#38BDF8]/40 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                            selected
                              ? 'bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                              : 'bg-white/10 text-slate-200'
                          }`}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[9px] font-bold uppercase tracking-wider text-[#38BDF8]">
                            0{index + 1} Â· {agent.category}
                          </span>
                          <span className="mt-0.5 block truncate text-xs font-bold text-white sm:text-sm">
                            {agent.name}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Bridge to Full Workspace Library */}
              <div className="mt-4 rounded-xl border border-[#38BDF8]/25 bg-[#0EA5E9]/10 p-3.5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                  Full Role &amp; Tool Hub
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  Explore {agenticRoleDefinitions.length} domain roles and 10 live interactive tools (DFIR, Cloud Posture, Legal Contract, SAST).
                </p>
                <button
                  type="button"
                  onClick={onExploreRoles}
                  className="mt-1.5 inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-[#38BDF8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                >
                  <span>Open Agent Workspace</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col justify-between p-5 sm:p-6 lg:col-span-8">
              {domainTrack === 'systems' ? (
                <>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                          {activeSystem.category}
                        </span>
                        <h3
                          className="mt-1 text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {activeSystem.name} â€” {activeSystem.role}
                        </h3>
                      </div>
                      <a
                        href={getPrototypeUrl(activeSystem.prototype)}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#38BDF8]/35 bg-[#0EA5E9]/15 px-4 py-2 font-mono text-xs font-bold text-[#38BDF8] hover:bg-[#0EA5E9]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                      >
                        <span>Launch Surface</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#5EEAD4]" />
                      </a>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {activeSystem.description}
                    </p>

                    {mode === 'schema' ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                            Data Inputs
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeSystem.inputs.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                            Computed Outputs
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeSystem.outputs.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-300">
                            UI Chart Widgets
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeSystem.widgets.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5">
                        <SurfaceChartWidget prototype={activeSystem.prototype} />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs text-slate-300">
                      Need a <strong className="text-white">{activeSystem.name}</strong> wired to your SQL, Stripe, or internal API?
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        onRequestAdaptation(
                          activeSystem.name,
                          `Interested in building a custom ${activeSystem.name} (${activeSystem.role}) integrated with our data stack.`,
                        )
                      }
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] px-4 py-2.5 text-xs font-bold text-[#0B131E] transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span>Scope System</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                          {activeAgent.type}
                        </span>
                        <h3
                          className="mt-1 text-xl font-medium tracking-[-0.02em] text-white sm:text-2xl"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {activeAgent.name} â€” {activeAgent.role}
                        </h3>
                      </div>
                      <span className="rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/15 px-2.5 py-1 font-mono text-[10px] font-bold text-[#5EEAD4]">
                        {activeAgent.statusLabel}
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
                      {activeAgent.description}
                    </p>

                    {mode === 'schema' ? (
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                            Inputs
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeAgent.inputs.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2DD4BF]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                            Structured Outputs
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeAgent.outputs.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
                          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-violet-300">
                            Downstream Widgets
                          </p>
                          <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                            {activeAgent.feeds.map((item) => (
                              <li key={item} className="flex items-start gap-1.5">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                        {activeAgent.id === 'taxi_demand' && taxiSummary && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                                Live Computational Findings ({seed.records.length} rows)
                              </span>
                              <a
                                href={getPrototypeUrl('taxi-demand-eda-agent')}
                                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-semibold text-slate-200 hover:text-[#5EEAD4]"
                              >
                                <span>Full EDA Workbench</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              {taxiSummary.findings.slice(0, 4).map((finding) => (
                                <div
                                  key={finding.title}
                                  className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-mono text-[10px] font-bold text-[#38BDF8]">
                                      {finding.metric}
                                    </span>
                                    <span className="rounded bg-[#2DD4BF]/15 px-1.5 py-0.5 font-mono text-[9px] text-[#5EEAD4]">
                                      {finding.impact}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs font-semibold text-white">
                                    {finding.title}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeAgent.id === 'recon_agent' && (
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-mono text-[11px] text-slate-300">
                                Scope: <strong className="text-white">*.target.io Â· ASN-3912</strong>
                              </span>
                              <button
                                type="button"
                                onClick={runReconDemo}
                                disabled={reconScanning}
                                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] px-3.5 py-2 text-xs font-bold text-[#0B131E] transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.96] disabled:opacity-60"
                              >
                                <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                                <span>
                                  {reconScanning
                                    ? 'Enumerating...'
                                    : reconScanDone
                                      ? 'Re-run Recon'
                                      : 'Run Recon'}
                                </span>
                              </button>
                            </div>
                            <div className="space-y-2">
                              {RECON_ENDPOINTS.map((ep) => (
                                <div
                                  key={ep.host}
                                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs"
                                >
                                  <span className="text-white">{ep.host}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400">{ep.tag}</span>
                                    <span className="rounded bg-[#2DD4BF]/15 px-2 py-0.5 text-[10px] font-bold text-[#5EEAD4]">
                                      {reconScanDone ? 'Verified' : ep.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {activeAgent.id === 'scanner_agent' && (
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setBundleChoice('main')}
                                  className={`min-h-11 cursor-pointer rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-colors ${
                                    bundleChoice === 'main'
                                      ? 'border-[#2DD4BF]/60 bg-[#2DD4BF]/15 text-[#5EEAD4]'
                                      : 'border-white/15 bg-white/5 text-slate-300 hover:text-white'
                                  }`}
                                >
                                  <FileCode2 className="mr-1.5 inline h-3.5 w-3.5" />
                                  main.bundle.js
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBundleChoice('auth')}
                                  className={`min-h-11 cursor-pointer rounded-lg border px-3 py-2 font-mono text-xs font-semibold transition-colors ${
                                    bundleChoice === 'auth'
                                      ? 'border-[#2DD4BF]/60 bg-[#2DD4BF]/15 text-[#5EEAD4]'
                                      : 'border-white/15 bg-white/5 text-slate-300 hover:text-white'
                                  }`}
                                >
                                  <FileCode2 className="mr-1.5 inline h-3.5 w-3.5" />
                                  auth-helper.chunk.js
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => setUnmaskedSecret((v) => !v)}
                                className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10"
                              >
                                {unmaskedSecret ? (
                                  <EyeOff className="h-3.5 w-3.5 text-[#38BDF8]" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5 text-[#38BDF8]" />
                                )}
                                <span>{unmaskedSecret ? 'Mask Token' : 'Reveal Token'}</span>
                              </button>
                            </div>

                            <div className="rounded-lg border border-rose-400/35 bg-rose-500/10 p-3 font-mono text-xs">
                              {bundleChoice === 'main' ? (
                                <>
                                  <p className="text-[10px] font-bold uppercase text-rose-300">
                                    Secret Pattern Hit Â· Line 1402
                                  </p>
                                  <p className="mt-1 text-white">
                                    const AWS_KEY = &quot;
                                    {unmaskedSecret ? 'AKIA_DEMO_98F2A10C4E' : 'AKIAâ€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢C4E'}
                                    &quot;;
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-300">
                                    Severity: High Â· Demo fixture string (no live credentials)
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p className="text-[10px] font-bold uppercase text-rose-300">
                                    AST Sink Detection Â· Line 412
                                  </p>
                                  <p className="mt-1 text-white">
                                    return eval(decodeURIComponent(params.get(&apos;next&apos;)));
                                  </p>
                                  <p className="mt-1 text-[11px] text-slate-300">
                                    Recommended fix: Replace dynamic eval with allow-listed route map.
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {activeAgent.id === 'analyzer_agent' && (
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#5EEAD4]">
                                Human-in-the-Loop Triage Queue
                              </span>
                              <span className="font-mono text-[11px] text-slate-300 tabular-nums">
                                {confirmedCount} / {ANALYZER_FINDINGS.length} confirmed
                              </span>
                            </div>
                            {ANALYZER_FINDINGS.map((finding) => {
                              const decision = triageMap[finding.id];
                              return (
                                <div
                                  key={finding.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5"
                                >
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-white">
                                      <span className="mr-1.5 font-mono text-[#38BDF8]">
                                        {finding.id}
                                      </span>
                                      {finding.title}
                                    </p>
                                    <p className="font-mono text-[10px] text-slate-400">
                                      {finding.endpoint} Â· Confidence {finding.confidence}
                                    </p>
                                  </div>
                                  {decision ? (
                                    <span
                                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                        decision === 'confirmed'
                                          ? 'bg-[#2DD4BF]/20 text-[#5EEAD4]'
                                          : 'bg-white/10 text-slate-300'
                                      }`}
                                    >
                                      {decision === 'confirmed' ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                      ) : (
                                        <XCircle className="h-3 w-3" />
                                      )}
                                      {decision === 'confirmed' ? 'Confirmed' : 'Dismissed'}
                                    </span>
                                  ) : (
                                    <div className="flex items-center gap-2.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTriageMap((prev) => ({
                                            ...prev,
                                            [finding.id]: 'confirmed',
                                          }))
                                        }
                                        className="min-h-11 cursor-pointer rounded-lg bg-gradient-to-r from-[#5EEAD4] to-[#2DD4BF] px-3.5 py-2 text-xs font-bold text-[#0B131E] hover:brightness-105 active:scale-[0.96]"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setTriageMap((prev) => ({
                                            ...prev,
                                            [finding.id]: 'dismissed',
                                          }))
                                        }
                                        className="min-h-11 cursor-pointer rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/15 active:scale-[0.96]"
                                      >
                                        Dismiss
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs text-slate-300">
                      Need a <strong className="text-white">{activeAgent.name}</strong> connected to your warehouse, API, or repo?
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        onRequestAdaptation(
                          activeAgent.name,
                          `Interested in building a custom ${activeAgent.name} (${activeAgent.role}) integrated with our internal stack.`,
                        )
                      }
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] px-4 py-2.5 text-xs font-bold text-[#0B131E] transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <span>Scope Agent</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentArchetypeSimulator;
