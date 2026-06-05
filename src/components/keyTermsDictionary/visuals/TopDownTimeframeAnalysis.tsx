import React from 'react';
import { motion } from 'motion/react';

export const TopDownTimeframeAnalysis = () => {
    return (
        <div className="w-full min-h-[300px] bg-zinc-900 rounded-xl relative p-4 overflow-hidden h-[400px]">
            {/* Daily */}
            <motion.div 
                className="absolute top-4 left-4 w-[60%] h-[50%] bg-zinc-800 border-2 border-zinc-700 rounded-lg shadow-xl p-3 z-10"
                initial={{ x: -20, y: -20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 border-b border-zinc-700 pb-1">DAILY - Macro Trend</div>
                <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M 0 40 L 20 35 L 40 38 L 60 20 L 80 25 L 100 5" fill="none" stroke="#10b981" strokeWidth="2" />
                </svg>
            </motion.div>
            {/* 4H */}
            <motion.div 
                className="absolute top-1/2 left-1/2 w-[60%] h-[50%] bg-zinc-800 border-2 border-zinc-600 rounded-lg shadow-xl p-3 z-20"
                style={{ translateX: "-50%", translateY: "-50%" }}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="text-[10px] uppercase font-bold text-zinc-300 mb-1 border-b border-zinc-600 pb-1">4H - Pullback Zone</div>
                <svg viewBox="0 0 100 50" className="w-full h-full pt-2" preserveAspectRatio="none">
                    <path d="M 0 10 L 30 25 L 60 40 L 100 30" fill="none" stroke="#ef4444" strokeWidth="2" />
                </svg>
            </motion.div>
            {/* 15m */}
            <motion.div 
                className="absolute bottom-4 right-4 w-[60%] h-[50%] bg-zinc-800 border-2 border-emerald-500 rounded-lg shadow-2xl p-3 z-30"
                initial={{ x: 20, y: 20, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="text-[10px] uppercase font-bold text-emerald-400 mb-1 border-b border-emerald-500/50 pb-1">15m - Entry Pattern (Bullish Engulfing)</div>
                <div className="flex h-full items-center justify-center gap-3">
                    <div className="h-10 w-3 bg-red-500 rounded-sm relative"><div className="absolute w-[2px] h-14 bg-red-500 left-1/2 -translate-x-1/2 -top-2" /></div>
                    <div className="h-20 w-3 bg-emerald-500 rounded-sm relative shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute w-[2px] h-24 bg-emerald-500 left-1/2 -translate-x-1/2 -top-2" /></div>
                </div>
            </motion.div>
        </div>
    )
}
