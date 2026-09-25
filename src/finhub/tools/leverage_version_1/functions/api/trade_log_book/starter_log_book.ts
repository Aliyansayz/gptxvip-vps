import { Trade } from '../../../../types/trading';

export function calculateLogBookStats(trades: Trade[]) {
  const closedTradesList = trades.filter(t => t.status === 'CLOSED');
  const totalPnL = closedTradesList.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const winCount = closedTradesList.filter(t => (t.pnl || 0) > 0).length;
  const lossCount = closedTradesList.filter(t => (t.pnl || 0) < 0).length;
  const winRate = closedTradesList.length > 0 ? (winCount / closedTradesList.length) * 100 : 0;

  return {
    totalPnL,
    winRate,
    closedTrades: closedTradesList.length,
    winCount,
    lossCount
  };
}
