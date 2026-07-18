import React from 'react';
import { motion } from 'motion/react';

export const PredictiveDemandVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Smart Thermostat'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <path d="M 20 80 Q 80 80 180 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 stroke-dashed" />
                <motion.circle cx="80" cy="80" r="4" fill="currentColor" className="text-indigo-500" animate={{ cx: [20, 180], cy: [80, 20] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                <rect x="150" y="40" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                <text x="165" y="53" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">PO</text>
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Integrating external data to proactively predict demand.
            </p>
        </div>
    );
};
