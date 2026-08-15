import React from 'react';
import { motion } from 'motion/react';

export const CorrelationScatterPlots = () => {
    // Generate some points
    const posPoints = Array.from({length: 30}).map((_, i) => ({ x: 10 + i * 2.5, y: 90 - i * 2.5 + (Math.random() * 20 - 10) }));
    const negPoints = Array.from({length: 30}).map((_, i) => ({ x: 10 + i * 2.5, y: 10 + i * 2.5 + (Math.random() * 20 - 10) }));
    const zeroPoints = Array.from({length: 30}).map((_, i) => ({ x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }));

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px] bg-zinc-900 rounded-xl p-4">
            <div className="flex flex-col items-center border border-zinc-800 rounded-lg p-3 relative h-[250px] md:h-auto">
                <span className="text-[10px] uppercase font-bold text-emerald-400 mb-2">Positive (1.0)</span>
                <svg viewBox="0 0 100 100" className="w-full h-full flex-1 overflow-visible">
                    {posPoints.map((p, i) => (
                        <motion.circle key={i} cx={Math.max(5, Math.min(95, p.x))} cy={Math.max(5, Math.min(95, p.y))} r="3" fill="#10b981" 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                        />
                    ))}
                    <line x1="10" y1="90" x2="90" y2="10" stroke="#10b981" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="4" />
                </svg>
            </div>
            <div className="flex flex-col items-center border border-zinc-800 rounded-lg p-3 relative h-[250px] md:h-auto">
                <span className="text-[10px] uppercase font-bold text-red-400 mb-2">Negative (-1.0)</span>
                <svg viewBox="0 0 100 100" className="w-full h-full flex-1 overflow-visible">
                    {negPoints.map((p, i) => (
                        <motion.circle key={i} cx={Math.max(5, Math.min(95, p.x))} cy={Math.max(5, Math.min(95, p.y))} r="3" fill="#ef4444" 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                        />
                    ))}
                    <line x1="10" y1="10" x2="90" y2="90" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="4" />
                </svg>
            </div>
            <div className="flex flex-col items-center border border-zinc-800 rounded-lg p-3 relative h-[250px] md:h-auto">
                <span className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Zero (0.0)</span>
                <svg viewBox="0 0 100 100" className="w-full h-full flex-1 overflow-visible">
                    {zeroPoints.map((p, i) => (
                        <motion.circle key={i} cx={p.x} cy={p.y} r="3" fill="#a1a1aa" 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                        />
                    ))}
                </svg>
            </div>
        </div>
    )
}
