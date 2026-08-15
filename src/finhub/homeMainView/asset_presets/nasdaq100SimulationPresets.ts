import { OHLCSimulationParams } from './types';

export type NasdaqPresetName =
  | 'base_point_news_event'
  | 'quarter_earning_positive'
  | 'undecided_sideways'
  | 'new_york_open_breakout'
  | 'risk_off_panic'
  | 'tech_momentum_rally'
  | 'post_fomc_whipsaw';

export interface NasdaqPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const NASDAQ100_PRESETS: Record<NasdaqPresetName, NasdaqPresetProfile> = {
  base_point_news_event: {
    label: 'Base Point Increase/Decrease News Event',
    description:
      'Fed rate decision, CPI, inflation surprise, NFP or bond-yield shock.',
    params: {
      drift: 0.00002,
      volatility: 0.0045,
      seed: 1101,
      wick_factor: 0.60,
      high_low_noise: 0.0022,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.18,
      basePrice: 22000
    }
  },

  quarter_earning_positive: {
    label: 'Quarter Earning Positive',
    description:
      'Positive mega-cap tech earnings and guidance expansion.',
    params: {
      drift: 0.00018,
      volatility: 0.0024,
      seed: 2202,
      wick_factor: 0.34,
      high_low_noise: 0.0009,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.08,
      basePrice: 22000
    }
  },

  undecided_sideways: {
    label: 'Undecided Sideways',
    description:
      'Pre-event waiting, balanced sentiment, compressed range.',
    params: {
      drift: 0.00001,
      volatility: 0.00075,
      seed: 3303,
      wick_factor: 0.20,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.48,
      trend_switch_prob: 0.03,
      basePrice: 22000
    }
  },

  new_york_open_breakout: {
    label: 'New York Open Breakout',
    description:
      'Opening auction volatility and institutional order flow.',
    params: {
      drift: 0.00010,
      volatility: 0.0032,
      seed: 4404,
      wick_factor: 0.42,
      high_low_noise: 0.0013,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.12,
      basePrice: 22000
    }
  },

  risk_off_panic: {
    label: 'Risk Off Panic',
    description:
      'Fear regime, VIX expansion, aggressive sell pressure.',
    params: {
      drift: 0.00003,
      volatility: 0.0050,
      seed: 5505,
      wick_factor: 0.72,
      high_low_noise: 0.0028,
      side_ways_switch_prob: 0.02,
      trend_switch_prob: 0.22,
      basePrice: 22000
    }
  },

  tech_momentum_rally: {
    label: 'Tech Momentum Rally',
    description:
      'Strong growth sentiment and persistent tech-led continuation.',
    params: {
      drift: 0.00025,
      volatility: 0.0020,
      seed: 6606,
      wick_factor: 0.28,
      high_low_noise: 0.0007,
      side_ways_switch_prob: 0.03,
      trend_switch_prob: 0.06,
      basePrice: 22000
    }
  },

  post_fomc_whipsaw: {
    label: 'Post FOMC Whipsaw',
    description:
      'Fast direction flips after Powell/FOMC conference and repricing.',
    params: {
      drift: 0.00002,
      volatility: 0.0042,
      seed: 7707,
      wick_factor: 0.68,
      high_low_noise: 0.0021,
      side_ways_switch_prob: 0.10,
      trend_switch_prob: 0.30,
      basePrice: 22000
    }
  }
};

export const NASDAQ100_PRESET_NAMES: NasdaqPresetName[] = [
  'base_point_news_event',
  'quarter_earning_positive',
  'undecided_sideways',
  'new_york_open_breakout',
  'risk_off_panic',
  'tech_momentum_rally',
  'post_fomc_whipsaw'
];
