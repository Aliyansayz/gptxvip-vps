import React, { useMemo } from 'react';

export const DoseResponseVisual: React.FC = () => {
    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">Dose-Response Curve</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                {/* Grid */}
                <line x1="10" y1="30" x2="90" y2="30" stroke="currentColor" className="text-slate-300 dark:text-blue-800" strokeWidth="0.2" strokeDasharray="1 1" />
                <line x1="10" y1="20" x2="90" y2="20" stroke="currentColor" className="text-slate-300 dark:text-blue-800" strokeWidth="0.2" strokeDasharray="1 1" />
                <line x1="10" y1="10" x2="90" y2="10" stroke="currentColor" className="text-slate-300 dark:text-blue-800" strokeWidth="0.2" strokeDasharray="1 1" />
                
                {/* Axes */}
                <line x1="10" y1="40" x2="90" y2="40" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <line x1="10" y1="40" x2="10" y2="10" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <text x="50" y="46" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Log Dose</text>
                <text x="5" y="25" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle" transform="rotate(-90, 5, 25)">Response %</text>
                
                {/* Sigmoidal Curve */}
                <path d="M 10 39 C 40 39, 40 11, 90 11" fill="none" stroke="#3b82f6" strokeWidth="1.5" className="animate-[dash_3s_ease-in-out_forwards]" strokeDasharray="100" strokeDashoffset="100" />
                
                {/* Markers */}
                <circle cx="50" cy="25" r="1.5" fill="#ef4444" className="animate-ping" style={{animationDelay: '1.5s'}} />
                <circle cx="50" cy="25" r="1.5" fill="#ef4444" className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_1.5s_forwards]" />
                <text x="50" y="21" fontSize="3" fill="#ef4444" textAnchor="middle" className="opacity-0 animate-[fadeIn_0.5s_ease-in-out_1.5s_forwards]">ED50</text>
                
                <style>{`
                    @keyframes dash { to { stroke-dashoffset: 0; } }
                    @keyframes fadeIn { to { opacity: 1; } }
                `}</style>
            </svg>
        </div>
    );
};
