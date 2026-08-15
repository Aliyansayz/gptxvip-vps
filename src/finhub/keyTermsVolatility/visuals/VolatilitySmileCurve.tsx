import React from 'react';
import { motion } from 'motion/react';

export const VolatilitySmileCurve = () => {
    return (
        <div className="w-full min-h-[300px] flex items-center justify-center rounded-xl relative border-2 border-zinc-800 shadow-xl bg-zinc-900 p-8 overflow-hidden font-mono">
            <span className="absolute top-4 left-4 text-[10px] uppercase font-bold text-zinc-400 bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-md border border-zinc-700 z-20">
                Put Skew / Volatility Smile
            </span>
            
            <div className="w-full max-w-[400px] h-full relative">
                <svg viewBox="0 0 100 80" className="w-full h-[200px] overflow-visible">
                    {/* Y Axis: Implied Volatility */}
                    <line x1="10" y1="70" x2="10" y2="10" stroke="#52525b" strokeWidth="1" strokeDasharray="2" />
                    <text x="5" y="40" fill="#a1a1aa" fontSize="4" textAnchor="middle" transform="rotate(-90 5 40)">Implied Volatility (IV %)</text>
                    
                    {/* X Axis: Strike Price */}
                    <line x1="10" y1="70" x2="95" y2="70" stroke="#52525b" strokeWidth="1" strokeDasharray="2" />
                    <text x="50" y="78" fill="#a1a1aa" fontSize="4" textAnchor="middle">Strike Price</text>

                    {/* The ATM Line */}
                    <line x1="60" y1="70" x2="60" y2="10" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2" opacity="0.5" />
                    <text x="60" y="8" fill="#fbd38d" fontSize="4" textAnchor="middle" fontWeight="bold">ATM</text>
                    
                    {/* OTM Puts and Calls labels */}
                    <text x="30" y="8" fill="#fca5a5" fontSize="4" textAnchor="middle">OTM Puts</text>
                    <text x="85" y="8" fill="#86efac" fontSize="4" textAnchor="middle">OTM Calls</text>

                    {/* The Smile Curve */}
                    <motion.path 
                        d="M 15 20 Q 40 65, 60 55 T 90 40" 
                        fill="none" 
                        stroke="#a855f7" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0px 0px 5px rgba(168, 85, 247, 0.8))' }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                    
                    {/* Data Points on the Curve */}
                    {[
                        { x: 15, y: 20, color: '#ef4444' }, // Deep OTM Put
                        { x: 28, y: 39, color: '#f87171' },
                        { x: 42, y: 52, color: '#fb923c' },
                        { x: 60, y: 55, color: '#fcd34d' }, // ATM
                        { x: 75, y: 47.5, color: '#a3e635' },
                        { x: 90, y: 40, color: '#4ade80' }  // Deep OTM Call
                    ].map((pt, i) => (
                        <motion.circle 
                            key={i} 
                            cx={pt.x} 
                            cy={pt.y} 
                            r="1.5" 
                            fill={pt.color} 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 2 + (i * 0.1) }}
                            style={{ filter: `drop-shadow(0px 0px 3px ${pt.color})` }}
                        />
                    ))}
                </svg>
            </div>
        </div>
    )
}
