import { fetchTrendStrengthAndVolatility } from '../indicatorState/fetchTrendStrengthAndVolatility';
import { positionSizeFromTrend, positionSizeVolAdjusted } from '../indicators/adaptiveRiskSizing/adaptiveRiskSizing';
import { LeverageConfig } from './leveragedPositionSizeMetals';

export function evaluateAdaptiveRiskPercentage(
  basePercentage: number,
  config: LeverageConfig,
  alphaData: any[]
): number {
  if (!config.adaptivePositionSizingMode || config.adaptivePositionSizingMode === 'none') {
    return basePercentage;
  }

  const { trendStrength, volatility } = fetchTrendStrengthAndVolatility(alphaData, config);

  if (trendStrength.length === 0) {
    return basePercentage;
  }

  const minPct = config.adaptiveMinPercentage ?? 0.5;
  const maxPct = config.adaptiveMaxPercentage ?? 2.0;

  if (config.adaptivePositionSizingMode === 'trend_based') {
    const percentages = positionSizeFromTrend(trendStrength, minPct, maxPct);
    return percentages[percentages.length - 1] ?? basePercentage;
  }

  if (config.adaptivePositionSizingMode === 'volatility_based') {
    const percentages = positionSizeVolAdjusted(trendStrength, volatility, minPct, maxPct);
    return percentages[percentages.length - 1] ?? basePercentage;
  }

  return basePercentage;
}
