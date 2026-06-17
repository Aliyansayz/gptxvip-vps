import { Ohlc, calculateSMA, calculateEMA, calculateStochastic, calculateSupertrend, calculateStopBandsSmooth } from '../indicators/baseline';
import { calculateVolatilityZScore } from '../indicators/exclusive';
import { linearRegressionSystem } from '../indicators/exclusive/linearRegression';
import { calculateBollingerBands } from '../indicators/exclusive/bollingerBands';
import { supertrendRegimeSystem } from '../indicators/exclusive/supertrend_regime';
import { calculateADX } from '../indicators/integral/adx';
import { calculateSqueeze } from '../indicators/integral/squeeze_momentum';
import { smoothedHeikinAshi } from '../indicators/integral/heikin_ashi_smoothing';
import { getCandlePatternsMultiple } from '../indicators/integral/candlePattern';
import { calculateBodyWickRatio } from '../indicators/integral/body_wick_size_ratio';
import { calculateRelativePriceAcceleration } from '../indicators/integral/relative_price_acceleration';
import { evaluatePipsDeltas } from './evaluateAssetPips';
import { rollingRegressionSlope, slopePersistenceFast, trendEfficiencyFast } from '../indicators/trendStrength/trendStrength';

export interface IndicatorRow {
  index: number;
  time: number;
  timeStr: string;
  close: number;
  open: number;
  high: number;
  low: number;
  indicators: {
    name: string;
    key: string;
    values: { [label: string]: string | number };
  }[];
}

export interface IndicatorStateSummary {
  alphaRows: IndicatorRow[];
  betaRows: IndicatorRow[];
  deltaRows: IndicatorRow[];
}

/**
 * Computes all available indicators for a specified dataset (alpha or beta).
 * Returns the state of these indicators from the specified index down to the last 5 lookback values.
 */
