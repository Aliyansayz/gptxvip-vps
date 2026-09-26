import React, { useRef } from "react";
import { motion } from "motion/react";
import {
  Database,
  Activity,
  GitCompare,
  Calculator,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const PipelineFlowchartWidget: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const steps = [
    {
      id: 1,
      title: "Data Alignment",
      icon: <Database className="w-5 h-5 text-blue-500" />,
      desc: "Fetches historical close prices and aligns timestamps.",
      pass: "len(df) >= 100",
      fail: "Skipped (Not enough data)",
    },
    {
      id: 2,
      title: "Correlation Check",
      icon: <Activity className="w-5 h-5 text-indigo-500" />,
      desc: "Calculates Pearson correlation coefficient.",
      pass: "corr > 0.5",
      fail: "Skipped (Too weakly correlated)",
    },
    {
      id: 3,
      title: "Spread Calculation",
      icon: <Calculator className="w-5 h-5 text-cyan-500" />,
      desc: "Calculates the spread using hedge ratio from OLS.",
      pass: "Spread calculated",
      fail: "Skipped (OLS failed)",
    },
    {
      id: 4,
      title: "Stationarity Test",
      icon: <Activity className="w-5 h-5 text-orange-500" />,
      desc: "Runs Augmented Dickey-Fuller (ADF) test on spread.",
      pass: "ADF p-value < 0.05",
      fail: "Skipped (Non-stationary)",
    },
    {
      id: 5,
      title: "Cointegration Test",
      icon: <GitCompare className="w-5 h-5 text-purple-500" />,
      desc: "Runs Engle-Granger test on the spread.",
      pass: "p-value < 0.05",
      fail: "Skipped (Not cointegrated)",
    },
    {
      id: 6,
      title: "Half-Life Check",
      icon: <Calculator className="w-5 h-5 text-amber-500" />,
      desc: "Calculates Ornstein-Uhlenbeck half-life.",
      pass: "0 < half_life < 200",
      fail: "Skipped (Reverts too slowly/fast)",
    },
    {
      id: 7,
      title: "Hurst Exponent",
      icon: <Activity className="w-5 h-5 text-pink-500" />,
      desc: "Calculates Hurst exponent to confirm mean-reversion.",
      pass: "H < 0.5",
      fail: "Skipped (Trending/Random walk)",
    },
    {
      id: 8,
      title: "Final Sorting",
      icon: <Filter className="w-5 h-5 text-emerald-500" />,
      desc: "Sorts all passed pairs by lowest p-value.",
      pass: "Top pair selected",
      fail: "None",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 overflow-hidden relative group">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm m-0">Pair Evaluation Pipeline</h3>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={scrollLeft}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={scrollRight}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center min-w-[200px] w-[200px] shrink-0 snap-center relative group/step"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 shadow-sm border border-zinc-200 dark:border-zinc-700 group-hover/step:scale-110 transition-transform">
                {step.icon}
              </div>
              <h4 className="text-center mb-1">{step.title}</h4>
              <p className="text-[10px] text-center text-zinc-500 dark:text-zinc-400 mb-3 h-8">
                {step.desc}
              </p>

              <div className="w-full space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">{step.pass}</span>
                </div>
                {step.fail !== "None" && (
                  <div className="flex items-center gap-1.5 text-[10px] bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded border border-red-200 dark:border-red-500/20">
                    <XCircle className="w-3 h-3 shrink-0" />
                    <span className="truncate">{step.fail}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {index < steps.length - 1 && (
              <div className="flex items-center justify-center text-zinc-300 dark:text-zinc-700 shrink-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
