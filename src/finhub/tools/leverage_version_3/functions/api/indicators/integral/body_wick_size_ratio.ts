import { Ohlc } from '../baseline';

export function calculateBodyWickRatio(data: Ohlc[]): number[] {
    return data.map(d => {
        const body = Math.abs(d.close - d.open);
        const upperWick = d.high - Math.max(d.close, d.open);
        const lowerWick = Math.min(d.close, d.open) - d.low;
        const totalWick = upperWick + lowerWick;
        if (totalWick === 0) return 0; // avoid division by zero
        return Number((body / totalWick).toFixed(4));
    });
}
