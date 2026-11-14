import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Car,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  FileCode2,
  KeyRound,
  Layers,
  ListChecks,
  Network,
  Play,
  Radar,
  ScanLine,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";
import { AGENT_PROTOTYPES } from "../data/sampleTaxiData";
import { Button } from "../../shared";

interface AgentTypesViewProps {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
  onLaunchTaxi: () => void;
}

export const AgentTypesView: React.FC<AgentTypesViewProps> = ({
  selectedAgentId,
  onSelectAgent,
  onLaunchTaxi,
}) => {
  const [subViewMode, setSubViewMode] = useState<"schema" | "simulator">(
    "schema",
  );
  const [reconScanning, setReconScanning] = useState(false);
  const [scannerSelectedBundle, setScannerSelectedBundle] =
    useState("main.bundle.js");
  const [showUnmaskedSecret, setShowUnmaskedSecret] = useState(false);

  const [analyzerFilter, setAnalyzerFilter] = useState<
    "All" | "High" | "Medium"
  >("All");
  const [analyzerActions, setAnalyzerActions] = useState<
    Record<string, "confirmed" | "false_positive">
  >({});
  const [analyzerChatInput, setAnalyzerChatInput] = useState("");
  const [analyzerChatHistory, setAnalyzerChatHistory] = useState<
    Array<{ sender: "ai" | "user"; text: string }>
  >([
    {
      sender: "ai",
      text: "Hello! I am the Analyzer Agent Cognitive Copilot. I can prioritize risks, evaluate exploitability chains, and draft structured reports.",
    },
  ]);

  const activeAgent =
    AGENT_PROTOTYPES.find((a) => a.id === selectedAgentId) ??
    AGENT_PROTOTYPES[0];

  const renderIcon = (id: string, size = 18) => {
    switch (id) {
      case "taxi_demand":
        return <Car size={size} className="text-indigo-700" />;
      case "recon_agent":
        return <Radar size={size} className="text-blue-700" />;
      case "scanner_agent":
        return <ScanLine size={size} className="text-amber-700" />;
      default:
        return <Sparkles size={size} className="text-rose-700" />;
    }
  };

  const renderTone = (id: string) => {
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

  const handleReconScan = () => {
    setReconScanning(true);
    window.setTimeout(() => setReconScanning(false), 600);
  };

  const handleAnalyzerSend = (prompt?: string) => {
    const q = (prompt ?? analyzerChatInput).trim();
    if (!q) return;
    if (!prompt) setAnalyzerChatInput("");
    setAnalyzerChatHistory((prev) => [
      ...prev,
      { sender: "user", text: q },
      {
        sender: "ai",
        text: `Analyzer Correlation Engine: Evaluating "${q}". Based on IDOR on /api/v1/user/profile paired with AWS S3 leak in main.bundle.js, aggregate risk factor is 9.2/10 (Critical). Recommend patching access verification before deploy.`,
      },
    ]);
  };

  const analyzerQueue = [
    {
      id: "F-01",
      title: "Unauthenticated Admin GraphQL Mutation",
      endpoint: "/v1/graphql (Mutation: deleteTenant)",
      impact: "High" as const,
      confidence: "94% (Very High)",
      bounty: "$2,500",
    },
    {
      id: "F-02",
      title: "Exposed AWS Credentials in Static Client Bundle",
      endpoint: "main.bundle.js:1402",
      impact: "High" as const,
      confidence: "99% (Confirmed Pattern)",
      bounty: "$1,200",
    },
    {
      id: "F-03",
      title: "IDOR Parameter on Invoice Ledger Export",
      endpoint: "/api/v1/invoices?account_id={id}",
      impact: "Medium" as const,
      confidence: "78% (Requires Session Test)",
      bounty: "$750",
    },
  ].filter((item) => analyzerFilter === "All" || item.impact === analyzerFilter);

  return (
    <div className="space-y-6">
      <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 font-bold">
            Multi-Agent Taxonomy &amp; Sandboxes
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Configured Agent Archetypes
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Select an agent to inspect its I/O schema or run interactive
            simulations.
          </p>
        </div>

        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            type="button"
            onClick={() => setSubViewMode("schema")}
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              subViewMode === "schema"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Architectural Schema
          </button>
          <button
            type="button"
            onClick={() => setSubViewMode("simulator")}
            className={`text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
              subViewMode === "simulator"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Interactive Simulation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-3">
          {AGENT_PROTOTYPES.map((agent) => {
            const isSelected = agent.id === activeAgent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onSelectAgent(agent.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-white border-indigo-500 ring-2 ring-indigo-500/15 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl border ${renderTone(agent.id)}`}>
                  {renderIcon(agent.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {agent.name}
                    </h3>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        agent.status === "LIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {agent.role}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {agent.purpose}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div
                  className={`p-3 rounded-xl border ${renderTone(activeAgent.id)}`}
                >
                  {renderIcon(activeAgent.id, 24)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {activeAgent.name}
                    </h2>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                        activeAgent.status === "LIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {activeAgent.statusLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeAgent.type} • {activeAgent.role}
                  </p>
                </div>
              </div>

              {activeAgent.isReal && (
                <Button variant="primary" size="sm" onClick={onLaunchTaxi}>
                  <Play size={14} />
                  <span>Open Live Workspace</span>
                  <ArrowRight size={14} />
                </Button>
              )}
            </div>

            {subViewMode === "schema" ? (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                    Operational Specification
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeAgent.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold mb-3 flex items-center gap-1.5">
                      <Layers size={14} />
                      Ingress Signals (Inputs)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {activeAgent.inputs.map((inp) => (
                        <li key={inp} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 border border-slate-200 rounded-xl bg-white">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-3 flex items-center gap-1.5">
                      <Cpu size={14} />
                      Synthesized Artifacts (Outputs)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {activeAgent.outputs.map((out) => (
                        <li key={out} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/70">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-1.5">
                    <ListChecks size={14} />
                    Core Responsibilities &amp; Downstream Feeds
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700 mb-4">
                    {activeAgent.responsibilities.map((resp) => (
                      <div key={resp} className="flex items-start gap-2">
                        <CheckCircle2
                          size={14}
                          className="text-emerald-600 mt-0.5 shrink-0"
                        />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
                      Downstream Feeds:
                    </span>
                    {activeAgent.feeds.map((feed) => (
                      <span
                        key={feed}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700"
                      >
                        {feed}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {activeAgent.id === "taxi_demand" && (
                  <div className="p-6 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                      <Activity size={18} />
                      <span>Full Interactive Production Workspace</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Unlike the defensive security simulator sandboxes, the{" "}
                      <strong>Taxi Demand Agent</strong> is connected to a live
                      CSV ingestion engine, multi-chart Recharts visualizer,
                      and deterministic EDA mathematical engine.
                    </p>
                    <Button variant="primary" onClick={onLaunchTaxi}>
                      <Play size={15} />
                      <span>Switch to Taxi Workspace</span>
                    </Button>
                  </div>
                )}

                {activeAgent.id === "recon_agent" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Target Scope: target.io (ASN-3912)
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Discovered 4 subdomains &amp; 3 active TLS hosts
                        </p>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleReconScan}
                        loading={reconScanning}
                      >
                        <Network size={14} />
                        <span>
                          {reconScanning
                            ? "Probing DNS..."
                            : "Run Discovery Sweep"}
                        </span>
                      </Button>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono text-slate-500 uppercase">
                          <tr>
                            <th className="py-2.5 px-3">Subdomain</th>
                            <th className="py-2.5 px-3">IPv4 / Edge</th>
                            <th className="py-2.5 px-3">Fingerprint</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            {
                              host: "api-v2.target.io",
                              ip: "104.21.48.92",
                              stack: "nginx / FastAPI",
                              status: "200 OK",
                            },
                            {
                              host: "admin-staging.target.io",
                              ip: "172.67.118.4",
                              stack: "Node 20 / Vite",
                              status: "403 Restricted",
                            },
                            {
                              host: "auth.target.io",
                              ip: "198.51.100.12",
                              stack: "OIDC Gateway",
                              status: "200 OK",
                            },
                          ].map((row) => (
                            <tr key={row.host}>
                              <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                                {row.host}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">
                                {row.ip}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {row.stack}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono font-bold">
                                  {row.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeAgent.id === "scanner_agent" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "main.bundle.js",
                        "vendor-auth.chunk.js",
                        "sw-worker.js",
                      ].map((bundle) => (
                        <button
                          key={bundle}
                          type="button"
                          onClick={() => setScannerSelectedBundle(bundle)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border cursor-pointer flex items-center gap-1.5 ${
                            scannerSelectedBundle === bundle
                              ? "bg-amber-50 border-amber-300 text-amber-800 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <FileCode2 size={13} />
                          <span>{bundle}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-slate-200 font-mono text-xs space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                        <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                          <KeyRound size={14} />
                          Token Detection in {scannerSelectedBundle}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowUnmaskedSecret((prev) => !prev)
                          }
                          className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
                        >
                          {showUnmaskedSecret ? (
                            <>
                              <EyeOff size={12} />
                              <span>Mask Token</span>
                            </>
                          ) : (
                            <>
                              <Eye size={12} />
                              <span>Unmask Sample</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-[11px] leading-relaxed overflow-x-auto text-slate-300">
{`// Bundle AST scan result (${scannerSelectedBundle})
const CLIENT_TELEMETRY_SECRET = "${
                          showUnmaskedSecret
                            ? "DEMO_SAMPLE_KEY_9F81B2C3_SIMULATION"
                            : "DEMO_SAMPLE_********************"
                        }";`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeAgent.id === "analyzer_agent" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ShieldAlert size={15} className="text-rose-600" />
                        Priority Triage Queue
                      </span>
                      <div className="flex gap-1.5">
                        {(["All", "High", "Medium"] as const).map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setAnalyzerFilter(lvl)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                              analyzerFilter === lvl
                                ? "bg-rose-600 border-rose-600 text-white"
                                : "bg-slate-50 border-slate-200 text-slate-600"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {analyzerQueue.map((finding) => {
                        const decision = analyzerActions[finding.id];
                        return (
                          <div
                            key={finding.id}
                            className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                                  {finding.id}
                                </span>
                                <span className="text-sm font-bold text-slate-900">
                                  {finding.title}
                                </span>
                              </div>
                              <p className="text-xs font-mono text-slate-500 mt-1">
                                {finding.endpoint} • {finding.confidence} • Est.
                                impact {finding.bounty}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setAnalyzerActions((prev) => ({
                                    ...prev,
                                    [finding.id]: "confirmed",
                                  }))
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                                  decision === "confirmed"
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300"
                                }`}
                              >
                                {decision === "confirmed"
                                  ? "Confirmed"
                                  : "Confirm"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setAnalyzerActions((prev) => ({
                                    ...prev,
                                    [finding.id]: "false_positive",
                                  }))
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                                  decision === "false_positive"
                                    ? "bg-slate-700 border-slate-700 text-white"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                }`}
                              >
                                {decision === "false_positive"
                                  ? "Dismissed"
                                  : "Dismiss"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Bot size={15} className="text-rose-600" />
                        <span>Analyzer Reasoning Sandbox</span>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                        {analyzerChatHistory.map((m, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-lg ${
                              m.sender === "ai"
                                ? "bg-slate-50 border border-slate-200 text-slate-700"
                                : "bg-indigo-50 border border-indigo-200 text-indigo-900"
                            }`}
                          >
                            <span className="font-mono text-[10px] uppercase font-bold block mb-0.5">
                              {m.sender === "ai" ? "Analyzer" : "Operator"}
                            </span>
                            {m.text}
                          </div>
                        ))}
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAnalyzerSend();
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={analyzerChatInput}
                          onChange={(e) => setAnalyzerChatInput(e.target.value)}
                          placeholder="Ask Analyzer to correlate risk findings..."
                          aria-label="Ask Analyzer to correlate risk findings"
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                        <Button type="submit" variant="primary" size="sm">
                          <Send size={13} />
                          <span>Send</span>
                        </Button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
