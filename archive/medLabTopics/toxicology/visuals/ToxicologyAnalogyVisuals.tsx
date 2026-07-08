import React from 'react';

interface VisualProps {
    title: string;
    analogy?: string;
}

export const ToxicologyAnalogyVisual: React.FC<VisualProps> = ({ title, analogy }) => {
    const text = (title + " " + (analogy || "")).toLowerCase();

    const getVisualType = () => {
        if (text.includes('water') || text.includes('dose')) return 'water';
        if (text.includes('fire') || text.includes('spark')) return 'fire';
        if (text.includes('bouncer') || text.includes('fingerprint')) return 'bouncer';
        if (text.includes('road') || text.includes('mountain') || text.includes('steer')) return 'road';
        if (text.includes('receipt') || text.includes('signature')) return 'receipt';
        if (text.includes('dust') || text.includes('layer')) return 'dust';
        if (text.includes('detective') || text.includes('clue') || text.includes('calling card')) return 'detective';
        return 'generic';
    };

    const type = getVisualType();

    const WaterVisual = () => (
        <div className="my-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
            <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest text-center mb-4">Analogy: Water Intoxication</h4>
            <div className="flex justify-center items-end gap-8 h-20">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-12 bg-blue-200 rounded-b-lg border-2 border-t-0 border-blue-400 relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-1/2 bg-blue-500"></div>
                    </div>
                    <span className="text-[10px] mt-2 text-muted-foreground">1 Glass = Life</span>
                </div>
                <div className="text-xl text-muted-foreground">vs</div>
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-b-lg border-2 border-t-0 border-blue-400 relative overflow-hidden">
                        <div className="absolute bottom-0 w-full h-full bg-blue-500 animate-pulse"></div>
                    </div>
                    <span className="text-[10px] mt-2 text-blue-600 font-bold">10 Gallons = Toxic</span>
                </div>
            </div>
        </div>
    );

    const FireVisual = () => (
        <div className="my-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900">
            <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest text-center mb-4">Analogy: Sparks & Water</h4>
            <div className="flex justify-center items-center gap-4 h-20">
                <div className="relative w-16 h-16">
                    <svg viewBox="0 0 64 64" className="w-full h-full">
                        {/* House */}
                        <path d="M 0 16 L 8 8 L 16 16 V 24 H 0 Z" fill="#cbd5e1" transform="scale(2) translate(4, 4)" />
                        {/* Sparks */}
                        <circle cx="10" cy="10" r="2" fill="#ef4444" className="animate-ping" />
                        <circle cx="50" cy="20" r="2" fill="#ef4444" className="animate-ping" style={{animationDelay: '0.5s'}} />
                        <circle cx="30" cy="50" r="2" fill="#ef4444" className="animate-ping" style={{animationDelay: '0.2s'}} />
                    </svg>
                </div>
                <div className="text-xl text-muted-foreground">→</div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* Water bucket */}
                    <div className="w-8 h-8 bg-blue-500 rounded-b-lg border-2 border-t-0 border-blue-700"></div>
                    <span className="absolute -bottom-4 text-[10px] text-blue-600 font-bold">Antioxidants</span>
                </div>
            </div>
        </div>
    );

    const BouncerVisual = () => (
        <div className="my-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900">
            <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest text-center mb-4">Analogy: Bouncer vs. Fingerprints</h4>
            <div className="flex justify-center items-center gap-4 h-20">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center border-2 border-indigo-400">
                        <span className="text-xl">👁️</span>
                    </div>
                    <span className="text-[10px] mt-2 text-muted-foreground">Immunoassay (Quick Look)</span>
                </div>
                <div className="text-xl text-muted-foreground">vs</div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center border-2 border-indigo-500">
                        <span className="text-xl">🔬</span>
                    </div>
                    <span className="text-[10px] mt-2 text-indigo-600 font-bold">GC-MS (Absolute Certainty)</span>
                </div>
            </div>
        </div>
    );

    const RoadVisual = () => (
        <div className="my-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900">
            <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest text-center mb-4">Analogy: Narrow Mountain Road</h4>
            <div className="relative h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg overflow-hidden flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                {/* Road */}
                <div className="absolute inset-x-0 h-8 bg-slate-800"></div>
                <div className="absolute inset-x-0 h-1 bg-yellow-400 top-1/2 -translate-y-1/2 border-t border-dashed border-yellow-500"></div>
                {/* Car */}
                <div className="absolute w-6 h-4 bg-red-500 rounded animate-[pulse_2s_ease-in-out_infinite] shadow-lg z-10"></div>
                
                {/* Labels */}
                <span className="absolute top-1 text-[8px] text-emerald-700 dark:text-emerald-300 font-bold">MOUNTAIN (Ineffective)</span>
                <span className="absolute bottom-1 text-[8px] text-red-600 dark:text-red-400 font-bold">CLIFF (Toxicity)</span>
            </div>
        </div>
    );

    const ReceiptVisual = () => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-blue-950/20 rounded-xl border border-slate-200 dark:border-blue-900">
            <h4 className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center mb-4">Analogy: Registered Mail</h4>
            <div className="flex justify-center items-center gap-2 h-20">
                <div className="w-12 h-16 bg-white border border-slate-300 shadow-sm flex flex-col p-1">
                    <div className="w-full h-2 bg-slate-200 mb-1"></div>
                    <div className="w-3/4 h-1 bg-slate-200 mb-1"></div>
                    <div className="mt-auto text-[6px] text-blue-600 italic border-b border-blue-200">Sign: John Doe</div>
                </div>
                <div className="text-slate-400">→</div>
                <div className="w-12 h-16 bg-white border border-slate-300 shadow-sm flex flex-col p-1">
                    <div className="w-full h-2 bg-slate-200 mb-1"></div>
                    <div className="w-3/4 h-1 bg-slate-200 mb-1"></div>
                    <div className="mt-auto text-[6px] text-blue-600 italic border-b border-blue-200">Sign: Jane Smith</div>
                </div>
            </div>
        </div>
    );

    const DustVisual = () => (
        <div className="my-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-100 dark:border-yellow-900">
            <h4 className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest text-center mb-4">Analogy: Collecting Dust</h4>
            <div className="flex justify-center items-end gap-4 h-20">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border border-slate-200 relative">
                        <div className="absolute bottom-0 w-full h-1 bg-yellow-600/20"></div>
                    </div>
                    <span className="text-[10px] mt-2 text-muted-foreground">Day 1</span>
                </div>
                <div className="text-xl text-muted-foreground">→</div>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white border border-slate-200 relative">
                        <div className="absolute bottom-0 w-full h-8 bg-yellow-600/80"></div>
                    </div>
                    <span className="text-[10px] mt-2 text-yellow-700 font-bold">Year 10 (Bioaccumulation)</span>
                </div>
            </div>
        </div>
    );

    const DetectiveVisual = () => (
        <div className="my-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900">
            <h4 className="text-[10px] font-bold text-purple-600 uppercase tracking-widest text-center mb-4">Analogy: The Calling Card</h4>
            <div className="flex justify-center items-center gap-4 h-20">
                <div className="relative w-20 h-16 bg-slate-100 dark:bg-blue-900/50 border border-slate-300 dark:border-blue-800 rounded flex items-center justify-center">
                    <span className="text-2xl">🃏</span>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-500/20 rounded-full animate-ping"></div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-purple-700 font-bold">Clues Left Behind:</span>
                    <span className="text-[8px] text-muted-foreground">- Dilated Pupils</span>
                    <span className="text-[8px] text-muted-foreground">- Dry Skin</span>
                    <span className="text-[8px] text-muted-foreground">- Tachycardia</span>
                </div>
            </div>
        </div>
    );

    switch (type) {
        case 'water': return <WaterVisual />;
        case 'fire': return <FireVisual />;
        case 'bouncer': return <BouncerVisual />;
        case 'road': return <RoadVisual />;
        case 'receipt': return <ReceiptVisual />;
        case 'dust': return <DustVisual />;
        case 'detective': return <DetectiveVisual />;
        default: return null;
    }
};
