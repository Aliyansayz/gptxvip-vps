import React from 'react';
import { motion } from 'motion/react';

export const RiskSurveillanceVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Global Financial Analyst'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <rect x="40" y="30" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                <rect x="80" y="30" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
                <rect x="120" y="30" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                <motion.circle cx="90" cy="40" r="4" fill="currentColor" className="text-rose-500" animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
                <path d="M 90 60 L 90 80 L 130 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500 stroke-dashed" />
                <rect x="130" y="70" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Processing unstructured global data to mitigate risk proactively.
            </p>
        </div>
    );
};
