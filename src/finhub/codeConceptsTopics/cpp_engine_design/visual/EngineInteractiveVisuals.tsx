import React from 'react';
import { motion } from 'motion/react';
import { Network, Database, Activity, Target } from 'lucide-react';

interface VisualProps {
  componentId: string;
}

export const EngineInteractiveVisual: React.FC<VisualProps> = ({ componentId }) => {
  switch (componentId) {
    case 'cpp_mcq_optimization_snippet':
      return (
         <div className="w-full bg-zinc-950 p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row items-center justify-center gap-8 min-h-[200px] overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
            
            {/* Hash Map View */}
            <div className="flex flex-col items-center z-10 w-full max-w-[200px]">
               <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Target className="w-4 h-4" /> Hash Map</div>
               <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2 w-full">
                     <div className="bg-indigo-500 text-white text-[10px] p-2 rounded shrink-0 font-mono">hash(id) -{">"} 2</div>
                     <motion.div animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex-1 border-b-2 border-dashed border-indigo-500/50 mt-3" />
                     <div className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold">O(1)</div>
                  </div>
                  <div className="grid grid-cols-4 gap-1 mt-2">
                     <div className="h-6 bg-zinc-900 border border-zinc-800 rounded" />
                     <div className="h-6 bg-zinc-900 border border-zinc-800 rounded" />
                     <div className="h-6 bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)] border border-indigo-500/50 rounded flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /></div>
                     <div className="h-6 bg-zinc-900 border border-zinc-800 rounded" />
                  </div>
               </div>
            </div>

            <div className="hidden md:flex w-[1px] h-32 bg-zinc-800" />

            {/* Tree View */}
            <div className="flex flex-col items-center z-10 w-full max-w-[200px]">
               <div className="text-xs font-bold text-amber-500 opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2"><Network className="w-4 h-4" /> B-Tree</div>
               <div className="flex flex-col items-center mt-2 relative w-full">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center relative z-10"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /></div>
                  <div className="w-16 h-px bg-amber-500/30 rotate-45 transform origin-left absolute top-4 left-[96px]" />
                  <div className="w-16 h-px bg-amber-500/30 -rotate-45 transform origin-right absolute top-4 right-[96px]" />
                  
                  <div className="flex gap-12 mt-4 relative z-10">
                     <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center opacity-50" />
                     <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /></div>
                  </div>
                  
                  <div className="flex gap-4 mt-1 ml-16 relative z-10 text-[10px] text-amber-500/60 font-bold">
                     <div>O(log n)</div>
                  </div>
               </div>
            </div>
         </div>
      );
    case 'cpp_adv_q1': // Cache Line Alignment
    case 'cpp_mcq_1':
      return (
         <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-6 min-h-[150px]">
             <div className="flex flex-col gap-1 items-center">
                <div className="text-xs text-zinc-500 font-mono mb-2 border-b border-zinc-800 pb-1">Unoptimized Struct</div>
                <div className="flex bg-zinc-900 border border-red-500/30 rounded p-1">
                   <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/50 rounded-sm m-0.5 text-[10px] flex items-center justify-center text-purple-400">8B</div>
                   <div className="w-4 h-8 bg-zinc-800 rounded-sm m-0.5 text-[8px] flex items-center justify-center text-zinc-500">PAD</div>
                   <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/50 rounded-sm m-0.5 text-[10px] flex items-center justify-center text-blue-400">4B</div>
                </div>
                <div className="text-[10px] text-red-400 mt-1">24 Bytes Total</div>
             </div>
             
             <div className="flex flex-col gap-1 items-center">
                <div className="text-xs text-zinc-500 font-mono mb-2 border-b border-zinc-800 pb-1">Optimized Struct</div>
                <div className="flex bg-zinc-900 border border-emerald-500/30 rounded p-1">
                   <div className="w-8 h-8 bg-purple-500/20 border border-purple-500/50 rounded-sm m-0.5 text-[10px] flex items-center justify-center text-purple-400">8B</div>
                   <div className="w-8 h-8 bg-blue-500/20 border border-blue-500/50 rounded-sm m-0.5 text-[10px] flex items-center justify-center text-blue-400">4B</div>
                   <div className="w-2 h-8 bg-emerald-500/20 border border-emerald-500/50 rounded-sm m-0.5 text-[8px] flex items-center justify-center text-emerald-400">1B</div>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">16 Bytes Total</div>
             </div>
         </div>
      );
    default:
      return null;
  }
};
