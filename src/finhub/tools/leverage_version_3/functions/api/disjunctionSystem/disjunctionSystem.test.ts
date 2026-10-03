import { strict as assert } from 'node:assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { aggregateData } from '../../../components/CandlestickSimulator/types';
import { useComputedIndicators } from '../../../components/CandlestickSimulator/useComputedIndicators';
import { calculateEMA, calculateSMA, calculateStochastic, calculateSupertrend, Ohlc } from '../indicators/baseline';
import { calculateBollingerBreakout } from '../classicSystem/bollingerBreakout';
import { calculateIchimoku } from '../classicSystem/ichimoku';
import { calculateThreeCandleStrike } from '../classicSystem/threeCandleStrike';
import { calculateTurtleTrading } from '../classicSystem/turtleTrading';
import { getSystemInstanceSettings } from '../classicSystem/systemInstanceSettings';
import { linearRegressionSystem } from '../indicators/exclusive/linearRegression';
import { smoothedHeikinAshi } from '../indicators/integral/heikin_ashi_smoothing';
import { supertrendRegimeSystem } from '../indicators/exclusive/supertrend_regime';
import { getCandlePatternsMultiple } from '../indicators/exclusive/candlePattern';
import { activeClassicSystems } from '../classicSystem/classicsystemController';
import { isNewSourceCandle } from '../rules/dataSourceRules';
import { getBaseSystemId } from '../conjunctionSystem/selfReplicationLabelManage';
import { evaluateDisjunctionSystem } from './index';

assert.equal(evaluateDisjunctionSystem([]), null);
assert.equal(evaluateDisjunctionSystem([null, 'LONG', null]), 'LONG');
assert.equal(evaluateDisjunctionSystem([null, 'SHORT', null]), 'SHORT');
assert.equal(evaluateDisjunctionSystem(['SHORT', 'LONG']), 'SHORT');
assert.equal(evaluateDisjunctionSystem(['LONG', 'SHORT']), 'LONG');

const data: Ohlc[] = Array.from({ length: 260 }, (_, i) => {
  const close = 100 + i * 0.08 + Math.sin(i / 3) * 5;
  return { time: i + 1, open: close - Math.cos(i) * 0.5,
    high: close + 1.5, low: close - 1.5, close, volume: 1 };
});
data[250] = { time: 251, open: 120, high: 120.3, low: 118.5, close: 120.2, volume: 1 };
const beta = aggregateData(data, 5);
assert.equal(isNewSourceCandle(beta[0].time, data[3].time), true);
assert.equal(isNewSourceCandle(beta[0].time, data[4].time), false);
assert.equal(isNewSourceCandle(beta[1].time, data[8].time), true);
const settings: Record<string, any> = {
  ma_crossover: { fastMa: 9, slowMa: 34, dataSource: 'alpha', betaParams: { slowMa: 12 } },
  ma_crossover_alpha: { fastMa: 4 },
  ma_crossover_beta: { entrySignalSource: 'beta', allowVariation: true, betaParams: { fastMa: 3 } },
  stochastic: { stochK: 14, stochD: 4, dataSource: 'alpha', exitSignalSource: 'beta' },
  stochastic_beta: { kPeriod: 5, entrySignalSource: 'beta' },
  supertrend: { period: 10, multiplier: 3 },
  supertrend_alpha: { supertrendPeriod: 5 },
  divergence: { stochK: 14, stochD: 3 },
  divergence_alpha: { lookback: 6 },
  linear_regression: { slopePeriod: 20, volPeriod: 20, regimePeriod: 30 },
  linear_regression_alpha: { lrSlopePeriod: 7 },
  bollinger_bands: { period: 55, bbPeriod: 70, stdDev: 1.2 },
  bollinger_bands_alpha: { bbPeriod: 8 },
  ichimoku: { tenkanPeriod: 9, kijunPeriod: 26, senkouBPeriod: 52, displacement: 26 },
  ichimoku_alpha: { tenkanPeriod: 5 },
  three_candle_strike: { fastEma: 8, fastSmma: 21, mediumSmma: 50, slowSmma: 200,
    regressionPeriod: 50, slopeSmooth: 50, trendThreshold: 0.03 },
  three_candle_strike_alpha: { fastEma: 4 },
  turtle_trading: { entryPeriod: 20, exitPeriod: 10, nPeriod: 20, stopMultiple: 2 },
  turtle_trading_alpha: { entryPeriod: 8 },
  supertrend_regime: { stPeriod: 10, atrMultiplier: 3, regimePeriod: 30, zPeriod: 20, zUpper: 1.5, zLower: -1.5 },
  supertrend_regime_alpha: { zPeriod: 8 },
  heikin_ashi_smoothed: { smoothLen: 10 },
  heikin_ashi_smoothed_alpha: { haSmoothLen: 4 },
  candlestick_pattern: { allowedPatterns: { bullish_hammer: false, bearish_engulfing: true } },
  candlestick_pattern_alpha: { allowedPatterns: { bullish_hammer: true, bearish_engulfing: false } },
  volatility: { adxPeriod: 14, dataSource: 'alpha' },
  trendStrength: { slopePeriod: 20, dataSource: 'alpha' },
  volatilityRegime: { dataSource: 'alpha' },
  stopLossIndicator: { type: 'atr_bands', period: 14, multiplier: 2, dataSource: 'alpha' }
};

