// ============================================================
// TYPES
// ============================================================

type RegimeResult = {
    signal: Int8Array;

    vol_regime: Int8Array;
    volatility: number[];

    zscore: number[];
    reversion: Int8Array;

    supertrend: number[];
    trend_direction: Int8Array;

    atr: number[];
    atr_regime: Int8Array;
    multiplier: number[];
};


// ============================================================
// Rolling Mean
// ============================================================

function rollingMean(
    arr: number[],
    period: number
): number[] {

    const n = arr.length;
    const out = new Array(n).fill(NaN);

    let sum = 0;

    for (let i = 0; i < n; i++) {

        sum += arr[i];

        if (i >= period)
            sum -= arr[i - period];

        if (i >= period - 1)
            out[i] = sum / period;
    }

    return out;
}


// ============================================================
// Rolling Std
// ============================================================

function rollingStd(
    arr: number[],
    period: number
): number[] {

    const mean = rollingMean(arr, period);
    const n = arr.length;
    const out = new Array(n).fill(NaN);

    for (let i = period - 1; i < n; i++) {

        let sumSq = 0;

        for (
            let j = i - period + 1;
            j <= i;
            j++
        ) {
            const d = arr[j] - mean[i];
            sumSq += d * d;
        }

        out[i] = Math.sqrt(
            sumSq / period
        );
    }

    return out;
}


// ============================================================
// Rolling Median
// ============================================================

function rollingMedian(
    arr: number[],
    period: number
): number[] {

    const n = arr.length;
    const out = new Array(n).fill(NaN);

    for (
        let i = period - 1;
        i < n;
        i++
    ) {

        const slice = arr
            .slice(i - period + 1, i + 1)
            .filter(v => !isNaN(v))
            .sort((a, b) => a - b);

        if (!slice.length)
            continue;

        const mid =
            Math.floor(slice.length / 2);

        out[i] =
            slice.length % 2
                ? slice[mid]
                : (
                    slice[mid - 1] +
                    slice[mid]
                  ) / 2;
    }

    return out;
}


// ============================================================
// ATR
// ============================================================

function rollingATR(
    high: number[],
    low: number[],
    close: number[],
    period = 14
): number[] {

    const n = close.length;
    const tr = new Array(n);

    for (let i = 0; i < n; i++) {

        const prev =
            i === 0
                ? close[0]
                : close[i - 1];

        const tr1 = high[i] - low[i];
        const tr2 = Math.abs(
            high[i] - prev
        );
        const tr3 = Math.abs(
            low[i] - prev
        );

        tr[i] = Math.max(
            tr1,
            tr2,
            tr3
        );
    }

    return rollingMean(
        tr,
        period
    );
}


// ============================================================
// ATR Regime
// 0 LOW
// 1 MID
// 2 HIGH
// ============================================================

function atrRegimeLevel(
    atr: number[],
    period = 30
): Int8Array {

    const med =
        rollingMedian(
            atr,
            period
        );

    const n = atr.length;
    const regime =
        new Int8Array(n);

    regime.fill(1);

    for (let i = 0; i < n; i++) {

        if (
            isNaN(atr[i]) ||
            isNaN(med[i])
        )
            continue;

        if (atr[i] < med[i] * 0.7)
            regime[i] = 0;
        else if (
            atr[i] > med[i] * 1.3
        )
            regime[i] = 2;
    }

    return regime;
}


// ============================================================
// Volatility Regime
// 0 LOW
// 1 HIGH
// ============================================================

function volatilityRegimeLevel(
    close: number[],
    period = 30
): {
    regime: Int8Array;
    vol: number[];
} {

    const n = close.length;
    const returns =
        new Array(n);

    returns[0] = 0;

    for (
        let i = 1;
        i < n;
        i++
    ) {
        returns[i] =
            close[i] -
            close[i - 1];
    }

    const vol =
        rollingStd(
            returns,
            period
        );

    const med =
        rollingMedian(
            vol,
            period
        );

    const regime =
        new Int8Array(n);

    for (
        let i = 0;
        i < n;
        i++
    ) {

        if (
            !isNaN(vol[i]) &&
            !isNaN(med[i]) &&
            vol[i] > med[i]
        )
            regime[i] = 1;
    }

    return {
        regime,
        vol
    };
}


// ============================================================
// ZScore Mean Reversion
// ============================================================

