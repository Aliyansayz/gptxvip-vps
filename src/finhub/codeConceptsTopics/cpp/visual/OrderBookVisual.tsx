import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, TrendingDown, ArrowRight, Zap, RefreshCw, PlusCircle } from "lucide-react";

interface Order {
  id: string;
  price: number;
  quantity: number;
  type: "bid" | "ask";
  timestamp: number;
}

export const OrderBookVisual: React.FC = () => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [lastPrice, setLastPrice] = useState<number>(100.25);
  const [tradeHistory, setTradeHistory] = useState<{ price: number; quantity: number; time: string }[]>([]);
  
  // Initialize sample data
  useEffect(() => {
    const initialBids: Order[] = [
      { id: "1", price: 100.20, quantity: 15, type: "bid", timestamp: Date.now() },
      { id: "2", price: 100.15, quantity: 42, type: "bid", timestamp: Date.now() },
      { id: "3", price: 100.10, quantity: 75, type: "bid", timestamp: Date.now() },
      { id: "4", price: 100.05, quantity: 120, type: "bid", timestamp: Date.now() },
    ];
    
    const initialAsks: Order[] = [
      { id: "5", price: 100.30, quantity: 22, type: "ask", timestamp: Date.now() },
      { id: "6", price: 100.35, quantity: 18, type: "ask", timestamp: Date.now() },
      { id: "7", price: 100.40, quantity: 50, type: "ask", timestamp: Date.now() },
      { id: "8", price: 100.45, quantity: 85, type: "ask", timestamp: Date.now() },
    ];
    
    setBids(initialBids);
    setAsks(initialAsks);
  }, []);

  const handleSimulateOrder = (type: "bid" | "ask") => {
    const price = type === "bid" ? lastPrice + 0.05 : lastPrice - 0.05;
    const quantity = Math.floor(Math.random() * 20) + 5;
    
    // Simple matching logic
    if (type === "bid") {
      // Find matching asks (price >= ask price)
      const matchingAskIndex = asks.findIndex(a => price >= a.price);
      if (matchingAskIndex !== -1) {
        const matchedAsk = asks[matchingAskIndex];
        const tradeQty = Math.min(quantity, matchedAsk.quantity);
        
        setTradeHistory(prev => [{ price: matchedAsk.price, quantity: tradeQty, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
        setLastPrice(matchedAsk.price);
        
        if (matchedAsk.quantity > tradeQty) {
          const newAsks = [...asks];
          newAsks[matchingAskIndex] = { ...matchedAsk, quantity: matchedAsk.quantity - tradeQty };
          setAsks(newAsks);
        } else {
          setAsks(asks.filter((_, i) => i !== matchingAskIndex));
        }
      } else {
        setBids(prev => [...prev, { id: Math.random().toString(), price, quantity, type, timestamp: Date.now() }].sort((a,b) => b.price - a.price));
      }
    } else {
      // Find matching bids (price <= bid price)
      const matchingBidIndex = bids.findIndex(b => price <= b.price);
      if (matchingBidIndex !== -1) {
        const matchedBid = bids[matchingBidIndex];
        const tradeQty = Math.min(quantity, matchedBid.quantity);
        
        setTradeHistory(prev => [{ price: matchedBid.price, quantity: tradeQty, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
        setLastPrice(matchedBid.price);
        
        if (matchedBid.quantity > tradeQty) {
          const newBids = [...bids];
          newBids[matchingBidIndex] = { ...matchedBid, quantity: matchedBid.quantity - tradeQty };
          setBids(newBids);
        } else {
          setBids(bids.filter((_, i) => i !== matchingBidIndex));
        }
      } else {
        setAsks(prev => [...prev, { id: Math.random().toString(), price, quantity, type, timestamp: Date.now() }].sort((a,b) => a.price - b.price));
      }
    }
  };

  const maxQty = Math.max(...bids.map(b => b.quantity), ...asks.map(a => a.quantity), 1);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4 bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tighter">L2 Order Book</h3>
            <p className="text-[10px] text-zinc-500">REAL-TIME MATCHING ENGINE V2</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase">Last Price</p>
          <p className="text-xl font-black text-blue-400 font-sans tracking-tight">${lastPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Book Display */}
        <div className="bg-black/40 rounded-2xl border border-zinc-800/50 p-4">
          <div className="grid grid-cols-3 text-[10px] text-zinc-500 font-bold uppercase mb-4 px-2 tracking-widest border-b border-zinc-800/50 pb-2">
            <span>Price</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Depth</span>
          </div>

          <div className="flex flex-col gap-0.5">
            {/* Asks */}
            <div className="flex flex-col-reverse mb-1">
              {asks.slice(0, 5).map((ask, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={ask.id}
                  className="grid grid-cols-3 py-1 px-2 text-xs relative group cursor-pointer hover:bg-red-500/5 rounded transition-colors"
                >
                  <div className="absolute right-0 top-0 bottom-0 bg-red-500/10 z-0" style={{ width: `${(ask.quantity / maxQty) * 100}%` }} />
                  <span className="text-red-400 font-bold relative z-10">{ask.price.toFixed(2)}</span>
                  <span className="text-right text-zinc-300 relative z-10">{ask.quantity}</span>
                  <span className="text-right text-zinc-500 text-[10px] relative z-10">
                    {asks.slice(0, i + 1).reduce((sum, a) => sum + a.quantity, 0)}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="h-px bg-zinc-800 my-2" />

            {/* Bids */}
            <div className="flex flex-col">
              {bids.slice(0, 5).map((bid, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={bid.id}
                  className="grid grid-cols-3 py-1 px-2 text-xs relative group cursor-pointer hover:bg-emerald-500/5 rounded transition-colors"
                >
                  <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 z-0" style={{ width: `${(bid.quantity / maxQty) * 100}%` }} />
                  <span className="text-emerald-400 font-bold relative z-10">{bid.price.toFixed(2)}</span>
                  <span className="text-right text-zinc-300 relative z-10">{bid.quantity}</span>
                  <span className="text-right text-zinc-500 text-[10px] relative z-10">
                    {bids.slice(0, i + 1).reduce((sum, b) => sum + b.quantity, 0)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls & History */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSimulateOrder("bid")}
              className="group relative flex flex-col items-center justify-center p-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/50 rounded-2xl transition-all active:scale-95"
            >
              <TrendingUp className="w-6 h-6 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Market Buy</span>
            </button>
            <button
              onClick={() => handleSimulateOrder("ask")}
              className="group relative flex flex-col items-center justify-center p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-2xl transition-all active:scale-95"
            >
              <TrendingDown className="w-6 h-6 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Market Sell</span>
            </button>
          </div>

          <div className="bg-black/40 rounded-2xl border border-zinc-800/50 p-4 flex-1">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Recent Executions
            </h4>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {tradeHistory.map((trade, i) => (
                  <motion.div
                    key={`${trade.time}-${i}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between text-xs border-l-2 border-blue-500/50 pl-3 py-1"
                  >
                    <div>
                      <span className="text-zinc-200 font-bold">${trade.price.toFixed(2)}</span>
                      <span className="mx-2 text-zinc-600">x</span>
                      <span className="text-zinc-400">{trade.quantity}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 uppercase font-bold">{trade.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tradeHistory.length === 0 && (
                <div className="py-8 text-center text-[10px] text-zinc-600 uppercase font-bold">
                  Waiting for market movement...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-start gap-4">
        <PlusCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed text-zinc-400">
          <strong className="text-blue-400">Trading Engine Insight:</strong> In a real-world HFT environment, this L2 order book would be processed in sub-microsecond intervals. Memory alignment (Cache Line Alignment) ensures that the Bid/Ask trees are traversed with minimum cache misses.
        </div>
      </div>
    </div>
  );
};
