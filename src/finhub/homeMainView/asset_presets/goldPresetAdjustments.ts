import { OHLCSimulationParams } from './types';

export type GoldPresetName =
  | 'volatile_news_event'
  | 'year_end_time_volatility'
  | 'new_york_session_start_weekdays'
  | 'japan_session_behavior'
  | 'london_volatile_behavior'
  | 'sideway_behavior';

export interface GoldPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

export const GOLD_ONLY_PRESETS: Record<GoldPresetName, GoldPresetProfile> = {
  volatile_news_event: {
    label: 'Volatile News Event',
    description:
      'Aggressive spike behavior for recurring macro releases and surprise headlines. Largest volatility and wick expansion.',
    params: {
      drift: 0.00005,
      volatility: 0.0038,
      seed: 42,
      wick_factor: 0.55,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.14,
    },
  },

  year_end_time_volatility: {
    label: 'Year End Time Volatility',
    description:
      'Late-year behavior with thinner liquidity, wider candles, and more erratic intraday swings.',
    params: {
      drift: 0.00004,
      volatility: 0.0022,
      seed: 4242,
      wick_factor: 0.42,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.18,
      trend_switch_prob: 0.09,
    },
  },

  new_york_session_start_weekdays: {
    label: 'New York Session Start (Weekdays)',
    description:
      'Open-of-session acceleration with breakout-like movement and moderate trend continuation.',
    params: {
      drift: 0.00008,
      volatility: 0.0028,
      seed: 1001,
      wick_factor: 0.38,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.12,
    },
  },

  japan_session_behavior: {
    label: 'Japan Session Behavior',
    description:
      'Calmer Asia/Tokyo-session style consolidation with smaller bodies, smaller wicks, and stronger sideways tendency.',
    params: {
      drift: 0.00003,
      volatility: 0.0009,
      seed: 7001,
      wick_factor: 0.22,
      high_low_noise: 0.00035,
      side_ways_switch_prob: 0.28,
      trend_switch_prob: 0.04,
    },
  },

  london_volatile_behavior: {
    label: 'London Volatile Behavior',
    description:
      'High-liquidity London-style movement with fast candle expansion and frequent directional changes.',
    params: {
      drift: 0.00009,
      volatility: 0.0032,
      seed: 8001,
      wick_factor: 0.48,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.13,
    },
  },

  sideway_behavior: {
    label: 'Sideway Behavior',
    description:
      'Compression / consolidation regime with muted moves, frequent flat periods, and minimal trend follow-through.',
    params: {
      drift: 0.00002,
      volatility: 0.00065,
      seed: 9001,
      wick_factor: 0.18,
      high_low_noise: 0.00025,
      side_ways_switch_prob: 0.45,
      trend_switch_prob: 0.03,
    },
  },
};

export const GOLD_PRESET_NAMES: GoldPresetName[] = [
  'volatile_news_event',
  'year_end_time_volatility',
  'new_york_session_start_weekdays',
  'japan_session_behavior',
  'london_volatile_behavior',
  'sideway_behavior',
];
