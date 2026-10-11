import { Ohlc } from '../indicators/baseline';

export function generateDummyCandles(count: number, startPrice: number = 2000, intervalMs: number = 60000, volMultiplier: number = 1): Ohlc[] {
  const candles: Ohlc[] = [];
  let currentPrice = startPrice;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const volatility = currentPrice * 0.001 * volMultiplier;
    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    candles.push({
      time: now - (count - i) * intervalMs,
      open,
      high,
      low,
      close,
      volume: Math.random() * 100
    });
    currentPrice = close;
  }
  return candles;
}
