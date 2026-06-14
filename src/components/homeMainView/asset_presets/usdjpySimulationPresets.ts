// usdjpySimulationPresets.ts

import { OHLCSimulationParams } from './types';

export type USDJPYPresetName =
  | 'fed_rate_decision'
  | 'boj_rate_decision'
  | 'us_cpi_shock'
  | 'nfp_release_shock'
  | 'yield_curve_repricing'
  | 'yen_intervention_risk'
  | 'carry_trade_expansion'
  | 'carry_trade_unwind'
  | 'tokyo_session_consolidation'
  | 'tokyo_fix_flow'
  | 'new_york_breakout'
  | 'year_end_repatriation'
  | 'post_news_mean_reversion';

export interface USDJPYPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * USDJPY presets are tuned around the most recurring macro forces:
 * - Fed policy repricing
 * - BOJ policy repricing
 * - US CPI / NFP shocks
 * - US-Japan yield spread repricing
 * - intervention risk from extreme yen weakness / strength
 * - carry trade expansion / unwind
 * - Tokyo session compression
 * - New York session impulse
 * - year-end repatriation flows
 *
 * The Federal Reserve maintains a published FOMC meeting calendar, and BLS
 * publishes monthly CPI and Employment Situation release schedules at 08:30 AM.
 * Reuters reporting in June 2026 highlighted renewed BOJ tightening focus and
 * the market sensitivity of USDJPY to policy and intervention risk.
 */
export const USDJPY_PRESETS: Record<USDJPYPresetName, USDJPYPresetProfile> = {
  fed_rate_decision: {
    label: 'Fed Rate Decision',
    description:
      'Strong USD repricing from FOMC policy changes, dot-plot shifts, and Treasury yield reactions.',
    params: {
      drift: 0.00003,
      volatility: 0.0048,
      seed: 1101,
      wick_factor: 0.70,
      high_low_noise: 0.0023,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.24,
      basePrice: 155,
    },
  },

  boj_rate_decision: {
    label: 'BOJ Rate Decision',
    description:
      'Yen policy shock with very sharp repricing, especially when BOJ guidance shifts on normalization.',
    params: {
      drift: 0.00002,
      volatility: 0.0046,
      seed: 2202,
      wick_factor: 0.76,
      high_low_noise: 0.0025,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.26,
      basePrice: 155,
    },
  },

  us_cpi_shock: {
    label: 'US CPI Shock',
    description:
      'Inflation surprise event that rapidly changes Fed expectations and US-Japan rate spread assumptions.',
    params: {
      drift: 0.00002,
      volatility: 0.0043,
      seed: 3303,
      wick_factor: 0.66,
      high_low_noise: 0.0021,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.22,
      basePrice: 155,
    },
  },

  nfp_release_shock: {
    label: 'NFP Release Shock',
    description:
      'Employment surprise causing fast USD repricing, usually with a second reaction wave.',
    params: {
      drift: 0.00002,
      volatility: 0.0040,
      seed: 4404,
      wick_factor: 0.62,
      high_low_noise: 0.0019,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.20,
      basePrice: 155,
    },
  },

  yield_curve_repricing: {
    label: 'Yield Curve Repricing',
    description:
      'USDJPY moves on Treasury yields and spread repricing rather than pure news spikes.',
    params: {
      drift: 0.00008,
      volatility: 0.0032,
      seed: 5505,
      wick_factor: 0.42,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.15,
      basePrice: 155,
    },
  },

  yen_intervention_risk: {
    label: 'Yen Intervention Risk',
    description:
      'Extreme yen weakness or strength where official intervention fears increase wick size and reversal risk.',
    params: {
      drift: 0.00001,
      volatility: 0.0060,
      seed: 6606,
      wick_factor: 0.90,
      high_low_noise: 0.0030,
      side_ways_switch_prob: 0.02,
      trend_switch_prob: 0.35,
      basePrice: 155,
    },
  },

  carry_trade_expansion: {
    label: 'Carry Trade Expansion',
    description:
      'Risk-on regime where high US yields and calm markets favor persistent USDJPY upside.',
    params: {
      drift: 0.00020,
      volatility: 0.0020,
      seed: 7707,
      wick_factor: 0.25,
      high_low_noise: 0.0007,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.05,
      basePrice: 155,
    },
  },

  carry_trade_unwind: {
    label: 'Carry Trade Unwind',
    description:
      'Risk-off unwind with fast downside in USDJPY and elevated whipsaw probability.',
    params: {
      drift: 0.00004,
      volatility: 0.0052,
      seed: 8808,
      wick_factor: 0.80,
      high_low_noise: 0.0027,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.28,
      basePrice: 155,
    },
  },

  tokyo_session_consolidation: {
    label: 'Tokyo Session Consolidation',
    description:
      'Typical Asia-session compression with narrower range and higher sideways probability.',
    params: {
      drift: 0.00002,
      volatility: 0.0008,
      seed: 9909,
      wick_factor: 0.18,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.50,
      trend_switch_prob: 0.03,
      basePrice: 155,
    },
  },

  tokyo_fix_flow: {
    label: 'Tokyo Fix Flow',
    description:
      'Session flow around Tokyo fixing and institutional rebalancing, with moderate directed moves.',
    params: {
      drift: 0.00004,
      volatility: 0.0015,
      seed: 1010,
      wick_factor: 0.30,
      high_low_noise: 0.0006,
      side_ways_switch_prob: 0.15,
      trend_switch_prob: 0.08,
      basePrice: 155,
    },
  },

  new_york_breakout: {
    label: 'New York Breakout',
    description:
      'US session expansion with stronger impulse and continuation compared with Tokyo compression.',
    params: {
      drift: 0.00010,
      volatility: 0.0031,
      seed: 1111,
      wick_factor: 0.40,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 155,
    },
  },

  year_end_repatriation: {
    label: 'Year End Repatriation',
    description:
      'Year-end yen flows and reduced liquidity causing erratic but not always trending movement.',
    params: {
      drift: 0.00003,
      volatility: 0.0022,
      seed: 1212,
      wick_factor: 0.45,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.20,
      trend_switch_prob: 0.10,
      basePrice: 155,
    },
  },

  post_news_mean_reversion: {
    label: 'Post News Mean Reversion',
    description:
      'After the spike, price digests and reverts with fading volatility and mixed candles.',
    params: {
      drift: 0.00001,
      volatility: 0.0011,
      seed: 1313,
      wick_factor: 0.24,
      high_low_noise: 0.0004,
      side_ways_switch_prob: 0.25,
      trend_switch_prob: 0.05,
      basePrice: 155,
    },
  },
};

export function getUSDJPYPreset(
  preset: USDJPYPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...USDJPY_PRESETS[preset].params,
    ...overrides,
  };
}

export function listUSDJPYPresetNames(): USDJPYPresetName[] {
  return Object.keys(USDJPY_PRESETS) as USDJPYPresetName[];
}
