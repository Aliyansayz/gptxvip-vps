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

/**
 * Fetch total closed trade counts from the history book (closed trades)
 */
export function getHistoryBookTradeCount(trades: { status: string }[]): number {
  if (!trades) return 0;
  return trades.filter(t => t.status === 'CLOSED').length;
}

/**
 * Responsible for checking if the count-based trade breaker should be activated.
 * Returns true if the condition is active/checked and the closed trade count is
 * equal or more than the threshold.
 */
export function checkCountBasedTradeBreaker(
  trades: { status: string }[],
  autoTradeBreakerByCount?: boolean,
  autoTradeBreakerCountValue?: number
): boolean {
  if (!autoTradeBreakerByCount || autoTradeBreakerCountValue === undefined) {
    return false;
  }
  const count = getHistoryBookTradeCount(trades);
  return count >= autoTradeBreakerCountValue;
}