export function getIndicatorsStateForDataset(
  dataset: Ohlc[],
  currentIndex: number,
  indicatorSettings: any,
  tradingConfig: any,
  dataSourceName: 'alpha' | 'beta' | 'delta' = 'alpha',
  heikinAshiSettings?: any,
  assetName: string = 'gold'
): IndicatorRow[] {
  const resultRows: IndicatorRow[] = [];
  if (!dataset || dataset.length === 0 || currentIndex < 0) {
    return resultRows;
  }

  // Pre-calculate state indicators for the entire visible range of dataset
  const closes = dataset.map(d => d.close);
  const highs = dataset.map(d => d.high);
  const lows = dataset.map(d => d.low);

  // Heikin Ashi Smoothing & Candlestick Style
  const smoothLen = heikinAshiSettings?.smoothLen || 1;
  const isHAEnabled = heikinAshiSettings 
    ? (dataSourceName === 'alpha' 
        ? heikinAshiSettings.alphaEnabled 
        : dataSourceName === 'beta' 
        ? heikinAshiSettings.betaEnabled 
        : heikinAshiSettings.deltaEnabled)
    : false;

  let haResult: any = null;
  if (dataset.length > 0) {
    try {
      haResult = smoothedHeikinAshi(
        dataset.map(d => d.open),
        highs,
        lows,
        closes,
        smoothLen
      );
    } catch (e) {
      console.error("Heikin Ashi calculation error in indicator state info:", e);
    }
  }

  // 1. MA Crossover
  const fastMaPeriod = indicatorSettings.ma_crossover?.fastMa || 9;
  const slowMaPeriod = indicatorSettings.ma_crossover?.slowMa || 21;
  const fastEma = calculateEMA(closes, fastMaPeriod);
  const slowSma = calculateSMA(closes, slowMaPeriod);

  // 2. Stochastic
  const stochPeriod = indicatorSettings.stochastic?.period || 14;
  const stochKPeriod = indicatorSettings.stochastic?.stochK || 14;
  const stochDPeriod = indicatorSettings.stochastic?.stochD || 3;
  const stochResult = calculateStochastic(dataset, stochPeriod, stochKPeriod, stochDPeriod);

  // 3. Supertrend
  const stPeriod = indicatorSettings.supertrend?.period || 10;
  const stMultiplier = indicatorSettings.supertrend?.multiplier || 3;
  const supertrendResult = calculateSupertrend(dataset, stPeriod, stMultiplier);

  // 4. Bollinger Bands
  const bbPeriod = indicatorSettings.bollinger_bands?.period || 20;
  const bbStdDev = indicatorSettings.bollinger_bands?.stdDev || 2;
  const bbResult = calculateBollingerBands(dataset, bbPeriod, bbStdDev);

  // 5. Linear Regression
  const lrSlope = indicatorSettings.linear_regression?.slopePeriod || 20;
  const lrVol = indicatorSettings.linear_regression?.volPeriod || 20;
  const lrRegime = indicatorSettings.linear_regression?.regimePeriod || 30;
  const lrResult = linearRegressionSystem(closes, lrSlope, lrVol, lrRegime);

  // 6. Supertrend Regime
  const strStPeriod = indicatorSettings.supertrend_regime?.stPeriod || 10;
  const strAtrMult = indicatorSettings.supertrend_regime?.atrMultiplier || 3;
  const strRegimePeriod = indicatorSettings.supertrend_regime?.regimePeriod || 30;
  const strZPeriod = indicatorSettings.supertrend_regime?.zPeriod || 20;
  const strZUpper = indicatorSettings.supertrend_regime?.zUpper || 1.5;
  const strZLower = indicatorSettings.supertrend_regime?.zLower || -1.5;
  const supertrendRegimeResult = supertrendRegimeSystem(
    highs, lows, closes,
    strStPeriod, strAtrMult, strRegimePeriod, strZPeriod, strZUpper, strZLower
  );

  // 7. Stops (Smooth ATR bands)
  const stopsPeriod = indicatorSettings.stopLossIndicator?.period || 10;
  const stopsMultiplier = indicatorSettings.stopLossIndicator?.multiplier || 3.0;
  const stopsResult = calculateStopBandsSmooth(dataset, stopsPeriod, stopsMultiplier, false, true);

  // 8. ADX
  const adxPeriod = indicatorSettings.volatility?.adxPeriod || 14;
  const adxResult = calculateADX(dataset, adxPeriod);

  // 9. Squeeze Momentum
  const squeezeResult = calculateSqueeze(closes, highs, lows);

  // 10. Volatility Regime Z-Scores
  const zScorePeriod = indicatorSettings.volatility?.zScorePeriod || 20;
  const zScoresResult = calculateVolatilityZScore(dataset, zScorePeriod);

  // 11. Candle Patterns
  const opens = dataset.map(d => d.open);
  let candlePatternsResult: any = null;
  try {
    candlePatternsResult = getCandlePatternsMultiple(opens, highs, lows, closes);
  } catch (e) {
    console.error("Candle pattern calculation error in getIndicatorsStateForDataset:", e);
  }

  // 12. Body Wick Size Ratio & Relative Price Acceleration
  const bodyWickRatioResult = calculateBodyWickRatio(dataset);
  const relPriceAccelResult = calculateRelativePriceAcceleration(dataset, 15);

  // 13. Trend Strength (Slope Persistence & Trend Efficiency)
  const tsSlopePeriod = indicatorSettings.trendStrength?.slopePeriod || 20;
  const tsSlope = rollingRegressionSlope(closes, tsSlopePeriod);
  const slopePersistenceResult = slopePersistenceFast(tsSlope, tsSlopePeriod);
  const trendEfficiencyResult = trendEfficiencyFast(closes, tsSlopePeriod);

  // Pull values for current timestamp and 4 lookbacks (total: 5)
  const startIndex = Math.min(currentIndex, dataset.length - 1);
  const endLookbackLimit = Math.max(0, startIndex - 4);

  for (let i = startIndex; i >= endLookbackLimit; i--) {
    const ohlcItem = dataset[i];
    if (!ohlcItem) continue;

    // Build the formatted display timestamps
    const dateObj = new Date(ohlcItem.time);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

    const activeIndicators: any[] = [];

    // MA Crossover
    activeIndicators.push({
      name: 'MA Crossover',
      key: 'ma_crossover',
      values: {
        'Fast EMA': isNaN(fastEma[i]) ? 'N/A' : fastEma[i].toFixed(2),
        'Slow SMA': isNaN(slowSma[i]) ? 'N/A' : slowSma[i].toFixed(2),
        'Cross Ratio': (fastEma[i] && slowSma[i]) ? (fastEma[i] - slowSma[i]).toFixed(2) : 'N/A'
      }
    });

    // Stochastic
    activeIndicators.push({
      name: 'Stochastic Oscillator',
      key: 'stochastic',
      values: {
        'K %': isNaN(stochResult.k[i]) ? 'N/A' : stochResult.k[i].toFixed(2),
        'D %': isNaN(stochResult.d[i]) ? 'N/A' : stochResult.d[i].toFixed(2)
      }
    });

    // Supertrend
    if (supertrendResult && supertrendResult.supertrend) {
      activeIndicators.push({
        name: 'Supertrend',
        key: 'supertrend',
        values: {
          'Value': isNaN(supertrendResult.supertrend[i]) ? 'N/A' : supertrendResult.supertrend[i].toFixed(2),
          'Trend': supertrendResult.trend[i] === 1 ? 'BULLISH' : 'BEARISH'
        }
      });
    }

    // Bollinger Bands
    if (bbResult && bbResult[i]) {
      activeIndicators.push({
        name: 'Bollinger Bands',
        key: 'bollinger_bands',
        values: {
          'Upper Band': isNaN(bbResult[i].upper) ? 'N/A' : bbResult[i].upper.toFixed(2),
          'Middle Band': isNaN(bbResult[i].basis) ? 'N/A' : bbResult[i].basis.toFixed(2),
          'Lower Band': isNaN(bbResult[i].lower) ? 'N/A' : bbResult[i].lower.toFixed(2)
        }
      });
    }

    // Linear Regression
    if (lrResult) {
      activeIndicators.push({
        name: 'Linear Regression',
        key: 'linear_regression',
        values: {
          'Slope': isNaN(lrResult.trend_strength[i]) ? 'N/A' : lrResult.trend_strength[i].toFixed(4),
          'Volatility': isNaN(lrResult.volatility[i]) ? 'N/A' : lrResult.volatility[i].toFixed(4),
          'Regime (Z-Score)': isNaN(lrResult.vol_regime[i]) ? 'N/A' : lrResult.vol_regime[i].toFixed(2)
        }
      });
    }

    // Supertrend Regime
    if (supertrendRegimeResult) {
      activeIndicators.push({
        name: 'Supertrend Regime',
        key: 'supertrend_regime',
        values: {
          'ST Value': isNaN(supertrendRegimeResult.supertrend[i]) ? 'N/A' : supertrendRegimeResult.supertrend[i].toFixed(2),
          'Regime': supertrendRegimeResult.vol_regime[i] === 1 ? 'HIGH VOL' : 'NORMAL'
        }
      });
    }

    // Stops (ATR Bands)
    activeIndicators.push({
      name: 'ATR Stop Loss Bands',
      key: 'stops',
      values: {
        'SL Upper (Shorts)': isNaN(stopsResult.upperBand[i]) ? 'N/A' : stopsResult.upperBand[i].toFixed(2),
        'SL Lower (Longs)': isNaN(stopsResult.lowerBand[i]) ? 'N/A' : stopsResult.lowerBand[i].toFixed(2)
      }
    });

    // ADX
    activeIndicators.push({
      name: 'Average Directional Index (ADX)',
      key: 'adx',
      values: {
        'ADX': isNaN(adxResult[i]) ? 'N/A' : adxResult[i].toFixed(2),
        'Trendiness': adxResult[i] > 25 ? 'STRONG TREND' : 'WEAK TREND'
      }
    });

    // Squeeze Momentum
    if (squeezeResult) {
      activeIndicators.push({
        name: 'Squeeze Momentum',
        key: 'squeeze',
        values: {
          'Status': squeezeResult.squeeze_status[i] === 1 ? 'SQUEEZED' : 'NORMAL'
        }
      });
    }

    // Z-Scores
    activeIndicators.push({
      name: 'Volatility Z-Score',
      key: 'zscores',
      values: {
        'Z-Score': isNaN(zScoresResult[i]) ? 'N/A' : zScoresResult[i].toFixed(2)
      }
    });

    // Trend Strength
    activeIndicators.push({
      name: 'Trend Strength (Slope & Efficiency)',
      key: 'trend_strength',
      values: {
        'Slope Persistence': (slopePersistenceResult[i] === undefined || slopePersistenceResult[i] === null || isNaN(slopePersistenceResult[i])) ? 'N/A' : slopePersistenceResult[i].toFixed(4),
        'Trend Efficiency': (trendEfficiencyResult[i] === undefined || trendEfficiencyResult[i] === null || isNaN(trendEfficiencyResult[i])) ? 'N/A' : trendEfficiencyResult[i].toFixed(4),
        'S.P. Status': (slopePersistenceResult[i] >= (tradingConfig?.slopePersistenceThreshold ?? 0.7)) ? 'PERSISTENT' : 'CHOPPY',
        'T.E. Status': (trendEfficiencyResult[i] !== null && trendEfficiencyResult[i] !== undefined && trendEfficiencyResult[i] >= (tradingConfig?.trendEfficiencyThreshold ?? 0.6)) ? 'EFFICIENT' : 'INEFFICIENT'
      }
    });

    // Candle Patterns
    if (candlePatternsResult && candlePatternsResult.patterns[i] !== undefined) {
      const patternValues: Record<string, string | number> = {
        'Pattern': candlePatternsResult.patterns[i] ? candlePatternsResult.patterns[i].split('|').join(', ').toUpperCase() : 'NONE',
        'Action Signal': candlePatternsResult.action_signal[i] ? candlePatternsResult.action_signal[i].toUpperCase() : 'NONE'
      };
      
      // Add each choice as its own column feature to be recorded (0 or 1)
      if (candlePatternsResult.choicelist) {
        candlePatternsResult.choicelist.forEach((choice: string) => {
          const match = candlePatternsResult.patterns[i].includes(choice) ? 1 : 0;
          patternValues[choice] = match;
        });
      }

      activeIndicators.push({
        name: 'Candle Patterns',
        key: 'candle_patterns',
        values: patternValues
      });
    }

    // Render Type / Style Mode
    activeIndicators.push({
      name: 'Render Type / Style',
      key: 'render_type',
      values: {
        'Style Mode': isHAEnabled ? 'Heikin Ashi (Smoothed)' : 'Standard Candlestick',
        'Enabled Source': isHAEnabled ? 'YES' : 'NO',
        'Visual Only': 'YES (No System Impact)'
      }
    });

    // Body Wick Ratio & Price Acceleration
    activeIndicators.push({
      name: 'Body Wick Size Ratio',
      key: 'body_wick_size_ratio',
      values: {
        'Ratio': isNaN(bodyWickRatioResult[i]) ? 'N/A' : bodyWickRatioResult[i]
      }
    });

    activeIndicators.push({
      name: 'Relative Price Acceleration (15)',
      key: 'relative_price_acceleration',
      values: {
        'Acceleration %': isNaN(relPriceAccelResult[i]) ? 'N/A' : relPriceAccelResult[i]
      }
    });

    // Render Only Smoothing Indicator (Heikin Ashi)
    if (haResult && haResult.haClose[i] !== undefined) {
      activeIndicators.push({
        name: 'Smoothing (Heikin Ashi)',
        key: 'smoothing',
        values: {
          'HA Open': isNaN(haResult.haOpen[i]) ? 'N/A' : haResult.haOpen[i].toFixed(2),
          'HA High': isNaN(haResult.haHigh[i]) ? 'N/A' : haResult.haHigh[i].toFixed(2),
          'HA Low': isNaN(haResult.haLow[i]) ? 'N/A' : haResult.haLow[i].toFixed(2),
          'HA Close': isNaN(haResult.haClose[i]) ? 'N/A' : haResult.haClose[i].toFixed(2),
          'HA Color Direction': haResult.direction[i] === 1 ? 'BULLISH (UP)' : haResult.direction[i] === -1 ? 'BEARISH (DOWN)' : 'NEUTRAL',
          'Smooth Len': smoothLen
        }
      });
    }

    // Pips Deltas Indicators representation (Last 5 candles close comparison)
    const deltas = evaluatePipsDeltas(dataset, i, assetName, 5);
    activeIndicators.push({
      name: 'Pips Deltas (Close vs Last 5)',
      key: 'pips_deltas',
      values: {
        'Delta 1 (1st Last)': `${deltas.pips_delta_1 > 0 ? '+' : ''}${deltas.pips_delta_1} pips`,
        'Delta 2 (2nd Last)': `${deltas.pips_delta_2 > 0 ? '+' : ''}${deltas.pips_delta_2} pips`,
        'Delta 3 (3rd Last)': `${deltas.pips_delta_3 > 0 ? '+' : ''}${deltas.pips_delta_3} pips`,
        'Delta 4 (4th Last)': `${deltas.pips_delta_4 > 0 ? '+' : ''}${deltas.pips_delta_4} pips`,
        'Delta 5 (5th Last)': `${deltas.pips_delta_5 > 0 ? '+' : ''}${deltas.pips_delta_5} pips`
      }
    });

    resultRows.push({
      index: i,
      time: ohlcItem.time,
      timeStr,
      close: ohlcItem.close,
      open: ohlcItem.open,
      high: ohlcItem.high,
      low: ohlcItem.low,
      indicators: activeIndicators
    });
  }

  return resultRows;
}

/**
 * Main entry point function for Alpha, Beta, and Delta indicator logging calculations.
 */
export function fetchIndicatorAlpha(
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
  return {
    alphaRows: getIndicatorsStateForDataset(alphaData, simulationIndex, indicatorSettings, tradingConfig, 'alpha', heikinAshiSettings, assetName),
    betaRows: getIndicatorsStateForDataset(betaData, betaIndex, indicatorSettings, tradingConfig, 'beta', heikinAshiSettings, assetName),
    deltaRows: getIndicatorsStateForDataset(deltaData, deltaIndex, indicatorSettings, tradingConfig, 'delta', heikinAshiSettings, assetName)
  };
}
