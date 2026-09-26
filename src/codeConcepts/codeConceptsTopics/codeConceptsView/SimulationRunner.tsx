import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Settings2, 
  Info, 
  Activity, 
  Monitor, 
  BarChart3, 
  Play, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { SimulationRunnerQuestion } from '../../../types';
import { HighlightedText } from './TermHighlighter';

interface SimulationRunnerProps {
  question: SimulationRunnerQuestion;
  VisualComponent: React.ComponentType<any>;
  themeColor?: string;
  onBack: () => void;
  courseId?: string;
}

export const SimulationRunner: React.FC<SimulationRunnerProps> = ({ 
  question, 
  VisualComponent, 
  themeColor = 'indigo', 
  onBack,
  courseId
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [simulationKey, setSimulationKey] = useState(0);

  const handleReset = () => {
    setSimulationKey(prev => prev + 1);
  };

  const themeClasses = {
    emerald: {
      accent: 'text-emerald-500',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/20'
    },
    blue: {
      accent: 'text-blue-500',
      bg: 'bg-blue-500',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/20'
    },
    indigo: {
      accent: 'text-indigo-500',
      bg: 'bg-indigo-500',
      border: 'border-indigo-500/20',
      glow: 'shadow-indigo-500/20'
    }
  }[themeColor as 'emerald' | 'blue' | 'indigo'] || {
    accent: 'text-indigo-500',
    bg: 'bg-indigo-500',
    border: 'border-indigo-500/20',
    glow: 'shadow-indigo-500/20'
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#050505] text-zinc-100 overflow-hidden font-sans">
      {/* Top Header Navigation */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 shrink-0 bg-zinc-950/50 backdrop-blur-md z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest bg-zinc-900 hover:bg-white text-zinc-400 hover:text-zinc-950 border border-zinc-800 rounded-full transition-all duration-300"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Exit Simulation
          </button>
          
          <div className="h-4 w-px bg-zinc-800" />
          
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
              {courseId || 'Module Simulation'} // {question.concept_tested}
            </span>
            <span className="text-sm font-black tracking-tight text-white">
              {question.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="p-2 text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 rounded-lg"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 transition-colors rounded-lg border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
              isSidebarOpen ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'
            }`}
          >
            <Settings2 className="w-3 h-3" />
            Engine Data
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Simulation Viewport */}
        <main className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
              backgroundSize: '40px 40px' 
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
             <div className="w-full max-w-6xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={simulationKey}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <VisualComponent exercise={question} key={simulationKey} />
                  </motion.div>
                </AnimatePresence>
             </div>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-2 pointer-events-none">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${themeClasses.bg} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`} style={{ boxShadow: `0 0 12px ${themeClasses.bg}` }} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Engine_Status: ONLINE</span>
             </div>
             <div className="flex items-center gap-2">
                <Activity className="w-3 h-3 text-zinc-700" />
                <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest">Telemetry_Recv: 247.2 MB/s</span>
             </div>
          </div>
        </main>

        {/* Right Info/Control Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-[350px] border-l border-zinc-800 bg-[#0a0a0a] flex flex-col z-40"
            >
              <div className="p-6 overflow-y-auto hidden-scrollbar flex-1">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className={`w-4 h-4 ${themeClasses.accent}`} />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Simulation Intel</h3>
                </div>

                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-black text-white leading-tight">
                      {question.title}
                    </h2>
                    <p className="text-xs text-zinc-500 leading-relaxed italic">
                      {question.concept_tested} Strategy Exercise
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {question.question}
                    </p>
                  </div>

                  {question.theory && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                         <Monitor className="w-3 h-3 text-zinc-600" />
                         <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Theoretical Grounding</span>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white">{question.theory.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {question.theory.summary}
                        </p>
                        {question.theory.bullets && (
                          <ul className="space-y-2">
                            {question.theory.bullets.map((b: string, i: number) => (
                              <li key={i} className="text-[11px] text-zinc-500 flex gap-2">
                                <span className={`${themeClasses.accent} font-bold mt-[-2px]`}>•</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                       <BarChart3 className="w-3 h-3 text-zinc-600" />
                       <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Operational Guide</span>
                    </div>
                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 rotate-12 transition-transform group-hover:rotate-45"><Info size={40} /></div>
                       <p className="text-[11px] text-indigo-400/80 leading-relaxed relative z-10 italic">
                         <HighlightedText text={question.explanation} themeColor={themeColor} />
                       </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Bottom CTA / Status */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-950/80">
                 <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.1em]">Execution Loop:</span>
                       <span className="text-[10px] font-mono text-emerald-500">OPTIMIZED</span>
                    </div>
                    <div className="p-1 bg-zinc-900 rounded-lg border border-zinc-800">
                       <div className={`h-1 rounded-full ${themeClasses.bg} w-[65%]`} />
                    </div>
                 </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Control Hint if Sidebar closed */}
      {!isSidebarOpen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsSidebarOpen(true)}
          className="absolute bottom-6 right-6 p-4 bg-white text-zinc-950 rounded-2xl shadow-2xl z-50 flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
        >
          <Settings2 className="w-4 h-4" />
          Show Data Panel
        </motion.button>
      )}
    </div>
  );
};
