import React, { useState } from 'react';
import { TradingRulesConfig } from '../../functions/api/rules/tradingRules';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { activeClassicSystems, ClassicSystemOption } from '../../functions/api/classicSystem/classicsystemController';
import { getLongAtrStopLossPrice, getLongAtrStopLossDifferenceInPips } from '../../functions/api/middleware/translateLongSLPriceIntoPips';
import { getBaseSystemId } from '../../functions/api/conjunctionSystem/selfReplicationLabelManage';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TradingConfigurationProps {
  config: TradingRulesConfig;
  onChange: (config: TradingRulesConfig) => void;
  latestPrice?: number;
  stops?: { lowerBand: number[], upperBand: number[] };
  assetType?: string;
  simulationIndex?: number;
}

export const TradingConfiguration: React.FC<TradingConfigurationProps> = ({ config, onChange, latestPrice = 0, stops, assetType = 'gold', simulationIndex = 0 }) => {
  const { dataSettings, indicatorSettings, setIndicatorSettings } = useIndicatorsStore();
  const [showSlSettings, setShowSlSettings] = useState(false);
  const updateConfig = (updates: Partial<TradingRulesConfig>) => {
    onChange({ ...config, ...updates });
  };

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const currentEntrySourceInterval = config.entrySignalSource === 'beta' ? betaInterval : config.entrySignalSource === 'delta' ? deltaInterval : alphaInterval;
  const currentExitSourceInterval = config.exitSignalSource === 'beta' ? betaInterval : config.exitSignalSource === 'delta' ? deltaInterval : alphaInterval;

  const activeExitSystem = activeClassicSystems.find(s => s.id === config.exitSignalSystemType);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Trading Config</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 font-bold uppercase">Active System Mode:</span>
          <select 
            value={config.activeSystemMode || 'classic'} 
            onChange={(e) => updateConfig({ activeSystemMode: e.target.value as any })}
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 font-semibold"
          >
            <option value="classic">Classic System</option>
            <option value="conjunction">Conjunction System</option>
          </select>
        </div>
      </div>
      
      {config.activeSystemMode === 'conjunction' && (
        <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3 mb-2 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase">Conjunction System Configuration</span>
          <span className="text-[10px] text-zinc-400">Select up to 3 systems to use in conjunction when they align in the same direction.</span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
            {activeClassicSystems.map(sys => {
              const isActive = (config.activeConjunctionSystems || []).some(id => getBaseSystemId(id) === sys.id);
              return (
                <label key={sys.id} className="flex items-center gap-2 text-[10px] text-zinc-300 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-purple-500 ring-offset-zinc-900" 
                    checked={isActive} 
                    onChange={(e) => {
                      let current = [...(config.activeConjunctionSystems || [])];
                      if (e.target.checked) {
                        if (current.length < 3) {
                          current.push(`${sys.id}_alpha`);
                        } else {
                          // Already have 3, ignore or replace
                          return;
                        }
                      } else {
                        current = current.filter(id => getBaseSystemId(id) !== sys.id);
                      }
                      updateConfig({ activeConjunctionSystems: current });
                    }} 
                  />
                  {sys.name}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-2">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.entryOnSignal} onChange={e => updateConfig({ entryOnSignal: e.target.checked })} />
            Auto-Entry on Signal
          </label>
          {config.entryOnSignal && (
            <div className="flex items-center gap-2 ml-6 text-xs text-zinc-400">
              <span>Source:</span>
              {config.activeSystemMode === 'conjunction' ? (
                 <span className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1">N/A, see system panel</span>
              ) : (
                <>
                  <select 
                    value={config.entrySignalSource || 'alpha'}
                    onChange={(e) => updateConfig({ entrySignalSource: e.target.value as any })}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1 min-w-[60px]"
                  >
                    <option value="alpha">Alpha</option>
                    <option value="beta">Beta</option>
                    <option value="delta">Delta</option>
                  </select>
                  <span className="text-cyan-500 font-bold ml-1">{formatInterval(currentEntrySourceInterval)}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.exitOnSignalReversal} onChange={e => updateConfig({ exitOnSignalReversal: e.target.checked })} />
            Exit on Signal Reversal
          </label>
           {config.exitOnSignalReversal && (
            <div className="flex items-center gap-2 ml-6 text-xs text-zinc-400 mb-1">
              <span>Source:</span>
              <select 
                value={config.exitSignalSource || 'alpha'}
                onChange={(e) => updateConfig({ exitSignalSource: e.target.value as any })}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1 min-w-[60px]"
              >
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="delta">Delta</option>
              </select>
              <span className="text-cyan-500 font-bold ml-1">{formatInterval(currentExitSourceInterval)}</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center flex-wrap gap-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
              <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.useStopLoss} onChange={e => updateConfig({ useStopLoss: e.target.checked })} />
              Use Stop Loss ({indicatorSettings.stopLossIndicator?.type === 'last_n_candles' ? 'Last N Candles' : 'ATR Bands'}) <span className="ml-1 text-[9px] px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">[{indicatorSettings.stopLossIndicator?.dataSource || 'alpha'}]</span>
            </label>
            <button 
              onClick={() => setShowSlSettings(!showSlSettings)} 
              className="text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              {showSlSettings ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          </div>
          
          {showSlSettings && (
            <div className="flex flex-col gap-2 ml-6 my-1 bg-zinc-900/50 border border-zinc-800 p-2 rounded">
              {indicatorSettings.stopLossIndicator?.type === 'atr_bands' ? (
                <div className="flex items-center gap-3 text-[10px]">
                  <label className="flex items-center gap-1.5 text-zinc-400">
                    <span>Period:</span>
                    <input type="number" value={indicatorSettings.stopLossIndicator?.period || 10} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, period: parseInt(e.target.value) || 1}}))} className="w-12 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5" />
                  </label>
                  <label className="flex items-center gap-1.5 text-zinc-400">
                    <span>Multiplier:</span>
                    <input type="number" step="0.1" value={indicatorSettings.stopLossIndicator?.multiplier || 3} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, multiplier: parseFloat(e.target.value) || 0.1}}))} className="w-12 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5" />
                  </label>
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-[10px]">
                  <label className="flex items-center gap-1.5 text-zinc-400">
                    <span>Last N Period:</span>
                    <input type="number" value={indicatorSettings.stopLossIndicator?.lastNPeriod || 5} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, lastNPeriod: parseInt(e.target.value) || 1}}))} className="w-12 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5" />
                  </label>
                  <div className="flex items-center gap-4 text-zinc-400">
                     <label className="flex items-center gap-1.5">
                       <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500" checked={indicatorSettings.stopLossIndicator?.allowAtrOffset || false} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, allowAtrOffset: e.target.checked}}))} />
                       ATR Offset
                     </label>
                     {indicatorSettings.stopLossIndicator?.allowAtrOffset && (
                       <label className="flex items-center gap-1.5">
                         <span>Mult:</span>
                         <input type="number" step="0.1" value={indicatorSettings.stopLossIndicator?.atrOffsetMultiplier || 1.0} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, atrOffsetMultiplier: parseFloat(e.target.value) || 1.0}}))} className="w-10 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5" />
                       </label>
                     )}
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                     <label className="flex items-center gap-1.5">
                       <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500" checked={indicatorSettings.stopLossIndicator?.allowFixedOffset || false} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, allowFixedOffset: e.target.checked}}))} />
                       Fixed Offset
                     </label>
                     {indicatorSettings.stopLossIndicator?.allowFixedOffset && (
                       <label className="flex items-center gap-1.5">
                         <span>Pips:</span>
                         <input type="number" value={indicatorSettings.stopLossIndicator?.fixedOffsetPips ?? 10} onChange={e => setIndicatorSettings(prev => ({...prev, stopLossIndicator: {...prev.stopLossIndicator, fixedOffsetPips: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)}}))} className="w-10 bg-zinc-800 border border-zinc-700 rounded px-1 py-0.5" />
                       </label>
                     )}
                  </div>
                </div>
              )}
            </div>
          )}

          {config.useStopLoss && (
            <div className="flex flex-col gap-1.5 ml-6">
              {stops && stops.lowerBand[simulationIndex] !== undefined && latestPrice > 0 && (
                <div className="flex flex-col gap-0.5 text-[10px] text-zinc-400 mb-1 border-l-2 border-zinc-600 pl-2">
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500">Long SL Price:</span>
                    <span className="font-mono text-zinc-300">{getLongAtrStopLossPrice(stops.lowerBand[simulationIndex])}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500">Diff in Pips:</span>
                    <span className="font-mono text-amber-500">{getLongAtrStopLossDifferenceInPips(latestPrice, stops.lowerBand[simulationIndex], assetType)}</span>
                  </div>
                </div>
              )}
              <label className="flex items-center gap-2 text-[10px] text-cyan-400 select-none cursor-pointer">
                <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" checked={!!config.useSmoothAtrStopLossTrailing} onChange={e => updateConfig({ useSmoothAtrStopLossTrailing: e.target.checked })} />
                Trail SL with Smooth ATR Bands
              </label>
              {config.useSmoothAtrStopLossTrailing && (
                <div className="flex flex-col gap-1.5 ml-4">
                  <label className="flex items-center gap-2 text-[10px] text-purple-400 select-none cursor-pointer">
                    <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-purple-500" checked={!!config.trailRecurrentTradesWithAtr} onChange={e => updateConfig({ trailRecurrentTradesWithAtr: e.target.checked })} />
                    Also Trail Recurrent Trades
                  </label>
                  <label className="flex items-center gap-2 text-[10px] text-amber-400 select-none cursor-pointer">
                    <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-amber-500 focus:ring-amber-500" checked={!!config.useVolatilityRegimeSlTrailing} onChange={e => updateConfig({ useVolatilityRegimeSlTrailing: e.target.checked })} />
                    Dynamic Volatility Regime Trailing
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
          <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.useTakeProfit} disabled={!config.useStopLoss} onChange={e => updateConfig({ useTakeProfit: e.target.checked })} />
          Use Take Profit
        </label>
        <label className={`flex items-center gap-2 text-xs text-zinc-300 md:col-span-2 mt-1 ${(!config.useTakeProfit || !config.useStopLoss) ? 'opacity-50' : ''}`}>
          <span className="whitespace-nowrap w-24">Risk/Reward:</span>
          <input type="range" min="0.5" max="3" step="0.5" value={config.rewardRiskRatio} disabled={!config.useTakeProfit || !config.useStopLoss} onChange={e => updateConfig({ rewardRiskRatio: parseFloat(e.target.value) })} className="flex-1 accent-cyan-500" />
          <span className="w-8 text-right font-medium">{config.rewardRiskRatio}:1</span>
        </label>

        <div className="md:col-span-2 border-t border-zinc-700/30 pt-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <span>Stop Loss (Pips):</span>
            <input 
              type="number" 
              min="0" max="1000" 
              placeholder="0 = off"
              value={config.stopLossPips || ''} 
              disabled={config.useStopLoss}
              onChange={e => updateConfig({ stopLossPips: parseInt(e.target.value) || 0 })} 
              className="w-16 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 disabled:opacity-50" 
            />
          </label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <span>Take Profit (Pips):</span>
            <input 
              type="number" 
              min="0" max="1000" 
              placeholder="0 = off"
              value={config.takeProfitPips || ''} 
              disabled={config.useTakeProfit && config.useStopLoss}
              onChange={e => updateConfig({ takeProfitPips: parseInt(e.target.value) || 0 })} 
              className="w-16 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 disabled:opacity-50" 
            />
          </label>
          <span className="text-[10px] text-zinc-500">Fixed pips override ATR bounds when set.</span>
        </div>
        
        <div className="md:col-span-2 bg-zinc-900/40 p-2 rounded border border-zinc-700/30">
          <p className="text-[10px] text-cyan-400/80 mb-2 font-medium uppercase tracking-wider">Dynamic Time Limits (Z-Score Scaled)</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-300">
              <span className="whitespace-nowrap w-[100px]">Exit (Candles):</span>
              <input type="number" placeholder="Fixed" min="0" max="100" value={config.exitAfterNCandles || ''} onChange={e => updateConfig({ exitAfterNCandles: parseInt(e.target.value) || 0 })} className="w-14 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <select value={config.exitCandlesSource || 'alpha'} onChange={e => updateConfig({ exitCandlesSource: e.target.value as any })} className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1 min-w-[50px]">
                <option value="alpha">Alpha</option>
                <option value="beta">Beta</option>
                <option value="delta">Delta</option>
              </select>
              <span className="text-zinc-400/80 mx-1">or vol min</span>
              <input type="number" placeholder="Min" min="0" max="100" value={config.exitAfterNCandlesMin || ''} onChange={e => updateConfig({ exitAfterNCandlesMin: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <input type="number" placeholder="Max" min="0" max="100" value={config.exitAfterNCandlesMax || ''} onChange={e => updateConfig({ exitAfterNCandlesMax: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-300">
              <span className="whitespace-nowrap w-[100px]">Exit (Minutes):</span>
              <input type="number" placeholder="Fixed" min="0" max="100" value={config.exitAfterNMinutes || ''} onChange={e => updateConfig({ exitAfterNMinutes: parseInt(e.target.value) || 0 })} className="w-14 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <span className="text-zinc-400/80 mx-1">or volatility</span>
              <input type="number" placeholder="Min" min="0" max="100" value={config.exitAfterNMinutesMin || ''} onChange={e => updateConfig({ exitAfterNMinutesMin: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <input type="number" placeholder="Max" min="0" max="100" value={config.exitAfterNMinutesMax || ''} onChange={e => updateConfig({ exitAfterNMinutesMax: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-300">
              <span className="whitespace-nowrap w-[100px]">Exit (Seconds):</span>
              <input type="number" placeholder="Fixed" min="0" max="500" value={config.exitAfterNSeconds || ''} onChange={e => updateConfig({ exitAfterNSeconds: parseInt(e.target.value) || 0 })} className="w-14 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <span className="text-zinc-400/80 mx-1">or volatility</span>
              <input type="number" placeholder="Min" min="0" max="500" value={config.exitAfterNSecondsMin || ''} onChange={e => updateConfig({ exitAfterNSecondsMin: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
              <input type="number" placeholder="Max" min="0" max="500" value={config.exitAfterNSecondsMax || ''} onChange={e => updateConfig({ exitAfterNSecondsMax: parseInt(e.target.value) || 0 })} className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 placeholder:text-cyan-700" />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-zinc-700/30 pt-2 mt-1 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
              <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.useADXFilter} onChange={e => updateConfig({ useADXFilter: e.target.checked })} />
              Filter by ADX
            </label>
            <label className={`flex items-center gap-2 text-xs text-zinc-300 ${!config.useADXFilter ? 'opacity-50' : ''}`}>
              <span>Threshold:</span>
              <input 
                type="number" 
                min="0" max="100" 
                value={config.adxThreshold} 
                disabled={!config.useADXFilter}
                onChange={e => updateConfig({ adxThreshold: parseInt(e.target.value) || 0 })} 
                className="w-12 bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5" 
              />
            </label>
            
            <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
              <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.useSqueezeFilter} onChange={e => updateConfig({ useSqueezeFilter: e.target.checked })} />
              Filter by Squeeze Momentum
            </label>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-300">
            <span className="text-[10px] text-zinc-400 font-medium">Volatility Data Source:</span>
            <select
              value={indicatorSettings.volatility.dataSource}
              onChange={e => setIndicatorSettings(prev => ({
                ...prev,
                volatility: {
                  ...prev.volatility,
                  dataSource: e.target.value as any
                }
              }))}
              className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] rounded px-1.5 py-0.5 focus:ring-cyan-500 focus:border-cyan-500 min-w-[70px]"
            >
              <option value="alpha">Alpha</option>
              <option value="beta">Beta</option>
              <option value="delta">Delta</option>
            </select>
            <span className="text-cyan-500 font-bold text-[10px]">
              ({formatInterval(indicatorSettings.volatility.dataSource === 'beta' ? betaInterval : indicatorSettings.volatility.dataSource === 'delta' ? deltaInterval : alphaInterval)})
            </span>
          </div>
        </div>

        <div className="md:col-span-2 border-t border-zinc-700/30 pt-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
          <label className="flex items-center gap-2 text-[11px] text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-orange-400 focus:ring-orange-500" checked={!!config.useVolRegimeScenarioA} onChange={e => updateConfig({ useVolRegimeScenarioA: e.target.checked })} />
            [Sc. A] High Z + High Vol
          </label>
          <label className="flex items-center gap-2 text-[11px] text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-emerald-400 focus:ring-emerald-500" checked={!!config.useVolRegimeScenarioC} onChange={e => updateConfig({ useVolRegimeScenarioC: e.target.checked })} />
            [Sc. C] Low Z + High Vol
          </label>
        </div>
        
        <div className="md:col-span-2 border-t border-red-500/30 pt-2 mt-1">
          <label className="flex items-center gap-2 text-xs text-red-400 select-none cursor-pointer font-bold uppercase tracking-wider mb-2">
            <input type="checkbox" className="rounded bg-red-900/20 border-red-500/50 text-red-500 focus:ring-red-500" checked={!!config.tradeBreaker} onChange={e => updateConfig({ tradeBreaker: e.target.checked })} />
            Trade Breaker (Prevent all new trades)
          </label>
          <div className="flex flex-col gap-2 pl-6">
            <label className="flex items-center gap-2 text-xs text-red-300/80 select-none cursor-pointer">
              <input type="checkbox" className="rounded bg-zinc-900 border-zinc-700 text-red-500 focus:ring-red-500" checked={!!config.autoTradeBreakerByEquityPct} onChange={e => updateConfig({ autoTradeBreakerByEquityPct: e.target.checked })} />
              Auto Enable Trade Breaker periodically on Combined Equity Growth (%)
            </label>
            {config.autoTradeBreakerByEquityPct && (
              <div className="flex items-center gap-2 pl-6">
                <span className="text-[10px] text-zinc-400">Equity Growth Threshold (%):</span>
                <input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={config.autoTradeBreakerEquityPctValue || ''}
                  onChange={e => updateConfig({ autoTradeBreakerEquityPctValue: parseFloat(e.target.value) || 0 })}
                  className="w-20 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded px-2 py-1 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="e.g. 5"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
