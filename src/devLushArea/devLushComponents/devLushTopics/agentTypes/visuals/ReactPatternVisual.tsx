import React from 'react';
import { motion } from 'motion/react';

export const ReactPatternVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Detective Loop'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Nodes */}
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-purple-500 font-bold">THINK</text>

                    <rect x="130" y="20" width="30" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <text x="145" y="33" fontSize="8" textAnchor="middle" className="fill-amber-500 font-bold">ACT</text>

                    <rect x="130" y="60" width="30" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <text x="145" y="73" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">OBSERVE</text>

                    {/* Connecting lines */}
                    <path d="M 60 40 L 130 30" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 145 40 L 145 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 130 70 L 60 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Animated loop packet */}
                    <motion.circle cx="60" cy="40" r="3" fill="currentColor" className="text-purple-400"
                        animate={{ 
                            cx: [60, 130, 145, 145, 130, 60], 
                            cy: [40, 30, 30, 60, 70, 60] 
                        }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Interleaving reasoning and environmental interaction.
                </p>
            </div>
        );
};
