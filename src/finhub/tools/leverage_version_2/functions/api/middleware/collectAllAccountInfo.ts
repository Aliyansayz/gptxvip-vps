import { Trade } from '../../../../types/trading';
import { ParallelAccount } from '../../../stores/indicators_store';
import { countActiveAccounts } from '../accountState/isParallelAccountActive';
import { evaluateAccountFloatingValue } from '../accountState/evaluateAccountFloatingValue';

export interface AccountInfoState {
  activeAccountsCount: number;
  openTrades: Trade[];
  historyTrades: Trade[];
  floatingPnL: number;
  totalPnL: number;
  initialCombinedBalance: number;
  combinedBalance: number;
  combinedEquity: number;
}

export function collectAllAccountInfo(
  trades: Trade[],
  parallelAccounts: ParallelAccount[],
  baseBalance: number,
  currentPrice: number | undefined,
  leverageEnabled: boolean,
  serialTradingEnabled: boolean = false
): AccountInfoState {
  let activeAccountsCount = countActiveAccounts(parallelAccounts); // includes A1
  
  if (serialTradingEnabled) {
    activeAccountsCount += 10; // 10 Serial accounts S1-S10
  }

  const initialCombinedBalance = baseBalance * activeAccountsCount;
  
  const openTrades = trades.filter(t => t.status === 'OPEN');
  const historyTrades = trades.filter(t => t.status === 'CLOSED');

  const totalPnL = historyTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  let floatingPnL = 0;
  if (currentPrice !== undefined) {
    floatingPnL = evaluateAccountFloatingValue(trades, currentPrice, leverageEnabled);
  }

  const combinedBalance = initialCombinedBalance + totalPnL;
  const combinedEquity = combinedBalance + floatingPnL;

  return {
    activeAccountsCount,
    openTrades,
    historyTrades,
    floatingPnL,
    totalPnL,
    initialCombinedBalance,
    combinedBalance,
    combinedEquity
  };
}
