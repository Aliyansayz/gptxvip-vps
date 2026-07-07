import { Trade } from '../../../../types/trading';

/**
 * Checks if there is any active open trade on the Single Account (A1 or no accountId).
 * In Single Account Mode, only one main trade can be open at a time.
 */
export function hasOpenTradeSingleAccount(activeTrades: Trade[]): boolean {
  return activeTrades.some(
    (t) =>
      t.status === 'OPEN' &&
      (!t.accountId || t.accountId === 'A1') &&
      (t.tradeType === 'main trade' || !t.tradeType)
  );
}
