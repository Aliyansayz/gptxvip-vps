import { Ohlc } from '../indicators/baseline';
import { Trade, PositionSide } from '../../../../types/trading';

export interface TradingRulesConfig {
  entryOnSignal: boolean;
  exitOnSignalReversal: boolean;
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

export function evaluateTradeEntries(
  currentIndex: number,
  data: Ohlc[],
  signal: 'LONG' | 'SHORT' | null,
  activeTrades: Trade[],
  config: TradingRulesConfig,
  customStopLossValue?: { upper: number, lower: number },
  adxValue?: number,
  squeezeStatus?: number
): Trade | null {
  if (!config.entryOnSignal || !signal) return null;

  // ADX Filter
  if (config.useADXFilter && adxValue !== undefined && config.adxThreshold !== undefined) {
    if (adxValue < config.adxThreshold) return null;
  }

  // Squeeze Filter
  if (config.useSqueezeFilter && squeezeStatus !== undefined) {
    if (squeezeStatus !== 0) return null; // Wait for expansion (0) to enter
  }

  // Check if we already have an open trade
  const hasOpenTrade = activeTrades.some(t => t.status === 'OPEN');
  if (hasOpenTrade) return null;

  const currentCandle = data[currentIndex];
  
  let stopLoss = undefined;
  let takeProfit = undefined;

  if (config.useStopLoss && customStopLossValue) {
    if (signal === 'LONG') {
      stopLoss = customStopLossValue.lower;
      if (config.useTakeProfit) {
        const risk = currentCandle.close - stopLoss;
        takeProfit = currentCandle.close + (risk * config.rewardRiskRatio);
      }
    } else {
      stopLoss = customStopLossValue.upper;
      if (config.useTakeProfit) {
        const risk = stopLoss - currentCandle.close;
        takeProfit = currentCandle.close - (risk * config.rewardRiskRatio);
      }
    }
  } else {
    // Fixed Pip-based Limit
    if (config.stopLossPips !== undefined && config.stopLossPips > 0) {
      const pipMultiplier = config.pipMultiplier || 1;
      if (signal === 'LONG') {
        stopLoss = currentCandle.close - (config.stopLossPips * pipMultiplier);
      } else {
        stopLoss = currentCandle.close + (config.stopLossPips * pipMultiplier);
      }
    }

    if (config.takeProfitPips !== undefined && config.takeProfitPips > 0) {
      const pipMultiplier = config.pipMultiplier || 1;
      if (signal === 'LONG') {
        takeProfit = currentCandle.close + (config.takeProfitPips * pipMultiplier);
      } else {
        takeProfit = currentCandle.close - (config.takeProfitPips * pipMultiplier);
      }
    }
  }

  return {
    id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    side: signal,
    entryPrice: currentCandle.close,
    entryTime: currentCandle.time,
    entryIndex: currentIndex,
    size: 1, // Fixed size for simulation
    status: 'OPEN',
    stopLoss,
    takeProfit,
    executionType: 'MARKET_EXECUTION'
  };
}

function getDynamicLimit(fixed?: number, min?: number, max?: number, zScore?: number): number {
  if (min && min > 0 && max && max > 0 && zScore !== undefined && !isNaN(zScore)) {
    // Clamp zScore to [-2, 2]
    const clampedZ = Math.max(-2, Math.min(2, zScore));
    // Normalize to [0, 1]. Volatility expansion -> 1, compression -> 0
    const normalizedZ = (clampedZ + 2) / 4;
    // Volatility expansion -> shortest time (min). Compression -> longest time (max).
    return max - normalizedZ * (max - min);
  }
  return fixed || 0;
}

export function evaluateTradeExits(
  currentIndex: number,
  data: Ohlc[],
  signal: 'LONG' | 'SHORT' | null,
  activeTrades: Trade[],
  config: TradingRulesConfig,
  zScoreValue?: number
): Trade[] {
  const currentCandle = data[currentIndex];
  // Map through trades and check for exit conditions
  return activeTrades.map(trade => {
    if (trade.status === 'CLOSED') return trade;

    let shouldExit = false;
    let exitReason: Trade['exitReason'] = undefined;
    let exitPrice = currentCandle.close;

    // Check Stop Loss
    if (config.useStopLoss && trade.stopLoss !== undefined) {
      if (trade.side === 'LONG' && currentCandle.low <= trade.stopLoss) {
        shouldExit = true;
        exitReason = 'STOP_LOSS';
        exitPrice = trade.stopLoss; // Assuming slippage brings us to exact SL
      } else if (trade.side === 'SHORT' && currentCandle.high >= trade.stopLoss) {
        shouldExit = true;
        exitReason = 'STOP_LOSS';
        exitPrice = trade.stopLoss;
      }
    }

    // Check Take Profit
    if (!shouldExit && config.useTakeProfit && trade.takeProfit !== undefined) {
       if (trade.side === 'LONG' && currentCandle.high >= trade.takeProfit) {
        shouldExit = true;
        exitReason = 'TAKE_PROFIT';
        exitPrice = trade.takeProfit;
      } else if (trade.side === 'SHORT' && currentCandle.low <= trade.takeProfit) {
        shouldExit = true;
        exitReason = 'TAKE_PROFIT';
        exitPrice = trade.takeProfit;
      }
    }

    // Check Time Limit (Minutes)
    const dynamicMinutes = getDynamicLimit(config.exitAfterNMinutes, config.exitAfterNMinutesMin, config.exitAfterNMinutesMax, zScoreValue);
    if (!shouldExit && dynamicMinutes > 0) {
      const timeDiffMs = currentCandle.time - trade.entryTime;
      const minutesDiff = timeDiffMs / (1000 * 60);
      if (minutesDiff >= dynamicMinutes) {
        shouldExit = true;
        exitReason = 'TIME_LIMIT';
        exitPrice = currentCandle.close;
      }
    }

    // Check Time Limit (Seconds)
    const dynamicSeconds = getDynamicLimit(config.exitAfterNSeconds, config.exitAfterNSecondsMin, config.exitAfterNSecondsMax, zScoreValue);
    if (!shouldExit && dynamicSeconds > 0) {
      const timeDiffMs = currentCandle.time - trade.entryTime;
      const secondsDiff = timeDiffMs / 1000;
      if (secondsDiff >= dynamicSeconds) {
        shouldExit = true;
        exitReason = 'TIME_LIMIT';
        exitPrice = currentCandle.close;
      }
    }

    // Check Candle Limit
    const dynamicCandles = getDynamicLimit(config.exitAfterNCandles, config.exitAfterNCandlesMin, config.exitAfterNCandlesMax, zScoreValue);
    if (!shouldExit && dynamicCandles > 0) {
      const candlesDiff = currentIndex - trade.entryIndex;
      if (candlesDiff >= dynamicCandles) {
        shouldExit = true;
        exitReason = 'CANDLE_LIMIT';
        exitPrice = currentCandle.close;
      }
    }

    // Check Signal Reversal
    if (!shouldExit && config.exitOnSignalReversal && signal) {
      if ((trade.side === 'LONG' && signal === 'SHORT') || 
          (trade.side === 'SHORT' && signal === 'LONG')) {
        shouldExit = true;
        exitReason = 'SIGNAL_REVERSAL';
        exitPrice = currentCandle.close;
      }
    }

    if (shouldExit) {
      const pnl = trade.side === 'LONG' 
        ? exitPrice - trade.entryPrice 
        : trade.entryPrice - exitPrice;
      
      const pipMultiplier = config.pipMultiplier || 1;
      const pips = pnl / pipMultiplier;

      return {
        ...trade,
        status: 'CLOSED',
        exitPrice,
        exitTime: currentCandle.time,
        exitIndex: currentIndex,
        exitReason,
        pnl,
        pips
      };
    }

    return trade;
  });
}
