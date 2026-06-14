import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';

export const TrendStrengthSettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { indicatorSettings, setIndicatorSettings, dataSettings } = useIndicatorsStore();

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const handleUpdate = (updates: Partial<typeof indicatorSettings.trendStrength>) => {
    setIndicatorSettings(prev => ({
      ...prev,
      trendStrength: {
        ...prev.trendStrength,
        ...updates
      }
    }));
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-rose-400">
          <Layers size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">Trend Strength</span>
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
              <p className="text-xs text-rose-400/80 leading-relaxed max-w-2xl">
                Global settings for the Trend Strength indicator, which measures momentum and slope to identify market direction.
              </p>
              
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Data Source:</span>
                  <select
                    value={indicatorSettings.trendStrength.dataSource}
                    onChange={e => handleUpdate({ dataSource: e.target.value as any })}
                    className="w-24 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300"
                  >
                    <option value="alpha">Alpha</option>
                    <option value="beta">Beta</option>
                    <option value="delta">Delta</option>
                  </select>
                  <span className="text-cyan-500 font-bold ml-1">
                    {formatInterval(indicatorSettings.trendStrength.dataSource === 'beta' ? betaInterval : indicatorSettings.trendStrength.dataSource === 'delta' ? deltaInterval : alphaInterval)}
                  </span>
                </label>

                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Slope Period:</span>
                  <input 
                    type="number" min="1" max="1000" 
                    value={indicatorSettings.trendStrength.slopePeriod || 20} 
                    onChange={e => handleUpdate({ slopePeriod: parseInt(e.target.value) || 1 })} 
                    className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                  />
                </label>
                
                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Vol Period:</span>
                  <input 
                    type="number" min="1" max="1000" 
                    value={indicatorSettings.trendStrength.volPeriod || 20} 
                    onChange={e => handleUpdate({ volPeriod: parseInt(e.target.value) || 1 })} 
                    className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                  />
                </label>

                <label className="flex items-center gap-2 text-xs">
                  <span className="w-24">Regime Period:</span>
                  <input 
                    type="number" min="1" max="1000" 
                    value={indicatorSettings.trendStrength.regimePeriod || 30} 
                    onChange={e => handleUpdate({ regimePeriod: parseInt(e.target.value) || 1 })} 
                    className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" 
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
