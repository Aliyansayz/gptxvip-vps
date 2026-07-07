import React from 'react';
import { motion } from 'motion/react';

export const ImpliedVolatilityExpansion = () => {
    return (
        <div className="w-full min-h-[300px] flex rounded-xl overflow-hidden relative border-2 border-zinc-800 shadow-xl bg-zinc-900 justify-center items-center">
            {/* Background Grid */}
            <svg viewBox="0 0 400 200" className="absolute inset-0 w-full h-full opacity-20">
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
                <rect width="400" height="200" fill="url(#grid)" />
            </svg>

            <div className="absolute top-4 left-4 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-md border border-zinc-700 z-20">
                Implied Volatility (IV) Wave
            </div>

            {/* Event Line */}
            <div className="absolute left-[60%] top-0 bottom-0 w-[2px] border-l-2 border-dashed border-red-500/50 flex flex-col items-center">
                <span className="text-[10px] font-bold text-red-400 bg-zinc-900/80 px-2 py-1 mt-4 rounded-md border border-red-500/30 whitespace-nowrap -translate-x-1/2">
                    EARNINGS EVENT
                </span>
            </div>

            {/* The SVG animation for IV crush */}
            <svg viewBox="0 0 400 200" className="w-full h-full relative z-10" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="ivGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#60a5fa" />
                        <stop offset="60%" stopColor="#ef4444" />
                        <stop offset="80%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                </defs>
                <motion.path 
                    d="M 0 100 
                       Q 10 95, 20 100 T 40 100 T 60 100 T 80 100 T 100 100 
                       Q 110 90, 120 100 T 140 95 T 160 105 T 180 90 T 200 110
                       Q 210 70, 220 120 T 235 50 T 245 150
                       L 245 100
                       M 245 100
                       Q 250 100, 260 100 T 280 100 T 300 100 T 320 100 T 340 100 T 360 100 T 380 100 T 400 100" 
                    fill="none" 
                    stroke="url(#ivGrad)" 
                    strokeWidth="3" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                />
                <motion.path 
                    d="M 0 100 
                       Q 10 90, 20 100 T 40 95 T 60 105 T 80 90 T 100 110 
                       Q 110 80, 120 110 T 140 85 T 160 120 T 180 70 T 200 130
                       Q 210 40, 220 160 T 235 20 T 245 180
                       L 245 100
                       M 245 100
                       Q 250 95, 260 100 T 280 100 T 300 100 T 320 100 T 340 100 T 360 100 T 380 100 T 400 100" 
                    fill="none" 
                    stroke="url(#ivGrad)" 
                    strokeWidth="3" 
                    opacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, ease: "linear", repeat: Infinity, delay: 0.1 }}
                />
            </svg>
            
            <div className="absolute right-4 bottom-4 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-900/30 backdrop-blur px-3 py-1.5 rounded-md border border-emerald-500/30 z-20">
                IV Crush
            </div>
            <div className="absolute left-[40%] bottom-4 text-[10px] uppercase font-bold text-red-400 bg-red-900/30 backdrop-blur px-3 py-1.5 rounded-md border border-red-500/30 z-20 -translate-x-1/2">
                IV Expansion
            </div>
        </div>
    )
}
