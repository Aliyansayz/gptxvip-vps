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
  
  // Use config directly for main trade, but override with recurrent params if applicable
  const isRecurrent = trade.tradeType === 'recurrent trade';
  
  const exitMinutes = isRecurrent && config.recurrentTradeParams ? undefined /* Not supported yet */ : config.exitAfterNMinutes;
  const exitMinutesMin = isRecurrent && config.recurrentTradeParams ? undefined : config.exitAfterNMinutesMin;
  const exitMinutesMax = isRecurrent && config.recurrentTradeParams ? undefined : config.exitAfterNMinutesMax;

  const exitSeconds = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNSeconds : config.exitAfterNSeconds;
  const exitSecondsMin = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNSecondsMin : config.exitAfterNSecondsMin;
  const exitSecondsMax = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNSecondsMax : config.exitAfterNSecondsMax;
  
  const exitCandles = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNCandles : config.exitAfterNCandles;
  const exitCandlesMin = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNCandlesMin : config.exitAfterNCandlesMin;
  const exitCandlesMax = isRecurrent && config.recurrentTradeParams ? config.recurrentTradeParams.exitAfterNCandlesMax : config.exitAfterNCandlesMax;

  // Check Time Limit (Minutes)
  const adjustedMinutesLimit = calculateVolatilityAdjustedLimit(exitMinutes, exitMinutesMin, exitMinutesMax, zScoreValue);
  if (adjustedMinutesLimit > 0) {
    const timeDiffMs = currentTimeMs - trade.entryTime;
    const minutesDiff = timeDiffMs / (1000 * 60);
    if (minutesDiff >= adjustedMinutesLimit) {
      return { shouldExit: true, exitReason: 'TIME_LIMIT' };
    }
  }

  // Check Time Limit (Seconds)
  const adjustedSecondsLimit = calculateVolatilityAdjustedLimit(exitSeconds, exitSecondsMin, exitSecondsMax, zScoreValue);
  if (adjustedSecondsLimit > 0) {
    const timeDiffMs = currentTimeMs - trade.entryTime;
    const secondsDiff = timeDiffMs / 1000;
    if (secondsDiff >= adjustedSecondsLimit) {
      return { shouldExit: true, exitReason: 'TIME_LIMIT' };
    }
  }

  // Check Candle Limit
  const adjustedCandlesLimit = calculateVolatilityAdjustedLimit(exitCandles, exitCandlesMin, exitCandlesMax, zScoreValue);
  if (adjustedCandlesLimit > 0) {
    const candlesDiff = currentIndex - trade.entryIndex;
    if (candlesDiff >= adjustedCandlesLimit) {
      return { shouldExit: true, exitReason: 'CANDLE_LIMIT' };
    }
  }

  return { shouldExit: false };
}
