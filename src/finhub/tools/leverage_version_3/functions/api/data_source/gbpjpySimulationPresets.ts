// gbpjpySimulationPresets.ts

import { OHLCSimulationParams } from './simulationDataOhlcParameter';

export type GBPJPYPresetName =
  | 'boe_boj_policy_divergence'
  | 'uk_cpi_shock'
  | 'uk_gdp_surprise'
  | 'uk_employment_shock'
  | 'london_open_breakout'
  | 'london_newyork_overlap'
  | 'yen_intervention_spike'
  | 'carry_trade_unwind'
  | 'risk_on_sterling_rally'
  | 'asia_consolidation'
  | 'post_news_whipsaw'
  | 'year_end_thin_liquidity';

export interface GBPJPYPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * GBPJPY presets are tuned around:
 * - BoE vs BOJ policy divergence
 * - UK inflation / GDP / employment surprises
 * - yen intervention risk
 * - carry-trade unwind
 * - London open and London-New York overlap
 * - risk-on sterling rallies
 */
export const GBPJPY_PRESETS: Record<GBPJPYPresetName, GBPJPYPresetProfile> = {
  boe_boj_policy_divergence: {
    label: 'BoE vs BOJ Policy Divergence',
    description:
      'Main directional regime for GBPJPY when UK rates and Japanese rates diverge.',
    params: {
      drift: 0.00014,
      volatility: 0.0020,
      seed: 2101,
      wick_factor: 0.35,
      high_low_noise: 0.0008,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.09,
      basePrice: 200,
    },
  },

  uk_cpi_shock: {
    label: 'UK CPI Shock',
    description:
      'Sterling repricing after inflation surprises and shifting BoE expectations.',
    params: {
      drift: 0.00003,
      volatility: 0.0035,
      seed: 3202,
      wick_factor: 0.64,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.20,
      basePrice: 200,
    },
  },

  uk_gdp_surprise: {
    label: 'UK GDP Surprise',
    description:
      'Trend acceleration or slowdown after growth data changes the BoE path.',
    params: {
      drift: 0.00010,
      volatility: 0.0022,
      seed: 4303,
      wick_factor: 0.40,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.10,
      basePrice: 200,
    },
  },

  uk_employment_shock: {
    label: 'UK Employment Shock',
    description:
      'Fast but often short-lived reaction to labor-market data and wage prints.',
    params: {
      drift: 0.00003,
      volatility: 0.0030,
      seed: 5404,
      wick_factor: 0.58,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.18,
      basePrice: 200,
    },
  },

  london_open_breakout: {
    label: 'London Open Breakout',
    description:
      'Opening-session expansion with strong directional impulse and high liquidity.',
    params: {
      drift: 0.00012,
      volatility: 0.0027,
      seed: 6505,
      wick_factor: 0.42,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 200,
    },
  },

  london_newyork_overlap: {
    label: 'London-New York Overlap',
    description:
      'Highest routine liquidity window with continuation or reversal after major data.',
    params: {
      drift: 0.00011,
      volatility: 0.0031,
      seed: 7606,
      wick_factor: 0.45,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.14,
      basePrice: 200,
    },
  },

  yen_intervention_spike: {
    label: 'Yen Intervention Spike',
    description:
      'Abrupt yen-strengthening spike when Japan’s authorities signal or execute FX intervention.',
    params: {
      drift: 0.00002,
      volatility: 0.0043,
      seed: 8707,
      wick_factor: 0.75,
      high_low_noise: 0.0025,
      side_ways_switch_prob: 0.02,
      trend_switch_prob: 0.26,
      basePrice: 200,
    },
  },

  carry_trade_unwind: {
    label: 'Carry Trade Unwind',
    description:
      'Risk-off yen squeeze when carry positions get reduced quickly.',
    params: {
      drift: 0.00003,
      volatility: 0.0040,
      seed: 9808,
      wick_factor: 0.68,
      high_low_noise: 0.0020,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.22,
      basePrice: 200,
    },
  },

  risk_on_sterling_rally: {
    label: 'Risk On Sterling Rally',
    description:
      'Bullish sterling drive when risk appetite is strong and the yen is weak.',
    params: {
      drift: 0.00020,
      volatility: 0.0018,
      seed: 10909,
      wick_factor: 0.30,
      high_low_noise: 0.0007,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.06,
      basePrice: 200,
    },
  },

  asia_consolidation: {
    label: 'Asia Consolidation',
    description:
      'Quiet overnight / early Asia range behavior with compressed candles.',
    params: {
      drift: 0.00002,
      volatility: 0.00075,
      seed: 1110,
      wick_factor: 0.18,
      high_low_noise: 0.00022,
      side_ways_switch_prob: 0.52,
      trend_switch_prob: 0.03,
      basePrice: 200,
    },
  },

  post_news_whipsaw: {
    label: 'Post News Whipsaw',
    description:
      'High-volatility aftershock with rapid direction changes after BoE or BOJ events.',
    params: {
      drift: 0.00002,
      volatility: 0.0032,
      seed: 1212,
      wick_factor: 0.62,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.12,
      trend_switch_prob: 0.20,
      basePrice: 200,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description:
      'Late-year market with exaggerated moves due to lighter participation.',
    params: {
      drift: 0.00003,
      volatility: 0.0021,
      seed: 1313,
      wick_factor: 0.44,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.15,
      trend_switch_prob: 0.07,
      basePrice: 200,
    },
  },
};

export function getGBPJPYPreset(
  preset: GBPJPYPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...GBPJPY_PRESETS[preset].params,
    ...overrides,
  };
}

export function listGBPJPYPresetNames(): GBPJPYPresetName[] {
  return Object.keys(GBPJPY_PRESETS) as GBPJPYPresetName[];
}
