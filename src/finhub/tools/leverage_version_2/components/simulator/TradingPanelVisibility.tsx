import React from 'react';
import { useIndicatorsStore, VisibilitySettings } from '../../stores/indicators_store';

export const TradingPanelVisibility: React.FC = () => {
  const { visibilitySettings, setVisibilitySettings } = useIndicatorsStore();

  const updateSettings = (updates: Partial<VisibilitySettings>) => {
    setVisibilitySettings(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Chart Visibility</h4>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" 
              checked={visibilitySettings.alphaVisible} 
              onChange={e => updateSettings({ alphaVisible: e.target.checked })} 
            />
            Show Alpha Chart
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" 
              checked={visibilitySettings.betaVisible} 
              onChange={e => updateSettings({ betaVisible: e.target.checked })} 
            />
            Show Beta Chart
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" 
              checked={visibilitySettings.deltaVisible} 
              onChange={e => updateSettings({ deltaVisible: e.target.checked })} 
            />
            Show Delta Chart
          </label>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-4">
        <h4 className="text-sm font-semibold text-cyan-400 mb-2">Candle Colors</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
             <label className="text-xs text-zinc-400">Bullish Body (Up)</label>
             <div className="flex items-center gap-2">
               <input 
                 type="color" 
                 value={visibilitySettings.candleUpColor} 
                 onChange={e => updateSettings({ candleUpColor: e.target.value })} 
                 className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-none outline-none overflow-hidden" 
               />
               <span className="text-[10px] text-zinc-500 font-mono">{visibilitySettings.candleUpColor}</span>
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs text-zinc-400">Bearish Body (Down)</label>
             <div className="flex items-center gap-2">
               <input 
                 type="color" 
                 value={visibilitySettings.candleDownColor} 
                 onChange={e => updateSettings({ candleDownColor: e.target.value })} 
                 className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-none outline-none p-0 overflow-hidden" 
               />
               <span className="text-[10px] text-zinc-500 font-mono">{visibilitySettings.candleDownColor}</span>
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs text-zinc-400">Bullish Wick</label>
             <div className="flex items-center gap-2">
               <input 
                 type="color" 
                 value={visibilitySettings.wickUpColor} 
                 onChange={e => updateSettings({ wickUpColor: e.target.value })} 
                 className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-none outline-none p-0 overflow-hidden" 
               />
               <span className="text-[10px] text-zinc-500 font-mono">{visibilitySettings.wickUpColor}</span>
             </div>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs text-zinc-400">Bearish Wick</label>
             <div className="flex items-center gap-2">
               <input 
                 type="color" 
                 value={visibilitySettings.wickDownColor} 
                 onChange={e => updateSettings({ wickDownColor: e.target.value })} 
                 className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-none outline-none p-0 overflow-hidden" 
               />
               <span className="text-[10px] text-zinc-500 font-mono">{visibilitySettings.wickDownColor}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
