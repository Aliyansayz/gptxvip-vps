import React from 'react';
import { motion } from 'motion/react';
import { PlayCircle, Database, FileCode2, Terminal, Code2, Hash, Layers } from 'lucide-react';

interface VisualProps {
  componentId: string;
}

export const InteractiveQuestionVisual: React.FC<VisualProps> = ({ componentId }) => {
  switch (componentId) {
    case 'cpp_basic_q1':
      return (
        <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-mono flex flex-col items-center justify-center min-h-[150px]">
          <div className="text-xs text-zinc-500 mb-2">Program Execution Flow</div>
          <div className="flex flex-col gap-2 relative">
             <div className="w-px h-full bg-zinc-800 absolute left-6 top-0" />
             <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-6 bg-zinc-900 border border-zinc-700 text-[10px] flex items-center justify-center rounded">Headers</div>
             </div>
             <div className="flex items-center gap-4 z-10">
                <motion.div 
                   animate={{ scale: [1, 1.1, 1], borderColor: ['#10b981', '#34d399', '#10b981'], boxShadow: ['0 0 0 rgba(16,185,129,0)', '0 0 10px rgba(16,185,129,0.5)', '0 0 0 rgba(16,185,129,0)'] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="w-12 h-6 bg-emerald-950 border-2 border-emerald-500 text-emerald-400 text-[10px] font-bold flex items-center justify-center rounded shadow-sm"
                >
                   main()
                </motion.div>
                <div className="text-[10px] text-zinc-400">&larr; Entry Point</div>
             </div>
             <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-6 bg-zinc-900 border border-zinc-700 text-[10px] flex items-center justify-center rounded">Body</div>
             </div>
             <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-6 bg-zinc-900 border border-zinc-700 text-[10px] flex items-center justify-center rounded">Exit</div>
             </div>
          </div>
        </div>
      );
    case 'cpp_basic_q2':
      return (
        <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-xs flex flex-col min-h-[150px]">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800 text-zinc-500">
             <Terminal className="w-3 h-3" /> Console Output
          </div>
          <div className="flex-1 flex flex-col justify-center">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400">cout</span>
                <span className="text-zinc-500">&lt;&lt;</span>
                <span className="text-amber-400">"Hello World!"</span>;
             </div>
             <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="mt-2 p-2 bg-black border border-zinc-900 rounded font-bold text-emerald-400"
             >
                &gt; Hello World!
             </motion.div>
          </div>
        </div>
      );
    case 'cpp_basic_q3':
      return (
         <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-xs flex items-center gap-4 min-h-[150px]">
            <div className="flex flex-col gap-1 w-1/2">
               <motion.div 
                   animate={{ backgroundColor: ['#09090b', '#0f766e', '#09090b'] }}
                   transition={{ duration: 3, repeat: Infinity }}
                   className="p-1 rounded text-teal-400"
               >
                  #include &lt;iostream&gt;
               </motion.div>
               <div className="text-zinc-600 pl-4">int main() {'{'}</div>
               <div className="pl-8 text-blue-400">cout</div>
               <div className="text-zinc-600 pl-4">{'}'}</div>
            </div>
            <div className="flex-1 bg-zinc-900 rounded border border-zinc-700 p-2 text-[10px]">
               <div className="flex items-center gap-1 text-teal-400 font-bold mb-1"><Layers className="w-3 h-3"/> iostream library</div>
               <div className="text-zinc-400">- cin (Input Stream)</div>
               <div className="text-zinc-400">- cout (Output Stream)</div>
            </div>
         </div>
      );
    case 'cpp_basic_q4':
      return (
         <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-6 min-h-[150px]">
            <div className="font-mono text-blue-400 text-sm font-bold">int</div>
            <div className="w-24 h-24 border-2 border-dashed border-zinc-700 rounded-xl relative flex flex-col items-center justify-end overflow-hidden overflow-visible">
               <motion.div 
                  initial={{ height: "0%" }}
                  animate={{ height: ["0%", "80%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-full bg-blue-500/30 border-t border-blue-500 absolute bottom-0 left-0"
               />
               <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xl text-blue-300 drop-shadow-md z-10">
                  <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}>
                     42
                  </motion.span>
               </div>
               <div className="absolute -top-3 bg-zinc-800 text-[10px] text-zinc-400 px-2 rounded">Integer Container</div>
            </div>
         </div>
      );
    case 'cpp_basic_q5':
      return (
         <div className="w-full bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-xs flex flex-col min-h-[150px]">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-800 text-zinc-500">
               <Terminal className="w-3 h-3" /> Code Commenting
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-1">
               <div className="flex gap-2">
                 <span className="text-zinc-600 w-3 text-right">1</span>
                 <motion.span 
                   animate={{ color: ['#52525b', '#71717a', '#52525b'] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="italic"
                 >
                   // This is a comment - the compiler ignores this
                 </motion.span>
               </div>
               <div className="flex gap-2">
                 <span className="text-zinc-600 w-3 text-right">2</span>
                 <span><span className="text-blue-400">int</span> main() {'{'}</span>
               </div>
               <div className="flex gap-2">
                 <span className="text-zinc-600 w-3 text-right">3</span>
                 <span className="pl-4"><span className="text-emerald-400">cout</span> <span className="text-zinc-500">&lt;&lt;</span> <span className="text-amber-400">"Working code!"</span>;</span>
               </div>
               <div className="flex gap-2">
                 <span className="text-zinc-600 w-3 text-right">4</span>
                 <motion.span 
                   animate={{ opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                   className="italic text-zinc-600 pl-4"
                 >
                   // Another ignored line
                 </motion.span>
               </div>
               <div className="flex gap-2">
                 <span className="text-zinc-600 w-3 text-right">5</span>
                 <span className="">{'}'}</span>
               </div>
            </div>
         </div>
      );
    default:
      return null;
  }
};
