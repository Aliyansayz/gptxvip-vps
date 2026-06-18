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
  squeezeStatus?: number,
  volRegimeScenario?: 'A'|'B'|'C'|'D'|'None',
  slopePersistenceValue?: number,
  trendEfficiencyValue?: number,
  wickEfficiencyValue?: number
): boolean {
  if (adxValue !== undefined) {
    if (config.useADXFilter) {
      const threshold = config.adxThreshold !== undefined ? config.adxThreshold : 20;
      if (adxValue < threshold) return false;
    }
    if (config.useADXRange) {
      const min = config.adxMin !== undefined ? config.adxMin : 20;
      const max = config.adxMax !== undefined ? config.adxMax : 50;
      if (adxValue < min || adxValue > max) return false;
    }
  }

  if (slopePersistenceValue !== undefined) {
    if (config.useSlopePersistenceFilter) {
      const threshold = config.slopePersistenceThreshold !== undefined ? config.slopePersistenceThreshold : 0.7;
      if (slopePersistenceValue < threshold) return false;
    }
    if (config.useSlopePersistenceRange) {
      const min = config.slopePersistenceMin !== undefined ? config.slopePersistenceMin : 0.5;
      const max = config.slopePersistenceMax !== undefined ? config.slopePersistenceMax : 1.0;
      if (slopePersistenceValue < min || slopePersistenceValue > max) return false;
    }
  }

  if (trendEfficiencyValue !== undefined) {
    if (config.useTrendEfficiencyFilter) {
      const threshold = config.trendEfficiencyThreshold !== undefined ? config.trendEfficiencyThreshold : 0.6;
      if (trendEfficiencyValue < threshold) return false;
    }
    if (config.useTrendEfficiencyRange) {
      const min = config.trendEfficiencyMin !== undefined ? config.trendEfficiencyMin : 0.4;
      const max = config.trendEfficiencyMax !== undefined ? config.trendEfficiencyMax : 1.0;
      if (trendEfficiencyValue < min || trendEfficiencyValue > max) return false;
    }
  }

  if (wickEfficiencyValue !== undefined) {
    if (config.useWickEfficiencyFilter) {
      const threshold = config.wickEfficiencyThreshold !== undefined ? config.wickEfficiencyThreshold : 0.55;
      if (wickEfficiencyValue < threshold) return false;
    }
    if (config.useWickEfficiencyRange) {
      const min = config.wickEfficiencyMin !== undefined ? config.wickEfficiencyMin : 0.3;
      const max = config.wickEfficiencyMax !== undefined ? config.wickEfficiencyMax : 1.0;
      if (wickEfficiencyValue < min || wickEfficiencyValue > max) return false;
    }
  }

  if (config.useSqueezeFilter && squeezeStatus !== undefined) {
    if (squeezeStatus !== 0) return false; // 0 = expansion
  }

  if (config.useVolRegimeScenarioA && volRegimeScenario !== 'A') {
    return false;
  }
  if (config.useVolRegimeScenarioC && volRegimeScenario !== 'C') {
    return false;
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
