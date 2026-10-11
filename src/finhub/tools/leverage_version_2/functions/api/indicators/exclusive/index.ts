import { Ohlc } from '../baseline';

export function calculateVolatilityZScore(data: Ohlc[], period: number): number[] {
  const closes = data.map(d => d.close);
  const returns = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }

  const result: number[] = [NaN];
  for (let i = 0; i < returns.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    const subset = returns.slice(i - period + 1, i + 1);
    const mean = subset.reduce((a, b) => a + b, 0) / period;
    const stdDev = Math.sqrt(subset.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / period);
    const lastReturn = returns[i];
    const zScore = stdDev === 0 ? 0 : (lastReturn - mean) / stdDev;
    result.push(zScore);
  }
  return result;
}
