import { Ohlc } from '../indicators/baseline';

export interface IchimokuOptions {
  tenkanPeriod?: number;
  kijunPeriod?: number;
  senkouBPeriod?: number;
  displacement?: number;
}

// All arrays are aligned to the candle being evaluated. The cloud is the
// leading spans calculated `displacement` candles earlier, avoiding lookahead.
export function calculateIchimoku(data: Ohlc[], options: IchimokuOptions = {}) {
  const tenkanPeriod = Math.max(1, Math.floor(options.tenkanPeriod ?? 9));
  const kijunPeriod = Math.max(1, Math.floor(options.kijunPeriod ?? 26));
  const senkouBPeriod = Math.max(1, Math.floor(options.senkouBPeriod ?? 52));
  const displacement = Math.max(1, Math.floor(options.displacement ?? 26));
  const midpoint = (i: number, period: number) => {
    if (i < period - 1) return NaN;
    let high = -Infinity, low = Infinity;
    for (let j = i - period + 1; j <= i; j++) {
      high = Math.max(high, data[j].high);
      low = Math.min(low, data[j].low);
    }
    return (high + low) / 2;
  };
  const tenkan = data.map((_, i) => midpoint(i, tenkanPeriod));
  const kijun = data.map((_, i) => midpoint(i, kijunPeriod));
  const senkouA = tenkan.map((value, i) => (value + kijun[i]) / 2);
  const senkouB = data.map((_, i) => midpoint(i, senkouBPeriod));
  const cloudA = data.map((_, i) => i >= displacement ? senkouA[i - displacement] : NaN);
  const cloudB = data.map((_, i) => i >= displacement ? senkouB[i - displacement] : NaN);
  const chikou = data.map((_, i) => i + displacement < data.length ? data[i + displacement].close : NaN);
  const trend = data.map((candle, i) => {
    if (!Number.isFinite(cloudA[i]) || !Number.isFinite(cloudB[i]) || !Number.isFinite(tenkan[i]) || !Number.isFinite(kijun[i]) || i < displacement) return 0;
    if (tenkan[i] > kijun[i] && candle.close > data[i - displacement].close && candle.close > Math.max(cloudA[i], cloudB[i])) return 1;
    if (tenkan[i] < kijun[i] && candle.close < data[i - displacement].close && candle.close < Math.min(cloudA[i], cloudB[i])) return -1;
    return 0;
  });
  const longEntry = trend.map((value, i) => value === 1 && (i === 0 || trend[i - 1] !== 1));
  const shortEntry = trend.map((value, i) => value === -1 && (i === 0 || trend[i - 1] !== -1));
  return { tenkan, kijun, senkouA, senkouB, cloudA, cloudB, chikou, trend, longEntry, shortEntry };
}
