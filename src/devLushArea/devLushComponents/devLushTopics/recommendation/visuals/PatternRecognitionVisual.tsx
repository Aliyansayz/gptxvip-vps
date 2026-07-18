import React from 'react';
import { motion } from 'motion/react';

export const PatternRecognitionVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Financial Advisor'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <rect x="30" y="30" width="20" height="40" fill="currentColor" className="text-slate-400" />
                <rect x="60" y="50" width="20" height="20" fill="currentColor" className="text-slate-400" />
                <motion.rect x="90" y="20" width="20" height="50" fill="currentColor" className="text-rose-500" animate={{ y: [20, 10, 20] }} transition={{ duration: 2, repeat: Infinity }} />
                <rect x="120" y="40" width="20" height="30" fill="currentColor" className="text-slate-400" />
                <rect x="150" y="30" width="20" height="40" fill="currentColor" className="text-slate-400" />
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Spotting redundant or anomalous patterns in transaction history.
            </p>
        </div>
    );
};
