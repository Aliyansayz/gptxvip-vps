import { Ohlc } from '../indicators/baseline';
import { Trade, PositionSide } from '../../../../types/trading';
import { MainTradeParameters, RecurrentTradeParameters, TradeCategory } from './tradeTypes';

export interface TradingRulesConfig {
  entryOnSignal: boolean;
  entrySignalSource?: 'alpha' | 'beta' | 'delta';
  activeTradeType?: TradeCategory;
  mainTradeParams?: MainTradeParameters;
  recurrentTradeParams?: RecurrentTradeParameters;
  exitOnSignalReversal: boolean;
  exitSignalSource?: 'alpha' | 'beta' | 'delta';
  useStopLoss: boolean;
  useTakeProfit: boolean;
  rewardRiskRatio: number; // e.g. 1.0 or 2.0 (1:1, 2:1)
  exitAfterNCandles?: number;
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNMinutes?: number;
  exitAfterNMinutesMin?: number;
  exitAfterNMinutesMax?: number;
  exitAfterNSeconds?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
  pipMultiplier?: number;
  useADXFilter?: boolean;
  adxThreshold?: number;
  useSqueezeFilter?: boolean;
  stopLossPips?: number;
  takeProfitPips?: number;
}

import { LeverageConfig, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';
import { isSufficientBalanceToOpenTrade } from './leverageTradingRules';

import { processIndicatorBasedEntry } from './tradingEntryIndicatorRules';
import { checkIndicatorBasedExitConditions } from './tradingExitIndicatorRules';
import { checkTimeBasedExitConditions } from './tradingTimeExitRules';
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
  currentBalance?: number
): Trade[] {
  // Leverage Check
  if (leverageConfig && leverageConfig.enabled && currentBalance !== undefined) {
    if (!isSufficientBalanceToOpenTrade(data[currentIndex].close, leverageConfig, currentBalance)) {
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
    currentBalance
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
  latencyDelaySeconds?: number
): Trade[] {
  const currentCandle = data[currentIndex];
  // Map through trades and check for exit conditions
  return activeTrades.map(trade => {
    if (trade.status === 'CLOSED') return trade;

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
      let pnl = 0;
      if (leverageConfig && leverageConfig.enabled) {
         pnl = calculatePnL(trade.entryPrice, exitPrice, trade.size, trade.side);
      } else {
         pnl = trade.side === 'LONG' 
           ? exitPrice - trade.entryPrice 
           : trade.entryPrice - exitPrice;
      }
      
      const pipMultiplier = config.pipMultiplier || 1;
      const pips = pnl / pipMultiplier;

      const updatedBalance = currentBalance !== undefined ? currentBalance + pnl : undefined;

      return {
        ...trade,
        status: 'CLOSED',
        exitPrice,
        exitTime: currentCandle.time,
        exitIndex: currentIndex,
        exitReason,
        pnl,
        pips,
        balanceAfter: updatedBalance,
        latencyDelaySeconds,
        infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
      };
    }

    return {
      ...trade,
      latencyDelaySeconds,
      infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
    };
  });
}

