import React from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';

export const TradingPanelHFTMode: React.FC = () => {
  const { tradingConfig, setTradingConfig, systemDeployLog } = useIndicatorsStore();

  const isHftModeActive = tradingConfig.isHftModeActive || false;
  const hftScaleFactor = tradingConfig.hftScaleFactor || 1;
  const hftSyncStopLoss = tradingConfig.hftSyncStopLoss || false;

  const updateConfig = (updates: Partial<typeof tradingConfig>) => {
    setTradingConfig(prev => ({ ...prev, ...updates }));
    if (updates.isHftModeActive !== undefined) {
      if (updates.isHftModeActive) {
        systemDeployLog('SUCCESS', 'HFTEngine', 'HFT Hedge Mode enabled. Main trades will now be mitigated.');
      } else {
        systemDeployLog('WARN', 'HFTEngine', 'HFT Hedge Mode deactivated.');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg h-min w-full">
        <h4 className="text-sm font-semibold text-emerald-400 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span>HFT Mode Execution</span>
          {isHftModeActive && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-bold">ACTIVE</span>}
        </h4>
        
        <div className="flex flex-col gap-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isHftModeActive}
              onChange={(e) => updateConfig({ isHftModeActive: e.target.checked })}
              className="mt-1 bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 rounded" 
            />
            <div>
              <div className="text-xs font-bold text-zinc-200">Enable High-Frequency Trade Replications (Hedge)</div>
              <div className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                Replicates the Main Trade simultaneously with a hedge in the opposite direction. Designed to counteract and mitigate momentum traps across heavy fluctuations.
              </div>
            </div>
          </label>
        </div>
      </div>

      {isHftModeActive && (
        <div className="bg-zinc-900/50 p-4 border border-emerald-900/40 rounded-lg flex flex-col gap-6 w-full">
          <div>
            <h4 className="text-sm font-semibold text-emerald-500 mb-4 uppercase tracking-wider">Hedge Trade Parameters</h4>
            <div className="flex flex-col gap-5">
              
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Lot Size Scale Factor</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="0.1" 
                    max="2" 
                    step="0.1"
                    value={hftScaleFactor}
                    onChange={(e) => updateConfig({ hftScaleFactor: parseFloat(e.target.value) })}
                    className="flex-1 accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm font-bold text-emerald-400 w-12 text-right">{hftScaleFactor.toFixed(1)}x</span>
                </div>
                <div className="text-[10px] text-zinc-500 mt-2">
                  Scales the lot size relative to the main trade (e.g., 0.1x of a 0.01 lot size uses minimal scaling, snapping to lowest). 
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hftSyncStopLoss}
                    onChange={(e) => updateConfig({ hftSyncStopLoss: e.target.checked })}
                    className="bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500 rounded" 
                  />
                  <span className="text-xs font-bold text-zinc-300">Sync Stop Loss with Main Trade</span>
                </label>
                <div className="text-[10px] text-zinc-500 mt-1 pl-7">
                  Mirrors the stop loss percentage from the main trade dynamically.
                </div>
              </div>

              {!hftSyncStopLoss && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Manual SL (Pips)</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="0 to disable"
                        value={tradingConfig.hftStopLossPips || ''}
                        onChange={(e) => updateConfig({ hftStopLossPips: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Take Profit (Pips)</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="0 to disable"
                        value={tradingConfig.hftTakeProfitPips || ''}
                        onChange={(e) => updateConfig({ hftTakeProfitPips: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Risk / Reward Ratio</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="0.5" 
                        max="5" 
                        step="0.1"
                        value={tradingConfig.hftRewardRiskRatio || 1.5}
                        onChange={(e) => updateConfig({ hftRewardRiskRatio: parseFloat(e.target.value) })}
                        className="flex-1 accent-emerald-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-bold text-emerald-400 w-12 text-right">{(tradingConfig.hftRewardRiskRatio || 1.5).toFixed(1)}</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-zinc-800/50">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Force Auto Exit Configurations</label>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 pl-1">Exit Trade after exact N Pips</span>
                    <input 
                      type="number" 
                      min="0"
                      value={tradingConfig.hftExitAfterNPips || ''}
                      placeholder="e.g. 15 (0 to disable)"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        updateConfig({ hftExitAfterNPips: isNaN(val) ? undefined : val });
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                     <span className="text-[10px] text-zinc-500 pl-1">Exit after N Candles</span>
                     <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         min="0"
                         value={tradingConfig.hftExitAfterNCandles || ''}
                         placeholder="e.g. 5 (0 to disable)"
                         onChange={(e) => {
                           const val = parseInt(e.target.value);
                           updateConfig({ hftExitAfterNCandles: isNaN(val) ? undefined : val });
                         }}
                         className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                       />
                       <select 
                          value={tradingConfig.hftExitCandlesSource || 'alpha'} 
                          onChange={e => updateConfig({ hftExitCandlesSource: e.target.value as any })} 
                          className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1.5 w-[70px] focus:outline-none focus:border-emerald-500"
                        >
                          <option value="alpha">Alpha</option>
                          <option value="beta">Beta</option>
                          <option value="delta">Delta</option>
                       </select>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
