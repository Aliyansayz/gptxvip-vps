// -----------------------------
// Utility Functions
// -----------------------------

function zeros(n: number): number[] {
    return Array(n).fill(0);
}

function mean(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[]): number {
    const m = mean(arr);
    return Math.sqrt(mean(arr.map(x => (x - m) ** 2)));
}

function diff(arr: number[]): number[] {
    const result = [0];
    for (let i = 1; i < arr.length; i++) {
        result.push(arr[i] - arr[i - 1]);
    }
    return result;
}

function rollingWindow(arr: number[], size: number): number[][] {
    const result: number[][] = [];
    for (let i = 0; i <= arr.length - size; i++) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

// -----------------------------
// Scenario Based Trend Decay State
// -----------------------------
export function trendDecayState(
    z: number[],
    volRegime: number[],
    upper = 1.5,
    lower = -1.5
): number[] {

    const n = z.length;
    const dz = zeros(n);

    for (let i = 1; i < n; i++) {
        dz[i] = z[i] - z[i - 1];
    }

    const decayState = zeros(n);

    for (let i = 2; i < n; i++) {

        if (Math.abs(z[i]) < upper && volRegime[i] === 1) {
            decayState[i] = 0;
        }

        else if (Math.abs(z[i]) > upper && volRegime[i] === 0) {

            if (dz[i] < 0) {
                decayState[i] = 3;
            } else {
                decayState[i] = 2;
            }
        }

        else if (Math.abs(z[i]) > upper && volRegime[i] === 1) {

            if (dz[i] < 0) {
                decayState[i] = 2;
            } else {
                decayState[i] = 1;
            }
        }

        else {
            decayState[i] = 0;
        }
    }

    return decayState;
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

        slopes.push(num / denom);
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
// Volatility Regime
// -----------------------------
export function getVolatilityRegime(close: number[], period = 30) {

    const returns = diff(close);
    const vol = rollingStd(returns, period);

    const sorted = [...vol].sort((a, b) => a - b);
    const medianVol = sorted[Math.floor(sorted.length / 2)];

    const regime = vol.map(v => (v > medianVol ? 1 : 0));

    return { regime, vol };
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
