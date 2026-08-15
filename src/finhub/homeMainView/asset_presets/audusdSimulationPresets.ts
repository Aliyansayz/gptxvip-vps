import { OHLCSimulationParams } from './types';

export type AUDUSDPresetName =
  | 'rba_rate_shock'
  | 'china_growth_positive'
  | 'china_growth_negative'
  | 'iron_ore_bid'
  | 'risk_on_rally'
  | 'asia_session_consolidation'
  | 'aud_cpi_labor_shock'
  | 'fed_usd_shock'
  | 'london_usd_volatility'
  | 'undecided_sideways'
  | 'post_rba_whipsaw'
  | 'year_end_thin_liquidity';

export interface AUDUSDPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const AUDUSD_PRESETS: Record<AUDUSDPresetName, AUDUSDPresetProfile> = {
  rba_rate_shock: {
    label: 'RBA Rate Shock',
    description: 'Reserve Bank of Australia surprise / hawkish hold. AUD reprices quickly.',
    params: {
      drift: 0.00005,
      volatility: 0.0031,
      seed: 3101,
      wick_factor: 0.56,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.18,
      basePrice: 0.67,
    },
  },

  china_growth_positive: {
    label: 'China Growth Positive',
    description: 'Better Chinese demand / growth tone. Commodity-linked AUD strength with trend continuation.',
    params: {
      drift: 0.00006,
      volatility: 0.0022,
      seed: 4202,
      wick_factor: 0.34,
      high_low_noise: 0.0009,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.10,
      basePrice: 0.67,
    },
  },

  china_growth_negative: {
    label: 'China Growth Negative',
    description: 'Weaker China demand / soft manufacturing tone. AUD sells off on growth sensitivity.',
    params: {
      drift: 0.00004,
      volatility: 0.0028,
      seed: 5303,
      wick_factor: 0.44,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.16,
      basePrice: 0.67,
    },
  },

  iron_ore_bid: {
    label: 'Iron Ore Bid',
    description: 'Commodity support through iron ore and metal pricing. Stronger AUD bias and breakout risk.',
    params: {
      drift: 0.00005,
      volatility: 0.0020,
      seed: 6404,
      wick_factor: 0.36,
      high_low_noise: 0.00095,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.09,
      basePrice: 0.67,
    },
  },

  risk_on_rally: {
    label: 'Risk On Rally',
    description: 'Equity-friendly / carry-friendly market tone. AUD lifts as risk appetite improves.',
    params: {
      drift: 0.00007,
      volatility: 0.0019,
      seed: 7505,
      wick_factor: 0.30,
      high_low_noise: 0.0008,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.08,
      basePrice: 0.67,
    },
  },

  asia_session_consolidation: {
    label: 'Asia Session Consolidation',
    description: 'Calmer Asian-session behavior with tight ranges and slower trend development.',
    params: {
      drift: 0.00001,
      volatility: 0.00072,
      seed: 8606,
      wick_factor: 0.18,
      high_low_noise: 0.00022,
      side_ways_switch_prob: 0.52,
      trend_switch_prob: 0.03,
      basePrice: 0.67,
    },
  },

  aud_cpi_labor_shock: {
    label: 'AUD CPI / Labor Shock',
    description: 'Australian inflation or employment surprise. RBA expectations move and AUD reacts strongly.',
    params: {
      drift: 0.00004,
      volatility: 0.0029,
      seed: 9707,
      wick_factor: 0.48,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.14,
      basePrice: 0.67,
    },
  },

  fed_usd_shock: {
    label: 'Fed / USD Shock',
    description: 'U.S. yields and dollar repricing dominate AUDUSD, often overpowering local AU data.',
    params: {
      drift: 0.00005,
      volatility: 0.0030,
      seed: 10808,
      wick_factor: 0.50,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.15,
      basePrice: 0.67,
    },
  },

  london_usd_volatility: {
    label: 'London USD Volatility',
    description: 'London session dollar volatility and cross-asset flow. Good for intraday expansion windows.',
    params: {
      drift: 0.00004,
      volatility: 0.0021,
      seed: 11909,
      wick_factor: 0.32,
      high_low_noise: 0.00085,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.10,
      basePrice: 0.67,
    },
  },

  undecided_sideways: {
    label: 'Undecided Sideways',
    description: 'Balanced market with no strong risk or commodity edge. Small candles and flat structure.',
    params: {
      drift: 0.00001,
      volatility: 0.00078,
      seed: 12010,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.50,
      trend_switch_prob: 0.03,
      basePrice: 0.67,
    },
  },

  post_rba_whipsaw: {
    label: 'Post RBA Whipsaw',
    description: 'After RBA decisions the pair can flip fast as the market digests guidance and growth signals.',
    params: {
      drift: 0.00002,
      volatility: 0.0034,
      seed: 13011,
      wick_factor: 0.58,
      high_low_noise: 0.0014,
      side_ways_switch_prob: 0.10,
      trend_switch_prob: 0.22,
      basePrice: 0.67,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description: 'Late-year low depth and irregular prints. Wider candles and less reliable follow-through.',
    params: {
      drift: 0.00002,
      volatility: 0.0018,
      seed: 14012,
      wick_factor: 0.40,
      high_low_noise: 0.00095,
      side_ways_switch_prob: 0.18,
      trend_switch_prob: 0.08,
      basePrice: 0.67,
    },
  },
};

export function getAUDUSDPreset(
  preset: AUDUSDPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...AUDUSD_PRESETS[preset].params,
    ...overrides,
  };
}

export const AUDUSD_PRESET_NAMES: AUDUSDPresetName[] = [
  'rba_rate_shock',
  'china_growth_positive',
  'china_growth_negative',
  'iron_ore_bid',
  'risk_on_rally',
  'asia_session_consolidation',
  'aud_cpi_labor_shock',
  'fed_usd_shock',
  'london_usd_volatility',
  'undecided_sideways',
  'post_rba_whipsaw',
  'year_end_thin_liquidity',
];
