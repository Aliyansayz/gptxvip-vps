import React from 'react';
import { motion } from 'motion/react';
import { Database } from 'lucide-react';

export const DatabaseShardingVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-indigo-100 dark:border-indigo-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Database className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                    Concept: Database Sharding & Replication
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Main Library (Pre-sharding) */}
                    <g transform="translate(10, 50)" opacity="0.3">
                        <rect width="60" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                        <text x="30" y="35" fill="#64748b" fontSize="8" textAnchor="middle">ONE HUGE</text>
                        <text x="30" y="45" fill="#64748b" fontSize="8" textAnchor="middle">LIBRARY</text>
                    </g>

                    {/* Shard 1 */}
                    <g transform="translate(150, 10)">
                        <rect width="50" height="40" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                        <text x="25" y="15" fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="bold">SCI-FI</text>
                        <text x="25" y="25" fill="#4f46e5" fontSize="6" textAnchor="middle">Shard 1</text>
                        <path d="M 50 20 L 100 20" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" />
                    </g>

                    {/* Replica 1 */}
                    <g transform="translate(250, 10)">
                        <rect width="40" height="30" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
                        <text x="20" y="15" fill="#34d399" fontSize="6" textAnchor="middle">Warehouse</text>
                        <text x="20" y="22" fill="#10b981" fontSize="5" textAnchor="middle">(Replica)</text>
                    </g>

                    {/* Shard 2 */}
                    <g transform="translate(150, 60)">
                        <rect width="50" height="40" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                        <text x="25" y="15" fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="bold">HISTORY</text>
                        <text x="25" y="25" fill="#4f46e5" fontSize="6" textAnchor="middle">Shard 2</text>
                        <path d="M 50 20 L 100 20" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 4" />
                    </g>

                    {/* Replica 2 */}
                    <g transform="translate(250, 65)">
                        <rect width="40" height="30" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
                        <text x="20" y="15" fill="#34d399" fontSize="6" textAnchor="middle">Warehouse</text>
                    </g>

                    {/* Shard 3 */}
                    <g transform="translate(150, 110)">
                        <rect width="50" height="40" rx="4" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                        <text x="25" y="15" fill="#818cf8" fontSize="8" textAnchor="middle" fontWeight="bold">MYSTERY</text>
                        <text x="25" y="25" fill="#4f46e5" fontSize="6" textAnchor="middle">Shard 3</text>
                    </g>

                    {/* Connection lines */}
                    <path d="M 80 80 L 140 30" stroke="#64748b" strokeWidth="2" />
                    <path d="M 80 80 L 140 80" stroke="#64748b" strokeWidth="2" />
                    <path d="M 80 80 L 140 130" stroke="#64748b" strokeWidth="2" />
                    
                    {/* Books moving to shards */}
                    <motion.circle r="3" fill="#818cf8" animate={{ cx: [80, 140], cy: [80, 30] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle r="3" fill="#818cf8" animate={{ cx: [80, 140], cy: [80, 80] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                </svg>
            </div>
        </div>
    );
};
