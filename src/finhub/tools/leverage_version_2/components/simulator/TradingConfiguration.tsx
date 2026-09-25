import React from 'react';
import { TradingRulesConfig } from '../../functions/api/rules/tradingRules';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { activeClassicSystems, ClassicSystemOption } from '../../functions/api/classicSystem/classicsystemController';

interface TradingConfigurationProps {
  config: TradingRulesConfig;
  onChange: (config: TradingRulesConfig) => void;
}

export const TradingConfiguration: React.FC<TradingConfigurationProps> = ({ config, onChange }) => {
  const { dataSettings } = useIndicatorsStore();
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
      <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider">Trading Config</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-2">
        <div className="flex flex-col gap-1">
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.entryOnSignal} onChange={e => updateConfig({ entryOnSignal: e.target.checked })} />
            Auto-Entry on Signal
          </label>
          {config.entryOnSignal && (
            <div className="flex items-center gap-2 ml-6 text-xs text-zinc-400">
              <span>Source:</span>
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
          <label className="flex items-center gap-2 text-xs text-zinc-300 select-none cursor-pointer">
            <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-zinc-400 focus:ring-cyan-500" checked={config.useStopLoss} onChange={e => updateConfig({ useStopLoss: e.target.checked })} />
            Use Stop Loss (ATR Bands)
          </label>
          {config.useStopLoss && (
            <div className="flex flex-col gap-1.5 ml-6">
              <label className="flex items-center gap-2 text-[10px] text-cyan-400 select-none cursor-pointer">
                <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500" checked={!!config.useSmoothAtrStopLossTrailing} onChange={e => updateConfig({ useSmoothAtrStopLossTrailing: e.target.checked })} />
                Trail SL with Smooth ATR Bands
              </label>
              {config.useSmoothAtrStopLossTrailing && (
                <label className="flex items-center gap-2 text-[10px] text-purple-400 select-none cursor-pointer ml-4">
                  <input type="checkbox" className="rounded bg-zinc-800 border-zinc-700 text-purple-500 focus:ring-purple-500" checked={!!config.trailRecurrentTradesWithAtr} onChange={e => updateConfig({ trailRecurrentTradesWithAtr: e.target.checked })} />
                  Also Trail Recurrent Trades
                </label>
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
              <span className="text-zinc-400/80 mx-1">or volatility</span>
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

        <div className="md:col-span-2 border-t border-zinc-700/30 pt-2 mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
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
