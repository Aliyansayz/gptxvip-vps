import React from 'react';
import { motion } from 'motion/react';

export const ParallelFanoutVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Newsroom Spread'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Central dispatcher */}
                    <circle cx="40" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    
                    {/* Parallel nodes */}
                    <rect x="100" y="10" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <rect x="100" y="40" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <rect x="100" y="70" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    
                    {/* Aggregator */}
                    <circle cx="160" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />

                    {/* Fanout lines */}
                    <path d="M 50 45 L 100 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 50 50 L 100 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 50 55 L 100 80" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />

                    {/* Fan-in lines */}
                    <path d="M 120 20 L 155 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 120 50 L 150 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 120 80 L 155 55" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />

                    {/* Animated Fanout */}
                    <motion.circle cx="50" cy="45" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100], cy: [45, 20] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="50" cy="50" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="50" cy="55" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100], cy: [55, 80] }} transition={{ duration: 1, repeat: Infinity }} />

                    {/* Animated Fan-in */}
                    <motion.circle cx="120" cy="20" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 155], cy: [20, 45] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                    <motion.circle cx="120" cy="50" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 150] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                    <motion.circle cx="120" cy="80" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 155], cy: [80, 55] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Executing independent tasks concurrently and aggregating results.
                </p>
            </div>
        );
};
