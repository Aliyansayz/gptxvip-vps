import React from 'react';
import { motion } from 'motion/react';

export const SingleAgentVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Autonomous Problem Solver'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Brain */}
                    <circle cx="100" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="100" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    {/* Tools */}
                    <circle cx="30" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="30" y="52" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">API</text>

                    <circle cx="170" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="170" y="32" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">DB</text>
                    
                    <circle cx="170" cy="70" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="170" y="72" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">WEB</text>

                    {/* Connections */}
                    <path d="M 42 50 L 75 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 158 30 L 122 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 158 70 L 122 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Activity Orbits */}
                    <motion.circle cx="42" cy="50" r="2" fill="currentColor" className="text-indigo-400"
                        animate={{ cx: [75, 42, 75] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="158" cy="30" r="2" fill="currentColor" className="text-indigo-400"
                        animate={{ cx: [122, 158, 122], cy: [40, 30, 40] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A single model autonomously utilizing tools.
                </p>
            </div>
        );
};
