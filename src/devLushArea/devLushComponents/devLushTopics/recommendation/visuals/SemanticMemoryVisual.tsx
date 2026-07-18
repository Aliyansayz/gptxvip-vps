import React from 'react';
import { motion } from 'motion/react';

export const SemanticMemoryVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'Closest Points on a Map'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <circle cx="100" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                <circle cx="100" cy="50" r="4" fill="currentColor" className="text-indigo-500" />
                <motion.circle cx="120" cy="40" r="3" fill="currentColor" className="text-emerald-500" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                <circle cx="70" cy="80" r="3" fill="currentColor" className="text-slate-400" />
                <circle cx="150" cy="70" r="3" fill="currentColor" className="text-slate-400" />
                <path d="M 100 50 L 120 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-400" />
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Finding the closest mathematical distance in vector space.
            </p>
        </div>
    );
};
