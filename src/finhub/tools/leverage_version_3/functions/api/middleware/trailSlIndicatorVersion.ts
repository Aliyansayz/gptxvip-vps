import { IndicatorSettings } from '../../../stores/indicators_store';

/**
 * Replicates the stop loss indicator configuration with different input parameters
 * specifically for trailing stop loss if the different variant toggle is active.
 * 
 * @param stopLossIndicator The core stop loss indicator configuration.
 * @returns The stop loss indicator configuration intended for trailing stop loss.
 */
export function getTrailSlIndicator(stopLossIndicator: IndicatorSettings['stopLossIndicator']) {
  if (!stopLossIndicator || !stopLossIndicator.allowDifferentTrailSlIndicator) {
    return stopLossIndicator;
  }

  return {
    ...stopLossIndicator,
    dataSource: stopLossIndicator.trailDataSource || stopLossIndicator.dataSource,
    type: stopLossIndicator.trailType || stopLossIndicator.type,
    // Safely fallback to the default SL parameters if trail equivalents are not defined/falsy
    period: stopLossIndicator.trailPeriod !== undefined && !isNaN(stopLossIndicator.trailPeriod)
      ? stopLossIndicator.trailPeriod 
      : stopLossIndicator.period,
    multiplier: stopLossIndicator.trailMultiplier !== undefined && !isNaN(stopLossIndicator.trailMultiplier)
      ? stopLossIndicator.trailMultiplier 
      : stopLossIndicator.multiplier,
    lastNPeriod: stopLossIndicator.trailLastNPeriod !== undefined && !isNaN(stopLossIndicator.trailLastNPeriod)
      ? stopLossIndicator.trailLastNPeriod 
      : stopLossIndicator.lastNPeriod,
    allowAtrOffset: stopLossIndicator.trailAllowAtrOffset !== undefined
      ? stopLossIndicator.trailAllowAtrOffset 
      : stopLossIndicator.allowAtrOffset,
    atrOffsetMultiplier: stopLossIndicator.trailAtrOffsetMultiplier !== undefined && !isNaN(stopLossIndicator.trailAtrOffsetMultiplier)
      ? stopLossIndicator.trailAtrOffsetMultiplier 
      : stopLossIndicator.atrOffsetMultiplier,
    allowFixedOffset: stopLossIndicator.trailAllowFixedOffset !== undefined
      ? stopLossIndicator.trailAllowFixedOffset 
      : stopLossIndicator.allowFixedOffset,
    fixedOffsetPips: stopLossIndicator.trailFixedOffsetPips !== undefined && !isNaN(stopLossIndicator.trailFixedOffsetPips)
      ? stopLossIndicator.trailFixedOffsetPips 
      : stopLossIndicator.fixedOffsetPips,
  };
}
