import React from 'react';

export const ToxidromeMonitorVisual: React.FC = () => {
    return (
        <div className="relative w-full aspect-video bg-slate-100 dark:bg-blue-950 rounded-xl border-4 border-slate-300 dark:border-blue-900 p-4 flex flex-col font-mono overflow-hidden">
            <div className="flex justify-between items-center mb-2 border-b border-slate-300 dark:border-blue-800 pb-1">
                <span className="text-green-600 dark:text-green-400 text-[10px]">BED 4 - TOXICOLOGY</span>
                <span className="text-red-600 dark:text-red-400 text-[10px] animate-pulse">ALARM</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
                <div className="bg-white dark:bg-blue-900/50 p-1 rounded border border-slate-200 dark:border-blue-800">
                    <div className="text-green-600 dark:text-green-400 text-[6px]">HR (bpm)</div>
                    <div className="text-green-500 dark:text-green-300 text-xl leading-none">145</div>
                    <svg viewBox="0 0 100 20" className="w-full h-3 mt-1">
                        <path d="M0 10 L10 10 L15 0 L20 20 L25 10 L35 10 L40 0 L45 20 L50 10 L100 10" fill="none" stroke="#22c55e" strokeWidth="1" className="animate-[dash_1s_linear_infinite]" strokeDasharray="50" />
                    </svg>
                </div>
                <div className="bg-white dark:bg-blue-900/50 p-1 rounded border border-slate-200 dark:border-blue-800">
                    <div className="text-orange-600 dark:text-orange-400 text-[6px]">TEMP (°C)</div>
                    <div className="text-orange-500 dark:text-orange-300 text-xl leading-none">39.2</div>
                    <div className="text-orange-600/50 dark:text-orange-400/50 text-[6px] mt-1">HYPERTHERMIA</div>
                </div>
                <div className="bg-white dark:bg-blue-900/50 p-1 rounded border border-slate-200 dark:border-blue-800">
                    <div className="text-blue-600 dark:text-blue-400 text-[6px]">PUPILS</div>
                    <div className="flex gap-2 mt-1 justify-center">
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-blue-800 flex items-center justify-center border border-slate-300 dark:border-blue-700">
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-black"></div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-blue-800 flex items-center justify-center border border-slate-300 dark:border-blue-700">
                            <div className="w-3.5 h-3.5 rounded-full bg-slate-800 dark:bg-black"></div>
                        </div>
                    </div>
                    <div className="text-blue-500 dark:text-blue-300 text-[6px] mt-1 text-center">MYDRIASIS</div>
                </div>
                <div className="bg-white dark:bg-blue-900/50 p-1 rounded flex flex-col justify-center border border-slate-200 dark:border-blue-800">
                    <div className="text-purple-600 dark:text-purple-400 text-[6px]">SKIN</div>
                    <div className="text-purple-500 dark:text-purple-300 text-xs mt-1">DRY</div>
                    <div className="text-purple-500 dark:text-purple-300 text-xs">FLUSHED</div>
                </div>
            </div>
        </div>
    );
};
