import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { TradingRulesConfig } from '../rules/tradingRules';

export function updateTrailSL(
  trades: Trade[],
  currentIndex: number,
  data: Ohlc[],
  config: TradingRulesConfig,
  stops?: { lowerBand: number[]; upperBand: number[] }
): Trade[] {
  if (!config.useSmoothAtrStopLossTrailing || !stops || currentIndex < 0) {
    return trades;
  }

  const lowerBandVal = stops.lowerBand[currentIndex];
  const upperBandVal = stops.upperBand[currentIndex];

  if (lowerBandVal === undefined || upperBandVal === undefined || isNaN(lowerBandVal) || isNaN(upperBandVal)) {
    return trades;
  }

  let hasChanges = false;
  const newTrades = trades.map(trade => {
    if (trade.status !== 'OPEN') {
      return trade;
    }

    if (trade.tradeType === 'recurrent trade' && !config.trailRecurrentTradesWithAtr) {
      return trade;
    }

    let updatedSL = trade.stopLoss;

    if (trade.side === 'LONG') {
      if (updatedSL === undefined) {
        updatedSL = lowerBandVal;
      } else if (lowerBandVal > updatedSL) {
        updatedSL = lowerBandVal;
      }
    } else if (trade.side === 'SHORT') {
      if (updatedSL === undefined) {
        updatedSL = upperBandVal;
      } else if (upperBandVal < updatedSL) {
        updatedSL = upperBandVal;
      }
    }

    if (updatedSL !== trade.stopLoss) {
      hasChanges = true;
      return {
        ...trade,
        stopLoss: updatedSL,
        trailCount: (trade.trailCount || 0) + 1,
        lastTrailIndex: currentIndex,
        infoStatus: trade.infoStatus 
          ? `${trade.infoStatus} | SL Trailed to ${updatedSL.toFixed(2)}`
          : `SL Trailed to ${updatedSL.toFixed(2)}`
      };
    }

    return trade;
  });

  return hasChanges ? newTrades : trades;
}