const maSettings = getSystemInstanceSettings(settings, 'ma_crossover_alpha');
assert.equal(maSettings.fastMa, 4);
assert.equal(maSettings.slowMa, 34);
const maBetaSettings = getSystemInstanceSettings(settings, 'ma_crossover_beta');
assert.equal(maBetaSettings.betaParams.fastMa, 3);
assert.equal(maBetaSettings.betaParams.slowMa, 12);
const patternSettings = getSystemInstanceSettings(settings, 'candlestick_pattern_alpha');
assert.equal(patternSettings.allowedPatterns.bullish_hammer, true);
assert.equal(patternSettings.allowedPatterns.bearish_engulfing, false);

const selected = [
  'ma_crossover_alpha', 'ma_crossover_beta', 'stochastic_beta', 'supertrend_alpha', 'divergence_alpha',
  'linear_regression_alpha', 'bollinger_bands_alpha', 'ichimoku_alpha',
  'three_candle_strike_alpha', 'turtle_trading_alpha', 'supertrend_regime_alpha',
  'heikin_ashi_smoothed_alpha', 'candlestick_pattern_alpha'
];
assert.deepEqual(new Set(selected.map(getBaseSystemId)), new Set(activeClassicSystems.map(system => system.id)));
let computed: any;
function Probe() {
  computed = useComputedIndicators(data, beta, data, { type: 'ma_crossover' } as any,
    { activeSystemMode: 'disjunction', activeDisjunctionSystems: selected }, settings, 'Gold');
  return null;
}
renderToStaticMarkup(React.createElement(Probe));
const signals = computed.entrySignal.disjunctionSignals;
assert.deepEqual(Object.keys(signals), selected);
const closes = data.map(candle => candle.close);
assert.equal(signals.ma_crossover_alpha.fastLine[100], calculateEMA(closes, 4)[100]);
assert.equal(signals.ma_crossover_alpha.slowLine[100], calculateSMA(closes, 34)[100]);
const betaCloses = beta.map(candle => candle.close);
assert.equal(signals.ma_crossover_beta.fastLine[30], calculateEMA(betaCloses, 3)[30]);
assert.equal(signals.ma_crossover_beta.slowLine[30], calculateSMA(betaCloses, 12)[30]);
assert.equal(signals.stochastic_beta.stochastic.k.length, beta.length);
assert.equal(signals.stochastic_beta.stochastic.k[40], calculateStochastic(beta, 5, 3, 4).k[40]);
assert.equal(signals.bollinger_bands_alpha.bb[100].basis,
  calculateBollingerBreakout(data, 8, 1.2).bb[100].basis);
