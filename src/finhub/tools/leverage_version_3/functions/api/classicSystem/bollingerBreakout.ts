import { Ohlc } from '../indicators/baseline';
import { calculateBollingerBands } from '../indicators/exclusive/bollingerBands';

export function calculateBollingerBreakout(data: Ohlc[], period = 55, stdDev = 1) {
  const bb = calculateBollingerBands(data, period, stdDev);
  const state = data.map((candle, i) => {
    const band = bb[i];
    if (!Number.isFinite(band.upper)) return 0;
    return candle.close > band.upper ? 1 : candle.close < band.lower ? -1 : 0;
  });
  // Pine's barssince comparison retains the last breakout direction through
  // candles inside the bands. A signal occurs only when that direction flips.
  let direction = 0;
  const trend = state.map(value => value === 0 ? direction : (direction = value));
  const longEntry = trend.map((value, i) => value === 1 && (i === 0 || trend[i - 1] !== 1));
  const shortEntry = trend.map((value, i) => value === -1 && (i === 0 || trend[i - 1] !== -1));
  return { bb, trend, longEntry, shortEntry };
}
