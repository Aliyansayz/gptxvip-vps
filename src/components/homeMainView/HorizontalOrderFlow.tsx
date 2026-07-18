import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  Terminal,
  Layers
} from 'lucide-react';

export const HorizontalOrderFlow = ({ externalPrice }: { externalPrice?: number }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (scrollRef.current.scrollWidth - scrollRef.current.clientWidth) / 2;
    }
  }, []);

  const [price, setPrice] = useState(externalPrice || 42065.50);
  const [lastTick, setLastTick] = useState('up');
  const [logs, setLogs] = useState([
    { id: '1', type: 'buy', qty: '1.2 Lot', price: '42065.50', time: '12:04:01', aggressive: true },
    { id: '2', type: 'sell', qty: '0.5 Lot', price: '42065.00', time: '12:04:02', aggressive: false },
  ]);

  useEffect(() => {
    if (externalPrice !== undefined) {
      setPrice(prev => {
        setLastTick(externalPrice > prev ? 'up' : 'down');
        return externalPrice;
      });
    }
  }, [externalPrice]);

  // Simulate continuous log generation based on price changes
  const lastPriceRef = useRef<number>(price);
  const logCounterRef = useRef<number>(100);

  useEffect(() => {
    if (externalPrice !== undefined && externalPrice !== lastPriceRef.current) {
      const isUp = externalPrice > lastPriceRef.current;
      lastPriceRef.current = externalPrice;
      
      const newLog = {
        id: `${Date.now()}-${logCounterRef.current++}`,
        type: Math.random() > 0.5 ? 'buy' : 'sell', // Keep order direction somewhat random despite price tick direction
        qty: (Math.random() * 2.5 + 0.1).toFixed(2) + ' Lot',
        price: externalPrice.toFixed(2),
        time: new Date().toISOString().substring(11, 23), // Get hh:mm:ss.sss
        aggressive: Math.random() > 0.6
      };
      setLogs(prevLogs => [newLog, ...prevLogs].slice(0, 50));
    }
  }, [externalPrice]);

  // Generate Horizontal Data Levels dynamically based on price
  const generateLevels = () => {
    const levels = [];
    const step = 0.5;
    const range = 15;

    // Asks (Red - Higher than price)
    for (let i = range; i > 0; i--) {
      levels.push({ 
        price: price + (i * step), 
        size: Math.random() * 50 + 5, 
        type: 'ask' 
      });
    }
    // Bids (Green - Lower than price)
    for (let i = 0; i < range; i++) {
      levels.push({ 
        price: price - (i * step), 
        size: Math.random() * 50 + 5, 
        type: 'bid' 
      });
    }
    return levels;
  };

  const levels = generateLevels();

  return (
    <div className="w-full text-zinc-800 dark:text-cyan-50 flex flex-col font-mono select-none transition-colors">
      <div className="w-full flex flex-col gap-4">
        
        {/* TOP: LIVE LOG PANEL */}
        <div 
          className="flex flex-col h-48 mb-12 relative z-20"
        >
          <div className="flex justify-between items-center mb-2 pl-4">
            <span 
              className="text-lg font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-2 tracking-widest uppercase origin-left transition-colors"
            >
              <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-500 transition-colors" /> Live Execution Log
            </span>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-pulse transition-colors"></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-[10px] scrollbar-hide">
            {logs.map((log) => (
              <div key={log.id} className={`flex items-center justify-between p-1 rounded transition-colors duration-300 ${log.aggressive ? 'bg-cyan-100/50 dark:bg-cyan-500/10 border-l-2 border-cyan-500 dark:border-cyan-400' : 'bg-transparent'}`}>
                <div className="flex gap-4 items-center">
                  <span className="text-cyan-800/70 dark:text-cyan-600/70">{log.time}</span>
                  <span className={log.type === 'buy' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-red-600 dark:text-red-400 font-bold'}>
                    {log.type === 'buy' ? 'MARKET BUY' : 'MARKET SELL'}
                  </span>
                  <span className="text-zinc-800 dark:text-cyan-50 font-bold">{log.qty}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-cyan-700/60 dark:text-cyan-500/60">@ {log.price}</span>
                  {log.aggressive && <span className="text-cyan-700 dark:text-cyan-300 text-[8px] border border-cyan-400/30 dark:border-cyan-400/30 px-1 rounded font-bold animate-pulse">AGGRESSIVE</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: HORIZONTAL ORDER FLOW LADDER */}
        <div 
          className="flex flex-col relative z-20 mb-8"
        >
          <div className="flex justify-between items-center mb-2 pl-4">
             <div className="flex items-center gap-4">
                <span 
                  className="text-lg font-black text-cyan-600 dark:text-cyan-400 tracking-widest uppercase flex items-center gap-2 origin-left transition-colors"
                >
                  <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-500 transition-colors" /> Horizontal Liquidity Depth
                </span>
                <div className="bg-slate-50/80 dark:bg-zinc-950/80 px-2 py-0.5 rounded text-[10px] text-cyan-900 dark:text-cyan-100 font-bold border border-cyan-200/50 dark:border-cyan-900/50 shadow-inner transition-colors">
                   BTC: {price.toLocaleString(undefined, {minimumFractionDigits: 2})}
                </div>
             </div>
             <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-cyan-600 dark:text-cyan-400 transition-colors" />
                <span className="text-[10px] text-cyan-700 dark:text-cyan-600 uppercase tracking-tighter transition-colors">Zoom: 1.0x</span>
             </div>
          </div>

          <div ref={scrollRef} className="relative overflow-x-auto scrollbar-hide py-4 min-h-[300px] flex items-end w-full">
            <div 
              className="relative flex items-end gap-1.5 min-w-max pb-12 h-full mx-auto origin-bottom"
            >
              {levels.map((lvl, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer h-full justify-end w-7">
                  {/* Hover Info Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-cyan-950 border border-cyan-200 dark:border-cyan-800 text-zinc-800 dark:text-cyan-50 text-[8px] px-1 py-0.5 rounded mb-1 pointer-events-none whitespace-nowrap z-30 shadow-lg shadow-cyan-900/10 dark:shadow-cyan-900/50">
                    Vol: {lvl.size.toFixed(1)}
                  </div>
                  
                  {/* Bar Visual */}
                  <div 
                    className={`w-full transition-all duration-700 relative rounded-t-[1px] ${
                      lvl.type === 'ask' 
                        ? 'bg-gradient-to-t from-zinc-200/50 to-zinc-400/80 border-t border-zinc-400 dark:from-white/20 dark:to-white/80 dark:border-white' 
                        : 'bg-gradient-to-t from-cyan-400/20 to-cyan-500/80 border-t border-cyan-500 dark:from-cyan-400/20 dark:to-cyan-400/80 dark:border-cyan-400'
                    }`}
                    style={{ height: `${(lvl.size / 60) * 180}px` }}
                  >
                     <div className="absolute inset-0 bg-cyan-500/10 dark:bg-cyan-50/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  {/* Price Label (Rotated) */}
                  <div className={`text-[8px] font-bold ${lvl.type === 'ask' ? 'text-zinc-500 dark:text-white/80' : 'text-cyan-600 dark:text-cyan-400/80'} rotate-45 mt-3 origin-left whitespace-nowrap`}>
                    {lvl.price.toFixed(1)}
                  </div>
                </div>
              ))}
              
              {/* CURRENT PRICE MARKER OVERLAY */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] dark:shadow-[0_0_15px_rgba(34,211,238,0.6)] z-20 transition-all duration-300 pointer-events-none"
                style={{ left: '50%' }}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-white dark:bg-cyan-950 border border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 text-[10px] font-black px-2 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)] dark:shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-1 whitespace-nowrap z-30">
                   {lastTick === 'up' ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                   {price.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: FAST EXECUTION BAR */}
        <div 
          className="flex gap-4 relative z-20"
        >
           <div className="flex-1 bg-white/80 dark:bg-zinc-950/60 border border-cyan-200/50 dark:border-cyan-900/50 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-colors">
              <div 
                className="flex items-center gap-6 origin-left"
              >
                 <div className="flex flex-col">
                    <span className="text-[9px] text-cyan-700 dark:text-cyan-600 font-black uppercase tracking-widest transition-colors">Quantity</span>
                    <span className="text-zinc-800 dark:text-cyan-50 font-bold text-sm transition-colors">0.50 Lot</span>
                 </div>
                 <div className="h-8 w-[1px] bg-cyan-200/80 dark:bg-cyan-900/50 transition-colors"></div>
                 <div className="flex flex-col">
                    <span className="text-[9px] text-cyan-700 dark:text-cyan-600 font-black uppercase tracking-widest transition-colors">Leverage</span>
                    <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm transition-colors">20x CROSS</span>
                 </div>
              </div>
              <div className="flex gap-3 pr-2">
                 <button className="flex items-center justify-center gap-2 w-28 py-2.5 bg-red-50/80 hover:bg-red-100/80 text-red-600 hover:text-red-700 border border-red-200/80 dark:bg-red-950/50 dark:hover:bg-red-900/80 dark:text-red-400 dark:hover:text-red-300 dark:border-red-500/40 rounded font-black text-[12px] tracking-widest transition-all shadow-inner shadow-red-500/5 dark:shadow-red-500/10 origin-right active:translate-y-0.5" style={{ transform: 'skewX(-20deg)' }}>
                   <div className="flex items-center gap-1" style={{ transform: 'skewX(20deg)' }}>
                     SELL <ArrowDown className="w-4 h-4" />
                   </div>
                 </button>
                 <button className="flex items-center justify-center gap-2 w-28 py-2.5 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-600 hover:text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/80 dark:text-emerald-400 dark:hover:text-emerald-300 dark:border-emerald-500/40 rounded font-black text-[12px] tracking-widest transition-all shadow-inner shadow-emerald-500/5 dark:shadow-emerald-500/10 origin-right active:translate-y-0.5" style={{ transform: 'skewX(-20deg)' }}>
                   <div className="flex items-center gap-1" style={{ transform: 'skewX(20deg)' }}>
                     <ArrowUp className="w-4 h-4" /> BUY
                   </div>
                 </button>
              </div>
           </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2s infinite;
        }
      `}} />
    </div>
  );
};
