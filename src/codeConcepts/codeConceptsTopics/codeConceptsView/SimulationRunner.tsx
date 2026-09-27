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
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(min-width: 1024px)').matches,
  );
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
    <div className="relative flex h-screen min-h-screen h-[100dvh] min-h-[100svh] w-full flex-col overflow-hidden bg-[#050505] font-sans text-zinc-100">
      {/* Top Header Navigation */}
      <header className="z-50 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-950/50 px-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-6">
          <button
            type="button"
            onClick={onBack}
            aria-label="Exit simulation"
            className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all duration-300 hover:bg-white hover:text-zinc-950"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Exit Simulation</span>
            <span className="sm:hidden">Exit</span>
          </button>
          
          <div className="h-4 w-px bg-zinc-800" />
          
          <div className="flex min-w-0 flex-col">
            <span className="hidden truncate text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 sm:block">
              {courseId || 'Module Simulation'} // {question.concept_tested}
            </span>
            <span className="truncate text-xs font-black tracking-tight text-white sm:text-sm">
              {question.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={handleReset}
            aria-label="Reset simulation"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:text-white sm:px-3"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-expanded={isSidebarOpen}
            aria-controls="simulation-engine-data"
            className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-2 text-[10px] font-bold uppercase tracking-widest transition-colors sm:px-3 ${
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
        <main className="relative min-w-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
              backgroundSize: '40px 40px' 
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center overflow-y-auto p-3 sm:p-8 lg:p-12">
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
              id="simulation-engine-data"
              className="absolute inset-y-0 right-0 z-40 flex w-full max-w-[350px] flex-col border-l border-zinc-800 bg-[#0a0a0a] lg:relative lg:inset-auto lg:w-[350px] lg:max-w-none"
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

    </div>
  );
};
