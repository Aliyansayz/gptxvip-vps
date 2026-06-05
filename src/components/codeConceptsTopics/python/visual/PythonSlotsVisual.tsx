import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Scale, HardDrive, BarChart3, Zap, Layers } from 'lucide-react';

export const PythonSlotsVisual: React.FC = () => {
  const [measurementActive, setMeasurementActive] = useState(false);

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Memory Analysis Lab</span>
          <span className="text-sm font-semibold text-zinc-200 mt-0.5">__slots__ Array vs Dynamic Dictionary</span>
        </div>
        <Scale size={14} className="text-indigo-400" />
      </div>

      <p className="text-[11px] text-zinc-400 leading-relaxed mb-6">
        When instantiating millions of small structs (e.g., market-ticks in HFT applications), CPython's standard <span className="font-mono text-zinc-300">__dict__</span> table creates a massive hash overhead. Declaring <span className="font-mono text-zinc-300">__slots__</span> binds fields to static linear offset templates.
      </p>

      {/* Side-by-side Layout */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        
        {/* Dynamic Hash Table Layout */}
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-red-400 mb-2">
              <Layers size={13} />
              <span>Standard Class</span>
            </div>
            <div className="rounded border border-red-500/10 bg-red-500/5 p-2 font-mono text-[9px] mb-3 flex flex-col gap-1.5">
              <div className="text-[9px] text-zinc-500 font-bold uppercase">Heap Struct Layout:</div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-900 text-zinc-400 flex justify-between">
                <span>[0] ob_refcnt</span>
                <span className="text-[8px] text-zinc-600">8 bytes</span>
              </div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-900 text-zinc-400 flex justify-between">
                <span>[1] __dict__</span>
                <span className="text-[8px] text-red-500">112 bytes (Hash)</span>
              </div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-900 text-zinc-500 italic">
                * Dynamic keys allowed at runtime
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-800/40">
              <span>Memory Size:</span>
              <span className="font-bold font-mono text-zinc-300">~152 bytes</span>
            </div>
          </div>
        </div>

        {/* Slotted Dynamic Array Layout */}
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 mb-2">
              <Cpu size={13} />
              <span>Slotted Class</span>
            </div>
            <div className="rounded border border-emerald-500/10 bg-emerald-500/5 p-2 font-mono text-[9px] mb-3 flex flex-col gap-1.5">
              <div className="text-[9px] text-zinc-500 font-bold uppercase">Heap Struct Layout:</div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-900 text-zinc-400 flex justify-between">
                <span>[0] ob_refcnt</span>
                <span className="text-[8px] text-zinc-600">8 bytes</span>
              </div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-905 text-zinc-400 flex justify-between">
                <span>[1] Timestamp</span>
                <span className="text-[8px] text-zinc-500">8 bytes</span>
              </div>
              <div className="bg-zinc-950 px-1.5 py-1 rounded border border-zinc-905 text-zinc-400 flex justify-between">
                <span>[2] Price</span>
                <span className="text-[8px] text-zinc-500">8 bytes</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-800/40">
              <span>Memory Size:</span>
              <span className="font-bold font-mono text-emerald-450 text-emerald-400">~24 bytes</span>
            </div>
          </div>
        </div>

      </div>

      {/* Measurement Metrics Display Trigger */}
      <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Simulate 1,000,000 instances tracking:</span>
          <button
            onClick={() => setMeasurementActive(prev => !prev)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all shadow"
          >
            <BarChart3 size={11} /> {measurementActive ? 'Hide Measurement' : 'Measure Footprints'}
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {measurementActive ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden flex flex-col gap-4"
            >
              {/* RAM Allocation Footprints bar chart */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>RAM Used (1,000,000 elements)</span>
                  <span>Footprint Size</span>
                </div>
                {/* Standard bar */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] w-20 text-zinc-500">Standard:</span>
                  <div className="flex-1 bg-zinc-950 h-3 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1 }}
                      className="bg-red-500/80 h-full"
                    />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-red-400">152 MB</span>
                </div>
                {/* Slotted bar */}
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] w-20 text-zinc-500">Slotted:</span>
                  <div className="flex-1 bg-zinc-950 h-3 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '16%' }}
                      transition={{ duration: 1 }}
                      className="bg-emerald-500 h-full"
                    />
                  </div>
                  <span className="font-mono text-[9px] font-bold text-emerald-400">24 MB</span>
                </div>
              </div>

              {/* Performance Indicator Speedup */}
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 text-[10px]">Average Access Speedup:</span>
                <span className="text-yellow-450 font-bold flex items-center gap-1 text-yellow-500 animate-pulse uppercase tracking-wider text-[10px]">
                  <Zap size={11} /> ~20% faster queries
                </span>
              </div>
            </motion.div>
          ) : (
            <p className="text-[10px] text-zinc-500 italic max-w-[400px] text-center mx-auto min-h-[35px] flex items-center justify-center">
              Click 'Measure Footprints' to execute memory density tests comparing instance allocation pools.
            </p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
