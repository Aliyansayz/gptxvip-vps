import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, CheckCircle, XCircle, RotateCcw, Layers } from 'lucide-react';

interface ExerciseProps {
  exercise: any;
  onComplete: () => void;
}

export const HFTStackHierarchyVisual: React.FC<ExerciseProps> = ({ exercise }) => {
  const correct_order = [
    'Hardware (FPGA / NIC)',
    'Network Infrastructure',
    'Market Data Feed Handler',
    'Strategy Engine',
    'Execution Gateway'
  ];

  const [draggablePool, setDraggablePool] = useState<string[]>([...correct_order].sort(() => Math.random() - 0.5));
  const [slots, setSlots] = useState<(string | null)[]>(new Array(5).fill(null));

  const handleDrop = (index: number, e: React.DragEvent) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;

    const newSlots = [...slots];
    const existing = newSlots[index];
    
    // If slot occupied, move existing back to pool
    if (existing) {
      setDraggablePool(prev => [...prev, existing]);
    }

    newSlots[index] = item;
    setSlots(newSlots);
    setDraggablePool(prev => prev.filter(i => i !== item));
  };

  const handleReset = () => {
    setSlots(new Array(5).fill(null));
    setDraggablePool([...correct_order].sort(() => Math.random() - 0.5));
  };

  const isSuccess = slots.every((s, i) => s === correct_order[i]);

  const renderDraggable = (item: string, index: number) => (
    <motion.div
      key={item}
      layoutId={`item-${item}`}
      className="cursor-grab active:cursor-grabbing"
    >
      <div
        draggable
        onDragStart={(e: React.DragEvent) => {
          e.dataTransfer.setData('text/plain', item);
        }}
        className="w-full h-14 md:h-16 px-4 rounded-xl border-2 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all group flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-blue-500 transition-colors">
          <Layers className="w-4 h-4" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tight truncate">{item}</div>
          <div className="text-[9px] text-zinc-500 font-mono flex items-center gap-1 uppercase">
            <span className="w-1 h-1 rounded-full bg-zinc-300" /> Component
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSlot = (index: number) => {
    const item = slots[index];
    const isCorrect = item && item === correct_order[index];
    const isFull = !!item;

    return (
      <div 
        key={index}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(index, e)}
        className={`relative h-14 md:h-16 border-2 border-dashed rounded-xl flex items-center justify-center transition-all ${
          isFull 
            ? isCorrect 
              ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
              : 'border-red-500/50 bg-red-500/5'
            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
        }`}
      >
        <div className="absolute top-1 left-1.5 text-[8px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest z-0">
          Layer 0{5-index}
        </div>
        
        <AnimatePresence mode="wait">
          {item ? (
            <motion.div
              layoutId={`item-${item}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full h-full flex items-center justify-center px-4 z-10"
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 truncate flex-1 uppercase tracking-tight">{item}</div>
                <button 
                  onClick={() => {
                    const newSlots = [...slots];
                    newSlots[index] = null;
                    setSlots(newSlots);
                    setDraggablePool(prev => [...prev, item]);
                  }}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 uppercase tracking-widest pointer-events-none italic opacity-50">Assign Layer</div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[400px]">
        {/* Hierarchy Construction Zone */}
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 z-10">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase italic">Stack Architecture</h3>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Bottom-up Hierarchy</p>
            </div>
            {isSuccess && (
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg"
              >
                Operational
              </motion.div>
            )}
          </div>

          <div className="flex-1 flex flex-col-reverse gap-2 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            {correct_order.map((_, i) => renderSlot(i))}
          </div>
          
          <div className="mt-6 flex gap-1 h-1">
            {correct_order.map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-colors duration-500 ${slots[i] === correct_order[i] ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} 
              />
            ))}
          </div>
        </div>

        {/* Source Fragments */}
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950/50 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-3xl p-6 overflow-y-auto custom-scrollbar">
           <div className="flex items-center gap-2 mb-6 text-zinc-400">
             <Cpu className="w-4 h-4" />
             <h4 className="text-[10px] font-black uppercase tracking-widest select-none">Components</h4>
           </div>

           <div className="grid grid-cols-1 gap-3">
             {draggablePool.map((item, index) => renderDraggable(item, index))}
             {draggablePool.length === 0 && (
               <div className="flex flex-col items-center justify-center h-40 opacity-20 text-center grayscale py-10">
                 <Cpu className="w-10 h-10 mb-2" />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Stack Deployed</p>
               </div>
             )}
           </div>

           <div className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800">
             <button 
               onClick={handleReset}
               className="w-full py-2.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold uppercase text-[9px] tracking-widest transition-all"
             >
               Clear Config
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};
