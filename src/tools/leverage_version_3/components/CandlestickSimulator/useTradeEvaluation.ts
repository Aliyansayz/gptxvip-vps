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
import { Config } from './types';
import { ParallelAccount, useIndicatorsStore } from '../../stores/indicators_store';
import { calculatePnL } from '../../functions/api/position_sizing/leveragedPositionSizeMetals';

// NOTE: calculatePnL module is dynamically required below due to leveraging.
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
      
      if (!dataset || dataset.length === 0) return 0;
      
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

    // Evaluate Entry Signal
    if (config.type === 'ma_crossover' && ind.entrySignal?.fastLine) {
      const fastLine = ind.entrySignal.fastLine;
      const slowLine = ind.entrySignal.slowLine;
      if (fastLine && slowLine && fastLine.length > entryIndex) {
        const lastFast = fastLine[entryIndex];
        const lastSlow = slowLine[entryIndex];
        const prevFast = fastLine[Math.max(0, entryIndex - 1)];
        const prevSlow = slowLine[Math.max(0, entryIndex - 1)];
        if (prevFast <= prevSlow && lastFast > lastSlow) currentEntrySignal = 'LONG';
        else if (prevFast >= prevSlow && lastFast < lastSlow) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'supertrend' && ind.entrySignal?.supertrend) {
      const st = ind.entrySignal.supertrend;
      if (st && st.length > entryIndex) {
        const lastSt = st[entryIndex];
        const prevSt = st[Math.max(0, entryIndex - 1)];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentEntrySignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'stochastic' && ind.entrySignal?.stochastic) {
      const stoch = ind.entrySignal.stochastic;
      if (stoch && stoch.k.length > entryIndex && stoch.d.length > entryIndex) {
        const lastK = stoch.k[entryIndex];
        const lastD = stoch.d[entryIndex];
        const prevK = stoch.k[Math.max(0, entryIndex - 1)];
        const prevD = stoch.d[Math.max(0, entryIndex - 1)];
        if (prevK <= prevD && lastK > lastD) currentEntrySignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'linear_regression' && ind.entrySignal?.lr) {
      const lr = ind.entrySignal.lr;
      const indicatorData = {
        'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, entryIndex + 1), lr_volatality_s: lr.vol_regime.slice(0, entryIndex + 1), lr_reversion_s: lr.reversion.slice(0, entryIndex + 1) } }
      };
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentEntrySignal = 'LONG';
      else if (entry.status === 'short') currentEntrySignal = 'SHORT';
    } else if (config.type === 'bollinger_bands' && ind.entrySignal?.bb) {
      const bb = ind.entrySignal.bb;
      if (bb && bb.length > entryIndex) {
        const lastBb = bb[entryIndex];
        const sourceData = entryDataSource === 'beta' && betaData ? betaData : entryDataSource === 'delta' && deltaData ? deltaData : data;
        const lastCandle = sourceData[entryIndex];
        if (lastCandle && lastBb && !isNaN(lastBb.lower) && !isNaN(lastBb.upper)) {
          if (lastCandle.open < lastBb.lower && lastCandle.close > lastBb.lower) {
            currentEntrySignal = 'LONG';
          } else if (lastCandle.open > lastBb.upper && lastCandle.close < lastBb.upper) {
            currentEntrySignal = 'SHORT';
          }
        }
      }
    } else if (config.type === 'supertrend_regime' && ind.entrySignal?.supertrend_regime) {
      const sr = ind.entrySignal.supertrend_regime;
      if (sr && sr.signal && sr.signal.length > entryIndex) {
        const lastSignal = sr.signal[entryIndex];
        const prevSignal = sr.signal[Math.max(0, entryIndex - 1)];
        if (prevSignal <= 0 && lastSignal === 1) currentEntrySignal = 'LONG';
        else if (prevSignal >= 0 && lastSignal === -1) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'heikin_ashi_smoothed' && ind.entrySignal?.heikin_ashi_smoothed) {
      const ha = ind.entrySignal.heikin_ashi_smoothed;
      if (ha && ha.length > entryIndex) {
        const lastCandle = ha[entryIndex];
        const prevCandle = ha[Math.max(0, entryIndex - 1)];
        if (prevCandle.close <= prevCandle.open && lastCandle.close > lastCandle.open) currentEntrySignal = 'LONG';
        else if (prevCandle.close >= prevCandle.open && lastCandle.close < lastCandle.open) currentEntrySignal = 'SHORT';
      }
    } else if (config.type === 'candlestick_pattern' && ind.entrySignal?.candlestick_pattern) {
      const cp = ind.entrySignal.candlestick_pattern;
      if (cp && cp.action_signal && cp.action_signal.length > entryIndex) {
        const action = cp.action_signal[entryIndex];
        if (action === 'bullish_action') currentEntrySignal = 'LONG';
        else if (action === 'bearish_action') currentEntrySignal = 'SHORT';
      }
    }

    // Evaluate Exit Signal
    const resolvedExitType = ind.exitSignal?.type || exitType;
    if (resolvedExitType === 'ma_crossover' && ind.exitSignal?.fastLine) {
      const fastLine = ind.exitSignal.fastLine;
      const slowLine = ind.exitSignal.slowLine;
      if (fastLine && slowLine && fastLine.length > exitIndex) {
        const lastFast = fastLine[exitIndex];
        const lastSlow = slowLine[exitIndex];
        const prevFast = fastLine[Math.max(0, exitIndex - 1)];
        const prevSlow = slowLine[Math.max(0, exitIndex - 1)];
        if (prevFast <= prevSlow && lastFast > lastSlow) currentExitSignal = 'LONG';
        else if (prevFast >= prevSlow && lastFast < lastSlow) currentExitSignal = 'SHORT';
      }
    } else if (resolvedExitType === 'supertrend' && ind.exitSignal?.supertrend) {
      const st = ind.exitSignal.supertrend;
      if (st && st.length > exitIndex) {
        const lastSt = st[exitIndex];
        const prevSt = st[Math.max(0, exitIndex - 1)];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentExitSignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentExitSignal = 'SHORT';
      }
    } else if (resolvedExitType === 'stochastic' && ind.exitSignal?.stochastic) {
      const stoch = ind.exitSignal.stochastic;
      if (stoch && stoch.k.length > exitIndex && stoch.d.length > exitIndex) {
        const lastK = stoch.k[exitIndex];
        const lastD = stoch.d[exitIndex];
        const prevK = stoch.k[Math.max(0, exitIndex - 1)];
        const prevD = stoch.d[Math.max(0, exitIndex - 1)];
        if (prevK <= prevD && lastK > lastD) currentExitSignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentExitSignal = 'SHORT';
      }
    } else if (resolvedExitType === 'linear_regression' && ind.exitSignal?.lr) {
      const lr = ind.exitSignal.lr;
      const indicatorData = {
        'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, exitIndex + 1), lr_volatality_s: lr.vol_regime.slice(0, exitIndex + 1), lr_reversion_s: lr.reversion.slice(0, exitIndex + 1) } }
      };
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentExitSignal = 'LONG';
      else if (entry.status === 'short') currentExitSignal = 'SHORT';
    } else if (resolvedExitType === 'bollinger_bands' && ind.exitSignal?.bb) {
      const bb = ind.exitSignal.bb;
      if (bb && bb.length > exitIndex) {
        const lastBb = bb[exitIndex];
        const sourceData = exitDataSource === 'beta' && betaData ? betaData : exitDataSource === 'delta' && deltaData ? deltaData : data;
        const lastCandle = sourceData[exitIndex];
        if (lastCandle && lastBb && !isNaN(lastBb.lower) && !isNaN(lastBb.upper)) {
          if (lastCandle.open < lastBb.lower && lastCandle.close > lastBb.lower) {
            currentExitSignal = 'LONG';
          } else if (lastCandle.open > lastBb.upper && lastCandle.close < lastBb.upper) {
            currentExitSignal = 'SHORT';
          }
        }
      }
    } else if (resolvedExitType === 'supertrend_regime' && ind.exitSignal?.supertrend_regime) {
      const sr = ind.exitSignal.supertrend_regime;
      if (sr && sr.signal && sr.signal.length > exitIndex) {
        const lastSignal = sr.signal[exitIndex];
        const prevSignal = sr.signal[Math.max(0, exitIndex - 1)];
        if (prevSignal <= 0 && lastSignal === 1) currentExitSignal = 'LONG';
        else if (prevSignal >= 0 && lastSignal === -1) currentExitSignal = 'SHORT';
      }
    } else if (resolvedExitType === 'heikin_ashi_smoothed' && ind.exitSignal?.heikin_ashi_smoothed) {
      const ha = ind.exitSignal.heikin_ashi_smoothed;
      if (ha && ha.length > exitIndex) {
        const lastCandle = ha[exitIndex];
        const prevCandle = ha[Math.max(0, exitIndex - 1)];
        if (prevCandle.close <= prevCandle.open && lastCandle.close > lastCandle.open) currentExitSignal = 'LONG';
        else if (prevCandle.close >= prevCandle.open && lastCandle.close < lastCandle.open) currentExitSignal = 'SHORT';
      }
    } else if (resolvedExitType === 'candlestick_pattern' && ind.exitSignal?.candlestick_pattern) {
      const cp = ind.exitSignal.candlestick_pattern;
      if (cp && cp.action_signal && cp.action_signal.length > exitIndex) {
        const action = cp.action_signal[exitIndex];
        if (action === 'bullish_action') currentExitSignal = 'LONG';
        else if (action === 'bearish_action') currentExitSignal = 'SHORT';
      }
    }

    if (tradingConfig.useStopLoss && ind.stops) {
       customStopLossValue = {
         upper: ind.stops.upperBand[slIndex],
         lower: ind.stops.lowerBand[slIndex]
       };
    }

    let adxValue: number | undefined = undefined;
    if (tradingConfig.useADXFilter && ind.adx) {
      adxValue = ind.adx?.adx?.[volIndex];
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

      const trailedTrades = updateTrailSL(prevTrades, simulationIndex, visibleData, tradingConfig, ind.stops);

      // Note: evaluateTradeExits does logic for PnL. It might use `currentBalance` but let's keep it computing correctly
      let updatedTrades = evaluateTradeExits(simulationIndex, visibleData, currentExitSignal, trailedTrades, tradingConfig, zScoreValue, leverageSettings, currentBalance, latencyDelaySeconds, customStopLossValue, onLogCallback);
      
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
        newTradesRaw = evaluateTradeEntries(simulationIndex, visibleData, currentEntrySignal, updatedTrades, tradingConfig, customStopLossValue, adxValue, squeezeStatus, leverageSettings, currentBalance, volRegimeScenario, assetName, isFlipSignal);
        if (newTradesRaw.length > 0) {
          newTradesRaw = newTradesRaw.map(t => ({ ...t, accountId: eligibleAccountId }));
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
          recurrentTradesRaw = evaluateRecurrentTradeEntries(simulationIndex, visibleData, nextTrades, tradingConfig, latestTradeState, volState, leverageSettings, currentBalance, assetName, multiSources);
        }
        if (recurrentTradesRaw.length > 0) {
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
