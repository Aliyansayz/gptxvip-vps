import React, { useMemo } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { calculateATR } from '../../functions/api/indicators/integral/atr';
import { linearRegressionSystem } from '../../functions/api/indicators/exclusive/linearRegression';
import { trendDecayState } from '../../functions/api/indicators/exclusive/volatilityBehavior';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { priceToPips } from '../../functions/api/middleware/pipsTranslation';
import { formatInterval } from '../../functions/api/rules/dataSourceRules';

interface TradingPanelVolatilityRegimeProps {
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

export const TradingPanelVolatilityRegime: React.FC<TradingPanelVolatilityRegimeProps> = ({ 
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
  const { dataSettings, indicatorSettings } = useIndicatorsStore();
  const asset = dataSettings.asset || 'gold';
  
  const vrDataSource = indicatorSettings.volatilityRegime.dataSource || 'alpha';
  const data = vrDataSource === 'beta' ? betaData : vrDataSource === 'delta' ? deltaData : alphaData;
  const simulationIndex = vrDataSource === 'beta' ? betaIndex : vrDataSource === 'delta' ? deltaIndex : alphaIndex;
  const atrPeriod = indicatorSettings.volatility.atrPeriod;

  const slDataSource = indicatorSettings.stopLossIndicator.dataSource || 'alpha';
  const slData = slDataSource === 'beta' ? betaData : slDataSource === 'delta' ? deltaData : alphaData;
  const slSimulationIndex = slDataSource === 'beta' ? betaIndex : slDataSource === 'delta' ? deltaIndex : alphaIndex;
  const slAtrPeriod = indicatorSettings.stopLossIndicator.period || 14;

  const { currentStatus, scenario, label, details, currentATR, currentATRPips, slCurrentATR, slCurrentATRPips } = useMemo(() => {
    let currentATR = 0;
    let currentATRPips = 0;
    let slCurrentATR = 0;
    let slCurrentATRPips = 0;

    let currentStatus = 'Unknown';
    let currentScenario = 'N/A';
    let scenarioLabel = 'Neutral';
    let desc: string[] = [];
    
    if (data.length > 0 && simulationIndex >= 2) {
      const visibleData = data.slice(0, simulationIndex + 1);
      const closePrices = visibleData.map(d => d.close);
      
      const lr = linearRegressionSystem(closePrices, 20, 20, 30);
      
      const atrValues = calculateATR(visibleData, atrPeriod);
      currentATR = atrValues[atrValues.length - 1] || 0;
      currentATRPips = priceToPips(currentATR, asset, closePrices[closePrices.length - 1]);
      
      const n = lr.trend_strength.length;
      let z = 0;
      if (n > 0) {
        const ts = lr.trend_strength;
        const m = ts.reduce((a, b) => a + b, 0) / ts.length;
        const dev = ts.map(x => (x - m) ** 2);
        const s = Math.sqrt(dev.reduce((a, b) => a + b, 0) / ts.length);
        const currentTS = ts[n - 1];
        z = s === 0 ? 0 : (currentTS - m) / s;
      }
      
      const currentVolRegime = lr.vol_regime[n - 1] || 0;
      
      const tsAll = lr.trend_strength;
      const mAll = tsAll.reduce((a, b) => a + b, 0) / (tsAll.length || 1);
      const sAll = Math.sqrt(tsAll.map(x => (x - mAll)**2).reduce((a,b)=>a+b,0) / (tsAll.length || 1));
      const zArray = sAll === 0 ? tsAll.fill(0) : tsAll.map(v => (v - mAll)/sAll);

      const decayStates = trendDecayState(zArray, lr.vol_regime);
      const currentDecay = decayStates[n - 1] || 0;

      if (Math.abs(z) > 1.5 && currentVolRegime === 1) {
        currentScenario = 'A';
        scenarioLabel = 'Scenario A — High Z + High Vol';
        desc = ['Trend is stretched', 'BUT still accelerating'];
      } else if (Math.abs(z) > 1.5 && currentVolRegime === 0) {
        currentScenario = 'B';
        scenarioLabel = 'Scenario B — High Z + Low Vol';
        desc = ['Trend stretched', 'No energy to continue'];
      } else if (Math.abs(z) <= 1.5 && currentVolRegime === 1) {
        currentScenario = 'C';
        scenarioLabel = 'Scenario C — Low Z + High Vol';
        desc = ['Trend just starting', 'Strong expansion'];
      } else {
        currentScenario = 'D';
        scenarioLabel = 'Scenario D — Low Z + Low Vol';
        desc = ['Chop / Consolidation'];
      }

      currentStatus = `Decay State: ${currentDecay} | Z: ${z.toFixed(2)} | Vol Regime: ${currentVolRegime}`;
    }

    if (slData.length > 0 && slSimulationIndex >= 2) {
      const visibleSlData = slData.slice(0, slSimulationIndex + 1);
      const slAtrValues = calculateATR(visibleSlData, slAtrPeriod);
      slCurrentATR = slAtrValues[slAtrValues.length - 1] || 0;
      slCurrentATRPips = priceToPips(slCurrentATR, asset, visibleSlData[visibleSlData.length - 1].close);
    }

    return { 
      currentStatus,
      scenario: currentScenario,
      label: scenarioLabel,
      details: desc,
      currentATR,
      currentATRPips,
      slCurrentATR,
      slCurrentATRPips
    };
  }, [data, simulationIndex, asset, atrPeriod, slData, slSimulationIndex, slAtrPeriod]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
              Volatility Regime
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900/80 backdrop-blur-sm text-zinc-400 border border-zinc-700/50 uppercase flex items-baseline">
                Source: <span className="ml-1 text-white">{indicatorSettings.volatilityRegime.dataSource || 'alpha'}</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-500/30 flex items-baseline">
                TF: <span className="ml-1 text-white">{formatInterval(indicatorSettings.volatilityRegime.dataSource === 'beta' ? betaInterval : indicatorSettings.volatilityRegime.dataSource === 'delta' ? deltaInterval : alphaInterval)}</span>
              </span>
            </div>
          </div>
          <span className="text-[10px] bg-zinc-800/80 text-zinc-300 font-mono px-2 py-1 rounded border border-zinc-700/50">
            {currentStatus}
          </span>
          <span className="text-[10px] bg-blue-900/30 backdrop-blur-sm text-blue-300 font-mono flex items-center rounded border border-blue-500/30 overflow-hidden">
            <span className="px-2 py-1 bg-blue-950/50 border-r border-blue-500/30 flex items-center gap-1.5 hover:bg-blue-900/50 transition-colors cursor-help" title={`Volatility ATR [${indicatorSettings.volatility.dataSource || 'alpha'}]`}>
              <span className="text-blue-400 font-bold">ATR</span>
            </span>
            <span className="px-2 py-1 flex items-baseline gap-1.5 text-blue-100 font-bold text-xs bg-blue-900/20 shadow-sm shadow-blue-900/10">
              {currentATR.toFixed(2)} 
              <span className="text-blue-300 ml-0.5 font-medium tracking-wide">({currentATRPips.toFixed(1)} pips)</span>
            </span>
          </span>
          {indicatorSettings.stopLossIndicator && (
             <span className="text-[10px] bg-purple-900/30 backdrop-blur-sm text-purple-300 font-mono flex items-center rounded border border-purple-500/30 overflow-hidden shadow-sm shadow-purple-900/10">
               <span className="px-2 py-1 bg-purple-950/50 border-r border-purple-500/30 flex items-center gap-1.5 hover:bg-purple-900/50 transition-colors cursor-help" title={`Stop Loss ATR Source: ${indicatorSettings.stopLossIndicator.dataSource || 'alpha'}`}>
                 <span className="text-purple-400 font-bold">SL ATR</span>
                 <span className="text-purple-400/60 uppercase text-[9px] shrink-0 ml-1">[{indicatorSettings.stopLossIndicator.dataSource || 'alpha'}]</span>
               </span>
               <span className="px-2 py-1 flex items-baseline gap-1.5 text-purple-100 font-bold text-xs bg-purple-900/20">
                 {slCurrentATR.toFixed(2)} 
                 <span className="text-purple-300 ml-0.5 font-medium tracking-wide">({slCurrentATRPips.toFixed(1)} pips)</span>
               </span>
             </span>
          )}
        </div>

        <div className="flex gap-2 text-[10px]">
          <div className={`px-2 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${scenario === 'A' ? 'bg-orange-500/20 border-orange-500/50 text-orange-200' : 'bg-transparent border-zinc-800/80 text-zinc-500'}`}>
            <span>🔥</span>
            <span className="hidden sm:inline">High Z + High Vol</span>
            <span className="sm:hidden">Sc. A</span>
          </div>

          <div className={`px-2 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${scenario === 'B' ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200' : 'bg-transparent border-zinc-800/80 text-zinc-500'}`}>
            <span>🧊</span>
            <span className="hidden sm:inline">High Z + Low Vol</span>
            <span className="sm:hidden">Sc. B</span>
          </div>

          <div className={`px-2 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors ${scenario === 'C' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-transparent border-zinc-800/80 text-zinc-500'}`}>
            <span>⚖️</span>
            <span className="hidden sm:inline">Low Z + High Vol</span>
            <span className="sm:hidden">Sc. C</span>
          </div>
        </div>
      </div>
      
      {/* Current Scenario Active Description */}
      <div className={`mt-1 p-3 rounded border text-xs flex flex-col gap-1.5 relative overflow-hidden ${
        scenario === 'A' ? 'bg-orange-500/10 border-orange-500/20' :
        scenario === 'B' ? 'bg-cyan-500/10 border-cyan-500/20' :
        scenario === 'C' ? 'bg-emerald-500/10 border-emerald-500/20' :
        'bg-zinc-800/30 border-zinc-700/50'
      }`}>
        {scenario !== 'None' && scenario !== 'D' && (
          <div className={`absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-20 -mr-8 -mt-8 ${
            scenario === 'A' ? 'bg-orange-500' :
            scenario === 'B' ? 'bg-cyan-500' :
            'bg-emerald-500'
          }`} />
        )}
        <div className={`font-semibold ${
          scenario === 'A' ? 'text-orange-400' :
          scenario === 'B' ? 'text-cyan-400' :
          scenario === 'C' ? 'text-emerald-400' :
          'text-zinc-400'
        }`}>
          {label}
        </div>
        <div className="flex flex-col gap-0.5 z-10">
          {details.map((d, i) => (
            <div key={i} className="flex items-center gap-1.5 text-zinc-400 font-mono text-[10px]">
              <span className={`w-1 h-1 rounded-full ${
                scenario === 'A' ? 'bg-orange-500/50' :
                scenario === 'B' ? 'bg-cyan-500/50' :
                scenario === 'C' ? 'bg-emerald-500/50' :
                'bg-zinc-600'
              }`} />
              {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
