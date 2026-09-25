import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useIndicatorsStore, IndicatorSettings } from '../../stores/indicators_store';
import { useTradingSlice } from '../../stores/useTradingSlice';

export interface IndicatorAndTradePreset {
  id: string;
  name: string;
  assetTarget?: string;
  config: {
    indicators: IndicatorSettings;
    tradeControl: any; // Using TradingRulesConfig type implies the entire trading setting
  };
}

export const CollapsiblePresetMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [presets, setPresets] = useState<IndicatorAndTradePreset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  
  const { indicatorSettings, setIndicatorSettings } = useIndicatorsStore();
  const { tradingConfig, setTradingConfig } = useTradingSlice();

  const loadPresets = () => {
    const stored = sessionStorage.getItem('leveragetrading_v3_presets');
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse presets", e);
      }
    }
  };

  useEffect(() => {
    // Load presets from sessionStorage on mount
    loadPresets();
    
    // Listen for cross-component reload
    const handleUpdate = () => loadPresets();
    window.addEventListener('leveragetrading:presets:updated', handleUpdate);
    return () => window.removeEventListener('leveragetrading:presets:updated', handleUpdate);
  }, []);

  const saveToSession = (newPresets: IndicatorAndTradePreset[]) => {
    setPresets(newPresets);
    sessionStorage.setItem('leveragetrading_v3_presets', JSON.stringify(newPresets));
  };

  const savePreset = () => {
    if (!newPresetName.trim()) return;
    
    // NOTE: In production scenario, we merge with existing presets.
    const newPreset: IndicatorAndTradePreset = {
      id: Date.now().toString(),
      name: newPresetName.trim(),
      config: {
        indicators: JSON.parse(JSON.stringify(indicatorSettings)),
        tradeControl: JSON.parse(JSON.stringify(tradingConfig))
      }
    };
    
    saveToSession([...presets, newPreset]);
    setNewPresetName('');
  };

  const confirmLoadPreset = (preset: IndicatorAndTradePreset) => {
    if (window.confirm(`Are you sure you want to load preset: "${preset.name}"? This overides your current configuration.`)) {
      setIndicatorSettings(preset.config.indicators);
      setTradingConfig(preset.config.tradeControl);
    }
  };

  const deletePreset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this preset?')) {
      saveToSession(presets.filter(p => p.id !== id));
    }
  };

  return (
    <div className="w-full bg-zinc-800/10 border border-zinc-700/30 rounded-lg overflow-hidden mb-4 shrink-0">
      {/* Header & Toggle */}
      <button 
        type="button"
        className="w-full flex items-center justify-between p-3 bg-zinc-800/20 hover:bg-zinc-700/30 transition-colors" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 size={16} />
          <span className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
            Config Presets
            <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[9px]">{presets.length}</span>
          </span>
        </div>
        <ChevronDown size={16} className={`text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-zinc-700/30 flex flex-col max-h-[60vh] overflow-y-auto">
              {presets.length > 0 ? (
                <div className="flex flex-col gap-2 mb-4">
                  {presets.map((preset) => (
                    <div key={preset.id} className="flex group rounded border border-zinc-800 overflow-hidden">
                      <button 
                        onClick={() => confirmLoadPreset(preset)}
                        className="flex-1 text-xs bg-zinc-900 hover:bg-cyan-900/30 text-zinc-300 hover:text-cyan-300 py-2 px-3 text-left truncate transition-colors font-medium border-r border-zinc-800"
                      >
                        {preset.name}
                      </button>
                      <button
                        onClick={(e) => deletePreset(e, preset.id)}
                        className="px-2 bg-zinc-900 hover:bg-red-900/30 text-zinc-500 hover:text-red-400 transition-colors flex items-center"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[10px] text-zinc-500 italic mb-4 text-center">
                  No presets saved yet.
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-3 border-t border-zinc-800/50 mt-auto">
                <input 
                  type="text" 
                  placeholder="New preset name..." 
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                  className="flex-1 bg-zinc-900 text-[11px] px-2 py-1.5 rounded border border-zinc-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-zinc-300"
                />
                <button 
                  onClick={savePreset}
                  disabled={!newPresetName.trim()}
                  className="bg-emerald-900/40 hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-900/40 text-emerald-400 px-3 py-1.5 rounded text-[11px] font-bold transition-colors flex items-center gap-1 border border-emerald-500/20"
                >
                  <Plus size={12} /> Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
