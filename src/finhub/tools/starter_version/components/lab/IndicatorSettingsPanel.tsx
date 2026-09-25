import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore, IndicatorSettings } from '../../stores/indicators_store';
import { ToolTab } from './LabNavigation';

export const IndicatorSettingsPanel: React.FC<{ activeTab: ToolTab }> = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { indicatorSettings, setIndicatorSettings, getIndicatorDescription } = useIndicatorsStore();

  const handleUpdate = <K extends keyof IndicatorSettings>(key: K, updates: Partial<IndicatorSettings[K]>) => {
    setIndicatorSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  const renderInputs = () => {
    switch (activeTab) {
      case 'ma_crossover':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Fast MA:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.ma_crossover.fastMa} onChange={e => handleUpdate('ma_crossover', { fastMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Slow MA:</span>
              <input type="number" min="1" max="200" value={indicatorSettings.ma_crossover.slowMa} onChange={e => handleUpdate('ma_crossover', { slowMa: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'stochastic':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.stochastic.stochK} onChange={e => handleUpdate('stochastic', { stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={indicatorSettings.stochastic.stochD} onChange={e => handleUpdate('stochastic', { stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'supertrend':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Period:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.supertrend.period} onChange={e => handleUpdate('supertrend', { period: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Multiplier:</span>
              <input type="number" min="0.1" max="10" step="0.1" value={indicatorSettings.supertrend.multiplier} onChange={e => handleUpdate('supertrend', { multiplier: parseFloat(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'divergence':
        return (
          <>
             <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %K:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.divergence.stochK} onChange={e => handleUpdate('divergence', { stochK: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-16">Stoch %D:</span>
              <input type="number" min="1" max="50" value={indicatorSettings.divergence.stochD} onChange={e => handleUpdate('divergence', { stochD: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      case 'linear_regression':
        return (
          <>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Slope Period:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.linear_regression.slopePeriod} onChange={e => handleUpdate('linear_regression', { slopePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Vol Period:</span>
              <input type="number" min="1" max="100" value={indicatorSettings.linear_regression.volPeriod} onChange={e => handleUpdate('linear_regression', { volPeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
            <label className="flex items-center gap-2 text-xs">
              <span className="w-20">Regime Period:</span>
              <input type="number" min="1" max="200" value={indicatorSettings.linear_regression.regimePeriod} onChange={e => handleUpdate('linear_regression', { regimePeriod: parseInt(e.target.value) || 1 })} className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300" />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  const titleMap: Record<ToolTab, string> = {
    ma_crossover: 'Moving Average Crossover',
    stochastic: 'Stochastic Momentum Crossover',
    supertrend: 'Supertrend Trend-Following',
    divergence: 'Stochastic Divergences',
    linear_regression: 'Linear Regression System'
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4">
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
              
              <div className="flex flex-wrap items-center gap-6">
                {renderInputs()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
