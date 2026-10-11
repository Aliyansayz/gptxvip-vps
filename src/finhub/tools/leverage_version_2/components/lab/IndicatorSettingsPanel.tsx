import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore, IndicatorSettings } from '../../stores/indicators_store';
import { ToolTab } from './LabNavigation';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';

export const IndicatorSettingsPanel: React.FC<{ activeTab: ToolTab }> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { indicatorSettings, setIndicatorSettings, getIndicatorDescription, dataSettings } = useIndicatorsStore();

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

  const renderNestedInputs = (sourceKey: 'alphaParams' | 'betaParams' | 'deltaParams' | 'default', defaults: any) => {
    let sourceSettings = defaults;
    if (sourceKey !== 'default') {
      sourceSettings = defaults[sourceKey] || defaults;
    }
    
    const handleChange = (updates: any) => {
      if (sourceKey === 'default') {
        handleUpdate(activeTab as any, updates);
      } else {
        handleUpdate(activeTab as any, { [sourceKey]: { ...defaults[sourceKey], ...updates } });
      }
    };

    switch (activeTab) {
      case 'ma_crossover':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Fast MA:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.fastMa ?? defaults.fastMa} onChange={e => handleChange({ fastMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Slow MA:</span>
              <input type="number" min="1" max="200" value={sourceSettings?.slowMa ?? defaults.slowMa} onChange={e => handleChange({ slowMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'stochastic':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.stochK ?? defaults.stochK} onChange={e => handleChange({ stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={sourceSettings?.stochD ?? defaults.stochD} onChange={e => handleChange({ stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'supertrend':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.period ?? defaults.period} onChange={e => handleChange({ period: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Multiplier:</span>
              <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.multiplier ?? defaults.multiplier} onChange={e => handleChange({ multiplier: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'divergence':
        return (
          <>
             <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.stochK ?? defaults.stochK} onChange={e => handleChange({ stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={sourceSettings?.stochD ?? defaults.stochD} onChange={e => handleChange({ stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'linear_regression':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Slope Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.slopePeriod ?? defaults.slopePeriod} onChange={e => handleChange({ slopePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Vol Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.volPeriod ?? defaults.volPeriod} onChange={e => handleChange({ volPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Regime Period:</span>
              <input type="number" min="1" max="200" value={sourceSettings?.regimePeriod ?? defaults.regimePeriod} onChange={e => handleChange({ regimePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'bollinger_bands':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Period:</span>
              <input type="number" min="1" max="100" value={sourceSettings?.period ?? defaults.period ?? 20} onChange={e => handleChange({ period: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Std Dev:</span>
              <input type="number" min="0.1" max="5" step="0.1" value={sourceSettings?.stdDev ?? defaults.stdDev ?? 2} onChange={e => handleChange({ stdDev: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'supertrend_regime':
        return (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20 col-span-1">ST Period:</span>
                <input type="number" min="1" max="100" value={sourceSettings?.stPeriod ?? defaults.stPeriod ?? 10} onChange={e => handleChange({ stPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">ATR Mult:</span>
                <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.atrMultiplier ?? defaults.atrMultiplier ?? 3} onChange={e => handleChange({ atrMultiplier: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Regime Per:</span>
                <input type="number" min="1" max="200" value={sourceSettings?.regimePeriod ?? defaults.regimePeriod ?? 30} onChange={e => handleChange({ regimePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Period:</span>
                <input type="number" min="1" max="200" value={sourceSettings?.zPeriod ?? defaults.zPeriod ?? 20} onChange={e => handleChange({ zPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Upper:</span>
                <input type="number" min="0.1" max="10" step="0.1" value={sourceSettings?.zUpper ?? defaults.zUpper ?? 1.5} onChange={e => handleChange({ zUpper: parseFloat(e.target.value) || 1.5 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
              <label className="flex items-center gap-2 text-xs">
                <span className="w-20">Z Lower:</span>
                <input type="number" min="-10" max="-0.1" step="0.1" value={sourceSettings?.zLower ?? defaults.zLower ?? -1.5} onChange={e => handleChange({ zLower: parseFloat(e.target.value) || -1.5 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderInputs = () => {
    const currentSettings = indicatorSettings[activeTab as keyof IndicatorSettings] as any;
    const allowVariation = currentSettings?.allowVariation || false;

    if (!allowVariation) {
      return renderNestedInputs('default', currentSettings);
    }

    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-cyan-500 mb-2">Alpha Layer Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs('alphaParams', currentSettings)}</div>
        </div>
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-purple-500 mb-2">Beta Aggregate Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs('betaParams', currentSettings)}</div>
        </div>
        <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-700/50">
          <div className="text-xs font-semibold text-emerald-500 mb-2">Delta Layer Parameters</div>
          <div className="flex flex-wrap items-center gap-4">{renderNestedInputs('deltaParams', currentSettings)}</div>
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
    bollinger_bands: 'Bollinger Bands Reversion',
    supertrend_regime: 'Hybrid Supertrend Regime'
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
                {getIndicatorDescription(activeTab)}
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-6 mb-2">
                  <label className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-400">Strategy Focus Source:</span>
                    <select
                      value={(indicatorSettings[activeTab] as any)?.dataSource || 'alpha'}
                      onChange={(e) => handleUpdate(activeTab, { dataSource: e.target.value as any })}
                      className="bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                    >
                      <option value="alpha">Alpha Base</option>
                      <option value="beta">Beta Aggregate</option>
                      <option value="delta">Delta Layer</option>
                    </select>
                    <span className="text-cyan-500 font-bold ml-1">
                      {formatInterval((indicatorSettings[activeTab] as any)?.dataSource === 'beta' ? betaInterval : (indicatorSettings[activeTab] as any)?.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none border border-zinc-700/50 bg-zinc-900/30 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={(indicatorSettings[activeTab] as any)?.allowVariation || false}
                      onChange={(e) => handleUpdate(activeTab, { allowVariation: e.target.checked })}
                      className="accent-cyan-500 rounded bg-zinc-800 border-zinc-700"
                    />
                    <span className="text-zinc-300">Variation of source parameters</span>
                  </label>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                  {renderInputs()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
