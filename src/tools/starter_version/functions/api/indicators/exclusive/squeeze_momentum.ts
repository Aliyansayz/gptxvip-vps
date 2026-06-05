// -----------------------------
// Rolling Mean
// -----------------------------
function rollingMean(arr: number[], period: number): number[] {
    const n = arr.length;
    const result = Array(n).fill(0);

    for (let i = period - 1; i < n; i++) {
        let sum = 0;
        for (let j = i - period + 1; j <= i; j++) {
            sum += arr[j];
        }
        result[i] = sum / period;
    }

    return result;
}

// -----------------------------
// Rolling Std
// -----------------------------
function rollingStd(arr: number[], period: number): number[] {
    const n = arr.length;
    const result = Array(n).fill(0);

    for (let i = period - 1; i < n; i++) {
        const window = arr.slice(i - period + 1, i + 1);
        const mean = window.reduce((a, b) => a + b, 0) / period;

        let variance = 0;
        for (const v of window) {
            variance += (v - mean) ** 2;
        }

        result[i] = Math.sqrt(variance / period);
    }

    return result;
}

// -----------------------------
// Shift (like pandas shift)
// -----------------------------
function shift(arr: number[], step: number): number[] {
    const result = Array(arr.length).fill(NaN);

    for (let i = step; i < arr.length; i++) {
        result[i] = arr[i - step];
    }

    return result;
}

// -----------------------------
// Max of two arrays
// -----------------------------
function maxArr(a: number[], b: number[]): number[] {
    return a.map((v, i) => Math.max(v, b[i]));
}

// -----------------------------
// Main Function
// -----------------------------
export function calculateSqueeze(
    close: number[],
    high: number[],
    low: number[],
    useTrueRange: boolean = true,
    bbLength = 20,
    bbMult = 2.0,
    kcLength = 20,
    kcMult = 1.5
) {

    const n = close.length;

    // =========================
    // Bollinger Bands
    // =========================
    const basis = rollingMean(close, bbLength);
    const std = rollingStd(close, bbLength);

    const dev = std.map(v => v * bbMult);

    const upperBB = basis.map((b, i) => b + dev[i]);
    const lowerBB = basis.map((b, i) => b - dev[i]);

    // =========================
    // Keltner Channels
    // =========================
    const ma = rollingMean(close, kcLength);

    let rangeVal: number[] = [];

    if (useTrueRange) {
        const prevClose = shift(close, 1);

        const highLow = high.map((h, i) => h - low[i]);
        const highPrev = high.map((h, i) =>
            isNaN(prevClose[i]) ? 0 : Math.abs(h - prevClose[i])
        );
        const lowPrev = low.map((l, i) =>
            isNaN(prevClose[i]) ? 0 : Math.abs(l - prevClose[i])
        );

        rangeVal = maxArr(highLow, maxArr(highPrev, lowPrev));
    } else {
        rangeVal = high.map((h, i) => h - low[i]);
    }

    const rangeMA = rollingMean(rangeVal, kcLength);

    const upperKC = ma.map((m, i) => m + rangeMA[i] * kcMult);
    const lowerKC = ma.map((m, i) => m - rangeMA[i] * kcMult);

    // =========================
    // Squeeze Status
    // =========================
    const squeezeStatus = Array(n).fill(-1);

    for (let i = 0; i < n; i++) {
        const squeezeOn =
            lowerBB[i] > lowerKC[i] &&
            upperBB[i] < upperKC[i];

        const squeezeOff =
            lowerBB[i] < lowerKC[i] &&
            upperBB[i] > upperKC[i];

        if (squeezeOn) {
            squeezeStatus[i] = 1;  // compression
        } else if (squeezeOff) {
            squeezeStatus[i] = 0;  // expansion
        }
    }

    return {
        upper_bb: upperBB,
        lower_bb: lowerBB,
        upper_kc: upperKC,
        lower_kc: lowerKC,
        squeeze_status: squeezeStatus
    };
}
