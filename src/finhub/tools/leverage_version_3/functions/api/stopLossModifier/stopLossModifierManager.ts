import { StopLossModifierConfig } from './stopLossModifierConfig';
import { Trade } from '../../../../types/trading';

export interface StopLossEvalContext {
  initialStopLoss: number;
  currentStopLoss: number;
  entryPrice: number;
  latestPrice: number;
  proposedNewSL: number;
  direction: 'LONG' | 'SHORT';
}

export function evaluateStopLossModification(
  ctx: StopLossEvalContext,
  config?: StopLossModifierConfig
): number {
  if (!config) return ctx.proposedNewSL;

  const { initialStopLoss, currentStopLoss, entryPrice, latestPrice, proposedNewSL, direction } = ctx;
  
  const initialSlDistance = Math.abs(entryPrice - initialStopLoss);
  
  // Calculate distance from initial SL in the correct direction
  const distance = direction === 'LONG' 
    ? (latestPrice - initialStopLoss)
    : (initialStopLoss - latestPrice);
    
  // latestRewardFactor is exactly 1.0 at entry, 2.0 at 1R profit, 0.0 at hit SL
  const latestRewardFactor = initialSlDistance === 0 ? 0 : (distance / initialSlDistance);

  // Feature 3: Explicit Stop Loss Modification
  if (config.isStopLossModification) {
    if (latestRewardFactor >= config.lowerBoundTarget && latestRewardFactor <= config.upperBoundTarget) {
      const latestEntryDiff = Math.abs(latestPrice - entryPrice);
      const diff = latestEntryDiff * config.explicitAdjustFactor;
      
      let explicitSL = currentStopLoss;
      if (direction === 'LONG') {
        explicitSL = entryPrice + diff;
        // Only move SL forward
        if (explicitSL > currentStopLoss) {
          return explicitSL;
        }
      } else {
        explicitSL = entryPrice - diff;
        if (explicitSL < currentStopLoss) {
          return explicitSL;
        }
      }
      return currentStopLoss; // if explicitSL isn't better, keep current
    }
  }

  // Feature 1 & 2 logic for standard trailing proposedNewSL
  let allowTrailing = true;
  let finalSL = proposedNewSL;

  // Feature 2: Conditional Trailing Threshold
  if (config.enableConditionalTrailingThreshold) {
    if (latestRewardFactor > config.trailThresholdRewardFactor) {
      allowTrailing = false;
    }
  }

  // Option 1: Activate the stop loss trail after latest price crosses breakeven
  if (config.activateTrailAfterBreakeven) {
    if (direction === 'LONG' && latestPrice <= entryPrice) {
      allowTrailing = false;
    } else if (direction === 'SHORT' && latestPrice >= entryPrice) {
      allowTrailing = false;
    }
  }

  // Option 2: Activate the stop loss trail initially and trail stop loss till stop loss value reaches the breakeven value
  if (config.trailTillBreakevenOnly) {
    if (direction === 'LONG') {
      finalSL = Math.min(finalSL, entryPrice);
    } else if (direction === 'SHORT') {
      finalSL = Math.max(finalSL, entryPrice);
    }
  }

  if (!allowTrailing) {
    return currentStopLoss;
  }

  // Ensure normal trailing does not widen the stop loss
  if (direction === 'LONG') {
    return Math.max(currentStopLoss, finalSL);
  } else {
    return Math.min(currentStopLoss, finalSL);
  }
}
