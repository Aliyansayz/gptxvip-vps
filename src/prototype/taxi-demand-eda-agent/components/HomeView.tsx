import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Car,
  Cpu,
  Database,
  Play,
  Radar,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { AGENT_PROTOTYPES } from "../data/sampleTaxiData";
import { Button } from "../../shared";

interface HomeViewProps {
  onNavigateTaxi: () => void;
  onNavigateAgents: (agentId?: string) => void;
  onNavigateLogicflow: () => void;
  recordCount: number;
}

const INITIAL_LOGS = [
  "[10:42:01] [TAXI DEMAND] Parsed 180 hourly intervals. Computing Winter vs Summer climate friction regression.",
  "[10:42:04] [RECON AGENT] ASN-3912 lookup complete: found api-v2.target.io, admin-staging.target.io.",
  "[10:42:07] [SCANNER AGENT] Extracting scripts from main.bundle.js -> Flagged hardcoded AWS key & OAuth token.",
  "[10:42:11] [ANALYZER AGENT] Correlated Exposed Bucket + Parameter IDOR -> High Confidence Risk (92%). Awaiting human sign-off.",
];

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTaxi,
  onNavigateAgents,
  onNavigateLogicflow,
  recordCount,
}) => {
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS);

  const emitThought = () => {
    const sampleEvents = [
      "[LIVE STREAM] [ANALYZER] Triaged /v1/graphql endpoint -> Risk Score boosted to 95 (Critical).",
      `[LIVE STREAM] [TAXI DEMAND] Recalculated rush hour 17:00 surge coefficient across ${recordCount} intervals -> +34.2% holiday multiplier.`,
      "[LIVE STREAM] [SCANNER] AST traversal detected unescaped eval() inside auth-helper.chunk.js.",
      "[LIVE STREAM] [RECON] Certificate Transparency log match found: internal-k8s.staging.corp.",
    ];
    const now = new Date();
    const ts = now.toTimeString().slice(0, 8);
    const next = sampleEvents[logs.length % sampleEvents.length].replace(
      "[LIVE STREAM]",
      `[${ts}]`,
    );
    setLogs((prev) => [next, ...prev].slice(0, 6));
  };

  const renderAgentIcon = (id: string) => {
    switch (id) {
      case "taxi_demand":
        return <Car className="text-indigo-700" size={20} />;
      case "recon_agent":
        return <Radar className="text-blue-700" size={20} />;
      case "scanner_agent":
        return <ScanLine className="text-amber-700" size={20} />;
      default:
        return <Sparkles className="text-rose-700" size={20} />;
    }
  };

  const renderAgentTone = (id: string) => {
    switch (id) {
      case "taxi_demand":
        return "bg-indigo-50 border-indigo-100";
      case "recon_agent":
        return "bg-blue-50 border-blue-100";
      case "scanner_agent":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-rose-50 border-rose-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 mb-4">
            <Bot size={14} />
            <span>Agent &amp; System Intelligence Hub • Multi-Agent EDA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
            Autonomous Operations &amp; Analytical Agent Ecosystem
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
            Manage specialized AI agents across urban mobility telemetry and
            defensive reconnaissance workflows with structured data schemas, live
            statistical inference, and human-in-the-loop verification.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Button variant="primary" onClick={onNavigateTaxi}>
              <Play size={15} />
              <span>Launch Live Taxi Analytics</span>
              <ArrowRight size={15} />
            </Button>
            <Button variant="secondary" onClick={() => onNavigateAgents()}>
              <Cpu size={15} />
              <span>Explore Agent Directory</span>
            </Button>
            <Button variant="secondary" onClick={onNavigateLogicflow}>
              <Terminal size={15} />
              <span>Inspect Logicflow Pipeline</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Live Production Agents
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1 font-mono">
              1 / 4
            </h2>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              Taxi Demand Operational
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
            <Activity size={19} />
          </div>
        </div>

        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Active Fleet Records
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1 font-mono">
              {recordCount}
            </h2>
            <p className="text-xs text-indigo-700 font-medium mt-1">
              Time-series intervals loaded
            </p>
          </div>
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100">
            <Database size={19} />
          </div>
        </div>

        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Security Simulators
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1 font-mono">
              3 Ready
            </h2>
            <p className="text-xs text-amber-700 font-medium mt-1">
              Recon • Scanner • Analyzer
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
            <ShieldAlert size={19} />
          </div>
        </div>

        <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Decision Mode
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1 font-mono">
              HIL + AI
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Deterministic Math Fallbacks
            </p>
          </div>
          <div className="p-2.5 bg-sky-50 text-sky-700 rounded-xl border border-sky-100">
            <Zap size={19} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Configured Agents Roster
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect agent state, data schemas, and interactive sandboxes
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateAgents()}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            View All Agent Types
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {AGENT_PROTOTYPES.map((agent) => (
            <div
              key={agent.id}
              onClick={() =>
                agent.isReal ? onNavigateTaxi() : onNavigateAgents(agent.id)
              }
              className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-all shadow-sm flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div
                    className={`p-2.5 rounded-xl border ${renderAgentTone(agent.id)}`}
                  >
                    {renderAgentIcon(agent.id)}
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                      agent.status === "LIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {agent.statusLabel}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5 uppercase tracking-wider">
                  {agent.category}
                </p>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                  {agent.purpose}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span
                  className={
                    agent.isReal ? "text-indigo-700" : "text-slate-600"
                  }
                >
                  {agent.isReal ? "Open Workspace" : "Open Simulator"}
                </span>
                <ArrowRight
                  size={14}
                  className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-3">
              <AlertTriangle size={16} />
              <span>Human-in-the-Loop Gateway</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Action Confirmation Queue
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The{" "}
              <strong className="text-slate-800">Analyzer Agent</strong>{" "}
              identified 2 high-probability endpoints requiring manual review.
              Agents pause execution before modifying live fleet rosters or
              active scope state.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-200/70">
            <button
              type="button"
              onClick={() => onNavigateAgents("analyzer_agent")}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
            >
              Inspect Analyzer Triage Queue
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 font-mono text-xs flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold">
                <Terminal size={15} className="text-emerald-400" />
                <span>Live Agent Thought Stream</span>
              </div>
              <button
                type="button"
                onClick={emitThought}
                className="text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded hover:bg-indigo-500/30 transition-colors cursor-pointer"
              >
                + Emit Event
              </button>
            </div>
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              {logs.map((line, idx) => (
                <div key={idx} className="text-slate-300 break-words">
                  {line}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
            <span>State Sync: LocalDeterministicEngine Ready</span>
            <span className="text-emerald-400 font-semibold">
              Telemetry Feed Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
