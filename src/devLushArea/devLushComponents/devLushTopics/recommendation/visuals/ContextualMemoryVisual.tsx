import React from 'react';
import { motion } from 'motion/react';

export const ContextualMemoryVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Local Bookstore Owner'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <rect x="50" y="20" width="100" height="60" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                <circle cx="100" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                <path d="M 80 50 Q 100 20 120 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-indigo-400" />
                <motion.circle cx="80" cy="50" r="3" fill="currentColor" className="text-emerald-500" animate={{ cx: [80, 120, 80] }} transition={{ duration: 2, repeat: Infinity }} />
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Remembering past purchases while adapting to current emotional context.
            </p>
        </div>
    );
};
