import React from 'react';

export const ChromatogramVisual: React.FC = () => {
    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">GC-MS Chromatogram</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                <line x1="10" y1="40" x2="90" y2="40" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <line x1="10" y1="40" x2="10" y2="10" stroke="currentColor" className="text-slate-400 dark:text-blue-700" strokeWidth="0.5" />
                <text x="50" y="46" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Retention Time (min)</text>
                <text x="5" y="25" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle" transform="rotate(-90, 5, 25)">Abundance</text>
                
                {/* Peaks */}
                <path d="M 10 40 L 25 40 L 30 15 L 35 40 L 60 40 L 65 25 L 70 40 L 90 40" fill="none" stroke="#10b981" strokeWidth="1" />
                <text x="30" y="12" fontSize="3" fill="#10b981" textAnchor="middle">Parent Drug</text>
                <text x="65" y="22" fontSize="3" fill="#10b981" textAnchor="middle">Metabolite</text>
                
                {/* Scanning line */}
                <line x1="10" y1="10" x2="10" y2="40" stroke="#ef4444" strokeWidth="0.5" className="animate-[slideRight_4s_linear_infinite]" />
                <style>{`
                    @keyframes slideRight {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(80px); }
                    }
                `}</style>
            </svg>
        </div>
    );
};
