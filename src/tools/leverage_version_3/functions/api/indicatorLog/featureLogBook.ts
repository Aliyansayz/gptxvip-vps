import { Trade } from '../../../../types/trading';
import { IndicatorRow } from '../indicatorState/fetchIndicatorAlpha';
import { extractNormalizedMetrics } from './normalizeIndicatorIntoDataSource';
import { TradeOutcome } from '../tradeState/fetchLastTradeOutcome';

export interface FeatureLogEntry {
  trade_id: string;
  type_of_trade: 'main_trade';
  asset: string;
  trade_action: 'long' | 'short';
  timestamp: number;
  preset_name?: string;
  exit_price?: number;
  exit_time?: number;
  pnl?: number;
  pips?: number;
  realized_pips?: number;
  exit_reason?: string;
  outcome?: 'WIN' | 'LOSS' | 'NEUTRAL';
  [indicatorKey: string]: string | number | undefined;
}

/**
 * Creates a normalized Feature Log Book entry for a closed main trade incorporating trade outcomes.
 */
export function createFeatureLogEntry(
  trade: Trade,
  asset: string,
  alphaRows: IndicatorRow[],
  betaRows: IndicatorRow[],
  deltaRows: IndicatorRow[],
  presetName?: string,
  outcome?: TradeOutcome | null
): FeatureLogEntry {
  const alphaMetrics = extractNormalizedMetrics(alphaRows, 'alpha');
  const betaMetrics = extractNormalizedMetrics(betaRows, 'beta');
  const deltaMetrics = extractNormalizedMetrics(deltaRows, 'delta');

  const resolvedOutcome = outcome || {
    exitPrice: trade.exitPrice,
    exitTime: trade.exitTime,
    pnl: trade.pnl,
    pips: trade.pips,
    exitReason: trade.exitReason,
    isWin: (trade.pnl !== undefined && trade.pnl > 0) || (trade.pips !== undefined && trade.pips > 0)
  };

  const rawPips = resolvedOutcome.pips !== undefined ? resolvedOutcome.pips : 0;
  let realizedPips = rawPips;

  if (resolvedOutcome.pnl !== undefined && resolvedOutcome.pnl < 0) {
    realizedPips = -Math.abs(rawPips);
  } else if (resolvedOutcome.pnl !== undefined && resolvedOutcome.pnl > 0) {
    realizedPips = Math.abs(rawPips);
  } else if (resolvedOutcome.pips !== undefined && resolvedOutcome.pips < 0) {
    realizedPips = -Math.abs(rawPips);
  }

  return {
    trade_id: trade.id,
    type_of_trade: 'main_trade',
    asset: asset,
    trade_action: trade.side.toLowerCase() as 'long' | 'short',
    timestamp: trade.entryTime,
    ...(presetName ? { preset_name: presetName } : {}),
    exit_price: resolvedOutcome.exitPrice,
    exit_time: resolvedOutcome.exitTime,
    pnl: resolvedOutcome.pnl,
    pips: resolvedOutcome.pips,
    realized_pips: Number(realizedPips.toFixed(2)),
    exit_reason: resolvedOutcome.exitReason,
    outcome: resolvedOutcome.isWin ? 'WIN' : (resolvedOutcome.pnl !== undefined && resolvedOutcome.pnl < 0 ? 'LOSS' : 'NEUTRAL'),
    ...alphaMetrics,
    ...betaMetrics,
    ...deltaMetrics
  };
}
