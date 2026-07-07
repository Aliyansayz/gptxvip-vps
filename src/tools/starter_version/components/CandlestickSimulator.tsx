import React, { useEffect, useState } from 'react';
import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth, calculateADX } from '../functions/api/indicators/baseline';
import { calculateVolatilityZScore } from '../functions/api/indicators/exclusive';
import { linearRegressionSystem } from '../functions/api/indicators/exclusive/linearRegression';
import { calculateSqueeze } from '../functions/api/indicators/exclusive/squeeze_momentum';
import { checkLinearRegressionAdxEntryConditions } from '../functions/api/indicators/exclusive/exclusive_entry_exit';
import { generateDummyCandles } from '../functions/api/data_source/simulated';
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

export const CandlestickSimulator: React.FC<CandlestickSimulatorProps> = ({ config }) => {
  const [data, setData] = useState<Ohlc[]>([]);
  const [simulationIndex, setSimulationIndex] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationMode, setSimulationMode] = useState<'standard' | 'gold_5s' | 'gold_3s'>('gold_5s');

  // Trading State
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const { tradingConfig, setTradingConfig } = useIndicatorsStore();

  const computedIndicators = React.useMemo(() => {
    if (data.length === 0) return null;
    const closePrices = data.map(d => d.close);
    const highs = data.map(d => d.high);
    const lows = data.map(d => d.low);

    const result: any = {};

    if (config.type === 'ma_crossover') {
      result.fastLine = calculateEMA(closePrices, config.fastMa || 9);
      result.slowLine = calculateSMA(closePrices, config.slowMa || 21);
    } else if (config.type === 'supertrend') {
      result.supertrend = calculateSupertrend(data, config.supertrendPeriod || 10, config.supertrendMultiplier || 3);
    } else if (config.type === 'stochastic') {
      result.stochastic = calculateStochastic(data, config.stochK || 14, 3, config.stochD || 3);
    } else if (config.type === 'linear_regression') {
      result.lr = linearRegressionSystem(closePrices, config.lrSlopePeriod || 20, config.lrVolPeriod || 20, config.lrRegimePeriod || 30);
    }

    result.stops = calculateStopBandsSmooth(data, 10, 3.0, false, true);
    
    if (tradingConfig.useADXFilter) {
       result.adx = calculateADX(data, 14);
    }
    if (tradingConfig.useSqueezeFilter) {
       result.squeeze = calculateSqueeze(closePrices, highs, lows);
    }
    const hasZScoreFilters = tradingConfig.exitAfterNCandlesMin || tradingConfig.exitAfterNMinutesMin || tradingConfig.exitAfterNSecondsMin;
    if (hasZScoreFilters) {
       result.zscores = calculateVolatilityZScore(data, 20);
    }

    return result;
  }, [data, config, tradingConfig.useADXFilter, tradingConfig.useSqueezeFilter, tradingConfig.exitAfterNCandlesMin, tradingConfig.exitAfterNMinutesMin, tradingConfig.exitAfterNSecondsMin]);

  useEffect(() => {
    if (simulationMode === 'gold_5s') {
      setData(generateDummyCandles(1000, 2000, 5000, 0.5));
      setTradingConfig(c => ({...c, pipMultiplier: 0.1}));
    } else if (simulationMode === 'gold_3s') {
      setData(generateDummyCandles(1000, 2000, 3000, 0.5));
      setTradingConfig(c => ({...c, pipMultiplier: 0.1}));
    } else {
      setData(generateDummyCandles(300, 100, 60 * 60 * 1000, 1));
      setTradingConfig(c => ({...c, pipMultiplier: 1}));
    }
    setSimulationIndex(50);
    setTrades([]);
  }, [simulationMode]);

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

    let currentSignal: 'LONG' | 'SHORT' | null = null;
    let customStopLossValue: { upper: number, lower: number } | undefined = undefined;

    const ind = computedIndicators;

    if (config.type === 'ma_crossover') {
      const fastLine = ind.fastLine;
      const slowLine = ind.slowLine;
      if (fastLine && slowLine && fastLine.length > simulationIndex) {
        const lastFast = fastLine[simulationIndex];
        const lastSlow = slowLine[simulationIndex];
        const prevFast = fastLine[simulationIndex - 1];
        const prevSlow = slowLine[simulationIndex - 1];
        if (prevFast <= prevSlow && lastFast > lastSlow) currentSignal = 'LONG';
        else if (prevFast >= prevSlow && lastFast < lastSlow) currentSignal = 'SHORT';
      }
    } else if (config.type === 'supertrend') {
      const st = ind.supertrend;
      if (st && st.length > simulationIndex) {
        const lastSt = st[simulationIndex];
        const prevSt = st[simulationIndex - 1];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentSignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentSignal = 'SHORT';
      }
    } else if (config.type === 'stochastic') {
      const stoch = ind.stochastic;
      if (stoch && stoch.k.length > simulationIndex && stoch.d.length > simulationIndex) {
        const lastK = stoch.k[simulationIndex];
        const lastD = stoch.d[simulationIndex];
        const prevK = stoch.k[simulationIndex - 1];
        const prevD = stoch.d[simulationIndex - 1];
        if (prevK <= prevD && lastK > lastD) currentSignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentSignal = 'SHORT';
      }
    } else if (config.type === 'linear_regression') {
      const lr = ind.lr;
      
      const indicatorData = {
        'SIM': {
           secondary: {
             lr_trend_secondary: lr.direction.slice(0, simulationIndex + 1),
             lr_volatality_s: lr.vol_regime.slice(0, simulationIndex + 1),
             lr_reversion_s: lr.reversion.slice(0, simulationIndex + 1),
           }
        }
      };
      
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentSignal = 'LONG';
      else if (entry.status === 'short') currentSignal = 'SHORT';
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
      let updatedTrades = evaluateTradeExits(simulationIndex, visibleData, currentSignal, prevTrades, tradingConfig, zScoreValue);
      const newTrade = evaluateTradeEntries(simulationIndex, visibleData, currentSignal, updatedTrades, tradingConfig, customStopLossValue, adxValue, squeezeStatus);
      if (newTrade) {
        return [...updatedTrades, newTrade];
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
      const newTrade = evaluateTradeEntries(simulationIndex, data.slice(0, simulationIndex + 1), side, prev, { ...tradingConfig, entryOnSignal: true }, customStopLossValue);
      return newTrade ? [...prev, newTrade] : prev;
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

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      <div className="w-full flex-1 flex flex-col bg-zinc-900/60 border border-zinc-800 shadow-inner rounded-xl overflow-hidden min-h-0">
        <SimulatorControls 
          simulationMode={simulationMode}
          onModeChange={setSimulationMode}
          tradingEnabled={tradingEnabled}
          onTradingToggle={setTradingEnabled}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepBack={() => setSimulationIndex(Math.max(50, simulationIndex - 1))}
          onStepForward={() => setSimulationIndex(Math.min(data.length - 1, simulationIndex + 1))}
          typeName={config.type}
        />

        {tradingEnabled && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-800/20 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
             <TradingConfiguration config={tradingConfig} onChange={(c) => setTradingConfig(prev => ({ ...prev, ...c }))} />
             <ManualControls 
               hasActiveTrade={hasActiveTrade} 
               isPlaying={isPlaying} 
               onTrade={handleManualTrade} 
               onExit={handleManualExit} 
             />
          </div>
        )}

        <div className="relative w-full flex-1 min-h-[300px]">
          <CandlestickSimulatorCanvas 
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
      </div>
      {tradingEnabled && <TradeLogBook trades={trades} onReset={handleReset} showPips={simulationMode.startsWith('gold_')} />}
    </div>
  );
};
