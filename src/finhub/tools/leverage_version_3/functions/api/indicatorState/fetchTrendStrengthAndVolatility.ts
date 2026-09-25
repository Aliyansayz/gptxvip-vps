import { linearRegressionSystem } from '../indicators/trendStrength/trendStrength';

export function fetchTrendStrengthAndVolatility(alphaData: any[], config: any) {
    if (!alphaData || alphaData.length === 0) return { trendStrength: [], volatility: [] };
    
    const close = alphaData.map(d => d.close);
    const { trend_strength, volatility } = linearRegressionSystem(close);
    
    return { trendStrength: trend_strength, volatility };
}
