import React, { useEffect } from 'react';
import { Ohlc } from '../../functions/api/indicators/baseline';
import { Trade } from '../../../types/trading';
import { evaluateTradeEntries, evaluateTradeExits } from '../../functions/api/rules/tradingRules';
import { updateTrailSL } from '../../functions/api/middleware/updateTrailSL';
import { evaluateRecurrentTradeEntries } from '../../functions/api/rules/tradingRecurrentTradeRules';
import { checkLinearRegressionAdxEntryConditions } from '../../functions/api/indicators/exclusive/exclusive_entry_exit';
import { calculateVolatilityScenario } from '../../functions/api/indicators/exclusive/volatilityBehavior';
import { getEligibleRootAccount } from '../../functions/api/accountState/accountEligibleToTrade';
import { shouldActivateTradeBreaker } from '../../functions/api/tradeBreaker/tradeBreakerByEquity';
import { Config } from './types';
import { ParallelAccount } from '../../stores/indicators_store';
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
  setTradingConfig?: any
) {
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
    } else if (config.type === 'bollinger_bands' && ind.entrySignal?.bb) {
      const bb = ind.entrySignal.bb;
      if (bb && bb.length > simulationIndex) {
        const lastBb = bb[simulationIndex];
        const lastCandle = data[simulationIndex];
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
      if (sr && sr.signal && sr.signal.length > simulationIndex) {
        const lastSignal = sr.signal[simulationIndex];
        const prevSignal = sr.signal[Math.max(0, simulationIndex - 1)];
        if (prevSignal <= 0 && lastSignal === 1) currentEntrySignal = 'LONG';
        else if (prevSignal >= 0 && lastSignal === -1) currentEntrySignal = 'SHORT';
      }
    }

    // Evaluate Exit Signal
    const exitType = ind.exitSignal?.type || config.type;
    if (exitType === 'ma_crossover' && ind.exitSignal?.fastLine) {
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
    } else if (exitType === 'supertrend' && ind.exitSignal?.supertrend) {
      const st = ind.exitSignal.supertrend;
      if (st && st.length > simulationIndex) {
        const lastSt = st[simulationIndex];
        const prevSt = st[simulationIndex - 1];
        if (prevSt.trend === 'down' && lastSt.trend === 'up') currentExitSignal = 'LONG';
        else if (prevSt.trend === 'up' && lastSt.trend === 'down') currentExitSignal = 'SHORT';
      }
    } else if (exitType === 'stochastic' && ind.exitSignal?.stochastic) {
      const stoch = ind.exitSignal.stochastic;
      if (stoch && stoch.k.length > simulationIndex && stoch.d.length > simulationIndex) {
        const lastK = stoch.k[simulationIndex];
        const lastD = stoch.d[simulationIndex];
        const prevK = stoch.k[simulationIndex - 1];
        const prevD = stoch.d[simulationIndex - 1];
        if (prevK <= prevD && lastK > lastD) currentExitSignal = 'LONG';
        else if (prevK >= prevD && lastK < lastD) currentExitSignal = 'SHORT';
      }
    } else if (exitType === 'linear_regression' && ind.exitSignal?.lr) {
      const lr = ind.exitSignal.lr;
      const indicatorData = {
        'SIM': { secondary: { lr_trend_secondary: lr.direction.slice(0, simulationIndex + 1), lr_volatality_s: lr.vol_regime.slice(0, simulationIndex + 1), lr_reversion_s: lr.reversion.slice(0, simulationIndex + 1) } }
      };
      const entry = checkLinearRegressionAdxEntryConditions(indicatorData, 'SIM');
      if (entry.status === 'long') currentExitSignal = 'LONG';
      else if (entry.status === 'short') currentExitSignal = 'SHORT';
    } else if (exitType === 'bollinger_bands' && ind.exitSignal?.bb) {
      const bb = ind.exitSignal.bb;
      if (bb && bb.length > simulationIndex) {
        const lastBb = bb[simulationIndex];
        const lastCandle = data[simulationIndex];
        if (lastCandle && lastBb && !isNaN(lastBb.lower) && !isNaN(lastBb.upper)) {
          if (lastCandle.open < lastBb.lower && lastCandle.close > lastBb.lower) {
            currentExitSignal = 'LONG';
          } else if (lastCandle.open > lastBb.upper && lastCandle.close < lastBb.upper) {
            currentExitSignal = 'SHORT';
          }
        }
      }
    } else if (exitType === 'supertrend_regime' && ind.exitSignal?.supertrend_regime) {
      const sr = ind.exitSignal.supertrend_regime;
      if (sr && sr.signal && sr.signal.length > simulationIndex) {
        const lastSignal = sr.signal[simulationIndex];
        const prevSignal = sr.signal[Math.max(0, simulationIndex - 1)];
        if (prevSignal <= 0 && lastSignal === 1) currentExitSignal = 'LONG';
        else if (prevSignal >= 0 && lastSignal === -1) currentExitSignal = 'SHORT';
      }
    }

    if (tradingConfig.useStopLoss && ind.stops) {
       customStopLossValue = {
         upper: ind.stops.upperBand[simulationIndex],
         lower: ind.stops.lowerBand[simulationIndex]
       };
    }

    let adxValue: number | undefined = undefined;
    if (tradingConfig.useADXFilter && ind.adx) {
      adxValue = ind.adx?.adx?.[simulationIndex];
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
      let updatedTrades = evaluateTradeExits(simulationIndex, visibleData, currentExitSignal, trailedTrades, tradingConfig, zScoreValue, leverageSettings, currentBalance, latencyDelaySeconds);
      
      const newlyClosedPnL = updatedTrades.filter(t => t.status === 'CLOSED' && prevTrades.find(pt => pt.id === t.id)?.status === 'OPEN' && (t.accountId === eligibleAccountId || (!t.accountId && eligibleAccountId === 'A1'))).reduce((sum, t) => sum + (t.pnl || 0), 0);
      currentBalance += newlyClosedPnL;

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
        newTradesRaw = evaluateTradeEntries(simulationIndex, visibleData, currentEntrySignal, updatedTrades, tradingConfig, customStopLossValue, adxValue, squeezeStatus, leverageSettings, currentBalance, volRegimeScenario, assetName);
        if (newTradesRaw.length > 0) {
          newTradesRaw = newTradesRaw.map(t => ({ ...t, accountId: eligibleAccountId }));
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
          zScore: { value: zScoreValue ?? null, source: 'alpha' },
          squeezeStatus: { value: squeezeStatus ?? null, source: 'alpha' },
          volatilityRegime: { value: ind.exitSignal?.lr?.vol_regime?.[simulationIndex] ?? null, source: 'alpha' }
        } as any;

        let recurrentTradesRaw: Trade[] = [];
        if (!tradingConfig.tradeBreaker) {
          recurrentTradesRaw = evaluateRecurrentTradeEntries(simulationIndex, visibleData, nextTrades, tradingConfig, latestTradeState, volState, leverageSettings, currentBalance, assetName);
        }
        if (recurrentTradesRaw.length > 0) {
          const recurrentTrades = [...recurrentTradesRaw, ...generateParallelTrades(recurrentTradesRaw)];
          nextTrades = [...nextTrades, ...recurrentTrades];
        }
      }

      const prevJson = JSON.stringify(prevTrades);
      const nextJson = JSON.stringify(nextTrades);
      if (prevJson === nextJson) {
        return prevTrades;
      }

      return nextTrades;
    });

  }, [simulationIndex, tradingEnabled, config, data, tradingConfig, computedIndicators, latencyDelaySeconds, leverageSettings, setTrades, parallelAccounts, assetName, serialTradingEnabled, setTradingConfig]);
}
