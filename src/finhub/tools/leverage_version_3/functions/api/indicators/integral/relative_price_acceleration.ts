import { Ohlc } from '../baseline';

export function calculateRelativePriceAcceleration(data: Ohlc[], period: number = 15): number[] {
    const n = data.length;
    const accel = new Array(n).fill(0);
    
    // Relative Price Acceleration: difference in momentum over 1 period
    // Momentum[i] = Close[i] - Close[i - period]
    for (let i = period + 1; i < n; i++) {
        const velToday = data[i].close - data[i - period].close;
        const velYesterday = data[i - 1].close - data[i - 1 - period].close;
        const acceleration = velToday - velYesterday;
        accel[i] = Number((acceleration / data[i - period].close * 100).toFixed(4));
    }
    return accel;
}
