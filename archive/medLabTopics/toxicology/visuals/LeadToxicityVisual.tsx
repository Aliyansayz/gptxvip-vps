import React, { useMemo } from 'react';

export const LeadToxicityVisual: React.FC = () => {
    // Dynamic generation of Basophilic Stippling using useMemo
    const stipplingParticles = useMemo(() => {
        return Array.from({length: 35}).map((_, i) => ({
            id: i,
            cx: 75 + (Math.random() - 0.5) * 16,
            cy: 25 + (Math.random() - 0.5) * 16,
            r: 0.3 + Math.random() * 0.5
        }));
    }, []);

    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">Lead Toxicity (Blood Smear)</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full">
                {/* Normal RBC */}
                <circle cx="25" cy="25" r="12" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.5" />
                <circle cx="25" cy="25" r="4" fill="#fee2e2" opacity="0.5" />
                <text x="25" y="42" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Normal RBC</text>
                
                {/* Lead Poisoned RBC */}
                <circle cx="75" cy="25" r="12" fill="#fca5a5" stroke="#ef4444" strokeWidth="0.5" />
                <circle cx="75" cy="25" r="4" fill="#fee2e2" opacity="0.5" />
                
                {/* Basophilic Stippling (Lead Poisoning) */}
                {stipplingParticles.map((p) => (
                    <circle key={p.id} cx={p.cx} cy={p.cy} r={p.r} fill="#1e3a8a" />
                ))}
                <text x="75" y="42" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">Basophilic Stippling</text>
            </svg>
        </div>
    );
};
