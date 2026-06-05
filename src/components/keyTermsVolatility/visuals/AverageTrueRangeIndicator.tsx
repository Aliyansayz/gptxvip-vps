import React from 'react';
import { motion } from 'motion/react';

export const AverageTrueRangeIndicator = () => {
    return (
        <div className="w-full min-h-[300px] flex flex-col bg-zinc-900 rounded-xl p-4 gap-2 border-2 border-zinc-800 shadow-xl overflow-hidden font-mono">
            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-md border border-zinc-700 z-20">
                True Range Bounding System
            </span>
            <div className="flex-1 w-full relative pt-10 pb-4 flex justify-center items-center">
                <svg viewBox="0 0 200 100" className="w-full max-w-[400px] h-full overflow-visible">
                    {/* Previous Close Line */}
                    <line x1="20" y1="40" x2="60" y2="40" stroke="#71717a" strokeWidth="1" strokeDasharray="2" />
                    <text x="5" y="42" fill="#71717a" fontSize="5">Prev Close</text>

                    {/* Gap Up Candlestick */}
                    <line x1="80" y1="10" x2="80" y2="35" stroke="#10b981" strokeWidth="2" />
                    <rect x="75" y="15" width="10" height="15" fill="#10b981" />
                    
                    {/* True Range High/Low markers */}
                    <motion.line x1="72" y1="10" x2="88" y2="10" stroke="#f43f5e" strokeWidth="1" 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    />
                    <motion.line x1="72" y1="40" x2="88" y2="40" stroke="#f43f5e" strokeWidth="1" 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                    />

                    {/* Bounding Box measuring True Range */}
                    <motion.rect x="72" y="10" width="16" height="30" fill="none" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="1"
                        initial={{ height: 0, y: 40 }}
                        animate={{ height: 30, y: 10 }}
                        transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
                    />
                    
                    {/* Animated measuring ruler line connecting down to indicator */}
                    <motion.path 
                        d="M 80 40 L 80 120"
                        stroke="#f43f5e"
                        strokeWidth="0.5"
                        strokeDasharray="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 2.5 }}
                    />
                    
                    <motion.text x="92" y="27" fill="#f43f5e" fontSize="5" fontWeight="bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                    >
                        True Range: max(High-Low, |High-PrevClose|, |Low-PrevClose|)
                    </motion.text>
                </svg>
            </div>
            <div className="h-[80px] w-full border-t border-zinc-700 relative pt-2 flex justify-center">
                <span className="absolute top-2 left-2 text-[10px] text-zinc-500">ATR(14)</span>
                <svg viewBox="0 0 200 40" className="w-full max-w-[400px] h-full overflow-visible">
                    <motion.path 
                        d="M 10 30 Q 30 25, 50 20 T 80 10 T 110 5 T 140 15 T 180 8" 
                        fill="none" 
                        stroke="#f43f5e" 
                        strokeWidth="1.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "linear" }}
                    />
                    {/* Data point dot tracking the calculation above */}
                    <motion.circle cx="80" cy="10" r="2" fill="#f43f5e"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.5, 1], opacity: 1 }}
                        transition={{ delay: 3.5, duration: 0.5 }}
                    />
                </svg>
            </div>
        </div>
    )
}
