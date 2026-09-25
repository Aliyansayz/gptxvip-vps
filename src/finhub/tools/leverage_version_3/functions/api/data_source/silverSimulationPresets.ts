// silverSimulationPresets.ts

import { OHLCSimulationParams } from './simulationDataOhlcParameter';

export type SilverPresetName =
  | 'fed_dollar_shock'
  | 'industrial_demand_surge'
  | 'physical_investment_squeeze'
  | 'london_liquidity_squeeze'
  | 'new_york_open_breakout'
  | 'asia_sideways_consolidation'
  | 'post_news_whipsaw'
  | 'year_end_thin_liquidity'
  | 'solar_substitution_pressure';

export interface SilverPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * Silver presets are tuned around recurring market behavior seen in recent reporting:
 * - silver reacts strongly to Fed/dollar expectations and geopolitical uncertainty
 * - silver has a stronger industrial component than gold
 * - physical investment flows can tighten the market quickly
 * - solar/PV demand and substitution can shift volatility
 * - regional liquidity squeezes can amplify candle size
 * - U.S. open and London hours often produce stronger movement
 *
 * Recent reporting shows silver demand staying firm in 2026 because physical investment is
 * rising even while industrial use is forecast to soften slightly due to thrifting/substitution.
 * Reuters also noted that silver has been driven by gold strength, geopolitical risk, and
 * structural supply deficits. These dynamics make silver more volatile than gold and more
 * cyclical than a pure safe-haven metal.
 */
export const SILVER_PRESETS: Record<SilverPresetName, SilverPresetProfile> = {
  fed_dollar_shock: {
    label: 'Fed / Dollar Shock',
    description:
      'Rate-cut/rate-hike repricing, weak-dollar impulse, and fast precious-metal reaction. Strong trend bursts with large wicks.',
    params: {
      drift: 0.00010,
      volatility: 0.0036,
      seed: 5101,
      wick_factor: 0.58,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.16,
      basePrice: 32,
    },
  },

  industrial_demand_surge: {
    label: 'Industrial Demand Surge',
    description:
      'Electronics / EV / manufacturing-led buying with stronger continuation than a normal precious-metal session.',
    params: {
      drift: 0.00014,
      volatility: 0.0026,
      seed: 5202,
      wick_factor: 0.36,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.09,
      basePrice: 32,
    },
  },

  physical_investment_squeeze: {
    label: 'Physical Investment Squeeze',
    description:
      'Retail coin-bar demand, ETF inflows, and inventory tightness. Fast upside spikes and occasional sharp pullbacks.',
    params: {
      drift: 0.00012,
      volatility: 0.0039,
      seed: 5303,
      wick_factor: 0.62,
      high_low_noise: 0.0020,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.18,
      basePrice: 32,
    },
  },

  london_liquidity_squeeze: {
    label: 'London Liquidity Squeeze',
    description:
      'Silver squeeze / scarce liquidity / regional dislocation style behavior with high wick expansion and abrupt reversals.',
    params: {
      drift: 0.00008,
      volatility: 0.0042,
      seed: 5404,
      wick_factor: 0.70,
      high_low_noise: 0.0022,
      side_ways_switch_prob: 0.02,
      trend_switch_prob: 0.22,
      basePrice: 32,
    },
  },

  new_york_open_breakout: {
    label: 'New York Open Breakout',
    description:
      'Cash-market open flow and early U.S. session expansion. Useful for 09:30 ET momentum bursts and first-hour continuation.',
    params: {
      drift: 0.00009,
      volatility: 0.0030,
      seed: 5505,
      wick_factor: 0.44,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.11,
      basePrice: 32,
    },
  },

  asia_sideways_consolidation: {
    label: 'Asia Sideways Consolidation',
    description:
      'Quiet overnight / Asia-session behavior with compressed candles, low conviction, and frequent pause phases.',
    params: {
      drift: 0.00002,
      volatility: 0.00085,
      seed: 5606,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.52,
      trend_switch_prob: 0.03,
      basePrice: 32,
    },
  },

  post_news_whipsaw: {
    label: 'Post News Whipsaw',
    description:
      'After a macro or supply event, silver can flip direction quickly with big wicks and unstable follow-through.',
    params: {
      drift: 0.00003,
      volatility: 0.0034,
      seed: 5707,
      wick_factor: 0.66,
      high_low_noise: 0.0019,
      side_ways_switch_prob: 0.08,
      trend_switch_prob: 0.26,
      basePrice: 32,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description:
      'Holiday / year-end conditions with smaller order books, exaggerated spikes, and erratic range expansion.',
    params: {
      drift: 0.00004,
      volatility: 0.0023,
      seed: 5808,
      wick_factor: 0.50,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.16,
      trend_switch_prob: 0.10,
      basePrice: 32,
    },
  },

  solar_substitution_pressure: {
    label: 'Solar Substitution Pressure',
    description:
      'Demand-destruction regime from PV thrifting/copper substitution. Often softer trend, but still volatile when supply tightens.',
    params: {
      drift: -0.00003,
      volatility: 0.0021,
      seed: 5909,
      wick_factor: 0.38,
      high_low_noise: 0.00095,
      side_ways_switch_prob: 0.14,
      trend_switch_prob: 0.07,
      basePrice: 32,
    },
  },
};

export function getSilverPreset(
  preset: SilverPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...SILVER_PRESETS[preset].params,
    ...overrides,
  };
}

export function listSilverPresetNames(): SilverPresetName[] {
  return Object.keys(SILVER_PRESETS) as SilverPresetName[];
}
