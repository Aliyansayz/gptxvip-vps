import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, Cpu, CheckCircle, AlertTriangle, Zap } from "lucide-react";

interface PaddingExerciseProps {
  exercise: {
    title: string;
    prompt: string;
    data?: {
      fields: { name: string; size: number; alignment: number }[];
    };
  };
}

export const StructPaddingVisual: React.FC<PaddingExerciseProps> = ({ exercise }) => {
  const [selections, setSelections] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Example Struct:
  // struct Data {
  //   char a;    // 1 byte
  //   // padding 3 bytes
  //   int b;     // 4 bytes
  //   short c;   // 2 bytes
  //   // padding 2 bytes
  // };
  // Total 12 bytes
  
  const memoryCells = Array.from({ length: 12 }, (_, i) => i);
  const correctPadding = [1, 2, 3, 10, 11]; // Indices of padding bytes

  const toggleCell = (index: number) => {
    if (isSubmitted) return;
    setSelections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
  };

  const isCorrect = 
    selections.length === correctPadding.length && 
    selections.every(s => correctPadding.includes(s));

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 bg-zinc-950 rounded-3xl border border-zinc-800 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tighter">Memory Alignment Lab</h3>
            <p className="text-[10px] text-zinc-500 italic">STRUCT MEMORY LAYOUT ANALYSIS</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
          <span className="text-[10px] text-zinc-400 uppercase font-black">64-bit Architecture</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Code Snippet */}
        <div className="bg-black/60 rounded-2xl border border-zinc-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Source Code</h4>
            <span className="text-[8px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500">GCC 13.x</span>
          </div>
          <pre className="text-xs text-indigo-300 leading-relaxed">
            <code>
{`struct TradePacket {
  char   packet_type; // 1 byte
  int    order_id;    // 4 bytes
  short  quantity;    // 2 bytes
};`}
            </code>
          </pre>
          <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 flex gap-3">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <p className="text-[10px] text-zinc-400 leading-normal">
              In C++, members are aligned according to their natural boundary. 
              The total size of the struct must be a multiple of its largest member's alignment.
            </p>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Memory Map (1 block = 1 byte)</h4>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-indigo-500/40" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Data</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm bg-red-500/40" />
                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Padding</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            {memoryCells.map((i) => {
              const isSelected = selections.includes(i);
              const isActuallyPadding = correctPadding.includes(i);
              
              let cellClass = "bg-zinc-800/50 border-zinc-800 text-zinc-600";
              if (isSelected) {
                cellClass = "bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]";
              }
              if (isSubmitted) {
                if (isActuallyPadding) {
                  cellClass = isSelected 
                    ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" 
                    : "bg-red-500/10 border-red-500/30 text-red-400/50";
                } else if (isSelected) {
                   cellClass = "bg-red-500/20 border-red-500/50 text-red-500";
                }
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!isSubmitted ? { scale: 1.05, backgroundColor: "rgba(99,102,241,0.1)" } : {}}
                  onClick={() => toggleCell(i)}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all relative overflow-hidden group ${cellClass}`}
                >
                  <span className="text-[10px] font-bold">Byte</span>
                  <span className="text-sm font-black tracking-tight">{i}</span>
                  
                  {isSubmitted && isActuallyPadding && (
                    <div className="absolute top-0 right-0 p-0.5">
                      <Zap className="w-2 h-2 text-emerald-400" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex gap-3">
             <button
               onClick={checkAnswer}
               disabled={isSubmitted || selections.length === 0}
               className="flex-1 py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-black rounded-xl text-[10px] uppercase tracking-widest disabled:opacity-20 transition-all border-b-4 border-zinc-300 active:border-b-0 active:translate-y-1"
             >
               Analyze Layout
             </button>
             {isSubmitted && (
               <button
                 onClick={() => { setSelections([]); setIsSubmitted(false); }}
                 className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all"
               >
                 Reset
               </button>
             )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl flex items-start gap-4 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
          >
            {isCorrect ? <CheckCircle className="w-6 h-6 shrink-0" /> : <AlertTriangle className="w-6 h-6 shrink-0" />}
            <div>
              <p className="font-bold text-xs uppercase tracking-tight">{isCorrect ? 'Memory Optimized' : 'Data Misaligned'}</p>
              <p className="text-[11px] leading-relaxed mt-1 opacity-80 italic">
                {isCorrect 
                  ? "Correct! You identified the 3 alignment bytes after 'packet_type' (to align the 4-byte int) and the 2 trailing padding bytes (to make the struct size 12, a multiple of 4)."
                  : "Not quite. Remember that compiler padding ensures that members start at addresses that are multiples of their own size. The largest member 'int' (4 bytes) dictates the struct's alignment requirement."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
