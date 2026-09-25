export function shouldActivateTradeBreaker(
  currentEquityGrowthPct: number,
  autoTradeBreakerByEquityPct?: boolean,
  autoTradeBreakerEquityPctValue?: number
): boolean {
  if (!autoTradeBreakerByEquityPct || autoTradeBreakerEquityPctValue === undefined) {
    return false;
  }
  return currentEquityGrowthPct >= autoTradeBreakerEquityPctValue;
}
