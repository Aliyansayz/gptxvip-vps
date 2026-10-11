import { Trade } from '../../../../types/trading';
import { calculateTradeMetrics, TradeMetrics } from './metricsCalculator';

/**
 * Fetches all closed trades and returns them in chronological order of their exit times.
 */
export function getClosedTradesInSequentialOrder(trades: Trade[]): Trade[] {
  return [...trades]
    .filter(t => t.status === 'CLOSED')
    .sort((a, b) => (a.exitTime || 0) - (b.exitTime || 0));
}

/**
 * Determines whether metrics calculation should be triggered based on explicit click state
 * or when the number of closed trades is a modulus of 3 and has changed.
 */
export function shouldTriggerRecalculation(
  closedTradesCount: number,
  isButtonClicked: boolean,
  lastCalculatedCount: number
): boolean {
  if (isButtonClicked) return true;
  // Trigger automatically when total closed trades is a multiple of 3 and has changed
  if (closedTradesCount > 0 && closedTradesCount !== lastCalculatedCount && closedTradesCount % 3 === 0) {
    return true;
  }
  return false;
}

/**
 * Orchestrates fetching of closed trades and conditionally computes metrics if triggered.
 */
export function triggerMetricsCalculation(
  trades: Trade[],
  isButtonClicked: boolean,
  lastCalculatedCount: number,
  initialBalance?: number
): { metrics: TradeMetrics | null; triggered: boolean; count: number } {
  const closedTrades = getClosedTradesInSequentialOrder(trades);
  const count = closedTrades.length;
  
  const triggered = shouldTriggerRecalculation(count, isButtonClicked, lastCalculatedCount);
  if (triggered) {
    const metrics = calculateTradeMetrics(closedTrades, initialBalance);
    return { metrics, triggered: true, count };
  }
  
  return { metrics: null, triggered: false, count };
}
