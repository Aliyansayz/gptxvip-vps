import React from 'react';
import { motion } from 'motion/react';

export const SequentialChainingVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Assembly Line'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Nodes in a line */}
                    <circle cx="30" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <circle cx="100" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <circle cx="170" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />

                    {/* Connecting lines */}
                    <path d="M 40 50 L 90 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 110 50 L 160 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Animated packet traveling through chain */}
                    <motion.circle cx="10" cy="50" r="4" fill="currentColor" className="text-emerald-500"
                        animate={{ cx: [10, 30, 90, 100, 160, 170, 190] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Sequential processing where step B strictly waits for step A.
                </p>
            </div>
        );
};
