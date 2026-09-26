import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Activity, Thermometer, ShieldAlert } from 'lucide-react';

interface ExerciseProps {
  exercise: any;
  onComplete: () => void;
}

export const VolatilityResponseVisual: React.FC<ExerciseProps> = ({ exercise }) => {
  const [volatility, setVolatility] = useState(0.5);
  const [prices, setPrices] = useState<number[]>(Array(50).fill(100));
  const [inventory, setInventory] = useState(0);
  const [pnl, setPnl] = useState(0);

  // Simple Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const lastPrice = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 10 * volatility;
        const newPrice = lastPrice + change;
        return [...prev.slice(1), newPrice];
      });

      // Simple market making logic: if we have inventory, pnl changes based on price
      // This is a very basic simulation of a market maker's exposure
      if (Math.abs(inventory) > 0) {
        const lastChange = (Math.random() - 0.5) * volatility;
        setPnl(p => p + (inventory * lastChange));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [volatility, inventory]);

  const maxPrice = Math.max(...prices, 110);
  const minPrice = Math.min(...prices, 90);
  const range = maxPrice - minPrice;

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Simulation Chart */}
        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden h-64">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Live Market Feed</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-500">VOL: {(volatility * 100).toFixed(0)}%</div>
           </div>
           
           <div className="relative w-full h-32 mt-4 flex items-end gap-[2px]">
              {prices.map((p, i) => {
                const height = ((p - minPrice) / range) * 100;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 bg-blue-500/30 rounded-t-sm"
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                );
              })}
           </div>
        </div>

        {/* Controls & Stats */}
        <div className="flex flex-col gap-4 justify-between">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Risk Parameters</h4>
                 <Thermometer className={`w-4 h-4 ${volatility > 0.7 ? 'text-red-500' : 'text-emerald-500'}`} />
              </div>
              
              <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-bold uppercase text-zinc-400 mb-2 block tracking-tight">System Volatility</label>
                   <input 
                    type="range" 
                    min="0.1" 
                    max="1.5" 
                    step="0.1" 
                    value={volatility} 
                    onChange={(e) => setVolatility(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Exposure</p>
                      <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 font-mono italic">{inventory} LOTS</p>
                   </div>
                   <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-[10px] uppercase font-bold text-zinc-400 mb-1">Unrealized PnL</p>
                      <p className={`text-sm font-bold font-mono ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                      </p>
                   </div>
                </div>
              </div>
           </div>

           <div className="flex gap-2">
              <button 
                onClick={() => setInventory(prev => prev + 10)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
              >
                Go Long
              </button>
              <button 
                onClick={() => setInventory(prev => prev - 10)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg active:scale-95"
              >
                Go Short
              </button>
              <button 
                onClick={() => { setInventory(0); setPnl(0); }}
                className="px-4 py-3 bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-100 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-zinc-300 transition-all shadow-sm"
              >
                Square
              </button>
           </div>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h5 className="text-xs font-bold text-blue-700 dark:text-blue-300">Market Maker Challenge</h5>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80 leading-relaxed mt-1 italic">
            At high volatility levels, bid-ask spreads typically widen and inventory risk increases. Try to maintain a positive PnL while navigating extreme volatility spikes.
          </p>
        </div>
      </div>
    </div>
  );
};
