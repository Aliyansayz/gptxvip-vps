import { Trade } from '../../../../types/trading';
import { Ohlc } from '../indicators/baseline';
import { TradingRulesConfig } from '../rules/tradingRules';
import { getDynamicVolatilityAtrMultiplier } from '../rules/trailingStopLossRules';
import { evaluateStopLossModification, StopLossEvalContext } from '../stopLossModifier/stopLossModifierManager';
import { evaluateTakeProfitModification, TakeProfitEvalContext } from '../takeProfitModifier/takeProfitModifierManager';
import { priceToPips } from './pipsTranslation';

export function updateTrailSL(
  trades: Trade[],
  currentIndex: number,
  data: Ohlc[],
  config: TradingRulesConfig,
  stops?: { lowerBand: number[]; upperBand: number[] },
  assetType: string = 'gold'
): Trade[] {
  if (currentIndex < 0) return trades;

  const currentCandle = data[currentIndex];
  const useAtrTrailing = config.useSmoothAtrStopLossTrailing && stops;
  const isModifierActive = !!config.stopLossModifier;

  if (!useAtrTrailing && !isModifierActive) {
    return trades;
  }

  let lowerBandVal = stops?.lowerBand[currentIndex];
  let upperBandVal = stops?.upperBand[currentIndex];

  // Adjust bands dynamically based on volatility regime if enabled
  if (useAtrTrailing && config.useVolatilityRegimeSlTrailing && lowerBandVal !== undefined && upperBandVal !== undefined) {
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
      // fallback
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
    
    if (trade.stopLoss === undefined || trade.initialStopLoss === undefined) {
      return trade;
    }

    let proposedNewSL = trade.stopLoss;

    if (useAtrTrailing && lowerBandVal !== undefined && upperBandVal !== undefined && !isNaN(lowerBandVal) && !isNaN(upperBandVal)) {
      if (trade.side === 'LONG') {
        if (lowerBandVal > proposedNewSL) {
          proposedNewSL = lowerBandVal;
        }
      } else if (trade.side === 'SHORT') {
        if (upperBandVal < proposedNewSL) {
          proposedNewSL = upperBandVal;
        }
      }
    }

    const profitMove = trade.side === 'LONG'
      ? currentCandle.close - trade.entryPrice
      : trade.entryPrice - currentCandle.close;
    const trigger = config.stopLossModifier?.trailAfterProfitPips;
    const profitTrailActivated = !!trade.profitTrailActivated || !!(
      config.stopLossModifier?.enableTrailAfterProfitPips &&
      typeof trigger === 'number' && Number.isFinite(trigger) &&
      priceToPips(Math.max(0, profitMove), assetType, trade.entryPrice) + 1e-8 >= Math.max(0, trigger)
    );

    const ctx: StopLossEvalContext = {
      initialStopLoss: trade.initialStopLoss,
      currentStopLoss: trade.stopLoss,
      entryPrice: trade.entryPrice,
      latestPrice: currentCandle.close,
      proposedNewSL,
      direction: trade.side,
      assetType,
      profitTrailActivated
    };

    const finalSL = evaluateStopLossModification(ctx, config.stopLossModifier);

    let finalTP = trade.takeProfit;
    if (trade.takeProfit !== undefined && trade.initialTakeProfit !== undefined) {
      const tpCtx: TakeProfitEvalContext = {
        initialStopLoss: trade.initialStopLoss,
        currentStopLoss: trade.stopLoss,
        initialTakeProfit: trade.initialTakeProfit,
        currentTakeProfit: trade.takeProfit,
        entryPrice: trade.entryPrice,
        latestPrice: currentCandle.close,
        direction: trade.side
      };
      finalTP = evaluateTakeProfitModification(tpCtx, config.takeProfitModifier);
    }

    if (finalSL !== trade.stopLoss || finalTP !== trade.takeProfit || profitTrailActivated !== !!trade.profitTrailActivated) {
      hasChanges = true;
      let info = trade.infoStatus || '';
      if (finalSL !== trade.stopLoss) {
        info = info ? `${info} | SL Trailed to ${finalSL.toFixed(2)}` : `SL Trailed to ${finalSL.toFixed(2)}`;
      }
      if (finalTP !== trade.takeProfit && finalTP !== undefined) {
        info = info ? `${info} | TP Mod to ${finalTP.toFixed(2)}` : `TP Mod to ${finalTP.toFixed(2)}`;
      }
      
      return {
        ...trade,
        stopLoss: finalSL,
        takeProfit: finalTP,
        profitTrailActivated,
        trailCount: (trade.trailCount || 0) + (finalSL !== trade.stopLoss || finalTP !== trade.takeProfit ? 1 : 0),
        lastTrailIndex: finalSL !== trade.stopLoss || finalTP !== trade.takeProfit ? currentIndex : trade.lastTrailIndex,
        infoStatus: info
      };
    }

    return trade;
  });

  return hasChanges ? newTrades : trades;
}
