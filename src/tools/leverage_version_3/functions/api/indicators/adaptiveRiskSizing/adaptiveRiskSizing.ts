export function nanPercentile(arr: number[], percentile: number): number {
    const clean = arr.filter(v => !Number.isNaN(v)).sort((a, b) => a - b);

    if (clean.length === 0) return NaN;

    const idx = (percentile / 100) * (clean.length - 1);

    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);

    if (lo === hi) return clean[lo];

    const w = idx - lo;

    return clean[lo] * (1 - w) + clean[hi] * w;
}

export function positionSizeFromTrend(
    trendStrength: number[],
    minSize: number = 0.5,
    maxSize: number = 2.0
): number[] {

    const absTs = trendStrength.map(v => Math.abs(v));

    const minTrend = nanPercentile(absTs, 5);
    const maxTrend = nanPercentile(absTs, 95);

    const range = Math.max(maxTrend - minTrend, 1e-10);

    return absTs.map(ts => {

        const normalized =
            Math.max(0,
                Math.min(
                    1,
                    (ts - minTrend) / range
                )
            );

        return minSize + normalized * (maxSize - minSize);
    });
}


export function positionSizeVolAdjusted(
    trendStrength: number[],
    volatility: number[],
    minSize: number = 0.5,
    maxSize: number = 2.0
): number[] {

    const raw: number[] = [];

    for (let i = 0; i < trendStrength.length; i++) {

        const ts = Math.abs(trendStrength[i]);
        const vol = volatility[i] === 0 ? 1e-10 : volatility[i];

        raw.push(ts / vol);
    }

    const minRaw = nanPercentile(raw, 5);
    const maxRaw = nanPercentile(raw, 95);

    const range = Math.max(maxRaw - minRaw, 1e-10);

    return raw.map(v => {

        const normalized =
            Math.max(
                0,
                Math.min(
                    1,
                    (v - minRaw) / range
                )
            );

        return minSize + normalized * (maxSize - minSize);
    });
}
