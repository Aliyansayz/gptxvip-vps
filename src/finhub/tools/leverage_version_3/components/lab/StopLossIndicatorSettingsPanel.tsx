import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { getLongAtrStopLossPrice, getLongAtrStopLossDifferenceInPips } from '../../functions/api/middleware/translateLongSLPriceIntoPips';

export const StopLossIndicatorSettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    indicatorSettings, 
    setIndicatorSettings, 
    dataSettings,
    latestPrice = 0,
    currentStops = null,
    simulationIndex = 0
  } = useIndicatorsStore();

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const handleUpdate = (updates: Partial<typeof indicatorSettings.stopLossIndicator>) => {
    setIndicatorSettings(prev => ({
      ...prev,
      stopLossIndicator: {
        ...prev.stopLossIndicator,
        ...updates
      }
    }));
  };

  const stops = currentStops;
  const lowerBandVal = (stops && stops.lowerBand && simulationIndex !== undefined) ? stops.lowerBand[simulationIndex] : undefined;
  const longSlPrice = lowerBandVal !== undefined ? getLongAtrStopLossPrice(lowerBandVal) : undefined;
  const assetType = (dataSettings?.asset as string) || 'gold';
  const slPipsDiff = (latestPrice > 0 && lowerBandVal !== undefined)
    ? getLongAtrStopLossDifferenceInPips(latestPrice, lowerBandVal, assetType)
    : undefined;

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-cyan-400">
          <ShieldAlert size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">Stop Loss Indicator</span>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-zinc-400" /> : <ChevronDown size={16} className="text-zinc-400" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-zinc-700/30 text-zinc-300 space-y-4">
              <p className="text-xs text-cyan-400/80 leading-relaxed max-w-2xl">
                Global settings for Stop Loss Indicator (ATR Bands), used to set dynamic stop losses for Long and Short trades.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Indicator Type:</span>
                  <select
                    value={indicatorSettings.stopLossIndicator.type || 'atr_bands'}
                    onChange={e => handleUpdate({ type: e.target.value as any })}
                    className="w-32 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                  >
                    <option value="atr_bands">Smooth ATR Bands</option>
                    <option value="last_n_candles">Last N Candle Low / High</option>
                  </select>
                </label>
                
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Data Source:</span>
                  <select
                    value={indicatorSettings.stopLossIndicator.dataSource}
                    onChange={e => handleUpdate({ dataSource: e.target.value as any })}
                    className="w-24 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                  >
                    <option value="alpha">Alpha</option>
                    <option value="beta">Beta</option>
                    <option value="delta">Delta</option>
                  </select>
                  <span className="text-cyan-500 font-bold ml-1">
                    {formatInterval(indicatorSettings.stopLossIndicator.dataSource === 'beta' ? betaInterval : indicatorSettings.stopLossIndicator.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                  </span>
                </label>
              </div>

              {/* SL ATR Box (Live Stop Loss Monitoring Box) */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5 uppercase font-mono tracking-wider">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
                    SL ATR Box
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <span>Period: <strong className="text-zinc-300">{indicatorSettings.stopLossIndicator.period}</strong></span>
                    <span>Mult: <strong className="text-zinc-300">{indicatorSettings.stopLossIndicator.multiplier}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-950/45 border border-zinc-800/40 p-2.5 rounded flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Price value where Long SL is right now</span>
                    <span className="font-mono text-zinc-200 font-bold text-sm">
                      {longSlPrice !== undefined ? `$${longSlPrice.toFixed(2)}` : 'Wait for indicator...'}
                    </span>
                  </div>

                  <div className="bg-zinc-950/45 border border-zinc-800/40 p-2.5 rounded flex flex-col gap-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Difference in pips from current close</span>
                    <span className="font-sans text-amber-400 font-bold text-sm">
                      <span className="font-mono">{slPipsDiff !== undefined ? `${slPipsDiff}` : 'Wait for indicator...'}</span>
                      {slPipsDiff !== undefined && <span className="text-[11px] text-zinc-400 font-normal ml-1">pips</span>}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-zinc-500 leading-snug">
                  * Note: The current close price of the candlestick chart represents the last candle's close price in simulation mode (${latestPrice ? latestPrice.toFixed(2) : '--'}).
                </div>
              </div>

              {indicatorSettings.stopLossIndicator.type === 'atr_bands' && (
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <label className="flex items-center gap-2 text-xs">
                    <span className="w-24">ATR Period:</span>
                    <input 
                      type="number" min="1" max="1000" 
                      value={indicatorSettings.stopLossIndicator.period} 
                      onChange={e => handleUpdate({ period: parseInt(e.target.value) || 1 })} 
                      className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                    />
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs">
                    <span className="w-24">Multiplier:</span>
                    <input 
                      type="number" step="0.1"
                      value={indicatorSettings.stopLossIndicator.multiplier} 
                      onChange={e => handleUpdate({ multiplier: parseFloat(e.target.value) || 0 })} 
                      className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                    />
                  </label>
                </div>
              )}

              {indicatorSettings.stopLossIndicator.type === 'last_n_candles' && (
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  <label className="flex items-center gap-2 text-xs">
                    <span className="w-24">Last N Period:</span>
                    <input 
                      type="number" min="1" max="1000" 
                      value={indicatorSettings.stopLossIndicator.lastNPeriod || 5} 
                      onChange={e => handleUpdate({ lastNPeriod: parseInt(e.target.value) || 1 })} 
                      className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                    />
                  </label>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-300">
                      <input 
                        type="checkbox" 
                        checked={indicatorSettings.stopLossIndicator.allowAtrOffset || false}
                        onChange={e => handleUpdate({ allowAtrOffset: e.target.checked })}
                        className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      Allow ATR Offset
                    </label>
                    {indicatorSettings.stopLossIndicator.allowAtrOffset && (
                       <label className="flex items-center gap-2 text-xs">
                         <span>Multiplier:</span>
                         <input 
                           type="number" step="0.1"
                           value={indicatorSettings.stopLossIndicator.atrOffsetMultiplier || 1.0} 
                           onChange={e => handleUpdate({ atrOffsetMultiplier: parseFloat(e.target.value) || 1.0 })} 
                           className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                         />
                       </label>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-300">
                      <input 
                        type="checkbox" 
                        checked={indicatorSettings.stopLossIndicator.allowFixedOffset || false}
                        onChange={e => handleUpdate({ allowFixedOffset: e.target.checked })}
                        className="rounded bg-zinc-800 border-zinc-700 text-cyan-500 focus:ring-cyan-500"
                      />
                      Fixed Offset (Pips)
                    </label>
                    {indicatorSettings.stopLossIndicator.allowFixedOffset && (
                       <input 
                         type="number" step="1"
                         value={indicatorSettings.stopLossIndicator.fixedOffsetPips ?? 10} 
                         onChange={e => handleUpdate({ fixedOffsetPips: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) })} 
                         className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                       />
                    )}
                  </div>
                </div>
              )}

              {/* Divider & Trailing SL Variant */}
              <div className="border-t border-zinc-700/30 pt-4">
                <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer font-medium hover:text-cyan-400 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={indicatorSettings.stopLossIndicator.allowDifferentTrailSlIndicator || false}
                    onChange={e => handleUpdate({ allowDifferentTrailSlIndicator: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                  />
                  Allow different variant of stop loss indicator for stop loss trail
                </label>
              </div>

              {indicatorSettings.stopLossIndicator.allowDifferentTrailSlIndicator && (
                <div className="bg-zinc-900/40 border border-zinc-805/50 rounded-lg p-4 space-y-4 overflow-hidden">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                    Trailing Stop Loss Indicator Configuration
                  </h4>

                  <div className="flex flex-wrap items-center gap-6">
                    <label className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-zinc-400">Indicator Type:</span>
                      <select
                        value={indicatorSettings.stopLossIndicator.trailType || 'atr_bands'}
                        onChange={e => handleUpdate({ trailType: e.target.value as any })}
                        className="w-32 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                      >
                        <option value="atr_bands">Smooth ATR Bands</option>
                        <option value="last_n_candles">Last N Candle Low / High</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-zinc-400">Data Source:</span>
                      <select
                        value={indicatorSettings.stopLossIndicator.trailDataSource || 'alpha'}
                        onChange={e => handleUpdate({ trailDataSource: e.target.value as any })}
                        className="w-24 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                      >
                        <option value="alpha">Alpha</option>
                        <option value="beta">Beta</option>
                        <option value="delta">Delta</option>
                      </select>
                      <span className="text-emerald-500 font-bold ml-1">
                        {formatInterval(
                          (indicatorSettings.stopLossIndicator.trailDataSource || 'alpha') === 'beta' 
                            ? betaInterval 
                            : (indicatorSettings.stopLossIndicator.trailDataSource || 'alpha') === 'delta' 
                              ? deltaInterval 
                              : alphaInterval
                        )}
                      </span>
                    </label>
                  </div>

                  {/* Render conditional inputs for Trail config */}
                  {(indicatorSettings.stopLossIndicator.trailType || 'atr_bands') === 'atr_bands' && (
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-zinc-400">ATR Period:</span>
                        <input 
                          type="number" min="1" max="1000" 
                          value={indicatorSettings.stopLossIndicator.trailPeriod ?? 14} 
                          onChange={e => handleUpdate({ trailPeriod: parseInt(e.target.value) || 1 })} 
                          className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                        />
                      </label>
                      
                      <label className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-zinc-400">Multiplier:</span>
                        <input 
                          type="number" step="0.1"
                          value={indicatorSettings.stopLossIndicator.trailMultiplier ?? 2.0} 
                          onChange={e => handleUpdate({ trailMultiplier: parseFloat(e.target.value) || 0 })} 
                          className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                        />
                      </label>
                    </div>
                  )}

                  {(indicatorSettings.stopLossIndicator.trailType || 'atr_bands') === 'last_n_candles' && (
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-zinc-400">Last N Period:</span>
                        <input 
                          type="number" min="1" max="1000" 
                          value={indicatorSettings.stopLossIndicator.trailLastNPeriod ?? 5} 
                          onChange={e => handleUpdate({ trailLastNPeriod: parseInt(e.target.value) || 1 })} 
                          className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                        />
                      </label>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-300">
                          <input 
                            type="checkbox" 
                            checked={indicatorSettings.stopLossIndicator.trailAllowAtrOffset || false}
                            onChange={e => handleUpdate({ trailAllowAtrOffset: e.target.checked })}
                            className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          Allow ATR Offset
                        </label>
                        {indicatorSettings.stopLossIndicator.trailAllowAtrOffset && (
                           <label className="flex items-center gap-2 text-xs">
                             <span className="text-zinc-400">Multiplier:</span>
                             <input 
                               type="number" step="0.1"
                               value={indicatorSettings.stopLossIndicator.trailAtrOffsetMultiplier ?? 1.0} 
                               onChange={e => handleUpdate({ trailAtrOffsetMultiplier: parseFloat(e.target.value) || 1.0 })} 
                               className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                             />
                           </label>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs cursor-pointer text-zinc-300">
                          <input 
                            type="checkbox" 
                            checked={indicatorSettings.stopLossIndicator.trailAllowFixedOffset || false}
                            onChange={e => handleUpdate({ trailAllowFixedOffset: e.target.checked })}
                            className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                          />
                          Fixed Offset (Pips)
                        </label>
                        {indicatorSettings.stopLossIndicator.trailAllowFixedOffset && (
                           <input 
                             type="number" step="1"
                             value={indicatorSettings.stopLossIndicator.trailFixedOffsetPips ?? 10} 
                             onChange={e => handleUpdate({ trailFixedOffsetPips: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) })} 
                             className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                           />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};