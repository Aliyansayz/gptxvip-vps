import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, ShieldAlert, CheckCircle2, ChevronRight, ShieldCheck, HelpCircle } from 'lucide-react';

export const PythonDescriptorsVisual: React.FC = () => {
  const [inputValue, setInputValue] = useState('145.20');
  const [pipelineState, setPipelineState] = useState<'idle' | 'routing' | 'approved' | 'rejected'>('idle');
  const [logMessages, setLogMessages] = useState<string[]>(['Descriptor pipeline initialised and holding.']);

  const runPipeline = () => {
    const num = parseFloat(inputValue);
    setPipelineState('routing');
    setLogMessages(prev => [...prev, `[Access Intercepted] calling wrapper class PositivePrice.__set__(val=${inputValue})`]);

    setTimeout(() => {
      if (isNaN(num) || num <= 0) {
        setPipelineState('rejected');
        setLogMessages(prev => [
          ...prev, 
          `[FAIL validation] Value is invalid or sub-zero. Throwing ValueError: Must be positive!`
        ]);
      } else {
        setPipelineState('approved');
        setLogMessages(prev => [
          ...prev, 
          `[PASS validation] writing instance._price = ${num} successfully.`
        ]);
      }
    }, 1200);
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Descriptor Interception Simulator</span>
          <span className="text-sm font-semibold text-zinc-200 mt-0.5">Custom Validation Hooks</span>
        </div>
        <HelpCircle size={14} className="text-zinc-500 cursor-help" />
      </div>

      {/* Input Module */}
      <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 mb-6">
        <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-2">Simulate Variable Assignment</span>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 font-mono text-xs text-zinc-600">fast_order.price =</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setPipelineState('idle');
              }}
              className="w-full pl-36 pr-3 py-2 bg-zinc-950 border border-zinc-850 rounded text-xs font-mono font-bold text-yellow-500 focus:outline-none focus:border-zinc-700"
              placeholder="e.g. 10.5"
            />
          </div>
          <button
            onClick={runPipeline}
            disabled={pipelineState === 'routing'}
            className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-805 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow active:scale-95"
          >
            <Play size={12} fill="currentColor" /> Run Assignment
          </button>
        </div>
      </div>

      {/* Interactive Visual Corridor */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 min-h-[140px] flex items-center justify-center relative overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-2 w-full items-center relative z-10">
          
          {/* Caller Variable Box */}
          <div className="col-span-3 flex flex-col items-center">
            <div className="px-3 py-2 bg-zinc-900 border border-zinc-750 rounded-xl min-w-[70px] text-center shadow">
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">Caller</span>
              <span className="text-xs font-mono font-bold text-yellow-405 text-yellow-500">{inputValue || 'null'}</span>
            </div>
          </div>

          {/* Flow Indicator Corridor */}
          <div className="col-span-3 flex justify-center relative h-10 items-center">
            {pipelineState === 'routing' ? (
              <motion.div
                initial={{ left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-3 h-3 rounded-full bg-yellow-500 absolute"
              />
            ) : (
              <div className="h-[2px] w-full bg-zinc-850" />
            )}
            <ChevronRight className="w-4 h-4 text-zinc-750 absolute right-0" />
          </div>

          {/* Descriptor Validator Shield */}
          <div className="col-span-3 flex flex-col items-center">
            <motion.div
              animate={{
                scale: pipelineState === 'approved' ? 1.05 : pipelineState === 'rejected' ? 0.95 : 1,
              }}
              className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg transition-all ${
                pipelineState === 'approved' 
                  ? 'bg-emerald-500/5 border-emerald-500/50 text-emerald-400' 
                  : pipelineState === 'rejected' 
                  ? 'bg-red-500/5 border-red-500/50 text-red-500' 
                  : pipelineState === 'routing' 
                  ? 'bg-yellow-500/5 border-yellow-500/40 text-yellow-500' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500'
               }`}
            >
              {pipelineState === 'approved' ? (
                <ShieldCheck className="w-8 h-8 opacity-90 animate-pulse" />
              ) : pipelineState === 'rejected' ? (
                <ShieldAlert className="w-8 h-8 opacity-90" />
              ) : (
                <span className="text-[10px] uppercase font-mono font-bold">__set__</span>
              )}
              <span className="text-[9px] uppercase font-bold tracking-wider mt-1 text-center font-mono">Descriptor</span>
            </motion.div>
          </div>

          {/* Inner Instance Reference Target Box */}
          <div className="col-span-3 flex flex-col items-center">
            <div className={`px-3 py-2 bg-zinc-900 border border-zinc-850 rounded-xl min-w-[70px] text-center shadow ${pipelineState === 'approved' ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : ''}`}>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold block">_price value</span>
              <span className={`text-xs font-mono font-bold ${pipelineState === 'approved' ? 'text-emerald-400' : 'text-zinc-650 text-zinc-400'}`}>
                {pipelineState === 'approved' ? inputValue : '---'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Terminal Real-time Diagnostic Log Console */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 font-mono text-[10px] leading-relaxed">
        <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-extrabold pb-1.5 border-b border-zinc-200/5 mb-2">
          CPython Execution Shell Output
        </div>
        <div className="h-24 overflow-y-auto flex flex-col gap-1 text-zinc-400">
          {logMessages.map((msg, idx) => (
            <div key={idx} className="flex gap-2.5 items-start">
              <span className="text-zinc-600 select-none">&gt;</span>
              <span className={msg.includes('FAIL') ? 'text-red-400' : msg.includes('PASS') ? 'text-emerald-400' : 'text-zinc-400'}>{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
