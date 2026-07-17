import React from 'react';
import { motion } from 'motion/react';

export const HumanInTheLoopVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Manager’s Approval'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Pipeline */}
                    <rect x="20" y="40" width="40" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="40" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    <rect x="140" y="40" width="40" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="160" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">PROCEED</text>

                    {/* Human Gate */}
                    <circle cx="100" cy="50" r="15" fill="currentColor" className="text-amber-500/20" stroke="currentColor" strokeWidth="2" />
                    <text x="100" y="53" fontSize="8" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 font-bold">HUMAN</text>

                    {/* Lines */}
                    <path d="M 60 50 L 85 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 115 50 L 140 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Packet pausing and proceeding */}
                    <motion.circle cx="20" cy="50" r="4" fill="currentColor" className="text-purple-500"
                        animate={{ cx: [20, 60, 85, 85, 115, 140, 180] }} 
                        transition={{ duration: 4, times: [0, 0.2, 0.3, 0.7, 0.8, 0.9, 1], repeat: Infinity }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Agent pauses execution until human oversight grants permission.
                </p>
            </div>
        );
};
