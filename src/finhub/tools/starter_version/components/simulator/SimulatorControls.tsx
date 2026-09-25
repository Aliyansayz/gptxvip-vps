import React from 'react';

interface SimulatorControlsProps {
  simulationMode: 'standard' | 'gold_5s' | 'gold_3s';
  onModeChange: (mode: 'standard' | 'gold_5s' | 'gold_3s') => void;
  tradingEnabled: boolean;
  onTradingToggle: (enabled: boolean) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  typeName: string;
}

export const SimulatorControls: React.FC<SimulatorControlsProps> = ({
  simulationMode,
  onModeChange,
  tradingEnabled,
  onTradingToggle,
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  typeName
}) => {
  return (
    <div className="p-4 border-b border-zinc-800 flex flex-wrap gap-4 justify-between items-center bg-zinc-800/40 shrink-0">
      <div className="flex items-center gap-4">
         <h3 className="text-sm font-medium capitalize text-cyan-100">
            {typeName.replace('_', ' ')} Simulation
         </h3>
         <select 
           value={simulationMode}
           onChange={(e) => onModeChange(e.target.value as any)}
           className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md px-2 py-1 focus:ring-cyan-500 focus:border-cyan-500"
         >
           <option value="gold_3s">Gold 3s Simulation</option>
           <option value="gold_5s">Gold 5s Simulation</option>
           <option value="standard">Standard 1h Data</option>
         </select>
         <label className="flex items-center gap-2 text-xs font-medium text-cyan-400">
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
