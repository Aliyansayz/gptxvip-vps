import { Ohlc } from '../indicators/baseline';

export interface TurtleTradingOptions {
  entryPeriod?: number;
  exitPeriod?: number;
  nPeriod?: number;
  stopMultiple?: number;
}

/**
 * Bar based Turtle channel signals. The original System 1 used 20/10 and
 * System 2 used 55/20; this simulator uses their channel and N stop rules.
 * A channel at i contains only the preceding completed candles.
 * Trades execute in the simulator at the signal candle close, since the
 * simulator has no intrabar order sequence or tick size.
 */
export function calculateTurtleTrading(data: Ohlc[], options: TurtleTradingOptions = {}) {
  const entryPeriod = Math.max(1, Math.floor(options.entryPeriod ?? 20));
  const exitPeriod = Math.max(1, Math.floor(options.exitPeriod ?? 10));
  const nPeriod = Math.max(1, Math.floor(options.nPeriod ?? 20));
  const stopMultiple = Math.max(0.1, options.stopMultiple ?? 2);

  const channel = (period: number) => {
    const upper = data.map(() => NaN);
    const lower = data.map(() => NaN);
    for (let i = period; i < data.length; i++) {
      let high = -Infinity, low = Infinity;
      for (let j = i - period; j < i; j++) {
        high = Math.max(high, data[j].high);
        low = Math.min(low, data[j].low);
      }
      upper[i] = high;
      lower[i] = low;
    }
    return { upper, lower };
  };
  const entry = channel(entryPeriod);
  const exit = channel(exitPeriod);

  const n = data.map(() => NaN);
  let trSum = 0;
  for (let i = 0; i < data.length; i++) {
    const candle = data[i];
    const previousClose = i ? data[i - 1].close : candle.close;
    const trueRange = Math.max(candle.high - candle.low, Math.abs(candle.high - previousClose), Math.abs(candle.low - previousClose));
    if (i < nPeriod) trSum += trueRange;
    if (i === nPeriod - 1) n[i] = trSum / nPeriod;
    else if (i >= nPeriod) n[i] = (n[i - 1] * (nPeriod - 1) + trueRange) / nPeriod;
  }

  const trend: number[] = [];
  const longEntry: boolean[] = [];
  const shortEntry: boolean[] = [];
  const exitLong: boolean[] = [];
  const exitShort: boolean[] = [];
  for (let i = 0; i < data.length; i++) {
    const candle = data[i];
    let direction = i ? trend[i - 1] : 0;
    const longBreakout = Number.isFinite(n[i]) && Number.isFinite(entry.upper[i]) && candle.high > entry.upper[i];
    const shortBreakout = Number.isFinite(n[i]) && Number.isFinite(entry.lower[i]) && candle.low < entry.lower[i];
    // Both boundaries crossed within one OHLC candle: order is unknowable.
    const ambiguous = longBreakout && shortBreakout;
    const longExit = direction === 1 && Number.isFinite(exit.lower[i]) && candle.low < exit.lower[i];
    const shortExit = direction === -1 && Number.isFinite(exit.upper[i]) && candle.high > exit.upper[i];
    if (longExit || shortExit) direction = 0;
    // Repeated fresh highs/lows remain eligible: the account may have been
    // stopped out even while the channel trend itself stayed intact.
    const enterLong = !ambiguous && !longExit && !shortExit && longBreakout;
    const enterShort = !ambiguous && !longExit && !shortExit && shortBreakout;
    if (enterLong) direction = 1;
    else if (enterShort) direction = -1;
    trend.push(direction);
    longEntry.push(enterLong);
    shortEntry.push(enterShort);
    exitLong.push(longExit);
    exitShort.push(shortExit);
  }

  const stopLower = data.map((candle, i) => Number.isFinite(n[i]) ? candle.close - stopMultiple * n[i] : NaN);
  const stopUpper = data.map((candle, i) => Number.isFinite(n[i]) ? candle.close + stopMultiple * n[i] : NaN);
  return { entryUpper: entry.upper, entryLower: entry.lower, exitUpper: exit.upper, exitLower: exit.lower,
    n, stopLower, stopUpper, trend, longEntry, shortEntry, exitLong, exitShort };
}
