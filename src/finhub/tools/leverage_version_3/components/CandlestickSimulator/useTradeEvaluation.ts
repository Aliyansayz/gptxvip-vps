import React, { useEffect } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { Trade } from '../../../types/trading';
import { evaluateTradeEntries, evaluateTradeExits } from '../../functions/api/rules/tradingRules';
import { updateTrailSL } from '../../functions/api/middleware/updateTrailSL';
import { evaluateRecurrentTradeEntries } from '../../functions/api/rules/tradingRecurrentTradeRules';
import { determineFlipTradeSignal } from '../../functions/api/tradeState/flipMainTrade';
import { checkLinearRegressionAdxEntryConditions } from '../../functions/api/indicators/exclusive/exclusive_entry_exit';
import { calculateVolatilityScenario } from '../../functions/api/indicators/exclusive/volatilityBehavior';
import { getEligibleRootAccount } from '../../functions/api/accountState/accountEligibleToTrade';
import { shouldActivateTradeBreaker } from '../../functions/api/tradeBreaker/tradeBreakerByEquity';
import { evaluateConjunctionSystem } from '../../functions/api/conjunctionSystem';
import { evaluateDisjunctionSystem } from '../../functions/api/disjunctionSystem';
import { Config } from './types';
import { ParallelAccount, useIndicatorsStore } from '../../stores/indicators_store';
import { calculatePnL } from '../../functions/api/position_sizing/leveragedPositionSizeMetals';

// NOTE: calculatePnL module is dynamically required below due to leveraging.
const getBaseSystemId = (id: string) => id.replace('_alpha', '').replace('_beta', '').replace('_delta', '');

