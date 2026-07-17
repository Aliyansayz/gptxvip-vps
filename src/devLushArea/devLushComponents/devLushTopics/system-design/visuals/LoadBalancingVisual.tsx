import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export const LoadBalancingVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-sky-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-sky-100 dark:border-sky-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-sky-500/10 rounded-lg text-sky-600 dark:text-sky-400">
                    <Activity className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-wider">
                    Concept: Load Balancing Strategies
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Incoming Customers */}
                    <g transform="translate(20, 75)">
                        <circle cx="-10" cy="0" r="6" fill="#cbd5e1" />
                        <circle cx="-25" cy="0" r="6" fill="#cbd5e1" />
                        <circle cx="-40" cy="0" r="6" fill="#cbd5e1" />
                        <text x="-25" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle">REQUESTS</text>
                    </g>

                    {/* Load Balancer */}
                    <rect x="80" y="45" width="40" height="60" rx="8" fill="#0ea5e9" opacity="0.2" stroke="#0ea5e9" strokeWidth="2" />
                    <text x="100" y="78" fill="#7dd3fc" fontSize="8" textAnchor="middle" fontWeight="bold">LB</text>

                    {/* Line 1 (Checkout 1) */}
                    <rect x="250" y="10" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="290" y="22" fill="#e2e8f0" fontSize="8" textAnchor="middle">Checkout 1</text>
                    <circle cx="260" cy="28" r="4" fill="#ef4444" />
                    <circle cx="275" cy="28" r="4" fill="#ef4444" />
                    <circle cx="290" cy="28" r="4" fill="#ef4444" />
                    <circle cx="305" cy="28" r="4" fill="#ef4444" />

                    {/* Line 2 (Checkout 2) */}
                    <rect x="250" y="60" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="290" y="72" fill="#e2e8f0" fontSize="8" textAnchor="middle">Checkout 2</text>
                    <circle cx="260" cy="78" r="4" fill="#10b981" />

                    {/* Line 3 (Checkout 3) */}
                    <rect x="250" y="110" width="80" height="30" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <text x="290" y="122" fill="#e2e8f0" fontSize="8" textAnchor="middle">Checkout 3</text>
                    <circle cx="260" cy="128" r="4" fill="#f59e0b" />
                    <circle cx="275" cy="128" r="4" fill="#f59e0b" />

                    {/* Routing Path */}
                    <path d="M 130 75 L 240 75" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
                    <motion.circle r="4" fill="#38bdf8" animate={{ cx: [130, 240], cy: [75, 75] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    
                    <text x="180" y="65" fill="#38bdf8" fontSize="7" textAnchor="middle">LEAST CONNECTIONS</text>
                </svg>
            </div>
        </div>
    );
};
