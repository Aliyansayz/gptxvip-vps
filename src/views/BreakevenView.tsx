import React from "react";
import { Scissors, Target } from "lucide-react";
import { CandlestickChartWidget } from "../components/tradeTopic/CandlestickChartWidget";
import { OHLCData } from "../types";

interface BreakevenViewProps {
  candlestickData: OHLCData[];
}

export const BreakevenView: React.FC<BreakevenViewProps> = ({
  candlestickData,
}) => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
          <Scissors className="w-4 h-4" />
          Trade Management
        </div>
        <h1 className="mb-4">Breakeven & Partial Position Running</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
          Secure profits early and eliminate risk. This strategy involves
          closing a portion of your position at a predefined target (TP1) and
          moving the stop loss to your entry price.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div id="be-chart" className="xl:col-span-2 space-y-8">
          <CandlestickChartWidget
            data={candlestickData}
            entryPrice={100}
            initialSL={90}
            tp1={125}
          />
        </div>

        <div id="be-logic" className="space-y-6">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
            <h3 className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              The Logic
            </h3>
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <p>
                  <strong>Entry:</strong> A position is opened with a predefined
                  Initial Stop Loss to protect capital.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <p>
                  <strong>TP1 Hit:</strong> Price reaches the first Take Profit
                  level. 50% of the position is closed to secure guaranteed
                  profit.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <p>
                  <strong>Breakeven:</strong> The Stop Loss for the remaining
                  50% is immediately moved to the Entry Price. This creates a
                  "risk-free" trade.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  4
                </div>
                <p>
                  <strong>Runner:</strong> The remaining position is left to run
                  to capture larger trends, or stopped out at breakeven if the
                  trend reverses.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
