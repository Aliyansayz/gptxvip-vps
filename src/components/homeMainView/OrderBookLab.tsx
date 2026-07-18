import React, { useState, useEffect, useRef } from "react";
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

export const OrderBookLab: React.FC = () => {
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

  const [isAutoActive, setIsAutoActive] = useState<boolean>(true);

  // Auto trigger loop
  useEffect(() => {
    if (!isAutoActive) return;

    let timeoutId: NodeJS.Timeout;

    const runSimulationLoop = () => {
      // randomly inject orders every 1s-3s or replenish depth randomly
      handleSimulateOrder(Math.random() > 0.5 ? "bid" : "ask");

      // Randomly inject depth back into the book to prevent it from emptying out in auto mode
      if (Math.random() > 0.6) {
         setBids(currBids => {
            const lastBid = currBids.length > 0 ? currBids[currBids.length - 1].price - 0.05 : 100;
            const newOrder: Order = { id: `B-${Date.now()}`, price: lastBid, quantity: Math.floor(Math.random() * 50) + 10, type: "bid", timestamp: Date.now() };
            return [...currBids, newOrder].sort((a,b) => b.price - a.price).slice(0, 5);
         })
      }
      if (Math.random() > 0.6) {
         setAsks(currAsks => {
            const lastAsk = currAsks.length > 0 ? currAsks[currAsks.length - 1].price + 0.05 : 100.5;
            const newOrder: Order = { id: `A-${Date.now()}`, price: lastAsk, quantity: Math.floor(Math.random() * 50) + 10, type: "ask", timestamp: Date.now() };
            return [...currAsks, newOrder].sort((a,b) => a.price - b.price).slice(0, 5);
         })
      }

      timeoutId = setTimeout(runSimulationLoop, Math.random() * 1000 + 500);
    };

    timeoutId = setTimeout(runSimulationLoop, 1000);

    return () => clearTimeout(timeoutId);
  }, [isAutoActive /* dependencies missing to avoid closing over stale handleSimulateOrder? It's okay, we can just use handleSimulateOrder loosely or it might complain. Wait, handleSimulateOrder uses current bids/asks. It'll be stale.*/]);

  const bidsRef = useRef(bids);
  const asksRef = useRef(asks);

  useEffect(() => {
     bidsRef.current = bids;
  }, [bids]);

  useEffect(() => {
     asksRef.current = asks;
  }, [asks]);

  const handleSimulateOrder = (type: "bid" | "ask") => {
    const currentBids = bidsRef.current;
    const currentAsks = asksRef.current;

    const bestBid = currentBids.length > 0 ? currentBids[0].price : 100.00;
    const bestAsk = currentAsks.length > 0 ? currentAsks[0].price : 100.50;
    
    const price = type === "bid" ? bestAsk : bestBid;
    const quantity = Math.floor(Math.random() * 20) + 10;
    
    addLog(`Incoming Market ${type.toUpperCase()}: qty=${quantity}`);

    if (type === "bid") {
      let remainingQty = quantity;
      const updatedAsks = [...currentAsks];
      
      addLog(`Searching ASK levels for price <= ${price.toFixed(2)}`);
      
      while (remainingQty > 0 && updatedAsks.length > 0 && updatedAsks[0].price <= price) {
        const bestAskLvl = updatedAsks[0];
        const tradeQty = Math.min(remainingQty, bestAskLvl.quantity);
        
        addLog(`Match found! Executing trade at ${bestAskLvl.price.toFixed(2)}`);
        
        setTradeHistory(prev => [{ 
          price: bestAskLvl.price, 
          quantity: tradeQty, 
          time: new Date().toLocaleTimeString(),
          side: 'BUY'
        }, ...prev].slice(0, 10));
        
        setLastPrice(bestAskLvl.price);
        remainingQty -= tradeQty;
        
        if (bestAskLvl.quantity > tradeQty) {
          updatedAsks[0] = { ...bestAskLvl, quantity: bestAskLvl.quantity - tradeQty };
          addLog(`Partially filled A-${bestAskLvl.id}. Rem: ${bestAskLvl.quantity - tradeQty}`);
        } else {
          updatedAsks.shift();
          addLog(`Level Cleared: Price ${bestAskLvl.price.toFixed(2)}`);
        }
      }
      
      setAsks(updatedAsks);
      if (remainingQty > 0) {
        addLog(`Liquidity Exhausted. Unfilled Market Order Qty: ${remainingQty}`);
      }
    } else {
      let remainingQty = quantity;
      const updatedBids = [...currentBids];
      
      addLog(`Searching BID levels for price >= ${price.toFixed(2)}`);

      while (remainingQty > 0 && updatedBids.length > 0 && updatedBids[0].price >= price) {
        const bestBidLvl = updatedBids[0];
        const tradeQty = Math.min(remainingQty, bestBidLvl.quantity);
        
        addLog(`Match found! Executing trade at ${bestBidLvl.price.toFixed(2)}`);

        setTradeHistory(prev => [{ 
          price: bestBidLvl.price, 
          quantity: tradeQty, 
          time: new Date().toLocaleTimeString(),
          side: 'SELL'
        }, ...prev].slice(0, 10));
        
        setLastPrice(bestBidLvl.price);
        remainingQty -= tradeQty;
        
        if (bestBidLvl.quantity > tradeQty) {
          updatedBids[0] = { ...bestBidLvl, quantity: bestBidLvl.quantity - tradeQty };
          addLog(`Partially filled B-${bestBidLvl.id}. Rem: ${bestBidLvl.quantity - tradeQty}`);
        } else {
          updatedBids.shift();
          addLog(`Level Cleared: Price ${bestBidLvl.price.toFixed(2)}`);
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
    <div className="flex flex-col gap-6 w-full max-w-full p-6 bg-white/80 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-xl font-mono overflow-hidden backdrop-blur-sm z-20 relative transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-cyan-600 dark:text-[rgba(34,211,238,1)] drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] transition-colors">Interactive Order Book Lab <span className="text-[10px] bg-indigo-500 text-white px-2 py-1 rounded-full uppercase tracking-widest align-top ml-2">advanced</span></h2>
            <p className="text-zinc-600/80 dark:text-zinc-400/80 mt-2 font-mono text-xs max-w-4xl transition-colors">
              Build and interact with a high-performance Limit Order Book (LOB). Observe how price levels are organized and how the matching engine executes trades at the top of the book.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cyan-700 dark:text-cyan-600 uppercase font-black transition-colors">Consolidated Price</p>
            <p className="text-2xl font-black text-cyan-600 dark:text-[rgba(34,211,238,1)] font-sans tracking-tight transition-colors">${lastPrice.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="flex gap-16 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-700 dark:text-cyan-600 uppercase font-black transition-colors">Concept Tested:</span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors">Order Book Management</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-700 dark:text-cyan-600 uppercase font-black transition-colors">Activity Type:</span>
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors">Interactive Activity</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/50 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
            <button 
              onClick={() => setActiveTab("market")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'market' ? 'bg-cyan-500 text-white dark:text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            >
              <LayoutGrid className="w-3 h-3 inline mr-2" />
              Market View
            </button>
            <button 
              onClick={() => setActiveTab("internals")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'internals' ? 'bg-cyan-500 text-white dark:text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] dark:shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'}`}
            >
              <Database className="w-3 h-3 inline mr-2" />
              Engine Internals
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[700px]">
        {/* Main Display Area */}
        <div className="xl:col-span-8 flex flex-col gap-4 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "market" ? (
              <motion.div 
                key="market"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex-1 flex flex-col gap-4 overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden min-h-0">
                  {/* Bids Column */}
                  <div className="bg-cyan-50/50 dark:bg-cyan-900/20 rounded-2xl border border-cyan-200 dark:border-cyan-500/20 p-4 flex flex-col overflow-hidden shadow-inner transition-colors">
                    <div className="flex justify-between items-center mb-4 border-b border-cyan-200 dark:border-cyan-500/20 pb-2 transition-colors">
                       <span className="text-[10px] font-black text-cyan-600 dark:text-[rgba(34,211,238,1)] uppercase tracking-widest transition-colors">BIDS_SIDE</span>
                       <span className="text-[10px] text-cyan-700 dark:text-cyan-600 font-bold transition-colors">DEPTH: {bids.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                       {bidLevels.map((lvl) => (
                         <div key={lvl.price} className="relative group overflow-hidden rounded">
                            <div className="absolute right-0 top-0 bottom-0 bg-cyan-200/50 dark:bg-cyan-500/20 transition-all group-hover:bg-cyan-300/50 dark:group-hover:bg-cyan-500/30" style={{ width: `${(lvl.totalQty / maxQty) * 100}%` }} />
                            <div className="flex items-center justify-between py-1.5 px-2 text-xs relative z-10">
                               <span className="text-cyan-600 dark:text-[rgba(34,211,238,1)] font-black transition-colors">${lvl.price.toFixed(2)}</span>
                               <span className="text-zinc-800 dark:text-cyan-50 font-bold transition-colors">{lvl.totalQty}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Asks Column */}
                  <div className="bg-red-50/50 dark:bg-cyan-900/20 rounded-2xl border border-red-200 dark:border-cyan-300/20 p-4 flex flex-col overflow-hidden shadow-inner transition-colors">
                    <div className="flex justify-between items-center mb-4 border-b border-red-200 dark:border-cyan-300/20 pb-2 transition-colors">
                       <span className="text-[10px] font-black text-red-600 dark:text-white uppercase tracking-widest transition-colors">ASKS_SIDE</span>
                       <span className="text-[10px] text-red-700 dark:text-cyan-600 font-bold transition-colors">DEPTH: {asks.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-2">
                       {askLevels.map((lvl) => (
                         <div key={lvl.price} className="relative group overflow-hidden rounded">
                            <div className="absolute left-0 top-0 bottom-0 bg-red-100 dark:bg-white/20 transition-all group-hover:bg-red-200 dark:group-hover:bg-white/30" style={{ width: `${(lvl.totalQty / maxQty) * 100}%` }} />
                            <div className="flex items-center justify-between py-1.5 px-2 text-xs relative z-10">
                               <span className="text-red-700 dark:text-white font-black transition-colors">${lvl.price.toFixed(2)}</span>
                               <span className="text-zinc-800 dark:text-cyan-50 font-bold transition-colors">{lvl.totalQty}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button onClick={() => handleSimulateOrder("bid")} className="col-span-1 p-4 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 rounded-2xl text-cyan-700 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 dark:border-[rgba(34,211,238,1)]/40 dark:text-[rgba(34,211,238,1)] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_inset_rgba(34,211,238,0.1)] dark:shadow-[0_0_15px_inset_rgba(34,211,238,0.2)]">
                    <TrendingUp className="w-4 h-4" /> Inject Market Buy
                  </button>
                  <button onClick={() => handleSimulateOrder("ask")} className="col-span-1 p-4 bg-red-50 hover:bg-red-100 border border-red-300 rounded-2xl text-red-700 dark:bg-white/10 dark:hover:bg-white/20 dark:border-white/40 dark:text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_inset_rgba(239,68,68,0.1)] dark:shadow-[0_0_15px_inset_rgba(255,255,255,0.2)]">
                    <TrendingDown className="w-4 h-4" /> Inject Market Sell
                  </button>
                  <button onClick={() => setIsAutoActive(!isAutoActive)} className={`col-span-2 md:col-span-1 p-4 border rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${isAutoActive ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/40 dark:text-indigo-400 shadow-[0_0_15px_inset_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_inset_rgba(99,102,241,0.2)]' : 'bg-slate-100 border-zinc-300 text-zinc-500 hover:bg-slate-200 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700/50'}`}>
                    <RefreshCw className={`w-4 h-4 ${isAutoActive ? 'animate-spin' : ''}`} /> {isAutoActive ? 'Auto: ON' : 'Auto: OFF'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="internals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden flex flex-col shadow-inner transition-colors"
              >
                <div className="flex items-center gap-3 mb-6 bg-white dark:bg-zinc-900/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/60 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(0,0,0,0.2)] transition-colors">
                   <div className="bg-cyan-100 dark:bg-cyan-500/10 p-2 rounded-lg transition-colors">
                      <Terminal className="w-5 h-5 text-cyan-600 dark:text-[rgba(34,211,238,1)] transition-colors" />
                   </div>
                   <div>
                     <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest mb-1 transition-colors">Data Structure Map</div>
                     <h3 className="text-sm md:text-base font-black text-zinc-800 dark:text-zinc-300 tracking-tight font-mono transition-colors">
                       <span className="text-zinc-900 dark:text-white">Memory_Space</span> <span className="text-cyan-700 dark:text-cyan-600">::</span> <span className="text-cyan-600 dark:text-[rgba(34,211,238,1)]">std::map&lt;Price, Level&gt;</span>
                     </h3>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 custom-scrollbar pr-3 mt-2 pb-6">
                   {/* Symbolic Price Level Tree */}
                   <div className="space-y-8">
                       {askLevels.slice(-2).map((lvl, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                           <div className="w-full sm:w-32 shrink-0 p-4 bg-red-50 dark:bg-white/5 border border-red-200 dark:border-white/20 rounded-xl font-bold text-[11px] text-red-700 dark:text-white flex flex-col gap-1.5 items-center justify-center sm:min-h-[80px] shadow-sm transition-colors">
                              <span className="text-red-700/50 dark:text-white/50 uppercase tracking-widest text-[9px] transition-colors">PricePtr Node</span>
                              <span className="text-base font-black">Ask {lvl.price.toFixed(2)}</span>
                           </div>
                           <div className="flex-1 flex flex-wrap gap-3">
                              {lvl.orders.map(o => (
                                <div key={o.id} className="p-3 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl min-w-[100px] shadow-sm hover:border-red-300 dark:hover:border-[rgba(34,211,238,1)]/50 transition-colors">
                                   <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-black mb-2 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1 transition-colors">
                                      <span>Idx: {o.id}</span>
                                      <span className="text-red-700/60 dark:text-white/40 bg-red-100 dark:bg-white/5 px-1.5 py-0.5 rounded text-[8px] transition-colors">ASK</span>
                                   </div>
                                   <div className="text-sm font-mono text-zinc-800 dark:text-cyan-50 font-bold mb-1 transition-colors">Qty: {o.quantity}</div>
                                   <div className="text-[9px] text-zinc-500 dark:text-cyan-600 mt-1 font-mono transition-colors">{new Date(o.timestamp).toLocaleTimeString()}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                      
                      <div className="h-px bg-zinc-700/80 w-full flex items-center justify-center relative my-10">
                         <span className="absolute bg-cyan-500/15 px-5 py-2 text-[11px] font-black text-[rgba(34,211,238,1)] border border-[rgba(34,211,238,1)]/50 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.2)] flex items-center gap-2 uppercase tracking-widest"><Zap className="w-3.5 h-3.5" /> Matching_Gateway_Root</span>
                      </div>

                      {bidLevels.slice(0, 2).map((lvl, i) => (
                        <div key={i} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                           <div className="w-full sm:w-32 shrink-0 p-4 bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-[rgba(34,211,238,1)]/20 rounded-xl font-bold text-[11px] text-cyan-700 dark:text-[rgba(34,211,238,1)] flex flex-col gap-1.5 items-center justify-center sm:min-h-[80px] shadow-sm transition-colors">
                              <span className="text-cyan-700/50 dark:text-[rgba(34,211,238,1)]/50 uppercase tracking-widest text-[9px] transition-colors">PricePtr Node</span>
                              <span className="text-base font-black">Bid {lvl.price.toFixed(2)}</span>
                           </div>
                           <div className="flex-1 flex flex-wrap gap-3">
                              {lvl.orders.map(o => (
                                <div key={o.id} className="p-3 bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700/80 rounded-xl min-w-[100px] shadow-sm hover:border-cyan-300 dark:hover:border-[rgba(34,211,238,1)]/50 transition-colors">
                                   <div className="text-[10px] text-cyan-700/80 dark:text-[rgba(34,211,238,1)]/80 uppercase font-black mb-2 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1 transition-colors">
                                      <span>Idx: {o.id}</span>
                                      <span className="text-cyan-700/60 dark:text-[rgba(34,211,238,1)]/40 bg-cyan-100 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded text-[8px] transition-colors">BID</span>
                                   </div>
                                   <div className="text-sm font-mono text-zinc-800 dark:text-cyan-50 font-bold mb-1 transition-colors">Qty: {o.quantity}</div>
                                   <div className="text-[9px] text-zinc-500 dark:text-cyan-600 mt-1 font-mono transition-colors">{new Date(o.timestamp).toLocaleTimeString()}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 transition-colors">
                   <p className="text-[10px] text-zinc-600/80 dark:text-zinc-400/80 leading-relaxed italic border-l-2 border-cyan-500 pl-3 transition-colors">
                      Note: In HFT systems, each 'PricePtr' nodes are often pooled in a pre-allocated memory buffer to avoid `malloc` latency. The 'Orders' at each level are stored in a contiguous linked list for cache-friendly FIFO traversal.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar logs / History */}
        <div className="xl:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="flex-[1.5] bg-cyan-50/50 dark:bg-cyan-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col overflow-hidden shadow-inner transition-colors">
             <h4 className="text-[10px] font-black text-cyan-700 dark:text-cyan-600 uppercase tracking-widest mb-4 flex items-center gap-2 transition-colors">
                <RefreshCw className="w-3 h-3" /> Engine_Process_Log
             </h4>
             <div className="flex-1 overflow-y-auto space-y-2 text-[10px] font-mono custom-scrollbar pr-2 leading-relaxed">
                {systemLogs.map((log, i) => (
                  <div key={i} className={`p-1.5 rounded border-l-2 transition-colors ${log.includes('Match') ? 'text-cyan-700 dark:text-[rgba(34,211,238,1)] bg-cyan-100/50 dark:bg-cyan-500/10 border-cyan-500 dark:border-[rgba(34,211,238,1)]' : 'text-zinc-600 dark:text-cyan-400 border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900/50'}`}>
                    {log}
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col overflow-hidden shadow-inner transition-colors">
             <h4 className="text-[10px] font-black text-cyan-700 dark:text-cyan-600 uppercase tracking-widest mb-4 transition-colors">Execution_History</h4>
             <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                {tradeHistory.map((trade, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-zinc-200 dark:border-zinc-700/30 last:border-0 transition-colors">
                     <div className="flex items-center gap-3">
                        <span className={`font-black transition-colors ${trade.side === 'BUY' ? 'text-emerald-600 dark:text-white' : 'text-red-600 dark:text-[rgba(34,211,238,1)]'}`}>{trade.side}</span>
                        <span className="text-zinc-800 dark:text-zinc-200 font-bold transition-colors">${trade.price.toFixed(2)}</span>
                     </div>
                     <span className="text-cyan-700 dark:text-cyan-600 font-bold transition-colors">x {trade.quantity}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-zinc-800/40 border border-cyan-200 dark:border-cyan-500/20 rounded-2xl flex items-start gap-4 shadow-inner mt-4 transition-colors">
        <PlusCircle className="w-5 h-5 text-cyan-600 dark:text-[rgba(34,211,238,1)] shrink-0 mt-0.5 transition-colors" />
        <div className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300/80 transition-colors">
          <strong className="text-cyan-700 dark:text-[rgba(34,211,238,1)] mr-1 transition-colors">Logic Tip:</strong> When a Market Order enters, the engine 'walks the book' by pointer-chasing the Price Levels in price order. Efficient cache management means the top of the book (Bid-Ask spread) should always be in L1/L2 cache.
        </div>
      </div>
    </div>
  );
};