function zscoreSignal(
    close: number[],
    period = 20,
    upper = 1.5,
    lower = -1.5
): {
    reversion: Int8Array;
    z: number[];
} {

    const mean =
        rollingMean(
            close,
            period
        );

    const std =
        rollingStd(
            close,
            period
        );

    const n = close.length;

    const z =
        new Array(n).fill(NaN);

    const rev =
        new Int8Array(n);

    for (
        let i = 0;
        i < n;
        i++
    ) {

        if (
            isNaN(mean[i]) ||
            isNaN(std[i])
        )
            continue;

        const s =
            std[i] === 0
                ? 1e-10
                : std[i];

        z[i] =
            (close[i] - mean[i]) / s;

        if (i === 0)
            continue;

        const prev =
            z[i - 1];

        if (
            z[i] < lower &&
            z[i] > prev
        )
            rev[i] = 1;

        if (
            z[i] > upper &&
            z[i] < prev
        )
            rev[i] = -1;
    }

    return {
        reversion: rev,
        z
    };
}


// ============================================================
// Adaptive SuperTrend
// ============================================================

function supertrendAdaptive(
    high: number[],
    low: number[],
    close: number[],
    period = 10,
    atrMultiplier = 3
) {

    const n = close.length;

    const atr =
        rollingATR(
            high,
            low,
            close,
            period
        );

    const atrRegime =
        atrRegimeLevel(atr);

    const multiplier =
        new Array(n)
            .fill(atrMultiplier);

    for (
        let i = 0;
        i < n;
        i++
    ) {

        if (atrRegime[i] === 0)
            multiplier[i] =
                atrMultiplier * 0.7;
        else if (
            atrRegime[i] === 2
        )
            multiplier[i] =
                atrMultiplier * 1.35;
    }

    const upper =
        new Array(n);
    const lowerBand =
        new Array(n);

    for (
        let i = 0;
        i < n;
        i++
    ) {

        const hl2 =
            (high[i] + low[i]) / 2;

        upper[i] =
            hl2 +
            multiplier[i] * atr[i];

        lowerBand[i] =
            hl2 -
            multiplier[i] * atr[i];
    }

    const st =
        new Array(n).fill(NaN);

    const trend =
        new Int8Array(n);

    trend[0] = 1;
    st[0] =
        (high[0] + low[0]) / 2;

    for (
        let i = 1;
        i < n;
        i++
    ) {

        if (
            trend[i - 1] === 1
        ) {

            if (
                close[i] <
                lowerBand[i]
            ) {

                trend[i] = -1;
                st[i] = upper[i];

            } else {

                trend[i] = 1;
                st[i] = Math.max(
                    lowerBand[i],
                    st[i - 1]
                );
            }

        } else {

            if (
                close[i] >
                upper[i]
            ) {

                trend[i] = 1;
                st[i] =
                    lowerBand[i];

            } else {

                trend[i] = -1;
                st[i] = Math.min(
                    upper[i],
                    st[i - 1]
                );
            }
        }
    }

    return {
        trend,
        st,
        atr,
        atrRegime,
        multiplier
    };
}


// ============================================================
// Hybrid System
// ============================================================

export function supertrendRegimeSystem(
    high: number[],
    low: number[],
    close: number[],

    stPeriod = 10,
    atrMultiplier = 3,
    regimePeriod = 30,
    zPeriod = 20,
    zUpper = 1.5,
    zLower = -1.5
): RegimeResult {

    const n = close.length;

    const {
        regime: volRegime,
        vol
    } =
        volatilityRegimeLevel(
            close,
            regimePeriod
        );

    const {
        reversion,
        z
    } =
        zscoreSignal(
            close,
            zPeriod,
            zUpper,
            zLower
        );

    const {
        trend,
        st,
        atr,
        atrRegime,
        multiplier
    } =
        supertrendAdaptive(
            high,
            low,
            close,
            stPeriod,
            atrMultiplier
        );

    const signal =
        new Int8Array(n);

    for (
        let i = 0;
        i < n;
        i++
    ) {

        if (
            volRegime[i] === 0
        )
            signal[i] =
                reversion[i];
        else
            signal[i] =
                trend[i];
    }

    return {

        signal,

        vol_regime:
            volRegime,

        volatility:
            vol,

        zscore:
            z,

        reversion,

        supertrend:
            st,

        trend_direction:
            trend,

        atr,

        atr_regime:
            atrRegime,

        multiplier
    };
}
