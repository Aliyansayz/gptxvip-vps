import React, { useEffect, useState } from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth, calculateADX } from '../functions/api/indicators/baseline';
import { calculateVolatilityZScore } from '../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../functions/api/indicators/exclusive/linearRegression';
import { calculateSqueeze } from '../functions/api/indicators/exclusive/squeeze_momentum';
import { checkLinearRegressionAdxEntryConditions } from '../functions/api/indicators/exclusive/exclusive_entry_exit';
import { generateInitialCandles } from '../../../components/homeMainView/simulatedDataGenerator';
import { generateDummyCandles } from '../functions/api/data_source/simulated_aggregate_alpha';
import { Trade } from '../../types/trading';
import { evaluateTradeEntries, evaluateTradeExits, TradingRulesConfig } from '../functions/api/rules/tradingRules';
import { TradeLogBook } from './TradeLogBook';
import { CandlestickSimulatorCanvas } from './CandlestickSimulatorCanvas';
import { SimulatorControls } from './simulator/SimulatorControls';
import { TradingConfiguration } from './simulator/TradingConfiguration';
import { ManualControls } from './simulator/ManualControls';
import { useIndicatorsStore } from '../stores/indicators_store';

interface Config {
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression';
  fastMa?: number;
  slowMa?: number;
  stochK?: number;
  stochD?: number;
  supertrendPeriod?: number;
  supertrendMultiplier?: number;
  lrSlopePeriod?: number;
  lrVolPeriod?: number;
  lrRegimePeriod?: number;
}

interface CandlestickSimulatorProps {
  config: Config;
}

function aggregateData(source: Ohlc[], factor: number): Ohlc[] {
  if (factor <= 1 || source.length === 0) return source;
  const result: Ohlc[] = [];
  for (let i = 0; i < source.length; i += factor) {
    const chunk = source.slice(i, i + factor);
    result.push({
      time: chunk[chunk.length - 1].time,
      open: chunk[0].open,
      high: Math.max(...chunk.map(c => c.high)),
      low: Math.min(...chunk.map(c => c.low)),
      close: chunk[chunk.length - 1].close,
      volume: chunk.reduce((sum, c) => sum + c.volume, 0)
    });
  }
  return result;
}

import { TradingPanelDataSettings } from './simulator/TradingPanelDataSettings';
import { TradingPanelLeverageSettings } from './simulator/TradingPanelLeverageSettings';
import { TradingPanelTradeSettings } from './simulator/TradingPanelTradeSettings';
import { TradingPanelVolatilityRegime } from './simulator/TradingPanelVolatilityRegime';
import { getBaseInterval, formatInterval, getLowestActiveIntervalDelay } from '../functions/api/rules/dataSourceRules';
import { syncTradeState } from '../functions/api/trade_log_book/syncTradeState';

