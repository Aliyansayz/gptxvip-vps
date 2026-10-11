import React from 'react';

export const StochasticOscillatorZones = () => {
    return (
        <div className="w-full min-h-[300px] flex flex-col bg-zinc-900 rounded-xl p-4 gap-2">
            <div className="flex-[2] border border-zinc-800 rounded-lg relative bg-black/20 p-2 min-h-[150px]">
                {/* Dummy candlesticks */}
                <span className="absolute top-2 left-2 text-xs font-bold text-zinc-500">Price Chart</span>
                <svg viewBox="0 0 400 150" className="w-full h-full mt-2" preserveAspectRatio="none">
                    <line x1="50" y1="120" x2="50" y2="40" stroke="#10b981" strokeWidth="2" />
                    <rect x="45" y="60" width="10" height="40" fill="#10b981" />

                    <line x1="100" y1="100" x2="100" y2="20" stroke="#10b981" strokeWidth="2" />
                    <rect x="95" y="40" width="10" height="50" fill="#10b981" />

                    <line x1="150" y1="60" x2="150" y2="130" stroke="#ef4444" strokeWidth="2" />
                    <rect x="145" y="70" width="10" height="40" fill="#ef4444" />

                    <line x1="200" y1="70" x2="200" y2="140" stroke="#ef4444" strokeWidth="2" />
                    <rect x="195" y="80" width="10" height="30" fill="#ef4444" />

                    <line x1="250" y1="140" x2="250" y2="60" stroke="#10b981" strokeWidth="2" />
                    <rect x="245" y="80" width="10" height="40" fill="#10b981" />
                    
                    <line x1="300" y1="100" x2="300" y2="30" stroke="#10b981" strokeWidth="2" />
                    <rect x="295" y="40" width="10" height="50" fill="#10b981" />
                </svg>
            </div>
            <div className="flex-1 border border-zinc-800 rounded-lg relative overflow-hidden bg-black/20 min-h-[100px]">
                <span className="absolute top-2 left-2 text-xs font-bold text-zinc-500 z-10 bg-zinc-900/50 px-1 rounded">Stochastic %K / %D</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500 z-10 bg-zinc-900/50 px-1 rounded">80</span>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono text-emerald-500 z-10 bg-zinc-900/50 px-1 rounded">20</span>
                <div className="absolute top-[20%] w-full h-[20%] bg-red-500/10 border-b border-red-500/30" />
                <div className="absolute bottom-[20%] w-full h-[20%] bg-emerald-500/10 border-t border-emerald-500/30" />
                <svg viewBox="0 0 400 80" className="w-full h-full" preserveAspectRatio="none">
                    <path d="M 0 40 Q 50 10, 100 15 T 150 60 T 200 65 T 250 30 T 300 10 T 350 50 T 400 30" fill="none" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M 0 45 Q 50 20, 100 25 T 150 50 T 200 55 T 250 40 T 300 20 T 350 40 T 400 40" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4" />
                </svg>
            </div>
        </div>
    )
}
