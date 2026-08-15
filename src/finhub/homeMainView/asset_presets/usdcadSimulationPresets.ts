import { OHLCSimulationParams } from './types';

export type USDCADPresetName =
  | 'fed_rate_shock'
  | 'boc_rate_shock'
  | 'oil_inventory_shock'
  | 'us_cpi_nfp_shock'
  | 'canada_trade_surplus_strength'
  | 'risk_off_usd_bid'
  | 'ny_open_breakout'
  | 'undecided_sideways'
  | 'post_news_mean_reversion'
  | 'year_end_thin_liquidity'
  | 'fed_boc_divergence';

export interface USDCADPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const USDCAD_PRESETS: Record<USDCADPresetName, USDCADPresetProfile> = {
  fed_rate_shock: {
    label: 'Fed Rate Shock',
    description: 'Fed repricing, U.S. yields jump, USD side dominates the pair.',
    params: {
      drift: 0.00005,
      volatility: 0.0038,
      seed: 2101,
      wick_factor: 0.62,
      high_low_noise: 0.0019,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.20,
      basePrice: 1.36,
    },
  },

  boc_rate_shock: {
    label: 'BoC Rate Shock',
    description: 'BoC surprise or hawkish hold. CAD reprices hard, especially when oil is supportive.',
    params: {
      drift: 0.00004,
      volatility: 0.0032,
      seed: 2202,
      wick_factor: 0.58,
      high_low_noise: 0.0016,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.18,
      basePrice: 1.36,
    },
  },

  oil_inventory_shock: {
    label: 'Oil Inventory Shock',
    description: 'EIA-style crude surprise / energy swing. CAD reacts through its oil sensitivity.',
    params: {
      drift: 0.00004,
      volatility: 0.0034,
      seed: 3303,
      wick_factor: 0.64,
      high_low_noise: 0.0020,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.19,
      basePrice: 1.36,
    },
  },

  us_cpi_nfp_shock: {
    label: 'U.S. CPI / NFP Shock',
    description: 'Inflation or jobs data surprise. USD impulse with follow-through or second-wave repricing.',
    params: {
      drift: 0.00005,
      volatility: 0.0037,
      seed: 4404,
      wick_factor: 0.60,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.20,
      basePrice: 1.36,
    },
  },

  canada_trade_surplus_strength: {
    label: 'Canada Trade Surplus Strength',
    description: 'Stronger Canadian trade balance and crude export support CAD and pressure USDCAD lower.',
    params: {
      drift: 0.00003,
      volatility: 0.0022,
      seed: 5505,
      wick_factor: 0.40,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.11,
      basePrice: 1.36,
    },
  },

  risk_off_usd_bid: {
    label: 'Risk Off USD Bid',
    description: 'Risk-off flow drives safe-haven USD demand. Often a clean trend with intermittent squeezes.',
    params: {
      drift: 0.00005,
      volatility: 0.0030,
      seed: 6606,
      wick_factor: 0.48,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.15,
      basePrice: 1.36,
    },
  },

  ny_open_breakout: {
    label: 'New York Open Breakout',
    description: 'U.S. session open. First-hour liquidity expansion and strong USD/CAD direction discovery.',
    params: {
      drift: 0.00006,
      volatility: 0.0028,
      seed: 7707,
      wick_factor: 0.42,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 1.36,
    },
  },

  undecided_sideways: {
    label: 'Undecided Sideways',
    description: 'Low-conviction balance where oil, rates, and USD forces are temporarily offset.',
    params: {
      drift: 0.00001,
      volatility: 0.00080,
      seed: 8808,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.50,
      trend_switch_prob: 0.03,
      basePrice: 1.36,
    },
  },

  post_news_mean_reversion: {
    label: 'Post News Mean Reversion',
    description: 'After a macro or oil shock, price digests and pulls back toward a balanced range.',
    params: {
      drift: 0.00001,
      volatility: 0.0014,
      seed: 9909,
      wick_factor: 0.28,
      high_low_noise: 0.00045,
      side_ways_switch_prob: 0.20,
      trend_switch_prob: 0.05,
      basePrice: 1.36,
    },
  },

  year_end_thin_liquidity: {
    label: 'Year End Thin Liquidity',
    description: 'Holiday season with thinner depth and more exaggerated moves from modest order flow.',
    params: {
      drift: 0.00002,
      volatility: 0.0019,
      seed: 1010,
      wick_factor: 0.44,
      high_low_noise: 0.0010,
      side_ways_switch_prob: 0.18,
      trend_switch_prob: 0.08,
      basePrice: 1.36,
    },
  },

  fed_boc_divergence: {
    label: 'Fed / BoC Divergence',
    description: 'Policy divergence between the Fed and the Bank of Canada. Strong trend persistence.',
    params: {
      drift: 0.00006,
      volatility: 0.0031,
      seed: 1112,
      wick_factor: 0.50,
      high_low_noise: 0.0014,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.16,
      basePrice: 1.36,
    },
  },
};

export function getUSDCADPreset(
  preset: USDCADPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...USDCAD_PRESETS[preset].params,
    ...overrides,
  };
}

export const USDCAD_PRESET_NAMES: USDCADPresetName[] = [
  'fed_rate_shock',
  'boc_rate_shock',
  'oil_inventory_shock',
  'us_cpi_nfp_shock',
  'canada_trade_surplus_strength',
  'risk_off_usd_bid',
  'ny_open_breakout',
  'undecided_sideways',
  'post_news_mean_reversion',
  'year_end_thin_liquidity',
  'fed_boc_divergence',
];
