// simulationDataOhlcParameter.ts

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

export const DEFAULT_OHLC_PARAMS: Record<string, OHLCSimulationParams> = {
  'Gold': {
    drift: 0.0001,
    volatility: 0.0012,
    seed: 42,
    wick_factor: 0.3,
    high_low_noise: 0.0004,
    side_ways_switch_prob: 0.15,
    trend_switch_prob: 0.10,
    basePrice: 4600
  },
  'Silver': {
    drift: 0.00008,
    volatility: 0.002,
    seed: 123,
    wick_factor: 0.25,
    high_low_noise: 0.0006,
    side_ways_switch_prob: 0.20,
    trend_switch_prob: 0.15,
    basePrice: 75
  },
  'Oil': {
    drift: 0.00012,
    volatility: 0.0025,
    seed: 99,
    wick_factor: 0.35,
    high_low_noise: 0.0008,
    side_ways_switch_prob: 0.12,
    trend_switch_prob: 0.08,
    basePrice: 85
  },
  'Nasdaq100': {
    drift: 0.00015,
    volatility: 0.001,
    seed: 7,
    wick_factor: 0.2,
    high_low_noise: 0.0003,
    side_ways_switch_prob: 0.10,
    trend_switch_prob: 0.05,
    basePrice: 20000
  },
  'Anonymous': {
    drift: 0.00012,
    volatility: 0.0015,
    seed: 888,
    wick_factor: 0.3,
    high_low_noise: 0.0005,
    side_ways_switch_prob: 0.15,
    trend_switch_prob: 0.10,
    basePrice: 42000
  }
};

class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;
    }

    // Normal random using Box-Muller
    normal(): number {
        let u = 0;
        let v = 0;

        while (u === 0) u = this.next();
        while (v === 0) v = this.next();

        return Math.sqrt(-2.0 * Math.log(u)) *
               Math.cos(2.0 * Math.PI * v);
    }
}

export function generateOHLC(
    startPrice: number,
    length: number,
    params: OHLCSimulationParams,
    stepMs: number = 5000
): Candle[] {

    const {
        drift,
        volatility,
        seed,
        wick_factor = 0.3,
        high_low_noise,
        side_ways_switch_prob,
        trend_switch_prob
    } = params;

    const rng = new SeededRandom(seed);
    const candles: Candle[] = [];

    let prevClose = startPrice;
    let regime: Regime = 'bull';
    const startTime = Date.now() - length * stepMs;

    for (let i = 0; i < length; i++) {

        // =========================
        // Regime Switching
        // =========================
        const r = rng.next();

        if (regime === 'sideways') {
            if (r < trend_switch_prob) {
                regime = rng.next() < 0.5 ? 'bull' : 'bear';
            }
        } else {
            if (r < side_ways_switch_prob) {
                regime = 'sideways';
            } else if (r < side_ways_switch_prob + trend_switch_prob) {
                regime = regime === 'bull' ? 'bear' : 'bull';
            }
        }

        // =========================
        // Drift by Regime
        // =========================
        let regimeDrift = 0;

        if (regime === 'bull') {
            regimeDrift = Math.abs(drift);
        } else if (regime === 'bear') {
            regimeDrift = -Math.abs(drift);
        } else {
            regimeDrift = 0;
        }

        // =========================
        // Price Movement
        // =========================
        const move =
            prevClose *
            (regimeDrift + volatility * rng.normal());

        const open = prevClose;
        const close = Math.max(0.0001, open + move);

        // =========================
        // Wick / High-Low
        // =========================
        const body = Math.abs(close - open);

        const wickNoise =
            Math.abs(rng.normal()) * high_low_noise * open;

        const wick =
            body * wick_factor + wickNoise;

        const high =
            Math.max(open, close) + wick;

        const low =
            Math.max(
                0.0001,
                Math.min(open, close) - wick
            );

        candles.push({
            time: startTime + i * stepMs,
            open,
            high,
            low,
            close,
            volume: Math.floor(rng.next() * 100),
            regime
        });

        prevClose = close;
    }

    return candles;
}
