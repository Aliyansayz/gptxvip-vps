import React, { useMemo } from 'react';

export const CellularToxicityVisual: React.FC = () => {
    // Dynamic generation of ROS particles using useMemo
    const rosParticles = useMemo(() => {
        return Array.from({length: 8}).map((_, i) => ({
            id: i,
            cx: 50 + Math.cos(i * 0.8) * (12 + Math.random() * 5),
            cy: 25 + Math.sin(i * 0.8) * (12 + Math.random() * 5),
            delay: i * 0.2
        }));
    }, []);

    return (
        <div className="relative w-full aspect-video bg-slate-50 dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-900 p-4 flex flex-col overflow-hidden">
            <h3 className="text-slate-700 dark:text-blue-300 text-xs font-bold mb-2 uppercase tracking-wider">Cellular Toxicity (Oxidative Stress)</h3>
            <svg viewBox="0 0 100 50" className="w-full h-full">
                {/* Cell Membrane */}
                <circle cx="50" cy="25" r="20" fill="currentColor" className="text-slate-200 dark:text-blue-900" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1" style={{transformOrigin: '50px 25px'}} />
                {/* Nucleus */}
                <circle cx="50" cy="25" r="6" fill="currentColor" className="text-slate-300 dark:text-blue-800" stroke="currentColor" strokeWidth="0.5" />
                
                {/* Free Radicals (ROS) */}
                {rosParticles.map((p) => (
                    <g key={p.id} className="animate-bounce" style={{animationDelay: `${p.delay}s`}}>
                        <circle cx={p.cx} cy={p.cy} r="1" fill="#ef4444" />
                        <text x={p.cx + 1.5} y={p.cy + 0.5} fontSize="2" fill="#ef4444">O2•-</text>
                    </g>
                ))}
                
                {/* Antioxidant Defense */}
                <path d="M 25 25 L 30 25 M 70 25 L 75 25" stroke="#22c55e" strokeWidth="1" className="opacity-50" />
                <text x="50" y="48" fontSize="3" fill="currentColor" className="text-slate-500 dark:text-blue-400" textAnchor="middle">ROS overwhelming antioxidant defenses</text>
            </svg>
        </div>
    );
};
