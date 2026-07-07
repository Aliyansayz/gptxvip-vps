import React, { useState } from 'react';
import { CheckCircle2, Code2, AlertTriangle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StructPaddingVisualProps {
  exercise?: any;
  themeColor?: string;
  onComplete?: () => void;
}

export const StructPaddingVisual: React.FC<StructPaddingVisualProps> = ({ 
  exercise, 
  themeColor = 'indigo',
  onComplete 
}) => {
  // A simple struct:
  // struct Data {
  //   char a;    // 1 byte
  //              // 3 bytes padding
  //   int b;     // 4 bytes
  //   short c;   // 2 bytes
  //              // 2 bytes padding to make total size multiple of 4
  // };
  // Total size: 12 bytes
  
  // Padding cells are indices: 1, 2, 3 (after char) and 10, 11 (after short).
  const paddingIndices = [1, 2, 3, 10, 11];
  const [selectedCells, setSelectedCells] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleCell = (index: number) => {
    if (isSubmitted) return;
    setSelectedCells(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort((a,b)=>a-b)
    );
  };

  const checkAnswer = () => {
    setIsSubmitted(true);
    if (onComplete && isCorrect()) {
      onComplete();
    }
  };

  const reset = () => {
    setIsSubmitted(false);
    setSelectedCells([]);
  };

  const isCorrect = () => {
    if (selectedCells.length !== paddingIndices.length) return false;
    return selectedCells.every(i => paddingIndices.includes(i));
  };

  const renderCell = (index: number) => {
    const isChar = index === 0;
    const isInt = index >= 4 && index <= 7;
    const isShort = index >= 8 && index <= 9;
    const isRealPadding = paddingIndices.includes(index);
    const isSelected = selectedCells.includes(index);
    
    let baseColor = 'bg-zinc-800 text-zinc-500 border-zinc-700'; // Initial state (unknown)
    let label = '?';
    
    if (isSubmitted) {
      if (isRealPadding) {
        if (isSelected) {
          baseColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
          label = 'PAD';
        } else {
           // Missed padding
           baseColor = 'bg-red-500/20 text-red-500 border-red-500/50';
           label = 'PAD';
        }
      } else {
        if (isSelected) {
          // Wrongly selected data
          baseColor = 'bg-red-500/20 text-red-500 border-red-500/50';
          label = isChar ? 'CHAR' : isInt ? 'INT' : 'SHRT';
        } else {
           // Correctly left data
           baseColor = isChar ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' :
                       isInt ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' :
                       'bg-amber-500/20 text-amber-400 border-amber-500/50';
           label = isChar ? 'C' : isInt ? 'I' : 'S';
        }
      }
    } else {
       if (isSelected) {
          baseColor = 'bg-zinc-200 text-zinc-900 border-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-500';
          label = 'PAD?';
       } else {
          // Give hints about data? The prompt says: "Click on the cells that represent compiler-inserted padding."
          // Usually, developers know char is 1 byte, int is 4, short is 2.
          baseColor = 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600';
          if (isChar || isInt || isShort) {
             // In training mode, maybe we show where the variables ARE, or they have to guess?
             // "Identify the 'Padding Bytes' in the memory layout of the provided C++ struct"
             // Let's reveal the variables to make it explicitly about padding.
             if (isChar) { baseColor = 'bg-blue-500/10 text-blue-500 border-blue-500/30'; label = 'C'; }
             if (isInt) { baseColor = 'bg-purple-500/10 text-purple-500 border-purple-500/30'; label = 'I'; }
             if (isShort) { baseColor = 'bg-amber-500/10 text-amber-500 border-amber-500/30'; label = 'S'; }
          } else {
             label = ' ';
          }
       }
    }

    return (
      <button 
        key={index}
        onClick={() => toggleCell(index)}
        disabled={isSubmitted}
        className={`w-10 h-14 rounded flex flex-col items-center justify-center font-mono text-[10px] sm:text-xs font-bold border transition-colors cursor-pointer ${baseColor}`}
      >
         <span className="opacity-40 text-[8px] sm:text-[9px] mb-1">{index}</span>
         {label}
      </button>
    );
  };

  return (
    <div className="w-full h-full flex flex-col pt-6 gap-6 justify-center">
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-mono text-sm shadow-inner relative max-w-md mx-auto w-full">
         <Code2 className="absolute top-4 right-4 w-5 h-5 text-zinc-700" />
         <div className="text-zinc-400">
           <span className="text-indigo-400">struct</span> <span className="text-amber-300">Data</span> {'{'}
         </div>
         <div className="pl-4 text-zinc-400">
           <span className="text-indigo-400">char</span> a; <span className="text-zinc-600 italic">// 1 byte</span>
         </div>
         <div className="pl-4 text-zinc-400">
           <span className="text-indigo-400">int</span> b; <span className="text-zinc-600 italic">&nbsp; // 4 bytes</span>
         </div>
         <div className="pl-4 text-zinc-400">
           <span className="text-indigo-400">short</span> c; <span className="text-zinc-600 italic">// 2 bytes</span>
         </div>
         <div className="text-zinc-400">
           {'};'}
         </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium text-center">
          Click the memory blocks below that the compiler will fill with <strong className="text-zinc-800 dark:text-zinc-200">padding</strong> to ensure 4-byte natural alignment.
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-full overflow-x-auto p-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(renderCell)}
        </div>
      </div>

      {!isSubmitted ? (
        <div className="flex justify-center mt-4">
          <button 
            onClick={checkAnswer}
            disabled={selectedCells.length === 0}
            className="px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold tracking-wide rounded-xl shadow-md disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            Verify Memory Layout
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl flex items-start gap-4 mx-4 md:mx-auto max-w-lg ${
            isCorrect() 
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' 
              : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
          }`}
        >
          {isCorrect() ? <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" /> : <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />}
          <div>
            <p className="font-bold">{isCorrect() ? 'Perfect Layout!' : 'Memory Misaligned'}</p>
            <p className="text-sm mt-1 mb-3">
              {isCorrect() 
                ? 'You correctly identified all 5 padding bytes required to align the int and pad the end of the struct.' 
                : 'Review standard alignment rules: variables naturally align to a multiple of their own size. Int needs 4-byte alignment, changing the offset.'}
            </p>
            {!isCorrect() && (
              <button 
                onClick={reset}
                className="text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                Reset layout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
