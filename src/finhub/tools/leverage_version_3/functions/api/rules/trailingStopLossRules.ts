import { Ohlc } from '../indicators/baseline';
import { getVolatilityRegime } from '../indicators/exclusive/volatilityBehavior';

/**
 * Calculates a dynamically adjusted ATR multiplier based on the current volatility regime:
 * - Low-volatility regime -> Tighter stops (multiplier reduced by 25% to e.g. 0.75x)
 * - High-volatility regime -> Wider stops (multiplier expanded by 40% to e.g. 1.4x)
 * to avoid premature shakeouts during macroeconomic/volatility events.
 */
export function getDynamicVolatilityAtrMultiplier(
  closePrices: number[],
  currentIndex: number,
  baseMultiplier: number,
  regimePeriod: number = 30
): number {
  if (closePrices.length < 2 || currentIndex < 0) {
    return baseMultiplier;
  }

  try {
    const vrResult = getVolatilityRegime(closePrices, regimePeriod);
    const regimeArray = vrResult.regime;
    const currentRegime = regimeArray[Math.min(currentIndex, regimeArray.length - 1)];

    if (currentRegime === 1) {
      // High volatility regime: widen stop loss factor to prevent premature exit
      return baseMultiplier * 1.4;
    } else {
      // Low volatility regime: tighten stop loss factor for dynamic cost cutting
      return baseMultiplier * 0.75;
    }
  } catch (e) {
    return baseMultiplier;
  }
}

/**
 * Calculates the dynamic stop-loss lower and upper bands at a given index
 * adjusted dynamically based on the volatility regime.
 */
export function calculateDynamicVolatilityRegimeStops(
  data: Ohlc[],
  currentIndex: number,
  period: number,
  baseMultiplier: number,
  regimePeriod: number = 30
): { lowerBand: number; upperBand: number } {
  if (data.length === 0 || currentIndex < 0) {
    return { lowerBand: 0, upperBand: 0 };
  }

  const closePrices = data.map(d => d.close);
  
  // Hand-cranked SMA and ATR to avoid running out of bounds
  const smaVal = (() => {
    const start = Math.max(0, currentIndex - period + 1);
    const subset = closePrices.slice(start, currentIndex + 1);
    return subset.length > 0 ? subset.reduce((sum, v) => sum + v, 0) / subset.length : closePrices[currentIndex];
  })();

  const atrVal = (() => {
    const tr: number[] = [0];
    for (let i = 1; i <= currentIndex; i++) {
      tr.push(Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i - 1].close),
        Math.abs(data[i].low - data[i - 1].close)
      ));
    }
    const start = Math.max(0, currentIndex - period + 1);
    const subset = tr.slice(start, currentIndex + 1);
    return subset.length > 0 ? subset.reduce((sum, v) => sum + v, 0) / subset.length : 0;
  })();

  const dynamicMultiplier = getDynamicVolatilityAtrMultiplier(closePrices, currentIndex, baseMultiplier, regimePeriod);

  return {
    lowerBand: smaVal - atrVal * dynamicMultiplier,
    upperBand: smaVal + atrVal * dynamicMultiplier
  };
}
