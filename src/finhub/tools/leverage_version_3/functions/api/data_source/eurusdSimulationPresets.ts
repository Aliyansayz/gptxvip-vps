// eurusdSimulationPresets.ts

import { OHLCSimulationParams } from './simulationDataOhlcParameter';

export type EurUsdPresetName =
  | 'ecb_rate_decision_shock'
  | 'fed_rate_decision_shock'
  | 'cpi_inflation_shock'
  | 'nfp_jobs_shock'
  | 'london_open_breakout'
  | 'london_new_york_overlap'
  | 'asia_range_consolidation'
  | 'risk_off_usd_strong'
  | 'risk_on_eur_bid'
  | 'year_end_thin_liquidity'
  | 'post_news_mean_reversion'
  | 'central_bank_whipsaw';

export interface EurUsdPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * EURUSD presets are built around recurring FX catalysts:
 * - ECB / Fed policy decisions and forward guidance
 * - CPI / inflation releases in the Eurozone and U.S.
 * - U.S. jobs data (NFP / Employment Situation)
 * - London session and London/New York overlap volatility
 * - Asia-session range compression
 * - Risk-on / risk-off dollar repricing
 * - Thin liquidity periods such as year-end
 *
 * EURUSD is one of the most liquid major FX pairs, and FX activity is especially strong
 * during the London/New York overlap and around major macro releases.
 */
export const EURUSD_PRESETS: Record<EurUsdPresetName, EurUsdPresetProfile> = {
  ecb_rate_decision_shock: {
    label: 'ECB Rate Decision Shock',
    description:
      'ECB surprise, policy repricing, and euro volatility around press conference language.',
    params: {
      drift: 0.00003,
      volatility: 0.0036,
      seed: 1201,
      wick_factor: 0.58,
      high_low_noise: 0.0017,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.18,
      basePrice: 1.085,
    },
  },

  fed_rate_decision_shock: {
    label: 'Fed Rate Decision Shock',
    description:
      'Dollar repricing around FOMC statement, dots, and Powell press conference.',
    params: {
      drift: 0.00003,
      volatility: 0.0039,
      seed: 2202,
      wick_factor: 0.60,
      high_low_noise: 0.0019,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.20,
      basePrice: 1.085,
    },
  },

  cpi_inflation_shock: {
    label: 'CPI Inflation Shock',
    description:
      'Eurozone or U.S. inflation surprise causing fast repricing in rate expectations.',
    params: {
      drift: 0.00002,
      volatility: 0.0034,
      seed: 3303,
      wick_factor: 0.56,
      high_low_noise: 0.0016,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.17,
      basePrice: 1.085,
    },
  },

  nfp_jobs_shock: {
    label: 'NFP Jobs Shock',
    description:
      'U.S. payrolls, unemployment, and wage surprise. Usually produces a sharp first move and follow-through.',
    params: {
      drift: 0.00002,
      volatility: 0.0033,
      seed: 4404,
      wick_factor: 0.55,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.16,
      basePrice: 1.085,
    },
  },

  london_open_breakout: {
    label: 'London Open Breakout',
    description:
      'European session opening momentum and initial direction discovery.',
    params: {
      drift: 0.00008,
      volatility: 0.0020,
      seed: 5505,
      wick_factor: 0.34,
      high_low_noise: 0.00085,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.10,
      basePrice: 1.085,
    },
  },

  london_new_york_overlap: {
    label: 'London / New York Overlap',
    description:
      'Highest-liquidity window with stronger volume, tighter spreads, and faster continuation.',
    params: {
      drift: 0.00010,
      volatility: 0.0025,
      seed: 6606,
      wick_factor: 0.40,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 1.085,
    },
  },

  asia_range_consolidation: {
    label: 'Asia Range Consolidation',
    description:
      'Tokyo-session style compression, often slower and more mean-reverting before Europe opens.',
    params: {
      drift: 0.00001,
      volatility: 0.00075,
      seed: 7707,
      wick_factor: 0.18,
      high_low_noise: 0.00022,
      side_ways_switch_prob: 0.50,
      trend_switch_prob: 0.03,
      basePrice: 1.085,
    },
  },

  risk_off_usd_strong: {
    label: 'Risk Off / Strong USD',
    description:
      'Dollar bid regime as traders seek safety. EURUSD tends to weaken with stronger USD demand.',
    params: {
      drift: 0.00005,
      volatility: 0.0028,
      seed: 8808,
      wick_factor: 0.48,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.14,
      basePrice: 1.085,
    },
  },

  risk_on_eur_bid: {
    label: 'Risk On / EUR Bid',
    description:
      'Risk appetite improves and the dollar softens, allowing EURUSD continuation to the upside.',
    params: {
      drift: 0.00011,
      volatility: 0.0021,
      seed: 9909,
      wick_factor: 0.32,
      high_low_noise: 0.00075,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.08,
      basePrice: 1.085,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year-End Thin Liquidity',
    description:
      'Late-year market with reduced participation, exaggerated spikes, and short-lived moves.',
    params: {
      drift: 0.00002,
      volatility: 0.0022,
      seed: 1010,
      wick_factor: 0.46,
      high_low_noise: 0.00125,
      side_ways_switch_prob: 0.20,
      trend_switch_prob: 0.08,
      basePrice: 1.085,
    },
  },

  post_news_mean_reversion: {
    label: 'Post-News Mean Reversion',
    description:
      'After a macro spike, EURUSD often digests and retraces part of the move.',
    params: {
      drift: 0.00001,
      volatility: 0.0010,
      seed: 1111,
      wick_factor: 0.24,
      high_low_noise: 0.00035,
      side_ways_switch_prob: 0.25,
      trend_switch_prob: 0.04,
      basePrice: 1.085,
    },
  },

  central_bank_whipsaw: {
    label: 'Central Bank Whipsaw',
    description:
      'Fast flips around ECB/Fed language changes, rate path speculation, and cross-market repricing.',
    params: {
      drift: 0.00002,
      volatility: 0.0038,
      seed: 1212,
      wick_factor: 0.62,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.26,
      basePrice: 1.085,
    },
  },
};

export function getEurUsdPreset(
  preset: EurUsdPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...EURUSD_PRESETS[preset].params,
    ...overrides,
  };
}

export function listEurUsdPresetNames(): EurUsdPresetName[] {
  return Object.keys(EURUSD_PRESETS) as EurUsdPresetName[];
}
