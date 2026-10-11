import { diff, rollingStd, zeros } from './linearRegression';

// -----------------------------
// Volatility Regime
// -----------------------------
export function getVolatilityRegime(close: number[], period = 30) {
    const returns = diff(close);
    const vol = rollingStd(returns, period);

    const sorted = [...vol].sort((a, b) => a - b);
    const medianVol = sorted[Math.floor(sorted.length / 2)];

    const regime = vol.map(v => (v > medianVol ? 1 : 0));

    return { regime, vol };
}

// -----------------------------
// Scenario Based Trend Decay State
// -----------------------------
export function trendDecayState(
    z: number[],
    volRegime: number[],
    upper = 1.5,
    lower = -1.5
): number[] {

    const n = z.length;
    const dz = zeros(n);

    for (let i = 1; i < n; i++) {
        dz[i] = z[i] - z[i - 1];
    }

    const decayState = zeros(n);

    for (let i = 2; i < n; i++) {

        if (Math.abs(z[i]) < upper && volRegime[i] === 1) {
            decayState[i] = 0;
        }

        else if (Math.abs(z[i]) > upper && volRegime[i] === 0) {

            if (dz[i] < 0) {
                decayState[i] = 3;
            } else {
                decayState[i] = 2;
            }
        }

        else if (Math.abs(z[i]) > upper && volRegime[i] === 1) {

            if (dz[i] < 0) {
                decayState[i] = 2;
            } else {
                decayState[i] = 1;
            }
        }

        else {
            decayState[i] = 0;
        }
    }

    return decayState;
}
