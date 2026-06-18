import React from 'react';
import { MonitorPlay } from 'lucide-react';

interface LabHeaderProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isParallelModeActive?: boolean;
  onToggleParallelMode?: () => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ isParallelModeActive, onToggleParallelMode }) => {
  return (
    <div className="flex items-start md:items-center justify-between mb-4 flex-col md:flex-row gap-4">
      <div>
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex flex-wrap items-center gap-3 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
          Leverage Trading Simulation Backtest Version 3 And Macroeconomic Event Synthetic Data Factory
          <span className="text-[10px] border px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 bg-zinc-800/80 border-cyan-400/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-500"></span>
            v3 + macro
          </span>
        </h2>
        <p className="mt-2 font-mono text-xs max-w-4xl leading-relaxed text-zinc-400/80">
          Build and interact with high-performance trading indicators and custom backtesting rules. Observe signal generation routines and engine execution accuracy on simulated tick data. <strong className="text-cyan-400">Execution Pipeline:</strong> The simulations run locally in the browser's JavaScript runtime, emulating a tick-by-tick event loop typical in Algorithmic engines. Note how signal generation and Stop Loss checks trigger synchronously with price propagation.
        </p>
      </div>
      <div className="flex items-center gap-2 relative z-50 shrink-0">
        {onToggleParallelMode && (
          <button
            id="parallel-mode-toggle-btn"
            onClick={onToggleParallelMode}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-xs uppercase tracking-widest font-black transition-all cursor-pointer shadow-lg duration-300 transform active:scale-95 ${
              isParallelModeActive 
                ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border-teal-400 text-teal-300 hover:shadow-[0_0_15px_rgba(45,212,191,0.4)]' 
                : 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.3)] hover:shadow-[0_0_20px_rgba(52,211,153,0.5)]'
            }`}
            style={{ backdropFilter: 'blur(4px)' }}
          >
            <MonitorPlay className={`w-4 h-4 ${isParallelModeActive ? 'text-teal-400' : 'text-emerald-300'} animate-pulse`} />
            <span className="whitespace-nowrap">{isParallelModeActive ? 'Exit Parallel Mode' : 'Parallel Mode'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
