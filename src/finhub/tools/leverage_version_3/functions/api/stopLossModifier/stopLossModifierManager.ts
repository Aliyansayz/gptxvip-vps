import { StopLossModifierConfig } from './stopLossModifierConfig';
import { pipsToPrice, priceToPips } from '../middleware/pipsTranslation';

export interface StopLossEvalContext {
  initialStopLoss: number;
  currentStopLoss: number;
  entryPrice: number;
  latestPrice: number;
  proposedNewSL: number;
  direction: 'LONG' | 'SHORT';
  assetType: string;
  profitTrailActivated?: boolean;
}

export function evaluateStopLossModification(
  ctx: StopLossEvalContext,
  config?: StopLossModifierConfig
): number {
  if (!config) return ctx.proposedNewSL;

  const { initialStopLoss, currentStopLoss, entryPrice, latestPrice, proposedNewSL, direction, assetType } = ctx;
  const profitablePriceMove = direction === 'LONG' ? latestPrice - entryPrice : entryPrice - latestPrice;
  const profitPips = priceToPips(Math.max(0, profitablePriceMove), assetType, entryPrice);
  const betterStop = (current: number, candidate: number) => direction === 'LONG'
    ? Math.max(current, candidate)
    : Math.min(current, candidate);
  
  const initialSlDistance = Math.abs(entryPrice - initialStopLoss);
  
  // Calculate distance from initial SL in the correct direction
  const distance = direction === 'LONG' 
    ? (latestPrice - initialStopLoss)
    : (initialStopLoss - latestPrice);
    
  // latestRewardFactor is exactly 1.0 at entry, 2.0 at 1R profit, 0.0 at hit SL
  const latestRewardFactor = initialSlDistance === 0 ? 0 : (distance / initialSlDistance);

  const minimumTrailProfit = Number.isFinite(config.trailAfterProfitPips)
    ? Math.max(0, config.trailAfterProfitPips)
    : Infinity;
  let allowTrailing = !config.enableTrailAfterProfitPips || ctx.profitTrailActivated || profitPips + 1e-8 >= minimumTrailProfit;
  let finalSL = currentStopLoss;

  // Explicit reward-factor adjustment is one of the trail methods. The
  // independent pip profit lock below can still advance the stop when this
  // adjustment or the indicator trail is gated off.
  if (allowTrailing && config.isStopLossModification && latestRewardFactor >= config.lowerBoundTarget && latestRewardFactor <= config.upperBoundTarget) {
      const latestEntryDiff = Math.abs(latestPrice - entryPrice);
      const diff = latestEntryDiff * config.explicitAdjustFactor;
      finalSL = betterStop(finalSL, direction === 'LONG' ? entryPrice + diff : entryPrice - diff);
  } else {
    // Existing reward-factor and breakeven gates apply to the indicator trail.
    if (config.enableConditionalTrailingThreshold && latestRewardFactor > config.trailThresholdRewardFactor) {
      allowTrailing = false;
    }
    if (config.activateTrailAfterBreakeven && profitablePriceMove <= 0) allowTrailing = false;

    if (allowTrailing) {
      let candidate = proposedNewSL;
      if (config.trailTillBreakevenOnly) {
        candidate = direction === 'LONG' ? Math.min(candidate, entryPrice) : Math.max(candidate, entryPrice);
      }
      finalSL = betterStop(finalSL, candidate);
    }
  }

  const minimumLockProfit = Number.isFinite(config.profitLockTriggerPips)
    ? Math.max(0, config.profitLockTriggerPips)
    : Infinity;
  if (config.enableProfitPipsLock && profitablePriceMove > 0 && profitPips + 1e-8 >= minimumLockProfit) {
    const percent = Number.isFinite(config.profitLockPercent)
      ? Math.min(100, Math.max(0, config.profitLockPercent))
      : 0;
    const lockedPips = profitPips * percent / 100;
    const lockedPriceMove = pipsToPrice(lockedPips, assetType, entryPrice);
    const lockStop = direction === 'LONG' ? entryPrice + lockedPriceMove : entryPrice - lockedPriceMove;
    finalSL = betterStop(finalSL, lockStop);
  }
  return finalSL;
}
