import React from 'react';
import { motion } from 'motion/react';
import { Zap, Server, ShieldAlert, CheckCircle, Flame, ArrowRight, Activity, ArrowDown, Layers, Target, BarChart2, Hash } from 'lucide-react';

export const LowLatencyVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300 overflow-hidden relative">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-500" /> Latency Pipeline
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Standard Path (Slow) */}
        <div className="flex-1 w-full border border-red-500/20 bg-red-500/5 rounded-lg p-4 relative opacity-60">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-red-400">
             <Server className="w-3 h-3" /> Std OS Stack
          </div>
          <div className="space-y-3 mt-4">
            <div className="h-10 border border-zinc-700 rounded flex items-center justify-center text-xs bg-zinc-900 shadow">NIC (Hardware)</div>
            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-red-500/50" /></div>
            <div className="h-10 border border-red-500/40 rounded flex flex-col items-center justify-center text-xs bg-red-950/30 text-red-300">
               <span>OS Kernel</span>
               <span className="text-[9px] opacity-70">Context Switch</span>
            </div>
            <div className="flex justify-center"><ArrowDown className="w-4 h-4 text-red-500/50" /></div>
            <div className="h-10 border border-zinc-700 rounded flex items-center justify-center text-xs bg-zinc-900 shadow">Trading App</div>
          </div>
          <div className="mt-4 text-center text-xs text-red-400 font-bold bg-red-950/50 py-1 rounded">~10-20 μs</div>
        </div>

        {/* HFT Path (Fast) */}
        <div className="flex-1 w-full border border-emerald-500/30 bg-emerald-500/10 rounded-lg p-4 relative shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-emerald-400">
             <Flame className="w-3 h-3" /> Bypass Stack
          </div>
          <div className="space-y-3 mt-4 relative">
            <div className="h-10 border border-emerald-500/40 rounded flex items-center justify-center text-xs bg-emerald-950/40 text-emerald-300 shadow">Smart NIC (FPGA)</div>
            
            {/* Direct Memory Access bypasses Kernel */}
            <div className="h-24 relative flex justify-center py-2">
              <div className="absolute inset-y-0 w-px border-l-2 border-emerald-500/50 border-dashed z-0" />
              <motion.div 
                 className="absolute z-10 w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                 animate={{ y: [0, 80] }}
                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute top-1/2 -translate-y-1/2 bg-zinc-950/80 px-2 text-[10px] text-emerald-400/80 z-20 backdrop-blur-sm ml-16 transform -translate-x-4">
                 Zero-Copy DMA
              </div>
            </div>

            <div className="h-10 border border-emerald-500/40 rounded flex items-center justify-center text-xs bg-emerald-950/40 text-emerald-300 shadow">Trading App</div>
          </div>
          <div className="mt-4 text-center text-xs text-emerald-400 font-bold bg-emerald-950/50 py-1 rounded">&lt; 1 μs</div>
        </div>
      </div>
    </div>
  );
};

