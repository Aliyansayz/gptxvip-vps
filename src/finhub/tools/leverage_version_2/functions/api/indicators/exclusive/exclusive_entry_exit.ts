export function checkLinearRegressionAdxEntryConditions(
    indicatorData: any,
    symbol: string
): { status: string | null | boolean, reason: string | null } {

    const indicators = indicatorData[symbol]?.secondary || {};

    const lrTrend = indicators.lr_trend_secondary;
    const lrVolatility = indicators.lr_volatality_s;
    const lrReversion = indicators.lr_reversion_s;

    const volValue = lrVolatility?.length ? lrVolatility.at(-1) : -1;
    const revValue = lrReversion?.length ? lrReversion.at(-1) : 0;
    const trendValue = lrTrend?.length ? lrTrend.at(-1) : 0;

    const directionValue = volValue === 0 ? revValue : trendValue;
    const directionLabel = volValue === 0 ? "reversion" : "trend";

    const prevValue =
        directionLabel === "reversion"
            ? lrReversion?.at(-2) ?? 0
            : lrTrend?.at(-2) ?? 0;

    let status: string | boolean | null = null;
    let reason: string | null = null;

    if (directionValue === 1 && (prevValue === -1 || prevValue === 0)) {
        reason = `linear regression ${directionLabel} bullish`;
        status = "long";
    }

    if (directionValue === -1 && (prevValue === 1 || prevValue === 0)) {
        reason = `linear regression ${directionLabel} bearish`;
        status = "short";
    }

    return { status, reason };
}
