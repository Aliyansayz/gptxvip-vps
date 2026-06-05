import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { activeClassicSystems } from '../../functions/api/classicSystem/classicsystemController';

export const ExitSignalRuleSettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();

  const handleUpdate = (updates: Partial<typeof tradingConfig>) => {
    setTradingConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const activeExitSystem = activeClassicSystems.find(s => s.id === tradingConfig.exitSignalSystemType);

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-rose-400">
          <LogOut size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider">Exit Signal Rule</span>
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
                Configure a separate system to generate exit signals independently from the entry signal system.
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  type="button" 
                  onClick={() => {
                    const checked = !tradingConfig.useDifferentSignalSystemOnExit;
                    handleUpdate({ 
                      useDifferentSignalSystemOnExit: checked,
                      exitSignalSystemType: checked ? (activeClassicSystems[0].id as any) : undefined,
                      exitSignalSystemParams: checked ? { ...activeClassicSystems[0].defaultNumericalInputs } : undefined
                    });
                  }}
                  className="flex items-center gap-2 text-sm text-zinc-200 hover:text-rose-300 transition-colors self-start"
                >
                  {tradingConfig.useDifferentSignalSystemOnExit ? 
                    <CheckSquare size={16} className="text-rose-500" /> : 
                    <Square size={16} className="text-zinc-500" />
                  }
                  <span>Use different signal system on exit</span>
                </button>

                {tradingConfig.useDifferentSignalSystemOnExit && (
                  <div className="flex flex-col gap-3 pl-6 border-l-2 border-rose-900/30 ml-2 py-1">
                    <label className="flex items-center gap-3 text-xs">
                      <span className="w-24 text-zinc-400">System Source:</span>
                      <select 
                        value={tradingConfig.exitSignalSystemType || ''}
                        onChange={(e) => {
                          const newSystem = activeClassicSystems.find(s => s.id === e.target.value);
                          handleUpdate({ 
                            exitSignalSystemType: e.target.value as any,
                            exitSignalSystemParams: newSystem ? { ...newSystem.defaultNumericalInputs } : {}
                          });
                        }}
                        className="bg-zinc-900/80 border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-200 w-48 focus:border-rose-500/50 focus:outline-none"
                      >
                        <optgroup label="Classic Systems">
                          {activeClassicSystems.map(system => (
                            <option key={system.id} value={system.id}>{system.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </label>

                    {activeExitSystem && tradingConfig.exitSignalSystemParams && (
                      <div className="grid grid-cols-2 gap-3 mt-2 bg-zinc-900/30 p-3 rounded-md border border-zinc-800/50">
                        <div className="col-span-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{activeExitSystem.name} Parameters</span>
                        </div>
                        {Object.keys(activeExitSystem.defaultNumericalInputs).map(paramKey => (
                           <label key={paramKey} className="flex flex-col gap-1.5 text-xs">
                             <span className="text-zinc-400 capitalize">{paramKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                             <input 
                                type="number"
                                value={tradingConfig.exitSignalSystemParams![paramKey] || ''}
                                onChange={(e) => {
                                  handleUpdate({
                                    exitSignalSystemParams: {
                                      ...tradingConfig.exitSignalSystemParams,
                                      [paramKey]: parseFloat(e.target.value) || 0
                                    }
                                  });
                                }}
                                className="bg-zinc-900 border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-200 w-full focus:border-rose-500/50 focus:outline-none"
                             />
                           </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
