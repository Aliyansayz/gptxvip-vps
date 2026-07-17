import React from 'react';
import { motion } from 'motion/react';

export const MemoryArchitecturesVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Librarian'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Brain */}
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    {/* Vector DB / Library */}
                    <path d="M 130 30 L 170 30 L 170 70 L 130 70 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <path d="M 130 40 L 170 40 M 130 50 L 170 50 M 130 60 L 170 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500/50" />
                    <text x="150" y="25" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">VECTOR DB</text>

                    {/* Query & Retrieve */}
                    <path d="M 70 45 L 125 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 125 55 L 70 55" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <motion.circle cx="70" cy="45" r="2" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [70, 125] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="125" cy="55" r="3" fill="currentColor" className="text-emerald-400"
                        animate={{ cx: [125, 70] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Retrieving vast semantic context to inject into short-term reasoning.
                </p>
            </div>
        );
};
