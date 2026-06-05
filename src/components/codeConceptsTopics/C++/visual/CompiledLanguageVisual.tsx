import React from 'react';
import { motion } from 'motion/react';
import { FileCode2, Settings, Binary, PlaySquare, ArrowRight } from 'lucide-react';

export const CompiledLanguageVisual: React.FC = () => {
  const steps = [
    { id: 'source', icon: FileCode2, label: 'C++ Source', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'compiler', icon: Settings, label: 'Compiler', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { id: 'machine', icon: Binary, label: 'Machine Code', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { id: 'exec', icon: PlaySquare, label: 'Execution', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 w-full p-4 relative z-10 font-mono">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.4, duration: 0.5 }}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm w-28 h-28 ${step.bg}`}
          >
            <step.icon className={`w-8 h-8 ${step.color} mb-2`} />
            <span className="text-[10px] text-center font-bold text-zinc-700 dark:text-zinc-300 tracking-wider uppercase">
              {step.label}
            </span>
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: index * 0.4 + 0.2, duration: 0.4 }}
              className="text-zinc-400 dark:text-zinc-600 rotate-90 md:rotate-0 my-2 md:my-0 origin-left flex items-center justify-center"
            >
               <motion.div
                 animate={{ x: [0, 5, 0] }}
                 transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
               >
                 <ArrowRight className="w-6 h-6" />
               </motion.div>
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
