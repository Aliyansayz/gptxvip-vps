import React from 'react';
import { motion } from 'motion/react';

export const MarketRegimeSegmentation = () => {
    return (
        <div className="w-full min-h-[300px] flex rounded-xl overflow-hidden relative border-2 border-zinc-800 shadow-xl bg-zinc-900">
            {/* Range Based Grid Background */}
            <div className="w-1/2 h-full bg-blue-900/40 relative flex items-center justify-center border-r-2 border-dashed border-zinc-500 z-0 group">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
                <span className="absolute top-4 left-4 text-[10px] uppercase font-bold text-blue-300 bg-blue-900/80 backdrop-blur px-3 py-1.5 rounded-md border border-blue-500/30 z-20">Range Bound Regime</span>
                
                {/* Horizontal range bounds */}
                <div className="absolute top-[40%] w-full h-[2px] border-b-2 border-dashed border-blue-500/50" />
                <div className="absolute top-[60%] w-full h-[2px] border-b-2 border-dashed border-blue-500/50" />
            </div>

            {/* Trend Based Grid Background */}
            <div className="w-1/2 h-full bg-emerald-900/40 relative flex items-center justify-center z-0">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent" />
                <span className="absolute top-4 left-4 text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900/80 backdrop-blur px-3 py-1.5 rounded-md border border-emerald-500/30 z-20">Trend Bound Regime</span>
            </div>

            {/* Continuous SVG Chart Line Layer */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="50%" stopColor="#60a5fa" />
                            <stop offset="50%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                    </defs>
                    <motion.path 
                        d="M 0 150 L 20 140 L 40 160 L 60 135 L 80 165 L 100 145 L 120 155 L 140 140 L 160 160 L 180 145 L 200 150 L 220 145 L 240 110 L 260 120 L 280 80 L 300 90 L 320 40 L 340 50 L 360 10 L 380 20 L 400 -10" 
                        fill="none" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="4" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
                    />
                </svg>
            </div>
            
            {/* Breakout Pulse Node at the exact intersection */}
            <motion.div 
                className="absolute w-6 h-6 bg-emerald-400 rounded-full shadow-[0_0_30px_#34d399] flex items-center justify-center z-20 mix-blend-screen"
                style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            />
        </div>
    )
}
