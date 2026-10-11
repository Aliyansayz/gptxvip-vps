import React from 'react';
import { motion } from 'motion/react';

export const LimitOrderInOrderBook = () => {
    return (
        <div className="w-full min-h-[300px] bg-zinc-900 rounded-xl p-6 flex flex-col justify-center font-mono">
            <div className="grid grid-cols-2 gap-px bg-zinc-700/50 rounded-lg overflow-hidden border border-zinc-700">
                <div className="bg-zinc-800">
                    <div className="bg-zinc-900 px-4 py-3 text-xs text-zinc-500 border-b border-zinc-700 text-center font-bold">BIDS (Buyers)</div>
                    <div className="px-4 py-3 text-emerald-500 flex justify-between border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"><span className="text-zinc-300">10.02</span><span>400</span></div>
                    <div className="px-4 py-3 text-emerald-500 flex justify-between border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"><span className="text-zinc-300">10.01</span><span>850</span></div>
                    {/* The highlighted limit order */}
                    <div className="relative border my-1 mx-2">
                        <motion.div 
                            className="absolute inset-0 bg-emerald-500/20 border border-emerald-400/50 rounded"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        />
                        <div className="relative px-4 py-3 text-emerald-400 flex justify-between min-h-[46px] items-center">
                            <span className="font-bold relative z-10">10.00</span>
                            <span className="font-bold relative z-10">1,000</span>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[90%] whitespace-nowrap bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-500 text-[10px] px-2.5 py-1 rounded-full text-zinc-800 dark:text-zinc-200 shadow-xl z-20 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Unfilled Limit Buy
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 text-emerald-500 flex justify-between hover:bg-zinc-700/30 transition-colors"><span className="text-zinc-300">9.99</span><span>1,200</span></div>
                </div>
                <div className="bg-zinc-800">
                    <div className="bg-zinc-900 px-4 py-3 text-xs text-zinc-500 border-b border-zinc-700 text-center font-bold">ASKS (Sellers)</div>
                    <div className="px-4 py-3 text-red-500 flex justify-between border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"><span>10.03</span><span className="text-zinc-300">300</span></div>
                    <div className="px-4 py-3 text-red-500 flex justify-between border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"><span>10.04</span><span className="text-zinc-300">650</span></div>
                    <div className="px-4 py-3 text-red-500 flex justify-between border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"><span>10.05</span><span className="text-zinc-300">1,100</span></div>
                    <div className="px-4 py-3 text-red-500 flex justify-between hover:bg-zinc-700/30 transition-colors"><span>10.06</span><span className="text-zinc-300">200</span></div>
                </div>
            </div>
        </div>
    )
}
