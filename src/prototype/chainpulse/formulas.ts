import type { Candle, Holding } from "./data";
export const lastPrice = (candles: Candle[]) => candles.at(-1)?.close || 0;
export function valuation(
  holdings: Holding[],
  candles: Record<string, Candle[]>,
) {
  return holdings.map((h) => ({
    ...h,
    price: lastPrice(candles[h.asset]),
    value: h.quantity * lastPrice(candles[h.asset]),
    cost: h.quantity * h.averageCost,
    pnl: h.quantity * (lastPrice(candles[h.asset]) - h.averageCost),
  }));
}
export const median = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
};
export function tick(candles: Candle[], n: number) {
  const prev = candles.at(-1)!;
  const close = prev.close * (1 + (n % 2 ? -0.0015 : 0.002));
  const time = new Date(Date.parse(prev.time + "Z") + 1800000)
    .toISOString()
    .slice(0, 16);
  return [
    ...candles,
    {
      time,
      open: prev.close,
      close,
      high: Math.max(prev.close, close) * 1.002,
      low: Math.min(prev.close, close) * 0.998,
      volume: 90 + n * 2,
    },
  ].slice(-50);
}
