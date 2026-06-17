import { Ohlc } from '../indicators/baseline';
import { getCandlePatternsMultiple } from '../indicators/exclusive/candlePattern';

export interface MultiSourceOhlc {
  alpha: Ohlc[];
  beta: Ohlc[];
  delta: Ohlc[];
}

export interface CandlePatternResult {
  source: 'alpha' | 'beta' | 'delta';
  action_signal: string | null;
  pattern: string;
}

export function evaluateCandlePatternAcrossSources(
  sources: MultiSourceOhlc,
  sourceWanted: 'alpha' | 'beta' | 'delta' | 'any',
  directionWanted: 'LONG' | 'SHORT',
  alphaIndex: number,
  allowedPatterns?: Record<string, boolean>
): CandlePatternResult | null {
  
  const evaluateSource = (name: 'alpha' | 'beta' | 'delta', dataset: Ohlc[]): CandlePatternResult | null => {
    if (!dataset || dataset.length === 0) return null;
    
    // Map alpha index to dataset index
    let indexToUse = alphaIndex;
    if (name !== 'alpha') {
      const time = sources.alpha[alphaIndex]?.time;
      if (!time) return null;
      
      let left = 0;
      let right = dataset.length - 1;
      let best = 0;
      while (left <= right) {
         const mid = Math.floor((left + right) / 2);
         if (dataset[mid].time <= time) {
            best = mid;
            left = mid + 1;
         } else {
            right = mid - 1;
         }
      }
      indexToUse = best;
    }
    
    if (indexToUse < 0 || indexToUse >= dataset.length) return null;
    
    // Evaluate only the recent chunk or the whole dataset to avoid expensive full re-calc
    // For performance, we can just slice the last 10 candles
    const startIndex = Math.max(0, indexToUse - 10);
    const endIndex = indexToUse + 1;
    const slice = dataset.slice(startIndex, endIndex);
    
    const o = slice.map(d => d.open);
    const h = slice.map(d => d.high);
    const l = slice.map(d => d.low);
    const c = slice.map(d => d.close);
    
    const { action_signal, patterns } = getCandlePatternsMultiple(o, h, l, c, allowedPatterns);
    
    const currentAction = action_signal[action_signal.length - 1];
    const currentPattern = patterns[patterns.length - 1];
    
    if (directionWanted === 'LONG' && currentAction === 'bullish_action') return { source: name, action_signal: currentAction, pattern: currentPattern };
    if (directionWanted === 'SHORT' && currentAction === 'bearish_action') return { source: name, action_signal: currentAction, pattern: currentPattern };
    return null;
  };

  if (sourceWanted === 'any') {
     const alphaRes = evaluateSource('alpha', sources.alpha);
     if (alphaRes) return alphaRes;
     const betaRes = evaluateSource('beta', sources.beta);
     if (betaRes) return betaRes;
     const deltaRes = evaluateSource('delta', sources.delta);
     if (deltaRes) return deltaRes;
     return null;
  } else {
     const res = evaluateSource(sourceWanted, sources[sourceWanted]);
     if (res) return res;
  }
  
  return null;
}
