import React from 'react';
import { motion } from 'framer-motion';

interface VisualProps {
    title: string;
    analogy?: string;
}

export const PhysiologyPrimaryVisual: React.FC<{ componentId: string }> = ({ componentId }) => {
    const PrimaryContainer = ({ children, title }: { children: React.ReactNode, title: string }) => (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <h3 className="absolute top-4 left-4 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">{title}</h3>
            <div className="w-full max-w-md aspect-video relative flex items-center justify-center">
                {children}
            </div>
        </div>
    );

    switch (componentId) {
        case 'cellular-main-sim':
            return (
                <PrimaryContainer title="Cellular Transport">
                    <svg viewBox="0 0 400 250" className="w-full h-full drop-shadow-lg">
                        {/* Extracellular */}
                        <rect x="0" y="0" width="400" height="100" fill="#e0f2fe" opacity="0.5" />
                        <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#0284c7" fontWeight="bold">EXTRACELLULAR FLUID (High Na+, Low K+)</text>
                        
                        {/* Membrane */}
                        <rect x="0" y="100" width="400" height="50" fill="#cbd5e1" />
                        <circle cx="50" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="80" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="110" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="140" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="170" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="230" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="260" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="290" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="320" cy="125" r="15" fill="#94a3b8" />
                        <circle cx="350" cy="125" r="15" fill="#94a3b8" />
                        
                        {/* Protein Channel (ATP Pump) */}
                        <path d="M185 90 L 215 90 L 220 160 L 180 160 Z" fill="#8b5cf6" />
                        <text x="200" y="130" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">ATP</text>
                        
                        {/* Intracellular */}
                        <rect x="0" y="150" width="400" height="100" fill="#fef08a" opacity="0.3" />
                        <text x="200" y="230" textAnchor="middle" fontSize="12" fill="#ca8a04" fontWeight="bold">INTRACELLULAR FLUID (Low Na+, High K+)</text>

                        {/* Ions moving */}
                        <motion.circle cx="200" cy="180" r="6" fill="#ef4444" 
                            animate={{ cy: [180, 130, 70], opacity: [1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <text x="215" y="185" fontSize="10" fill="#ef4444" fontWeight="bold">Na+</text>
                        
                        <motion.circle cx="190" cy="70" r="6" fill="#22c55e" 
                            animate={{ cy: [70, 130, 180], opacity: [1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                        <text x="170" y="75" fontSize="10" fill="#22c55e" fontWeight="bold">K+</text>
                    </svg>
                </PrimaryContainer>
            );
        case 'cv-main-sim':
            return (
                <PrimaryContainer title="Cardiac Cycle">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Heart Base */}
                        <path d="M200 250 C 100 250, 120 100, 200 100 C 280 100, 300 250, 200 250 Z" fill="#fecdd3" stroke="#e11d48" strokeWidth="4" />
                        
                        {/* Ventricles */}
                        <motion.path 
                            d="M200 240 C 130 240, 140 140, 200 140 C 260 140, 270 240, 200 240 Z" 
                            fill="#be123c"
                            animate={{ scale: [1, 0.85, 1] }}
                            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                            style={{ originX: "200px", originY: "190px" }}
                        />
                        
                        {/* Aorta */}
                        <path d="M180 140 C 180 80, 220 50, 260 80" fill="none" stroke="#e11d48" strokeWidth="20" strokeLinecap="round" />
                        
                        {/* Pulmonary Artery */}
                        <path d="M220 140 C 220 80, 180 50, 140 80" fill="none" stroke="#0284c7" strokeWidth="20" strokeLinecap="round" />
                        
                        {/* Blood Flow Particles */}
                        <motion.circle cx="180" cy="120" r="4" fill="white"
                            animate={{ cy: [140, 80], cx: [180, 180], opacity: [1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <motion.circle cx="220" cy="120" r="4" fill="white"
                            animate={{ cy: [140, 80], cx: [220, 220], opacity: [1, 0] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                    </svg>
                </PrimaryContainer>
            );
        case 'resp-main-sim':
            return (
                <PrimaryContainer title="Mechanics of Ventilation">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Trachea */}
                        <rect x="190" y="40" width="20" height="60" fill="#cbd5e1" rx="5" />
                        
                        {/* Lungs */}
                        <motion.path 
                            d="M190 100 C 130 100, 100 180, 140 240 C 170 260, 190 240, 190 200 Z" 
                            fill="#bae6fd" stroke="#0284c7" strokeWidth="3"
                            animate={{ scaleX: [1, 1.15, 1], scaleY: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ originX: "190px", originY: "100px" }}
                        />
                        <motion.path 
                            d="M210 100 C 270 100, 300 180, 260 240 C 230 260, 210 240, 210 200 Z" 
                            fill="#bae6fd" stroke="#0284c7" strokeWidth="3"
                            animate={{ scaleX: [1, 1.15, 1], scaleY: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ originX: "210px", originY: "100px" }}
                        />
                        
                        {/* Diaphragm */}
                        <motion.path 
                            d="M100 250 Q 200 220, 300 250" 
                            fill="none" stroke="#ef4444" strokeWidth="8" strokeLinecap="round"
                            animate={{ d: ["M100 250 Q 200 220, 300 250", "M100 250 Q 200 270, 300 250", "M100 250 Q 200 220, 300 250"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        
                        {/* Air Flow */}
                        <motion.path 
                            d="M200 20 L 200 80" 
                            stroke="#0ea5e9" strokeWidth="4" strokeDasharray="4 4"
                            animate={{ strokeDashoffset: [0, -20, 0], opacity: [1, 0, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </svg>
                </PrimaryContainer>
            );
        case 'renal-main-sim':
            return (
                <PrimaryContainer title="Nephron Function">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Bowman's Capsule */}
                        <path d="M100 100 C 60 100, 60 160, 100 160 C 120 160, 130 140, 130 130 C 130 120, 120 100, 100 100 Z" fill="none" stroke="#eab308" strokeWidth="4" />
                        
                        {/* Glomerulus */}
                        <circle cx="95" cy="130" r="15" fill="#ef4444" />
                        <path d="M40 130 L 80 130" stroke="#ef4444" strokeWidth="6" />
                        <path d="M110 130 L 150 130" stroke="#ef4444" strokeWidth="4" />
                        
                        {/* Tubules */}
                        <path d="M125 145 Q 160 180, 200 140 T 250 140 L 250 250 Q 270 280, 290 250 L 290 100 Q 320 80, 350 120 L 350 280" fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Reabsorption Arrows */}
                        <motion.path d="M180 160 L 180 190" stroke="#22c55e" strokeWidth="3" markerEnd="url(#arrow)" 
                            animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        <motion.path d="M270 200 L 300 200" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)" 
                            animate={{ x: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                            
                        <defs>
                            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                            </marker>
                        </defs>
                    </svg>
                </PrimaryContainer>
            );
        case 'endo-main-sim':
            return (
                <PrimaryContainer title="Endocrine Feedback">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Brain/Hypothalamus */}
                        <path d="M150 60 Q 200 20, 250 60 Q 280 100, 200 120 Q 120 100, 150 60 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="3" />
                        <text x="200" y="80" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#475569">Hypothalamus</text>
                        
                        {/* Target Gland */}
                        <rect x="160" y="200" width="80" height="50" rx="10" fill="#fbcfe8" stroke="#ec4899" strokeWidth="3" />
                        <text x="200" y="230" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#be185d">Target Gland</text>
                        
                        {/* Stimulatory Pathway */}
                        <motion.path d="M180 120 L 180 200" stroke="#22c55e" strokeWidth="4" strokeDasharray="6 6"
                            animate={{ strokeDashoffset: [0, -12] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        <text x="165" y="160" textAnchor="end" fontSize="10" fill="#16a34a" fontWeight="bold">Stimulates (+)</text>
                        
                        {/* Inhibitory Pathway (Feedback) */}
                        <motion.path d="M220 200 C 280 200, 280 120, 220 120" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 6"
                            animate={{ strokeDashoffset: [0, 12] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                        <text x="260" y="160" textAnchor="start" fontSize="10" fill="#dc2626" fontWeight="bold">Inhibits (-)</text>
                    </svg>
                </PrimaryContainer>
            );
        case 'gi-main-sim':
            return (
                <PrimaryContainer title="GI Digestion & Absorption">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Stomach */}
                        <path d="M150 80 C 100 80, 80 150, 150 180 C 200 200, 250 150, 220 100 C 200 70, 180 80, 150 80 Z" fill="#fed7aa" stroke="#f97316" strokeWidth="4" />
                        <text x="160" y="140" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#c2410c">Stomach</text>
                        
                        {/* Intestines */}
                        <path d="M180 180 Q 200 220, 150 250 T 250 280" fill="none" stroke="#fef08a" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M180 180 Q 200 220, 150 250 T 250 280" fill="none" stroke="#ca8a04" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Nutrients */}
                        <motion.circle cx="150" cy="100" r="6" fill="#22c55e"
                            animate={{ cy: [100, 160, 200, 260], cx: [150, 160, 180, 200], opacity: [1, 1, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                        <motion.circle cx="170" cy="110" r="6" fill="#3b82f6"
                            animate={{ cy: [110, 170, 210, 270], cx: [170, 150, 160, 220], opacity: [1, 1, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }} />
                    </svg>
                </PrimaryContainer>
            );
        case 'anatomy-main-sim':
            return (
                <PrimaryContainer title="Human Anatomy">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Body Outline */}
                        <path d="M200 40 C 180 40, 180 70, 200 70 C 220 70, 220 40, 200 40 Z" fill="none" stroke="#94a3b8" strokeWidth="3" />
                        <path d="M170 80 C 150 80, 130 120, 130 180 L 150 180 L 160 120 L 170 280 L 190 280 L 200 180 L 210 280 L 230 280 L 240 120 L 250 180 L 270 180 C 270 120, 250 80, 230 80 Z" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinejoin="round" />
                        
                        {/* Heart */}
                        <motion.path d="M205 110 C 190 110, 195 130, 205 140 C 215 130, 220 110, 205 110 Z" fill="#ef4444"
                            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} style={{ originX: "205px", originY: "125px" }} />
                            
                        {/* Lungs */}
                        <path d="M185 110 C 170 110, 170 140, 185 150 Z" fill="#bae6fd" opacity="0.8" />
                        <path d="M215 110 C 230 110, 230 140, 215 150 Z" fill="#bae6fd" opacity="0.8" />
                        
                        {/* Digestive */}
                        <path d="M200 150 C 180 150, 180 170, 200 170 C 220 170, 220 190, 200 190 C 180 190, 180 210, 200 210" fill="none" stroke="#fcd34d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </PrimaryContainer>
            );
        default:
            return (
                <PrimaryContainer title="Physiology Process">
                    <svg viewBox="0 0 400 300" className="w-full h-full">
                        <circle cx="200" cy="150" r="50" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" />
                        <motion.circle cx="200" cy="150" r="20" fill="#3b82f6"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                    </svg>
                </PrimaryContainer>
            );
    }
};

export const PhysiologyAnalogyVisual: React.FC<VisualProps> = ({ title, analogy }) => {
    const text = (title + " " + (analogy || "")).toLowerCase();

    const getVisualType = () => {
        // Cellular
        if (text.includes('membrane') || text.includes('transport') || text.includes('channel')) return 'membrane';
        if (text.includes('signaling') || text.includes('pathway') || text.includes('homeostasis')) return 'signaling';
        
        // Cardiovascular
        if (text.includes('cardiac cycle') || text.includes('pump') || text.includes('heart')) return 'heart-pump';
        if (text.includes('hemodynamics') || text.includes('blood pressure') || text.includes('vessel')) return 'vessel-flow';
        
        // Respiratory
        if (text.includes('mechanics') || text.includes('breathing') || text.includes('lung')) return 'lung-bellows';
        if (text.includes('gas exchange') || text.includes('oxygen transport') || text.includes('alveoli')) return 'gas-exchange';
        
        // Renal
        if (text.includes('glomerular') || text.includes('filtration') || text.includes('gfr')) return 'renal-filter';
        if (text.includes('tubular') || text.includes('reabsorption') || text.includes('secretion')) return 'renal-tubule';
        
        // Endocrine
        if (text.includes('feedback') || text.includes('loop') || text.includes('regulation')) return 'feedback-loop';
        if (text.includes('hormone') || text.includes('endocrine') || text.includes('gland')) return 'hormone-factory';
        
        // GI
        if (text.includes('digestion') || text.includes('enzyme') || text.includes('stomach')) return 'gi-digestion';
        if (text.includes('absorption') || text.includes('villi') || text.includes('intestine')) return 'gi-absorption';

        // Legacy/Fallback
        if (text.includes('neuron') || text.includes('synapse') || text.includes('action potential')) return 'neuron';
        if (text.includes('muscle') || text.includes('contraction') || text.includes('sarcomere')) return 'muscle';
        
        return 'generic';
    };

    const type = getVisualType();

    const VisualContainer = ({ children, analogyTitle, label }: { children: React.ReactNode, analogyTitle: string, label: string }) => (
        <div className="my-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col items-center w-full">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase mb-2 tracking-widest opacity-70">Analogy: {analogyTitle}</h5>
            <div className="w-full h-32 flex items-center justify-center relative">
                {children}
            </div>
            <p className="mt-2 text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{label}</p>
        </div>
    );

    // --- CELLULAR ---
    const MembraneVisual = () => (
        <VisualContainer analogyTitle="The Gatekeeper" label="Selective Permeability">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Lipid Bilayer */}
                <rect x="20" y="40" width="160" height="20" fill="#94a3b8" opacity="0.2" />
                <line x1="20" y1="40" x2="180" y2="40" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="20" y1="60" x2="180" y2="60" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                
                {/* Channel */}
                <rect x="90" y="35" width="20" height="30" fill="#3b82f6" rx="2" />
                
                {/* Ions */}
                <motion.circle 
                    cx="100" cy="20" r="4" fill="#fbbf24"
                    animate={{ cy: [20, 80] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle 
                    cx="100" cy="20" r="4" fill="#fbbf24"
                    animate={{ cy: [20, 80] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
            </svg>
        </VisualContainer>
    );

    const SignalingVisual = () => (
        <VisualContainer analogyTitle="The Relay Race" label="Signal Transduction">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <circle cx="40" cy="50" r="10" fill="#ef4444" opacity="0.8" />
                <circle cx="100" cy="50" r="10" fill="#3b82f6" opacity="0.8" />
                <circle cx="160" cy="50" r="10" fill="#10b981" opacity="0.8" />
                
                <motion.path 
                    d="M50 50 H 90" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, -8] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.path 
                    d="M110 50 H 150" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4"
                    animate={{ strokeDashoffset: [0, -8] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
            </svg>
        </VisualContainer>
    );

    // --- CARDIOVASCULAR ---
    const HeartPumpVisual = () => (
        <VisualContainer analogyTitle="The Dual Pump" label="Cardiac Cycle">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <motion.path 
                    d="M100 20 C 130 20, 140 50, 100 80 C 60 50, 70 20, 100 20" 
                    fill="#ef4444" 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.circle 
                    cx="100" cy="50" r="5" fill="white" opacity="0.3"
                    animate={{ scale: [0, 4], opacity: [0.5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                />
            </svg>
        </VisualContainer>
    );

    const VesselFlowVisual = () => (
        <VisualContainer analogyTitle="The Garden Hose" label="Hemodynamics">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="20" y="40" width="160" height="20" rx="10" fill="none" stroke="#ef4444" strokeWidth="2" />
                <motion.rect 
                    x="20" y="45" width="10" height="10" rx="5" fill="#ef4444"
                    animate={{ x: [20, 170] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.rect 
                    x="20" y="45" width="10" height="10" rx="5" fill="#ef4444"
                    animate={{ x: [20, 170] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.5 }}
                />
            </svg>
        </VisualContainer>
    );

    // --- RESPIRATORY ---
    const LungBellowsVisual = () => (
        <VisualContainer analogyTitle="The Bellows" label="Mechanics of Breathing">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <motion.path 
                    d="M60 80 L 100 20 L 140 80 Z" 
                    fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"
                    animate={{ d: ["M60 80 L 100 20 L 140 80 Z", "M40 90 L 100 10 L 160 90 Z", "M60 80 L 100 20 L 140 80 Z"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.path 
                    d="M100 20 V 5" stroke="#3b82f6" strokeWidth="2"
                    animate={{ y: [-5, 5] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                />
            </svg>
        </VisualContainer>
    );

    const GasExchangeVisual = () => (
        <VisualContainer analogyTitle="The Taxi Service" label="Oxygen Transport">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="40" y="40" width="40" height="20" rx="4" fill="#ef4444" />
                <motion.circle 
                    cx="60" cy="30" r="4" fill="#3b82f6"
                    animate={{ x: [0, 100], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <text x="60" y="53" textAnchor="middle" fontSize="8" fill="white">Hb</text>
            </svg>
        </VisualContainer>
    );

    // --- RENAL ---
    const RenalFilterVisual = () => (
        <VisualContainer analogyTitle="The Sieve" label="Glomerular Filtration">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <line x1="40" y1="50" x2="160" y2="50" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                <motion.circle 
                    cx="100" cy="30" r="3" fill="#fbbf24"
                    animate={{ cy: [30, 70] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.circle 
                    cx="80" cy="30" r="6" fill="#ef4444"
                    animate={{ x: [0, 40] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
            </svg>
        </VisualContainer>
    );

    const RenalTubuleVisual = () => (
        <VisualContainer analogyTitle="The Recycling Center" label="Tubular Reabsorption">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="40" y="40" width="120" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" />
                <motion.path 
                    d="M80 40 Q 100 10, 120 40" fill="none" stroke="#10b981" strokeWidth="2"
                    animate={{ pathLength: [0, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <text x="100" y="25" textAnchor="middle" fontSize="8" fill="#10b981">Glucose/Water</text>
            </svg>
        </VisualContainer>
    );

    // --- ENDOCRINE ---
    const FeedbackLoopVisual = () => (
        <VisualContainer analogyTitle="The Thermostat" label="Negative Feedback">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <circle cx="100" cy="50" r="30" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
                <motion.circle 
                    cx="100" cy="20" r="5" fill="#ef4444"
                    animate={{ rotate: 360 }}
                    style={{ originX: "100px", originY: "50px" }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <text x="100" y="55" textAnchor="middle" fontSize="10" fill="currentColor">Set Point</text>
            </svg>
        </VisualContainer>
    );

    const HormoneFactoryVisual = () => (
        <VisualContainer analogyTitle="The Factory" label="Hormone Synthesis">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="40" y="40" width="40" height="30" fill="#64748b" />
                <motion.circle 
                    cx="80" cy="55" r="4" fill="#a855f7"
                    animate={{ x: [0, 80] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <path d="M40 40 L 50 30 L 60 40 L 70 30 L 80 40" fill="none" stroke="#64748b" strokeWidth="2" />
            </svg>
        </VisualContainer>
    );

    // --- GI ---
    const GiDigestionVisual = () => (
        <VisualContainer analogyTitle="The Chemical Lab" label="Enzymatic Digestion">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="60" y="40" width="20" height="20" fill="#fbbf24" />
                <motion.path 
                    d="M90 30 L 70 50" stroke="#ef4444" strokeWidth="2"
                    animate={{ x: [0, -10], y: [0, 10] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.rect 
                    x="60" y="40" width="10" height="10" fill="#fbbf24"
                    animate={{ x: [0, -20], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
            </svg>
        </VisualContainer>
    );

    const GiAbsorptionVisual = () => (
        <VisualContainer analogyTitle="The Sponge" label="Intestinal Absorption">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M40 70 Q 50 40, 60 70 Q 70 40, 80 70 Q 90 40, 100 70 Q 110 40, 120 70" fill="none" stroke="#f97316" strokeWidth="2" />
                <motion.circle 
                    cx="80" cy="30" r="3" fill="#3b82f6"
                    animate={{ y: [30, 60], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            </svg>
        </VisualContainer>
    );

    // --- LEGACY ---
    const NeuronVisual = () => (
        <VisualContainer analogyTitle="Electrical Wire" label="Signal Transmission">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <path d="M20 50 H 180" stroke="#f59e0b" strokeWidth="4" />
                <circle cx="40" cy="50" r="10" fill="#fbbf24" />
                <circle cx="100" cy="50" r="5" fill="#ef4444" className="animate-ping" style={{animationDuration: '1.5s'}} />
                <path d="M160 40 L 180 50 L 160 60" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>
        </VisualContainer>
    );

    const MuscleVisual = () => (
        <VisualContainer analogyTitle="Sliding Doors" label="Contraction & Relaxation">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="20" y="30" width="60" height="40" rx="4" fill="#f87171" className="animate-pulse" />
                <rect x="120" y="30" width="60" height="40" rx="4" fill="#f87171" className="animate-pulse" />
                <path d="M80 50 H 120" stroke="#94a3b8" strokeWidth="4" strokeDasharray="4 4" />
            </svg>
        </VisualContainer>
    );

    const GenericVisual = () => (
        <VisualContainer analogyTitle="Physiological Process" label="Homeostasis">
            <svg viewBox="0 0 200 100" className="w-full h-full">
                <circle cx="100" cy="50" r="20" fill="none" stroke="#10b981" strokeWidth="2" />
                <path d="M80 50 H 120 M 100 30 V 70" stroke="#10b981" strokeWidth="2" />
                <circle cx="100" cy="50" r="5" fill="#10b981" className="animate-ping" />
            </svg>
        </VisualContainer>
    );

    switch (type) {
        case 'membrane': return <MembraneVisual />;
        case 'signaling': return <SignalingVisual />;
        case 'heart-pump': return <HeartPumpVisual />;
        case 'vessel-flow': return <VesselFlowVisual />;
        case 'lung-bellows': return <LungBellowsVisual />;
        case 'gas-exchange': return <GasExchangeVisual />;
        case 'renal-filter': return <RenalFilterVisual />;
        case 'renal-tubule': return <RenalTubuleVisual />;
        case 'feedback-loop': return <FeedbackLoopVisual />;
        case 'hormone-factory': return <HormoneFactoryVisual />;
        case 'gi-digestion': return <GiDigestionVisual />;
        case 'gi-absorption': return <GiAbsorptionVisual />;
        case 'neuron': return <NeuronVisual />;
        case 'muscle': return <MuscleVisual />;
        default: return <GenericVisual />;
    }
};
