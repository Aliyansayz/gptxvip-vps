import React from 'react';
import { motion } from 'motion/react';
import { Box, Car, Battery, Zap, ChevronDown } from 'lucide-react';

export const OOPVisual: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full relative z-10 font-mono gap-6 p-4">
      {/* Base Class */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl p-4 w-60 shadow-md"
      >
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-indigo-200 dark:border-indigo-700/50">
          <Box className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-indigo-900 dark:text-indigo-100 uppercase tracking-widest text-sm">Class Car</span>
        </div>
        <div className="space-y-2 text-xs text-indigo-800 dark:text-indigo-200">
           <div className="flex items-center gap-1.5"><Battery className="w-3.5 h-3.5" /> <span>+ batteryCapacity</span></div>
           <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> <span>+ drive()</span></div>
        </div>
      </motion.div>

      {/* Connection lines */}
      <div className="flex justify-center w-full relative h-8 overflow-hidden">
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="w-0.5 bg-zinc-300 dark:bg-zinc-700 absolute top-0"
        />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="w-48 h-0.5 bg-zinc-300 dark:bg-zinc-700 absolute bottom-0 origin-center"
        />
      </div>

      {/* Instances */}
      <div className="flex gap-8">
        {[
          { id: 'Car1', color: 'emerald', initX: -20 },
          { id: 'Car2', color: 'amber', initX: 20 }
        ].map((instance, idx) => (
          <div key={instance.id} className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 + (idx * 0.2) }}
              className="w-0.5 h-4 bg-zinc-300 dark:bg-zinc-700 mb-1 relative"
            >
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute -bottom-3 -left-[7px]" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, x: instance.initX, opacity: 0 }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              transition={{ delay: 1.6 + (idx * 0.2), duration: 0.5, type: 'spring' }}
              className={`mt-3 bg-white dark:bg-zinc-800 border-2 rounded-xl p-4 w-40 shadow-lg ${
                instance.color === 'emerald' ? 'border-emerald-400' : 'border-amber-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Car className={`w-5 h-5 ${instance.color === 'emerald' ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">Object: {instance.id}</span>
              </div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 px-2 py-1 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                inherits Car properties
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
