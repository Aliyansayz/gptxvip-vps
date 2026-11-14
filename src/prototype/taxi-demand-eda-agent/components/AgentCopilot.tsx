import React, { useMemo, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";
import Markdown from "react-markdown";
import type { AnalysisResponse, RideRecord } from "../types";
import {
  computeAggregatedStats,
  runComputationalAnalysis,
} from "../workflow/edaEngine";
import { colors, textOverlays, widgets } from "../themeSettings";
import { Button } from "../../shared";

interface AgentCopilotProps {
  records: RideRecord[];
  filteredRecords: RideRecord[];
}

export const AgentCopilot: React.FC<AgentCopilotProps> = ({
  records,
  filteredRecords,
}) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [showThoughts, setShowThoughts] = useState(false);

  const aggregatedData = useMemo(
    () => computeAggregatedStats(records, filteredRecords),
    [records, filteredRecords],
  );

  const handleAnalyze = (customPrompt?: string) => {
    const promptToSend = (customPrompt ?? query).trim();
    if (!promptToSend || !aggregatedData) return;

    if (!customPrompt) setQuery("");
    setLoading(true);

    // Deterministic client-side computational EDA workflow (avoids offline API dependency)
    window.setTimeout(() => {
      const result = runComputationalAnalysis(aggregatedData, promptToSend);
      setResponse(result);
      setLoading(false);
    }, 180);
  };

  return (
    <div
      className={`taxi-card ${colors.bg.card} border ${colors.border.card} rounded-2xl p-6 shadow-sm mb-6`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-5">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100 mb-3">
              <Bot size={14} />
              <span>AI Fleet Logistics Copilot</span>
            </div>
            <h2 className={`text-xl font-bold ${colors.text.title}`}>
              {textOverlays.copilot.title}
            </h2>
            <p className={`text-xs ${colors.text.subtitle} mt-2 leading-relaxed`}>
              {textOverlays.copilot.description}
            </p>
          </div>

          <div className="space-y-2.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              {textOverlays.copilot.quickExplorations}
            </p>
            {widgets.copilotTemplates.map((t) => {
              const IconComp = t.icon;
              const hoverTone =
                t.colorKey === "bottleneck"
                  ? colors.copilot.bottleneck
                  : t.colorKey === "shifts"
                    ? colors.copilot.shifts
                    : colors.copilot.weather;
              const iconColor =
                t.colorKey === "bottleneck"
                  ? "text-rose-600"
                  : t.colorKey === "shifts"
                    ? "text-emerald-600"
                    : "text-sky-600";

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleAnalyze(t.prompt)}
                  disabled={loading}
                  className={`w-full text-left p-3.5 rounded-xl bg-slate-50 border border-slate-200 ${hoverTone} transition-all flex items-start gap-3 group cursor-pointer disabled:opacity-60`}
                >
                  <div className={`mt-0.5 ${iconColor}`}>
                    <IconComp size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-slate-600 self-center shrink-0"
                  />
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <CheckCircle2 size={14} />
              <span>{textOverlays.copilot.statusSecured}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {textOverlays.copilot.statusKeyHelper}
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50/70 rounded-2xl border border-slate-200 p-5 min-h-[400px]">
          <div className="flex-1 overflow-y-auto space-y-4">
            {!response && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center py-6 px-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3 text-indigo-700">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  {textOverlays.copilot.starterHeader}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed">
                  {textOverlays.copilot.starterDesc1}
                  <strong className="text-slate-700">
                    &quot;Bottleneck Scanner&quot;
                  </strong>
                  {textOverlays.copilot.starterDesc2}
                </p>
                <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 w-full max-w-md text-left text-xs text-slate-600 shadow-sm space-y-1.5">
                  <p className="font-mono text-[11px] text-indigo-700 uppercase font-bold tracking-wider">
                    {textOverlays.copilot.exploreTitle}
                  </p>
                  {textOverlays.copilot.exploreList.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center py-12 space-y-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                  <Bot
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600"
                    size={18}
                  />
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {textOverlays.copilot.loadingAnalytics}
                </p>
              </div>
            )}

            {response && !loading && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2">
                    <Sparkles size={14} />
                    <span>{textOverlays.copilot.reportHeader}</span>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
                    <Markdown>{response.summary}</Markdown>
                  </div>
                </div>

                {response.findings.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-1">
                      {textOverlays.copilot.takeawaysHeader}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {response.findings.map((finding, idx) => {
                        const cardTone =
                          finding.impact === "High"
                            ? colors.copilot.findingHigh
                            : finding.impact === "Medium"
                              ? colors.copilot.findingMedium
                              : colors.copilot.findingNeutral;
                        const badgeTone =
                          finding.impact === "High"
                            ? colors.copilot.impactHighBadge
                            : finding.impact === "Medium"
                              ? colors.copilot.impactMediumBadge
                              : colors.copilot.impactNeutralBadge;
                        const metricTone =
                          finding.impact === "High"
                            ? colors.copilot.metricHigh
                            : finding.impact === "Medium"
                              ? colors.copilot.metricMedium
                              : colors.copilot.metricNeutral;

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border text-xs flex flex-col justify-between ${cardTone}`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-bold text-sm text-slate-900">
                                  {finding.title}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-mono rounded-full border font-semibold shrink-0 ${badgeTone}`}
                                >
                                  {finding.impact} Impact
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {finding.description}
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between font-mono text-[11px]">
                              <span className="text-slate-400">
                                Quantified Metric
                              </span>
                              <span className={`font-bold ${metricTone}`}>
                                {finding.metric}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowThoughts((v) => !v)}
                    className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-mono font-semibold">
                      <Cpu size={14} className="text-indigo-600" />
                      {showThoughts
                        ? textOverlays.copilot.thoughtsToggleCollapse
                        : textOverlays.copilot.thoughtsToggleExpand}
                    </span>
                    <ChevronRight
                      size={14}
                      className={`transition-transform ${
                        showThoughts ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  {showThoughts && (
                    <div className="p-4 border-t border-slate-100 text-xs text-slate-600 font-mono bg-slate-50/70 space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Terminal size={12} />
                        <span>{textOverlays.copilot.thoughtsHeader}</span>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {response.agentThoughts}
                      </p>
                    </div>
                  )}
                </div>

                {response.suggestedPrompts.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                      {textOverlays.copilot.suggestedTitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {response.suggestedPrompts.map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAnalyze(prompt)}
                          className="text-xs px-3 py-1.5 bg-white hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-full flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                        >
                          <Activity size={12} />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="mt-4 pt-3 border-t border-slate-200 flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
              placeholder={textOverlays.copilot.inputPlaceholder}
              aria-label={textOverlays.copilot.inputPlaceholder}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !query.trim()}
            >
              <Send size={15} />
              <span>{textOverlays.copilot.sendButton}</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
