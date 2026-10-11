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

export function calculateATR(data: Ohlc[], period: number): number[] {
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
  const tr = new Array(data.length).fill(0);
  const plusDM = new Array(data.length).fill(0);
  const minusDM = new Array(data.length).fill(0);

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevHigh = data[i - 1].high;
    const prevLow = data[i - 1].low;
    const prevClose = data[i - 1].close;

    tr[i] = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    const pdm = high - prevHigh;
    const mdm = prevLow - low;

    if (pdm > mdm && pdm > 0) {
      plusDM[i] = pdm;
    } else {
      plusDM[i] = 0;
    }

    if (mdm > pdm && mdm > 0) {
      minusDM[i] = mdm;
    } else {
      minusDM[i] = 0;
    }
  }

  const smooth = (arr: number[], period: number) => {
    const smoothed = new Array(arr.length).fill(0);
    // Initial sum for the first period
    let sum = 0;
    for (let i = 1; i <= period && i < arr.length; i++) {
      sum += arr[i];
    }
    smoothed[period] = sum;

    for (let i = period + 1; i < arr.length; i++) {
      smoothed[i] = smoothed[i - 1] - (smoothed[i - 1] / period) + arr[i];
    }
    return smoothed;
  };

  const smoothedTR = smooth(tr, period);
  const smoothedPlusDM = smooth(plusDM, period);
  const smoothedMinusDM = smooth(minusDM, period);

  const plusDI = new Array(data.length).fill(0);
  const minusDI = new Array(data.length).fill(0);
  const dx = new Array(data.length).fill(0);

  for (let i = period; i < data.length; i++) {
    if (smoothedTR[i] > 0) {
      plusDI[i] = 100 * (smoothedPlusDM[i] / smoothedTR[i]);
      minusDI[i] = 100 * (smoothedMinusDM[i] / smoothedTR[i]);
    }
    const diSum = plusDI[i] + minusDI[i];
    if (diSum > 0) {
      dx[i] = 100 * (Math.abs(plusDI[i] - minusDI[i]) / diSum);
    }
  }

  const adx = new Array(data.length).fill(0);
  // Initial ADX is simple average of first period of DX
  let dxSum = 0;
  for (let i = period; i < period * 2 && i < dx.length; i++) {
    dxSum += dx[i];
  }
  adx[period * 2 - 1] = dxSum / period;

  for (let i = period * 2; i < data.length; i++) {
    adx[i] = (adx[i - 1] * (period - 1) + dx[i]) / period;
  }

  return { adx, plusDI, minusDI };
}
