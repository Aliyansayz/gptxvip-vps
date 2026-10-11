import { OHLCSimulationParams } from './simulationDataOhlcParameter';


export type EURCADPresetName =
  | 'ecb_hawkish_reprice'
  | 'boc_hawkish_reprice'
  | 'oil_spillover_cad_strength'
  | 'eurozone_inflation_shock'
  | 'canada_growth_labor_shock'
  | 'london_open_breakout'
  | 'risk_off_eur_bid'
  | 'cross_bank_divergence'
  | 'undecided_sideways'
  | 'post_policy_whipsaw'
  | 'year_end_thin_liquidity';

export interface EURCADPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const EURCAD_PRESETS: Record<EURCADPresetName, EURCADPresetProfile> = {
  ecb_hawkish_reprice: {
    label: 'ECB Hawkish Reprice',
    description: 'ECB surprise tightening / hawkish guidance. EUR strength and fast cross repricing.',
    params: {
      drift: 0.00006,
      volatility: 0.0026,
      seed: 1101,
      wick_factor: 0.46,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.15,
      basePrice: 1.48,
    },
  },

  boc_hawkish_reprice: {
    label: 'BoC Hawkish Reprice',
    description: 'BoC surprise tightening / hawkish hold. CAD strengthens and cross can sell off sharply.',
    params: {
      drift: 0.00005,
      volatility: 0.0027,
      seed: 2202,
      wick_factor: 0.48,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.16,
      basePrice: 1.48,
    },
  },

  oil_spillover_cad_strength: {
    label: 'Oil Spillover CAD Strength',
    description: 'Crude-led CAD bid. Useful when energy prices lift Canada terms-of-trade and CAD gains traction.',
    params: {
      drift: 0.00004,
      volatility: 0.0021,
      seed: 3303,
      wick_factor: 0.36,
      high_low_noise: 0.0009,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.10,
      basePrice: 1.48,
    },
  },

  eurozone_inflation_shock: {
    label: 'Eurozone Inflation Shock',
    description: 'Euro CPI / inflation surprise. EUR leg reprices first; cross often shows sharp directional impulse.',
    params: {
      drift: 0.00005,
      volatility: 0.0024,
      seed: 4404,
      wick_factor: 0.50,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.14,
      basePrice: 1.48,
    },
  },

  canada_growth_labor_shock: {
    label: 'Canada Growth / Labor Shock',
    description: 'Canadian GDP / jobs surprise. CAD reacts through rate expectations and growth sensitivity.',
    params: {
      drift: 0.00004,
      volatility: 0.0023,
      seed: 5505,
      wick_factor: 0.44,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.13,
      basePrice: 1.48,
    },
  },

  london_open_breakout: {
    label: 'London Open Breakout',
    description: 'Europe session liquidity burst. Early directional expansion and intraday trend initiation.',
    params: {
      drift: 0.00003,
      volatility: 0.0020,
      seed: 6606,
      wick_factor: 0.34,
      high_low_noise: 0.0008,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.11,
      basePrice: 1.48,
    },
  },

  risk_off_eur_bid: {
    label: 'Risk Off EUR Bid',
    description: 'Risk-off demand supports EUR relative to CAD when oil softens and global sentiment turns defensive.',
    params: {
      drift: 0.00005,
      volatility: 0.0022,
      seed: 7707,
      wick_factor: 0.40,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 1.48,
    },
  },

  cross_bank_divergence: {
    label: 'Cross Bank Divergence',
    description: 'Policy divergence between ECB and BoC. Strong multi-day trend with occasional sharp retraces.',
    params: {
      drift: 0.00007,
      volatility: 0.0025,
      seed: 8808,
      wick_factor: 0.52,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.17,
      basePrice: 1.48,
    },
  },

  undecided_sideways: {
    label: 'Undecided Sideways',
    description: 'Balanced market with no clear policy or commodity edge. Low conviction and compressed range.',
    params: {
      drift: 0.00001,
      volatility: 0.00075,
      seed: 9909,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.52,
      trend_switch_prob: 0.03,
      basePrice: 1.48,
    },
  },

  post_policy_whipsaw: {
    label: 'Post Policy Whipsaw',
    description: 'After ECB/BoC decisions. Fast direction flips, stop runs, and momentum exhaustion.',
    params: {
      drift: 0.00002,
      volatility: 0.0032,
      seed: 1010,
      wick_factor: 0.58,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.10,
      trend_switch_prob: 0.24,
      basePrice: 1.48,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description: 'Late-year / holiday liquidity drain. Wider candles and erratic spikes from reduced depth.',
    params: {
      drift: 0.00002,
      volatility: 0.0018,
      seed: 1112,
      wick_factor: 0.42,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.18,
      trend_switch_prob: 0.08,
      basePrice: 1.48,
    },
  },
};

export function getEURCADPreset(
  preset: EURCADPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...EURCAD_PRESETS[preset].params,
    ...overrides,
  };
}

export const EURCAD_PRESET_NAMES: EURCADPresetName[] = [
  'ecb_hawkish_reprice',
  'boc_hawkish_reprice',
  'oil_spillover_cad_strength',
  'eurozone_inflation_shock',
  'canada_growth_labor_shock',
  'london_open_breakout',
  'risk_off_eur_bid',
  'cross_bank_divergence',
  'undecided_sideways',
  'post_policy_whipsaw',
  'year_end_thin_liquidity',
];