export const CandlestickSimulator: React.FC<CandlestickSimulatorProps> = ({ config }) => {
  const [panelTab, setPanelTab] = useState<'trading' | 'data' | 'leverage' | 'settings' | 'volatility'>('trading');
  const [data, setData] = useState<Ohlc[]>([]);
  const [simulationIndex, setSimulationIndex] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);

  // Trading State
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { tradingConfig, setTradingConfig, dataSettings, setDataSettings, leverageSettings, indicatorSettings } = useIndicatorsStore();
  const simulationMode = dataSettings.simulationMode;

  const alphaInterval = getBaseInterval(simulationMode);
  const betaInterval = alphaInterval * dataSettings.betaAggregateFactor;
  const deltaInterval = (dataSettings.deltaAggregateSource === 'beta' ? betaInterval : alphaInterval) * dataSettings.deltaAggregateFactor;

  const betaData = React.useMemo(() => aggregateData(data, dataSettings.betaAggregateFactor), [data, dataSettings.betaAggregateFactor]);
  const deltaBaseData = dataSettings.deltaAggregateSource === 'beta' ? betaData : data;
  const deltaData = React.useMemo(() => aggregateData(deltaBaseData, dataSettings.deltaAggregateFactor), [deltaBaseData, dataSettings.deltaAggregateFactor]);

  const betaIndex = Math.floor(simulationIndex / Math.max(1, dataSettings.betaAggregateFactor));
  const deltaFactorForIndex = dataSettings.deltaAggregateSource === 'beta' 
    ? Math.max(1, dataSettings.betaAggregateFactor) * Math.max(1, dataSettings.deltaAggregateFactor)
    : Math.max(1, dataSettings.deltaAggregateFactor);
  const deltaIndex = Math.floor(simulationIndex / deltaFactorForIndex);

  const getDataBySource = (source: string) => {
    if (source === 'beta') return betaData;
    if (source === 'delta') return deltaData;
    return data;
  };

  const getIndexBySource = (source: string) => {
    if (source === 'beta') return betaIndex;
    if (source === 'delta') return deltaIndex;
    return simulationIndex;
  };

  const computedIndicators = React.useMemo(() => {
    if (data.length === 0) return null;
    const result: any = {};

    // Entry signal indicators
    const entryData = getDataBySource(tradingConfig.entrySignalSource || 'alpha');
    const entryClose = entryData.map(d => d.close);
    if (config.type === 'ma_crossover') {
      result.entrySignal = {
        fastLine: calculateEMA(entryClose, config.fastMa || 9),
        slowLine: calculateSMA(entryClose, config.slowMa || 21)
      };
    } else if (config.type === 'supertrend') {
      result.entrySignal = {
        supertrend: calculateSupertrend(entryData, config.supertrendPeriod || 10, config.supertrendMultiplier || 3)
      };
    } else if (config.type === 'stochastic') {
      result.entrySignal = {
        stochastic: calculateStochastic(entryData, config.stochK || 14, 3, config.stochD || 3)
      };
    } else if (config.type === 'linear_regression') {
      result.entrySignal = {
        lr: linearRegressionSystem(entryClose, config.lrSlopePeriod || 20, config.lrVolPeriod || 20, config.lrRegimePeriod || 30)
      };
    }

    // Exit signal indicators
    const exitData = getDataBySource(tradingConfig.exitSignalSource || 'alpha');
    const exitClose = exitData.map(d => d.close);
    if (config.type === 'ma_crossover') {
      result.exitSignal = {
        fastLine: calculateEMA(exitClose, config.fastMa || 9),
        slowLine: calculateSMA(exitClose, config.slowMa || 21)
      };
    } else if (config.type === 'supertrend') {
      result.exitSignal = {
        supertrend: calculateSupertrend(exitData, config.supertrendPeriod || 10, config.supertrendMultiplier || 3)
      };
    } else if (config.type === 'stochastic') {
      result.exitSignal = {
        stochastic: calculateStochastic(exitData, config.stochK || 14, 3, config.stochD || 3)
      };
    } else if (config.type === 'linear_regression') {
      result.exitSignal = {
        lr: linearRegressionSystem(exitClose, config.lrSlopePeriod || 20, config.lrVolPeriod || 20, config.lrRegimePeriod || 30)
      };
    }

    // Stop Loss Indicator
    const slData = getDataBySource(indicatorSettings.stopLossIndicator?.dataSource || 'alpha');
    result.stops = calculateStopBandsSmooth(slData, indicatorSettings.stopLossIndicator?.period || 10, indicatorSettings.stopLossIndicator?.multiplier || 3.0, false, true);

    // Volatility Filters
    const volData = getDataBySource(indicatorSettings.volatility?.dataSource || 'alpha');
    if (tradingConfig.useADXFilter) {
       result.adx = calculateADX(volData, indicatorSettings.volatility.adxPeriod);
    }
    if (tradingConfig.useSqueezeFilter) {
       const volClose = volData.map(d => d.close);
       const volHigh = volData.map(d => d.high);
       const volLow = volData.map(d => d.low);
       result.squeeze = calculateSqueeze(volClose, volHigh, volLow);
    }

    const zScoreData = getDataBySource(indicatorSettings.volatilityRegime?.dataSource || 'alpha');
    const hasZScoreFilters = tradingConfig.exitAfterNCandlesMin || tradingConfig.exitAfterNMinutesMin || tradingConfig.exitAfterNSecondsMin;
    if (hasZScoreFilters) {
       result.zscores = calculateVolatilityZScore(zScoreData, indicatorSettings.volatility.zScorePeriod);
    }

    return result;
  }, [data, betaData, deltaData, config, tradingConfig, indicatorSettings]);

  useEffect(() => {
    const parts = simulationMode.split('_');
    const getBaseCountFromTime = (timeStr: string) => {
      if (timeStr.endsWith('s')) return 1000;
      if (timeStr.endsWith('m')) return 500;
      if (timeStr.endsWith('h')) return 300;
      return 1000;
    };
    
    if (parts.length === 2 && dataSettings.asset) {
      const timeStr = parts[1];
      const count = getBaseCountFromTime(timeStr);
      let stepMs = 1000;
      if (timeStr.endsWith('s')) stepMs = parseInt(timeStr.replace('s', '')) * 1000 || 1000;
      if (timeStr.endsWith('m')) stepMs = (parseInt(timeStr.replace('m', '')) * 60) * 1000 || 60000;
      if (timeStr.endsWith('h')) stepMs = (parseInt(timeStr.replace('h', '')) * 3600) * 1000 || 3600000;

      const baseCandles = generateInitialCandles(dataSettings.asset, 1000);
      const mappedCandles = baseCandles.map((c, i) => ({
        ...c,
        time: Date.now() - (1000 - i) * stepMs,
        volume: Math.random() * 100
      }));

      setData(mappedCandles);
      setTradingConfig(c => ({...c, pipMultiplier: 0.1}));
    } else {
      const baseCandles = generateInitialCandles('Gold', 300);
      const mappedCandles = baseCandles.map((c, i) => ({
        ...c,
        time: Date.now() - (300 - i) * 60 * 60 * 1000,
        volume: Math.random() * 100
      }));
      setData(mappedCandles);
      setTradingConfig(c => ({...c, pipMultiplier: 1}));
    }
    setSimulationIndex(50);
    setTrades([]);
  }, [simulationMode, dataSettings.asset]);

  useEffect(() => {
    let interval: number;
    if (isPlaying && simulationIndex < data.length - 1) {
      interval = window.setInterval(() => {
        setSimulationIndex(prev => prev + 1);
      }, 500); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, simulationIndex, data.length]);

  useEffect(() => {
    if (!tradingEnabled || data.length === 0 || simulationIndex < 1 || !computedIndicators) return;

    let currentEntrySignal: 'LONG' | 'SHORT' | null = null;
    let currentExitSignal: 'LONG' | 'SHORT' | null = null;
    let customStopLossValue: { upper: number, lower: number } | undefined = undefined;

    const ind = computedIndicators;

    // Evaluate Entry Signal
    if (config.type === 'ma_crossover' && ind.entrySignal?.fastLine) {
      const fastLine = ind.entrySignal.fastLine;
      const slowLine = ind.entrySignal.slowLine;
      if (fastLine && slowLine && fastLine.length > simulationIndex) {
        const lastFast = fastLine[simulationIndex];
        const lastSlow = slowLine[simulationIndex];
        const prevFast = fastLine[simulationIndex - 1];
        const prevSlow = slowLine[simulationIndex - 1];
        if (prevFast <= prevSlow && lastFast > lastSlow) currentEntrySignal = 'LONG';
        else if (prevFast >= prevSlow && lastFast < lastSlow) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'supertrend' && ind.entrySignal?.supertrend) {
      const st = ind.entrySignal.supertrend;
      if (st && st.length > simulationIndex) {
        const lastSt = st[simulationIndex];
        const prevSt = st[simulationIndex - 1];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentEntrySignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'stochastic' && ind.entrySignal?.stochastic) {
      const stoch = ind.entrySignal.stochastic;
      if (stoch && stoch.k.length > simulationIndex && stoch.d.length > simulationIndex) {
        const lastK = stoch.k[simulationIndex];
        const lastD = stoch.d[simulationIndex];
        const prevK = stoch.k[simulationIndex - 1];
        const prevD = stoch.d[simulationIndex - 1];
        if (prevK <= prevD && lastK > lastD) currentEntrySignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'linear_regression' && ind.entrySignal?.lr) {
      const lr = ind.entrySignal.lr;
      const indicatorData = {
        'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, simulationIndex + 1), lr_volatality_s: lr.vol_regime.slice(0, simulationIndex + 1), lr_reversion_s: lr.reversion.slice(0, simulationIndex + 1) } }
      };
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentEntrySignal = 'LONG';
      else if (entry.status === 'short') currentEntrySignal = 'SHORT';
    }

    // Evaluate Exit Signal
    if (config.type === 'ma_crossover' && ind.exitSignal?.fastLine) {
      const fastLine = ind.exitSignal.fastLine;
      const slowLine = ind.exitSignal.slowLine;
      if (fastLine && slowLine && fastLine.length > simulationIndex) {
        const lastFast = fastLine[simulationIndex];
        const lastSlow = slowLine[simulationIndex];
        const prevFast = fastLine[simulationIndex - 1];
        const prevSlow = slowLine[simulationIndex - 1];
        if (prevFast <= prevSlow && lastFast > lastSlow) currentExitSignal = 'LONG';
        else if (prevFast >= prevSlow && lastFast < lastSlow) currentExitSignal = 'SHORT';
      }
    } else if (config.type === 'supertrend' && ind.exitSignal?.supertrend) {
      const st = ind.exitSignal.supertrend;
      if (st && st.length > simulationIndex) {
        const lastSt = st[simulationIndex];
        const prevSt = st[simulationIndex - 1];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentExitSignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentExitSignal = 'SHORT';
      }
    } else if (config.type === 'stochastic' && ind.exitSignal?.stochastic) {
      const stoch = ind.exitSignal.stochastic;
      if (stoch && stoch.k.length > simulationIndex && stoch.d.length > simulationIndex) {
        const lastK = stoch.k[simulationIndex];
        const lastD = stoch.d[simulationIndex];
        const prevK = stoch.k[simulationIndex - 1];
        const prevD = stoch.d[simulationIndex - 1];
        if (prevK <= prevD && lastK > lastD) currentExitSignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentExitSignal = 'SHORT';
      }
    } else if (config.type === 'linear_regression' && ind.exitSignal?.lr) {
      const lr = ind.exitSignal.lr;
      const indicatorData = {
        'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, simulationIndex + 1), lr_volatality_s: lr.vol_regime.slice(0, simulationIndex + 1), lr_reversion_s: lr.reversion.slice(0, simulationIndex + 1) } }
      };
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentExitSignal = 'LONG';
      else if (entry.status === 'short') currentExitSignal = 'SHORT';
    }

    if (tradingConfig.useStopLoss && ind.stops) {
       customStopLossValue = {
         upper: ind.stops.upperBand[simulationIndex],
         lower: ind.stops.lowerBand[simulationIndex]
       };
    }

    let adxValue: number | undefined = undefined;
    if (tradingConfig.useADXFilter && ind.adx) {
      adxValue = ind.adx.adx[simulationIndex];
    }

    let squeezeStatus: number | undefined = undefined;
    if (tradingConfig.useSqueezeFilter && ind.squeeze) {
      squeezeStatus = ind.squeeze.squeeze_status[simulationIndex];
    }

    let zScoreValue: number | undefined = undefined;
    if (ind.zscores) {
      zScoreValue = ind.zscores[simulationIndex];
    }

    const visibleData = data.slice(0, simulationIndex + 1);

    setTrades(prevTrades => {
      let closedPnL = prevTrades.filter(t => t.status === 'CLOSED').reduce((sum, t) => sum + (t.pnl || 0), 0);
      let currentBalance = leverageSettings.balance + closedPnL;

      let updatedTrades = evaluateTradeExits(simulationIndex, visibleData, currentExitSignal, prevTrades, tradingConfig, zScoreValue, leverageSettings, currentBalance, latencyDelaySeconds);
      
      const newlyClosedPnL = updatedTrades.filter(t => t.status === 'CLOSED' && prevTrades.find(pt => pt.id === t.id)?.status === 'OPEN').reduce((sum, t) => sum + (t.pnl || 0), 0);
      currentBalance += newlyClosedPnL;

      const newTrades = evaluateTradeEntries(simulationIndex, visibleData, currentEntrySignal, updatedTrades, tradingConfig, customStopLossValue, adxValue, squeezeStatus, leverageSettings, currentBalance);
      if (newTrades.length > 0) {
        return [...updatedTrades, ...newTrades];
      }
      return updatedTrades;
    });

  }, [simulationIndex, tradingEnabled, config, data, tradingConfig, computedIndicators]);

  const handleManualTrade = (side: 'LONG' | 'SHORT') => {
    if (data.length === 0 || simulationIndex < 1) return;
    let customStopLossValue = undefined;

    if (tradingConfig.useStopLoss) {
      const stops = calculateStopBandsSmooth(data.slice(0, simulationIndex + 1), 10, 3.0, false, true);
      customStopLossValue = {
         upper: stops.upperBand[stops.upperBand.length - 1],
         lower: stops.lowerBand[stops.lowerBand.length - 1]
      };
    }

    setTrades(prev => {
      let activeTrade = prev.find(t => t.status === 'OPEN');
      if (activeTrade) return prev; 
      
      let closedPnL = prev.filter(t => t.status === 'CLOSED').reduce((sum, t) => sum + (t.pnl || 0), 0);
      let currentBalance = leverageSettings.balance + closedPnL;

      const newTrades = evaluateTradeEntries(simulationIndex, data.slice(0, simulationIndex + 1), side, prev, { ...tradingConfig, entryOnSignal: true }, customStopLossValue, undefined, undefined, leverageSettings, currentBalance);
      return newTrades.length > 0 ? [...prev, ...newTrades] : prev;
    });
  };

  const handleManualExit = () => {
    if (data.length === 0 || simulationIndex < 1) return;
    const currentCandle = data[simulationIndex];
    setTrades(prev => prev.map(t => {
      if (t.status === 'OPEN') {
         const pnl = t.side === 'LONG' 
          ? currentCandle.close - t.entryPrice 
          : t.entryPrice - currentCandle.close;
         return {
           ...t,
           status: 'CLOSED',
           exitPrice: currentCandle.close,
           exitTime: currentCandle.time,
           exitIndex: simulationIndex,
           exitReason: 'MANUAL',
           pnl
         };
      }
      return t;
    }));
  }

  const handleReset = () => {
    setTrades([]);
    setSimulationIndex(50);
  }

  const hasActiveTrade = trades.some(t => t.status === 'OPEN');

  const latencyDelaySeconds = React.useMemo(() => {
    return getLowestActiveIntervalDelay(
      dataSettings.showAlpha,
      dataSettings.showBeta,
      dataSettings.showDelta,
      simulationMode,
      dataSettings.betaAggregateFactor,
      dataSettings.deltaAggregateFactor,
      dataSettings.deltaAggregateSource
    );
  }, [
    dataSettings.showAlpha, dataSettings.showBeta, dataSettings.showDelta,
    simulationMode, dataSettings.betaAggregateFactor, dataSettings.deltaAggregateFactor,
    dataSettings.deltaAggregateSource
  ]);

  const syncedState = React.useMemo(() => {
    if (trades.length === 0) return { mainTrades: [], recurrentTrades: [] };
    return syncTradeState(trades, data, betaData, deltaData, simulationIndex, leverageSettings, latencyDelaySeconds);
  }, [trades, data, betaData, deltaData, simulationIndex, leverageSettings, latencyDelaySeconds]);

  const displayTrades = React.useMemo(() => {
    const allActive = [...syncedState.mainTrades, ...syncedState.recurrentTrades];
    return trades.map(t => {
      if (t.status === 'OPEN') {
        const active = allActive.find(a => a.trade.id === t.id);
        if (active) {
          return {
            ...t,
            pnl: active.currentPnl,
            pips: active.currentPips
          };
        }
      }
      return t;
    });
  }, [trades, syncedState]);

  return (
    <div className="w-full h-full flex flex-col min-h-0 gap-4">
      <div className="w-full shrink-0 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-hidden">
        <SimulatorControls 
          tradingEnabled={tradingEnabled}
          onTradingToggle={setTradingEnabled}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepBack={() => setSimulationIndex(Math.max(50, simulationIndex - 1))}
          onStepForward={() => setSimulationIndex(Math.min(data.length - 1, simulationIndex + 1))}
          typeName={config.type}
          isPanelOpen={isPanelOpen}
          onTogglePanel={() => setIsPanelOpen(!isPanelOpen)}
        />

        {isPanelOpen && (
          <div className="border-t border-zinc-800 bg-zinc-800/20 shrink-0">
            <div className="flex border-b border-zinc-800/50">
               <button onClick={() => setPanelTab('trading')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'trading' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trading & Controls</button>
               <button onClick={() => setPanelTab('settings')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'settings' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Trade Settings</button>
               <button onClick={() => setPanelTab('data')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'data' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Data Layer Config</button>
               <button onClick={() => setPanelTab('leverage')} className={`px-4 py-2 text-xs font-semibold ${panelTab === 'leverage' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-400 hover:text-zinc-200'}`}>Leverage Mode</button>
            </div>
            <div className="p-4">
              {panelTab === 'trading' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <TradingConfiguration config={tradingConfig} onChange={(c) => setTradingConfig(prev => ({ ...prev, ...c }))} />
                   <ManualControls 
                     hasActiveTrade={hasActiveTrade} 
                     isPlaying={isPlaying} 
                     onTrade={handleManualTrade} 
                     onExit={handleManualExit} 
                   />
                </div>
              )}
              {panelTab === 'settings' && <TradingPanelTradeSettings />}
              {panelTab === 'data' && <TradingPanelDataSettings />}
              {panelTab === 'leverage' && <TradingPanelLeverageSettings />}
            </div>
          </div>
        )}
      </div>

      <div className="w-full flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-y-auto custom-scrollbar min-h-0">
        <div className={`relative w-full flex flex-col min-h-max`}>
          <div className="p-4 border-b border-zinc-800">
             <TradingPanelVolatilityRegime data={data} simulationIndex={simulationIndex} />
          </div>
          {dataSettings.showAlpha && (
            <div className="w-full h-[550px] relative shrink-0">
              <CandlestickSimulatorCanvas 
                title={`Alpha Base (${formatInterval(alphaInterval)})`}
                data={data}
                simulationIndex={simulationIndex}
                config={{
                  ...config,
                  exitAfterNCandlesMin: tradingConfig.exitAfterNCandlesMin,
                  exitAfterNCandlesMax: tradingConfig.exitAfterNCandlesMax,
                  exitAfterNMinutesMin: tradingConfig.exitAfterNMinutesMin,
                  exitAfterNMinutesMax: tradingConfig.exitAfterNMinutesMax,
                  exitAfterNSecondsMin: tradingConfig.exitAfterNSecondsMin,
                  exitAfterNSecondsMax: tradingConfig.exitAfterNSecondsMax,
                }}
                trades={trades}
                tradingEnabled={tradingEnabled}
                useStopLoss={tradingConfig.useStopLoss}
                useADXFilter={tradingConfig.useADXFilter}
                adxThreshold={tradingConfig.adxThreshold}
                useSqueezeFilter={tradingConfig.useSqueezeFilter}
              />
            </div>
          )}
          {dataSettings.showBeta && (
            <div className={`w-full h-[350px] relative shrink-0 ${dataSettings.showAlpha ? 'border-t border-zinc-800' : ''}`}>
              <CandlestickSimulatorCanvas 
                title={`Beta (${formatInterval(betaInterval)})`}
                data={betaData}
                simulationIndex={betaIndex}
                config={config}
                trades={[]}
                tradingEnabled={false}
                useStopLoss={false}
                hideIndicators={true}
              />
            </div>
          )}
          {dataSettings.showDelta && (
            <div className={`w-full h-[350px] relative shrink-0 ${(dataSettings.showAlpha || dataSettings.showBeta) ? 'border-t border-zinc-800' : ''}`}>
              <CandlestickSimulatorCanvas 
                title={`Delta (${formatInterval(deltaInterval)})`}
                data={deltaData}
                simulationIndex={deltaIndex}
                config={config}
                trades={[]}
                tradingEnabled={false}
                useStopLoss={false}
                hideIndicators={true}
              />
            </div>
          )}
        </div>
      </div>
      {tradingEnabled && <TradeLogBook trades={displayTrades} onReset={handleReset} showPips={simulationMode.startsWith('gold_')} />}
    </div>
  );
};
