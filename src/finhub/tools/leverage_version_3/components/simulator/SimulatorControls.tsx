import React from 'react';
import { ChevronDown, ChevronUp, Settings2 } from 'lucide-react';

interface SimulatorControlsProps {
  tradingEnabled: boolean;
  onTradingToggle: (enabled: boolean) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  typeName: string;
  isPanelOpen: boolean;
  onTogglePanel: () => void;
  playbackSpeedMs: number;
  setPlaybackSpeedMs: (ms: number) => void;
  onLoadConfig: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportConfig: () => void;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  tradingEnabled,
  onTradingToggle,
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onReset,
  typeName,
  isPanelOpen,
  onTogglePanel,
  playbackSpeedMs,
  setPlaybackSpeedMs,
  onLoadConfig,
  onExportConfig
}) => {
  return (
    <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
      <div className="flex items-center gap-4">
         <h3 className="text-sm font-medium capitalize text-cyan-100 whitespace-nowrap">
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
         <label className="flex items-center gap-2 text-xs font-medium text-cyan-400 ml-2 whitespace-nowrap">
           <input 
            type="checkbox" 
            className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500 checked:bg-cyan-500" 
            checked={tradingEnabled} 
            onChange={(e) => onTradingToggle(e.target.checked)} 
           />
           Enable Trading Mode
         </label>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center">
           <input id="load-config-input-external" type="file" accept=".json" className="hidden" onChange={onLoadConfig} />
           <button 
             onClick={() => document.getElementById('load-config-input-external')?.click()}
             className="mx-2 flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-700 transition-colors"
             title="Load backtest state from JSON"
           >
             Load Config
           </button>
           <button 
             onClick={onExportConfig}
             className="mr-2 flex items-center gap-1.5 px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider rounded border border-zinc-700 transition-colors"
             title="Export complete backtest state to JSON"
           >
             Export Config
           </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 whitespace-nowrap hidden sm:block">Speed: {playbackSpeedMs}ms</span>
          <input 
            type="range" 
            min="50" 
            max="2000" 
            step="50"
            value={playbackSpeedMs} 
            onChange={(e) => setPlaybackSpeedMs(parseInt(e.target.value))} 
            className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onTogglePlay}
            className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-cyan-50 shadow-sm text-xs rounded-md transition whitespace-nowrap"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={onStepBack}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition whitespace-nowrap"
          >
            Step Back
          </button>
          <button 
            onClick={onStepForward}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-md transition whitespace-nowrap"
          >
            Step Forward
          </button>
          <button 
            onClick={onReset}
            className="px-3 py-1 bg-red-900/40 hover:bg-red-800 text-red-200 text-xs rounded-md transition whitespace-nowrap border border-red-900/50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

