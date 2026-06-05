import { AccountInfoState } from './collectAllAccountInfo';
import { calculateLogBookStats } from '../trade_log_book/starter_log_book';
import { Trade } from '../../../../types/trading';

export interface LogBookForwardedInfo {
  stats: ReturnType<typeof calculateLogBookStats>;
  accountState: AccountInfoState;
}

export function forwardInfoToLogBook(
  trades: Trade[],
  accountState: AccountInfoState
): LogBookForwardedInfo {
  const stats = calculateLogBookStats(trades);
  return {
    stats,
    accountState
  };
}
