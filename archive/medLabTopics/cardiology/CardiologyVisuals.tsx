import React from 'react';

interface VisualProps {
    title: string;
    analogy?: string;
}

export const CardiologyAnalogyVisual: React.FC<VisualProps> = ({ title, analogy }) => {
    const text = (title + " " + (analogy || "")).toLowerCase();

    // Helper to determine which visual to show
    const getVisualType = () => {
        if (text.includes('pressure') || text.includes('resistance') || text.includes('flow') || text.includes('hemodynamic')) return 'pipes';
        if (text.includes('electrical') || text.includes('conduction') || text.includes('arrhythmia') || text.includes('ecg') || text.includes('node')) return 'electrical';
        if (text.includes('valve') || text.includes('stenosis') || text.includes('regurgitation')) return 'valve';
        if (text.includes('pump') || text.includes('failure') || text.includes('output') || text.includes('contract')) return 'pump';
        if (text.includes('clot') || text.includes('infarction') || text.includes('blockage') || text.includes('plaque')) return 'blockage';
        if (text.includes('drug') || text.includes('blocker') || text.includes('receptor') || text.includes('medication')) return 'receptor';
        if (text.includes('enzyme') || text.includes('marker') || text.includes('troponin') || text.includes('lab') || text.includes('blood test')) return 'lab';
        return 'generic';
    };

    const type = getVisualType();

    const PipeVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: Garden Hose System</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Background */}
                <rect x="0" y="0" width="200" height="100" fill="none" />
                
                {/* Hose/Pipe */}
                <path d="M20 50 L 180 50" stroke="#3b82f6" strokeWidth="20" strokeLinecap="round" className="opacity-30" />
                <path d="M20 50 L 180 50" stroke="#60a5fa" strokeWidth="16" strokeLinecap="round" />
                
                {/* Water Flow Particles */}
                <circle cx="40" cy="50" r="3" fill="white" className="animate-ping" style={{animationDuration: '1s'}} />
                <circle cx="80" cy="50" r="3" fill="white" className="animate-ping" style={{animationDuration: '1.2s', animationDelay: '0.2s'}} />
                <circle cx="120" cy="50" r="3" fill="white" className="animate-ping" style={{animationDuration: '0.9s', animationDelay: '0.4s'}} />
                <circle cx="160" cy="50" r="3" fill="white" className="animate-ping" style={{animationDuration: '1.1s', animationDelay: '0.6s'}} />

                {/* Pressure Gauge */}
                <circle cx="100" cy="30" r="15" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
                <line x1="100" y1="30" x2="110" y2="20" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                <circle cx="100" cy="30" r="2" fill="#475569" />
                
                {/* Nozzle/Restriction */}
                <rect x="160" y="40" width="10" height="20" fill="#475569" />
                
                <text x="100" y="85" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Pressure = Flow × Resistance</text>
            </svg>
        </div>
    );

    const ElectricalVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: House Wiring</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Circuit Lines */}
                <path d="M20 50 H 50 V 20 H 150 V 50 H 180" stroke="#f59e0b" strokeWidth="2" fill="none" />
                <path d="M50 50 V 80 H 150 V 50" stroke="#f59e0b" strokeWidth="2" fill="none" />

                {/* Battery/Source (SA Node) */}
                <rect x="40" y="40" width="20" height="20" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">SA</text>

                {/* Relay/Switch (AV Node) */}
                <rect x="140" y="40" width="20" height="20" rx="4" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
                <text x="150" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">AV</text>

                {/* Light Bulb (Muscle Contraction) */}
                <circle cx="100" cy="20" r="10" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
                <path d="M95 20 L 100 15 L 105 20" stroke="#f59e0b" strokeWidth="1" fill="none" />
                
                {/* Sparks/Signal */}
                <circle cx="70" cy="20" r="2" fill="#ef4444" className="animate-pulse" />
                <circle cx="130" cy="20" r="2" fill="#ef4444" className="animate-pulse" style={{animationDelay: '0.5s'}} />

                <text x="100" y="90" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Electrical Impulse Conduction</text>
            </svg>
        </div>
    );

    const PumpVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: Water Pump</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Pipes */}
                <path d="M20 50 H 60" stroke="#94a3b8" strokeWidth="12" />
                <path d="M140 50 H 180" stroke="#94a3b8" strokeWidth="12" />

                {/* Pump Body */}
                <circle cx="100" cy="50" r="30" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
                
                {/* Piston/Impeller */}
                <rect x="85" y="35" width="30" height="30" rx="2" fill="#fee2e2" className="animate-pulse" style={{transformOrigin: 'center', animationDuration: '0.8s'}} />
                
                {/* Valves */}
                <line x1="60" y1="40" x2="60" y2="60" stroke="#1e293b" strokeWidth="4" />
                <line x1="140" y1="40" x2="140" y2="60" stroke="#1e293b" strokeWidth="4" />

                {/* Flow Arrows */}
                <path d="M30 40 L 40 50 L 30 60" stroke="white" strokeWidth="2" fill="none" />
                <path d="M160 40 L 170 50 L 160 60" stroke="white" strokeWidth="2" fill="none" />

                <text x="100" y="95" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Mechanical Pumping Action</text>
            </svg>
        </div>
    );

    const ValveVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: One-Way Door</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Corridor */}
                <rect x="40" y="30" width="120" height="40" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                
                {/* Door Frame */}
                <rect x="95" y="30" width="10" height="40" fill="#94a3b8" />

                {/* Door Flaps */}
                <path d="M100 30 L 130 45" stroke="#475569" strokeWidth="3" strokeLinecap="round" className="origin-top-left animate-bounce" style={{animationDuration: '2s'}} />
                <path d="M100 70 L 130 55" stroke="#475569" strokeWidth="3" strokeLinecap="round" className="origin-bottom-left animate-bounce" style={{animationDuration: '2s'}} />

                {/* People/Blood Cells */}
                <circle cx="60" cy="50" r="5" fill="#ef4444" />
                <circle cx="80" cy="40" r="5" fill="#ef4444" />
                <circle cx="70" cy="60" r="5" fill="#ef4444" />
                
                <path d="M140 50 L 150 50 L 145 45 M 150 50 L 145 55" stroke="#ef4444" strokeWidth="2" fill="none" />

                <text x="100" y="90" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Preventing Backflow</text>
            </svg>
        </div>
    );

    const BlockageVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: Clogged Pipe</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Pipe */}
                <rect x="20" y="30" width="160" height="40" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
                
                {/* Clog/Plaque */}
                <path d="M80 32 Q 100 50, 120 32" fill="#fef08a" stroke="#eab308" strokeWidth="1" />
                <path d="M80 68 Q 100 50, 120 68" fill="#fef08a" stroke="#eab308" strokeWidth="1" />

                {/* Flow Restriction */}
                <path d="M40 40 L 60 40" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M40 50 L 60 50" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
                <path d="M40 60 L 60 60" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />

                {/* Trickle after clog */}
                <path d="M140 50 L 160 50" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />

                <text x="100" y="90" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Restricted Blood Flow</text>
            </svg>
        </div>
    );

    const ReceptorVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: Lock and Key</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Cell Membrane */}
                <rect x="0" y="60" width="200" height="40" fill="#e2e8f0" stroke="#94a3b8" />
                
                {/* Receptor (Lock) */}
                <path d="M80 60 V 40 H 120 V 60" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                <path d="M90 40 V 50 H 110 V 40" fill="#f1f5f9" />

                {/* Agonist (Key) */}
                <path d="M92 20 V 35 H 108 V 20" fill="#22c55e" stroke="#16a34a" strokeWidth="2" className="animate-bounce" style={{animationDuration: '2s'}} />
                <text x="100" y="15" textAnchor="middle" fontSize="8" fill="#16a34a">Agonist</text>

                {/* Antagonist (Blocker) */}
                <path d="M130 20 L 140 35 L 150 20" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" className="animate-pulse" />
                <text x="140" y="15" textAnchor="middle" fontSize="8" fill="#b91c1c">Blocker</text>

                <text x="100" y="90" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Receptor Binding</text>
            </svg>
        </div>
    );

    const LabVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Analogy: Engine Check Light</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                {/* Dashboard */}
                <rect x="40" y="20" width="120" height="60" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="4" />
                
                {/* Check Engine Icon */}
                <path d="M70 40 H 130 V 60 H 70 Z" fill="none" />
                <path d="M80 45 H 120 M 80 55 H 120 M 90 35 V 45 M 110 35 V 45" stroke="#f59e0b" strokeWidth="3" className="animate-pulse" />
                
                {/* Text */}
                <text x="100" y="70" textAnchor="middle" fontSize="8" fill="#f59e0b" fontWeight="bold">CHECK ENGINE</text>

                {/* Dipstick */}
                <rect x="170" y="20" width="10" height="60" fill="#cbd5e1" stroke="#94a3b8" />
                <rect x="172" y="50" width="6" height="20" fill="#ef4444" />
                <text x="175" y="90" textAnchor="middle" fontSize="8" fill="currentColor" className="text-slate-500">Level</text>

                <text x="100" y="95" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Biomarker Detection</text>
            </svg>
        </div>
    );

    const GenericHeartVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center">
            <h5 className="text-xs font-bold text-muted-foreground uppercase mb-2 tracking-wider">Concept Visualization</h5>
            <svg viewBox="0 0 200 100" className="w-full h-32">
                <path d="M100 20 Q 130 0, 160 30 Q 190 60, 100 90 Q 10 60, 40 30 Q 70 0, 100 20" fill="#ffe4e6" stroke="#e11d48" strokeWidth="2" />
                <circle cx="100" cy="50" r="15" fill="white" stroke="#e11d48" strokeWidth="1" className="animate-pulse" />
                <path d="M90 50 H 110 M 100 40 V 60" stroke="#e11d48" strokeWidth="2" />
                <text x="100" y="95" textAnchor="middle" fontSize="10" fill="currentColor" className="text-slate-500 dark:text-slate-400">Cardiovascular System</text>
            </svg>
        </div>
    );

    switch (type) {
        case 'pipes': return <PipeVisual />;
        case 'electrical': return <ElectricalVisual />;
        case 'pump': return <PumpVisual />;
        case 'valve': return <ValveVisual />;
        case 'blockage': return <BlockageVisual />;
        case 'receptor': return <ReceptorVisual />;
        case 'lab': return <LabVisual />;
        default: return <GenericHeartVisual />;
    }
};
