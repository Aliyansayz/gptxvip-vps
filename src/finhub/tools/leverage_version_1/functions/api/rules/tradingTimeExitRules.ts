import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { calculateVolatilityAdjustedLimit } from './tradingVolatilityRules';

export function checkTimeBasedExitConditions(
  trade: Trade,
  currentTimeMs: number,
  currentIndex: number,
  config: TradingRulesConfig,
  zScoreValue?: number
): { shouldExit: boolean, exitReason?: Trade['exitReason'] } {
  
  // Check Time Limit (Minutes)
  const adjustedMinutesLimit = calculateVolatilityAdjustedLimit(config.exitAfterNMinutes, config.exitAfterNMinutesMin, config.exitAfterNMinutesMax, zScoreValue);
  if (adjustedMinutesLimit > 0) {
    const timeDiffMs = currentTimeMs - trade.entryTime;
    const minutesDiff = timeDiffMs / (1000 * 60);
    if (minutesDiff >= adjustedMinutesLimit) {
      return { shouldExit: true, exitReason: 'TIME_LIMIT' };
    }
  }

  // Check Time Limit (Seconds)
  const adjustedSecondsLimit = calculateVolatilityAdjustedLimit(config.exitAfterNSeconds, config.exitAfterNSecondsMin, config.exitAfterNSecondsMax, zScoreValue);
  if (adjustedSecondsLimit > 0) {
    const timeDiffMs = currentTimeMs - trade.entryTime;
    const secondsDiff = timeDiffMs / 1000;
    if (secondsDiff >= adjustedSecondsLimit) {
      return { shouldExit: true, exitReason: 'TIME_LIMIT' };
    }
  }

  // Check Candle Limit
  const adjustedCandlesLimit = calculateVolatilityAdjustedLimit(config.exitAfterNCandles, config.exitAfterNCandlesMin, config.exitAfterNCandlesMax, zScoreValue);
  if (adjustedCandlesLimit > 0) {
    const candlesDiff = currentIndex - trade.entryIndex;
    if (candlesDiff >= adjustedCandlesLimit) {
      return { shouldExit: true, exitReason: 'CANDLE_LIMIT' };
    }
  }

  return { shouldExit: false };
}
