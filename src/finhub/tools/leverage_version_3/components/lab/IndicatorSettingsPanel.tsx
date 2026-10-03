import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore, IndicatorSettings } from '../../stores/indicators_store';
import { ToolTab } from './LabNavigation';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';
import { getBaseSystemId, getSystemLabelForDisplay, newNamesAfterReplication } from '../../functions/api/conjunctionSystem/selfReplicationLabelManage';
import { isReplicationPossible } from '../../functions/api/conjunctionSystem/selfReplicationFeature';
import { getSystemInstanceSettings } from '../../functions/api/classicSystem/systemInstanceSettings';

export const IndicatorSettingsPanel: React.FC<{ activeTab: ToolTab }> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { indicatorSettings, setIndicatorSettings, getIndicatorDescription, dataSettings, tradingConfig, setTradingConfig } = useIndicatorsStore();

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const handleUpdate = <K extends keyof IndicatorSettings>(key: K, updates: Partial<IndicatorSettings[K]>) => {
    setIndicatorSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  const renderNestedInputs = (tabId: string, sourceKey: 'alphaParams' | 'betaParams' | 'deltaParams' | 'default', defaults: any) => {
    let sourceSettings = defaults;
    if (sourceKey !== 'default') {
      sourceSettings = defaults[sourceKey] || defaults;
    }
    
    const handleChange = (updates: any) => {
      if (sourceKey === 'default') {
        handleUpdate(tabId as any, updates);
      } else {
        handleUpdate(tabId as any, { [sourceKey]: { ...defaults[sourceKey], ...updates } });
      }
    };

    const baseId = getBaseSystemId(tabId);
    switch (baseId) {
      case 'heikin_ashi_smoothed':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Smooth Len:</span>
              <input type="number" min="1" max="50" value={sourceSettings?.smoothLen || defaults.smoothLen || 10} onChange={e => handleChange({ smoothLen: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'ma_crossover':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Fast MA:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.fastMa || defaults.fastMa || 1} onChange={e => handleChange({ fastMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Slow MA:</span>
              <input type="number" min="1" max="200" value={sourceSettings?.slowMa || defaults.slowMa || 1} onChange={e => handleChange({ slowMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'stochastic':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.stochK || defaults.stochK || 1} onChange={e => handleChange({ stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={sourceSettings?.stochD || defaults.stochD || 1} onChange={e => handleChange({ stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'supertrend':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.period || defaults.period || 1} onChange={e => handleChange({ period: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Multiplier:</span>
              <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.multiplier || defaults.multiplier || 1} onChange={e => handleChange({ multiplier: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'divergence':
        return (
          <>
             <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.stochK || defaults.stochK || 1} onChange={e => handleChange({ stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={sourceSettings?.stochD || defaults.stochD || 1} onChange={e => handleChange({ stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'linear_regression':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Slope Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.slopePeriod || defaults.slopePeriod || 1} onChange={e => handleChange({ slopePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Vol Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.volPeriod || defaults.volPeriod || 1} onChange={e => handleChange({ volPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Regime Period:</span>
              <input type="number" min="1" max="200" value={sourceSettings?.regimePeriod || defaults.regimePeriod || 1} onChange={e => handleChange({ regimePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'bollinger_bands':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.period || defaults.period || 55} onChange={e => handleChange({ period: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Std Dev:</span>
              <input type="number" min="0.1" max="5" step="0.1" value={sourceSettings?.stdDev || defaults.stdDev || 1} onChange={e => handleChange({ stdDev: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'ichimoku':
      case 'three_candle_strike': {
        const fields = baseId === 'ichimoku'
          ? [['tenkanPeriod', 'Tenkan'], ['kijunPeriod', 'Kijun'], ['senkouBPeriod', 'Span B'], ['displacement', 'Displace']]
          : [['fastEma', 'Fast EMA'], ['fastSmma', 'Fast SMMA'], ['mediumSmma', 'Mid SMMA'], ['slowSmma', 'Slow SMMA'], ['regressionPeriod', 'Regression'], ['slopeSmooth', 'Slope EMA'], ['trendThreshold', 'Threshold']];
        return <div className="flex flex-wrap gap-3">{fields.map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-xs">
            <span>{label}:</span>
            <input type="number" min={key === 'trendThreshold' ? 0 : 1} step={key === 'trendThreshold' ? 0.001 : 1}
              value={sourceSettings?.[key] ?? defaults[key] ?? 1}
              onChange={e => handleChange({ [key]: Number(e.target.value) })}
              className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
          </label>
        ))}</div>;
      }
      case 'turtle_trading': {
        const fields = [['entryPeriod', 'Entry bars'], ['exitPeriod', 'Exit bars'], ['nPeriod', 'N bars'], ['stopMultiple', 'Stop × N']];
        return <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => handleChange({ entryPeriod: 20, exitPeriod: 10 })} className="px-2 py-1 rounded border border-zinc-700 text-xs text-cyan-300">20/10 channels</button>
          <button type="button" onClick={() => handleChange({ entryPeriod: 55, exitPeriod: 20 })} className="px-2 py-1 rounded border border-zinc-700 text-xs text-cyan-300">55/20 channels</button>
          {fields.map(([key, label]) => <label key={key} className="flex items-center gap-2 text-xs">
            <span>{label}:</span>
            <input type="number" min={key === 'stopMultiple' ? 0.1 : 1} step={key === 'stopMultiple' ? 0.1 : 1}
              value={sourceSettings?.[key] ?? defaults[key] ?? 1}
              onChange={e => handleChange({ [key]: Number(e.target.value) })}
              className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
          </label>)}
          <span className="text-[10px] text-zinc-500">Periods count chart candles. Use daily candles for the original day based rules. This channel variant omits the prior winner filter and unit pyramiding.</span>
        </div>;
      }
      case 'supertrend_regime':
        return (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20 col-span-1">ST Period:</span>
                <input type="number" min="1" max="100" value={sourceSettings?.stPeriod || defaults.stPeriod || 10} onChange={e => handleChange({ stPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">ATR Mult:</span>
                <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.atrMultiplier || defaults.atrMultiplier || 3} onChange={e => handleChange({ atrMultiplier: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Regime Per:</span>
                <input type="number" min="1" max="200" value={sourceSettings?.regimePeriod || defaults.regimePeriod || 30} onChange={e => handleChange({ regimePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Period:</span>
                <input type="number" min="1" max="200" value={sourceSettings?.zPeriod || defaults.zPeriod || 20} onChange={e => handleChange({ zPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Upper:</span>
                <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.zUpper || defaults.zUpper || 1.5} onChange={e => handleChange({ zUpper: parseFloat(e.target.value) || 1.5 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Lower:</span>
                <input type="number" min="-10" max="-0.1" step="0.1" value={sourceSettings?.zLower || defaults.zLower || -1.5} onChange={e => handleChange({ zLower: parseFloat(e.target.value) || -1.5 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
            </div>
          </div>
        );
      case 'candlestick_pattern':
        {
          const patterns = [
            { id: "bullish_marubozu", label: "Bullish Marubozu" },
            { id: "bearish_marubozu", label: "Bearish Marubozu" },
            { id: "bullish_hammer", label: "Bullish Hammer" },
            { id: "bullish_inverted_hammer", label: "Bullish Inverted Hammer" },
            { id: "bullish_engulfing", label: "Bullish Engulfing" },
            { id: "bearish_engulfing", label: "Bearish Engulfing" },
            { id: "bullish_harami", label: "Bullish Harami" },
            { id: "bearish_harami", label: "Bearish Harami" },
            { id: "bullish_piercing", label: "Bullish Piercing" },
            { id: "bearish_dark_cloud", label: "Bearish Dark Cloud" },
            { id: "ha_strong_bullish", label: "HA Strong Bullish" },
            { id: "ha_strong_bearish", label: "HA Strong Bearish" },
            { id: "ha_momentum_run", label: "HA Momentum Run" },
            { id: "ha_exhaustion", label: "HA Exhaustion" },
            { id: "doji_bullish_reversal", label: "Doji Bullish Reversal" },
            { id: "doji_bearish_reversal", label: "Doji Bearish Reversal" },
            { id: "doji_neutral", label: "Doji Neutral" }
          ];

          const allowed = sourceSettings?.allowedPatterns || {};

          const togglePattern = (pId: string) => {
            const currentVal = allowed[pId] !== false; // by default true
            const updated = {
              ...allowed,
              [pId]: !currentVal
            };
            handleChange({ allowedPatterns: updated });
          };

          const setAll = (status: boolean) => {
            const updated: Record<string, boolean> = {};
            patterns.forEach(p => {
              updated[p.id] = status;
            });
            handleChange({ allowedPatterns: updated });
          };

          return (
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-semibold text-zinc-400 font-mono">Allowed Candlestick Patterns:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAll(true)}
                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] rounded border border-zinc-700 cursor-pointer font-bold uppercase transition"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setAll(false)}
                    className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] rounded border border-zinc-700 cursor-pointer font-bold uppercase transition"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {patterns.map(p => {
                  const checked = allowed[p.id] !== false;
                  return (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-zinc-300 hover:text-zinc-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePattern(p.id)}
                        className="accent-cyan-500 rounded bg-zinc-850 border-zinc-700 focus:ring-cyan-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        }
      default:
        return null;
    }
  };

  const renderInputs = (tabId: string) => {
    const currentSettings = getSystemInstanceSettings(indicatorSettings, tabId);
    
    const allowVariation = currentSettings?.allowVariation || false;

    if (!allowVariation) {
      return renderNestedInputs(tabId, 'default', currentSettings);
    }

    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-cyan-500 mb-2">Alpha Layer Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs(tabId, 'alphaParams', currentSettings)}</div>
        </div>
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-purple-500 mb-2">Beta Aggregate Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs(tabId, 'betaParams', currentSettings)}</div>
        </div>
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-emerald-500 mb-2">Delta Layer Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs(tabId, 'deltaParams', currentSettings)}</div>
        </div>
      </div>
    );
  };

  const titleMap: Record<ToolTab, string> = {
    ma_crossover: 'Moving Average Crossover',
    stochastic: 'Stochastic Momentum Crossover',
    supertrend: 'Supertrend Trend-Following',
    divergence: 'Stochastic Divergences',
    linear_regression: 'Linear Regression System',
    bollinger_bands: 'Bollinger Bands Breakout',
    ichimoku: 'Ichimoku',
    three_candle_strike: '3 Candle Strike',
    turtle_trading: 'Turtle Trading',
    supertrend_regime: 'Hybrid Supertrend Regime',
    heikin_ashi_smoothed: 'Smoothed Heikin Ashi',
    candlestick_pattern: 'Candlestick Pattern',
    conjunction: 'Conjunction System',
    disjunction: 'Disjunction System'
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-cyan-400">
          <Settings2 size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">{titleMap[activeTab]}</span>
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
                {getIndicatorDescription(activeTab as any)}
              </p>
              
              <div className="flex flex-col gap-4">
                {activeTab !== 'conjunction' && activeTab !== 'disjunction' && (
                  <div className="flex flex-wrap items-center gap-6 mb-2">
                    <label className="flex items-center gap-2 text-xs">
                      <span className="text-amber-400 font-semibold uppercase">General Entry Signal Data Source:</span>
                      <select
                        value={tradingConfig.entrySignalSource || 'alpha'}
                        onChange={(e) => setTradingConfig(prev => ({ ...prev, entrySignalSource: e.target.value as any }))}
                        className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                      >
                        <option value="alpha">Alpha Base</option>
                        <option value="beta">Beta Aggregate</option>
                        <option value="delta">Delta Layer</option>
                      </select>
                      <span className="text-cyan-500 font-bold ml-1">
                        {formatInterval(tradingConfig.entrySignalSource === 'beta' ? betaInterval : tradingConfig.entrySignalSource === 'delta' ? deltaInterval : alphaInterval)}
                      </span>
                    </label>
                  </div>
                )}

                {activeTab === 'conjunction' ? (
                  <div className="flex flex-col gap-6 w-full">
                    <div className="text-xs text-purple-300/80 mb-2">
                      {(tradingConfig.activeConjunctionSystems || []).length === 0 ? 
                        "No systems selected. Please select up to 3 systems in Configuration Panel." : 
                        `Using ${tradingConfig.activeConjunctionSystems?.length} system(s) in conjunction.`}
                    </div>
                    {(tradingConfig.activeConjunctionSystems || []).map((sysId: string) => {
                      const baseId = getBaseSystemId(sysId);
                      return (
                      <div key={sysId} className="border border-purple-500/30 bg-purple-900/5 p-4 rounded-lg relative">
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => {
                              setTradingConfig(prev => ({
                                ...prev,
                                activeConjunctionSystems: (prev.activeConjunctionSystems || []).filter(id => id !== sysId)
                              }));
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Remove this strategy"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mb-3 pr-6">
                          <div className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                            {getSystemLabelForDisplay(titleMap[baseId as ToolTab] || baseId, sysId)}
                          </div>
                          {isReplicationPossible(baseId, tradingConfig.activeConjunctionSystems || []) && (
                            <button 
                              onClick={() => {
                                const newName = newNamesAfterReplication(baseId, tradingConfig.activeConjunctionSystems || []);
                                if (newName) {
                                  setTradingConfig(prev => ({
                                    ...prev,
                                    activeConjunctionSystems: [...(prev.activeConjunctionSystems || []), newName]
                                  }));
                                }
                              }}
                              className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-[10px] rounded border border-purple-500/30 font-bold uppercase tracking-wider"
                            >
                              Replicate
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 mb-4">
                           <label className="flex items-center gap-2 text-xs">
                             <span className="text-amber-400 font-semibold uppercase">Entry Signal Source:</span>
                             <select
                               value={(indicatorSettings[sysId as keyof IndicatorSettings] as any)?.entrySignalSource || 'alpha'}
                               onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { entrySignalSource: e.target.value as any })}
                               className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                             >
                               <option value="alpha">Alpha Base</option>
                               <option value="beta">Beta Aggregate</option>
                               <option value="delta">Delta Layer</option>
                             </select>
                             <span className="text-cyan-500 font-bold ml-1">
                               {formatInterval((indicatorSettings[sysId as keyof IndicatorSettings] as any)?.entrySignalSource === 'beta' ? betaInterval : (indicatorSettings[sysId as keyof IndicatorSettings] as any)?.entrySignalSource === 'delta' ? deltaInterval : alphaInterval)}
                             </span>
                           </label>
                           
                          <label className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-400">Strategy Config Source:</span>
                            <select
                              value={(indicatorSettings[sysId as keyof IndicatorSettings] as any)?.dataSource || 'alpha'}
                              onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { dataSource: e.target.value as any })}
                              className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                            >
                              <option value="alpha">Alpha Base</option>
                              <option value="beta">Beta Aggregate</option>
                              <option value="delta">Delta Layer</option>
                            </select>
                            <span className="text-cyan-500 font-bold ml-1">
                              {formatInterval((indicatorSettings[sysId as keyof IndicatorSettings] as any)?.dataSource === 'beta' ? betaInterval : (indicatorSettings[sysId as keyof IndicatorSettings] as any)?.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                            </span>
                          </label>
                          <label className="flex items-center gap-2 text-xs cursor-pointer select-none border border-zinc-700/50 bg-zinc-900/30 px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={(indicatorSettings[sysId as keyof IndicatorSettings] as any)?.allowVariation || false}
                              onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { allowVariation: e.target.checked })}
                              className="accent-cyan-500 rounded bg-zinc-800 border-zinc-700"
                            />
                            <span className="text-zinc-300">Variation of source parameters</span>
                          </label>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                          {renderInputs(sysId)}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : activeTab === 'disjunction' ? (
                  <div className="flex flex-col gap-6 w-full">
                    <div className="text-xs text-orange-300/80 mb-2">
                      {(tradingConfig.activeDisjunctionSystems || []).length === 0 ? 
                        "No systems selected. Please select systems in Configuration Panel." : 
                        `Using ${(tradingConfig.activeDisjunctionSystems || []).length} system(s) in disjunction.`}
                    </div>
                    {(tradingConfig.activeDisjunctionSystems || []).map((sysId: string) => {
                      const baseId = getBaseSystemId(sysId);
                      const systemSettings = getSystemInstanceSettings(indicatorSettings, sysId);
                      return (
                      <div key={sysId} className="border border-orange-500/30 bg-orange-900/5 p-4 rounded-lg relative">
                        <div className="absolute top-2 right-2">
                          <button 
                            onClick={() => {
                              setTradingConfig(prev => ({
                                ...prev,
                                activeDisjunctionSystems: (prev.activeDisjunctionSystems || []).filter(id => id !== sysId)
                              }));
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Remove this strategy"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </button>
                        </div>
                        <div className="flex justify-between items-center mb-3 pr-6">
                          <div className="text-sm font-bold text-orange-400 uppercase tracking-wider">
                            {getSystemLabelForDisplay(titleMap[baseId as ToolTab] || baseId, sysId)}
                          </div>
                          {isReplicationPossible(baseId, tradingConfig.activeDisjunctionSystems || []) && (
                            <button 
                              onClick={() => {
                                const newName = newNamesAfterReplication(baseId, tradingConfig.activeDisjunctionSystems || []);
                                if (newName) {
                                  setTradingConfig(prev => ({
                                    ...prev,
                                    activeDisjunctionSystems: [...(prev.activeDisjunctionSystems || []), newName]
                                  }));
                                }
                              }}
                              className="px-2 py-1 bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 text-[10px] rounded border border-orange-500/30 font-bold uppercase tracking-wider"
                            >
                              Replicate
                            </button>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-6 mb-4">
                           <label className="flex items-center gap-2 text-xs">
                             <span className="text-amber-400 font-semibold uppercase">Entry Signal Source:</span>
                             <select
                               value={systemSettings.entrySignalSource || systemSettings.dataSource || tradingConfig.entrySignalSource || 'alpha'}
                               onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { entrySignalSource: e.target.value as any })}
                               className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                             >
                               <option value="alpha">Alpha Base</option>
                               <option value="beta">Beta Aggregate</option>
                               <option value="delta">Delta Layer</option>
                             </select>
                             <span className="text-cyan-500 font-bold ml-1">
                               {formatInterval((systemSettings.entrySignalSource || systemSettings.dataSource || tradingConfig.entrySignalSource) === 'beta' ? betaInterval : (systemSettings.entrySignalSource || systemSettings.dataSource || tradingConfig.entrySignalSource) === 'delta' ? deltaInterval : alphaInterval)}
                             </span>
                           </label>
                           
                          <label className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-400">Strategy Config Source:</span>
                            <select
                              value={systemSettings.dataSource || 'alpha'}
                              onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { dataSource: e.target.value as any })}
                              className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                            >
                              <option value="alpha">Alpha Base</option>
                              <option value="beta">Beta Aggregate</option>
                              <option value="delta">Delta Layer</option>
                            </select>
                            <span className="text-cyan-500 font-bold ml-1">
                              {formatInterval(systemSettings.dataSource === 'beta' ? betaInterval : systemSettings.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                            </span>
                          </label>
                          <label className="flex items-center gap-2 text-xs cursor-pointer select-none border border-zinc-700/50 bg-zinc-900/30 px-2 py-1 rounded">
                            <input
                              type="checkbox"
                              checked={!!systemSettings.allowVariation}
                              onChange={(e) => handleUpdate(sysId as keyof IndicatorSettings, { allowVariation: e.target.checked })}
                              className="accent-cyan-500 rounded bg-zinc-800 border-zinc-700"
                            />
                            <span className="text-zinc-300">Variation of source parameters</span>
                          </label>
                        </div>
                        <div className="flex flex-wrap items-center gap-6">
                          {renderInputs(sysId)}
                        </div>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-6 mb-2">
                      <label className="flex items-center gap-2 text-xs">
                        <span className="text-zinc-400">Strategy Config Source:</span>
                        <select
                          value={(indicatorSettings[activeTab as keyof IndicatorSettings] as any)?.dataSource || 'alpha'}
                          onChange={(e) => handleUpdate(activeTab as keyof IndicatorSettings, { dataSource: e.target.value as any })}
                          className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                        >
                          <option value="alpha">Alpha Base</option>
                          <option value="beta">Beta Aggregate</option>
                          <option value="delta">Delta Layer</option>
                        </select>
                        <span className="text-cyan-500 font-bold ml-1">
                          {formatInterval((indicatorSettings[activeTab as keyof IndicatorSettings] as any)?.dataSource === 'beta' ? betaInterval : (indicatorSettings[activeTab as keyof IndicatorSettings] as any)?.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                        </span>
                      </label>
                      
                      <label className="flex items-center gap-2 text-xs cursor-pointer select-none border border-zinc-700/50 bg-zinc-900/30 px-2 py-1 rounded">
                        <input
                          type="checkbox"
                          checked={(indicatorSettings[activeTab as keyof IndicatorSettings] as any)?.allowVariation || false}
                          onChange={(e) => handleUpdate(activeTab as keyof IndicatorSettings, { allowVariation: e.target.checked })}
                          className="accent-cyan-500 rounded bg-zinc-800 border-zinc-700"
                        />
                        <span className="text-zinc-300">Variation of source parameters</span>
                      </label>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6">
                      {renderInputs(activeTab as string)}
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
