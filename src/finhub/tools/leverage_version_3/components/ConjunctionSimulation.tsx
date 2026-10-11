import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';

export const ConjunctionSimulation: React.FC = () => {
  const { tradingConfig, indicatorSettings } = useIndicatorsStore();
  
  // Find first active conjunction system to use as the visual backdrop or fallback
  const firstActiveSys = (tradingConfig.activeConjunctionSystems && tradingConfig.activeConjunctionSystems.length > 0)
    ? tradingConfig.activeConjunctionSystems[0].replace('_alpha', '').replace('_beta', '').replace('_delta', '')
    : 'stochastic';

  let configType: any = firstActiveSys;
  const validTypes = [
    'ma_crossover', 
    'stochastic', 
    'supertrend', 
    'divergence', 
    'linear_regression', 
    'bollinger_bands', 
    'ichimoku',
    'three_candle_strike',
    'turtle_trading',
    'supertrend_regime', 
    'heikin_ashi_smoothed', 
    'candlestick_pattern'
  ];
  if (!validTypes.includes(configType)) {
    configType = 'stochastic';
  }

  // Get settings for that type
  const settings = indicatorSettings[configType as keyof typeof indicatorSettings] || indicatorSettings.stochastic;

  return (
    <div className="w-full space-y-4">
      <div className="bg-purple-950/40 border border-purple-800/50 p-4 rounded-xl">
        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>🔮 Conjunction System Mode Active</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-900 border border-purple-700/50 text-purple-300 animate-pulse">
            Perfect Alignment Signal Mode
          </span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed mb-3">
          This mode evaluates signals from multiple classic systems in perfect mathematical alignment. Entries are triggered only when all selected sub-systems point to the same direction synchronously.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-bold text-zinc-500">Active Sub-systems:</span>
          {tradingConfig.activeConjunctionSystems && tradingConfig.activeConjunctionSystems.length > 0 ? (
            tradingConfig.activeConjunctionSystems.map((sys: string) => {
              const name = sys.replace('_alpha', '').replace('_beta', '').replace('_delta', '').replace(/_/g, ' ');
              return (
                <span key={sys} className="px-2.5 py-1 rounded bg-purple-900/40 border border-purple-500/20 text-purple-300 text-[10px] font-black uppercase tracking-widest shadow-[0_0_8px_rgba(168,85,247,0.15)]">
                  {name}
                </span>
              );
            })
          ) : (
            <span className="text-[10px] text-amber-500 font-semibold italic">No systems selected! Choose systems below.</span>
          )}
        </div>
      </div>
      <CandlestickSimulator 
        config={{ 
          type: configType,
          ...settings
        }} 
      />
    </div>
  );
};
