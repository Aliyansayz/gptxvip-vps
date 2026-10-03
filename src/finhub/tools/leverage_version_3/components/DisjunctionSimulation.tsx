import React from 'react';
import { CandlestickSimulator } from './CandlestickSimulator';
import { useIndicatorsStore } from '../stores/indicators_store';
import { getSystemInstanceSettings } from '../functions/api/classicSystem/systemInstanceSettings';

export const DisjunctionSimulation: React.FC = () => {
  const { tradingConfig, indicatorSettings } = useIndicatorsStore();
  
  // Find first active disjunction system to use as the visual backdrop or fallback
  const firstActiveSys = (tradingConfig.activeDisjunctionSystems && tradingConfig.activeDisjunctionSystems.length > 0)
    ? tradingConfig.activeDisjunctionSystems[0].replace('_alpha', '').replace('_beta', '').replace('_delta', '')
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
  const settings = getSystemInstanceSettings(indicatorSettings, tradingConfig.activeDisjunctionSystems?.[0] || configType);

  return (
    <div className="w-full space-y-4">
      <div className="bg-orange-950/40 border border-orange-800/50 p-4 rounded-xl">
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>🔮 Disjunction System Mode Active</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-900 border border-orange-700/50 text-orange-300 animate-pulse">
            OR Logic Signal Mode
          </span>
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed mb-3">
          Any selected system can trigger an entry. If systems signal opposite directions on the same candle, the first system in the selector takes priority.
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] uppercase font-bold text-zinc-500">Active Sub-systems:</span>
          {tradingConfig.activeDisjunctionSystems && tradingConfig.activeDisjunctionSystems.length > 0 ? (
            tradingConfig.activeDisjunctionSystems.map((sys: string) => {
              const name = sys.replace('_alpha', '').replace('_beta', '').replace('_delta', '').replace(/_/g, ' ');
              return (
                <span key={sys} className="px-2.5 py-1 rounded bg-orange-900/40 border border-orange-500/20 text-orange-300 text-[10px] font-black uppercase tracking-widest shadow-[0_0_8px_rgba(249,115,22,0.15)]">
                  {name}
                </span>
              );
            })
          ) : (
            <span className="text-[10px] text-zinc-500 font-semibold italic">No systems selected. Choose systems in the selector to enable entries.</span>
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
