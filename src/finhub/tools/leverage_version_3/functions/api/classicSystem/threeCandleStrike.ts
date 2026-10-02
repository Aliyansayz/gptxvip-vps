import { Ohlc, calculateEMA, calculateSMA } from '../indicators/baseline';

export interface ThreeCandleStrikeOptions {
  fastEma?: number;
  fastSmma?: number;
  mediumSmma?: number;
  slowSmma?: number;
  regressionPeriod?: number;
  slopeSmooth?: number;
  trendThreshold?: number;
}

export function calculateThreeCandleStrike(data: Ohlc[], options: ThreeCandleStrikeOptions = {}) {
  const close = data.map(c => c.close);
  const smma = (period: number) => {
    const p = Math.max(1, Math.floor(period));
    const seed = calculateSMA(close, p);
    const result = close.map(() => NaN);
    for (let i = p - 1; i < close.length; i++) result[i] = i === p - 1 ? seed[i] : (result[i - 1] * (p - 1) + close[i]) / p;
    return result;
  };
  const ema = calculateEMA(close, options.fastEma ?? 8);
  const fast = smma(options.fastSmma ?? 21);
  const medium = smma(options.mediumSmma ?? 50);
  const slow = smma(options.slowSmma ?? 200);
  const period = Math.max(2, Math.floor(options.regressionPeriod ?? 50));
  const regression = close.map((_, i) => {
    if (i < period - 1) return NaN;
    const meanX = (period - 1) / 2;
    let sumY = 0, numerator = 0, denominator = 0;
    for (let j = 0; j < period; j++) sumY += close[i - period + 1 + j];
    const meanY = sumY / period;
    for (let j = 0; j < period; j++) {
      numerator += (j - meanX) * (close[i - period + 1 + j] - meanY);
      denominator += (j - meanX) ** 2;
    }
    return meanY + (numerator / denominator) * (period - 1 - meanX);
  });
  const slope = regression.map((value, i) => i ? value - regression[i - 1] : NaN);
  const smoothPeriod = Math.max(1, Math.floor(options.slopeSmooth ?? 50));
  const smoothSlope = calculateEMA(slope.map(value => Number.isFinite(value) ? value : 0), smoothPeriod);
  const bullPattern = data.map((c, i) => i >= 3 && data[i - 3].close <= data[i - 3].open && data[i - 2].close <= data[i - 2].open && data[i - 1].close <= data[i - 1].open && c.close > data[i - 1].open);
  const bearPattern = data.map((c, i) => i >= 3 && data[i - 3].close >= data[i - 3].open && data[i - 2].close >= data[i - 2].open && data[i - 1].close >= data[i - 1].open && c.close < data[i - 1].open);
  const threshold = options.trendThreshold ?? 0.03;
  const recentCross = data.map((_, i) => {
    for (let j = Math.max(1, i - 9); j <= i; j++) {
      if ((ema[j - 1] <= fast[j - 1] && ema[j] > fast[j]) || (ema[j - 1] >= fast[j - 1] && ema[j] < fast[j])) return true;
    }
    return false;
  });
  const trend = data.map((_, i) => {
    if (!Number.isFinite(slow[i]) || !Number.isFinite(smoothSlope[i]) || Math.abs(smoothSlope[i]) <= threshold) return 0;
    if (fast[i] > medium[i] && fast[i] > fast[i - 1]) return 1;
    if (fast[i] < medium[i] && fast[i] < fast[i - 1]) return -1;
    return 0;
  });
  const longEntry = bullPattern.map((pattern, i) => pattern && (trend[i] === 1 || (fast[i] < slow[i] && medium[i] < slow[i] && ema[i] > fast[i] && recentCross[i])));
  const shortEntry = bearPattern.map((pattern, i) => pattern && (trend[i] === -1 || (fast[i] > slow[i] && medium[i] > slow[i] && ema[i] < fast[i] && recentCross[i])));
  for (let i = 0; i < trend.length; i++) {
    if (longEntry[i]) trend[i] = 1;
    else if (shortEntry[i]) trend[i] = -1;
  }
  return { ema, fast, medium, slow, smoothSlope, bullPattern, bearPattern, trend, longEntry, shortEntry };
}
