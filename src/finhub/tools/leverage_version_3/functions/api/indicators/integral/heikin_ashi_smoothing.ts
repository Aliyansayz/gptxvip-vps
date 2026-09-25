function ema(values: number[], period: number): number[] {
    const result: number[] = [];
    const alpha = 2 / (period + 1);

    result[0] = values[0];

    for (let i = 1; i < values.length; i++) {
        result[i] =
            alpha * values[i] +
            (1 - alpha) * result[i - 1];
    }

    return result;
}

export interface SmoothedHAResult {
    haOpen: number[];
    haHigh: number[];
    haLow: number[];
    haClose: number[];
    direction: number[];
}

export function smoothedHeikinAshi(
    open: number[],
    high: number[],
    low: number[],
    close: number[],
    smoothLen: number = 1
): SmoothedHAResult {

    const n = close.length;

    if (
        open.length !== n ||
        high.length !== n ||
        low.length !== n
    ) {
        throw new Error(
            "Input arrays must have same length"
        );
    }

    // =========================
    // 1. Standard Heikin Ashi
    // =========================
    const haCloseRaw: number[] = new Array(n);
    const haOpenRaw: number[] = new Array(n);
    const haHighRaw: number[] = new Array(n);
    const haLowRaw: number[] = new Array(n);

    // HA Close
    for (let i = 0; i < n; i++) {
        haCloseRaw[i] =
            (open[i] + high[i] + low[i] + close[i]) / 4;
    }

    // Initial HA Open
    haOpenRaw[0] =
        (open[0] + close[0]) / 2;

    // Recursive HA Open
    for (let i = 1; i < n; i++) {
        haOpenRaw[i] =
            (haOpenRaw[i - 1] +
                haCloseRaw[i - 1]) / 2;
    }

    // HA High / Low
    for (let i = 0; i < n; i++) {
        haHighRaw[i] = Math.max(
            high[i],
            haOpenRaw[i],
            haCloseRaw[i]
        );

        haLowRaw[i] = Math.min(
            low[i],
            haOpenRaw[i],
            haCloseRaw[i]
        );
    }

    // =========================
    // 2. Smoothed HA (EMA)
    // =========================
    const haOpen = ema(
        haOpenRaw,
        smoothLen
    );

    const haClose = ema(
        haCloseRaw,
        smoothLen
    );

    const haHigh = ema(
        haHighRaw,
        smoothLen
    );

    const haLow = ema(
        haLowRaw,
        smoothLen
    );

    // =========================
    // 3. Direction
    // =========================
    const direction: number[] =
        new Array(n);

    for (let i = 0; i < n; i++) {
        const diff =
            haClose[i] - haOpen[i];

        direction[i] =
            diff > 0
                ? 1
                : diff < 0
                ? -1
                : 0;
    }

    return {
        haOpen,
        haHigh,
        haLow,
        haClose,
        direction,
    };
}
