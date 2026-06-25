import { Trade } from '../../../../types/trading';

/**
 * Checks if the current eligible serial/root account has an active open trade.
 * In Serial Account Mode, each serial account can only have one open main trade.
 */
export function hasOpenTradeSerialAccount(activeTrades: Trade[], eligibleAccountId: string): boolean {
  return activeTrades.some(
    (t) =>
      t.status === 'OPEN' &&
      (t.accountId === eligibleAccountId || (!t.accountId && eligibleAccountId === 'A1')) &&
      (t.tradeType === 'main trade' || !t.tradeType)
  );
}
