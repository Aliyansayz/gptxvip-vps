import React from 'react';
import { motion } from 'motion/react';

export const MarqueeTicker: React.FC = () => {
  const content = (
    <div className="flex items-center gap-12 shrink-0">
      <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SYS.ONLINE</span>
      <span className="opacity-30">///</span>
      <span>LATENCY: 0.1ms</span>
      <span className="opacity-30">///</span>
      <span className="text-emerald-600 dark:text-emerald-400">C++ COMPILED</span>
      <span className="opacity-30">///</span>
      <span className="text-blue-600 dark:text-blue-400">PYTHON YAML WORKFLOW ACTIVATED</span>
      <span className="opacity-30">///</span>
      <span className="text-amber-600 dark:text-amber-400">TIME BASED EXIT</span>
      <span className="opacity-30">///</span>
      <span>LOB SYNC: COMPLETE</span>
      <span className="opacity-30">///</span>
      <span>RISK ENGINE: <span className="text-emerald-600 dark:text-emerald-500">NORMAL</span></span>
      <span className="opacity-30">///</span>
    </div>
  );

  return (
    <div className="w-full bg-slate-50/50 dark:bg-zinc-950 border-y border-zinc-200/50 dark:border-zinc-800/50 py-3 overflow-hidden flex font-mono text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 transition-colors">
      <motion.div
        className="flex shrink-0 gap-12 min-w-full z-0 will-change-transform"
        animate={{
          x: ['0%', '-50%'],
        }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  );
};
