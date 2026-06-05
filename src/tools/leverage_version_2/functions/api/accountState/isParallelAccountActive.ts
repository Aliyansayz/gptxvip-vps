import { ParallelAccount } from '../../../stores/indicators_store';

export function isParallelAccountActive(account: ParallelAccount): boolean {
  return account.simultaneousTradeState;
}

export function getActiveParallelAccounts(parallelAccounts: ParallelAccount[]): ParallelAccount[] {
  if (!parallelAccounts) return [];
  return parallelAccounts.filter(isParallelAccountActive);
}

export function countActiveAccounts(parallelAccounts: ParallelAccount[]): number {
  return 1 + getActiveParallelAccounts(parallelAccounts).length; // +1 for the root account
}
