import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Plus, Trash2 } from 'lucide-react';

export const MemoryManagementVisual: React.FC = () => {
  const [blocks, setBlocks] = useState<boolean[]>(Array(8).fill(false));
  const [activeInstruction, setActiveInstruction] = useState<'new' | 'delete' | 'wait'>('wait');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Auto-animate memory allocation
    const animate = () => {
      setBlocks(prev => {
        const copy = [...prev];
        const emptyIndices = copy.map((v, i) => !v ? i : -1).filter(i => i !== -1);
        const filledIndices = copy.map((v, i) => v ? i : -1).filter(i => i !== -1);

        if (emptyIndices.length > 0 && (filledIndices.length === 0 || Math.random() > 0.3)) {
          setActiveInstruction('new');
          const toFill = emptyIndices[0]; // sequential allocation simulation
          copy[toFill] = true;
        } else if (filledIndices.length > 0) {
          setActiveInstruction('delete');
          const toFree = filledIndices[Math.floor(Math.random() * filledIndices.length)];
          copy[toFree] = false;
        } else {
          setActiveInstruction('wait');
        }
        return copy;
      });
    };

    interval = setInterval(animate, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full relative z-10 font-mono gap-8 p-4">
      {/* Code execution highlight */}
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg flex items-center justify-center gap-3 w-64 shadow-lg">
        <Database className="w-5 h-5 text-zinc-400" />
        <span className="text-zinc-300 font-bold text-sm tracking-wide">
          {activeInstruction === 'new' ? (
             <span className="text-emerald-400">int* ptr = new int;</span>
          ) : activeInstruction === 'delete' ? (
             <span className="text-red-400">delete ptr;</span>
          ) : (
             <span className="text-zinc-500">running...</span>
          )}
        </span>
      </div>

      {/* RAM Display */}
      <div className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
         <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
           System RAM (Heap)
         </h4>
         <div className="grid grid-cols-4 gap-3">
           {blocks.map((isAllocated, i) => (
             <motion.div
               key={i}
               layout
               initial={false}
               animate={{
                 backgroundColor: isAllocated ? '#34d399' : '#e4e4e7', // emerald-400 vs zinc-200
                 scale: isAllocated ? [1, 1.1, 1] : 1,
               }}
               transition={{ duration: 0.3 }}
               className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center ${
                 isAllocated 
                  ? 'border-emerald-500 dark:bg-emerald-500/80 shadow-[0_0_15px_rgba(52,211,153,0.5)]' 
                  : 'border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700'
               }`}
             >
               <AnimatePresence>
                 {isAllocated && (
                   <motion.span
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="text-[9px] font-black text-white mix-blend-difference"
                   >
                     0x{i}A
                   </motion.span>
                 )}
               </AnimatePresence>
             </motion.div>
           ))}
         </div>
      </div>
    </div>
  );
};
