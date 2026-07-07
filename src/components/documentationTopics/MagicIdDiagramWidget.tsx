import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Lock, Unlock, Link as LinkIcon } from "lucide-react";

export const MagicIdDiagramWidget: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 overflow-hidden">
      <h3 className="text-sm mb-6">Magic ID Hedging Link</h3>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Entry Phase */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            1. Entry Trigger
          </div>

          <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30 font-bold">
              Z-Score &gt; 2.0
            </div>

            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-red-500">SELL</span>
                <span className="font-bold">EURUSD</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-emerald-500">
                  BUY
                </span>
                <span className="font-bold">GBPUSD</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Link */}
        <div className="flex flex-col items-center justify-center gap-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center text-purple-600 dark:text-purple-400"
          >
            <LinkIcon className="w-5 h-5" />
          </motion.div>
          <div className="bg-purple-500 text-white text-[10px] font-mono px-2 py-1 rounded shadow-sm">
            magic_id: 458912
          </div>
          <div className="text-[10px] text-zinc-500 text-center max-w-[120px]">
            Assigned to BOTH legs
          </div>
        </div>

        {/* Exit Phase */}
        <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            2. Exit Trigger
          </div>

          <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 font-bold">
              Z-Score &lt; 0.5
            </div>

            <div className="space-y-3 mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-zinc-500">CLOSE</span>
                <span className="font-bold">EURUSD</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-zinc-500">CLOSE</span>
                <span className="font-bold">GBPUSD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
