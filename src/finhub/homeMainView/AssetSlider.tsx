import React, { useState, useEffect } from 'react';
import { AssetType, ASSETS_CONFIG } from './simulatedDataGenerator';
import { ChevronLeft, ChevronRight, Ghost, Coins, Droplet, BarChart2, Radio, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getPresetsForAsset, GenericPreset } from './asset_presets';

interface AssetSliderProps {
  assetFilters: AssetType[];
  value: AssetType;
  onChange: (asset: AssetType) => void;
  selectedPreset?: string;
  onPresetChange?: (presetName: string) => void;
}

const getAssetIcon = (type: AssetType) => {
  switch (type) {
    case 'Gold':
      return <Coins className="w-3.5 h-3.5 mr-1.5 text-yellow-500" />;
    case 'Silver':
      return (
        <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5L3 9L12 13.5L21 9L12 4.5Z" fill="#e2e8f0"/>
          <path d="M3 9V15L12 19.5V13.5L3 9Z" fill="#cbd5e1"/>
          <path d="M21 9V15L12 19.5V13.5L21 9Z" fill="#94a3b8"/>
        </svg>
      );
    case 'Oil':
      return <Droplet className="w-3.5 h-3.5 mr-1.5 text-amber-600" />;
    case 'Nasdaq100':
      return <BarChart2 className="w-3.5 h-3.5 mr-1.5 text-blue-500" />;
    case 'USDJPY':
      return <span className="mr-1.5 text-[14px]">🇺🇸🇯🇵</span>;
    case 'GBPJPY':
      return <span className="mr-1.5 text-[14px]">🇬🇧🇯🇵</span>;
    case 'EURJPY':
      return <span className="mr-1.5 text-[14px]">🇪🇺🇯🇵</span>;
    case 'EURUSD':
      return <span className="mr-1.5 text-[14px]">🇪🇺🇺🇸</span>;
    case 'AUDUSD':
      return <span className="mr-1.5 text-[14px]">🇦🇺🇺🇸</span>;
    case 'USDCAD':
      return <span className="mr-1.5 text-[14px]">🇺🇸🇨🇦</span>;
    case 'EURCAD':
      return <span className="mr-1.5 text-[14px]">🇪🇺🇨🇦</span>;
    case 'Anonymous':
    default:
      return <Ghost className="w-3.5 h-3.5 mr-1.5 text-cyan-600 dark:text-cyan-500 transition-colors" />;
  }
};

export const AssetSlider: React.FC<AssetSliderProps> = ({ 
  assetFilters, 
  value, 
  onChange,
  selectedPreset = 'default',
  onPresetChange
}) => {
  const currentIndex = assetFilters.indexOf(value);
  const presets = getPresetsForAsset(value);

  const changeSlide = (direction: number) => {
    let nextIndex = (currentIndex + direction + assetFilters.length) % assetFilters.length;
    onChange(assetFilters[nextIndex]);
  };

  const activePresetLabel = selectedPreset === 'default' 
    ? 'Default Baseline' 
    : (presets.find(p => p.name === selectedPreset)?.label || 'Custom Preset');

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
      {/* Asset Selection Slider */}
      <div role="group" aria-label="Simulated market asset" className="inline-flex items-center border border-zinc-300 dark:border-zinc-700/50 rounded-lg bg-white dark:bg-zinc-900 shadow-sm dark:shadow-lg overflow-hidden h-9 transition-colors">
        <button 
          type="button"
          onClick={() => changeSlide(-1)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 border-r border-zinc-300 dark:border-zinc-700/50 text-zinc-500 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 flex items-center justify-center h-full cursor-pointer"
          aria-label={`Previous asset from ${value}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div aria-live="polite" aria-atomic="true" className="px-6 py-1 min-w-[140px] text-center select-none relative flex items-center justify-center h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="flex items-center text-xs font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 transition-colors"
            >
              {getAssetIcon(value)}
              {value}
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          type="button"
          onClick={() => changeSlide(1)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 border-l border-zinc-300 dark:border-zinc-700/50 text-zinc-500 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 flex items-center justify-center h-full cursor-pointer"
          aria-label={`Next asset from ${value}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Selector Dropdown */}
      {onPresetChange && presets.length > 0 && (
        <div className="inline-flex items-center border border-zinc-300 dark:border-zinc-700/50 rounded-lg bg-white dark:bg-zinc-900 shadow-sm dark:shadow-lg overflow-hidden h-9 px-2 gap-1.5 transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
          <span className="text-[10px] font-mono font-semibold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider transition-colors">Regime:</span>
          <select 
            aria-label={`Volatility regime for ${value}`}
            value={selectedPreset}
            onChange={(e) => onPresetChange(e.target.value)}
            className="bg-transparent text-xs font-semibold text-zinc-800 dark:text-zinc-200 border-none outline-none focus:ring-0 cursor-pointer pr-4 h-full uppercase tracking-wider !text-cyan-700 dark:!text-cyan-400 transition-colors"
          >
            <option value="default" className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300">Default Baseline</option>
            {presets.map((p) => (
              <option key={p.name} value={p.name} className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-300" title={p.description}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
