import { Ohlc } from '../indicators/baseline';
import { fetchIndicatorAlpha, IndicatorStateSummary } from '../indicatorState/fetchIndicatorAlpha';

/**
 * syncIndicatorState acts as a coordination layer to synchronize the floating indicator values.
 * It coordinates calculations for both Alpha and Beta data sources, ensuring the logs are
 * synchronized based on the current simulationIndex and betaIndex.
 * 
 * This keeps with the worst-case, real-time sync philosophy modeled in syncTradeState.ts
 */
export function syncIndicatorState(
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  betaIndex: number,
  deltaIndex: number,
  indicatorSettings: any,
  tradingConfig: any,
  heikinAshiSettings?: any,
  assetName?: string
): IndicatorStateSummary {
  // Leverage the indicator state calculator to retrieve aligned lookback data
  return fetchIndicatorAlpha(
    alphaData,
    betaData,
    deltaData,
    simulationIndex,
    betaIndex,
    deltaIndex,
    indicatorSettings,
    tradingConfig,
    heikinAshiSettings,
    assetName
  );
}
