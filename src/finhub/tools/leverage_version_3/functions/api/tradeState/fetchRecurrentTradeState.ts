import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { LeverageConfig } from '../position_sizing/leveragedPositionSizeMetals';
import { fetchActiveTradeState, ActiveTradeState } from './fetchMainTradeState';

export function fetchRecurrentTradeState(
  trades: Trade[],
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  leverageSettings?: LeverageConfig,
  latencyDelaySeconds?: number
): ActiveTradeState[] {
  const summary = fetchActiveTradeState(
    trades,
    alphaData,
    betaData,
    deltaData,
    simulationIndex,
    leverageSettings,
    latencyDelaySeconds
  );
  return summary.recurrentTrades;
}
