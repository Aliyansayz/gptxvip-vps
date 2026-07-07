import React from "react";
import { Shield } from "lucide-react";
import { CandlestickChartWidget } from "../components/tradeTopic/CandlestickChartWidget";
import { OHLCData } from "../types";
import { CodeSnippetViewer } from "../components/documentationTopics/CodeSnippetViewer";
import { singleTradeSnippets } from "../constants";

interface SingleTradeViewProps {
  candlestickData: OHLCData[];
}

export const SingleTradeView: React.FC<SingleTradeViewProps> = ({
  candlestickData,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">ONE TRADE AT A TIME</h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
          The simplest form of algorithmic execution. The system focuses on a
          single asset, managing a binary risk profile with a hard stop-loss.
          Here, we demonstrate this logic using a Silver (XAG/USD) trading example.
        </p>
      </div>

      <div id="single-flow" className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
          <Shield className="w-4 h-4 text-red-500" />
          <span className="text-xs font-mono uppercase tracking-widest">
            Single Asset Risk Profile: Silver (XAG/USD)
          </span>
        </div>

        <div className="mt-4">
          <CandlestickChartWidget 
            title="Silver (XAG/USD) - Momentum Strategy A-1"
            data={candlestickData} 
            entryPrice={25.50}
            initialSL={25.20}
            tp1={26.00}
          />
        </div>

        <div id="single-code">
          <CodeSnippetViewer snippets={singleTradeSnippets} />
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors duration-300">
          <p className="text-xs text-zinc-600 dark:text-zinc-500 leading-relaxed">
            <span className="text-zinc-900 dark:text-zinc-300 font-bold">
              Concept:
            </span>{" "}
            In this mode, the algorithm is dedicated to one execution thread.
            This minimizes computational overhead and ensures maximum focus on
            the price action of a single instrument, such as Silver (XAG/USD). 
            The dynamic chart above illustrates the entry, stop-loss, and take-profit levels.
          </p>
        </div>
      </div>
    </div>
  );
};
