import React from 'react';
import { motion } from 'motion/react';

export const SpreadOscillationDiagram = () => {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col pt-4 px-4 bg-zinc-900 rounded-xl relative overflow-hidden">
        {/* SVG for Asset A and Asset B over time */}
        <div className="flex-1 relative border-b border-zinc-700/50 pb-2 mb-2 min-h-[150px]">
            <span className="absolute top-2 left-2 text-xs font-semibold text-zinc-400">Price (Asset A vs B)</span>
            <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
               <motion.path 
                 d="M 0 50 Q 50 20, 100 40 T 200 60 T 300 30 T 400 40" 
                 fill="none" 
                 stroke="#3b82f6" 
                 strokeWidth="3" 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
               />
               <motion.path 
                 d="M 0 55 Q 50 80, 100 35 T 200 65 T 300 40 T 400 45" 
                 fill="none" 
                 stroke="#10b981" 
                 strokeWidth="3" 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
               />
            </svg>
        </div>
        <div className="h-[80px] relative mt-2">
            <span className="absolute top-1 left-2 text-xs font-semibold text-zinc-400">Spread (Stationary Zero Mean)</span>
            {/* The spread (difference) oscillating around zero */}
            <svg viewBox="0 0 400 60" className="w-full h-full" preserveAspectRatio="none">
               {/* Zero mean line */}
               <line x1="0" y1="30" x2="400" y2="30" stroke="#52525b" strokeDasharray="4 4" strokeWidth="1" />
               <motion.path 
                 d="M 0 35 Q 50 60, 100 25 T 200 35 T 300 20 T 400 35" 
                 fill="none" 
                 stroke="#a855f7" 
                 strokeWidth="2" 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
               />
            </svg>
        </div>
    </div>
  );
};
