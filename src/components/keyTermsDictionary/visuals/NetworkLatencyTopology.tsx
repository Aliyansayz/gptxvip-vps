import React from 'react';
import { motion } from 'motion/react';
import { Server, Zap, Timer } from 'lucide-react';

export const NetworkLatencyTopology = () => {
    return (
        <div className="w-full min-h-[300px] flex items-center justify-between px-4 sm:px-10 bg-zinc-900 rounded-xl relative overflow-hidden">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-xl flex items-center justify-center text-blue-500 mb-4 z-10 bg-zinc-900 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <Server size={32} />
                </div>
                <span className="text-xs font-bold text-zinc-400 text-center max-w-[100px]">Algo Trading Server</span>
            </div>

            {/* Fiber Line background */}
            <div className="absolute left-[80px] right-[80px] top-[150px] sm:top-[140px] h-1.5 bg-zinc-800 z-0 overflow-hidden rounded-full">
                {/* Moving light pulse representing data */}
                <motion.div 
                    className="h-full w-24 bg-emerald-400 shadow-[0_0_10px_#34d399,0_0_20px_#34d399] rounded-full blur-[1px]"
                    initial={{ left: "-100px", position: "relative" }}
                    animate={{ left: "120%" }}
                    transition={{ duration: 1, ease: "linear", repeat: Infinity }}
                />
            </div>
            
            <div className="absolute top-[60px] sm:top-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center text-emerald-400 z-10">
                <Timer size={28} className="mb-2" />
                <span className="text-[11px] font-mono font-bold bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700 shadow-lg flex items-center gap-2">
                    Latency
                    <span className="text-white">1.5 μs</span>
                </span>
            </div>

            <div className="flex flex-col items-center relative gap-0">
                <div className="w-16 h-16 bg-fuchsia-500/20 border-2 border-fuchsia-500 rounded-xl flex items-center justify-center text-fuchsia-500 mb-4 z-10 bg-zinc-900 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                    <Zap size={32} />
                </div>
                <span className="text-xs font-bold text-zinc-400 text-center max-w-[100px]">Exchange Matching Engine</span>
            </div>
        </div>
    )
}
