import React from 'react';
import { motion } from 'motion/react';

export const LiquidityConsumptionLevel2 = () => {
    return (
        <div className="w-full min-h-[300px] bg-zinc-900 rounded-xl p-6 flex flex-col relative overflow-hidden font-mono text-sm shadow-inner">
            <h4 className="text-xs font-bold text-zinc-400 mb-6 uppercase tracking-widest text-center border-b border-zinc-800 pb-4">Level 2 Limit Order Book</h4>
            <div className="flex-1 flex flex-col gap-[2px] pr-[35%] relative">
                {/* Asks */}
                <div className="relative h-8 flex items-center px-4 bg-red-500/10 rounded-sm overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-red-500 w-[80%] opacity-20" />
                    <span className="text-red-400 font-bold z-10 w-24">400.05</span>
                    <span className="ml-auto text-zinc-300 z-10">1,200</span>
                </div>
                <div className="relative h-8 flex items-center px-4 bg-red-500/10 rounded-sm overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-red-500 w-[50%] opacity-20" />
                    <span className="text-red-400 font-bold z-10 w-24">400.04</span>
                    <span className="ml-auto text-zinc-300 z-10">500</span>
                </div>
                
                {/* The eaten orders */}
                <motion.div 
                    className="relative h-8 flex items-center px-4 rounded-sm overflow-hidden border border-red-500/50 my-0.5"
                    initial={{ backgroundColor: "rgba(239,68,68,0.15)", scale: 1 }}
                    animate={{ backgroundColor: "rgba(0,0,0,0)", scale: 0.98, opacity: 0.3 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                >
                    <div className="absolute top-0 right-0 h-full bg-red-500 w-[30%] opacity-20" />
                    <span className="text-red-400 font-bold z-10 w-24 line-through">400.03</span>
                    <span className="ml-auto text-zinc-300 z-10 line-through">200</span>
                </motion.div>
                <motion.div 
                    className="relative h-8 flex items-center px-4 rounded-sm overflow-hidden border border-red-500/50 my-0.5"
                    initial={{ backgroundColor: "rgba(239,68,68,0.15)", scale: 1 }}
                    animate={{ backgroundColor: "rgba(0,0,0,0)", scale: 0.98, opacity: 0.3 }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.15 }}
                >
                    <div className="absolute top-0 right-0 h-full bg-red-500 w-[60%] opacity-20" />
                    <span className="text-red-400 font-bold z-10 w-24 line-through">400.02</span>
                    <span className="ml-auto text-zinc-300 z-10 line-through">800</span>
                </motion.div>

                {/* Spread */}
                <div className="my-2 border-t border-b border-zinc-700 py-1.5 text-[11px] text-zinc-500 flex justify-between items-center px-2">
                    <span>SPREAD: 0.02</span>
                    <span className="flex-1 border-b border-dashed border-zinc-700 mx-2" />
                    <span className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center">↕</span>
                </div>

                {/* Bids */}
                <div className="relative h-8 flex items-center px-4 bg-emerald-500/10 rounded-sm overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-emerald-500 w-[40%] opacity-20" />
                    <span className="text-emerald-400 font-bold z-10 w-24">400.00</span>
                    <span className="ml-auto text-zinc-300 z-10">450</span>
                </div>
                <div className="relative h-8 flex items-center px-4 bg-emerald-500/10 rounded-sm overflow-hidden">
                    <div className="absolute top-0 right-0 h-full bg-emerald-500 w-[90%] opacity-20" />
                    <span className="text-emerald-400 font-bold z-10 w-24">399.99</span>
                    <span className="ml-auto text-zinc-300 z-10">2,000</span>
                </div>
            </div>

            {/* The eating order */}
            <motion.div 
                className="absolute right-6 top-[40%] bg-blue-600/90 backdrop-blur-md border-2 border-blue-400 rounded-xl p-3 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center min-w-[120px] z-20"
                initial={{ y: 80, scale: 0.9, opacity: 0 }}
                animate={{ y: -50, scale: 1.05, opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[8px] border-r-blue-400 border-b-[8px] border-b-transparent" />
                <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider mb-1">Incoming</span>
                <span className="text-[11px] font-bold text-white mb-0.5">MARKET BUY</span>
                <span className="text-xl font-black tabular-nums">1,000</span>
            </motion.div>
        </div>
    )
}
