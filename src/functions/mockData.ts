import { PriceData, OHLCData } from "../types";

export const generateMockData = (
  basePrice: number,
  volatility: number,
  length: number,
): PriceData[] => {
  const data: PriceData[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.48) * volatility; // Slight upward bias
    currentPrice += change;
    const time = new Date(now.getTime() + i * 60000);
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }
  return data;
};

export const generateCandlestickData = (
  startPrice: number,
  periods: number,
  volatilityMultiplier: number = 1.0
): OHLCData[] => {
  let currentPrice = startPrice;
  const data: OHLCData[] = [];

  for (let i = 0; i < periods; i++) {
    let volatility = 1.5 * volatilityMultiplier;
    let trend = 0.2 * volatilityMultiplier;

    if (i < 10)
      trend = -0.5 * volatilityMultiplier; // Initial dip towards SL
    else if (i < 40)
      trend = 1.2 * volatilityMultiplier; // Strong rally to hit TP1
    else if (i < 60)
      trend = -0.8 * volatilityMultiplier; // Pullback to test BE
    else trend = 0.5 * volatilityMultiplier; // Resume trend

    const open = currentPrice;
    const change = trend + (Math.random() - 0.5) * volatility * 2;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;

    data.push({ time: i, open, high, low, close });
    currentPrice = close;
  }

  return data;
};
