import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { TradeCategory } from '../../functions/api/rules/tradeTypes';

export const TradingPanelTradeSettings: React.FC = () => {
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();
  const [activeTab, setActiveTab] = useState<'main' | 'recurrent'>('main');

  const handleMainCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    setTradingConfig(prev => ({
      ...prev,
      mainTradeParams: {
        ...prev.mainTradeParams,
        executionType: prev.mainTradeParams?.executionType || 'market execution',
        countToExecute: val
      }
    }));
  };

  const handleRecurrentCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        ...prev.recurrentTradeParams,
        countToExecute: val
      }
    }));
  };

  const isRecurrentTradeActive = tradingConfig.isRecurrentTradeActive || false;
  const mainCount = tradingConfig.mainTradeParams?.countToExecute || 1;
  const recurrentCount = tradingConfig.recurrentTradeParams?.countToExecute || 1;

  const handleRecurrentEntryTimeChange = (type: 'fixed' | 'min' | 'max', value: string) => {
    let val = parseInt(value);
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        onlyExecuteIfLatestTradeInSurplus: prev.recurrentTradeParams?.onlyExecuteIfLatestTradeInSurplus ?? true,
        ...prev.recurrentTradeParams,
        ...(type === 'fixed' && { entryAfterNSeconds: isNaN(val) ? undefined : val }),
        ...(type === 'min' && { entryAfterNSecondsMin: isNaN(val) ? undefined : val }),
        ...(type === 'max' && { entryAfterNSecondsMax: isNaN(val) ? undefined : val }),
      }
    }));
  };

  const handleRecurrentExitTimeChange = (type: 'fixed' | 'min' | 'max', value: string) => {
    let val = parseInt(value);
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        onlyExecuteIfLatestTradeInSurplus: prev.recurrentTradeParams?.onlyExecuteIfLatestTradeInSurplus ?? true,
        ...prev.recurrentTradeParams,
        ...(type === 'fixed' && { exitAfterNSeconds: isNaN(val) ? undefined : val }),
        ...(type === 'min' && { exitAfterNSecondsMin: isNaN(val) ? undefined : val }),
        ...(type === 'max' && { exitAfterNSecondsMax: isNaN(val) ? undefined : val }),
      }
    }));
  };

  const handleRecurrentEntryCandleChange = (type: 'fixed' | 'min' | 'max', value: string) => {
    let val = parseInt(value);
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        ...prev.recurrentTradeParams,
        ...(type === 'fixed' && { entryAfterNCandles: isNaN(val) ? undefined : val }),
        ...(type === 'min' && { entryAfterNCandlesMin: isNaN(val) ? undefined : val }),
        ...(type === 'max' && { entryAfterNCandlesMax: isNaN(val) ? undefined : val }),
      }
    }));
  };

  const handleRecurrentExitCandleChange = (type: 'fixed' | 'min' | 'max', value: string) => {
    let val = parseInt(value);
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        ...prev.recurrentTradeParams,
        ...(type === 'fixed' && { exitAfterNCandles: isNaN(val) ? undefined : val }),
        ...(type === 'min' && { exitAfterNCandlesMin: isNaN(val) ? undefined : val }),
        ...(type === 'max' && { exitAfterNCandlesMax: isNaN(val) ? undefined : val }),
      }
    }));
  };

  const handleSurplusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        ...prev.recurrentTradeParams,
        onlyExecuteIfLatestTradeInSurplus: e.target.checked
      }
    }));
  };

  const handleCloseAlongsideToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        ...prev.recurrentTradeParams,
        closeAlongsideMainTrade: e.target.checked
      }
    }));
  };

  const handleEntryOnMainTradeTrailToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTradingConfig(prev => ({
      ...prev,
      recurrentTradeParams: {
        countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
        ...prev.recurrentTradeParams,
        entryOnMainTradeTrail: e.target.checked
      }
    }));
  };

  const recurrentEntryFixed = tradingConfig.recurrentTradeParams?.entryAfterNSeconds || '';
  const recurrentEntryMin = tradingConfig.recurrentTradeParams?.entryAfterNSecondsMin || '';
  const recurrentEntryMax = tradingConfig.recurrentTradeParams?.entryAfterNSecondsMax || '';
  
  const recurrentExitFixed = tradingConfig.recurrentTradeParams?.exitAfterNSeconds || '';
  const recurrentExitMin = tradingConfig.recurrentTradeParams?.exitAfterNSecondsMin || '';
  const recurrentExitMax = tradingConfig.recurrentTradeParams?.exitAfterNSecondsMax || '';
  
  const onlySurplus = tradingConfig.recurrentTradeParams?.onlyExecuteIfLatestTradeInSurplus ?? true;
  const onlySqueezeValid = tradingConfig.recurrentTradeParams?.onlyExecuteIfSqueezeMomentumValid ?? false;
  const adxThreshold = tradingConfig.recurrentTradeParams?.adxFilterThreshold ?? 18;
  const onlyTrendFavorable = tradingConfig.recurrentTradeParams?.onlyExecuteIfTrendStrengthFavorable ?? false;
  const onlyHeikinFavorable = tradingConfig.recurrentTradeParams?.onlyExecuteIfHeikinAshiFavorable ?? false;

  const closeAlongside = tradingConfig.recurrentTradeParams?.closeAlongsideMainTrade ?? false;
  const entryOnMainTradeTrail = tradingConfig.recurrentTradeParams?.entryOnMainTradeTrail ?? false;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('main')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'main' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-400 hover:bg-zinc-800/50'
          }`}
        >
          Main Trade Settings
        </button>
        <button
          onClick={() => setActiveTab('recurrent')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'recurrent' ? 'bg-purple-500/20 text-purple-400' : 'text-zinc-400 hover:bg-zinc-800/50'
          }`}
        >
          Recurrent Trade Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeTab === 'main' && (
          <>
            <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg h-min">
              <h4 className="text-sm font-semibold text-cyan-500 mb-4 uppercase tracking-wider">Trade Execution Types</h4>
              
              <div className="flex flex-col gap-4">
                <label className="flex items-start gap-3 opacity-80 cursor-not-allowed">
                  <input 
                    type="checkbox" 
                    checked={true}
                    disabled={true}
                    className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500 rounded" 
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-200">Main Trade</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Executes immediately on entry signal via market execution.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isRecurrentTradeActive}
                    onChange={(e) => setTradingConfig(prev => ({ ...prev, isRecurrentTradeActive: e.target.checked }))}
                    className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500 rounded" 
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-200">Recurrent Trade</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Executes repeatedly after main trade depending on interval.</div>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={tradingConfig.flipModeActive || false}
                    onChange={(e) => setTradingConfig(prev => ({ ...prev, flipModeActive: e.target.checked }))}
                    className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500 rounded" 
                  />
                  <div>
                    <div className="text-xs font-bold text-zinc-200">Flip Mode</div>
                    <div className="text-[10px] text-zinc-400 mt-1">Flip mode opens next trade when current trade is closed on reversal.</div>
                  </div>
                </label>

                {tradingConfig.flipModeActive && (
                  <div className="pl-6 mt-1 border-l-2 border-zinc-800 ml-2">
                    <label className="flex items-start gap-3 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                      <input 
                        type="checkbox"
                        checked={tradingConfig.flipModeUseExitRuleAsEntry || false}
                        onChange={(e) => setTradingConfig(prev => ({ ...prev, flipModeUseExitRuleAsEntry: e.target.checked }))}
                        className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500 rounded"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-300">Use Whatever Exit Rule is being Present As Entry Rule To Open Next Trade</div>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg flex flex-col gap-6">
              <div>
                <h4 className="text-sm font-semibold text-cyan-500 mb-4 uppercase tracking-wider">Main Trade Parameters</h4>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Execution Mode</label>
                    <div className="text-xs text-zinc-300 font-mono bg-zinc-800 px-3 py-2 rounded border border-zinc-700">Market Execution</div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Trade Count To Execute</label>
                    <input 
                      type="number" 
                      min="1"
                      value={mainCount}
                      onChange={handleMainCountChange}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[10px] text-zinc-500 mt-1">Cannot be zero. Defines the number of trades to spawn on entry.</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Exit after N Pips</label>
                    <input 
                      type="number" 
                      min="0"
                      value={tradingConfig.exitAfterNPips || ''}
                      placeholder="0 to disable"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTradingConfig(prev => ({
                          ...prev,
                          exitAfterNPips: isNaN(val) ? undefined : val
                        }));
                      }}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[10px] text-zinc-500 mt-1">Exit the main trade strictly after N pips of profit. 0 means disabled.</div>
                  </div>

                  {tradingConfig.exitOnSignalReversal && (
                    <div className="pt-2 border-t border-zinc-800/50 mt-2">
                      <label className="flex items-start gap-3 cursor-pointer mb-3">
                        <input 
                          type="checkbox" 
                          checked={tradingConfig.partialTradeExitOnReversal || false}
                          onChange={(e) => setTradingConfig(prev => ({
                            ...prev,
                            partialTradeExitOnReversal: e.target.checked
                          }))}
                          className="mt-1 bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500 rounded" 
                        />
                        <div>
                          <div className="text-[10px] font-bold text-zinc-200 uppercase">Partial Trade Exit on Reversal</div>
                          <div className="text-[10px] text-zinc-500 mt-1">If enabled, when a signal reversal occurs, only a percentage of the active lot size will be closed instead of the full position.</div>
                        </div>
                      </label>
                      {(tradingConfig.partialTradeExitOnReversal || false) && (
                        <div>
                           <label className="block text-[10px] text-zinc-400 mb-1">Exit Percentage (%)</label>
                           <input 
                              type="number" 
                              min="1"
                              max="99"
                              value={tradingConfig.partialExitPercentage ?? 70}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setTradingConfig(prev => ({
                                  ...prev,
                                  partialExitPercentage: isNaN(val) ? 70 : val
                                }));
                              }}
                              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                           />
                           <div className="text-[10px] text-zinc-500 mt-1">Percentage of the current position size to close (e.g., 70% closes 0.02 of a 0.03 position).</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'recurrent' && (
          <div className="col-span-1 md:col-span-2 bg-zinc-900/50 p-4 border border-zinc-800 rounded-lg flex flex-col gap-6">
            <h4 className="text-sm font-semibold text-purple-400 mb-4 uppercase tracking-wider">Recurrent Trades Parameters</h4>
            
            {!isRecurrentTradeActive && (
               <div className="text-sm text-amber-500 mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded">
                 Recurrent trades are currently disabled. You must enable them in 'Main Trade Settings'.
               </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-100">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Recurrent Trades Count</label>
                  <input 
                    type="number" 
                    min="1"
                    value={recurrentCount}
                    onChange={handleRecurrentCountChange}
                    disabled={!isRecurrentTradeActive}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                  />
                  <div className="text-[10px] text-zinc-500 mt-1">Number of additional instances to execute after the main trade.</div>
                </div>
                
                <div className="pt-2 border-t border-zinc-800/50 mt-2 flex flex-col gap-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={onlySurplus}
                      onChange={handleSurplusToggle}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Only execute if latest trade is in surplus</div>
                      <div className="text-[10px] text-zinc-500 mt-1">If enabled, the next recurrent trade will only spawn if the latest trade is currently profitable. Additionally applies volatility regime checks.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-800/30">
                    <input 
                      type="checkbox" 
                      checked={onlySqueezeValid}
                      onChange={(e) => setTradingConfig(prev => ({
                        ...prev,
                        recurrentTradeParams: {
                          ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                          onlyExecuteIfSqueezeMomentumValid: e.target.checked
                        }
                      }))}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Only execute if squeeze momentum filter is valid</div>
                      <div className="text-[10px] text-zinc-500 mt-1">If enabled, evaluates the squeeze momentum state on key alpha/beta streams.</div>
                    </div>
                  </label>
                  
                  <div className="pt-2 border-t border-zinc-800/30">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tradingConfig.recurrentTradeParams?.adxFilterThreshold !== undefined && tradingConfig.recurrentTradeParams?.adxFilterThreshold > 0}
                        onChange={(e) => setTradingConfig(prev => ({
                          ...prev,
                          recurrentTradeParams: {
                            ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                            adxFilterThreshold: e.target.checked ? 18 : 0
                          }
                        }))}
                        disabled={!isRecurrentTradeActive}
                        className="mt-0.5 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                      />
                      <div>
                        <div className="text-[10px] font-bold text-zinc-200 uppercase leading-none mt-1">Only execute if adx filter threshold is valid positive</div>
                        <div className="text-[10px] text-zinc-500 mt-2">Check if ADX trendiness exceeds the custom threshold.</div>
                      </div>
                    </label>
                    {tradingConfig.recurrentTradeParams?.adxFilterThreshold !== undefined && tradingConfig.recurrentTradeParams?.adxFilterThreshold > 0 && (
                       <div className="mt-2 pl-6">
                         <input 
                           type="number" 
                           value={adxThreshold}
                           onChange={(e) => {
                             const val = parseInt(e.target.value);
                             setTradingConfig(prev => ({
                               ...prev,
                               recurrentTradeParams: {
                                 ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                                 adxFilterThreshold: isNaN(val) ? 18 : val
                               }
                             }));
                           }}
                           disabled={!isRecurrentTradeActive}
                           className="w-20 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                         />
                       </div>
                    )}
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-800/30">
                    <input 
                      type="checkbox" 
                      checked={onlyTrendFavorable}
                      onChange={(e) => setTradingConfig(prev => ({
                        ...prev,
                        recurrentTradeParams: {
                          ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                          onlyExecuteIfTrendStrengthFavorable: e.target.checked
                        }
                      }))}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Only execute if trend strength is favorable to trade direction</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Ensure the linear regression system slope direction matches the entry direction.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-800/30">
                    <input 
                      type="checkbox" 
                      checked={onlyHeikinFavorable}
                      onChange={(e) => setTradingConfig(prev => ({
                        ...prev,
                        recurrentTradeParams: {
                          ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                          onlyExecuteIfHeikinAshiFavorable: e.target.checked
                        }
                      }))}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Only execute if smoothing candles heikin ashi is of trade direction</div>
                      <div className="text-[10px] text-zinc-500 mt-1">Require current smoothed Heikin Ashi candle color to align with your entry bias.</div>
                    </div>
                  </label>
                </div>

                <div className="pt-2 border-t border-zinc-800/50 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Pips Based Entry</label>
                  <div>
                    <input 
                      type="number" 
                      min="0"
                      placeholder="e.g. 10 (0 to disable)"
                      value={tradingConfig.recurrentTradeParams?.entryOnPipsFavor || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setTradingConfig(prev => ({
                          ...prev,
                          recurrentTradeParams: {
                            countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
                            ...prev.recurrentTradeParams,
                            entryOnPipsFavor: isNaN(val) ? undefined : val
                          }
                        }));
                      }}
                      disabled={!isRecurrentTradeActive}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                    />
                    <div className="text-[10px] text-zinc-500 mt-1">
                      Execute a recurrent trade if price moves X pips in favor of our direction. This acts as an alternative trigger alongside Time/Candle limits. 0 means disabled.
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/50 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Candle Pattern Based Entry</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={tradingConfig.recurrentTradeParams?.entryOnCandlePattern || false}
                        onChange={(e) => {
                          setTradingConfig(prev => ({
                            ...prev,
                            recurrentTradeParams: {
                              countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
                              ...prev.recurrentTradeParams,
                              entryOnCandlePattern: e.target.checked
                            }
                          }));
                        }}
                        disabled={!isRecurrentTradeActive}
                        className="bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                      />
                      <span className="text-xs text-zinc-200">Trigger on Pattern (Same Direction)</span>
                    </label>
                    
                    {tradingConfig.recurrentTradeParams?.entryOnCandlePattern && (
                      <div className="pl-6 border-l border-zinc-800">
                        <label className="block text-[10px] text-zinc-500 mb-1">Observation Source Dataset</label>
                        <select
                          value={tradingConfig.recurrentTradeParams?.entryOnCandlePatternSource || 'none'}
                          onChange={(e) => {
                            setTradingConfig(prev => ({
                              ...prev,
                              recurrentTradeParams: {
                                countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
                                ...prev.recurrentTradeParams,
                                entryOnCandlePatternSource: e.target.value as any
                              }
                            }));
                          }}
                          disabled={!isRecurrentTradeActive}
                          className="w-full bg-zinc-800 border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                        >
                          <option value="none">Disabled</option>
                          <option value="any">Any (Across All Active Data Sources)</option>
                          <option value="alpha">Alpha Base Dataset Only</option>
                          <option value="beta">Beta Derived Dataset Only</option>
                          <option value="delta">Delta Derived Dataset Only</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/50 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Trend & Candle Reversal Entries</label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tradingConfig.recurrentTradeParams?.entryOnTrendRevert || false}
                        onChange={(e) => setTradingConfig(prev => ({
                          ...prev,
                          recurrentTradeParams: {
                            ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                            entryOnTrendRevert: e.target.checked
                          }
                        }))}
                        disabled={!isRecurrentTradeActive}
                        className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50 shrink-0" 
                      />
                      <div>
                        <div className="text-[10px] font-bold text-zinc-200 uppercase">Trend Strength Revert Entry To Main Trade Direction With Strong Strength</div>
                        <div className="text-[10px] text-zinc-500 mt-1">Trigger trade when Trend Strength reverts back to the main trade direction from opposite side (with absolute strength &ge; 1.0).</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer pt-2 border-t border-zinc-800/30">
                      <input 
                        type="checkbox" 
                        checked={tradingConfig.recurrentTradeParams?.entryOnCandlesRevert || false}
                        onChange={(e) => setTradingConfig(prev => ({
                          ...prev,
                          recurrentTradeParams: {
                            ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                            entryOnCandlesRevert: e.target.checked
                          }
                        }))}
                        disabled={!isRecurrentTradeActive}
                        className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50 shrink-0" 
                      />
                      <div>
                        <div className="text-[10px] font-bold text-zinc-200 uppercase">Smoothing Candles Revert Entry Revert To Main Trade Direction</div>
                        <div className="text-[10px] text-zinc-500 mt-1">Trigger trade when Smoothed Heikin Ashi candles revert from the opposite direction back to main trade direction.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/50 mt-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Time Entry</label>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1">Fixed N Seconds</label>
                      <input 
                        type="number" 
                        value={recurrentEntryFixed}
                        onChange={(e) => handleRecurrentEntryTimeChange('fixed', e.target.value)}
                        placeholder="e.g. 60"
                        disabled={!isRecurrentTradeActive}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Min Seconds</label>
                        <input 
                          type="number" 
                          value={recurrentEntryMin}
                          onChange={(e) => handleRecurrentEntryTimeChange('min', e.target.value)}
                          placeholder="e.g. 30"
                          disabled={!isRecurrentTradeActive}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Max Seconds</label>
                        <input 
                          type="number" 
                          value={recurrentEntryMax}
                          onChange={(e) => handleRecurrentEntryTimeChange('max', e.target.value)}
                          placeholder="e.g. 120"
                          disabled={!isRecurrentTradeActive}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1">Entry (Candles)</label>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="Fixed" min="0" max="100" value={tradingConfig.recurrentTradeParams?.entryAfterNCandles || ''} onChange={(e) => handleRecurrentEntryCandleChange('fixed', e.target.value)} disabled={!isRecurrentTradeActive} className="w-14 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                        <input type="number" placeholder="Min" min="0" max="100" value={tradingConfig.recurrentTradeParams?.entryAfterNCandlesMin || ''} onChange={(e) => handleRecurrentEntryCandleChange('min', e.target.value)} disabled={!isRecurrentTradeActive} className="w-12 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                        <input type="number" placeholder="Max" min="0" max="100" value={tradingConfig.recurrentTradeParams?.entryAfterNCandlesMax || ''} onChange={(e) => handleRecurrentEntryCandleChange('max', e.target.value)} disabled={!isRecurrentTradeActive} className="w-12 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column for recurrent settings */}
              <div className="flex flex-col gap-4">
                <div className="border-t border-zinc-800/50 md:border-t-0 md:pt-0 pt-2 mt-2 md:mt-0">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Time and Pips Exit</label>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1">Exit after N Pips</label>
                      <input 
                        type="number" 
                        min="0"
                        value={tradingConfig.recurrentTradeParams?.exitAfterNPips || ''}
                        placeholder="0 to disable"
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setTradingConfig(prev => ({
                            ...prev,
                            recurrentTradeParams: {
                              ...prev.recurrentTradeParams,
                              countToExecute: prev.recurrentTradeParams?.countToExecute || 1,
                              exitAfterNPips: isNaN(val) ? undefined : val
                            }
                          }));
                        }}
                        disabled={!isRecurrentTradeActive}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                      />
                      <div className="text-[10px] text-zinc-500 mb-2">Auto-closes trade after specific pip threshold. 0 means disabled.</div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1">Fixed N Seconds</label>
                      <input 
                        type="number" 
                        value={recurrentExitFixed}
                        onChange={(e) => handleRecurrentExitTimeChange('fixed', e.target.value)}
                        placeholder="e.g. 60"
                        disabled={!isRecurrentTradeActive}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Min Seconds</label>
                        <input 
                          type="number" 
                          value={recurrentExitMin}
                          onChange={(e) => handleRecurrentExitTimeChange('min', e.target.value)}
                          placeholder="e.g. 30"
                          disabled={!isRecurrentTradeActive}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 mb-1">Max Seconds</label>
                        <input 
                          type="number" 
                          value={recurrentExitMax}
                          onChange={(e) => handleRecurrentExitTimeChange('max', e.target.value)}
                          placeholder="e.g. 120"
                          disabled={!isRecurrentTradeActive}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 mb-1">Exit (Candles)</label>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="Fixed" min="0" max="100" value={tradingConfig.recurrentTradeParams?.exitAfterNCandles || ''} onChange={(e) => handleRecurrentExitCandleChange('fixed', e.target.value)} disabled={!isRecurrentTradeActive} className="w-14 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                        <input type="number" placeholder="Min" min="0" max="100" value={tradingConfig.recurrentTradeParams?.exitAfterNCandlesMin || ''} onChange={(e) => handleRecurrentExitCandleChange('min', e.target.value)} disabled={!isRecurrentTradeActive} className="w-12 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                        <input type="number" placeholder="Max" min="0" max="100" value={tradingConfig.recurrentTradeParams?.exitAfterNCandlesMax || ''} onChange={(e) => handleRecurrentExitCandleChange('max', e.target.value)} disabled={!isRecurrentTradeActive} className="w-12 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-purple-500 focus:border-purple-500 placeholder:text-purple-700 disabled:opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={closeAlongside}
                      onChange={handleCloseAlongsideToggle}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Close Alongside Main Trade</div>
                      <div className="text-[10px] text-zinc-500 mt-1">If enabled, when the main trade exits, all open recurrent child trades will be forced to forcefully close as well.</div>
                    </div>
                  </label>

                  {closeAlongside && (
                    <div className="pl-6 border-l-2 border-zinc-850 flex flex-col gap-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={tradingConfig.recurrentTradeParams?.closeAllRecurrentOnPartialExit || false}
                          onChange={(e) => setTradingConfig(prev => ({
                            ...prev,
                            recurrentTradeParams: {
                              ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                              closeAllRecurrentOnPartialExit: e.target.checked,
                              closePctRecurrentOnPartialExitActive: e.target.checked ? false : prev.recurrentTradeParams?.closePctRecurrentOnPartialExitActive
                            }
                          }))}
                          disabled={!isRecurrentTradeActive}
                          className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                        />
                        <div>
                          <div className="text-[10px] font-bold text-zinc-300 uppercase">even if main trade is partially closed close all recurrent trades</div>
                        </div>
                      </label>

                      <div className="pl-6 border-l-2 border-zinc-800/50 flex flex-col gap-2">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={tradingConfig.recurrentTradeParams?.closePctRecurrentOnPartialExitActive || false}
                            onChange={(e) => setTradingConfig(prev => ({
                              ...prev,
                              recurrentTradeParams: {
                                ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                                closePctRecurrentOnPartialExitActive: e.target.checked,
                                closeAllRecurrentOnPartialExit: e.target.checked ? false : prev.recurrentTradeParams?.closeAllRecurrentOnPartialExit
                              }
                            }))}
                            disabled={!isRecurrentTradeActive}
                            className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                          />
                          <div>
                            <div className="text-[10px] font-bold text-zinc-300 uppercase">Close 50% of the active recurrent trades when main trade is partially closed</div>
                          </div>
                        </label>
                        
                        {tradingConfig.recurrentTradeParams?.closePctRecurrentOnPartialExitActive && (
                          <div className="pl-6 flex items-center gap-2 mt-1">
                            <label className="text-[10px] text-zinc-400">Percentage to Close:</label>
                            <input 
                              type="number" 
                              min="1"
                              max="100"
                              value={tradingConfig.recurrentTradeParams?.closePctRecurrentPercentage ?? 50}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                setTradingConfig(prev => ({
                                  ...prev,
                                  recurrentTradeParams: {
                                    ...(prev.recurrentTradeParams || { countToExecute: 1 }),
                                    closePctRecurrentPercentage: isNaN(val) ? 50 : val
                                  }
                                }));
                              }}
                              disabled={!isRecurrentTradeActive}
                              className="w-16 bg-zinc-800 border border-zinc-700 rounded px-2 py-0.5 text-xs text-zinc-200 focus:outline-none focus:border-purple-400 disabled:opacity-50"
                            />
                            <span className="text-zinc-500 text-xs">%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={entryOnMainTradeTrail}
                      onChange={handleEntryOnMainTradeTrailToggle}
                      disabled={!isRecurrentTradeActive}
                      className="mt-1 bg-zinc-800 border-zinc-700 text-purple-400 focus:ring-purple-400 rounded disabled:opacity-50" 
                    />
                    <div>
                      <div className="text-[10px] font-bold text-zinc-200 uppercase">Entry On Main Trade SL Trail</div>
                      <div className="text-[10px] text-zinc-500 mt-1">If enabled, a recurrent trade will instantly execute whenever the active main trade's Trailing Stop Loss gets updated.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

