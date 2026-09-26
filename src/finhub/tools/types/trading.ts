export type PositionSide = 'LONG' | 'SHORT';
export type TradeStatus = 'OPEN' | 'CLOSED';
export type ExitReason = 'MANUAL' | 'STOP_LOSS' | 'TAKE_PROFIT' | 'SIGNAL_REVERSAL' | 'CANDLE_LIMIT' | 'TIME_LIMIT' | 'MARGIN_CALL' | 'REJECTED';
export type ExecutionType = 'MARKET_EXECUTION';
export type TradeType = 'main trade' | 'recurrent trade' | 'hft hedge trade';

export interface Trade {
  id: string;
  accountId?: string;
  tradeType?: TradeType;
  side: PositionSide;
  entryPrice: number;
  entryTime: number;
  entryIndex: number;
  size: number;
  stopLoss?: number;
  takeProfit?: number;
  initialStopLoss?: number;
  initialTakeProfit?: number;
  entrySystem?: string;
  systemMode?: string;
  exitPrice?: number;
  exitTime?: number;
  exitIndex?: number;
  pnl?: number;
  pips?: number;
  status: TradeStatus;
  exitReason?: ExitReason;
  executionType: ExecutionType;
  balanceAfter?: number;
  latencyDelaySeconds?: number;
  infoStatus?: string;
  trailCount?: number;
  lastTrailIndex?: number;
  hasPartialExited?: boolean;
}
