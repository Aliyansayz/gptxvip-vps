import React, { useMemo, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Cpu,
  GitBranch,
  Play,
  Terminal,
} from "lucide-react";
import type { AnalysisResponse, RideRecord } from "../types";
import {
  computeAggregatedStats,
  runComputationalAnalysis,
} from "../workflow/edaEngine";
import { Button } from "../../shared";

interface LogicflowViewProps {
  records: RideRecord[];
  filteredRecords: RideRecord[];
}

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "CSV Ingestion",
    detail: "parseCSV() parses timestamps, rush hours, fares, weather & traffic",
    fn: "utils/csvParser.ts",
  },
  {
    step: "02",
    title: "Client Filter",
    detail: "Filters active horizon by Season, Weather, and Workday/Holiday",
    fn: "filterRideRecords()",
  },
  {
    step: "03",
    title: "KPI & Series Aggregator",
    detail: "Pre-computes holiday deltas, peak hours & climate friction series",
    fn: "computeChartSeries() + computeAggregatedStats()",
  },
  {
    step: "04",
    title: "Intent Router",
    detail: "Routes prompt intent (bottleneck / shift / weather / general)",
    fn: "runComputationalAnalysis()",
  },
  {
    step: "05",
    title: "Deterministic Synthesis",
    detail: "Extracts peak hour, Winter vs Summer index, Snowy vs Clear deltas",
    fn: "AnalysisResponse builder",
  },
  {
    step: "06",
    title: "UI + HIL Feedback",
    detail: "Renders executive Markdown report, takeaways & inner monologue",
    fn: "AgentCopilot.tsx",
  },
];

const PIPELINE_SNIPPET = `import {
  computeAggregatedStats,
  runComputationalAnalysis,
} from "./workflow/edaEngine";

export function executeEdaWorkflow(
  records: RideRecord[],
  filteredRecords: RideRecord[],
  prompt: string,
) {
  const stats = computeAggregatedStats(records, filteredRecords);
  if (!stats) return null;

  return runComputationalAnalysis(stats, prompt);
}`;

export const LogicflowView: React.FC<LogicflowViewProps> = ({
  records,
  filteredRecords,
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState(
    "Identify top traffic bottlenecks and congestion pricing adjustments.",
  );
  const [lastResult, setLastResult] = useState<AnalysisResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const aggregated = useMemo(
    () => computeAggregatedStats(records, filteredRecords),
    [records, filteredRecords],
  );

  const runPipelineNow = () => {
    if (!aggregated) return;
    setLastResult(runComputationalAnalysis(aggregated, selectedPrompt));
  };

  const handleCopySnippet = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(PIPELINE_SNIPPET).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 font-bold flex items-center gap-1.5">
            <GitBranch size={13} />
            Deterministic Architecture • Zero Backend Dependency
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            EDA Logicflow &amp; TypeScript Workflow Pipeline
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Inspect every computational stage from raw CSV parsing to
            structured insight generation and run the pure workflow live.
          </p>
        </div>

        <Button variant="primary" onClick={runPipelineNow}>
          <Play size={15} />
          <span>Execute Logicflow Step</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PIPELINE_STEPS.map((st) => (
          <div
            key={st.step}
            className="taxi-card bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                  STAGE {st.step}
                </span>
                <Cpu size={16} className="text-slate-400" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{st.title}</h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {st.detail}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-mono text-indigo-700 font-semibold">
              {st.fn}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 taxi-card bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal size={16} className="text-indigo-700" />
              <span>Interactive Workflow Runner</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              {filteredRecords.length} active intervals
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              {
                label: "Bottleneck Regression",
                prompt:
                  "Identify top traffic bottlenecks and congestion pricing adjustments.",
              },
              {
                label: "Seasonal Roster",
                prompt:
                  "Provide Spring vs Summer seasonal shift roster recommendations.",
              },
              {
                label: "Weather Friction",
                prompt:
                  "Analyze snowy weather friction and storm surge premium pricing.",
              },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSelectedPrompt(preset.prompt)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  selectedPrompt === preset.prompt
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {lastResult ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <p className="font-semibold text-slate-900">
                {lastResult.summary}
              </p>
              <div className="space-y-2">
                {lastResult.findings.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <span className="font-semibold text-slate-800">
                      {f.title}
                    </span>
                    <span className="font-mono text-indigo-700 font-bold">
                      {f.metric}
                    </span>
                  </div>
                ))}
              </div>
              <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono whitespace-pre-wrap">
                {lastResult.agentThoughts}
              </pre>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs text-slate-500">
              Click <strong>Execute Logicflow Step</strong> above to inspect live
              statistical output from <code>runComputationalAnalysis()</code>.
            </div>
          )}
        </div>

        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-100">
                <Code2 size={15} className="text-indigo-400" />
                <span>workflow/edaEngine.ts Invocation</span>
              </div>
              <button
                type="button"
                onClick={handleCopySnippet}
                className="text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="text-xs font-mono leading-relaxed text-indigo-200 overflow-x-auto">
              {PIPELINE_SNIPPET}
            </pre>
          </div>
          {aggregated && (
            <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-3 gap-3 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 block">Holiday Delta</span>
                <span className="text-rose-400 font-bold">
                  {aggregated.holidayPercentDifference >= 0 ? "+" : ""}
                  {aggregated.holidayPercentDifference.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Peak Hour</span>
                <span className="text-emerald-400 font-bold">
                  {String(aggregated.highTrafficHour).padStart(2, "0")}:00
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Clear Avg</span>
                <span className="text-sky-400 font-bold">
                  {(aggregated.weatherAverages.Clear ?? 0).toFixed(1)} rides
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
