import { TradingRulesConfig } from './tradingRules';

/**
 * Volatility Rules:
 * - ADX Filter
 * - Squeeze Filter
 * - Volatility Regime
 * - Z-Score logic for exits
 */

export function isVolatilityEntryConditionMet(
  config: TradingRulesConfig,
  adxValue?: number,
  squeezeStatus?: number
): boolean {
  if (config.useADXFilter && adxValue !== undefined && config.adxThreshold !== undefined) {
    if (adxValue < config.adxThreshold) return false;
  }

  if (config.useSqueezeFilter && squeezeStatus !== undefined) {
    if (squeezeStatus !== 0) return false; // 0 = expansion
  }

  return true;
}

export function calculateVolatilityAdjustedLimit(
  fixedLimit?: number, 
  minLimit?: number, 
  maxLimit?: number, 
  volatilityZScore?: number
): number {
  if (minLimit && minLimit > 0 && maxLimit && maxLimit > 0 && volatilityZScore !== undefined && !isNaN(volatilityZScore)) {
    const clampedZScore = Math.max(-2, Math.min(2, volatilityZScore));
    const normalizedVolatility = (clampedZScore + 2) / 4;
    return maxLimit - normalizedVolatility * (maxLimit - minLimit);
  }
  return fixedLimit || 0;
}
