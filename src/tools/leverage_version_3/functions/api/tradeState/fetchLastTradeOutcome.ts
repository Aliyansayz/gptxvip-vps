import { Trade } from '../../../../types/trading';

export interface TradeOutcome {
  trade_id: string;
  exitPrice?: number;
  exitTime?: number;
  exitIndex?: number;
  pnl?: number;
  pips?: number;
  exitReason?: string;
  status: string;
  isWin: boolean;
}

/**
 * Fetches the outcome of a closed trade matching a specific trade_id from the simulation's trades list.
 */
export function fetchLastTradeOutcome(trades: Trade[], tradeId: string): TradeOutcome | null {
  if (!trades || trades.length === 0 || !tradeId) {
    return null;
  }

  const trade = trades.find(t => t.id === tradeId && t.status === 'CLOSED') || trades.find(t => t.id === tradeId);
  if (!trade || trade.status !== 'CLOSED') {
    return null;
  }

  return {
    trade_id: trade.id,
    exitPrice: trade.exitPrice,
    exitTime: trade.exitTime,
    exitIndex: trade.exitIndex,
    pnl: trade.pnl,
    pips: trade.pips,
    exitReason: trade.exitReason,
    status: trade.status,
    isWin: (trade.pnl !== undefined && trade.pnl > 0) || (trade.pips !== undefined && trade.pips > 0)
  };
}
