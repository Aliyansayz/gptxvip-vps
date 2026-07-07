import { Trade } from '../../../../types/trading';

export interface HFTTradeState {
  hasOpenHFTTrade: boolean;
  activeHFTTrades: Trade[];
  totalHFTSize: number;
  unrealizedHFTPnL: number;
  highestPipsAchieved: number;
  lowestPipsAchieved: number;
}

export function fetchHFTTradeState(
  activeTrades: Trade[],
  currentPrice: number,
  pipMultiplier: number = 1
): HFTTradeState {
  const hftTrades = activeTrades.filter((t) => t.status === 'OPEN' && t.tradeType === 'hft hedge trade');

  let totalSize = 0;
  let unrealizedPnL = 0;
  let highestPips = 0;
  let lowestPips = 0;

  hftTrades.forEach((trade) => {
    totalSize += trade.size || 0;

    let pips = 0;
    if (trade.side === 'LONG') {
      pips = (currentPrice - trade.entryPrice) / pipMultiplier;
    } else {
      pips = (trade.entryPrice - currentPrice) / pipMultiplier;
    }

    if (pips > highestPips) highestPips = pips;
    if (pips < lowestPips) lowestPips = pips;

    // Approximating un-leveraged PnL for HFT
    const riskDiff = trade.side === 'LONG' ? (currentPrice - trade.entryPrice) : (trade.entryPrice - currentPrice);
    unrealizedPnL += riskDiff; 
  });

  return {
    hasOpenHFTTrade: hftTrades.length > 0,
    activeHFTTrades: hftTrades,
    totalHFTSize: totalSize,
    unrealizedHFTPnL: unrealizedPnL,
    highestPipsAchieved: highestPips,
    lowestPipsAchieved: lowestPips,
  };
}
