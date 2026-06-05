import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { TermDefinition } from "../../types";
import { 
  SpreadOscillationDiagram, 
  CorrelationScatterPlots, 
  StochasticOscillatorZones, 
  TopDownTimeframeAnalysis, 
  LimitOrderInOrderBook, 
  NetworkLatencyTopology, 
  LiquidityConsumptionLevel2, 
  MarketRegimeSegmentation, 
  HedgingBalance 
} from "../keyTermsDictionary/visuals";
import {
  ImpliedVolatilityExpansion,
  VolatilitySmileCurve,
  AverageTrueRangeIndicator
} from "../keyTermsVolatility/visuals";

interface TermCardProps {
  term: TermDefinition;
}

const visualComponentMap: Record<string, React.FC> = {
  // Dictionary Terms
  "cointegration": SpreadOscillationDiagram,
  "correlation": CorrelationScatterPlots,
  "stochastic-momentum": StochasticOscillatorZones,
  "multi-timeframe": TopDownTimeframeAnalysis,
  "filled-unfilled": LimitOrderInOrderBook,
  "floor-latency": NetworkLatencyTopology,
  "market-microstructure": LiquidityConsumptionLevel2,
  "regime-detection": MarketRegimeSegmentation,
  "hedging": HedgingBalance,
  
  // Volatility Terms
  "implied-volatility": ImpliedVolatilityExpansion,
  "volatility-smile": VolatilitySmileCurve,
  "average-true-range": AverageTrueRangeIndicator
};

export const TermCard: React.FC<TermCardProps> = ({ term }) => {
  const ActiveVisual = visualComponentMap[term.id];

  return (
    <article className="relative pl-8 md:pl-0">
      {/* Timeline line for desktop */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800" />
      
      <div className="md:pl-12 relative">
        {/* Timeline dot */}
        <div className="hidden md:block absolute left-[-5px] top-3 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-zinc-950" />
        
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {term.term}
          </h2>
          {term.subheading && (
            <h3 className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
              {term.subheading}
            </h3>
          )}
        </header>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
            {term.definition}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {term.points && term.points.length > 0 && (
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
                  Key Characteristics
                </h4>
                <ul className="space-y-3 list-none p-0 m-0">
                  {term.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-zinc-600 dark:text-zinc-400 p-0 m-0">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {term.example && (
              <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  Real-World Example
                </h4>
                <p className="text-zinc-700 dark:text-zinc-300 italic m-0">
                  "{term.example}"
                </p>
              </div>
            )}
          </div>

          {/* Visual Context Element */}
          {term.visualContext && ActiveVisual && (
            <div className="mt-8 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/80 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Visual Context: {term.visualContext.description}
                </span>
              </div>
              <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center">
                <div className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-zinc-800/50">
                   <ActiveVisual />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
