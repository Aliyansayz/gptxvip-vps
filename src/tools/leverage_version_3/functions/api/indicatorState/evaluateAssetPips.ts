import { priceToPips } from '../middleware/pipsTranslation';
import { Ohlc } from '../indicators/baseline';

export function getAssetPipSize(assetName: string, currentPrice?: number): number {
  const type = assetName.toLowerCase();
  if (type.includes('gold') || type === 'xauusd') {
    return 0.1;
  }
  if (type.includes('jpy')) {
    return 0.01;
  }
  if (currentPrice && currentPrice > 1000) {
    if (type.includes('btc') || type === 'bitcoin') {
      return 1.0;
    }
  }
  return 1.0;
}

export interface PipsDeltas {
  pips_delta_1: number;
  pips_delta_2: number;
  pips_delta_3: number;
  pips_delta_4: number;
  pips_delta_5: number;
}

/**
 * Calculates pips difference for the last N candles (default 5).
 * Compares current close price (at simulationIndex) to past close prices.
 */
export function evaluatePipsDeltas(
  data: Ohlc[],
  simulationIndex: number,
  assetName: string,
  n: number = 5
): PipsDeltas {
  const deltas: PipsDeltas = {
    pips_delta_1: 0,
    pips_delta_2: 0,
    pips_delta_3: 0,
    pips_delta_4: 0,
    pips_delta_5: 0
  };

  if (!data || data.length === 0 || simulationIndex < 0 || simulationIndex >= data.length) {
    return deltas;
  }

  const currentPrice = data[simulationIndex].close;

  for (let k = 1; k <= n; k++) {
    const prevIndex = simulationIndex - k;
    if (prevIndex >= 0 && data[prevIndex]) {
      const prevPrice = data[prevIndex].close;
      const priceDiff = currentPrice - prevPrice;
      const pips = priceToPips(priceDiff, assetName, currentPrice);
      (deltas as any)[`pips_delta_${k}`] = Number(pips.toFixed(2));
    }
  }

  return deltas;
}
