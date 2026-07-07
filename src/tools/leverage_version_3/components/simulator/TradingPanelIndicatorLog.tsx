import React, { useState } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { syncIndicatorState } from '../../functions/api/indicatorLog/syncIndicatorState';
import { useIndicatorsStore } from '../../stores/indicators_store';
import { Activity, Clock, Database, ChevronDown, ChevronUp } from 'lucide-react';

interface TradingPanelIndicatorLogProps {
  alphaData: Ohlc[];
  betaData: Ohlc[];
  deltaData: Ohlc[];
  simulationIndex: number;
  betaIndex: number;
  deltaIndex: number;
  config: any;
}

export const TradingPanelIndicatorLog: React.FC<TradingPanelIndicatorLogProps> = ({
  alphaData,
  betaData,
  deltaData,
  simulationIndex,
  betaIndex,
  deltaIndex,
  config
}) => {
  const { 
    indicatorSettings, 
    tradingConfig, 
    heikinAshiSettings,
    isFeatureLogActive,
    setIsFeatureLogActive,
    isVisibilityLogActive,
    setIsVisibilityLogActive,
    featureLog,
    setFeatureLog,
    dataSettings,
    indicatorCheckedState,
    setIndicatorCheckedState
  } = useIndicatorsStore();
  
  const [activeTab, setActiveTab] = useState<'alpha' | 'beta' | 'delta'>('alpha');
  const [expandedRowIndex, setExpandedRowIndex] = useState<number | null>(0); // Default expand the latest row

  // Retrieve the sync indicator state rows
  const indicatorState = syncIndicatorState(
    alphaData,
    betaData,
    deltaData,
    simulationIndex,
    betaIndex,
    deltaIndex,
    indicatorSettings,
    tradingConfig,
    heikinAshiSettings,
    (dataSettings?.asset as string) || 'gold'
  );

  const activeRows = activeTab === 'alpha' 
    ? indicatorState.alphaRows 
    : activeTab === 'beta' 
    ? indicatorState.betaRows 
    : indicatorState.deltaRows;

  const activeLabel = activeTab === 'alpha' 
    ? 'Alpha Primary Base (Lowest Latency)' 
    : activeTab === 'beta' 
    ? 'Beta Aggregated Base' 
    : 'Delta Multi-Interval Layer';

  const currentIndexLabel = activeTab === 'alpha' 
    ? simulationIndex 
    : activeTab === 'beta' 
    ? betaIndex 
    : deltaIndex;

  return (
    <div className="flex flex-col gap-4 text-zinc-300">
      {/* Feature Log Book Settings */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-cyan-200">ML Feature Log Book Controller</span>
          <span className="text-[10px] text-zinc-500">Record structured indicator features mapping to trade outcomes</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              id="isFeatureLogActive"
              checked={isFeatureLogActive}
              onChange={(e) => setIsFeatureLogActive(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
            />
            <span className="text-xs text-zinc-300 font-medium select-none">Activate the Feature Log</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              id="isVisibilityLogActive"
              checked={isVisibilityLogActive}
              onChange={(e) => setIsVisibilityLogActive(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5"
            />
            <span className="text-xs text-zinc-300 font-medium select-none">Toggle Feature Log Visibility</span>
          </label>
          {featureLog.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all feature log entries?")) {
                  setFeatureLog([]);
                }
              }}
              className="text-[9px] uppercase tracking-wider bg-red-950/40 hover:bg-red-900/40 text-red-400 font-extrabold px-2.5 py-1 rounded border border-red-900/30 transition-colors"
            >
              Clear Log
            </button>
          )}
        </div>
      </div>

      {/* Header & Source Toggle */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Micro-Interval Indicator Engine State Log
          </span>
        </div>
        <div className="flex items-center gap-1.5 p-0.5 bg-zinc-950 border border-zinc-850 rounded-lg">
          <button
            onClick={() => {
              setActiveTab('alpha');
              setExpandedRowIndex(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md duration-150 ${activeTab === 'alpha' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/40' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <Database size={11} />
            Alpha
          </button>
          <button
            onClick={() => {
              setActiveTab('beta');
              setExpandedRowIndex(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md duration-150 ${activeTab === 'beta' ? 'bg-purple-950 text-purple-400 border border-purple-800/40' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <Database size={11} />
            Beta
          </button>
          <button
            onClick={() => {
              setActiveTab('delta');
              setExpandedRowIndex(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase rounded-md duration-150 ${activeTab === 'delta' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' : 'text-zinc-400 hover:text-zinc-200 border border-transparent'}`}
          >
            <Database size={11} />
            Delta
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className={`p-2.5 rounded-lg border text-[10.5px] leading-relaxed flex items-center justify-between bg-zinc-950/40 ${
        activeTab === 'alpha' 
          ? 'border-cyan-950 text-cyan-300/90' 
          : activeTab === 'beta' 
          ? 'border-purple-950 text-purple-300/90'
          : 'border-emerald-950 text-emerald-300/90'
      }`}>
        <div>
          <span className="font-bold uppercase tracking-wider mr-1">Active Stream:</span>
          {activeLabel} (Pointer Index: {currentIndexLabel})
        </div>
        <div className="text-[9px] font-mono opacity-80 uppercase tracking-wider">
          {activeRows.length > 0 ? `${activeRows.length} lookback logs available` : 'Generating simulation...'}
        </div>
      </div>

      {activeRows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/20">
          <Clock size={28} className="text-zinc-650 mb-2 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="text-xs font-semibold text-zinc-500">Awaiting simulation stream initialization...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {activeRows.map((row, idx) => {
            const isExpanded = expandedRowIndex === idx;
            return (
              <div
                key={row.index}
                className={`flex flex-col rounded-xl border duration-150 overflow-hidden ${isExpanded ? 'border-zinc-700 bg-zinc-900/40 shadow-md' : 'border-zinc-800/65 bg-zinc-950/30 hover:border-zinc-750/80 hover:bg-zinc-950/50'}`}
              >
                {/* Accordion Row Header */}
                <div
                  onClick={() => setExpandedRowIndex(isExpanded ? null : idx)}
                  className="flex items-center justify-between p-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-ping' : 'bg-zinc-600'}`}></span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold font-mono text-zinc-200">
                        {idx === 0 ? 'LATEST' : `LOOKBACK -${idx}`}
                      </span>
                      <span className="text-[10px] text-zinc-450 font-mono">
                        Time: {row.timeStr} (Idx: {row.index})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
                      <span className="text-zinc-500">O:<span className="text-zinc-300">{row.open.toFixed(2)}</span></span>
                      <span className="text-zinc-500">H:<span className="text-zinc-300">{row.high.toFixed(2)}</span></span>
                      <span className="text-zinc-500">L:<span className="text-zinc-300">{row.low.toFixed(2)}</span></span>
                      <span className="text-zinc-500">C:<span className="text-zinc-100 font-bold">{row.close.toFixed(2)}</span></span>
                      {(() => {
                        const candlePatternsInd = row.indicators?.find(ind => ind.key === 'candle_patterns');
                        const patternText = candlePatternsInd?.values?.['Pattern'] || 'NONE';
                        const actionSignal = candlePatternsInd?.values?.['Action Signal'] || 'NONE';
                        const patternStr = String(patternText);
                        const actionSignalStr = String(actionSignal);
                        if (patternStr === 'NONE') return null;
                        return (
                          <div className="hidden md:flex items-center gap-1.5 text-[9.5px] font-mono border-l border-zinc-805 pl-3">
                            <span className="text-zinc-550">Pattern:</span>
                            <span className="font-bold text-amber-400 capitalize bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-900/30">
                              {patternStr.toLowerCase().replace(/_/g, ' ')}
                            </span>
                            {actionSignalStr !== 'NONE' && (
                              <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold uppercase border ${
                                actionSignalStr.toLowerCase().includes('bull') 
                                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-900/30' 
                                  : 'bg-rose-950/50 text-rose-400 border-rose-900/30'
                              }`}>
                                {actionSignal}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-zinc-400" /> : <ChevronDown size={14} className="text-zinc-400" />}
                  </div>
                </div>

                {/* Expanded Indicators Grid */}
                {isExpanded && (
                  <div className="border-t border-zinc-850 p-3 bg-zinc-950/70">
                    {/* Compact OHLC metadata on smaller viewports */}
                    <div className="sm:hidden grid grid-cols-4 gap-1.5 font-mono text-[9.5px] p-2 rounded bg-zinc-900 border border-zinc-800 mb-3 text-center">
                      <div className="flex flex-col"><span className="text-zinc-500 text-[8px] uppercase">Open</span><span className="text-zinc-300">{row.open.toFixed(1)}</span></div>
                      <div className="flex flex-col"><span className="text-zinc-500 text-[8px] uppercase">High</span><span className="text-zinc-300">{row.high.toFixed(1)}</span></div>
                      <div className="flex flex-col"><span className="text-zinc-500 text-[8px] uppercase">Low</span><span className="text-zinc-300">{row.low.toFixed(1)}</span></div>
                      <div className="flex flex-col"><span className="text-zinc-400 text-[8px] uppercase">Close</span><span className="text-zinc-100 font-bold">{row.close.toFixed(1)}</span></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {row.indicators.map((ind) => {
                        const isMainStrategy = config && config.type === ind.key;
                        return (
                          <div
                            key={ind.key}
                            className={`p-2.5 rounded-lg border flex flex-col gap-1.5 duration-150 hover:bg-zinc-900/60 ${isMainStrategy ? 'border-cyan-900/60 bg-cyan-950/10' : 'border-zinc-800/80 bg-zinc-900/20'}`}
                          >
                            <div className="flex items-center justify-between border-b border-zinc-850 pb-1.5">
                              <span className="text-[10px] font-bold text-zinc-200">
                                {ind.name}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {isMainStrategy && (
                                  <span className="text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/45">
                                    ACTIVE STRATEGY
                                  </span>
                                )}
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={indicatorCheckedState && indicatorCheckedState[ind.key] !== false}
                                    onChange={(e) => {
                                      setIndicatorCheckedState(prev => ({
                                        ...prev,
                                        [ind.key]: e.target.checked
                                      }));
                                    }}
                                    className="rounded bg-zinc-900 border-zinc-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-3 h-3"
                                    title="Include in ML Feature Log"
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              {Object.entries(ind.values).map(([label, val]) => (
                                <div key={label} className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-zinc-500">{label}:</span>
                                  <span className={`font-semibold ${typeof val === 'string' && (val.includes('BULLISH') || val.includes('HIGH') || val.includes('STRONG')) ? 'text-emerald-400' : typeof val === 'string' && (val.includes('BEARISH') || val.includes('WEAK')) ? 'text-rose-400' : 'text-zinc-150'}`}>
                                    {val}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
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
  );
};
