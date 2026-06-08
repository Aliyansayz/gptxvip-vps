import { Ohlc } from '../indicators/baseline';
import { calculateVolatilityZScore } from '../indicators/exclusive';
import { calculateSqueeze } from '../indicators/integral/squeeze_momentum';
import { getVolatilityRegime } from '../indicators/exclusive/volatilityBehavior';

export interface VolatilityState {
  zScore: {
    value: number | null;
    source: 'alpha' | 'beta' | 'delta';
  };
  squeezeStatus: {
    value: number | null; // 1 = compression, 0 = expansion
    source: 'alpha' | 'beta' | 'delta';
  };
  volatilityRegime: {
    value: number | null; // 1 = high, 0 = low
    source: 'alpha' | 'beta' | 'delta';
  };
}

export function fetchVolatilityState(
  alphaData: Ohlc[],
  betaData: Ohlc[],
  deltaData: Ohlc[],
  simulationIndex: number,
  betaIndex: number,
  deltaIndex: number,
  indicatorSettings: any
): VolatilityState {
  
  const getDataBySource = (source: 'alpha' | 'beta' | 'delta') => {
    if (source === 'beta') return betaData;
    if (source === 'delta') return deltaData;
    return alphaData;
  };

  const getIndexBySource = (source: 'alpha' | 'beta' | 'delta') => {
    if (source === 'beta') return betaIndex;
    if (source === 'delta') return deltaIndex;
    return simulationIndex;
  };

  const result: VolatilityState = {
    zScore: { value: null, source: 'alpha' },
    squeezeStatus: { value: null, source: 'alpha' },
    volatilityRegime: { value: null, source: 'alpha' }
  };

  if (alphaData.length === 0) return result;

  // 1. Z-Score (Using indicatorSettings.volatility settings)
  const zSource = indicatorSettings.volatility?.dataSource || 'alpha';
  const zData = getDataBySource(zSource);
  const zIdx = getIndexBySource(zSource);
  const zPeriod = indicatorSettings.volatility?.zScorePeriod || 20;
  
  result.zScore.source = zSource;
  if (zData.length > 0 && zIdx < zData.length && zIdx >= 0) {
    // Only calculate what we need or up to current index
    const zScores = calculateVolatilityZScore(zData.slice(0, zIdx + 1), zPeriod);
    if (zScores.length > 0) {
      result.zScore.value = zScores[zScores.length - 1];
    }
  }

  // 2. Squeeze Momentum (Using indicatorSettings.volatility settings)
  const sqSource = indicatorSettings.volatility?.dataSource || 'alpha';
  const sqData = getDataBySource(sqSource);
  const sqIdx = getIndexBySource(sqSource);
  const sqLen = indicatorSettings.volatility?.squeezeLength || 20;

  result.squeezeStatus.source = sqSource;
  if (sqData.length > 0 && sqIdx < sqData.length && sqIdx >= 0) {
    const dataSubset = sqData.slice(0, sqIdx + 1);
    const sqCloses = dataSubset.map(d => d.close);
    const sqHighs = dataSubset.map(d => d.high);
    const sqLows = dataSubset.map(d => d.low);
    const squeeze = calculateSqueeze(sqCloses, sqHighs, sqLows, true, sqLen, 2.0, sqLen, 1.5);
    if (squeeze.squeeze_status.length > 0) {
      result.squeezeStatus.value = squeeze.squeeze_status[squeeze.squeeze_status.length - 1];
    }
  }

  // 3. Volatility Regime (Using indicatorSettings.volatilityRegime settings)
  const vrSource = indicatorSettings.volatilityRegime?.dataSource || 'alpha';
  const vrData = getDataBySource(vrSource);
  const vrIdx = getIndexBySource(vrSource);
  const vrPeriod = indicatorSettings.volatilityRegime?.period || 30;

  result.volatilityRegime.source = vrSource;
  if (vrData.length > 0 && vrIdx < vrData.length && vrIdx >= 0) {
    const dataSubset = vrData.slice(0, vrIdx + 1);
    const vrCloses = dataSubset.map(d => d.close);
    const vr = getVolatilityRegime(vrCloses, vrPeriod);
    if (vr.regime.length > 0) {
      result.volatilityRegime.value = vr.regime[vr.regime.length - 1];
    }
  }

  return result;
}
