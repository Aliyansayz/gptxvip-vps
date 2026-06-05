import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { TradingRulesConfig } from '../rules/tradingRules';
import { getDynamicVolatilityAtrMultiplier } from '../rules/trailingStopLossRules';

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

  let lowerBandVal = stops.lowerBand[currentIndex];
  let upperBandVal = stops.upperBand[currentIndex];

  if (lowerBandVal === undefined || upperBandVal === undefined || isNaN(lowerBandVal) || isNaN(upperBandVal)) {
    return trades;
  }

  // Adjust bands dynamically based on volatility regime if enabled
  if (config.useVolatilityRegimeSlTrailing) {
    try {
      const closePrices = data.map(d => d.close);
      const dynamicMultiplier = getDynamicVolatilityAtrMultiplier(
        closePrices,
        currentIndex,
        3.0,
        config.volatilityRegimePeriod || 30
      );
      const factor = dynamicMultiplier / 3.0;

      const sma = (upperBandVal + lowerBandVal) / 2;
      const halfDiff = (upperBandVal - lowerBandVal) / 2;
      const dynamicOffset = halfDiff * factor;

      lowerBandVal = sma - dynamicOffset;
      upperBandVal = sma + dynamicOffset;
    } catch (e) {
      // fallback to original lowerBandVal and upperBandVal
    }
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
