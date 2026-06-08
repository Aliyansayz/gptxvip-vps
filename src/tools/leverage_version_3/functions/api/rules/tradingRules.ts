import { Ohlc } from '../indicators/baseline';
import { Trade, PositionSide } from '../../../../types/trading';
import { MainTradeParameters, RecurrentTradeParameters, TradeCategory } from './tradeTypes';
import { activeClassicSystems, ClassicSystemOption } from '../classicSystem/classicsystemController';
import { calculatePartialExitSize } from './tradingPartialExitRules';

export interface TradingRulesConfig {
  entryOnSignal: boolean;
  entrySignalSource?: 'alpha' | 'beta' | 'delta';
  flipModeActive?: boolean;
  flipModeUseExitRuleAsEntry?: boolean;
  activeTradeType?: TradeCategory;
  isRecurrentTradeActive?: boolean;
  isHftModeActive?: boolean;
  hftScaleFactor?: number;
  hftSyncStopLoss?: boolean;
  hftRewardRiskRatio?: number;
  hftStopLossPips?: number;
  hftTakeProfitPips?: number;
  hftExitAfterNPips?: number;
  hftExitAfterNCandles?: number;
  hftExitCandlesSource?: 'alpha' | 'beta' | 'delta';
  mainTradeParams?: MainTradeParameters;
  recurrentTradeParams?: RecurrentTradeParameters;
  exitOnSignalReversal: boolean;
  exitSignalSource?: 'alpha' | 'beta' | 'delta';
  useStopLoss: boolean;
  useTakeProfit: boolean;
  rewardRiskRatio: number; // e.g. 1.0 or 2.0 (1:1, 2:1)
  exitAfterNCandles?: number;
  exitCandlesSource?: 'alpha' | 'beta' | 'delta';
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNMinutes?: number;
  exitAfterNMinutesMin?: number;
  exitAfterNMinutesMax?: number;
  exitAfterNSeconds?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
  pipMultiplier?: number;
  useDifferentSignalSystemOnExit?: boolean;
  exitSignalSystemType?: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'supertrend_regime' | 'heikin_ashi_smoothed' | 'candlestick_pattern';
  exitSignalSystemParams?: Record<string, number>;
  useADXFilter?: boolean;
  adxThreshold?: number;
  useSqueezeFilter?: boolean;
  useVolRegimeScenarioA?: boolean;
  useVolRegimeScenarioC?: boolean;
  stopLossPips?: number;
  takeProfitPips?: number;
  exitAfterNPips?: number;
  useSmoothAtrStopLossTrailing?: boolean;
  useVolatilityRegimeSlTrailing?: boolean;
  volatilityRegimePeriod?: number;
  trailRecurrentTradesWithAtr?: boolean;
  tradeBreaker?: boolean;
  autoTradeBreakerByEquityPct?: boolean;
  autoTradeBreakerEquityPctValue?: number;
  partialTradeExitOnReversal?: boolean;
  partialExitPercentage?: number;
  // added for time limit mappings
  betaAggregateFactor?: number;
  deltaAggregateSource?: 'alpha' | 'beta';
  deltaAggregateFactor?: number;
}

