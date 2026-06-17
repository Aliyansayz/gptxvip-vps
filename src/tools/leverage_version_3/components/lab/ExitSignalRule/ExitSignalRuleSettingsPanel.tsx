import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { useIndicatorsStore, IndicatorSettings } from '../../../stores/indicators_store';
import { activeClassicSystems } from '../../../functions/api/classicSystem/classicsystemController';

interface ExitSignalRuleSettingsPanelProps {
  entrySystemType?: string;
}

export const ExitSignalRuleSettingsPanel: React.FC<ExitSignalRuleSettingsPanelProps> = ({ entrySystemType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { tradingConfig, setTradingConfig, indicatorSettings, setIndicatorSettings } = useIndicatorsStore();

  useEffect(() => {
    // Default to classic if not set
    if (tradingConfig.useDifferentSignalSystemOnExit && !tradingConfig.exitSignalSystemMode) {
      setTradingConfig(prev => ({ ...prev, exitSignalSystemMode: 'classic' }));
    }
  }, [tradingConfig.useDifferentSignalSystemOnExit, tradingConfig.exitSignalSystemMode, setTradingConfig]);

  const handleUpdate = (updates: Partial<typeof tradingConfig>) => {
    setTradingConfig(prev => ({
      ...prev,
      ...updates
    }));
  };

  const activeExitSystem = activeClassicSystems.find(s => s.id === tradingConfig.exitSignalSystemType);
  const isClassicMatchedWithEntry = tradingConfig.exitSignalSystemMode === 'classic' && tradingConfig.exitSignalSystemType === entrySystemType;

  const getBaseId = (sysId: string) => sysId.replace('_alpha', '').replace('_beta', '').replace('_delta', '');

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
                      exitSignalSystemMode: checked ? 'classic' : undefined,
                      exitSignalSystemType: checked ? (activeClassicSystems[0].id as any) : undefined,
                      exitSignalSystemParams: checked ? { ...activeClassicSystems[0].defaultNumericalInputs } : undefined,
                      exitActiveConjunctionSystems: checked ? [] : undefined
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
                  <div className="flex flex-col gap-4 pl-6 border-l-2 border-rose-900/30 ml-2 py-2 mt-2">
                    <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                      <button 
                         onClick={() => handleUpdate({ exitSignalSystemMode: 'classic' })}
                         className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors tracking-widest ${tradingConfig.exitSignalSystemMode === 'classic' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-transparent'}`}
                      >Classic System Mode</button>
                      <button 
                         onClick={() => handleUpdate({ exitSignalSystemMode: 'conjunction' })}
                         className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-colors tracking-widest ${tradingConfig.exitSignalSystemMode === 'conjunction' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 border border-transparent'}`}
                      >Conjunction System Mode</button>
                    </div>

                    {tradingConfig.exitSignalSystemMode === 'classic' && (
                      <div className="flex flex-col gap-3">
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
                        <label className="flex items-center gap-3 text-xs">
                          <span className="w-24 text-zinc-400">Data Source:</span>
                          <select 
                            value={tradingConfig.exitSignalSource || 'alpha'}
                            onChange={(e) => handleUpdate({ exitSignalSource: e.target.value as any })}
                            className="bg-zinc-900/80 border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-200 w-48 focus:border-rose-500/50 focus:outline-none"
                          >
                            <option value="alpha">Alpha Base</option>
                            <option value="beta">Beta Aggregate</option>
                            <option value="delta">Delta Layer</option>
                          </select>
                        </label>

                        {/* Parameter Sourcing Toggle or Warn Matching Entry */}
                        {isClassicMatchedWithEntry ? (
                          <div className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded p-3 text-xs leading-relaxed max-w-lg mt-2">
                            Matched with entry rule&apos;s active system. Parameters are <strong>permanently synchronized</strong> with the entry settings.
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 mt-1 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Parameter Sourcing</span>
                            <div className="flex flex-col sm:flex-row gap-3 mt-1">
                              <button 
                                type="button"
                                onClick={() => handleUpdate({ exitUseExplicitParams: false })}
                                className={`flex-1 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${!tradingConfig.exitUseExplicitParams ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/80 hover:text-zinc-300'}`}
                              >
                                <div className={`w-2 h-2 rounded-full ${!tradingConfig.exitUseExplicitParams ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-zinc-700'}`} />
                                Sync with Entry Values
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleUpdate({ exitUseExplicitParams: true })}
                                className={`flex-1 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${tradingConfig.exitUseExplicitParams ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/80 hover:text-zinc-300'}`}
                              >
                                <div className={`w-2 h-2 rounded-full ${tradingConfig.exitUseExplicitParams ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-zinc-700'}`} />
                                Explicit Parameters
                              </button>
                            </div>
                          </div>
                        )}

                        {!isClassicMatchedWithEntry && !tradingConfig.exitUseExplicitParams && activeExitSystem && (
                          <div className="bg-zinc-900/20 text-zinc-400 text-xs py-2 px-3 rounded border border-zinc-800/50 italic flex items-center gap-2 mt-1">
                            <CheckSquare size={13} className="text-cyan-500/80 shrink-0" />
                            Parameters are synchronized with the entry settings of {activeExitSystem.name}.
                          </div>
                        )}

                        {(!isClassicMatchedWithEntry && tradingConfig.exitUseExplicitParams && activeExitSystem && tradingConfig.exitSignalSystemParams) ? (
                          <div className="grid grid-cols-2 gap-3 mt-2 bg-zinc-900/30 p-3 rounded-md border border-zinc-800/50 animate-fade-in">
                            <div className="col-span-2 mb-1">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-rose-400">{activeExitSystem.name} Explicit Parameters</span>
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
                        ) : null}
                      </div>
                    )}

                    {tradingConfig.exitSignalSystemMode === 'conjunction' && (
                      <div className="flex flex-col gap-3">
                        {/* Parameter sourcing choice for conjunction */}
                        <div className="flex flex-col gap-2 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Conjunction Parameters Sourcing</span>
                          <div className="flex flex-col sm:flex-row gap-3 mt-1">
                            <button 
                              type="button"
                              onClick={() => handleUpdate({ exitUseExplicitParams: false })}
                              className={`flex-1 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${!tradingConfig.exitUseExplicitParams ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/80 hover:text-zinc-300'}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${!tradingConfig.exitUseExplicitParams ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]' : 'bg-zinc-700'}`} />
                              Sync with Entry Values
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleUpdate({ exitUseExplicitParams: true })}
                              className={`flex-1 py-2 px-3 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${tradingConfig.exitUseExplicitParams ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-zinc-900/50 text-zinc-500 border-zinc-800/80 hover:text-zinc-300'}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${tradingConfig.exitUseExplicitParams ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-zinc-700'}`} />
                              Explicit Parameters
                            </button>
                          </div>
                        </div>

                        <span className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Select Up to 3 Systems:</span>
                        {[0, 1, 2].map((index) => {
                          const currentSystems = tradingConfig.exitActiveConjunctionSystems || [];
                          const val = currentSystems[index] || '';
                          const baseId = getBaseId(val);
                          return (
                            <div key={index} className="flex flex-col gap-2 p-2 border border-zinc-800/50 rounded bg-zinc-900/20">
                              <label className="flex items-center gap-3 text-xs">
                                <span className="w-24 text-zinc-400">System #{index + 1}:</span>
                                <select 
                                  value={val}
                                  onChange={(e) => {
                                    const newVal = e.target.value;
                                    let newSystems = [...currentSystems];
                                    if (newVal === '') {
                                      newSystems.splice(index, 1);
                                    } else {
                                      newSystems[index] = newVal;
                                    }
                                    // Clean up array
                                    newSystems = newSystems.filter(v => v !== '');
                                    handleUpdate({ exitActiveConjunctionSystems: newSystems });
                                  }}
                                  className="bg-zinc-900/80 border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-200 w-48 focus:border-rose-500/50 focus:outline-none"
                                >
                                  <option value="">-- None --</option>
                                  <optgroup label="Classic Systems">
                                    {activeClassicSystems.map(system => (
                                      <option key={system.id} value={system.id}>{system.name}</option>
                                    ))}
                                  </optgroup>
                                </select>
                              </label>
                              {val && (
                                <label className="flex items-center gap-3 text-xs">
                                  <span className="w-24 text-zinc-400">Data Source:</span>
                                  <select 
                                    value={(indicatorSettings[val as keyof IndicatorSettings] as any)?.exitSignalSource || 'alpha'}
                                    onChange={(e) => {
                                      setIndicatorSettings(prev => ({
                                        ...prev,
                                        [val]: {
                                          ...(prev as any)[val],
                                          exitSignalSource: e.target.value
                                        }
                                      }));
                                    }}
                                    className="bg-zinc-900/80 border border-zinc-700/50 rounded px-2 py-1.5 text-zinc-200 w-48 focus:border-rose-500/50 focus:outline-none"
                                  >
                                    <option value="alpha">Alpha Base</option>
                                    <option value="beta">Beta Aggregate</option>
                                    <option value="delta">Delta Layer</option>
                                  </select>
                                </label>
                              )}

                              {/* Custom Explicit parameters for this conjunction system */}
                              {val && tradingConfig.exitUseExplicitParams && (
                                <div className="mt-2 pl-3 border-l-2 border-rose-500/25 space-y-2 animate-fade-in">
                                  <div className="text-[10px] font-bold text-rose-400">Custom Parameters ({activeClassicSystems.find(s => s.id === baseId)?.name})</div>
                                  <div className="grid grid-cols-2 gap-3 bg-zinc-950/20 p-2 border border-zinc-800/40 rounded">
                                    {Object.keys(activeClassicSystems.find(s => s.id === baseId)?.defaultNumericalInputs || {}).map((paramKey) => {
                                      const baseSys = activeClassicSystems.find(s => s.id === baseId);
                                      const currentVal = tradingConfig.exitConjunctionParams?.[val]?.[paramKey] ?? baseSys?.defaultNumericalInputs[paramKey] ?? 0;
                                      return (
                                        <label key={paramKey} className="flex flex-col gap-1 text-[11px]">
                                          <span className="text-zinc-400 capitalize">{paramKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                                          <input 
                                            type="number"
                                            value={currentVal}
                                            onChange={(e) => {
                                              const typedVal = parseFloat(e.target.value) || 0;
                                              handleUpdate({
                                                exitConjunctionParams: {
                                                  ...tradingConfig.exitConjunctionParams,
                                                  [val]: {
                                                    ...(tradingConfig.exitConjunctionParams?.[val] || {}),
                                                    [paramKey]: typedVal
                                                  }
                                                }
                                              });
                                            }}
                                            className="bg-zinc-900 border border-zinc-800/80 rounded px-2 py-1 text-zinc-200 focus:border-rose-500/40 focus:outline-none w-full"
                                          />
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
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
