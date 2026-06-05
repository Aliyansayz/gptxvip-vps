import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, Zap, RefreshCw, PlusCircle, Database, LayoutGrid, Terminal } from "lucide-react";

interface Order {
  id: string;
  price: number;
  quantity: number;
  type: "bid" | "ask";
  timestamp: number;
}

interface PriceLevel {
  price: number;
  totalQty: number;
  orderCount: number;
  orders: Order[];
}

export const OrderBookVisual: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(100.25);
  const [tradeHistory, setTradeHistory] = useState<{ price: number; quantity: number; time: string; side: string }[]>([]);
  const [systemLogs, setSystemLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"market" | "internals">("market");
  
  const addLog = (msg: string) => {
    setSystemLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  // Initialize sample data
  useEffect(() => {
    const initialBids: Order[] = [
      { id: "B1", price: 100.20, quantity: 15, type: "bid", timestamp: Date.now() - 4000 },
      { id: "B2", price: 100.15, quantity: 42, type: "bid", timestamp: Date.now() - 3000 },
      { id: "B3", price: 100.10, quantity: 75, type: "bid", timestamp: Date.now() - 2000 },
      { id: "B4", price: 100.05, quantity: 120, type: "bid", timestamp: Date.now() - 1000 },
    ];
    
    const initialAsks: Order[] = [
      { id: "A1", price: 100.30, quantity: 22, type: "ask", timestamp: Date.now() - 4000 },
      { id: "A2", price: 100.35, quantity: 18, type: "ask", timestamp: Date.now() - 3000 },
      { id: "A3", price: 100.40, quantity: 50, type: "ask", timestamp: Date.now() - 2000 },
      { id: "A4", price: 100.45, quantity: 85, type: "ask", timestamp: Date.now() - 1000 },
    ];
    
    setBids(initialBids);
    setAsks(initialAsks);
    addLog("Matching Engine Initialized");
    addLog("Loading price level caches [READY]");
  }, []);

  const handleSimulateOrder = (type: "bid" | "ask") => {
    // For market simulation, price depends on current best bid/ask
    const bestBid = bids.length > 0 ? bids[0].price : 100.00;
    const bestAsk = asks.length > 0 ? asks[0].price : 100.50;
    
    const price = type === "bid" ? bestAsk : bestBid; // Aggressive orders hit the spread
    const quantity = Math.floor(Math.random() * 20) + 10;
    
    addLog(`Incoming Market ${type.toUpperCase()}: qty=${quantity}`);

    if (type === "bid") {
      // Find matching asks (market buy hits asks)
      let remainingQty = quantity;
      const updatedAsks = [...asks];
      
      addLog(`Searching ASK levels for price <= ${price.toFixed(2)}`);
      
      while (remainingQty > 0 && updatedAsks.length > 0 && updatedAsks[0].price <= price) {
        const bestAsk = updatedAsks[0];
        const tradeQty = Math.min(remainingQty, bestAsk.quantity);
        
        addLog(`Match found! Executing trade at ${bestAsk.price.toFixed(2)}`);
        
        setTradeHistory(prev => [{ 
          price: bestAsk.price, 
          quantity: tradeQty, 
          time: new Date().toLocaleTimeString(),
          side: 'BUY'
        }, ...prev].slice(0, 10));
        
        setLastPrice(bestAsk.price);
        remainingQty -= tradeQty;
        
        if (bestAsk.quantity > tradeQty) {
          updatedAsks[0] = { ...bestAsk, quantity: bestAsk.quantity - tradeQty };
          addLog(`Partially filled A-${bestAsk.id}. Rem: ${bestAsk.quantity - tradeQty}`);
        } else {
          updatedAsks.shift();
          addLog(`Level Cleared: Price ${bestAsk.price.toFixed(2)}`);
        }
      }
      
      setAsks(updatedAsks);
      if (remainingQty > 0) {
        addLog(`Liquidity Exhausted. Unfilled Market Order Qty: ${remainingQty}`);
      }
    } else {
      // Find matching bids (market sell hits bids)
      let remainingQty = quantity;
      const updatedBids = [...bids];
      
      addLog(`Searching BID levels for price >= ${price.toFixed(2)}`);

      while (remainingQty > 0 && updatedBids.length > 0 && updatedBids[0].price >= price) {
        const bestBid = updatedBids[0];
        const tradeQty = Math.min(remainingQty, bestBid.quantity);
        
        addLog(`Match found! Executing trade at ${bestBid.price.toFixed(2)}`);

        setTradeHistory(prev => [{ 
          price: bestBid.price, 
          quantity: tradeQty, 
          time: new Date().toLocaleTimeString(),
          side: 'SELL'
        }, ...prev].slice(0, 10));
        
        setLastPrice(bestBid.price);
        remainingQty -= tradeQty;
        
        if (bestBid.quantity > tradeQty) {
          updatedBids[0] = { ...bestBid, quantity: bestBid.quantity - tradeQty };
          addLog(`Partially filled B-${bestBid.id}. Rem: ${bestBid.quantity - tradeQty}`);
        } else {
          updatedBids.shift();
          addLog(`Level Cleared: Price ${bestBid.price.toFixed(2)}`);
        }
      }
      
      setBids(updatedBids);
      if (remainingQty > 0) {
        addLog(`Liquidity Exhausted. Unfilled Market Order Qty: ${remainingQty}`);
      }
    }
  };

  const getPriceLevels = (orders: Order[]) => {
    const levels: Record<number, PriceLevel> = {};
    orders.forEach(o => {
      if (!levels[o.price]) {
        levels[o.price] = { price: o.price, totalQty: 0, orderCount: 0, orders: [] };
      }
      levels[o.price].totalQty += o.quantity;
      levels[o.price].orderCount += 1;
      levels[o.price].orders.push(o);
    });
    return Object.values(levels).sort((a, b) => b.price - a.price);
  };

  const bidLevels = getPriceLevels(bids);
  const askLevels = getPriceLevels(asks).reverse(); // for display sorting
  const maxQty = Math.max(...bidLevels.map(b => b.totalQty), ...askLevels.map(a => a.totalQty), 1);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl font-mono overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Zap className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">Matching Engine Lab</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase">C++ Engine_Design.LOB_Module</p>
            </div>
          </div>
          
          <div className="flex gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800">
            <button 
              onClick={() => setActiveTab("market")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'market' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
            >
              <LayoutGrid className="w-3 h-3 inline mr-2" />
              Market View
            </button>
            <button 
              onClick={() => setActiveTab("internals")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'internals' ? 'bg-zinc-100 text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
            >
              <Database className="w-3 h-3 inline mr-2" />
              Engine Internals
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase font-black">Consolidated Price</p>
          <p className="text-xl font-black text-blue-400 font-sans tracking-tight">${lastPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
        {/* Main Display Area */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "market" ? (
              <motion.div 
                key="market"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col gap-4 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {/* Bids Column */}
                  <div className="bg-black/40 rounded-2xl border border-emerald-500/10 p-4 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-emerald-500/20 pb-2">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">BIDS_SIDE</span>
                       <span className="text-[10px] text-zinc-600">DEPTH: {bids.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                       {bidLevels.map((lvl) => (
                         <div key={lvl.price} className="relative group">
                            <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/5 transition-all group-hover:bg-emerald-500/10" style={{ width: `${(lvl.totalQty / maxQty) * 100}%` }} />
                            <div className="flex items-center justify-between py-1.5 px-2 text-xs relative z-10">
                               <span className="text-emerald-400 font-black">${lvl.price.toFixed(2)}</span>
                               <span className="text-zinc-200 font-bold">{lvl.totalQty}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Asks Column */}
                  <div className="bg-black/40 rounded-2xl border border-red-500/10 p-4 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-center mb-4 border-b border-red-500/20 pb-2">
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">ASKS_SIDE</span>
                       <span className="text-[10px] text-zinc-600">DEPTH: {asks.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                       {askLevels.map((lvl) => (
                         <div key={lvl.price} className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 bg-red-500/5 transition-all group-hover:bg-red-500/10" style={{ width: `${(lvl.totalQty / maxQty) * 100}%` }} />
                            <div className="flex items-center justify-between py-1.5 px-2 text-xs relative z-10">
                               <span className="text-red-400 font-black">${lvl.price.toFixed(2)}</span>
                               <span className="text-zinc-200 font-bold">{lvl.totalQty}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => handleSimulateOrder("bid")} className="p-4 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 rounded-2xl text-emerald-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <TrendingUp className="w-4 h-4" /> Inject Market Buy
                  </button>
                  <button onClick={() => handleSimulateOrder("ask")} className="p-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 rounded-2xl text-red-400 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95">
                    <TrendingDown className="w-4 h-4" /> Inject Market Sell
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="internals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 overflow-hidden flex flex-col"
              >
                <div className="flex items-center gap-2 mb-6">
                   <Terminal className="w-4 h-4 text-blue-400" />
                   <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">C++ Memory_Space : std::map&lt;Price, Level&gt;</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                   {/* Symbolic Price Level Tree */}
                   <div className="space-y-4">
                      {askLevels.slice(-2).map((lvl, i) => (
                        <div key={i} className="flex gap-4 items-start">
                           <div className="w-24 shrink-0 p-2 bg-red-500/10 border border-red-500/20 rounded font-bold text-[10px] text-red-400">
                              PricePtr: {lvl.price.toFixed(2)}
                           </div>
                           <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                              {lvl.orders.map(o => (
                                <div key={o.id} className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg shrink-0 min-w-[80px]">
                                   <div className="text-[8px] text-zinc-500 uppercase font-black mb-1">OrderIdx: {o.id}</div>
                                   <div className="text-[10px] font-mono text-zinc-300">Qty: {o.quantity}</div>
                                   <div className="text-[8px] text-zinc-600 mt-1 capitalize">{new Date(o.timestamp).toLocaleTimeString()}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                      
                      <div className="h-px bg-zinc-800 w-full flex items-center justify-center relative">
                         <span className="absolute bg-zinc-950 px-3 text-[10px] font-bold text-zinc-600 italic">Matching_Gateway_Root</span>
                      </div>

                      {bidLevels.slice(0, 2).map((lvl, i) => (
                        <div key={i} className="flex gap-4 items-start">
                           <div className="w-24 shrink-0 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded font-bold text-[10px] text-emerald-400">
                              PricePtr: {lvl.price.toFixed(2)}
                           </div>
                           <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                              {lvl.orders.map(o => (
                                <div key={o.id} className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg shrink-0 min-w-[80px]">
                                   <div className="text-[8px] text-zinc-500 uppercase font-black mb-1">OrderIdx: {o.id}</div>
                                   <div className="text-[10px] font-mono text-zinc-300">Qty: {o.quantity}</div>
                                   <div className="text-[8px] text-zinc-600 mt-1 capitalize">{new Date(o.timestamp).toLocaleTimeString()}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-4 p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                   <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                      Note: In HFT systems, each 'PricePtr' nodes are often pooled in a pre-allocated memory buffer to avoid `malloc` latency. The 'Orders' at each level are stored in a contiguous linked list for cache-friendly FIFO traversal.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar logs / History */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex-1 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-4 flex flex-col overflow-hidden">
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCw className="w-3 h-3" /> Engine_Process_Log
             </h4>
             <div className="flex-1 overflow-y-auto space-y-2 text-[9px] font-mono pr-2 custom-scrollbar">
                {systemLogs.map((log, i) => (
                  <div key={i} className={`p-1.5 rounded ${log.includes('Match') ? 'text-emerald-400 bg-emerald-400/5' : 'text-zinc-500'}`}>
                    {log}
                  </div>
                ))}
             </div>
          </div>

          <div className="h-48 bg-zinc-900/30 rounded-2xl border border-zinc-800 p-4 flex flex-col overflow-hidden">
             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Execution_History</h4>
             <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {tradeHistory.map((trade, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px]">
                     <div className="flex items-center gap-2">
                        <span className={`font-black ${trade.side === 'BUY' ? 'text-blue-400' : 'text-amber-400'}`}>{trade.side}</span>
                        <span className="text-zinc-300">${trade.price.toFixed(2)}</span>
                     </div>
                     <span className="text-zinc-600">x{trade.quantity}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-4">
        <PlusCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-zinc-400">
          <strong className="text-indigo-400">Logic Tip:</strong> When a Market Order enters, the engine 'walks the book' by pointer-chasing the Price Levels in price order. Efficient cache management means the top of the book (Bid-Ask spread) should always be in L1/L2 cache.
        </div>
      </div>
    </div>
  );
};

