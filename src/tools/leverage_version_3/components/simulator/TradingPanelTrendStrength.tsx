import React, { useMemo } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { linearRegressionSystem } from '../../functions/api/indicators/trendStrength/trendStrength';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { formatInterval } from '../../functions/api/rules/dataSourceRules';

interface TradingPanelTrendStrengthProps {
  alphaData: Ohlc[];
  betaData: Ohlc[];
  deltaData: Ohlc[];
  alphaIndex: number;
  betaIndex: number;
  deltaIndex: number;
  alphaInterval: number;
  betaInterval: number;
  deltaInterval: number;
}

export const TradingPanelTrendStrength: React.FC<TradingPanelTrendStrengthProps> = ({ 
  alphaData,
  betaData,
  deltaData,
  alphaIndex,
  betaIndex,
  deltaIndex,
  alphaInterval,
  betaInterval,
  deltaInterval
}) => {
  const { indicatorSettings } = useIndicatorsStore();
  
  const tsDataSource = indicatorSettings.trendStrength.dataSource || 'alpha';
  const data = tsDataSource === 'beta' ? betaData : tsDataSource === 'delta' ? deltaData : alphaData;
  const simulationIndex = tsDataSource === 'beta' ? betaIndex : tsDataSource === 'delta' ? deltaIndex : alphaIndex;
  
  const slopePeriod = indicatorSettings.trendStrength.slopePeriod || 20;
  const volPeriod = indicatorSettings.trendStrength.volPeriod || 20;
  const regimePeriod = indicatorSettings.trendStrength.regimePeriod || 30;

  const { currentTrendStrength, currentDirection, currentReversion, zScore } = useMemo(() => {
    let currentTrendStrength = 0;
    let currentDirection = 0;
    let currentReversion = 0;
    let zScore = 0;
    
    if (data.length > 0 && simulationIndex >= 2) {
      const visibleData = data.slice(0, Math.min(simulationIndex + 1, data.length));
      const closePrices = visibleData.map(d => d.close);
      
      const lr = linearRegressionSystem(closePrices, slopePeriod, volPeriod, regimePeriod);
      
      const n = lr.trend_strength.length;
      if (n > 0) {
        currentTrendStrength = lr.trend_strength[n - 1] || 0;
        currentDirection = lr.direction[n - 1] || 0;
        currentReversion = lr.reversion[n - 1] || 0;

        const ts = lr.trend_strength;
        const m = ts.reduce((a, b) => a + b, 0) / ts.length;
        const dev = ts.map(x => (x - m) ** 2);
        const s = Math.sqrt(dev.reduce((a, b) => a + b, 0) / ts.length);
        zScore = s === 0 ? 0 : (currentTrendStrength - m) / s;
      }
    }

    return { currentTrendStrength, currentDirection, currentReversion, zScore };
  }, [data, simulationIndex, slopePeriod, volPeriod, regimePeriod]);

  // Determine scenario/display state
  let statusColor = 'text-zinc-400';
  let scenarioLabel = 'Neutral / Sideways';
  let desc = ['No clear trend direction'];
  let bgColorClass = 'bg-zinc-800/30 border-zinc-700/50';

  if (currentDirection > 0) {
    statusColor = 'text-emerald-400';
    scenarioLabel = 'Bullish Trend';
    desc = ['Positive linear regression slope'];
    bgColorClass = 'bg-emerald-500/10 border-emerald-500/20';
  } else if (currentDirection < 0) {
    statusColor = 'text-rose-400';
    scenarioLabel = 'Bearish Trend';
    desc = ['Negative linear regression slope'];
    bgColorClass = 'bg-rose-500/10 border-rose-500/20';
  }

  if (currentReversion === -1) {
    desc.push('Bearish Mean Reversion condition triggered (Z overbought limit)');
    bgColorClass = 'bg-orange-500/10 border-orange-500/20';
  } else if (currentReversion === 1) {
    desc.push('Bullish Mean Reversion condition triggered (Z oversold limit)');
    bgColorClass = 'bg-indigo-500/10 border-indigo-500/20';
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Trend Strength
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm text-zinc-400 border border-zinc-700/50 uppercase flex items-baseline">
                Source: <span className="ml-1 text-white">{indicatorSettings.trendStrength.dataSource || 'alpha'}</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-900/30 text-teal-300 border border-teal-500/30 flex items-baseline">
                TF: <span className="ml-1 text-white">{formatInterval(indicatorSettings.trendStrength.dataSource === 'beta' ? betaInterval : indicatorSettings.trendStrength.dataSource === 'delta' ? deltaInterval : alphaInterval)}</span>
              </span>
            </div>
          </div>
          
          <span className="text-[10px] bg-zinc-800/80 text-zinc-300 font-mono px-2 py-1 rounded border border-zinc-700/50 flex items-center gap-2">
            <span>Strength: <span className="font-bold">{currentTrendStrength.toFixed(3)}</span></span>
            <span className="text-zinc-500">|</span>
            <span>Z-Score: <span className="font-bold">{zScore.toFixed(2)}</span></span>
          </span>
        </div>
      </div>
      
      <div className={`mt-1 p-3 rounded border text-xs flex flex-col gap-1.5 relative overflow-hidden ${bgColorClass}`}>
        <div className={`font-semibold ${statusColor}`}>
          {scenarioLabel}
        </div>
        <div className="flex flex-col gap-0.5 z-10">
          {desc.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
              <span className={`w-1 h-1 rounded-full bg-zinc-600`} />
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