assert.equal(signals.supertrend_alpha.supertrend.trend[100], calculateSupertrend(data, 5, 3).trend[100]);
assert.equal(signals.divergence_alpha.stochastic.k[100], calculateStochastic(data, 6, 3, 3).k[100]);
assert.equal(signals.linear_regression_alpha.lr.trend_strength[100],
  linearRegressionSystem(closes, 7, 20, 30).trend_strength[100]);
assert.equal(signals.ichimoku_alpha.ichimoku.tenkan[100],
  calculateIchimoku(data, { tenkanPeriod: 5 }).tenkan[100]);
assert.equal(signals.three_candle_strike_alpha.strike.ema[100],
  calculateThreeCandleStrike(data, { fastEma: 4 }).ema[100]);
assert.equal(signals.turtle_trading_alpha.turtle.entryUpper[100],
  calculateTurtleTrading(data, { entryPeriod: 8 }).entryUpper[100]);
const highs = data.map(candle => candle.high);
const lows = data.map(candle => candle.low);
const opens = data.map(candle => candle.open);
assert.equal(signals.supertrend_regime_alpha.supertrend_regime.zscore[100],
  supertrendRegimeSystem(highs, lows, closes, 10, 3, 30, 8, 1.5, -1.5).zscore[100]);
assert.equal(signals.heikin_ashi_smoothed_alpha.heikin_ashi_smoothed.haClose[100],
  smoothedHeikinAshi(opens, highs, lows, closes, 4).haClose[100]);
const selectedPatterns = getCandlePatternsMultiple(opens, highs, lows, closes, patternSettings.allowedPatterns);
const basePatterns = getCandlePatternsMultiple(opens, highs, lows, closes, settings.candlestick_pattern.allowedPatterns);
assert.equal(signals.candlestick_pattern_alpha.candlestick_pattern.action_signal[250], selectedPatterns.action_signal[250]);
assert.notEqual(selectedPatterns.action_signal[250], basePatterns.action_signal[250]);

for (const type of ['stochastic', 'supertrend', 'divergence', 'linear_regression']) {
  const keys = Object.keys(activeClassicSystems.find(system => system.id === type)!.defaultNumericalInputs);
  assert.ok(keys.every(key => key in settings[type]), `${type} exit controls should use active calculation settings`);
}

let exitComputed: any;
function ExitProbe() {
  exitComputed = useComputedIndicators(data, beta, data, { type: 'ma_crossover' } as any, {
    activeSystemMode: 'disjunction',
    activeDisjunctionSystems: [],
    useDifferentSignalSystemOnExit: true,
    exitSignalSystemMode: 'disjunction',
    exitUseExplicitParams: true,
    exitActiveDisjunctionSystems: ['stochastic', 'supertrend', 'linear_regression', 'bollinger_bands'],
    exitDisjunctionParams: {
      stochastic: { kPeriod: 7, dPeriod: 5 },
      supertrend: { atrPeriod: 4, multiplier: 2 },
      linear_regression: { period: 6, channelWidth: 9, regimePeriod: 12 },
      bollinger_bands: { bbPeriod: 7, bbStdDev: 2 }
    }
  }, settings, 'Gold');
  return null;
}
renderToStaticMarkup(React.createElement(ExitProbe));
assert.deepEqual(exitComputed.entrySignal.disjunctionSignals, {});
const exitSignals = exitComputed.exitSignal.disjunctionSignals;
assert.equal(exitSignals.stochastic.stochastic.k.length, beta.length);
assert.equal(exitSignals.stochastic.stochastic.k[40], calculateStochastic(beta, 7, 3, 5).k[40]);
assert.equal(exitSignals.supertrend.supertrend.trend[100], calculateSupertrend(data, 4, 2).trend[100]);
assert.equal(exitSignals.linear_regression.lr.trend_strength[100],
  linearRegressionSystem(closes, 6, 9, 12).trend_strength[100]);
assert.equal(exitSignals.bollinger_bands.bb[100].basis, calculateBollingerBreakout(data, 7, 2).bb[100].basis);

console.log('disjunction system checks passed');
