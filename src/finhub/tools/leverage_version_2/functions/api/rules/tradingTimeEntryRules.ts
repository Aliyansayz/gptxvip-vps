import { Trade } from '../../../../types/trading';
import { TradingRulesConfig } from './tradingRules';
import { calculateVolatilityAdjustedLimit } from './tradingVolatilityRules';

/**
 * Time Entry Rules
 * Evaluates entry conditions for recurrent trades based on time elapsed since main trade.
 */
export function checkTimeEntryRules(
  referenceTrade: Trade,
  currentTimeMs: number,
  config: TradingRulesConfig,
  zScoreValue?: number
): boolean {
  if (!config.recurrentTradeParams || !config.isRecurrentTradeActive) {
    return false;
  }

  const { entryAfterNSeconds, entryAfterNSecondsMin, entryAfterNSecondsMax } = config.recurrentTradeParams;
  
  const adjustedSecondsLimit = calculateVolatilityAdjustedLimit(
    entryAfterNSeconds,
    entryAfterNSecondsMin,
    entryAfterNSecondsMax,
    zScoreValue
  );

  if (adjustedSecondsLimit > 0) {
    const timeDiffMs = currentTimeMs - referenceTrade.entryTime;
    const secondsDiff = timeDiffMs / 1000;
    if (secondsDiff >= adjustedSecondsLimit) {
      return true;
    }
    return false;
  }

  // If no time constraints are set, time condition is met by default
  return true;
}
