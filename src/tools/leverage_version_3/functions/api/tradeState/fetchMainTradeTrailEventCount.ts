import { Trade } from '../../../../types/trading';

/**
 * Fetches the trail event count of the currently active main trade.
 * Relies on the updated trail stop-loss state modified via updateTrailSL.
 */
export function fetchMainTradeTrailEventCount(trades: Trade[]): number {
  const activeMainTrade = trades.find(
    (t) => t.status === 'OPEN' && t.tradeType !== 'recurrent trade'
  );
  return activeMainTrade ? (activeMainTrade.trailCount || 0) : 0;
}
