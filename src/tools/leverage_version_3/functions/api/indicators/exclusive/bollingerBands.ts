import { Ohlc } from '../baseline';

export interface BollingerBandsResult {
  basis: number;
  upper: number;
  lower: number;
}

export function calculateBollingerBands(data: Ohlc[], period: number, multiplier: number): BollingerBandsResult[] {
  const close = data.map(d => d.close);
  const n = close.length;

  const result: BollingerBandsResult[] = [];
  for (let i = 0; i < n; i++) {
    if (i < period - 1) {
      result.push({ upper: NaN, lower: NaN, basis: NaN });
      continue;
    }

    const window = close.slice(i - period + 1, i + 1);
    const mean = window.reduce((a, b) => a + b, 0) / period;

    let variance = 0;
    for (const v of window) {
      variance += (v - mean) ** 2;
    }
    const std = Math.sqrt(variance / period);

    const dev = std * multiplier;
    result.push({
      basis: mean,
      upper: mean + dev,
      lower: mean - dev
    });
  }

  return result;
}
