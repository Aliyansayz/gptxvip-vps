import React from "react";
import { Target } from "lucide-react";
import { MultiTradeCandlestickWidget } from "../finhub/tradeTopic/MultiTradeCandlestickWidget";
import { OHLCData } from "../types";
import { StoryBlock } from "../finhub/documentationTopics/StoryBlock";
import { CodeSnippetViewer } from "../finhub/documentationTopics/CodeSnippetViewer";
import { multipleTradeSnippets } from "../constants";

interface MultipleTradeViewProps {
  candlestickData: OHLCData[];
}

export const MultipleTradeView: React.FC<MultipleTradeViewProps> = ({
  candlestickData,
}) => {
  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
          Multiple Trades Execution
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Advanced multi-threaded execution where the algorithm manages complex
          risk-reward ratios across multiple price targets and stop-loss levels.
        </p>
      </div>

      <div id="multi-flow" className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
            Multi-Asset Execution Engine
          </span>
        </div>
        <MultiTradeCandlestickWidget
          title="Mean Reversion Strategy B-4 (Multiple Trades)"
          data={candlestickData}
          trades={[
            {
              id: "T1",
              label: "Trade 1 (Take Profit Based)",
              entryPrice: 100.5,
              initialSL: 98.5,
              tp1: 104.5,
              color: "#3b82f6", // blue
            },
            {
              id: "T2",
              label: "Trade 2 (Indicator Based Exit)",
              entryPrice: 99.5,
              initialSL: 97.5,
              tp1: 105.5,
              color: "#8b5cf6", // purple
            },
            {
              id: "T3",
              label: "Trade 3 (Time Based Exit)",
              entryPrice: 98.0,
              initialSL: 96.0,
              tp1: 107.0,
              color: "#f59e0b", // amber
            },
          ]}
        />
      </div>

      <StoryBlock />

      <div id="multi-code" className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Implementation Logic</h3>
        </div>
        <CodeSnippetViewer snippets={multipleTradeSnippets} />
      </div>

      <div className="p-4 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors duration-300">
        <p className="text-xs text-zinc-600 dark:text-zinc-500 leading-relaxed">
          <span className="text-zinc-900 dark:text-zinc-300 font-bold">
            Concept:
          </span>{" "}
          This visualization represents a more sophisticated engine that can
          scale in and out of positions. It handles "soft" and "hard" stops
          simultaneously, allowing for nuanced capital preservation.
        </p>
      </div>
    </div>
  );
};
