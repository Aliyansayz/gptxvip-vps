export interface Ohlc {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / period);
  }
  return result;
}

export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const k = 2 / (period + 1);
  let ema = data[0];
  result.push(ema);
  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
    result.push(ema);
  }
  return result;
}

export function calculateStochastic(data: Ohlc[], period: number, kPeriod: number, dPeriod: number) {
  const kValues: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      kValues.push(NaN);
      continue;
    }
    const subset = data.slice(i - period + 1, i + 1);
    const low = Math.min(...subset.map(d => d.low));
    const high = Math.max(...subset.map(d => d.high));
    const currentClose = data[i].close;
    const k = ((currentClose - low) / (high - low)) * 100;
    kValues.push(k);
  }

  const kLine = calculateSMA(kValues.filter(v => !isNaN(v)), kPeriod);
  const dLine = calculateSMA(kLine.filter(v => !isNaN(v)), dPeriod);

  // Pad with NaN to match original length
  const finalK = Array(data.length - kLine.length).fill(NaN).concat(kLine);
  const finalD = Array(data.length - dLine.length).fill(NaN).concat(dLine);

  return { k: finalK, d: finalD };
}

export function calculateSupertrend(data: Ohlc[], period: number, multiplier: number) {
  const atr = calculateATR(data, period);
  const upperBand: number[] = [];
  const lowerBand: number[] = [];
  const trend: number[] = [];
  const supertrend: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < period) {
      upperBand.push(NaN);
      lowerBand.push(NaN);
      trend.push(1);
      supertrend.push(NaN);
      continue;
    }

    const mid = (data[i].high + data[i].low) / 2;
    let basicUpper = mid + multiplier * atr[i];
    let basicLower = mid - multiplier * atr[i];

    if (isNaN(upperBand[i - 1])) {
      upperBand.push(basicUpper);
      lowerBand.push(basicLower);
    } else {
      upperBand.push(basicUpper < upperBand[i - 1] || data[i - 1].close > upperBand[i - 1] ? basicUpper : upperBand[i - 1]);
      lowerBand.push(basicLower > lowerBand[i - 1] || data[i - 1].close < lowerBand[i - 1] ? basicLower : lowerBand[i - 1]);
    }

    let currentTrend = trend[i - 1];
    if (currentTrend === 1 && data[i].close < lowerBand[i]) {
      currentTrend = -1;
    } else if (currentTrend === -1 && data[i].close > upperBand[i]) {
      currentTrend = 1;
    }
    trend.push(currentTrend);
    supertrend.push(currentTrend === 1 ? lowerBand[i] : upperBand[i]);
  }

  return { supertrend, trend };
}

function calculateATR(data: Ohlc[], period: number): number[] {
  const tr: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      tr.push(data[i].high - data[i].low);
    } else {
      tr.push(Math.max(
        data[i].high - data[i].low,
        Math.abs(data[i].high - data[i - 1].close),
        Math.abs(data[i].low - data[i - 1].close)
      ));
    }
  }
  return calculateSMA(tr, period);
}

export function calculateStopBandsSmooth(data: Ohlc[], period: number, multiplier: number, _smooth?: boolean, _useATR?: boolean) {
  const sma = calculateSMA(data.map(d => d.close), period);
  const atr = calculateATR(data, period);
  const lowerBand = sma.map((v, i) => v - atr[i] * multiplier);
  const upperBand = sma.map((v, i) => v + atr[i] * multiplier);
  return { lowerBand, upperBand };
}

export function calculateADX(data: Ohlc[], period: number) {
  // Simplified ADX Placeholder
  return {
    adx: Array(data.length).fill(25),
    plusDI: Array(data.length).fill(20),
    minusDI: Array(data.length).fill(15),
  };
}
