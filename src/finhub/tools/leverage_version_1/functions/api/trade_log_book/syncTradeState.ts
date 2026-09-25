import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { fetchActiveTradeState, TradeStateSummary } from '../tradeState/fetchMainTradeState';

/**
 * syncTradeState acts as a coordination layer to synchronize the floating trade states.
 * It leverages the specialized fetchActiveTradeState logic to retrieve robust,
 * worst-case monitoring data across the multiple timeframe intervals (alpha, beta, delta).
 * 
 * This is used to provide real-time equity and PnL updates to the Trade Log Book
 * based on the most granular (smallest) time interval data available.
 */
export function syncTradeState(
  trades: Trade[],
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  leverageSettings?: LeverageConfig,
  latencyDelaySeconds?: number
): TradeStateSummary {
  // Fetch the latest state, prioritizing the worst-case floating PnL/Pips for secure tracking
  return fetchActiveTradeState(
    trades,
    alphaData,
    betaData,
    deltaData,
    simulationIndex,
    leverageSettings,
    latencyDelaySeconds
  );
}
