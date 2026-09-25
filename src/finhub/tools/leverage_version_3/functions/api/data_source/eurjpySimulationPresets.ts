// eurjpySimulationPresets.ts

import { OHLCSimulationParams } from './simulationDataOhlcParameter';

export type EURJPYPresetName =
  | 'ecb_boj_policy_divergence'
  | 'boj_hawkish_surprise'
  | 'yen_intervention_spike'
  | 'carry_trade_unwind'
  | 'risk_off_safe_haven_rally'
  | 'london_open_breakout'
  | 'tokyo_sideways_consolidation'
  | 'eurozone_inflation_shock'
  | 'post_news_whipsaw'
  | 'year_end_thin_liquidity';

export interface EURJPYPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * EURJPY presets are tuned around:
 * - ECB / BOJ rate divergence
 * - BOJ surprise tightening or hawkish messaging
 * - yen intervention risk
 * - carry-trade unwind
 * - safe-haven risk-off flows
 * - London/Tokyo session behavior
 */
export const EURJPY_PRESETS: Record<EURJPYPresetName, EURJPYPresetProfile> = {
  ecb_boj_policy_divergence: {
    label: 'ECB vs BOJ Policy Divergence',
    description:
      'Directional trend from persistent euro-yen yield differential and policy divergence.',
    params: {
      drift: 0.00012,
      volatility: 0.0019,
      seed: 1201,
      wick_factor: 0.34,
      high_low_noise: 0.0007,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.08,
      basePrice: 170,
    },
  },

  boj_hawkish_surprise: {
    label: 'BOJ Hawkish Surprise',
    description:
      'Sharp yen-strengthening shock when BOJ signals faster tightening or reduces accommodation.',
    params: {
      drift: 0.00003,
      volatility: 0.0038,
      seed: 2202,
      wick_factor: 0.66,
      high_low_noise: 0.0020,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.22,
      basePrice: 170,
    },
  },

  yen_intervention_spike: {
    label: 'Yen Intervention Spike',
    description:
      'Fast abrupt repricing during suspected or actual Japanese FX intervention risk windows.',
    params: {
      drift: 0.00002,
      volatility: 0.0044,
      seed: 3303,
      wick_factor: 0.74,
      high_low_noise: 0.0025,
      side_ways_switch_prob: 0.02,
      trend_switch_prob: 0.26,
      basePrice: 170,
    },
  },

  carry_trade_unwind: {
    label: 'Carry Trade Unwind',
    description:
      'Risk-off deleveraging as yen shorts get covered and high-yield carry positions are reduced.',
    params: {
      drift: 0.00003,
      volatility: 0.0041,
      seed: 4404,
      wick_factor: 0.69,
      high_low_noise: 0.0021,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.24,
      basePrice: 170,
    },
  },

  risk_off_safe_haven_rally: {
    label: 'Risk Off Safe Haven Rally',
    description:
      'Yen-strengthening move driven by global fear, equity weakness, or geopolitical stress.',
    params: {
      drift: 0.00004,
      volatility: 0.0032,
      seed: 5505,
      wick_factor: 0.58,
      high_low_noise: 0.0016,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.18,
      basePrice: 170,
    },
  },

  london_open_breakout: {
    label: 'London Open Breakout',
    description:
      'European session impulse with liquidity expansion and momentum continuation.',
    params: {
      drift: 0.00010,
      volatility: 0.0024,
      seed: 6606,
      wick_factor: 0.41,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.11,
      basePrice: 170,
    },
  },

  tokyo_sideways_consolidation: {
    label: 'Tokyo Sideways Consolidation',
    description:
      'Quieter Asia-session behavior with compressed ranges, low conviction, and frequent chop.',
    params: {
      drift: 0.00002,
      volatility: 0.00085,
      seed: 7707,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.48,
      trend_switch_prob: 0.03,
      basePrice: 170,
    },
  },

  eurozone_inflation_shock: {
    label: 'Eurozone Inflation Shock',
    description:
      'Euro-strength repricing after strong eurozone inflation or hawkish ECB expectations.',
    params: {
      drift: 0.00014,
      volatility: 0.0022,
      seed: 8808,
      wick_factor: 0.37,
      high_low_noise: 0.0009,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.09,
      basePrice: 170,
    },
  },

  post_news_whipsaw: {
    label: 'Post News Whipsaw',
    description:
      'Fast reversals after BOJ or ECB data, with expansion then fade behavior.',
    params: {
      drift: 0.00002,
      volatility: 0.0030,
      seed: 9909,
      wick_factor: 0.62,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.12,
      trend_switch_prob: 0.22,
      basePrice: 170,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description:
      'Late-year low liquidity and exaggerated price excursions in both directions.',
    params: {
      drift: 0.00003,
      volatility: 0.0020,
      seed: 1010,
      wick_factor: 0.45,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.16,
      trend_switch_prob: 0.07,
      basePrice: 170,
    },
  },
};

export function getEURJPYPreset(
  preset: EURJPYPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...EURJPY_PRESETS[preset].params,
    ...overrides,
  };
}

export function listEURJPYPresetNames(): EURJPYPresetName[] {
  return Object.keys(EURJPY_PRESETS) as EURJPYPresetName[];
}
