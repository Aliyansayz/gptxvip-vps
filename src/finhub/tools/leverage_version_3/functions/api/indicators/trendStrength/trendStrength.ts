export function getVolatilityRegime(close: number[], period = 30) {
    const returns = diff(close);
    const vol = rollingStd(returns, period);

    const sorted = [...vol].sort((a, b) => a - b);
    const medianVol = sorted[Math.floor(sorted.length / 2)];

    const regime = vol.map(v => (v > medianVol ? 1 : 0));

    return { regime, vol };
}



// -----------------------------
// Utility Functions
// -----------------------------

export function zeros(n: number): number[] {
    return Array(n).fill(0);
}

export function mean(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function std(arr: number[]): number {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}

export function diff(arr: number[]): number[] {
    const result = [0];
    for (let i = 1; i < arr.length; i++) {
        result.push(arr[i] - arr[i - 1]);
    }
    return result;
}

export function rollingWindow(arr: number[], size: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i <= arr.length - size; i++) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// -----------------------------
// Rolling Regression Slope
// -----------------------------
export function rollingRegressionSlope(series: number[], period: number): number[] {

    const n = series.length;
    if (n < period) return zeros(n);

    const windows = rollingWindow(series, period);

    const x = Array.from({ length: period }, (_, i) => i);
    const xMean = mean(x);
    const denom = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);

    const slopes: number[] = [];

    for (const win of windows) {
        const yMean = mean(win);

        let num = 0;
        for (let i = 0; i < period; i++) {
            num += (x[i] - xMean) * (win[i] - yMean);
        }

        slopes.push(denom === 0 ? 0 : num / denom);
    }

    const result = zeros(n);
    for (let i = period - 1; i < n; i++) {
        result[i] = slopes[i - (period - 1)];
    }

    return result;
}

// -----------------------------
// Rolling Std
// -----------------------------
export function rollingStd(series: number[], period: number): number[] {

    const n = series.length;
    if (n < period) return zeros(n);

    const windows = rollingWindow(series, period);
    const stds = windows.map(w => std(w));

    const result = zeros(n);
    for (let i = period - 1; i < n; i++) {
        result[i] = stds[i - (period - 1)];
    }

    return result;
}

// -----------------------------
// Linear Regression System
// -----------------------------
export function linearRegressionSystem(
    close: number[],
    slopePeriod = 20,
    volPeriod = 20,
    regimePeriod = 30,
    upper = 1.5,
    lower = -1.5
) {

    const n = close.length;

    const slope = rollingRegressionSlope(close, slopePeriod);

    let vol = rollingStd(close, volPeriod);
    vol = vol.map(v => (v === 0 ? 1e-10 : v));

    const normalizedSlope = slope.map((s, i) => s / vol[i]);

    // Direction
    const direction = normalizedSlope.map(v =>
        v > 0 ? 1 : v < 0 ? -1 : 0
    );

    // Z-score
    const m = mean(normalizedSlope);
    const s = std(normalizedSlope);

    const z = s === 0
        ? zeros(n)
        : normalizedSlope.map(v => (v - m) / s);

    // Reversion
    const reversion = zeros(n);

    for (let i = 2; i < n; i++) {
        if (z[i] < lower && z[i - 2] < z[i]) {
            reversion[i] = 1;
        }
        if (z[i] > upper && z[i - 2] > z[i]) {
            reversion[i] = -1;
        }
    }

    // Volatility regime
    const { regime: volRegime, vol: volSeries } =
        getVolatilityRegime(close, regimePeriod);

    return {
        direction,
        reversion,
        vol_regime: volRegime,
        trend_strength: normalizedSlope,
        volatility: volSeries
    };
}



export function slopePersistenceFast(
  slope: number[],
  lookback: number = 20
): number[] {
  const n = slope.length;
  const signs = slope.map(v => Math.sign(v));

  const result = new Array(n).fill(0);

  let positiveCount = 0;
  let negativeCount = 0;

  for (let i = 0; i < n; i++) {
    const incoming = signs[i];

    // add new element
    if (incoming > 0) positiveCount++;
    else if (incoming < 0) negativeCount++;

    // remove old element (window slide)
    if (i >= lookback) {
      const outgoing = signs[i - lookback];
      if (outgoing > 0) positiveCount--;
      else if (outgoing < 0) negativeCount--;
    }

    // compute only when window is "full"
    if (i >= lookback - 1) {
      result[i] = Math.max(positiveCount, negativeCount) / lookback;
    }
  }

  return result;
}

// Output:

// 1.0 = all slopes same direction
// 0.8 = 80% same direction
// 0.5 = random chop









export function trendEfficiencyFast(
  close: number[],
  lookback: number = 20
): (number | null)[] {
  const n = close.length;
  const result: (number | null)[] = new Array(n).fill(null);

  let absDiffSum = 0;

  for (let i = 0; i < n; i++) {
    if (i > 0) {
      const diff = Math.abs(close[i] - close[i - 1]);
      absDiffSum += diff;

      // subtract outgoing diff from window
      if (i >= lookback) {
        absDiffSum -= Math.abs(close[i - lookback + 1] - close[i - lookback]);
      }
    }

    if (i >= lookback - 1) {
      const start = close[i - lookback + 1];
      const end = close[i];
      const netMove = Math.abs(end - start);

      result[i] = absDiffSum > 0 ? netMove / absDiffSum : 0;
    }
  }

  return result;
}

// Efficiency	Market State
// 0.80-1.00	Strong trend
// 0.60-0.80	Tradable trend
// 0.40-0.60	Mixed
// 0.20-0.40	Choppy
// 0.00-0.20	Whipsaw / Noise


