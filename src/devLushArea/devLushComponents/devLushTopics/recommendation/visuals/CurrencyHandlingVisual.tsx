import React from 'react';
import { motion } from 'motion/react';

export const CurrencyHandlingVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'Counting Every Penny'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <text x="100" y="40" fontSize="12" textAnchor="middle" className="fill-red-500 font-mono">0.1 + 0.2 = 0.30000000000000004</text>
                <motion.line x1="20" y1="35" x2="180" y2="35" stroke="currentColor" strokeWidth="2" className="text-red-500" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
                <text x="100" y="70" fontSize="14" textAnchor="middle" className="fill-emerald-500 font-bold font-mono">10¢ + 20¢ = 30¢</text>
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Avoiding floating point errors by using integer base units.
            </p>
        </div>
    );
};
