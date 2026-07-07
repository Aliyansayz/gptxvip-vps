import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Activity, Terminal, ShieldAlert } from 'lucide-react';

export const BentoGridFeatures: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mb-24 mt-12">
      <div className="mb-8 font-mono text-xs uppercase tracking-widest text-emerald-500 font-bold flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Platform Modules
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[250px]">
        {/* Card 1 - Interactive Labs (Large) */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          style={{ transform: 'skewY(-2deg)' }}
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-none p-8 relative overflow-hidden flex flex-col justify-between group shadow-xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-20 transition-opacity group-hover:opacity-40" style={{ transform: 'skewY(2deg)' }}>
            <Terminal size={120} className="text-emerald-500" />
          </div>
          <div style={{ transform: 'skewY(2deg)' }} className="h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-none flex items-center justify-center border border-emerald-500/30 mb-6 backdrop-blur-md">
                <Terminal className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 font-display">Interactive Labs</h3>
              <p className="text-zinc-400 font-light leading-relaxed max-w-sm">
                Drag-and-drop code templates, simulation runners, and execution speed testing. Visualize exactly how C++ and Python logic executes under the hood.
              </p>
            </div>
            <div className="relative z-10 mt-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-none p-4 font-mono text-xs text-zinc-300">
                <div className="flex items-center justify-between mb-2 opacity-50">
                   <span>Thread-safety check:</span>
                   <span className="text-emerald-400">PASSED</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-blue-400">template</span>
                  <span>&lt;</span>
                  <span className="text-emerald-400">typename</span>
                  <span> T&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2 - Liquidity Depth (Medium) */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          style={{ transform: 'skewY(-2deg)' }}
          className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-none p-6 relative overflow-hidden flex flex-col shadow-xl group"
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"></div>
          <div style={{ transform: 'skewY(2deg)' }} className="h-full flex flex-col justify-center relative z-10">
            <div className="flex gap-4">
               <div className="w-10 h-10 bg-cyan-500/20 rounded-none flex items-center justify-center border border-cyan-500/30 shrink-0">
                  <Activity className="text-cyan-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 font-display">Liquidity Depth</h3>
                  <p className="text-sm text-zinc-400 font-light">Limit Order Book (LOB) visualization and market microstructure analysis.</p>
                </div>
            </div>
          </div>
        </motion.div>

        {/* Card 3 - HFT & Risk Workflows (Small) */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          style={{ transform: 'skewY(-2deg)' }}
          className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-none p-6 relative overflow-hidden flex flex-col justify-between shadow-xl"
        >
          <div style={{ transform: 'skewY(2deg)' }} className="h-full flex flex-col justify-between relative z-10">
            <div>
                <div className="w-10 h-10 bg-violet-500/20 rounded-none flex items-center justify-center border border-violet-500/30 mb-4">
                  <ShieldAlert className="text-violet-400" size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-1 font-display">HFT & Risk</h3>
                <p className="text-xs text-zinc-400 font-light line-clamp-3">Discover the Time Horizon vs Volatility logic through interactive node graphs.</p>
            </div>
          </div>
        </motion.div>

        {/* Card 4 - Key Terms & Glossary (Small) */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          style={{ transform: 'skewY(-2deg)' }}
          className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-none p-6 relative overflow-hidden flex flex-col justify-between shadow-xl group"
        >
          <div style={{ transform: 'skewY(2deg)' }} className="h-full flex flex-col justify-between relative z-10">
            <div className="h-full flex flex-col space-y-4 justify-between">
                <div className="w-10 h-10 bg-blue-500/20 rounded-none flex items-center justify-center border border-blue-500/30">
                  <BookOpen className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1 font-display">Documentation</h3>
                  <p className="text-xs text-zinc-400 font-light">Explore definitions and core quantitative metrics.</p>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
