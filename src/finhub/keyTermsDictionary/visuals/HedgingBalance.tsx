import React from 'react';
import { motion } from 'motion/react';
import { FileText, ShieldAlert } from 'lucide-react';

export const HedgingBalance = () => {
    return (
        <div className="w-full min-h-[300px] flex items-center justify-center bg-zinc-900 rounded-xl relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full" />

            <motion.div 
                className="w-[300px] sm:w-[400px] h-20 border-b-4 border-zinc-500 flex items-end justify-between relative origin-bottom"
                initial={{ rotate: -8 }}
                animate={{ rotate: 8 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 4, ease: 'easeInOut' }}
            >
                {/* Fulcrum base */}
                <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-zinc-400" />
                
                {/* Left side: Tech Stocks */}
                <div className="w-32 flex flex-col items-center translate-y-3 pl-4 sm:pl-8">
                    <div className="relative">
                        <FileText size={48} className="text-blue-500 absolute -top-4 -left-3 rotate-[-15deg] opacity-40 blur-[1px]" />
                        <FileText size={48} className="text-blue-400 absolute -top-2 left-2 rotate-[5deg] opacity-70" />
                        <FileText size={48} className="text-blue-300 relative z-10 bg-zinc-900 drop-shadow-xl" />
                    </div>
                    <span className="text-[11px] font-bold text-blue-200 mt-3 bg-blue-900/50 px-2 py-1 rounded">Long Position Focus</span>
                </div>

                {/* Right side: Puts */}
                <div className="w-32 flex flex-col items-center translate-y-3 pr-4 sm:pr-8">
                    <div className="relative">
                        {/* Shimmer pulse on shield */}
                        <motion.div 
                            className="absolute inset-0 bg-emerald-400 blur-[20px] z-0"
                            animate={{ opacity: [0.2, 0.6, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <ShieldAlert size={56} className="text-emerald-400 relative z-10 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-200 mt-2 bg-emerald-900/50 px-2 py-1 rounded flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Protective Put</span>
                </div>
            </motion.div>
        </div>
    )
}
