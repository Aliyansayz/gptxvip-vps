import React from 'react';
import { motion } from 'motion/react';

export const OrchestratorVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Factory Foreman'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Foreman (Orchestrator) */}
                    <rect x="80" y="10" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="100" y="23" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">MASTER</text>

                    {/* Workers */}
                    <rect x="20" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                    <rect x="85" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                    <rect x="150" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />

                    {/* Delegation Lines */}
                    <path d="M 100 30 L 100 45 L 35 45 L 35 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 100 30 L 100 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 100 30 L 100 45 L 165 45 L 165 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Task Pulses */}
                    <motion.circle cx="35" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 35] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle cx="100" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 100] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="165" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 165] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A central intelligence delegating tasks to specialized workers.
                </p>
            </div>
        );
};
