import React, { useState } from 'react';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { ToolTab } from './LabNavigation';
import { ChevronDown, ChevronRight, Activity, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface MonitorLogPanelProps {
  activeTab: ToolTab;
}

export const MonitorLogPanel: React.FC<MonitorLogPanelProps> = ({ activeTab }) => {
  const { 
    indicatorSettings, 
    tradingConfig, 
    simulationIndex, 
    computedIndicatorsGlobal,
    latestPrice 
  } = useIndicatorsStore();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const getSystemTypeLabel = () => {
    if (tradingConfig.activeSystemMode === 'conjunction') return 'Conjunction System';
    if (tradingConfig.activeSystemMode === 'disjunction') return 'Disjunction System';
    return 'Classic System';
  };

  const getSystemFriendlyName = (id: string) => {
    const baseId = id.replace('_alpha', '').replace('_beta', '').replace('_delta', '');
    switch (baseId) {
      case 'ma_crossover': return 'MA Crossover';
      case 'stochastic': return 'Stochastic';
      case 'supertrend': return 'Supertrend';
      case 'divergence': return 'Divergence';
      case 'linear_regression': return 'Linear Regression';
      case 'bollinger_bands': return 'Bollinger Bands';
      case 'ichimoku': return 'Ichimoku';
      case 'three_candle_strike': return '3 Candle Strike';
      case 'turtle_trading': return 'Turtle Trading';
      case 'supertrend_regime': return 'Supertrend Regime';
      case 'heikin_ashi_smoothed': return 'Heikin Ashi Smoothed';
      case 'candlestick_pattern': return 'Candlestick Pattern';
      default: return id;
    }
  };

  const getSystemDataSource = (id: string) => {
    const baseId = id.replace('_alpha', '').replace('_beta', '').replace('_delta', '');
    const settings = indicatorSettings[baseId as keyof typeof indicatorSettings] as any;
    return settings?.entrySignalSource || settings?.dataSource || 'alpha';
  };

  const getTrendAndValuesForSystem = (sysId: string, computedData: any, idx: number) => {
    if (!computedData || idx === undefined || idx < 0) {
      return { trend: 'NEUTRAL' as const, values: 'N/A' };
    }

    const baseId = sysId.replace('_alpha', '').replace('_beta', '').replace('_delta', '');
    
    let sigObj: any = null;
    if (computedData.entrySignal) {
      if (computedData.entrySignal.type === 'conjunction' && computedData.entrySignal.conjunctionSignals) {
        sigObj = computedData.entrySignal.conjunctionSignals[sysId];
      } else if (computedData.entrySignal.type === 'disjunction' && computedData.entrySignal.disjunctionSignals) {
        sigObj = computedData.entrySignal.disjunctionSignals[sysId];
      } else if (computedData.entrySignal.type === baseId) {
        sigObj = computedData.entrySignal;
      }
    }

    // Fallback search
    if (!sigObj && computedData.entrySignal && computedData.entrySignal.type === baseId) {
      sigObj = computedData.entrySignal;
    }

    if (!sigObj) {
      return { trend: 'NEUTRAL' as const, values: 'N/A' };
    }

    let trend: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';
    let values = '';

    if (baseId === 'ma_crossover') {
      const fast = sigObj.fastLine?.[idx];
      const slow = sigObj.slowLine?.[idx];
      if (fast !== undefined && slow !== undefined) {
        trend = fast > slow ? 'LONG' : (fast < slow ? 'SHORT' : 'NEUTRAL');
        values = `Fast: ${fast.toFixed(2)} | Slow: ${slow.toFixed(2)}`;
      }
    } else if (baseId === 'supertrend') {
      const trendVal = sigObj.supertrend?.trend?.[idx];
      const level = sigObj.supertrend?.level?.[idx];
      if (trendVal !== undefined) {
        trend = trendVal === 1 ? 'LONG' : (trendVal === -1 ? 'SHORT' : 'NEUTRAL');
        values = level !== undefined ? `Level: ${level.toFixed(2)}` : '';
      }
    } else if (baseId === 'stochastic' || baseId === 'divergence') {
      const k = sigObj.stochastic?.k?.[idx];
      const d = sigObj.stochastic?.d?.[idx];
      if (k !== undefined && d !== undefined) {
        trend = k > d ? 'LONG' : (k < d ? 'SHORT' : 'NEUTRAL');
        values = `K: ${k.toFixed(1)}% | D: ${d.toFixed(1)}%`;
      }
    } else if (baseId === 'linear_regression') {
      const dir = sigObj.lr?.direction?.[idx];
      const slope = sigObj.lr?.slope?.[idx];
      if (dir !== undefined) {
        trend = dir === 1 ? 'LONG' : (dir === -1 ? 'SHORT' : 'NEUTRAL');
        values = slope !== undefined ? `Slope: ${slope.toFixed(4)}` : '';
      }
    } else if (baseId === 'bollinger_bands') {
      const b = sigObj.bb?.[idx];
      if (b !== undefined) {
        trend = sigObj.direction?.[idx] === 1 ? 'LONG' : (sigObj.direction?.[idx] === -1 ? 'SHORT' : 'NEUTRAL');
        values = `Upper: ${b.upper.toFixed(2)} | Lower: ${b.lower.toFixed(2)}`;
      }
    } else if (baseId === 'ichimoku') {
      const ich = sigObj.ichimoku;
      const direction = ich?.trend?.[idx];
      if (direction !== undefined) {
        trend = direction === 1 ? 'LONG' : direction === -1 ? 'SHORT' : 'NEUTRAL';
        values = `Tenkan: ${ich.tenkan[idx]?.toFixed(2)} | Kijun: ${ich.kijun[idx]?.toFixed(2)}`;
      }
    } else if (baseId === 'three_candle_strike') {
      const strike = sigObj.strike;
      const direction = strike?.trend?.[idx];
      if (direction !== undefined) {
        trend = direction === 1 ? 'LONG' : direction === -1 ? 'SHORT' : 'NEUTRAL';
        values = `Fast SMMA: ${strike.fast[idx]?.toFixed(2)} | Slope: ${strike.smoothSlope[idx]?.toFixed(4)}`;
      }
    } else if (baseId === 'turtle_trading') {
      const turtle = sigObj.turtle;
      const direction = turtle?.trend?.[idx];
      if (direction !== undefined) {
        trend = direction === 1 ? 'LONG' : direction === -1 ? 'SHORT' : 'NEUTRAL';
        values = `Entry: ${turtle.entryUpper[idx]?.toFixed(2)} / ${turtle.entryLower[idx]?.toFixed(2)} | N: ${turtle.n[idx]?.toFixed(3)}`;
      }
    } else if (baseId === 'supertrend_regime') {
      const sig = sigObj.supertrend_regime?.signal?.[idx];
      if (sig !== undefined) {
        trend = sig === 1 ? 'LONG' : (sig === -1 ? 'SHORT' : 'NEUTRAL');
        values = `Regime Signal: ${sig}`;
      }
    } else if (baseId === 'heikin_ashi_smoothed') {
      const ha = sigObj.heikin_ashi_smoothed;
      const haOpen = ha?.haOpen?.[idx];
      const haClose = ha?.haClose?.[idx];
      if (haOpen !== undefined && haClose !== undefined) {
        trend = haClose > haOpen ? 'LONG' : (haClose < haOpen ? 'SHORT' : 'NEUTRAL');
        values = `Open: ${haOpen.toFixed(2)} | Close: ${haClose.toFixed(2)}`;
      }
    } else if (baseId === 'candlestick_pattern') {
      const cp = sigObj.candlestick_pattern;
      const act = cp?.action_signal?.[idx];
      if (act !== undefined) {
        trend = act === 'bullish_action' ? 'LONG' : (act === 'bearish_action' ? 'SHORT' : 'NEUTRAL');
        values = cp?.pattern?.[idx] || 'No Pattern';
      }
    }

    return { trend, values };
  };

  // Get selected systems based on active mode
  const getSelectedSystems = () => {
    if (tradingConfig.activeSystemMode === 'conjunction') {
      return tradingConfig.activeConjunctionSystems || [];
    }
    if (tradingConfig.activeSystemMode === 'disjunction') {
      return tradingConfig.activeDisjunctionSystems || [];
    }
    // Classic Mode
    return [activeTab];
  };

  const selectedSystems = getSelectedSystems();
  const index = simulationIndex || 0;

  // Read Filter Values
  const getFilterRealtimeValue = (filterType: string) => {
    if (!computedIndicatorsGlobal || index === undefined || index < 0) return 'N/A';
    if (filterType === 'adx') {
      const val = computedIndicatorsGlobal.adx?.[index];
      return val !== undefined ? val.toFixed(2) : 'N/A';
    }
    if (filterType === 'slope_persistence') {
      const val = computedIndicatorsGlobal.slopePersistence?.[index];
      return val !== undefined ? val.toFixed(2) : 'N/A';
    }
    if (filterType === 'trend_efficiency') {
      const val = computedIndicatorsGlobal.trendEfficiency?.[index];
      return val !== undefined ? val.toFixed(4) : 'N/A';
    }
    if (filterType === 'wick_efficiency') {
      const val = computedIndicatorsGlobal.wickEfficiency?.[index];
      return val !== undefined ? val.toFixed(4) : 'N/A';
    }
    if (filterType === 'squeeze') {
      const isSqueeze = computedIndicatorsGlobal.squeeze?.squeeze?.[index];
      return isSqueeze ? 'SQUEEZE ON' : 'NORMAL';
    }
    return 'N/A';
  };

  return (
    <div className="bg-zinc-900/60 p-4 border border-zinc-800 rounded-xl flex flex-col gap-3 mt-4 text-xs font-mono">
      <div 
        className="flex items-center justify-between cursor-pointer select-none hover:opacity-90"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h4 className="text-sm font-semibold text-cyan-500 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Monitor Log
        </h4>
        <div className="text-zinc-400 flex items-center gap-1 hover:text-cyan-400 transition-colors">
          <span className="text-[10px] uppercase text-zinc-500">{isCollapsed ? 'Show' : 'Hide'}</span>
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Active System Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 bg-zinc-950/40 rounded-lg border border-zinc-800/60">
            <div className="flex flex-col gap-0.5">
              <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-semibold">Active System Mode</span>
              <span className="text-zinc-100 font-bold">
                {getSystemTypeLabel()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-md border border-zinc-800/40">
              <div>
                Sim Index: <span className="text-cyan-400 font-semibold">{index}</span>
              </div>
              <div className="w-1 h-3 bg-zinc-700"></div>
              <div>
                Latest Price: <span className="text-cyan-400 font-semibold">{latestPrice ? latestPrice.toFixed(2) : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Realtime Indicators (Left Section) */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <span className="text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 pb-1.5 font-bold flex items-center gap-1.5">
                <Activity size={12} className="text-cyan-500" />
                Active System Real-Time Indicators
              </span>
              
              <div className="flex flex-col gap-2">
                {selectedSystems.map((sysId: string) => {
                  const { trend, values } = getTrendAndValuesForSystem(sysId, computedIndicatorsGlobal, index);
                  const source = getSystemDataSource(sysId);
                  
                  return (
                    <div key={sysId} className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/60 flex flex-col gap-2 hover:border-zinc-700/50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-zinc-200 font-semibold">{getSystemFriendlyName(sysId)}</span>
                          <span className="text-[10px] text-zinc-500 font-normal">ID: {sysId}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {/* Data Source Badge */}
                          <span className="text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide">
                            {source}
                          </span>
                          
                          {/* Trend Direction Badge */}
                          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                            trend === 'LONG' 
                              ? 'text-emerald-400 bg-emerald-950/40 border-emerald-900/40' 
                              : trend === 'SHORT'
                              ? 'text-rose-400 bg-rose-950/40 border-rose-900/40'
                              : 'text-zinc-400 bg-zinc-800/40 border-zinc-700/40'
                          }`}>
                            {trend === 'LONG' && <TrendingUp size={10} />}
                            {trend === 'SHORT' && <TrendingDown size={10} />}
                            {trend === 'NEUTRAL' && <Minus size={10} />}
                            {trend}
                          </span>
                        </div>
                      </div>
                      
                      {/* Calculated values */}
                      <div className="text-[11px] text-zinc-400 bg-zinc-900/40 px-2.5 py-1.5 rounded border border-zinc-850 flex items-center justify-between gap-1">
                        <span className="text-zinc-500 text-[10px]">Current Values:</span>
                        <span className="text-zinc-300 font-medium font-mono">{values || 'N/A'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Filter Status (Right Section) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Entry Filters */}
              <div className="flex flex-col gap-2">
                <span className="text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 pb-1.5 font-bold">
                  Active Filters & Extra Rules
                </span>
                
                <div className="flex flex-col gap-1.5">
                  {(tradingConfig.useADXFilter || tradingConfig.useADXRange) ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">ADX Filter</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.volatility.dataSource}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px] font-mono">
                        {getFilterRealtimeValue('adx')}
                      </span>
                    </div>
                  ) : null}
                  
                  {(tradingConfig.useSlopePersistenceFilter || tradingConfig.useSlopePersistenceRange) ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Slope Persistence</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.trendStrength.dataSource}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px] font-mono">
                        {getFilterRealtimeValue('slope_persistence')}
                      </span>
                    </div>
                  ) : null}

                  {(tradingConfig.useTrendEfficiencyFilter || tradingConfig.useTrendEfficiencyRange) ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Trend Efficiency</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.trendStrength.dataSource}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px] font-mono">
                        {getFilterRealtimeValue('trend_efficiency')}
                      </span>
                    </div>
                  ) : null}

                  {(tradingConfig.useWickEfficiencyFilter || tradingConfig.useWickEfficiencyRange) ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Wick Efficiency</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.trendStrength.dataSource}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px] font-mono">
                        {getFilterRealtimeValue('wick_efficiency')}
                      </span>
                    </div>
                  ) : null}
                  
                  {tradingConfig.useSqueezeFilter ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Squeeze Momentum</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.volatility.dataSource}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        getFilterRealtimeValue('squeeze') === 'SQUEEZE ON'
                          ? 'text-amber-400 bg-amber-950/40 border-amber-900/40'
                          : 'text-zinc-400 bg-zinc-800/40 border-zinc-700/40'
                      }`}>
                        {getFilterRealtimeValue('squeeze')}
                      </span>
                    </div>
                  ) : null}
                  
                  {(tradingConfig.useVolRegimeScenarioA || tradingConfig.useVolRegimeScenarioC) ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Volatility Regime</span>
                        <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.volatilityRegime.dataSource}</span>
                      </div>
                      <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded text-[10px] font-mono uppercase">
                        Active
                      </span>
                    </div>
                  ) : null}

                  {/* If no extra filters are active */}
                  {!tradingConfig.useADXFilter && !tradingConfig.useADXRange && 
                   !tradingConfig.useSlopePersistenceFilter && !tradingConfig.useSlopePersistenceRange &&
                   !tradingConfig.useTrendEfficiencyFilter && !tradingConfig.useTrendEfficiencyRange &&
                   !tradingConfig.useWickEfficiencyFilter && !tradingConfig.useWickEfficiencyRange &&
                   !tradingConfig.useSqueezeFilter && !tradingConfig.useVolRegimeScenarioA && !tradingConfig.useVolRegimeScenarioC ? (
                    <div className="text-zinc-500 p-3 bg-zinc-950/20 border border-zinc-850 rounded-lg flex items-center gap-2">
                      <Info size={14} className="text-zinc-600 shrink-0" />
                      <span>No entry logic filters are currently active.</span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Exit Rules */}
              <div className="flex flex-col gap-2">
                <span className="text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800 pb-1.5 font-bold">
                  Exit Rules Status
                </span>
                
                <div className="flex flex-col gap-1.5">
                  <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-zinc-300 font-medium">Stop Loss Tracker</span>
                      <span className="text-[9px] text-zinc-500">Source: {indicatorSettings.stopLossIndicator.dataSource}</span>
                    </div>
                    <span className="text-rose-400 bg-rose-950/40 border border-rose-900/30 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                      Active
                    </span>
                  </div>
                  
                  {tradingConfig.exitOnSignalReversal ? (
                    <div className="bg-zinc-950/30 p-2 rounded-lg border border-zinc-800/40 flex justify-between items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-300 font-medium">Signal Reversal Sync</span>
                        <span className="text-[9px] text-zinc-500">
                          Source: {tradingConfig.useDifferentSignalSystemOnExit 
                            ? 'Exit System' 
                            : 'Entry System'}
                        </span>
                      </div>
                      <span className="text-rose-400 bg-rose-950/40 border border-rose-900/30 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                        Active
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
