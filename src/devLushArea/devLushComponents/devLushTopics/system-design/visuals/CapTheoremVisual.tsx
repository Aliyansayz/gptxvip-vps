import React from 'react';
import { Building2 } from 'lucide-react';

export const CapTheoremVisual: React.FC = () => {
    return (
        <div className="my-4 p-5 bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
            <div className="flex items-center gap-2 mb-3">
                <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <Building2 className="w-4 h-4" />
                </span>
                <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                    Concept: CAP Theorem & Network Partitions
                </h5>
            </div>
            
            <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 150" className="w-full h-full max-w-lg mx-auto">
                    {/* Branch A */}
                    <rect x="50" y="40" width="80" height="70" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="90" y="60" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">BRANCH A</text>
                    <text x="90" y="80" fill="#e2e8f0" fontSize="8" textAnchor="middle">Bal: $100</text>
                    <circle cx="50" cy="100" r="6" fill="#cbd5e1" />
                    <text x="50" y="115" fill="#94a3b8" fontSize="6" textAnchor="middle">Withdraw $100</text>

                    {/* Branch B */}
                    <rect x="270" y="40" width="80" height="70" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="310" y="60" fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="bold">BRANCH B</text>
                    <text x="310" y="80" fill="#e2e8f0" fontSize="8" textAnchor="middle">Bal: $100</text>
                    <circle cx="350" cy="100" r="6" fill="#cbd5e1" />
                    <text x="350" y="115" fill="#94a3b8" fontSize="6" textAnchor="middle">Withdraw $100</text>

                    {/* Phone Line / Network Partition */}
                    <path d="M 140 75 L 260 75" stroke="#ef4444" strokeWidth="2" strokeDasharray="5 5" />
                    <path d="M 190 60 L 210 90" stroke="#ef4444" strokeWidth="4" />
                    <path d="M 210 60 L 190 90" stroke="#ef4444" strokeWidth="4" />
                    <text x="200" y="50" fill="#f87171" fontSize="8" textAnchor="middle" fontWeight="bold">NETWORK PARTITION</text>

                    <rect x="140" y="120" width="120" height="20" fill="#450a0a" stroke="#f87171" strokeWidth="1" />
                    <text x="200" y="132" fill="#fca5a5" fontSize="7" textAnchor="middle">Wait (Consistency) OR Overdraw (Availability)</text>
                </svg>
            </div>
        </div>
    );
};
