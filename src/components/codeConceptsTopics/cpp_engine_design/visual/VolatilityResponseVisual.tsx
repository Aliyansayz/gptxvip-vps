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
  const [autoSpread, setAutoSpread] = useState(true);
  const [spread, setSpread] = useState(0.2);

  // Simple Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const lastPrice = prev[prev.length - 1];
        // Mean reversion + Volatility
        const change = (Math.random() - 0.5) * 5 * volatility;
        const drift = (100 - lastPrice) * 0.05;
        const newPrice = lastPrice + change + drift;
        return [...prev.slice(1), newPrice];
      });

      if (Math.abs(inventory) > 0) {
        // Carry cost and price movement impact
        const lastChange = (Math.random() - 0.5) * volatility;
        setPnl(p => p + (inventory * lastChange) - (Math.abs(inventory) * 0.001));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [volatility, inventory]);

  const currentPrice = prices[prices.length - 1];
  const maxPrice = Math.max(...prices, 110);
  const minPrice = Math.min(...prices, 90);
  const range = maxPrice - minPrice;

  // Auto-adjust spread based on volatility
  useEffect(() => {
    if (autoSpread) {
      setSpread(volatility * 0.5);
    }
  }, [volatility, autoSpread]);

  const bid = currentPrice - spread / 2;
  const ask = currentPrice + spread / 2;

  const handleTrade = (side: 'buy' | 'sell') => {
    const size = 10;
    if (side === 'buy') {
      setInventory(prev => prev + size);
      // PnL impact: paying the spread
      setPnl(p => p - (size * (spread / 2)));
    } else {
      setInventory(prev => prev - size);
      // PnL impact: paying the spread
      setPnl(p => p - (size * (spread / 2)));
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-mono">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Charting Area */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Primary_Asset_Feed</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Volatility_Scale</span>
                    <span className={`text-sm font-black ${volatility > 1.0 ? 'text-red-500' : 'text-blue-400'}`}>
                      {(volatility * 100).toFixed(1)}%
                    </span>
                 </div>
                 <div className="w-px h-8 bg-zinc-800" />
                 <div className="flex flex-col items-end">
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Spread_Depth</span>
                    <span className="text-sm font-black text-emerald-400">${spread.toFixed(3)}</span>
                 </div>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center">
              {/* Price Line Visualization */}
              <svg className="w-full h-full overflow-visible">
                 <polyline
                   fill="none"
                   stroke="rgba(59, 130, 246, 0.4)"
                   strokeWidth="2"
                   points={prices.map((p, i) => `${(i / (prices.length - 1)) * 100}%,${100 - ((p - minPrice) / range) * 100}`).join(' ')}
                   style={{ vectorEffect: 'non-scaling-stroke' }}
                 />
                 {/* Bid/Ask Shaded Zone */}
                 <rect 
                    x="0" 
                    y={`${100 - ((ask - minPrice) / range) * 100}%`}
                    width="100%"
                    height={`${(spread / range) * 100}%`}
                    className="fill-emerald-500/10 stroke-emerald-500/30"
                 />
                 {/* Current Price Marker */}
                 <line 
                   x1="100%" x2="0" 
                   y1={`${100 - ((currentPrice - minPrice) / range) * 100}%`} 
                   y2={`${100 - ((currentPrice - minPrice) / range) * 100}%`}
                   stroke="rgba(255,255,255,0.1)"
                   strokeDasharray="4 4"
                 />
              </svg>

              {/* Price Overlay labels */}
              <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-2 pointer-events-none">
                 <span className="text-[9px] text-zinc-600">${maxPrice.toFixed(2)}</span>
                 <span className="text-[9px] text-zinc-600">${minPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-zinc-500">
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 font-bold">
                     <div className="w-2 h-2 rounded bg-red-400" />
                     <span className="text-[10px] uppercase">Ask: ${ask.toFixed(3)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold">
                     <div className="w-2 h-2 rounded bg-emerald-400" />
                     <span className="text-[10px] uppercase">Bid: ${bid.toFixed(3)}</span>
                  </div>
               </div>
               <span className="text-[10px] italic">Mean_Rev: {(100 - currentPrice).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Controls & Metrics Panel */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 shadow-lg">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <Thermometer className="w-3 h-3" /> Risk_Adjusters
             </h4>
             
             <div className="space-y-6">
                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Market Volatility</label>
                      <span className="text-[10px] font-mono text-blue-400">{(volatility * 100).toFixed(0)} BP</span>
                   </div>
                   <input 
                    type="range" min="0.1" max="2.0" step="0.1"
                    value={volatility} 
                    onChange={(e) => setVolatility(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                   />
                </div>

                <div className="space-y-3">
                   <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase text-zinc-400">Manual Spread</label>
                      <button 
                        onClick={() => setAutoSpread(!autoSpread)}
                        className={`text-[8px] px-1.5 py-0.5 rounded border ${autoSpread ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}
                      >
                        {autoSpread ? 'AUTO: ON' : 'MANUAL'}
                      </button>
                   </div>
                   <input 
                    type="range" min="0.05" max="1.5" step="0.05"
                    disabled={autoSpread}
                    value={spread} 
                    onChange={(e) => setSpread(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-30"
                   />
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
              <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase">Inventory</span>
                 <span className={`text-sm font-black italic ${inventory === 0 ? 'text-zinc-500' : inventory > 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                    {inventory > 0 ? '+' : ''}{inventory} QTY
                 </span>
              </div>
              <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase">Realized PnL</span>
                 <span className={`text-sm font-black ${pnl >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    ${pnl.toFixed(2)}
                 </span>
              </div>
          </div>

          <div className="flex gap-2">
              <button 
                onClick={() => handleTrade('buy')}
                className="flex-1 py-4 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1"
              >
                Buy (Ask)
              </button>
              <button 
                onClick={() => handleTrade('sell')}
                className="flex-1 py-4 bg-red-600/90 hover:bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest transition-all border-b-4 border-red-900 active:border-b-0 active:translate-y-1"
              >
                Sell (Bid)
              </button>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-start gap-4"
      >
        <div className={`p-2 rounded-lg ${volatility > 1.2 ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
           <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Risk_Advisory_System</h5>
          <p className="text-[11px] text-zinc-500 leading-relaxed italic">
            {volatility > 1.0 
              ? "Critical Volatility Detected. Inventory exposure represents extreme tail-risk. Recommend widening spreads to 50+ ticks or squaring positions immediately."
              : "Standard Market Regime. Maintain delta-neutrality through active spread management. Pay attention to mean reversion drift at price extremes."}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
