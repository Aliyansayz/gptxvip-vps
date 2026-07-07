import { OHLCSimulationParams } from './simulationDataOhlcParameter';

export type OilPresetName =
  | 'opec_supply_cut_event'
  | 'eia_inventory_report'
  | 'range_bound_accumulation'
  | 'geopolitical_risk_premium'
  | 'demand_destruction_glut';

export interface OilPresetProfile {
  label: string;
  description: string;
  params: OHLCSimulationParams;
}

/**
 * Crude Oil (Energy Commodity) Presets
 *
 * Designed around recurring energy market volatility regimes:
 * - OPEC meeting supply cut surprises
 * - Weekly EIA inventory reports
 * - Range-bound supply/demand consolidation
 * - Geopolitical risk premiums
 * - Demand destruction or supply glut panic sell-offs
 */

export const OIL_PRESETS: Record<OilPresetName, OilPresetProfile> = {
  opec_supply_cut_event: {
    label: 'OPEC Supply Cut Decision',
    description:
      'Aggressive upside and supply-disruption spikes after heavy output cuts. Moderately high volatility and wick expansion.',
    params: {
      drift: 0.00018,
      volatility: 0.0035,
      seed: 501,
      wick_factor: 0.45,
      high_low_noise: 0.0012,
      side_ways_switch_prob: 0.05,
      trend_switch_prob: 0.15,
      basePrice: 85
    }
  },

  eia_inventory_report: {
    label: 'EIA Crude Inventory Release',
    description:
      'Symmetric volatility expanding immediately upon report release with heavy dual-sided wicks and frequent rapid reversals.',
    params: {
      drift: 0.00004,
      volatility: 0.0042,
      seed: 602,
      wick_factor: 0.58,
      high_low_noise: 0.0018,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.18,
      basePrice: 85
    }
  },

  range_bound_accumulation: {
    label: 'Range-Bound Accumulation',
    description:
      'Consolidated sideways regime reflecting tight supply-demand balance, low interest, and muted intraday swings.',
    params: {
      drift: 0.00001,
      volatility: 0.0008,
      seed: 703,
      wick_factor: 0.22,
      high_low_noise: 0.0003,
      side_ways_switch_prob: 0.42,
      trend_switch_prob: 0.04,
      basePrice: 85
    }
  },

  geopolitical_risk_premium: {
    label: 'Geopolitical Risk Premium Spike',
    description:
      'Severe supply disruption anxiety and risk premium expansion, establishing asymmetric high-wick bullish waves.',
    params: {
      drift: 0.00022,
      volatility: 0.0038,
      seed: 804,
      wick_factor: 0.52,
      high_low_noise: 0.0015,
      side_ways_switch_prob: 0.04,
      trend_switch_prob: 0.12,
      basePrice: 85
    }
  },

  demand_destruction_glut: {
    label: 'Demand Destruction & Over-supply Panic',
    description:
      'Rapid downward continuation and risk-off sentiment mirroring sudden oil glut rumors or macroeconomic contraction.',
    params: {
      drift: -0.0002,
      volatility: 0.0032,
      seed: 905,
      wick_factor: 0.4,
      high_low_noise: 0.0011,
      side_ways_switch_prob: 0.06,
      trend_switch_prob: 0.14,
      basePrice: 85
    }
  }
};

export function getOilPreset(
  preset: OilPresetName,
  overrides: Partial<OHLCSimulationParams> = {}
): OHLCSimulationParams {
  return {
    ...OIL_PRESETS[preset].params,
    ...overrides
  };
}

export const OIL_PRESET_NAMES: OilPresetName[] = [
  'opec_supply_cut_event',
  'eia_inventory_report',
  'range_bound_accumulation',
  'geopolitical_risk_premium',
  'demand_destruction_glut'
];
