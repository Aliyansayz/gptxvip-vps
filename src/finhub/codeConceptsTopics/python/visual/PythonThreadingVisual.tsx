import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Play, Pause, RotateCcw, Cpu, CpuIcon, Layers, Lock, Unlock } from 'lucide-react';

export const PythonThreadingVisual: React.FC = () => {
  const [activeThread, setActiveThread] = useState<number>(0); // 0 = none, 1 = T1, 2 = T2
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [stepCount, setStepCount] = useState<number>(0);
  const [lockAcquired, setLockAcquired] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Threads ready. Start simulation to observe scheduling.");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepCount((prev) => {
          const nextStep = prev + 1;
          
          // Switch CPU acquisition round robin with lock simulation
          if (nextStep % 4 === 1) {
            setActiveThread(1);
            setLockAcquired(true);
            setMessage("Thread 1 acquires the GIL and Locks shared counter. Mutex locks variables.");
            setCounter((c) => c + 1);
          } else if (nextStep % 4 === 2) {
            setLockAcquired(false);
            setActiveThread(0);
            setMessage("Thread 1 releases lock. Context switch initiated by Python VM scheduler.");
          } else if (nextStep % 4 === 3) {
            setActiveThread(2);
            setLockAcquired(true);
            setMessage("Thread 2 acquires the GIL and Locks. Increments counter safely in thread-protected environment.");
            setCounter((c) => c + 1);
          } else {
            setLockAcquired(false);
            setActiveThread(0);
            setMessage("Thread 2 releases lock. Context switch. Ready for next thread cycle.");
          }
          return nextStep;
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setActiveThread(0);
    setCounter(0);
    setStepCount(0);
    setLockAcquired(false);
    setMessage("Simulation Reset. Ready.");
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Multi-Threading & GIL Visualizer</span>
          <h4 className="text-sm font-semibold text-zinc-200 mt-0.5">Global Interpreter Lock & Virtual Locks</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1 px-3 text-xs rounded font-bold transition-all flex items-center gap-1.5 ${
              isPlaying 
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30' 
                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
            }`}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            {isPlaying ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="p-1 px-2.5 text-xs bg-zinc-900 border border-zinc-800 rounded text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-1.5 font-bold"
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* Simulator message */}
      <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900 text-xs text-yellow-400 font-mono mb-6 min-h-[50px] flex items-center gap-2">
        <Shield size={16} className="text-yellow-500 shrink-0" />
        <span>{message}</span>
      </div>

      {/* Simulation Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Thread pool representation */}
        <div className="md:col-span-8 flex flex-col gap-3">
          {/* Thread 1 */}
          <div className={`p-3 rounded-xl border transition-all ${
            activeThread === 1 
              ? 'bg-blue-600/10 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
              : 'bg-zinc-900/40 border-zinc-900 text-zinc-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold">Thread 1: Worker_1</span>
              {activeThread === 1 && (
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold uppercase">Running</span>
              )}
            </div>
            <div className="mt-1.5 flex gap-2 items-center">
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-500 ${activeThread === 1 ? 'w-2/3 animate-pulse' : 'w-0'}`} />
              </div>
            </div>
          </div>

          {/* Thread 2 */}
          <div className={`p-3 rounded-xl border transition-all ${
            activeThread === 2 
              ? 'bg-purple-600/10 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
              : 'bg-zinc-900/40 border-zinc-900 text-zinc-500'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold">Thread 2: Worker_2</span>
              {activeThread === 2 && (
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold uppercase">Running</span>
              )}
            </div>
            <div className="mt-1.5 flex gap-2 items-center">
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full bg-purple-500 ${activeThread === 2 ? 'w-4/5 animate-pulse' : 'w-0'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Global Lock state (GIL) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-900 rounded-xl">
          <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-3 min-h-[14px]">GIL Lock State</span>
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${
            lockAcquired 
              ? 'bg-rose-500/10 border-rose-550 text-rose-550' 
              : 'bg-emerald-500/10 border-emerald-555 text-emerald-555'
          }`}>
            {lockAcquired ? <Lock size={24} /> : <Unlock size={24} />}
          </div>
          <span className={`text-[10px] font-bold font-mono mt-2 uppercase ${lockAcquired ? 'text-rose-450' : 'text-emerald-455'}`}>
            {lockAcquired ? "Locked" : "Unlocked"}
          </span>
        </div>
      </div>

      {/* Shared Resource block */}
      <div className="mt-6 bg-zinc-900/30 rounded-xl p-4 border border-zinc-900 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold text-zinc-400">Shared Int Resource</span>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">protected counter variable</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500 font-mono">counter =</span>
          <div className="p-2 py-1 px-4 bg-zinc-950 rounded border border-zinc-800 text-yellow-400 font-mono font-extrabold text-lg">
            {counter}
          </div>
        </div>
      </div>
    </div>
  );
};
