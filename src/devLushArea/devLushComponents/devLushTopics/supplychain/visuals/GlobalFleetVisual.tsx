import React from 'react';
import { motion } from 'motion/react';

export const GlobalFleetVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Air Traffic Controller'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <circle cx="100" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                <circle cx="100" cy="50" r="2" fill="currentColor" className="text-indigo-500" />
                <motion.path d="M 100 50 L 130 20" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400" animate={{ opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.path d="M 100 50 L 70 80" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400" animate={{ opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                <motion.path d="M 100 50 L 140 70" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400" animate={{ opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
                <circle cx="130" cy="20" r="4" fill="currentColor" className="text-slate-500" />
                <circle cx="70" cy="80" r="4" fill="currentColor" className="text-slate-500" />
                <circle cx="140" cy="70" r="4" fill="currentColor" className="text-slate-500" />
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Orchestrating the entire fleet globally to optimize routing.
            </p>
        </div>
    );
};
