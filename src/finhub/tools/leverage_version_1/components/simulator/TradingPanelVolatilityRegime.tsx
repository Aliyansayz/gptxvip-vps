import React, { useMemo } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { linearRegressionSystem } from '../../functions/api/indicators/exclusive/linearRegression';
import { trendDecayState } from '../../functions/api/indicators/exclusive/volatilityBehavior';

interface TradingPanelVolatilityRegimeProps {
  data: Ohlc[];
  simulationIndex: number;
}

export const TradingPanelVolatilityRegime: React.FC<TradingPanelVolatilityRegimeProps> = ({ data, simulationIndex }) => {
  const { currentStatus, scenario, label, details } = useMemo(() => {
    if (data.length === 0 || simulationIndex < 2) return { currentStatus: 'Unknown', scenario: 'N/A', label: 'Neutral', details: [] };
    
    // We only need the data up to current simulation index
    const visibleData = data.slice(0, simulationIndex + 1);
    const closePrices = visibleData.map(d => d.close);
    
    // Calculate system values
    const lr = linearRegressionSystem(closePrices, 20, 20, 30);
    
    // To match formulas:
    // Actually we need to calculate Z manually or use the `z` calculation from linearRegressionSystem
    // linearRegressionSystem outputs trend_strength (normalizedSlope). We need "Z".
    // We can just re-implement the Z calculation here or rely on trendDecayState.
    // Wait, trendDecayState needs `z`. lr object only exports `normalizedSlope` as trend_strength.
    // Let's compute Z here for the visible data:
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
    
    const currentVolRegime = lr.vol_regime[n - 1];
    
    // Decay state
    // We need z array to pass to trendDecayState
    const tsAll = lr.trend_strength;
    const mAll = tsAll.reduce((a, b) => a + b, 0) / tsAll.length;
    const sAll = Math.sqrt(tsAll.map(x => (x - mAll)**2).reduce((a,b)=>a+b,0) / tsAll.length);
    const zArray = sAll === 0 ? tsAll.fill(0) : tsAll.map(v => (v - mAll)/sAll);

    const decayStates = trendDecayState(zArray, lr.vol_regime);
    const currentDecay = decayStates[n - 1];

    let currentScenario = 'None';
    let label = 'Neutral';
    let desc: string[] = [];

    if (Math.abs(z) > 1.5 && currentVolRegime === 1) {
      currentScenario = 'A';
      label = 'Scenario A — High Z + High Vol';
      desc = ['Trend is stretched', 'BUT still accelerating'];
    } else if (Math.abs(z) > 1.5 && currentVolRegime === 0) {
      currentScenario = 'B';
      label = 'Scenario B — High Z + Low Vol';
      desc = ['Trend stretched', 'No energy to continue'];
    } else if (Math.abs(z) <= 1.5 && currentVolRegime === 1) {
      currentScenario = 'C';
      label = 'Scenario C — Low Z + High Vol';
      desc = ['Trend just starting', 'Strong expansion'];
    } else {
      label = 'Scenario D — Low Z + Low Vol';
      desc = ['Chop / Consolidation'];
    }

    return { 
      currentStatus: `Decay State: ${currentDecay} | Z: ${z.toFixed(2)} | Vol Regime: ${currentVolRegime}`,
      scenario: currentScenario,
      label,
      details: desc
    };
  }, [data, simulationIndex]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
            Volatility Regime
          </h4>
          <span className="text-[10px] bg-zinc-800/80 text-zinc-300 font-mono px-2 py-1 rounded border border-zinc-700/50">
            {currentStatus}
          </span>
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
