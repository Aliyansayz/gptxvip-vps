import React from 'react';
import { motion } from 'motion/react';

export const SpecialistTeamsVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Special Ops Team'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Hub */}
                    <circle cx="100" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                    <text x="100" y="53" fontSize="6" textAnchor="middle" className="fill-slate-500 font-bold">CONTEXT</text>

                    {/* Specialists */}
                    <rect x="20" y="20" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
                    <text x="35" y="30" fontSize="6" textAnchor="middle" className="fill-rose-500 font-bold">RED</text>
                    <path d="M 50 27 L 88 43" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <rect x="150" y="20" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    <text x="165" y="30" fontSize="6" textAnchor="middle" className="fill-blue-500 font-bold">BLUE</text>
                    <path d="M 150 27 L 112 43" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <rect x="85" y="80" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <text x="100" y="90" fontSize="6" textAnchor="middle" className="fill-amber-500 font-bold">GOLD</text>
                    <path d="M 100 80 L 100 65" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Pulses */}
                    <motion.circle cx="50" cy="27" r="2" fill="currentColor" className="text-rose-400"
                        animate={{ cx: [50, 88], cy: [27, 43] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="150" cy="27" r="2" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [150, 112], cy: [27, 43] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                    <motion.circle cx="100" cy="80" r="2" fill="currentColor" className="text-amber-400"
                        animate={{ cx: [100, 100], cy: [80, 65] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Experts contributing distinct skills to a shared goal.
                </p>
            </div>
        );
};
