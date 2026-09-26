import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ArrowDown, ArrowRight, Layers, CircleDot } from 'lucide-react';

interface QueueItem {
  id: number;
  val: string;
  color: string;
}

export const PythonQueueVisual: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [producedCount, setProducedCount] = useState<number>(0);
  const [consumedCount, setConsumedCount] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [pState, setPState] = useState<'idle' | 'putting' | 'blocked'>('idle');
  const [cState, setCState] = useState<'idle' | 'getting' | 'blocked'>('idle');

  const MAX_SIZE = 5;

  const itemColors = [
    'text-blue-400 bg-blue-500/10 border-blue-500/30',
    'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'text-teal-400 bg-teal-500/10 border-teal-500/30'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        // Simple heuristic: 60% chance to try producing, 40% chance to try consuming to create dynamic bottlenecks
        const action = Math.random();
        
        if (action < 0.55) {
          // Produce item
          if (queue.length < MAX_SIZE) {
            setPState('putting');
            const newId = producedCount + 1;
            const item = {
              id: newId,
              val: `Tx_${newId}`,
              color: itemColors[newId % itemColors.length]
            };
            setLogs(prev => [`[Producer] queue.put(${item.val}) - Pushed message to queue`, ...prev.slice(0, 5)]);
            setQueue(prev => [...prev, item]);
            setProducedCount(newId);
            setTimeout(() => setPState('idle'), 600);
          } else {
            setPState('blocked');
            setLogs(prev => [`[Producer] queue.put() BLOCKED - Queue is FULL at capacity ${MAX_SIZE}`, ...prev.slice(0, 5)]);
          }
        } else {
          // Consume item
          if (queue.length > 0) {
            setCState('getting');
            const itemToConsume = queue[0];
            setLogs(prev => [`[Consumer] queue.get() -> Fetched ${itemToConsume.val} - Triggering task_done()`, ...prev.slice(0, 5)]);
            setQueue(prev => prev.slice(1));
            setConsumedCount(prev => prev + 1);
            setTimeout(() => setCState('idle'), 600);
          } else {
            setCState('blocked');
            setLogs(prev => [`[Consumer] queue.get() BLOCKED - Queue is EMPTY`, ...prev.slice(0, 5)]);
          }
        }
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, queue, producedCount, consumedCount]);

  const handleReset = () => {
    setIsPlaying(false);
    setQueue([]);
    setProducedCount(0);
    setConsumedCount(0);
    setLogs(["Queue initialized. Start simulator to watch messages stream."]);
    setPState('idle');
    setCState('idle');
  };

  return (
    <div className="w-full bg-zinc-950 rounded-2xl border border-zinc-850 p-6 font-sans text-zinc-300 shadow-xl max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-200/10 pb-4 mb-4">
        <div>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Queue Pipeline Simulator</span>
          <h4 className="text-sm font-semibold text-zinc-200 mt-0.5">FIFO queue.Queue Thread-Safe Flow</h4>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1 px-3 text-xs rounded font-bold transition-all flex items-center gap-1.5 ${
              isPlaying 
                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30' 
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

      {/* Grid containing Producer, Queue, Consumer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch mb-6">
        
        {/* Producer Worker */}
        <div className="md:col-span-3 flex flex-col justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-900/10 shrink-0">
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-500">Producer</span>
            <div className={`mt-2 p-1.5 rounded-lg text-xs font-mono font-bold text-center border transition-all ${
              pState === 'putting' 
                ? 'bg-blue-550/20 border-blue-500 text-blue-300' 
                : pState === 'blocked'
                ? 'bg-rose-550/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}>
              {pState === 'putting' ? 'put()' : pState === 'blocked' ? 'BLOCKED' : 'IDLE'}
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-[9px] text-zinc-500 block leading-tight">Total Put Transactions</span>
            <span className="text-lg font-bold text-blue-400 font-mono">{producedCount}</span>
          </div>
        </div>

        {/* Bounded Conveyor Belt */}
        <div className="md:col-span-6 bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] uppercase font-bold text-zinc-500">Thread-Safe FIFO Buffer</span>
            <span className="text-[9px] font-mono text-zinc-500">{queue.length} / {MAX_SIZE} items</span>
          </div>

          {/* Buffer Grid Slots */}
          <div className="flex-1 min-h-[70px] bg-zinc-950 border border-zinc-900 rounded-lg p-2 flex items-center justify-center gap-1.5 relative">
            {queue.length === 0 ? (
              <span className="text-[10px] text-zinc-700 italic font-mono">[ Empty queue.Queue ]</span>
            ) : (
              <AnimatePresence>
                {queue.map((item, idx) => (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, x: -10 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: 10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    key={item.id}
                    className={`h-10 w-10 rounded-md border flex flex-col items-center justify-center font-mono font-bold text-[10px] ${item.color}`}
                  >
                    <span>{item.val}</span>
                    <span className="text-[8px] opacity-40 mt-0.5">#{idx + 1}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="flex justify-between text-[8px] text-zinc-600 font-mono mt-1.5">
            <span>&larr; HEAD (get)</span>
            <span>TAIL (put) &larr;</span>
          </div>
        </div>

        {/* Consumer Worker */}
        <div className="md:col-span-3 flex flex-col justify-between p-3 rounded-xl border border-zinc-900 bg-zinc-900/10 shrink-0">
          <div className="text-center">
            <span className="text-[9px] uppercase font-bold text-zinc-500">Consumer</span>
            <div className={`mt-2 p-1.5 rounded-lg text-xs font-mono font-bold text-center border transition-all ${
              cState === 'getting' 
                ? 'bg-emerald-550/20 border-emerald-500 text-emerald-300' 
                : cState === 'blocked'
                ? 'bg-rose-550/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'
            }`}>
              {cState === 'getting' ? 'get()' : cState === 'blocked' ? 'BLOCKED' : 'IDLE'}
            </div>
          </div>
          <div className="mt-4 text-center">
            <span className="text-[9px] text-zinc-500 block leading-tight">Total Done Jobs</span>
            <span className="text-lg font-bold text-emerald-400 font-mono">{consumedCount}</span>
          </div>
        </div>

      </div>

      {/* Console log outputs */}
      <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-xs">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold">Execution Activity Log</span>
        <div className="h-28 overflow-y-auto space-y-1 bg-black/60 p-2 border border-zinc-900 rounded font-mono text-[11px] text-zinc-400 custom-scrollbar">
          {logs.length === 0 && (
            <span className="text-zinc-600 italic">No logs initialized. Start simulation.</span>
          )}
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-zinc-600">&bull;</span>
              <span className={log.includes("BLOCKED") ? "text-rose-400 font-bold" : log.includes("Consumer") ? "text-emerald-400" : "text-blue-400"}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
