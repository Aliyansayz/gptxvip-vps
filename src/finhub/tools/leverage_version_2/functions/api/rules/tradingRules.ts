import { Ohlc } from '../indicators/baseline';
import { Trade, PositionSide } from '../../../../types/trading';
import { MainTradeParameters, RecurrentTradeParameters, TradeCategory } from './tradeTypes';
import { activeClassicSystems, ClassicSystemOption } from '../classicSystem/classicsystemController';

export interface TradingRulesConfig {
  entryOnSignal: boolean;
  entrySignalSource?: 'alpha' | 'beta' | 'delta';
  activeTradeType?: TradeCategory;
  isRecurrentTradeActive?: boolean;
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
  useDifferentSignalSystemOnExit?: boolean;
  exitSignalSystemType?: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'supertrend_regime';
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
  trailRecurrentTradesWithAtr?: boolean;
  tradeBreaker?: boolean;
  autoTradeBreakerByEquityPct?: boolean;
  autoTradeBreakerEquityPctValue?: number;
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
  assetName: string = 'gold'
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
    assetName
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
  let runningBalance = currentBalance;

  // Step 1: Evaluate A1 (root) trades
  const rootTrades = activeTrades.filter(t => !t.accountId || t.accountId === 'A1');
  const evaluatedRootTrades = rootTrades.map(trade => {
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
        exitReason,
        pnl,
        pips,
        balanceAfter: updatedBalance,
        latencyDelaySeconds,
        infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
      } as Trade;
    }

    return {
      ...trade,
      latencyDelaySeconds,
      infoStatus: `Latency Delay: ${latencyDelaySeconds}s`
    };
  });

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
  const rootTradesMap = new Map<string, Trade>();
  finalRootTrades.forEach(t => rootTradesMap.set(t.id, t));

  const parallelTrades = activeTrades.filter(t => t.accountId && t.accountId !== 'A1');
  const evaluatedParallelTrades = parallelTrades.map(pTrade => {
    if (pTrade.status === 'CLOSED') return pTrade;

    // determine root trade id (removing the _A2 or _A2_L suffix)
    const rootIdMatch = pTrade.id.match(/^(.+?)_A\d+(?:_[LS])?$/);
    const rootId = rootIdMatch ? rootIdMatch[1] : null;

    if (rootId && rootTradesMap.has(rootId)) {
      const rootTrade = rootTradesMap.get(rootId)!;
      if (rootTrade.status === 'CLOSED') {
        const exitPrice = rootTrade.exitPrice || currentCandle.close;
        const priceDiff = pTrade.side === 'LONG'
          ? exitPrice - pTrade.entryPrice
          : pTrade.entryPrice - exitPrice;

        const pipMultiplier = config.pipMultiplier || 1;
        const pips = priceDiff / pipMultiplier;
        
        // Use A1's exit reason
        let exitReason = rootTrade.exitReason;
        if (pTrade.side !== rootTrade.side && exitReason === 'STOP_LOSS') {
           exitReason = 'TAKE_PROFIT'; // if inverted, root's SL is our TP conceptually
        } else if (pTrade.side !== rootTrade.side && exitReason === 'TAKE_PROFIT') {
           exitReason = 'STOP_LOSS'; 
        }

        let pnl = 0;
        if (leverageConfig && leverageConfig.enabled) {
          pnl = calculatePnL(pTrade.entryPrice, exitPrice, pTrade.size || 1, pTrade.side);
        } else {
          pnl = priceDiff;
        }

        if (runningBalance !== undefined) {
          // Parallel accounts might need separate balance tracking later, but for now we increment global or mock it
          // the prompt states `They share the same entry/exit events but maintain distinct account IDs`
          // We don't have separate parallel account balance tracker in `evaluateTradeExits` but let's just do running global for now or keep separate
          runningBalance += pnl; // Note: if we want to track separate balances, we need a different mechanism. For now, use runningBalance.
        }
        
        return {
          ...pTrade,
          status: 'CLOSED' as 'CLOSED',
          exitPrice,
          exitTime: rootTrade.exitTime,
          exitIndex: rootTrade.exitIndex,
          exitReason, 
          pnl,
          pips,
          balanceAfter: runningBalance,
          latencyDelaySeconds: rootTrade.latencyDelaySeconds,
          infoStatus: rootTrade.infoStatus
        };
      } else {
        return {
          ...pTrade,
          latencyDelaySeconds: rootTrade.latencyDelaySeconds,
          infoStatus: rootTrade.infoStatus
        };
      }
    }
    
    // Fallback if root trade not found (shouldn't happen)
    return pTrade;
  });

  return [...finalRootTrades, ...evaluatedParallelTrades] as Trade[];
}