export const L2OrderBookVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300 overflow-hidden">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Activity className="w-4 h-4 text-blue-500" /> L2 Order Book Matching
      </div>
      
      <div className="flex gap-4">
        {/* Bids */}
        <div className="flex-1 space-y-1">
          <div className="text-xs text-emerald-500 font-bold mb-2">BIDS (Buy)</div>
          {[
            { price: 100.04, size: 50, depth: 'w-4/5' },
            { price: 100.03, size: 75, depth: 'w-full' },
            { price: 100.02, size: 25, depth: 'w-2/5' },
            { price: 100.01, size: 100, depth: 'w-[120%]' },
          ].map((level, i) => (
             <div key={i} className="flex justify-between relative h-7 items-center px-2 z-10 text-xs">
                <div className={`absolute top-0 right-0 h-full bg-emerald-500/10 z-0 ${level.depth}`} />
                <span className="z-10 text-zinc-400">{level.size}</span>
                <span className="z-10 text-emerald-400 font-bold">{level.price.toFixed(2)}</span>
             </div>
          ))}
        </div>

        {/* Spread / Crossing */}
        <div className="w-8 flex flex-col items-center justify-center">
           <motion.div 
             className="w-px h-16 bg-blue-500/50 relative"
           >
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] z-20 flex items-center justify-center"
              >
                 <Zap className="w-2 h-2 text-white" />
              </motion.div>
           </motion.div>
        </div>

        {/* Asks */}
        <div className="flex-1 space-y-1">
          <div className="text-xs text-red-500 font-bold mb-2 text-right">ASKS (Sell)</div>
          {[
            { price: 100.05, size: 10, depth: 'w-1/5' },
            { price: 100.06, size: 40, depth: 'w-3/5' },
            { price: 100.07, size: 60, depth: 'w-4/5' },
            { price: 100.08, size: 20, depth: 'w-1/3' },
          ].map((level, i) => (
             <div key={i} className="flex justify-between relative h-7 items-center px-2 z-10 text-xs">
                <div className={`absolute top-0 left-0 h-full bg-red-500/10 z-0 ${level.depth}`} />
                <span className="z-10 text-red-400 font-bold">{level.price.toFixed(2)}</span>
                <span className="z-10 text-zinc-400">{level.size}</span>
             </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between text-[10px] text-zinc-500">
         <div>Spread: $0.01</div>
         <div className="text-amber-500/80">Matching incoming buy at 100.05</div>
      </div>
    </div>
  );
};

export const HFTHierarchyVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Layers className="w-4 h-4 text-purple-500" /> Stack Hierarchy
      </div>
      <div className="flex flex-col gap-2">
        <motion.div animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} className="border border-indigo-500/50 bg-indigo-500/10 p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-indigo-400 font-bold">Strategy Engine</span>
          <span className="text-zinc-500 text-[10px]">C++ Logic</span>
        </motion.div>
        <div className="border border-blue-500/30 bg-blue-500/10 p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-blue-400 font-bold">Order Matcher / Risk</span>
          <span className="text-zinc-500 text-[10px]">Lock-free State</span>
        </div>
        <div className="border border-teal-500/30 bg-teal-500/10 p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-teal-400 font-bold">Protocol Parsers (FIX/ITCH)</span>
          <span className="text-zinc-500 text-[10px]">Zero-Copy Deserialization</span>
        </div>
        <div className="border border-emerald-500/30 bg-emerald-500/10 p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-emerald-400 font-bold">Kernel Bypass (DPDK)</span>
          <span className="text-zinc-500 text-[10px]">CPU Polling</span>
        </div>
        <div className="border border-emerald-600/50 bg-emerald-950/40 p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-emerald-500 font-bold flex items-center gap-2"><Server className="w-3 h-3" /> FPGA / SmartNIC</span>
          <span className="text-zinc-500 text-[10px]">Hardware (L1/L2)</span>
        </div>
      </div>
    </div>
  );
};

export const VolatilityRiskVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Activity className="w-4 h-4 text-orange-500" /> Volatility vs Spread
      </div>
      <div className="relative h-40 border-l border-b border-zinc-700 flex items-end px-2 pb-2">
        {/* Graph representation */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 10,80 Q 40,80 60,60 T 90,20" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 10,70 Q 40,70 60,40 T 90,10" fill="none" stroke="#ef4444" strokeWidth="2" />
        </svg>
        <div className="w-full flex justify-between text-[10px] text-zinc-500 pt-2 absolute bottom-0 left-0 right-0 translate-y-full">
          <span>Low Volatility</span>
          <span>High Volatility</span>
        </div>
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-zinc-500">
          Spread Size
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-xs">
          <div className="text-zinc-400 mb-1">Calm Market</div>
          <div className="text-emerald-400 font-bold">$100.02 - $100.03</div>
          <div className="text-[10px] text-zinc-500">Tight spread, frequent trades</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-xs">
          <div className="text-zinc-400 mb-1">Volatile Market</div>
          <div className="text-orange-400 font-bold">$99.95 - $100.10</div>
          <div className="text-[10px] text-zinc-500">Wide spread, high risk premium</div>
        </div>
      </div>
    </div>
  );
};

