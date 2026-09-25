import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';

export const StopLossIndicatorSettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { indicatorSettings, setIndicatorSettings } = useIndicatorsStore();

  const handleUpdate = (updates: Partial<typeof indicatorSettings.stopLossIndicator>) => {
    setIndicatorSettings(prev => ({
      ...prev,
      stopLossIndicator: {
        ...prev.stopLossIndicator,
        ...updates
      }
    }));
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4">
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
                </label>

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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};