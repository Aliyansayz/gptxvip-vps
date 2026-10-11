// types.ts for asset presets

export type Regime = 'bull' | 'bear' | 'sideways';

export interface Candle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    regime: Regime;
}

export interface OHLCSimulationParams {
    drift: number;               // Trend strength (e.g. 0.0002)
    volatility: number;          // Price movement volatility (e.g. 0.0015)
    seed: number;                // Deterministic RNG seed
    wick_factor?: number;        // Wick size multiplier (default 0.3)
    high_low_noise: number;      // Extra wick randomness
    side_ways_switch_prob: number; // Chance to switch into sideways
    trend_switch_prob: number;     // Chance to switch trend direction
    basePrice?: number;          // Base initial price
}
