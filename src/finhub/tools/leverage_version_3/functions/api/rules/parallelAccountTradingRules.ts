import { Trade } from '../../../../types/trading';

/**
 * Checks if parallel account mode has an open master trade.
 * Since parallel trades are synchronized and spawned based on A1 (the master account),
 * we check if the master account (A1) already has an open main trade.
 */
export function hasOpenTradeParallelAccount(activeTrades: Trade[]): boolean {
  return activeTrades.some(
    (t) =>
      t.status === 'OPEN' &&
      (!t.accountId || t.accountId === 'A1') &&
      (t.tradeType === 'main trade' || !t.tradeType)
  );
}
