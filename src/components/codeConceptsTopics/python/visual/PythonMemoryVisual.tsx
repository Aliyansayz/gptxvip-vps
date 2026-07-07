import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Trash2, Shield, Heart, Sparkles, Plus, Minus, ArrowRight } from 'lucide-react';

export const PythonMemoryVisual: React.FC = () => {
  const [refCount, setRefCount] = useState(2);
  const [circularActive, setCircularActive] = useState(false);
  const [gcState, setGcState] = useState<'idle' | 'running' | 'collected'>('idle');

  const handleManualGC = () => {
    setGcState('running');
    setTimeout(() => {
      setCircularActive(false);
      setGcState('collected');
      setTimeout(() => setGcState('idle'), 2500);
    }, 1200);
  };

  const currentEffCount = refCount + (circularActive ? 1 : 0);

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">CPython Memory & GC Simulator</span>
          <span className="text-sm font-semibold text-zinc-200 mt-0.5">Reference Tracker (ob_refcnt)</span>
        </div>
        <button
          onClick={() => {
            setRefCount(2);
            setCircularActive(false);
            setGcState('idle');
          }}
          className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
          title="Reset Environment"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Variables Namespace</span>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-900">
              <span className="font-mono text-xs text-yellow-450 font-bold text-yellow-500">conn_a</span>
              <span className="text-[10px] text-emerald-400 font-mono">Reference Active</span>
            </div>
            {refCount >= 2 && (
              <div className="flex items-center justify-between bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-900">
                <span className="font-mono text-xs text-yellow-450 font-bold text-yellow-500">conn_b</span>
                <span className="text-[10px] text-emerald-400 font-mono">Reference Active</span>
              </div>
            )}
            {refCount >= 3 && (
              <div className="flex items-center justify-between bg-zinc-950 px-2.5 py-1.5 rounded border border-zinc-900">
                <span className="font-mono text-xs text-yellow-500 font-bold">conn_c</span>
                <span className="text-[10px] text-emerald-400 font-mono">Reference Active</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setRefCount(prev => Math.min(prev + 1, 3))}
              disabled={refCount >= 3}
              className="flex-1 py-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded text-[10px] font-bold flex items-center justify-center gap-1 text-zinc-200"
            >
              <Plus size={10} /> Bind Conn
            </button>
            <button
              onClick={() => setRefCount(prev => Math.max(prev - 1, 0))}
              disabled={refCount <= 0}
              className="flex-1 py-1 bg-zinc-850 hover:bg-zinc-800 disabled:opacity-30 rounded text-[10px] font-bold flex items-center justify-center gap-1 text-zinc-400"
            >
              <Minus size={10} /> Decouple
            </button>
          </div>
        </div>

        <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Circular Referencing</span>
            <p className="text-[10px] text-zinc-400 mb-2 leading-relaxed">
              Force instance circular link (A linked to B, B linked to A) keeping references locked.
            </p>
          </div>
          <button
            onClick={() => setCircularActive(prev => !prev)}
            className={`w-full py-2 rounded text-[10px] font-bold transition-all ${
              circularActive 
                ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/15' 
                : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/15'
            }`}
          >
            {circularActive ? 'Break Cycle Link' : 'Create Circular Link'}
          </button>
        </div>
      </div>

      {/* Heap Rendering Container */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 min-h-[160px] flex items-center justify-center relative overflow-hidden mb-6">
        {currentEffCount > 0 ? (
          <div className="flex flex-col items-center relative z-10">
            {/* Source Object */}
            <motion.div
              layout
              className={`w-36 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg relative ${
                currentEffCount === 1 
                  ? 'bg-amber-500/5 border-amber-500/40' 
                  : 'bg-emerald-500/5 border-emerald-500/40'
              }`}
            >
              <span className="text-[9px] uppercase text-zinc-500 font-bold font-mono tracking-wider">CPython Object</span>
              <span className="text-sm font-semibold text-zinc-300 font-mono mt-0.5">DBConnection</span>
              
              {/* Ref value label */}
              <div className="mt-2.5 flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded-full border border-white/5">
                <Heart size={10} className="text-red-400 fill-red-400 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-zinc-300">
                  ob_refcnt: <span className="text-yellow-400">{currentEffCount}</span>
                </span>
              </div>

              {circularActive && (
                <div className="absolute -top-3 right-2 flex items-center gap-1 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/40 text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 animate-pulse">
                  <Sparkles size={8} /> Circular
                </div>
              )}
            </motion.div>

            {/* Circular Arrow Track */}
            {circularActive && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ minWidth: '200px' }}>
                <path
                  d="M 120,40 C 180,-10 200,90 130,70"
                  fill="transparent"
                  stroke="rgba(239, 68, 68, 0.6)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  className="animate-[dash_2s_linear_infinite]"
                />
              </svg>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="text-center p-6 flex flex-col items-center"
            >
              <Trash2 className="w-8 h-8 text-zinc-650 text-zinc-500 mb-2 animate-bounce" />
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Released!</span>
              <p className="text-[10px] text-zinc-500 max-w-[280px] mt-1">
                Ref counter hit 0. CPython instantly reclaimed heap bytes, invoking destructor commands.
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Cyclic Sweep Manual Sweep Control */}
      {circularActive && (
        <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-zinc-200">Cyclid Garbage Sweeper</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Generational GC Engine</span>
          </div>
          <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">
            Standard Reference Counting cannot resolve cyclic dependencies. In this state, memory will leak indefinitely until Python's generational collector sweeps the cyclic graph manually.
          </p>
          <button
            onClick={handleManualGC}
            disabled={gcState === 'running'}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
          >
            {gcState === 'running' ? (
              <>
                <RefreshCw size={12} className="animate-spin" /> Performing Sweeping...
              </>
            ) : gcState === 'collected' ? (
              'Collected & Cleared Circular Leak!'
            ) : (
              'Invoke gc.collect() manually'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
