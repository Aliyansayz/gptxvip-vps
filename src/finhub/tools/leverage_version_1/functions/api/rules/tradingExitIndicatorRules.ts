import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { Ohlc } from '../indicators/baseline';

export function checkIndicatorBasedExitConditions(
  trade: Trade,
  currentCandle: Ohlc,
  signal: 'LONG' | 'SHORT' | null,
  config: TradingRulesConfig
): { shouldExit: boolean, exitReason?: Trade['exitReason'], exitPrice?: number } {
  
  // Check Stop Loss
  if (config.useStopLoss && trade.stopLoss !== undefined) {
    if (trade.side === 'LONG' && currentCandle.low <= trade.stopLoss) {
      return { shouldExit: true, exitReason: 'STOP_LOSS', exitPrice: trade.stopLoss };
    } else if (trade.side === 'SHORT' && currentCandle.high >= trade.stopLoss) {
      return { shouldExit: true, exitReason: 'STOP_LOSS', exitPrice: trade.stopLoss };
    }
  }

  // Check Take Profit
  if (config.useTakeProfit && trade.takeProfit !== undefined) {
      if (trade.side === 'LONG' && currentCandle.high >= trade.takeProfit) {
      return { shouldExit: true, exitReason: 'TAKE_PROFIT', exitPrice: trade.takeProfit };
    } else if (trade.side === 'SHORT' && currentCandle.low <= trade.takeProfit) {
      return { shouldExit: true, exitReason: 'TAKE_PROFIT', exitPrice: trade.takeProfit };
    }
  }

  // Check Signal Reversal
  if (config.exitOnSignalReversal && signal) {
    if ((trade.side === 'LONG' && signal === 'SHORT') || 
        (trade.side === 'SHORT' && signal === 'LONG')) {
      return { shouldExit: true, exitReason: 'SIGNAL_REVERSAL', exitPrice: currentCandle.close };
    }
  }

  return { shouldExit: false };
}
