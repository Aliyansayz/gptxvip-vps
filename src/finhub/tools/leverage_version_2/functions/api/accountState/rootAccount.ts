export const ROOT_ACCOUNT_ID = 'A1';

export function isRootAccount(accountId?: string): boolean {
  return !accountId || accountId === ROOT_ACCOUNT_ID;
}

export function getRootAccountTrades(trades: any[]): any[] {
  return trades.filter(t => isRootAccount(t.accountId));
}
