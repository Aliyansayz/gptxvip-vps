import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { getBaseInterval, formatInterval } from '../../functions/api/rules/dataSourceRules';

export const SmoothingIndicatorPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { heikinAshiSettings, setHeikinAshiSettings, dataSettings } = useIndicatorsStore();

  const alphaInterval = getBaseInterval(dataSettings.simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const handleUpdate = (updates: Partial<typeof heikinAshiSettings>) => {
    setHeikinAshiSettings(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-cyan-400">
          <Eye size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">Smoothing Indicator - Render Only</span>
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
            <div className="p-4 border-t border-zinc-700/30 text-zinc-300 space-y-4 font-mono">
              <p className="text-xs text-cyan-400/80 leading-relaxed max-w-2xl">
                Heikin Ashi Smoothing modifies the visual OHLC candlestick display on the chart and determines bullish/bearish styling according to the smoothed Heikin Ashi values. This is visual; it does NOT affect core trading systems or positions.
              </p>
              
              <div className="flex flex-col gap-4">
                {/* Checkboxes for each data source */}
                <div className="flex flex-wrap gap-6 items-center">
                  <span className="text-xs font-semibold text-zinc-400">Enable Heikin Ashi for:</span>
                  
                  <button 
                    onClick={() => handleUpdate({ alphaEnabled: !heikinAshiSettings.alphaEnabled })}
                    className="flex items-center gap-2 text-xs hover:text-cyan-400 transition-colors"
                  >
                    {heikinAshiSettings.alphaEnabled ? <CheckSquare size={16} className="text-cyan-400" /> : <Square size={16} className="text-zinc-500" />}
                    <span>Alpha <span className="text-zinc-500">({formatInterval(alphaInterval)})</span></span>
                  </button>

                  <button 
                    onClick={() => handleUpdate({ betaEnabled: !heikinAshiSettings.betaEnabled })}
                    className="flex items-center gap-2 text-xs hover:text-cyan-400 transition-colors"
                  >
                    {heikinAshiSettings.betaEnabled ? <CheckSquare size={16} className="text-cyan-400" /> : <Square size={16} className="text-zinc-500" />}
                    <span>Beta <span className="text-zinc-500">({formatInterval(betaInterval)})</span></span>
                  </button>

                  <button 
                    onClick={() => handleUpdate({ deltaEnabled: !heikinAshiSettings.deltaEnabled })}
                    className="flex items-center gap-2 text-xs hover:text-cyan-400 transition-colors"
                  >
                    {heikinAshiSettings.deltaEnabled ? <CheckSquare size={16} className="text-cyan-400" /> : <Square size={16} className="text-zinc-500" />}
                    <span>Delta <span className="text-zinc-500">({formatInterval(deltaInterval)})</span></span>
                  </button>
                </div>

                {/* Smoothing Length Input */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-24 text-zinc-400">Smoothing Length:</span>
                  <input 
                    type="number" min="1" max="100" 
                    value={heikinAshiSettings.smoothLen} 
                    onChange={e => handleUpdate({ smoothLen: Math.max(1, parseInt(e.target.value) || 1) })} 
                    className="w-16 bg-zinc-900/50 border border-zinc-700 rounded px-2 py-1 text-zinc-300 focus:outline-none focus:border-cyan-500" 
                  />
                  <span className="text-zinc-500">(1 = Raw Heikin Ashi, &gt;1 = Smoothed HA)</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
