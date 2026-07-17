import React from 'react';
import { motion } from 'motion/react';

export const HandoffsVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Relay Race'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agents */}
                    <rect x="20" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="40" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT 1</text>
                    
                    <rect x="140" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <text x="160" y="53" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">AGENT 2</text>

                    {/* Baton Passing */}
                    <path d="M 60 50 L 140 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    
                    <motion.rect x="90" y="45" width="20" height="10" rx="2" fill="currentColor" className="text-amber-500"
                        animate={{ x: [60, 120] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    <motion.text x="100" y="53" fontSize="6" textAnchor="middle" className="fill-white font-bold"
                        animate={{ x: [70, 130] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>CTX</motion.text>
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Passing control and full context memory to the next specialist.
                </p>
            </div>
        );
};
