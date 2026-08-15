import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoveRight, MousePointer2, Calculator, Info, CheckCircle } from "lucide-react";

export const PointerArithmeticVisual: React.FC<any> = ({ exercise }) => {
  const [index, setIndex] = useState(0);
  const data = [10, 20, 30, 40, 50, 60, 70, 80];
  const startAddress = 0x7ffd0000;
  const elementSize = 4; // int

  const currentAddress = startAddress + (index * elementSize);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-6 bg-zinc-950 rounded-3xl border border-zinc-800 font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tighter">Pointer Arithmetic Lab</h3>
            <p className="text-[10px] text-zinc-500 italic">MEMORY ADDRESSING SIMULATION</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Architecture</p>
          <p className="text-[10px] text-blue-400 font-bold">x86_64 (sizeof(int) = 4)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-black/40 rounded-2xl border border-zinc-800 p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Operation</h4>
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
              <code className="text-blue-400 text-sm">
                int* ptr = array;<br/>
                ptr = ptr + {index};
              </code>
            </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Control Bus</h4>
             <div className="flex items-center gap-2">
                <button 
                  disabled={index === 0}
                  onClick={() => setIndex(i => i - 1)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 rounded-xl text-white transition-all active:scale-95"
                >
                  ptr--
                </button>
                <button 
                  disabled={index === data.length - 1}
                  onClick={() => setIndex(i => i + 1)}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-20 rounded-xl text-white transition-all active:scale-95"
                >
                  ptr++
                </button>
             </div>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex gap-4">
             <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
             <p className="text-[11px] text-zinc-400 leading-relaxed">
               Adding 1 to a pointer doesn't add 1 byte; it adds <code className="text-blue-300">1 * sizeof(type)</code>. 
               This ensures the pointer lands exactly at the next element's boundary.
             </p>
          </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Memory Visualization</h4>
              <div className="text-[11px] text-blue-400 font-black">
                Current: 0x{currentAddress.toString(16).toUpperCase()}
              </div>
           </div>

           <div className="flex flex-col gap-2">
              {data.map((val, i) => {
                const isActive = i === index;
                const addr = startAddress + (i * elementSize);
                
                return (
                  <div 
                    key={i}
                    className={`group flex items-center gap-4 transition-all duration-300 ${isActive ? 'scale-[1.02]' : 'opacity-40 grayscale blur-[0.5px]'}`}
                  >
                    <div className="w-16 text-[9px] font-bold text-zinc-600 font-mono tracking-tighter">
                      0x{addr.toString(16).toUpperCase()}
                    </div>
                    <div className={`flex-1 p-3 rounded-xl border flex items-center justify-between transition-all ${isActive ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-zinc-900 border-zinc-800'}`}>
                       <span className={`text-sm font-black ${isActive ? 'text-white' : 'text-zinc-500'}`}>{val}</span>
                       <span className="text-[10px] text-zinc-600">int[{i}]</span>
                    </div>
                    <div className={`w-8 flex justify-center transition-all ${isActive ? 'translate-x-0' : '-translate-x-4 opacity-0'}`}>
                       <MousePointer2 className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        <div className="text-[11px] text-zinc-400">
          <strong className="text-emerald-400">Insight:</strong> Notice how the address jumps by <strong className="text-emerald-200">4</strong> for every step. In a 64-bit engine, pointer arithmetic is the fastest way to iterate through high-frequency market data packets.
        </div>
      </div>
    </div>
  );
};
