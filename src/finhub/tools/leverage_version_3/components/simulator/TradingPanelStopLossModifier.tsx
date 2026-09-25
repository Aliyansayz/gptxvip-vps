import React from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { StopLossModifierConfig } from '../../functions/api/stopLossModifier/stopLossModifierConfig';
import { TakeProfitModifierConfig } from '../../functions/api/takeProfitModifier/takeProfitModifierConfig';
import { Settings2 } from 'lucide-react';

export const TradingPanelStopLossModifier: React.FC = () => {
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();
  const config = tradingConfig.stopLossModifier || {
    activateTrailAfterBreakeven: false,
    trailTillBreakevenOnly: false,
    enableConditionalTrailingThreshold: false,
    trailThresholdRewardFactor: 2.0,
    isStopLossModification: false,
    explicitAdjustFactor: 0.68,
    lowerBoundTarget: 2.0,
    upperBoundTarget: 4.0
  };

  const tpConfig = tradingConfig.takeProfitModifier || {
    enableUpdateTpAtTarget: false,
    tpUpdateRewardTarget: 2.0,
    tpUpdateMultiplier: 1.0,
    enableTrailTpAfterBreakeven: false
  };

  const updateConfig = (updates: Partial<StopLossModifierConfig>) => {
    setTradingConfig(prev => ({
      ...prev,
      stopLossModifier: {
        ...(prev.stopLossModifier as StopLossModifierConfig),
        ...updates
      }
    }));
  };

  const updateTpConfig = (updates: Partial<TakeProfitModifierConfig>) => {
    setTradingConfig(prev => ({
      ...prev,
      takeProfitModifier: {
        ...(prev.takeProfitModifier as TakeProfitModifierConfig),
        ...updates
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-purple-400 mb-4 pb-2 border-b border-zinc-800 uppercase tracking-wider">
          <Settings2 size={16} />
          Stop Loss Modifiers
        </h4>

        {/* Straight Forward Trail Feature */}
        <div className="mb-6 pb-6 border-b border-zinc-800/50">
          <h5 className="text-xs font-bold text-zinc-300 mb-3 uppercase">1. Straight Forward Trail Feature</h5>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500"
                checked={config.activateTrailAfterBreakeven}
                onChange={e => updateConfig({ activateTrailAfterBreakeven: e.target.checked })}
              />
              Activate the stop loss trail after latest price crosses breakeven
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500"
                checked={config.trailTillBreakevenOnly}
                onChange={e => updateConfig({ trailTillBreakevenOnly: e.target.checked })}
              />
              Activate the stop loss trail initially and trail till stop loss value reaches breakeven
            </label>
          </div>
        </div>

        {/* Conditional Trailing SL Threshold */}
        <div className="mb-6 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-zinc-300 uppercase">2. Conditional Trailing Threshold</h5>
            <label className="flex items-center gap-2 text-xs text-purple-400 font-bold select-none cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500"
                checked={config.enableConditionalTrailingThreshold}
                onChange={e => updateConfig({ enableConditionalTrailingThreshold: e.target.checked })}
              />
              Enable Threshold
            </label>
          </div>
          <div className={`space-y-3 ${!config.enableConditionalTrailingThreshold ? 'opacity-50 pointer-events-none' : ''}`}>
             <label className="block text-[10px] font-bold text-zinc-500 uppercase">Stop Trailing After Reward Factor ({config.trailThresholdRewardFactor}x)</label>
             <input 
               type="range"
               min="0" max="5" step="0.5"
               value={config.trailThresholdRewardFactor}
               onChange={e => updateConfig({ trailThresholdRewardFactor: parseFloat(e.target.value) })}
               className="w-full accent-purple-500"
             />
          </div>
        </div>

        {/* Explicit Stop Loss Modification */}
        <div className="mb-6 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-zinc-300 uppercase">3. Explicit Stop Loss Modification</h5>
            <label className="flex items-center gap-2 text-xs text-purple-400 font-bold select-none cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-purple-500 focus:ring-purple-500"
                checked={config.isStopLossModification}
                onChange={e => updateConfig({ isStopLossModification: e.target.checked })}
              />
              Enable Modification
            </label>
          </div>
          <div className={`grid grid-cols-3 gap-3 ${!config.isStopLossModification ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Adjust Factor</label>
              <input 
                type="number"
                min="0" max="1" step="0.01"
                value={config.explicitAdjustFactor}
                onChange={e => updateConfig({ explicitAdjustFactor: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Lower Bound TF</label>
              <input 
                type="number"
                min="0" step="0.5"
                value={config.lowerBoundTarget}
                onChange={e => updateConfig({ lowerBoundTarget: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Upper Bound TF</label>
              <input 
                type="number"
                min="0" step="0.5"
                value={config.upperBoundTarget}
                onChange={e => updateConfig({ upperBoundTarget: parseFloat(e.target.value) })}
                className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
        
        {/* TAKE PROFIT MODIFIERS */}
        <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-4 pb-2 border-b border-zinc-800 uppercase tracking-wider">
          <Settings2 size={16} />
          Take Profit Modifiers
        </h4>
        
        <div className="mb-6 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center justify-between mb-3">
            <h5 className="text-xs font-bold text-zinc-300 uppercase">1. Multiplier Target Update</h5>
            <label className="flex items-center gap-2 text-xs text-emerald-400 font-bold select-none cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                checked={tpConfig.enableUpdateTpAtTarget}
                onChange={e => updateTpConfig({ enableUpdateTpAtTarget: e.target.checked })}
              />
              Enable Update TP
            </label>
          </div>
          <p className="text-[10px] text-zinc-500 mb-3">Update take profit directly using a stop loss band multiplier after reaching a designated price target (reward factor).</p>
          <div className={`grid grid-cols-2 gap-4 ${!tpConfig.enableUpdateTpAtTarget ? 'opacity-50 pointer-events-none' : ''}`}>
             <div>
               <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Target Reward Factor</label>
               <input 
                 type="number"
                 min="0.5" step="0.5"
                 value={tpConfig.tpUpdateRewardTarget}
                 onChange={e => updateTpConfig({ tpUpdateRewardTarget: parseFloat(e.target.value) })}
                 className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
               />
             </div>
             <div>
               <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">TP Band Multiplier</label>
               <input 
                 type="number"
                 min="0" step="0.1"
                 value={tpConfig.tpUpdateMultiplier}
                 onChange={e => updateTpConfig({ tpUpdateMultiplier: parseFloat(e.target.value) })}
                 className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
               />
             </div>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold text-zinc-300 mb-3 uppercase">2. Trail Take Profit Feature</h5>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer hover:text-zinc-300 transition-colors">
              <input 
                type="checkbox" 
                className="rounded bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
                checked={tpConfig.enableTrailTpAfterBreakeven}
                onChange={e => updateTpConfig({ enableTrailTpAfterBreakeven: e.target.checked })}
              />
              Activate the trail take profit after price crosses breakeven
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};
