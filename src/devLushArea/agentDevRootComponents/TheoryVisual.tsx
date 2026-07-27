import React from 'react';
import { motion } from 'motion/react';

interface TheoryVisualProps {
    analogyName: string;
    keywords: string[];
}

export const TheoryVisual: React.FC<TheoryVisualProps> = ({ analogyName, keywords }) => {
    const lowerKeywords = (keywords || []).map(k => (k ? k.toLowerCase() : ''));
    const has = (k: string) => lowerKeywords.some(kw => kw && kw.includes(k));

    // 1. Cleavage / Division (Mansion to Apartments)
    if (has('cleavage') || has('division')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Cellular Sub-division'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Mansion Outline */}
                    <rect x="40" y="20" width="120" height="60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    <path d="M40 20 L100 5 L160 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    
                    {/* Dividing Walls */}
                    <motion.line 
                        x1="100" y1="20" x2="100" y2="80" 
                        stroke="currentColor" strokeWidth="2" 
                        className="text-orange-500"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    />
                    <motion.line 
                        x1="40" y1="50" x2="160" y2="50" 
                        stroke="currentColor" strokeWidth="2" 
                        className="text-orange-500"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    />
                    <motion.line 
                        x1="70" y1="20" x2="70" y2="80" 
                        stroke="currentColor" strokeWidth="1" 
                        className="text-orange-400 opacity-50"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    />
                    <motion.line 
                        x1="130" y1="20" x2="130" y2="80" 
                        stroke="currentColor" strokeWidth="1" 
                        className="text-orange-400 opacity-50"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Constant volume, increasing complexity.
                </p>
            </div>
        );
    }

    // 2. Gene Expression (Cookbook)
    if (has('expression') || has('differentiation') || has('transcription')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Master Cookbook'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Book Base */}
                    <rect x="50" y="20" width="100" height="70" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    <line x1="100" y1="20" x2="100" y2="90" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    
                    {/* Highlighting specific pages */}
                    <motion.rect 
                        x="105" y="30" width="40" height="5" rx="1" 
                        fill="currentColor" className="text-blue-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                    <motion.rect 
                        x="105" y="40" width="30" height="5" rx="1" 
                        fill="currentColor" className="text-blue-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                    />
                    
                    <motion.rect 
                        x="55" y="60" width="35" height="5" rx="1" 
                        fill="currentColor" className="text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Same DNA (Book), Different Genes (Recipes) active.
                </p>
            </div>
        );
    }

    // 3. Morphogen Gradient (Wi-Fi Signal)
    if (has('morphogen') || has('gradient')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Signal Strength'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Router */}
                    <rect x="20" y="70" width="20" height="10" rx="2" fill="currentColor" className="text-slate-500" />
                    <line x1="30" y1="70" x2="30" y2="60" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
                    
                    {/* Signal Waves */}
                    {[1, 2, 3, 4].map(i => (
                        <motion.path 
                            key={i}
                            d={`M ${30 + i*15} 40 Q ${60 + i*20} 50 ${30 + i*15} 90`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className={i < 2 ? "text-red-500" : i < 3 ? "text-purple-500" : "text-blue-500"}
                            initial={{ opacity: 0, pathLength: 0 }}
                            animate={{ opacity: 1 - (i*0.2), pathLength: 1 }}
                            transition={{ delay: i * 0.3, duration: 1, repeat: Infinity }}
                        />
                    ))}
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Distance from source determines cell identity.
                </p>
            </div>
        );
    }

    // 4. Hox Genes (Blueprint)
    if (has('hox') || has('body plan')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Master Blueprint'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Blueprint grid */}
                    <rect x="20" y="10" width="160" height="80" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-300 opacity-30" />
                    <line x1="20" y1="36" x2="180" y2="36" stroke="currentColor" strokeWidth="1" className="text-blue-300 opacity-30" />
                    <line x1="20" y1="63" x2="180" y2="63" stroke="currentColor" strokeWidth="1" className="text-blue-300 opacity-30" />
                    
                    {/* Segments */}
                    <motion.rect 
                        x="30" y="20" width="40" height="60" rx="4" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        className="text-red-500"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    />
                    <motion.rect 
                        x="80" y="20" width="40" height="60" rx="4" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        className="text-purple-500"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    />
                    <motion.rect 
                        x="130" y="20" width="40" height="60" rx="4" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        className="text-blue-500"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Architectural genes defining segment identity.
                </p>
            </div>
        );
    }

    // 5. Antibody Specificity (Handcuffs / Lock & Key)
    if (has('antibody') || has('specificity')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Custom-fit Security'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Handcuff 1 (No match) */}
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-400 opacity-30" />
                    <rect x="40" y="10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500" />
                    
                    {/* Handcuff 2 (Match) */}
                    <motion.g
                        initial={{ x: 200 }}
                        animate={{ x: 120 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                    >
                        <circle cx="0" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-500" />
                        <line x1="0" y1="35" x2="0" y2="15" stroke="currentColor" strokeWidth="3" className="text-blue-500" />
                        {/* Key hole shape */}
                        <path d="M -5 15 L 5 15 L 0 5 Z" fill="currentColor" className="text-blue-500" />
                    </motion.g>

                    {/* Antigen (Matching shape) */}
                    <path d="M 115 15 L 125 15 L 120 5 Z" fill="currentColor" className="text-blue-600" />
                    <circle cx="120" cy="50" r="12" fill="currentColor" className="text-blue-600/20" />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Antibodies only lock onto their exact matching shape.
                </p>
            </div>
        )
    }

    // 6. Immune Memory (Secondary Response)
    if (has('memory') || has('titer')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Experienced Path'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Road */}
                    <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="1" className="text-slate-400 stroke-dashed opacity-30" />
                    
                    {/* Primary Response Car */}
                    <motion.g
                        animate={{ x: [0, 160] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <circle cx="20" cy="80" r="4" fill="currentColor" className="text-blue-400" />
                        <text x="20" y="70" fontSize="8" textAnchor="middle" className="fill-blue-500">Primary</text>
                        {/* Slow motion effect */}
                        <motion.path d="M 10 80 Q 0 80 -10 80" stroke="currentColor" strokeWidth="1" className="text-blue-300" 
                            animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity }} />
                    </motion.g>

                    {/* Secondary Response Car (Fast) */}
                    <motion.g
                        animate={{ x: [0, 160] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    >
                        <circle cx="20" cy="50" r="4" fill="currentColor" className="text-green-500" />
                        <text x="20" y="40" fontSize="8" textAnchor="middle" className="fill-green-600 font-bold">Secondary</text>
                        {/* Blur/Speed streaks */}
                        <motion.line x1="10" y1="50" x2="-20" y2="50" stroke="currentColor" strokeWidth="2" className="text-green-400"
                            animate={{ opacity: [0.8, 0] }} transition={{ repeat: Infinity }} />
                    </motion.g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Faster, stronger, and more efficient upon re-exposure.
                </p>
            </div>
        )
    }

    // 7. Clonal Selection (Cinderella's Slipper)
    if (has('clonal') || has('slipper')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Perfect Fit'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Different Shapes */}
                    <rect x="30" y="40" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" opacity="0.3" />
                    <circle cx="80" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" opacity="0.3" />
                    
                    {/* The Matching One */}
                    <motion.polygon 
                        points="130,40 145,70 115,70" 
                        fill="none" stroke="currentColor" strokeWidth="2" 
                        className="text-purple-500"
                        animate={{ scale: [1, 1.2, 1], strokeWidth: [2, 4, 2] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    
                    {/* The Slipper (Antigen) */}
                    <motion.path 
                        d="M 120 10 L 140 10 L 130 30 Z" 
                        fill="currentColor" className="text-purple-600"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    />

                    {/* Proliferation visual */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    >
                         <circle cx="130" cy="55" r="30" fill="currentColor" className="text-purple-400 opacity-10" />
                         <circle cx="130" cy="55" r="20" fill="currentColor" className="text-purple-400 opacity-20" />
                    </motion.g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Only the matching cell is selected to multiply.
                </p>
            </div>
        )
    }

    // 8. T Cell Function (Assassins / Special Ops)
    if (has('t cell') || has('cytotoxic')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Special Ops'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Host Cell */}
                    <circle cx="120" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-300" />
                    
                    {/* Infection (Viruses inside) */}
                    <motion.g
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <circle cx="110" cy="45" r="3" fill="currentColor" className="text-red-500" />
                        <circle cx="130" cy="55" r="3" fill="currentColor" className="text-red-500" />
                        <circle cx="120" cy="65" r="3" fill="currentColor" className="text-red-500" />
                    </motion.g>

                    {/* T Cell Assassin */}
                    <motion.g
                        initial={{ x: -50 }}
                        animate={{ x: 80 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        <circle cx="0" cy="50" r="15" fill="currentColor" className="text-blue-500 opacity-80" />
                        <text x="0" y="53" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">CD8+</text>
                        {/* Target scanner */}
                        <motion.line 
                            x1="15" y1="50" x2="30" y2="50" 
                            stroke="currentColor" strokeWidth="2" 
                            className="text-blue-400"
                            animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity }}
                        />
                    </motion.g>

                    {/* Apoptosis / Destruction effect */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ delay: 1.5, duration: 1 }}
                    >
                        <path d="M 120 25 L 120 15 M 145 50 L 155 50 M 120 75 L 120 85 M 95 50 L 85 50" stroke="currentColor" strokeWidth="2" className="text-red-400" />
                    </motion.g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    T-cells hunt down and eliminate infected "traitor" cells.
                </p>
            </div>
        )
    }

    // 9. Heart/Circulation (City Plumbing)
    if (has('heart') || has('circulation') || has('pump')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The City Mainframe'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Pump Station */}
                    <rect x="80" y="30" width="40" height="40" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500" />
                    <motion.circle 
                        cx="100" cy="50" r="15" fill="currentColor" className="text-red-400 opacity-20"
                        animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                    
                    {/* Pipes */}
                    <path d="M 120 50 L 160 50 L 160 80" fill="none" stroke="currentColor" strokeWidth="3" className="text-red-500" />
                    <path d="M 80 50 L 40 50 L 40 80" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-500" />
                    
                    {/* Flowing particles */}
                    {[0, 1, 2].map(i => (
                        <motion.circle 
                            key={i} r="2" fill="currentColor" className="text-red-500"
                            animate={{ 
                                x: [120, 160, 160], 
                                y: [50, 50, 80] 
                            }}
                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.6, ease: "linear" }}
                        />
                    ))}
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    A central pump ensuring pressure and flow to every "district".
                </p>
            </div>
        )
    }

    // 10. Endocrine System (Radio Broadcast)
    if (has('endocrine') || has('hormone') || has('signal')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Global Broadcast'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Radio Tower */}
                    <path d="M 30 90 L 50 20 L 70 90 M 40 50 L 60 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    <circle cx="50" cy="20" r="3" fill="currentColor" className="text-red-500" />
                    
                    {/* Broadcast Waves */}
                    {[1, 2, 3].map(i => (
                        <motion.circle 
                            key={i} cx="50" cy="20" r="0" fill="none" stroke="currentColor" strokeWidth="1"
                            className="text-blue-400"
                            animate={{ r: 150, opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 3, delay: i * 1 }}
                        />
                    ))}

                    {/* Receiving Antennas */}
                    <g transform="translate(140, 40)">
                         <line x1="0" y1="20" x2="0" y2="0" stroke="currentColor" strokeWidth="2" />
                         <motion.circle 
                            cx="0" cy="0" r="5" fill="none" stroke="currentColor" 
                            animate={{ scale: [1, 1.5, 1], strokeWidth: [1, 3, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                         />
                    </g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Signals sent to everyone, but only those with the right "receiver" respond.
                </p>
            </div>
        )
    }

    // 11. Renal/Excretion (Water Treatment)
    if (has('renal') || has('kidney') || has('filtration')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Purification Plant'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Filter Mesh */}
                    <line x1="40" y1="50" x2="160" y2="50" stroke="currentColor" strokeWidth="4" strokeDasharray="4 4" className="text-slate-300" />
                    
                    {/* Dirty Stream */}
                    <motion.g animate={{ y: [0, 100] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                        <circle cx="60" cy="-10" r="3" fill="currentColor" className="text-red-400" />
                        <circle cx="100" cy="-25" r="5" fill="currentColor" className="text-slate-500" />
                        <circle cx="140" cy="-15" r="3" fill="currentColor" className="text-red-400" />
                    </motion.g>

                    {/* Cleaned Stream (Filtered) */}
                    <motion.g animate={{ y: [50, 150] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                         <circle cx="100" cy="50" r="3" fill="currentColor" className="text-blue-400" />
                         <circle cx="130" cy="70" r="3" fill="currentColor" className="text-blue-400" />
                    </motion.g>

                    {/* Waste (Stopped by filter) */}
                    <motion.circle 
                        cx="100" cy="45" r="5" fill="currentColor" className="text-slate-600"
                        animate={{ x: [100, 180], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Reclaiming what\'s valuable, flushing what\'s toxic.
                </p>
            </div>
        )
    }

    // 12. Muscle/Contraction (Tug of War)
    if (has('muscle') || has('contraction') || has('actin') || has('myosin')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Molecular Tug of War'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Actin Filament */}
                    <line x1="20" y1="40" x2="180" y2="40" stroke="currentColor" strokeWidth="4" className="text-blue-300" />
                    
                    {/* Myosin Heads */}
                    {[60, 100, 140].map(x => (
                        <motion.g key={x} 
                            animate={{ rotate: [-20, 20, -20] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: x/100 }}
                            style={{ originX: `${x}px`, originY: '70px' }}
                        >
                            <line x1={x} y1="70" x2={x} y2="40" stroke="currentColor" strokeWidth="3" className="text-red-500" />
                            <circle cx={x} cy="40" r="4" fill="currentColor" className="text-red-600" />
                        </motion.g>
                    ))}
                    
                    {/* Pulling effect */}
                    <motion.path 
                        d="M 170 30 L 190 40 L 170 50" fill="none" stroke="currentColor" strokeWidth="2"
                        animate={{ x: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Bridges grabbing and pulling to shorten the length.
                </p>
            </div>
        )
    }

    // 13. Respiratory (Air Balloon Exchange)
    if (has('respiratory') || has('lung') || has('alveoli') || has('gas exchange')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Air Exchange'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Alveolus */}
                    <motion.circle 
                        cx="100" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-200"
                        animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }}
                    />
                    
                    {/* Gas Exchange */}
                    <motion.g animate={{ x: [-10, 40], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                        <text x="80" y="45" fontSize="10" className="fill-blue-500">O₂</text>
                    </motion.g>
                    <motion.g animate={{ x: [40, -10], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 1.2 }}>
                        <text x="110" y="65" fontSize="10" className="fill-slate-500">CO₂</text>
                    </motion.g>
                    
                    {/* Capillary path */}
                    <path d="M 40 20 Q 100 20 160 80" fill="none" stroke="currentColor" strokeWidth="4" className="text-red-400 opacity-30" />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Fresh oxygen in, waste carbon out, across a thin border.
                </p>
            </div>
        )
    }

    // 14. Digestive (The Conveyor Belt)
    if (has('digestive') || has('stomach') || has('enzyme') || has('breakdown')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Processing Line'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Belt */}
                    <line x1="20" y1="60" x2="180" y2="60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" className="text-slate-400" />
                    
                    {/* Large Object */}
                    <motion.rect 
                        x="30" y="40" width="20" height="20" fill="currentColor" className="text-orange-400"
                        animate={{ x: [0, 50] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Breakdown Station (Enzymes) */}
                    <motion.path 
                        d="M 100 20 L 100 40" stroke="currentColor" strokeWidth="3" className="text-yellow-500"
                        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}
                    />
                    
                    {/* Small Fragments */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ x: [100, 180], opacity: [1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
                    >
                        <circle cx="10" cy="50" r="3" fill="currentColor" className="text-orange-500" />
                        <circle cx="25" cy="55" r="3" fill="currentColor" className="text-orange-500" />
                        <circle cx="15" cy="65" r="3" fill="currentColor" className="text-orange-500" />
                    </motion.g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Complex wholes broken into useful, absorbable parts.
                </p>
            </div>
        )
    }

    // 15. Bacterial Growth (Population Explosion)
    if (has('growth') || has('bacterial') || has('exponential')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Population Explosion'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Growth Curve */}
                    <path d="M 20 80 Q 80 80 180 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    
                    {/* Bacteria splitting */}
                    <motion.g initial={{ x: 30, y: 80 }}>
                        <circle r="5" fill="currentColor" className="text-green-500" />
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, x: [0, 20], y: [0, -20] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        >
                            <circle r="5" fill="currentColor" className="text-green-500 opacity-50" />
                        </motion.g>
                    </motion.g>

                    <motion.g initial={{ x: 150, y: 30 }}>
                         {[...Array(8)].map((_, i) => (
                             <motion.circle 
                                key={i}
                                r="3" 
                                cx={Math.cos(i) * 15} 
                                cy={Math.sin(i) * 15}
                                fill="currentColor" 
                                className="text-green-600"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                             />
                         ))}
                    </motion.g>
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    One becomes two, two become four—doubling rapidly.
                </p>
            </div>
        )
    }

    // 16. Antibiotic Resistance (The Survival Shield)
    if (has('resistance') || has('antibiotic') || has('survival')) {
        return (
            <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Survival Shield'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Bacteria */}
                    <rect x="80" y="30" width="40" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500" />
                    
                    {/* The Shield */}
                    <motion.path 
                        d="M 70 20 Q 100 0 130 20" 
                        fill="none" stroke="currentColor" strokeWidth="3" 
                        className="text-blue-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                    
                    {/* Attacks (Antibiotics) */}
                    {[0, 1, 2].map(i => (
                        <motion.line 
                            key={i}
                            x1={100 + (i-1)*30} y1="0" x2={100 + (i-1)*30} y2="20"
                            stroke="currentColor" strokeWidth="2"
                            className="text-red-400"
                            animate={{ y: [0, 15], opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.3 }}
                        />
                    ))}
                    
                    {/* Internal Mutation */}
                    <motion.circle 
                        cx="100" cy="40" r="3" fill="currentColor" className="text-yellow-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-muted-foreground italic">
                    Mutations provide tools to survive and block the medicine.
                </p>
            </div>
        )
    }

    return null;
};
