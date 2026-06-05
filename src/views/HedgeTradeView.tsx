import React from "react";
import { ShieldAlert } from "lucide-react";

export const HedgeTradeView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">HEDGE TRADE</h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Hedging involves taking an offsetting position in a related asset to reduce the risk of adverse price movements.
          This strategy is crucial for portfolio protection during volatile market conditions.
        </p>
      </div>

      <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Risk Mitigation
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400">
              Protecting downside exposure while maintaining upside potential.
            </p>
          </div>
        </div>
        
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p>
            A common hedging strategy involves using derivatives like options or futures. 
            For example, if you hold a long position in an asset, you might buy a put option 
            to limit your potential losses if the asset's price drops significantly.
          </p>
          <p>
            While hedging reduces risk, it also typically reduces potential profits, 
            as the cost of the hedge (like an option premium) must be factored into the overall return.
          </p>
        </div>
      </div>
    </div>
  );
};
