export interface ClassicSystemOption {
  id: string;
  name: string;
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'ichimoku' | 'three_candle_strike' | 'turtle_trading' | 'supertrend_regime' | 'heikin_ashi_smoothed' | 'candlestick_pattern';
  isSingleTimeframeBased: boolean;
  isSelfLayeredOnly: boolean;
  isInvertDirectionIndicator: boolean;
  defaultNumericalInputs: Record<string, number>;
}

export const activeClassicSystems: ClassicSystemOption[] = [
  {
    id: 'ma_crossover',
    name: 'Moving Average Crossover',
    type: 'ma_crossover',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      fastMa: 9,
      slowMa: 21
    }
  },
  {
    id: 'stochastic',
    name: 'Stochastic Crossover',
    type: 'stochastic',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      kPeriod: 14,
      dPeriod: 3,
      smooth: 3
    }
  },
  {
    id: 'supertrend',
    name: 'Supertrend',
    type: 'supertrend',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      atrPeriod: 10,
      multiplier: 3
    }
  },
  {
    id: 'divergence',
    name: 'Divergence',
    type: 'divergence',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      lookback: 14,
      rsiPeriod: 14
    }
  },
  {
    id: 'linear_regression',
    name: 'Linear Regression',
    type: 'linear_regression',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      period: 14,
      channelWidth: 2
    }
  },
  {
    id: 'bollinger_bands',
    name: 'Bollinger Breakout',
    type: 'bollinger_bands',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      period: 55,
      stdDev: 1
    }
  },
  {
    id: 'ichimoku', name: 'Ichimoku', type: 'ichimoku',
    isSingleTimeframeBased: true, isSelfLayeredOnly: true, isInvertDirectionIndicator: true,
    defaultNumericalInputs: { tenkanPeriod: 9, kijunPeriod: 26, senkouBPeriod: 52, displacement: 26 }
  },
  {
    id: 'three_candle_strike', name: '3 Candle Strike', type: 'three_candle_strike',
    isSingleTimeframeBased: true, isSelfLayeredOnly: true, isInvertDirectionIndicator: true,
    defaultNumericalInputs: { fastEma: 8, fastSmma: 21, mediumSmma: 50, slowSmma: 200, regressionPeriod: 50, slopeSmooth: 50, trendThreshold: 0.03 }
  },
  {
    id: 'turtle_trading', name: 'Turtle Trading', type: 'turtle_trading',
    isSingleTimeframeBased: true, isSelfLayeredOnly: true, isInvertDirectionIndicator: true,
    defaultNumericalInputs: { entryPeriod: 20, exitPeriod: 10, nPeriod: 20, stopMultiple: 2 }
  },
  {
    id: 'supertrend_regime',
    name: 'Supertrend Regime',
    type: 'supertrend_regime',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      stPeriod: 10,
      atrMultiplier: 3,
      regimePeriod: 30,
      zPeriod: 20,
      zUpper: 1.5,
      zLower: -1.5
    }
  },
  {
    id: 'heikin_ashi_smoothed',
    name: 'Heikin Ashi Smoothed',
    type: 'heikin_ashi_smoothed',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      smoothLen: 10
    }
  },
  {
    id: 'candlestick_pattern',
    name: 'Candlestick Pattern',
    type: 'candlestick_pattern',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {}
  }
];
