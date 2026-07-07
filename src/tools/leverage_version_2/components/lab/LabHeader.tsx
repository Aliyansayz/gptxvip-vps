import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface LabHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const LabHeader: React.FC<LabHeaderProps> = ({ isExpanded, onToggleExpand }) => {
  return (
    <div className="flex items-start md:items-center justify-between mb-4 flex-col md:flex-row gap-4">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight flex flex-wrap items-center gap-3 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
          Leverage Trading Version 2
          <span className="text-[10px] border px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 bg-zinc-800/80 border-cyan-400/30 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-cyan-500"></span>
            advanced
          </span>
        </h2>
        <p className="mt-2 font-mono text-xs max-w-4xl leading-relaxed text-zinc-400/80">
          Build and interact with high-performance trading indicators and custom backtesting rules. Observe signal generation routines and engine execution accuracy on simulated tick data. <strong className="text-cyan-400">Execution Pipeline:</strong> The simulations run locally in the browser's JavaScript runtime, emulating a tick-by-tick event loop typical in Algorithmic engines. Note how signal generation and Stop Loss checks trigger synchronously with price propagation.
        </p>
      </div>
      <button
        onClick={onToggleExpand}
        className="flex items-center gap-2 px-4 py-2 rounded border text-xs uppercase tracking-widest font-bold transition-all bg-cyan-500/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-500/20"
      >
        {isExpanded ? (
          <>
            <Minimize2 className="w-4 h-4" />
            <span>Exit Full View</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4" />
            <span>Full View</span>
          </>
        )}
      </button>
    </div>
  );
};
