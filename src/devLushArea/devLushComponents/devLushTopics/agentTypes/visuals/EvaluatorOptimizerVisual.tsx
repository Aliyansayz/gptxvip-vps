import React from 'react';
import { motion } from 'motion/react';

export const EvaluatorOptimizerVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Editor and Writer'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Generator */}
                    <rect x="30" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-blue-500 font-bold">GENERATE</text>

                    {/* Evaluator */}
                    <rect x="130" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
                    <text x="150" y="53" fontSize="8" textAnchor="middle" className="fill-rose-500 font-bold">CRITIQUE</text>

                    {/* Forward Draft */}
                    <path d="M 70 45 L 130 45" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    {/* Feedback loop */}
                    <path d="M 130 55 L 70 55" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Data packets */}
                    <motion.circle cx="70" cy="45" r="3" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [70, 130, 130] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="130" cy="55" r="3" fill="currentColor" className="text-rose-400"
                        animate={{ cx: [130, 70, 70] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75, ease: "easeInOut" }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A generator refines outputs based on strict evaluation.
                </p>
            </div>
        );
};
