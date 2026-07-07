export interface ClassicSystemOption {
  id: string;
  name: string;
  type: 'ma_crossover' | 'stochastic' | 'supertrend' | 'divergence' | 'linear_regression' | 'bollinger_bands' | 'supertrend_regime';
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
    name: 'Bollinger Bands',
    type: 'bollinger_bands',
    isSingleTimeframeBased: true,
    isSelfLayeredOnly: true,
    isInvertDirectionIndicator: true,
    defaultNumericalInputs: {
      period: 20,
      stdDev: 2
    }
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
  }
];