import { LeverageConfig, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';
import { isSufficientBalanceToOpenTrade } from './leverageTradingRules';

import { processIndicatorBasedEntry } from './tradingEntryIndicatorRules';
import { checkIndicatorBasedExitConditions } from './tradingExitIndicatorRules';
import { checkTimeBasedExitConditions } from './tradingTimeExitRules';
import { checkPipsExitConditions } from './tradingPipsExitRules';
import { calculatePnL } from '../position_sizing/leveragedPositionSizeMetals';

export function evaluateTradeEntries(
  currentIndex: number,
  data: Ohlc[],
  signal: 'LONG' | 'SHORT' | null,
  activeTrades: Trade[],
  config: TradingRulesConfig,
  customStopLossValue?: { upper: number, lower: number },
  adxValue?: number,
  squeezeStatus?: number,
  leverageConfig?: LeverageConfig,
  currentBalance?: number,
  volRegimeScenario?: 'A'|'B'|'C'|'D'|'None',
  assetName: string = 'gold',
  isFlipSignal: boolean = false
): Trade[] {
  // Leverage Check
  if (leverageConfig && leverageConfig.enabled && currentBalance !== undefined) {
    if (!isSufficientBalanceToOpenTrade(data[currentIndex].close, leverageConfig, currentBalance, assetName)) {
       return []; // insufficient balance
    }
  }

  // Redirect to new entry rule file
  return processIndicatorBasedEntry(
    currentIndex,
    data,
    signal,
    activeTrades,
    config,
    customStopLossValue,
    adxValue,
    squeezeStatus,
    leverageConfig,
    currentBalance,
    volRegimeScenario,
    assetName,
    isFlipSignal
  );
}

export function evaluateTradeExits(
  currentIndex: number,
  data: Ohlc[],
  signal: 'LONG' | 'SHORT' | null,
  activeTrades: Trade[],
  config: TradingRulesConfig,
  zScoreValue?: number,
  leverageConfig?: LeverageConfig,
  currentBalance?: number,
  latencyDelaySeconds?: number,
  customStopLossValue?: { upper: number, lower: number },
  onLog?: (level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', source: string, message: string) => void
): Trade[] {
  const currentCandle = data[currentIndex];
  let runningBalance = currentBalance;

  // Step 1: Evaluate A1 (root) trades
  const rootTrades = activeTrades.filter(t => !t.accountId || t.accountId === 'A1');
  const evaluatedRootTrades: Trade[] = [];

  for (const trade of rootTrades) {
    if (trade.status === 'CLOSED') {
      evaluatedRootTrades.push(trade);
      continue;
    }

    let shouldExit = false;
    let exitReason: Trade['exitReason'] = undefined;
    let exitPrice = currentCandle.close;

    // 1. Time based exits
    const timeExitCondition = checkTimeBasedExitConditions(trade, currentCandle.time, currentIndex, config, zScoreValue);
    if (timeExitCondition.shouldExit) {
      shouldExit = true;
      exitReason = timeExitCondition.exitReason;
      exitPrice = currentCandle.close;
    }

    // 1.b. Pips based exits
    if (!shouldExit) {
      const pipsExitCondition = checkPipsExitConditions(trade, currentCandle.close, config);
      if (pipsExitCondition.shouldExit) {
        shouldExit = true;
        exitReason = pipsExitCondition.exitReason;
        exitPrice = currentCandle.close;
      }
    }

    // 2. Indicator / Price target based exits
    if (!shouldExit) {
      const indicatorExitCondition = checkIndicatorBasedExitConditions(trade, currentCandle, signal, config);
      if (indicatorExitCondition.shouldExit) {
        shouldExit = true;
        exitReason = indicatorExitCondition.exitReason;
        if (indicatorExitCondition.exitPrice) {
          exitPrice = indicatorExitCondition.exitPrice;
        }
      }
    }

    if (shouldExit) {
      // Check if this is a MAIN trade & CLOSED BY SIGNAL_REVERSAL & partial exit is active
      const isMainTrade = !trade.tradeType || trade.tradeType === 'main trade';
      const isPartialExitActive = config.partialTradeExitOnReversal || false;
      const partialPercentage = config.partialExitPercentage ?? 70;

      if (isMainTrade && exitReason === 'SIGNAL_REVERSAL' && isPartialExitActive && !trade.hasPartialExited && (trade.size || 0) >= 0.01) {
        const exitSize = calculatePartialExitSize(trade.size || 0, partialPercentage);
        if (exitSize > 0) {
          const remainingSize = Number(((trade.size || 0) - exitSize).toFixed(2));

          // 1. Create CLOSED portion
          const priceDiff = trade.side === 'LONG'
            ? exitPrice - trade.entryPrice
            : trade.entryPrice - exitPrice;

          const pipMultiplier = config.pipMultiplier || 1;
          const pips = priceDiff / pipMultiplier;
          
          let closedPnl = 0;
          if (leverageConfig && leverageConfig.enabled) {
            closedPnl = calculatePnL(trade.entryPrice, exitPrice, exitSize, trade.side);
          } else {
            closedPnl = priceDiff;
          }

          if (runningBalance !== undefined) {
            runningBalance += closedPnl;
          }
          const updatedBalance = runningBalance;

          const closedTrade: Trade = {
            ...trade,
            status: 'CLOSED',
            size: exitSize,
            exitPrice,
            exitTime: currentCandle.time,
            exitIndex: currentIndex,
            exitReason,
            pnl: closedPnl,
            pips,
            balanceAfter: updatedBalance,
            latencyDelaySeconds,
            infoStatus: `Partial Exit Reversal (Closed ${exitSize} lot)`
          };

          // 2. Create remaining OPEN portion retaining same parameters (stop loss, etc.)
          let remainingStopLoss = trade.stopLoss;
          if (remainingStopLoss === undefined) {
             if (config.useStopLoss && customStopLossValue) {
               remainingStopLoss = trade.side === 'LONG' ? customStopLossValue.lower : customStopLossValue.upper;
             } else if (config.stopLossPips !== undefined && config.stopLossPips > 0) {
               const pipMultiplier = config.pipMultiplier || 1;
               if (trade.side === 'LONG') {
                 remainingStopLoss = currentCandle.close - (config.stopLossPips * pipMultiplier);
               } else {
                 remainingStopLoss = currentCandle.close + (config.stopLossPips * pipMultiplier);
               }
             }
          }

          const remainingTrade: Trade = {
            ...trade,
            size: remainingSize,
            stopLoss: remainingStopLoss,
            latencyDelaySeconds,
            hasPartialExited: true,
            infoStatus: `Partial Exit Active (Remaining ${remainingSize} lot)`
          };

          if (onLog) {
            onLog('SUCCESS', 'TradeEngine', `Partial Main Trade Reversal Exit: Closed ${exitSize} lot (${partialPercentage}%) at price ${exitPrice}. Remaining: ${remainingSize} lot active.`);
          }

          evaluatedRootTrades.push(remainingTrade);
          evaluatedRootTrades.push(closedTrade);
          continue;
        }
      }

      const priceDiff = trade.side === 'LONG'
        ? exitPrice - trade.entryPrice
        : trade.entryPrice - exitPrice;

      const pipMultiplier = config.pipMultiplier || 1;
      const pips = priceDiff / pipMultiplier;
      
      let pnl = 0;
      if (leverageConfig && leverageConfig.enabled) {
        pnl = calculatePnL(trade.entryPrice, exitPrice, trade.size || 1, trade.side);
      } else {
        pnl = priceDiff;
      }

      if (runningBalance !== undefined) {
        runningBalance += pnl;
      }
      const updatedBalance = runningBalance;

      if (onLog) {
        onLog('WARN', 'TradeEngine', `Trade ${trade.id} Closed Completely. Side: ${trade.side}, Size: ${trade.size} lot. Exit Price: ${exitPrice}. Reason: ${exitReason}. Profit/loss: ${pnl.toFixed(2)}.`);
      }

      evaluatedRootTrades.push({
        ...trade,
        status: 'CLOSED' as 'CLOSED',
        exitPrice,
        exitTime: currentCandle.time,
        exitIndex: currentIndex,
        exitReason,
        pnl,
        pips,
        balanceAfter: updatedBalance,
        latencyDelaySeconds,
        infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
      } as Trade);
    } else {
      evaluatedRootTrades.push({
        ...trade,
        latencyDelaySeconds,
        infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
      });
    }
  }

  // Check CloseAlongsideMainTrade for root trades
  let finalRootTrades = evaluatedRootTrades;
  if (config.recurrentTradeParams?.closeAlongsideMainTrade) {
    const isMainTradeOpen = finalRootTrades.some(t => t.tradeType === 'main trade' && t.status === 'OPEN');
    if (!isMainTradeOpen) {
      finalRootTrades = finalRootTrades.map(trade => {
        if (trade.status === 'OPEN' && trade.tradeType === 'recurrent trade') {
          const exitPrice = currentCandle.close;
          const priceDiff = trade.side === 'LONG'
            ? exitPrice - trade.entryPrice
            : trade.entryPrice - exitPrice;
          const pipMultiplier = config.pipMultiplier || 1;
          const pips = priceDiff / pipMultiplier;
          let pnl = 0;
          if (leverageConfig && leverageConfig.enabled) {
            pnl = calculatePnL(trade.entryPrice, exitPrice, trade.size || 1, trade.side);
          } else {
            pnl = priceDiff;
          }
          if (runningBalance !== undefined) {
            runningBalance += pnl;
          }
          const updatedBalance = runningBalance;
          return {
            ...trade,
            status: 'CLOSED' as 'CLOSED',
            exitPrice,
            exitTime: currentCandle.time,
            exitIndex: currentIndex,
            exitReason: 'TIME_LIMIT',
            pnl,
            pips,
            balanceAfter: updatedBalance,
            latencyDelaySeconds,
            infoStatus: `Closed Alongside Main Trade`
          };
        }
        return trade;
      });
    }
  }

  // Step 2: Sync parallel trades based on their root trade
  const rootTradesMap = new Map<string, Trade[]>();
  finalRootTrades.forEach(t => {
    const list = rootTradesMap.get(t.id) || [];
    list.push(t);
    rootTradesMap.set(t.id, list);
  });

  const parallelTrades = activeTrades.filter(t => t.accountId && t.accountId !== 'A1');
  const evaluatedParallelTrades: Trade[] = [];

  for (const pTrade of parallelTrades) {
    if (pTrade.status === 'CLOSED') {
      evaluatedParallelTrades.push(pTrade);
      continue;
    }

    // determine root trade id (removing the _A2 or _A2_L suffix)
    const rootIdMatch = pTrade.id.match(/^(.+?)_A\d+(?:_[LS])?$/);
    const rootId = rootIdMatch ? rootIdMatch[1] : null;

    if (rootId && rootTradesMap.has(rootId)) {
      const rootTradesForId = rootTradesMap.get(rootId)!;
      const rootTotalSize = rootTradesForId.reduce((sum, r) => sum + (r.size || 0), 0);
      const scaleFactor = rootTotalSize > 0 ? (pTrade.size / rootTotalSize) : 1;

      for (const rootTrade of rootTradesForId) {
        const mappedSize = Number((rootTrade.size * scaleFactor).toFixed(2));

        if (rootTrade.status === 'CLOSED') {
          const exitPrice = rootTrade.exitPrice || currentCandle.close;
          const priceDiff = pTrade.side === 'LONG'
            ? exitPrice - pTrade.entryPrice
            : pTrade.entryPrice - exitPrice;

          const pipMultiplier = config.pipMultiplier || 1;
          const pips = priceDiff / pipMultiplier;
          
          let exitReason = rootTrade.exitReason;
          if (pTrade.side !== rootTrade.side && exitReason === 'STOP_LOSS') {
             exitReason = 'TAKE_PROFIT';
          } else if (pTrade.side !== rootTrade.side && exitReason === 'TAKE_PROFIT') {
             exitReason = 'STOP_LOSS'; 
          }

          let pnl = 0;
          if (leverageConfig && leverageConfig.enabled) {
            pnl = calculatePnL(pTrade.entryPrice, exitPrice, mappedSize, pTrade.side);
          } else {
            pnl = priceDiff;
          }

          if (runningBalance !== undefined) {
            runningBalance += pnl;
          }

          evaluatedParallelTrades.push({
            ...pTrade,
            status: 'CLOSED' as 'CLOSED',
            size: mappedSize,
            exitPrice,
            exitTime: rootTrade.exitTime,
            exitIndex: rootTrade.exitIndex,
            exitReason, 
            pnl,
            pips,
            balanceAfter: runningBalance,
            latencyDelaySeconds: rootTrade.latencyDelaySeconds,
            infoStatus: rootTrade.infoStatus
          });
        } else {
          evaluatedParallelTrades.push({
            ...pTrade,
            size: mappedSize,
            latencyDelaySeconds: rootTrade.latencyDelaySeconds,
            infoStatus: rootTrade.infoStatus
          });
        }
      }
    } else {
      // Fallback if root trade not found (shouldn't happen)
      evaluatedParallelTrades.push(pTrade);
    }
  }

  return [...finalRootTrades, ...evaluatedParallelTrades] as Trade[];
}

