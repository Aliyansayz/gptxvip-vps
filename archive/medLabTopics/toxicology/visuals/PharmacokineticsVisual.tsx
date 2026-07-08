import React from 'react';

export const PharmacokineticsVisual: React.FC = () => {
    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">Pharmacokinetics (TDM)</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                <line x1="10" y1="40" x2="90" y2="40" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <line x1="10" y1="40" x2="10" y2="10" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <text x="50" y="46" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Time (hours)</text>
                <text x="5" y="25" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle" transform="rotate(-90, 5, 25)">Concentration</text>
                
                {/* Therapeutic Window */}
                <rect x="10" y="20" width="80" height="10" fill="#22c55e" fillOpacity="0.15" />
                <text x="88" y="25" fontSize="3" fill="#22c55e" textAnchor="end" alignmentBaseline="middle">Therapeutic Window</text>
                <line x1="10" y1="20" x2="90" y2="20" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="88" y="18" fontSize="3" fill="#ef4444" textAnchor="end">Toxic Level</text>
                
                {/* Concentration Curve */}
                <path d="M 10 40 Q 15 10, 30 25 T 50 22 T 70 28 T 90 25" fill="none" stroke="#3b82f6" strokeWidth="1" />
                
                {/* Dosing points */}
                <circle cx="10" cy="40" r="1" fill="#f59e0b" />
                <circle cx="30" cy="25" r="1" fill="#f59e0b" />
                <circle cx="50" cy="22" r="1" fill="#f59e0b" />
                <circle cx="70" cy="28" r="1" fill="#f59e0b" />
            </svg>
        </div>
    );
};
