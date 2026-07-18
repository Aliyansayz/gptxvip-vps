import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + '\n')

# RECOMMENDATION
rec_dir = '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/recommendation/visuals'

# 1. ContextualMemoryVisual
write_file(f'{rec_dir}/ContextualMemoryVisual.tsx', """
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
""")

# 2. PatternRecognitionVisual
write_file(f'{rec_dir}/PatternRecognitionVisual.tsx', """
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
""")

# 3. CurrencyHandlingVisual
write_file(f'{rec_dir}/CurrencyHandlingVisual.tsx', """
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
""")

# 4. SemanticMemoryVisual
write_file(f'{rec_dir}/SemanticMemoryVisual.tsx', """
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
""")

# index.ts for recommendation
write_file(f'{rec_dir}/index.ts', """
export * from './ContextualMemoryVisual';
export * from './PatternRecognitionVisual';
export * from './CurrencyHandlingVisual';
export * from './SemanticMemoryVisual';
""")


# SUPPLY CHAIN
sc_dir = '/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics/supplychain/visuals'

# 1. PredictiveDemandVisual
write_file(f'{sc_dir}/PredictiveDemandVisual.tsx', """
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
""")

# 2. GlobalFleetVisual
write_file(f'{sc_dir}/GlobalFleetVisual.tsx', """
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
""")

# 3. RiskSurveillanceVisual
write_file(f'{sc_dir}/RiskSurveillanceVisual.tsx', """
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
""")

# 4. SwarmOrchestrationVisual
write_file(f'{sc_dir}/SwarmOrchestrationVisual.tsx', """
import React from 'react';
import { motion } from 'motion/react';

export const SwarmOrchestrationVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                Analogy: {analogyName || 'The Fleet Dispatcher'}
            </h5>
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                <rect x="20" y="20" width="160" height="60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                <circle cx="100" cy="50" r="10" fill="currentColor" className="text-indigo-500" />
                {[0, 1, 2, 3].map(i => (
                    <motion.circle key={i} cx="40" cy="30" r="3" fill="currentColor" className="text-emerald-500" 
                        animate={{ cx: [40 + i*30, 160 - i*20, 40 + i*30], cy: [30 + i*10, 70 - i*15, 30 + i*10] }} 
                        transition={{ duration: 4 + i, repeat: Infinity, ease: "linear" }} />
                ))}
            </svg>
            <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                Dynamically assigning tasks to optimize the swarm's efficiency.
            </p>
        </div>
    );
};
""")

# index.ts for supplychain
write_file(f'{sc_dir}/index.ts', """
export * from './PredictiveDemandVisual';
export * from './GlobalFleetVisual';
export * from './RiskSurveillanceVisual';
export * from './SwarmOrchestrationVisual';
""")

print("Done creating visual components.")
