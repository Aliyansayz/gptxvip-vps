export function getCandlePatternsMultiple(
    o: number[],
    h: number[],
    l: number[],
    c: number[]
): {
    action_signal: (string | null)[];
    patterns: string[];
} {

    const n = o.length;

    const roll = (arr: number[], shift: number): number[] => {
        const out = new Array(n);
        for (let i = 0; i < n; i++) {
            let idx = (i - shift + n) % n;
            out[i] = arr[idx];
        }
        return out;
    };

    // ------------------------------
    // Previous candles
    // ------------------------------
    const o1 = roll(o, 1);
    const c1 = roll(c, 1);
    const o2 = roll(o, 2);
    const c2 = roll(c, 2);
    const o3 = roll(o, 3);
    const c3 = roll(c, 3);

    // ------------------------------
    // Candle metrics
    // ------------------------------
    const body_size = new Array(n);
    const candle_range = new Array(n);
    const min_oc = new Array(n);
    const max_oc = new Array(n);
    const upper_shadow = new Array(n);
    const lower_shadow = new Array(n);
    const is_doji = new Array<boolean>(n);

    for (let i = 0; i < n; i++) {
        body_size[i] = Math.abs(c[i] - o[i]);

        candle_range[i] = h[i] - l[i];
        if (candle_range[i] === 0) candle_range[i] = 1e-6;

        min_oc[i] = Math.min(o[i], c[i]);
        max_oc[i] = Math.max(o[i], c[i]);

        upper_shadow[i] = h[i] - max_oc[i];
        lower_shadow[i] = min_oc[i] - l[i];

        is_doji[i] = body_size[i] <= candle_range[i] * 0.05;
    }

    // ------------------------------
    // Doji context
    // ------------------------------
    const doji_bullish_reversal = new Array<boolean>(n);
    const doji_bearish_reversal = new Array<boolean>(n);
    const doji_neutral = new Array<boolean>(n);

    for (let i = 0; i < n; i++) {

        const prev_bullish_count =
            (c1[i] > o1[i] ? 1 : 0) +
            (c2[i] > o2[i] ? 1 : 0) +
            (c3[i] > o3[i] ? 1 : 0);

        const prev_bearish_count = 3 - prev_bullish_count;

        doji_bullish_reversal[i] =
            is_doji[i] && prev_bearish_count >= 2;

        doji_bearish_reversal[i] =
            is_doji[i] && prev_bullish_count >= 2;

        doji_neutral[i] =
            is_doji[i] &&
            !doji_bullish_reversal[i] &&
            !doji_bearish_reversal[i];
    }

    // =====================================================
    // Heikin Ashi
    // =====================================================
    const ha_close = new Array(n);
    const ha_open = new Array(n);
    const ha_body = new Array(n);
    const ha_bull = new Array<boolean>(n);
    const ha_bear = new Array<boolean>(n);
    const ha_upper_wick = new Array(n);
    const ha_lower_wick = new Array(n);

    for (let i = 0; i < n; i++) {
        ha_close[i] = (o[i] + h[i] + l[i] + c[i]) / 4;
    }

    ha_open[0] = (o[0] + c[0]) / 2;

    for (let i = 1; i < n; i++) {
        ha_open[i] =
            (ha_open[i - 1] + ha_close[i - 1]) / 2;
    }

    for (let i = 0; i < n; i++) {

        ha_body[i] = Math.abs(
            ha_close[i] - ha_open[i]
        );

        ha_bull[i] = ha_close[i] > ha_open[i];
        ha_bear[i] = ha_close[i] < ha_open[i];

        ha_upper_wick[i] =
            h[i] - Math.max(ha_open[i], ha_close[i]);

        ha_lower_wick[i] =
            Math.min(ha_open[i], ha_close[i]) - l[i];
    }

    // =====================================================
    // Pattern Conditions
    // =====================================================
    const condlist: boolean[][] = [];

    // Classic
    condlist.push(
        o.map((_, i) =>
            c[i] > o[i] &&
            body_size[i] >= candle_range[i] * 0.95
        )
    );

    condlist.push(
        o.map((_, i) =>
            c[i] < o[i] &&
            body_size[i] >= candle_range[i] * 0.95
        )
    );

    condlist.push(
        o.map((_, i) =>
            lower_shadow[i] >= 2 * body_size[i] &&
            upper_shadow[i] <= body_size[i] * 0.8
        )
    );

    condlist.push(
        o.map((_, i) =>
            upper_shadow[i] >= 2 * body_size[i] &&
            lower_shadow[i] <= body_size[i] * 0.8
        )
    );

    condlist.push(
        o.map((_, i) =>
            c[i] > o[i] &&
            c1[i] < o1[i] &&
            c[i] >= o1[i] &&
            o[i] <= c1[i]
        )
    );

    condlist.push(
        o.map((_, i) =>
            c[i] < o[i] &&
            c1[i] > o1[i] &&
            c[i] <= o1[i] &&
            o[i] >= c1[i]
        )
    );

    condlist.push(
        o.map((_, i) =>
            c1[i] < o1[i] &&
            c[i] > o[i] &&
            o[i] > c1[i] &&
            c[i] < o1[i]
        )
    );

    condlist.push(
        o.map((_, i) =>
            c1[i] > o1[i] &&
            c[i] < o[i] &&
            o[i] < c1[i] &&
            c[i] > o1[i]
        )
    );

    condlist.push(
        o.map((_, i) =>
            c1[i] < o1[i] &&
            c[i] > o[i] &&
            o[i] < c1[i] &&
            c[i] > (o1[i] + c1[i]) / 2
        )
    );

    condlist.push(
        o.map((_, i) =>
            c1[i] > o1[i] &&
            c[i] < o[i] &&
            o[i] > c1[i] &&
            c[i] < (o1[i] + c1[i]) / 2
        )
    );

    // Heikin Ashi
    condlist.push(
        o.map((_, i) =>
            ha_bull[i] &&
            ha_lower_wick[i] <= ha_body[i] * 0.05
        )
    );

    condlist.push(
        o.map((_, i) =>
            ha_bear[i] &&
            ha_upper_wick[i] <= ha_body[i] * 0.05
        )
    );

    condlist.push(
        o.map((_, i) =>
            (
                ha_bull[i] &&
                i > 0 &&
                ha_bull[i - 1] &&
                ha_body[i] > ha_body[i - 1]
            ) ||
            (
                ha_bear[i] &&
                i > 0 &&
                ha_bear[i - 1] &&
                ha_body[i] > ha_body[i - 1]
            )
        )
    );

    condlist.push(
        o.map((_, i) =>
            ha_body[i] <= candle_range[i] * 0.15 &&
            ha_upper_wick[i] > ha_body[i] &&
            ha_lower_wick[i] > ha_body[i]
        )
    );

    // Doji
    condlist.push(doji_bullish_reversal);
    condlist.push(doji_bearish_reversal);
    condlist.push(doji_neutral);

    // =====================================================
    // Pattern Names
    // =====================================================
    const choicelist = [

        "bullish_marubozu",
        "bearish_marubozu",
        "bullish_hammer",
        "bullish_inverted_hammer",
        "bullish_engulfing",
        "bearish_engulfing",
        "bullish_harami",
        "bearish_harami",
        "bullish_piercing",
        "bearish_dark_cloud",

        "ha_strong_bullish",
        "ha_strong_bearish",
        "ha_momentum_run",
        "ha_exhaustion",

        "doji_bullish_reversal",
        "doji_bearish_reversal",
        "doji_neutral"
    ];

    // ------------------------------
    // Default fallback
    // ------------------------------
    const defaults = o.map((_, i) =>
        c[i] > o[i]
            ? "high"
            : c[i] < o[i]
            ? "low"
            : "neutral"
    );

    // =====================================================
    // Multi Pattern Matching
    // =====================================================
    const patterns = new Array<string>(n);

    for (let i = 0; i < n; i++) {

        const matched: string[] = [];

        for (let j = 0; j < condlist.length; j++) {
            if (condlist[j][i]) {
                matched.push(choicelist[j]);
            }
        }

        patterns[i] =
            matched.length > 0
                ? matched.join("|")
                : defaults[i];
    }

    // History handling
    for (let i = 0; i < Math.min(3, n); i++) {
        patterns[i] = defaults[i];
    }

    // =====================================================
    // Action Signal
    // =====================================================
    const action_signal =
        new Array<string | null>(n);

    for (let i = 0; i < n; i++) {

        if (patterns[i].includes("bullish")) {
            action_signal[i] = "bullish_action";
        }
        else if (patterns[i].includes("bearish")) {
            action_signal[i] = "bearish_action";
        }
        else {
            action_signal[i] = null;
        }
    }

    for (let i = 0; i < Math.min(3, n); i++) {
        action_signal[i] = null;
    }

    return {
        action_signal,
        patterns
    };
}
