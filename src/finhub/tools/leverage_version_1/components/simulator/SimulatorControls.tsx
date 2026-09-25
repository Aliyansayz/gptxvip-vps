import React from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';

interface SimulatorControlsProps {
  tradingEnabled: boolean;
  onTradingToggle: (enabled: boolean) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  typeName: string;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  tradingEnabled,
  onTradingToggle,
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  typeName,
  isPanelOpen,
  onTogglePanel
}) => {
  return (
    <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
      <div className="flex items-center gap-4">
         <h3 className="text-sm font-medium capitalize text-cyan-100">
            {typeName.replace('_', ' ')} Simulation
         </h3>
         <button 
           onClick={onTogglePanel}
           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
             isPanelOpen 
               ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
               : 'bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100'
           }`}
         >
           <Settings2 className="w-3.5 h-3.5" />
           Configuration Panel
           {isPanelOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1 opacity-70" /> : <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />}
         </button>
         <label className="flex items-center gap-2 text-xs font-medium text-cyan-400 ml-2">
           <input 
            type="checkbox" 
            className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500 checked:bg-cyan-500" 
            checked={tradingEnabled} 
            onChange={(e) => onTradingToggle(e.target.checked)} 
           />
           Enable Trading Mode
         </label>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={onTogglePlay}
          className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-cyan-50 shadow-sm text-xs rounded-md transition"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button 
          onClick={onStepBack}
          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition"
        >
          Step Back
        </button>
        <button 
          onClick={onStepForward}
          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition"
        >
          Step Forward
        </button>
      </div>
    </div>
  );
};