export function useTradeEvaluation(
  simulationIndex: number,
  tradingEnabled: boolean,
  config: Config,
  data: Ohlc[],
  tradingConfig: any,
  computedIndicators: any,
  leverageSettings: any,
  setTrades: React.Dispatch<React.SetStateAction<Trade[]>>,
  latencyDelaySeconds: number,
  parallelAccounts: ParallelAccount[],
  assetName: string,
  serialTradingEnabled: boolean,
  setTradingConfig?: any,
  betaData?: Ohlc[],
  deltaData?: Ohlc[],
  indicatorSettings?: any
) {
  let onLogCallback: any = undefined;
  try {
    const store = useIndicatorsStore();
    if (store && 'systemDeployLog' in store) {
      onLogCallback = (store as any).systemDeployLog;
    }
  } catch (e) {
    // context not available/different provider version
  }

  useEffect(() => {
    if (!tradingEnabled || data.length === 0 || simulationIndex < 1 || !computedIndicators) return;

    let currentEntrySignal: 'LONG' | 'SHORT' | null = null;
    let currentExitSignal: 'LONG' | 'SHORT' | null = null;
    let customStopLossValue: { upper: number, lower: number } | undefined = undefined;

    const ind = computedIndicators;

    // Helper mapping alpha simulationIndex timestamp to relative index of beta or delta arrays
    const getMappedIndex = (sourceStr: string | undefined): number => {
      const source = sourceStr || 'alpha';
      if (source === 'alpha') return simulationIndex;
      if (!data[simulationIndex]) return simulationIndex;
      
      const time = data[simulationIndex].time;
      const dataset = source === 'beta' ? betaData : deltaData;
      
      if (!dataset || dataset.length === 0 || dataset[0].time > time) return -1;
      
      let left = 0;
      let right = dataset.length - 1;
      let best = 0;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (dataset[mid].time <= time) {
          best = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      return best;
    };

    const entryType = config.type;
    const entryDataSource = tradingConfig.entrySignalSource || 'alpha';
    const entryIndex = getMappedIndex(entryDataSource);

    const exitType = tradingConfig.exitSignalSystemType || config.type;
    const exitDataSource = tradingConfig.exitSignalSource || 'alpha';
    const exitIndex = getMappedIndex(exitDataSource);

    const volDataSource = indicatorSettings?.volatility?.dataSource || 'alpha';
    const volIndex = getMappedIndex(volDataSource);

    const zScoreDataSource = indicatorSettings?.volatilityRegime?.dataSource || 'alpha';
    const zScoreIndex = getMappedIndex(zScoreDataSource);

    const slDataSource = indicatorSettings?.stopLossIndicator?.dataSource || 'alpha';
    const slIndex = getMappedIndex(slDataSource);

    const tsDataSource = indicatorSettings?.trendStrength?.dataSource || 'alpha';
    const tsIndex = getMappedIndex(tsDataSource);

    const getSignalForComputed = (sysType: string, computedSig: any, idx: number, sourceData: Ohlc[]) => {
      if (idx < 0) return null;
      let signal: 'LONG' | 'SHORT' | null = null;
      if (sysType === 'ma_crossover' && computedSig?.fastLine) {
        const fastLine = computedSig.fastLine;
        const slowLine = computedSig.slowLine;
        if (fastLine && slowLine && fastLine.length > idx) {
          const lastFast = fastLine[idx];
          const lastSlow = slowLine[idx];
          const prevFast = fastLine[Math.max(0, idx - 1)];
          const prevSlow = slowLine[Math.max(0, idx - 1)];
          if (prevFast <= prevSlow && lastFast > lastSlow) signal = 'LONG';
          else if (prevFast >= prevSlow && lastFast < lastSlow) signal = 'SHORT';
        }
      } else if (sysType === 'supertrend' && computedSig?.supertrend) {
        const st = computedSig.supertrend;
        if (st && st.trend && st.trend.length > idx) {
          const lastSt = st.trend[idx];
          const prevSt = st.trend[Math.max(0, idx - 1)];
          if (prevSt === -1 && lastSt === 1) signal = 'LONG';
          else if (prevSt === 1 && lastSt === -1) signal = 'SHORT';
        }
      } else if ((sysType === 'stochastic' || sysType === 'divergence') && computedSig?.stochastic) {
        const stoch = computedSig.stochastic;
        if (stoch && stoch.k.length > idx && stoch.d.length > idx) {
          const lastK = stoch.k[idx];
          const lastD = stoch.d[idx];
          const prevK = stoch.k[Math.max(0, idx - 1)];
          const prevD = stoch.d[Math.max(0, idx - 1)];
          if (prevK <= prevD && lastK > lastD) signal = 'LONG';
          else if (prevK >= prevD && lastK < lastD) signal = 'SHORT';
        }
      } else if (sysType === 'linear_regression' && computedSig?.lr) {
        const lr = computedSig.lr;
        const indicatorData = {
          'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, idx + 1), lr_volatality_s: lr.vol_regime.slice(0, idx + 1), lr_reversion_s: lr.reversion.slice(0, idx + 1) } }
        };
        const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
        if (entry.status === 'long') signal = 'LONG';
        else if (entry.status === 'short') signal = 'SHORT';
      } else if (sysType === 'bollinger_bands' && computedSig?.bb) {
        if (computedSig.longEntry?.[idx]) signal = 'LONG';
        else if (computedSig.shortEntry?.[idx]) signal = 'SHORT';
      } else if (sysType === 'ichimoku' && computedSig?.ichimoku) {
        if (computedSig.ichimoku.longEntry[idx]) signal = 'LONG';
        else if (computedSig.ichimoku.shortEntry[idx]) signal = 'SHORT';
      } else if (sysType === 'three_candle_strike' && computedSig?.strike) {
        if (computedSig.strike.longEntry[idx]) signal = 'LONG';
        else if (computedSig.strike.shortEntry[idx]) signal = 'SHORT';
      } else if (sysType === 'turtle_trading' && computedSig?.turtle) {
        const isNewSourceBar = sourceData[idx]?.time > (data[simulationIndex - 1]?.time ?? -Infinity);
        if (isNewSourceBar && computedSig.turtle.longEntry[idx]) signal = 'LONG';
        else if (isNewSourceBar && computedSig.turtle.shortEntry[idx]) signal = 'SHORT';
      } else if (sysType === 'supertrend_regime' && computedSig?.supertrend_regime) {
        const sr = computedSig.supertrend_regime;
        if (sr && sr.signal && sr.signal.length > idx) {
          const lastSignal = sr.signal[idx];
          const prevSignal = sr.signal[Math.max(0, idx - 1)];
          if (prevSignal <= 0 && lastSignal === 1) signal = 'LONG';
          else if (prevSignal >= 0 && lastSignal === -1) signal = 'SHORT';
        }
      } else if (sysType === 'heikin_ashi_smoothed' && computedSig?.heikin_ashi_smoothed) {
        const ha = computedSig.heikin_ashi_smoothed;
        if (ha && ha.haClose && ha.haClose.length > idx) {
          const lastClose = ha.haClose[idx];
          const lastOpen = ha.haOpen[idx];
          const prevClose = ha.haClose[Math.max(0, idx - 1)];
          const prevOpen = ha.haOpen[Math.max(0, idx - 1)];
          if (prevClose <= prevOpen && lastClose > lastOpen) signal = 'LONG';
          else if (prevClose >= prevOpen && lastClose < lastOpen) signal = 'SHORT';
        }
      } else if (sysType === 'candlestick_pattern' && computedSig?.candlestick_pattern) {
        const cp = computedSig.candlestick_pattern;
        if (cp && cp.action_signal && cp.action_signal.length > idx) {
          const action = cp.action_signal[idx];
          if (action === 'bullish_action') signal = 'LONG';
          else if (action === 'bearish_action') signal = 'SHORT';
        }
      }
      return signal;
    };

    const getTrendForComputed = (sysType: string, computedSig: any, idx: number, sourceData: Ohlc[]) => {
      if (idx < 0) return null;
      let trend: 'LONG' | 'SHORT' | null = null;
      if (sysType === 'ma_crossover' && computedSig?.fastLine) {
        const fastLine = computedSig.fastLine;
        const slowLine = computedSig.slowLine;
        if (fastLine && slowLine && fastLine.length > idx) {
          if (fastLine[idx] > slowLine[idx]) trend = 'LONG';
          else if (fastLine[idx] < slowLine[idx]) trend = 'SHORT';
        }
      } else if (sysType === 'supertrend' && computedSig?.supertrend) {
        const st = computedSig.supertrend;
        if (st && st.trend && st.trend.length > idx) {
          if (st.trend[idx] === 1) trend = 'LONG';
          else if (st.trend[idx] === -1) trend = 'SHORT';
        }
      } else if ((sysType === 'stochastic' || sysType === 'divergence') && computedSig?.stochastic) {
        const stoch = computedSig.stochastic;
        if (stoch && stoch.k.length > idx && stoch.d.length > idx) {
          if (stoch.k[idx] > stoch.d[idx]) trend = 'LONG';
          else if (stoch.k[idx] < stoch.d[idx]) trend = 'SHORT';
        }
      } else if (sysType === 'linear_regression' && computedSig?.lr) {
         const lr = computedSig.lr;
         if (lr && lr.direction && lr.direction.length > idx) {
             const dir = lr.direction[idx];
             if (dir === 1) trend = 'LONG';
             else if (dir === -1) trend = 'SHORT';
         }
      } else if (sysType === 'bollinger_bands' && computedSig?.bb) {
         if (computedSig.trend?.[idx] === 1) trend = 'LONG';
         else if (computedSig.trend?.[idx] === -1) trend = 'SHORT';
      } else if (sysType === 'ichimoku' && computedSig?.ichimoku) {
         if (computedSig.ichimoku.trend[idx] === 1) trend = 'LONG';
         else if (computedSig.ichimoku.trend[idx] === -1) trend = 'SHORT';
      } else if (sysType === 'three_candle_strike' && computedSig?.strike) {
         if (computedSig.strike.trend[idx] === 1) trend = 'LONG';
         else if (computedSig.strike.trend[idx] === -1) trend = 'SHORT';
      } else if (sysType === 'turtle_trading' && computedSig?.turtle) {
         if (computedSig.turtle.trend[idx] === 1) trend = 'LONG';
         else if (computedSig.turtle.trend[idx] === -1) trend = 'SHORT';
      } else if (sysType === 'supertrend_regime' && computedSig?.supertrend_regime) {
        const sr = computedSig.supertrend_regime;
        if (sr && sr.signal && sr.signal.length > idx) {
           if (sr.signal[idx] === 1) trend = 'LONG';
           else if (sr.signal[idx] === -1) trend = 'SHORT';
        }
      } else if (sysType === 'heikin_ashi_smoothed' && computedSig?.heikin_ashi_smoothed) {
        const ha = computedSig.heikin_ashi_smoothed;
        if (ha && ha.haClose && ha.haClose.length > idx) {
           if (ha.haClose[idx] > ha.haOpen[idx]) trend = 'LONG';
           else if (ha.haClose[idx] < ha.haOpen[idx]) trend = 'SHORT';
        }
      } else if (sysType === 'candlestick_pattern' && computedSig?.candlestick_pattern) {
        const cp = computedSig.candlestick_pattern;
        if (cp && cp.action_signal && cp.action_signal.length > idx) {
          const action = cp.action_signal[idx];
          if (action === 'bullish_action') trend = 'LONG';
          else if (action === 'bearish_action') trend = 'SHORT';
        }
      }
      return trend;
    };

    const getDataBySource = (source: string) => {
      if (source === 'beta' && betaData) return betaData;
      if (source === 'delta' && deltaData) return deltaData;
      return data;
    };

    // Evaluate Entry Signal
    if (tradingConfig.activeSystemMode === 'conjunction' && ind.entrySignal?.type === 'conjunction') {
      const activeSystems = tradingConfig.activeConjunctionSystems || [];
      const signals = activeSystems.map((sysId: string) => {
         const comp = ind.entrySignal.conjunctionSignals[sysId];
         const sysEntrySource = (indicatorSettings[sysId as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[sysId as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
         const sysIndex = getMappedIndex(sysEntrySource);
         return getSignalForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysEntrySource));
      });
      const trends = activeSystems.map((sysId: string) => {
         const comp = ind.entrySignal.conjunctionSignals[sysId];
         const sysEntrySource = (indicatorSettings[sysId as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[sysId as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
         const sysIndex = getMappedIndex(sysEntrySource);
         return getTrendForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysEntrySource));
      });
      let trigSignal: 'LONG' | 'SHORT' | null = null;
      if (activeSystems.length > 0 && signals.some(s => s === 'LONG') && trends.every(t => t === 'LONG')) {
          trigSignal = 'LONG';
      } else if (activeSystems.length > 0 && signals.some(s => s === 'SHORT') && trends.every(t => t === 'SHORT')) {
          trigSignal = 'SHORT';
      }
      currentEntrySignal = trigSignal;
    } else if (tradingConfig.activeSystemMode === 'disjunction' && ind.entrySignal?.type === 'disjunction') {
      const activeSystems = tradingConfig.activeDisjunctionSystems || [];
      const signals = activeSystems.map((sysId: string) => {
         const comp = ind.entrySignal.disjunctionSignals[sysId];
         const sysEntrySource = (indicatorSettings[sysId as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[sysId as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
         const sysIndex = getMappedIndex(sysEntrySource);
         return getSignalForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysEntrySource));
      });
      currentEntrySignal = evaluateDisjunctionSystem(signals);
    } else {
      const sysEntrySource = (indicatorSettings[config.type as keyof typeof indicatorSettings] as any)?.entrySignalSource || indicatorSettings[config.type as keyof typeof indicatorSettings]?.dataSource || entryDataSource;
      const sysIndex = getMappedIndex(sysEntrySource);
      currentEntrySignal = getSignalForComputed(config.type, ind.entrySignal, sysIndex, getDataBySource(sysEntrySource));
    }

    // Evaluate Exit Signal
    if (!tradingConfig.useDifferentSignalSystemOnExit) {
      currentExitSignal = currentEntrySignal;
      if (tradingConfig.activeSystemMode === 'classic' && config.type === 'turtle_trading') {
        const source = indicatorSettings?.turtle_trading?.entrySignalSource || indicatorSettings?.turtle_trading?.dataSource || entryDataSource;
        const turtleIndex = getMappedIndex(source);
        const turtle = ind.entrySignal?.turtle;
        if (turtleIndex >= 0 && turtle?.exitLong?.[turtleIndex]) currentExitSignal = 'SHORT';
        else if (turtleIndex >= 0 && turtle?.exitShort?.[turtleIndex]) currentExitSignal = 'LONG';
        else currentExitSignal = null;
      }
    } else if (tradingConfig.exitSignalSystemMode === 'conjunction' && ind.exitSignal?.type === 'conjunction') {
      const activeExitSystems = tradingConfig.exitActiveConjunctionSystems || [];
      const signals = activeExitSystems.map((sysId: string) => {
         const comp = ind.exitSignal.conjunctionSignals[sysId];
         const cfg = tradingConfig.exitUseExplicitParams ? (tradingConfig.exitConjunctionParams?.[sysId] || {}) : ((indicatorSettings[sysId as keyof typeof indicatorSettings] as any) || {});
         const sysExitSource = cfg.exitSignalSource || tradingConfig.exitSignalSource || cfg.entrySignalSource || cfg.dataSource || 'alpha';
         const sysIndex = getMappedIndex(sysExitSource);
         return getSignalForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysExitSource));
      });
      const trends = activeExitSystems.map((sysId: string) => {
         const comp = ind.exitSignal.conjunctionSignals[sysId];
         const cfg = tradingConfig.exitUseExplicitParams ? (tradingConfig.exitConjunctionParams?.[sysId] || {}) : ((indicatorSettings[sysId as keyof typeof indicatorSettings] as any) || {});
         const sysExitSource = cfg.exitSignalSource || tradingConfig.exitSignalSource || cfg.entrySignalSource || cfg.dataSource || 'alpha';
         const sysIndex = getMappedIndex(sysExitSource);
         return getTrendForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysExitSource));
      });
      let trigSignal: 'LONG' | 'SHORT' | null = null;
      if (signals.some(s => s === 'LONG') && trends.every(t => t === 'LONG')) {
          trigSignal = 'LONG';
      } else if (signals.some(s => s === 'SHORT') && trends.every(t => t === 'SHORT')) {
          trigSignal = 'SHORT';
      }
      currentExitSignal = trigSignal;
    } else if (tradingConfig.useDifferentSignalSystemOnExit && tradingConfig.exitSignalSystemMode === 'disjunction' && ind.exitSignal?.type === 'disjunction') {
      const activeExitSystems = tradingConfig.exitActiveDisjunctionSystems || [];
      const signals = activeExitSystems.map((sysId: string) => {
         const comp = ind.exitSignal.disjunctionSignals[sysId];
         const cfg = tradingConfig.exitUseExplicitParams ? (tradingConfig.exitDisjunctionParams?.[sysId] || {}) : ((indicatorSettings[sysId as keyof typeof indicatorSettings] as any) || {});
         const sysExitSource = cfg.exitSignalSource || tradingConfig.exitSignalSource || cfg.entrySignalSource || cfg.dataSource || 'alpha';
         const sysIndex = getMappedIndex(sysExitSource);
         return getSignalForComputed(getBaseSystemId(sysId), comp, sysIndex, getDataBySource(sysExitSource));
      });
      currentExitSignal = evaluateDisjunctionSystem(signals);
    } else {
      const resolvedExitType = ind.exitSignal?.type || exitType;
      const sysExitDataSource = exitDataSource;
      const sysExitIndex = getMappedIndex(sysExitDataSource);
      currentExitSignal = getSignalForComputed(resolvedExitType, ind.exitSignal, sysExitIndex, getDataBySource(sysExitDataSource));
    }

    if (tradingConfig.useStopLoss && ind.stops) {
       customStopLossValue = {
         upper: ind.stops.upperBand[slIndex],
         lower: ind.stops.lowerBand[slIndex]
       };
    }

    const isClassicTurtle = tradingConfig.activeSystemMode === 'classic' && config.type === 'turtle_trading';
    let entryStopLossValue = customStopLossValue;
    let turtleExitLevels: { lower: number; upper: number } | null = null;
    if (isClassicTurtle) {
      const source = indicatorSettings?.turtle_trading?.entrySignalSource || indicatorSettings?.turtle_trading?.dataSource || entryDataSource;
      const turtleIndex = getMappedIndex(source);
      const turtle = ind.entrySignal?.turtle;
      if (turtleIndex >= 0 && Number.isFinite(turtle?.n?.[turtleIndex])) {
        entryStopLossValue = { lower: turtle.stopLower[turtleIndex], upper: turtle.stopUpper[turtleIndex] };
        if (!tradingConfig.useDifferentSignalSystemOnExit) {
          turtleExitLevels = { lower: turtle.exitLower[turtleIndex], upper: turtle.exitUpper[turtleIndex] };
        }
      }
    }
    const turtleRules = isClassicTurtle
      ? { ...tradingConfig, useStopLoss: true, useTakeProfit: false,
          exitOnSignalReversal: tradingConfig.useDifferentSignalSystemOnExit ? tradingConfig.exitOnSignalReversal : true,
          partialTradeExitOnReversal: false }
      : tradingConfig;

    let adxValue: number | undefined = undefined;
    if (tradingConfig.useADXFilter && ind.adx) {
      adxValue = ind.adx?.adx?.[volIndex];
    }

    let slopePersistenceValue: number | undefined = undefined;
    if (tradingConfig.useSlopePersistenceFilter && ind.slopePersistence) {
      slopePersistenceValue = ind.slopePersistence[tsIndex];
    }

    let trendEfficiencyValue: number | undefined = undefined;
    if (tradingConfig.useTrendEfficiencyFilter && ind.trendEfficiency) {
      trendEfficiencyValue = ind.trendEfficiency[tsIndex] ?? undefined;
    }

    let wickEfficiencyValue: number | undefined = undefined;
    if (tradingConfig.useWickEfficiencyFilter && ind.wickEfficiency) {
      wickEfficiencyValue = ind.wickEfficiency[tsIndex] ?? undefined;
    }

    let squeezeStatus: number | undefined = undefined;
    if (tradingConfig.useSqueezeFilter && ind.squeeze) {
      squeezeStatus = ind.squeeze.squeeze_status[volIndex];
    }

    let zScoreValue: number | undefined = undefined;
    if (ind.zscores) {
      zScoreValue = ind.zscores[zScoreIndex];
    }

    const visibleData = data.slice(0, simulationIndex + 1);

    let volRegimeScenario: 'A'|'B'|'C'|'D'|'None' = 'None';
    if (tradingConfig.useVolRegimeScenarioA || tradingConfig.useVolRegimeScenarioC) {
       volRegimeScenario = calculateVolatilityScenario(visibleData.map(d => d.close));
    }

    setTrades(prevTrades => {
      // Evaluate balances for serial trading
      const eligibleAccountId = getEligibleRootAccount(prevTrades, leverageSettings.balance, leverageSettings, data[simulationIndex].close, assetName, serialTradingEnabled);
      let closedPnL = prevTrades.filter(t => t.status === 'CLOSED' && (t.accountId === eligibleAccountId || (!t.accountId && eligibleAccountId === 'A1'))).reduce((sum, t) => sum + (t.pnl || 0), 0);
      let currentBalance = leverageSettings.balance + closedPnL;

      const channelStopTrades = prevTrades.map(trade => {
        if (!turtleExitLevels || trade.status !== 'OPEN' || trade.entrySystem !== 'turtle_trading') return trade;
        const level = trade.side === 'LONG' ? turtleExitLevels.lower : turtleExitLevels.upper;
        if (!Number.isFinite(level)) return trade;
        const stopLoss = trade.side === 'LONG'
          ? Math.max(trade.stopLoss ?? -Infinity, level)
          : Math.min(trade.stopLoss ?? Infinity, level);
        return stopLoss === trade.stopLoss ? trade : { ...trade, stopLoss };
      });

      // Check this candle against stops already in force. A trail derived from
      // the closing price becomes active for the next candle, so an earlier
      // low/high on this candle cannot retroactively trigger the new stop.
      const exitedTrades = evaluateTradeExits(simulationIndex, visibleData, currentExitSignal, channelStopTrades, turtleRules, zScoreValue, leverageSettings, currentBalance, latencyDelaySeconds, customStopLossValue, onLogCallback);
      let updatedTrades = updateTrailSL(exitedTrades, simulationIndex, visibleData, tradingConfig, ind.trailStops || ind.stops, assetName);
      
      const newlyClosedTrades = updatedTrades.filter(t => t.status === 'CLOSED' && prevTrades.find(pt => pt.id === t.id)?.status === 'OPEN');
      const newlyClosedPnL = newlyClosedTrades.filter(t => t.accountId === eligibleAccountId || (!t.accountId && eligibleAccountId === 'A1')).reduce((sum, t) => sum + (t.pnl || 0), 0);
      
      if (newlyClosedTrades.length > 0 && onLogCallback) {
        newlyClosedTrades.forEach((t) => {
           if (!t.accountId || t.accountId === 'A1') {
             onLogCallback('INFO', 'TradeEngine', `Closed ${t.side} Trade [ID: ${t.id}] at ${t.exitPrice?.toFixed(5)} (Reason: ${t.exitReason}) PnL: ${t.pnl?.toFixed(2)}`);
           }
        });
      }
      
      currentBalance += newlyClosedPnL;

      let isFlipSignal = false;
      const flipSignal = determineFlipTradeSignal(newlyClosedTrades, tradingConfig);
      if (flipSignal) {
        currentEntrySignal = flipSignal;
        isFlipSignal = true;
      }

      const generateParallelTrades = (baseTrades: Trade[]) => {
        const pTrades: Trade[] = [];
        baseTrades.forEach(t => {
          if (!t.accountId || t.accountId === 'A1' || t.accountId.startsWith('S')) {
            parallelAccounts.forEach(pa => {
              if (pa.simultaneousTradeState) {
                if (pa.tradeExecutionMode === 'normal') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}`, accountId: pa.id });
                } else if (pa.tradeExecutionMode === 'invert') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}`, accountId: pa.id, side: t.side === 'LONG' ? 'SHORT' : 'LONG' });
                } else if (pa.tradeExecutionMode === 'hedge') {
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}_L`, accountId: pa.id, side: 'LONG', size: t.size / 2 });
                  pTrades.push({ ...t, id: `${t.id}_${pa.id}_S`, accountId: pa.id, side: 'SHORT', size: t.size / 2 });
                }
              }
            });
          }
        });
        return pTrades;
      };

      let newTradesRaw: Trade[] = [];
      if (!tradingConfig.tradeBreaker) {
        newTradesRaw = evaluateTradeEntries(
          simulationIndex,
          visibleData,
          currentEntrySignal,
          updatedTrades,
          turtleRules,
          entryStopLossValue,
          adxValue,
          squeezeStatus,
          leverageSettings,
          currentBalance,
          volRegimeScenario,
          assetName,
          isFlipSignal,
          slopePersistenceValue,
          trendEfficiencyValue,
          wickEfficiencyValue,
          serialTradingEnabled,
          eligibleAccountId
        );
        if (newTradesRaw.length > 0) {
          const resolvedEntrySystem = tradingConfig.activeSystemMode === 'conjunction' 
            ? (tradingConfig.activeConjunctionSystems || []).join(' AND ')
            : tradingConfig.activeSystemMode === 'disjunction'
            ? (tradingConfig.activeDisjunctionSystems || []).join(' OR ')
            : config.type;

          newTradesRaw = newTradesRaw.map(t => ({ 
            ...t, 
            accountId: eligibleAccountId,
            entrySystem: resolvedEntrySystem,
            systemMode: tradingConfig.activeSystemMode || 'classic'
          }));
          if (onLogCallback) {
            newTradesRaw.forEach((t) => {
              onLogCallback('SUCCESS', 'TradeEngine', `Executed Main ${t.side} Entry [ID: ${t.id}] at ${t.entryPrice.toFixed(5)}`);
            });
          }
        }
      }
      
      const newTrades = newTradesRaw.length > 0 ? [...newTradesRaw, ...generateParallelTrades(newTradesRaw)] : [];
      let nextTrades = newTrades.length > 0 ? [...updatedTrades, ...newTrades] : updatedTrades;

      if (tradingConfig.isRecurrentTradeActive && tradingConfig.recurrentTradeParams) {
        let latestTradeState = { trade: null, isLeveraged: !!leverageSettings.enabled, status: 'NEUTRAL', pnl: 0, pips: 0 } as any;
        if (nextTrades.length > 0) {
           const rootTrades = nextTrades.filter(t => !t.accountId || t.accountId === 'A1' || t.accountId.startsWith('S'));
           if (rootTrades.length > 0) {
             const cCandle = data[simulationIndex];
             const openRootTrades = rootTrades.filter(t => t.status === 'OPEN');
             const sortedT = openRootTrades.length > 0
               ? [...openRootTrades].sort((a,b) => b.entryTime - a.entryTime)
               : [...rootTrades].sort((a,b) => b.entryTime - a.entryTime);
             const lt = sortedT[0];
             let ltStatus = 'NEUTRAL';
             let ltPnl = lt.pnl || 0;
             let ltPips = lt.pips || 0;
             if (lt.status === 'OPEN') {
                 const priceDiff = lt.side === 'LONG' ? cCandle.close - lt.entryPrice : lt.entryPrice - cCandle.close;
                 
                 const pipMult = tradingConfig.pipMultiplier || 1;
                 ltPips = priceDiff / pipMult;
  
                 if (leverageSettings.enabled) {
                   ltPnl = calculatePnL(lt.entryPrice, cCandle.close, lt.size || 1, lt.side as 'LONG' | 'SHORT');
                 } else {
                   ltPnl = priceDiff;
                 }
             }
             if (ltPnl > 0) ltStatus = 'GAIN';
             else if (ltPnl < 0) ltStatus = 'LOSS';
             latestTradeState = { trade: lt, isLeveraged: !!leverageSettings.enabled, status: ltStatus, pnl: ltPnl, pips: ltPips };
           }
        }

        const volState = {
          zScore: { value: zScoreValue ?? null, source: indicatorSettings?.volatilityRegime?.dataSource || 'alpha' },
          squeezeStatus: { value: squeezeStatus ?? null, source: indicatorSettings?.volatility?.dataSource || 'alpha' },
          volatilityRegime: { value: ind.exitSignal?.lr?.vol_regime?.[exitIndex] ?? null, source: indicatorSettings?.[exitType]?.dataSource || 'alpha' }
        } as any;

        let recurrentTradesRaw: Trade[] = [];
        if (!tradingConfig.tradeBreaker) {
          const multiSources = {
            alpha: data.slice(0, simulationIndex + 1),
            beta: betaData ? betaData.slice(0, simulationIndex + 1) : [],
            delta: deltaData ? deltaData.slice(0, simulationIndex + 1) : []
          };
          recurrentTradesRaw = evaluateRecurrentTradeEntries(
            simulationIndex,
            visibleData,
            nextTrades,
            tradingConfig,
            latestTradeState,
            volState,
            leverageSettings,
            currentBalance,
            assetName,
            multiSources,
            indicatorSettings?.candlestick_pattern?.allowedPatterns
          );
        }
        if (recurrentTradesRaw.length > 0) {
          const resolvedEntrySystem = tradingConfig.activeSystemMode === 'conjunction' 
            ? (tradingConfig.activeConjunctionSystems || []).join(' AND ')
            : tradingConfig.activeSystemMode === 'disjunction'
            ? (tradingConfig.activeDisjunctionSystems || []).join(' OR ')
            : config.type;

          recurrentTradesRaw = recurrentTradesRaw.map(t => ({
            ...t,
            entrySystem: resolvedEntrySystem,
            systemMode: tradingConfig.activeSystemMode || 'classic'
          }));
          if (onLogCallback) {
            recurrentTradesRaw.forEach((t) => {
              onLogCallback('SUCCESS', 'TradeEngine', `Executed Recurrent ${t.side} Entry [ID: ${t.id}] at ${t.entryPrice.toFixed(5)}`);
            });
          }
          const recurrentTrades = [...recurrentTradesRaw, ...generateParallelTrades(recurrentTradesRaw)];
          nextTrades = [...nextTrades, ...recurrentTrades];
        }
      }

      let hasChanges = prevTrades.length !== nextTrades.length;
      if (!hasChanges) {
        for (let i = prevTrades.length - 1; i >= 0; i--) {
          const pt = prevTrades[i];
          const nt = nextTrades[i];
          if (pt.status !== nt.status || pt.exitTime !== nt.exitTime || pt.stopLoss !== nt.stopLoss || pt.takeProfit !== nt.takeProfit || pt.pnl !== nt.pnl || pt.exitPrice !== nt.exitPrice) {
            hasChanges = true;
            break;
          }
        }
      }

      if (!hasChanges) {
        return prevTrades;
      }

      return nextTrades;
    });

  }, [simulationIndex, tradingEnabled, config, data, tradingConfig, computedIndicators, latencyDelaySeconds, leverageSettings, setTrades, parallelAccounts, assetName, serialTradingEnabled, setTradingConfig, betaData, deltaData, indicatorSettings]);
}
