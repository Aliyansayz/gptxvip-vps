import { Trade } from '../../../../types/trading';
import { calculatePnL } from '../position_sizing/leveragedPositionSizeMetals';

export function evaluateAccountFloatingValue(
  trades: Trade[],
  currentPrice: number,
  leverageEnabled: boolean,
  asset?: string
): number {
  let floatingPnL = 0;
  
  const openTrades = trades.filter(t => t.status === 'OPEN');
  
  openTrades.forEach(trade => {
    const priceDiff = trade.side === 'LONG' ? currentPrice - trade.entryPrice : trade.entryPrice - currentPrice;
    
    if (leverageEnabled) {
      floatingPnL += calculatePnL(trade.entryPrice, currentPrice, trade.size || 1, trade.side, asset);
    } else {
      floatingPnL += priceDiff;
    }
  });

  return floatingPnL;
}