export const ExpectancyMatrixVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300">
       <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Target className="w-4 h-4 text-pink-500" /> Edge Expectancy
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-zinc-900 p-2 text-zinc-500">WR \ RR</div>
        <div className="bg-zinc-900 border-b border-pink-500/30 p-2">1:1</div>
        <div className="bg-zinc-900 border-b border-pink-500/30 p-2">1:3</div>
        <div className="bg-zinc-900 border-r border-pink-500/30 p-2">30%</div>
        <div className="bg-zinc-950 border border-red-500/20 text-red-400 p-2">-EV</div>
        <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 p-2">+EV</div>
        <div className="bg-zinc-900 border-r border-pink-500/30 p-2">50%</div>
        <div className="bg-zinc-950 border border-zinc-700/50 text-zinc-400 p-2 pb-2">Breakeven</div>
        <div className="bg-emerald-900/30 border border-emerald-400/40 text-emerald-400 p-2 font-bold">+EV</div>
        <div className="bg-zinc-900 border-r border-pink-500/30 p-2">70%</div>
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 p-2 font-bold">+EV</div>
        <div className="bg-emerald-900/50 border border-emerald-400/60 text-emerald-300 p-2 font-black">+++EV</div>
      </div>
    </div>
  );
};

export const DeterministicPipelineVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <ArrowRight className="w-4 h-4 text-cyan-500" /> Sequential Pipeline
      </div>
      <div className="flex justify-between items-center relative py-4">
        <div className="absolute left-0 right-0 h-1 bg-zinc-800 top-1/2 -translate-y-1/2 z-0" />
        <motion.div 
          animate={{ x: ["0%", "300%"] }} 
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_#22d3ee] z-10"
        />
        {[
          { label: "Ingress", color: "blue" },
          { label: "Risk Check", color: "orange" },
          { label: "Order Match", color: "emerald" },
          { label: "Publish", color: "purple" }
        ].map((stage, i) => (
          <div key={i} className="z-20 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-lg bg-${stage.color}-500/20 border border-${stage.color}-500/50 flex items-center justify-center`}>
              <CheckCircle className={`w-5 h-5 text-${stage.color}-400`} />
            </div>
            <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">{stage.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StructPaddingTheoryVisual = () => {
  return (
    <div className="w-full bg-zinc-950 rounded-xl border border-zinc-800 p-6 font-mono text-zinc-300">
      <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
        <Hash className="w-4 h-4 text-rose-500" /> Struct Memory Layout (Padding)
      </div>
      <div className="mb-4 bg-zinc-900 border border-zinc-800 p-3 rounded text-xs text-zinc-400">
        <span className="text-purple-400">struct</span> Order {'{'} <br/>
        &nbsp;&nbsp;<span className="text-blue-400">char</span> type;     <span className="text-zinc-600">// 1 byte</span><br/>
        &nbsp;&nbsp;<span className="text-blue-400">double</span> price;  <span className="text-zinc-600">// 8 bytes</span><br/>
        {'}'};
      </div>
      <div className="flex flex-col gap-1 text-[10px] text-center w-full max-w-[300px] mx-auto">
        <div className="flex text-zinc-500 mb-1">
          <div className="flex-1">0</div>
          <div className="flex-[7]">1-7 (Padding)</div>
        </div>
        <div className="flex h-8 w-full border border-zinc-700 bg-zinc-900 rounded overflow-hidden">
          <div className="flex-1 bg-cyan-500/20 border-r border-cyan-500/50 text-cyan-400 flex items-center justify-center">type</div>
          <div className="flex-[7] bg-rose-500/10 flex items-center justify-center text-rose-500 border-r border-zinc-700 bg-striped-danger opacity-70">
            [ Padding Bytes ]
          </div>
        </div>
        <div className="flex h-8 w-full border border-zinc-700 bg-zinc-900 rounded overflow-hidden mt-1">
          <div className="flex-1 bg-emerald-500/20 border-r border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-inner">
             price (8 bytes aligned)
          </div>
        </div>
      </div>
    </div>
  );
};
