import React from 'react';
import { motion } from 'motion/react';

export const SwarmOrchestrationVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Fleet Dispatcher'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <rect x="20" y="20" width="160" height="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                <circle cx="100" cy="50" r="10" fill="currentColor" className="text-indigo-500" />
                {[0, 1, 2, 3].map(i => (
                    <motion.circle key={i} cx="40" cy="30" r="3" fill="currentColor" className="text-emerald-500" 
                        animate={{ cx: [40 + i*30, 160 - i*20, 40 + i*30], cy: [30 + i*10, 70 - i*15, 30 + i*10] }} 
                        transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }} />
                ))}
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Dynamically assigning tasks to optimize the swarm's efficiency.
            </p>
        </div>
    );
};
