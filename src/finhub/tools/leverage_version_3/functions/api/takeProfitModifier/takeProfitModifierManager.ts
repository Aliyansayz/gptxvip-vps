import { TakeProfitModifierConfig } from './takeProfitModifierConfig';

export interface TakeProfitEvalContext {
  initialStopLoss: number;
  currentStopLoss: number;
  initialTakeProfit: number;
  currentTakeProfit: number;
  entryPrice: number;
  latestPrice: number;
  direction: 'LONG' | 'SHORT';
}

export function evaluateTakeProfitModification(
  ctx: TakeProfitEvalContext,
  config?: TakeProfitModifierConfig
): number {
  if (!config) return ctx.currentTakeProfit;
  if (ctx.initialTakeProfit === undefined) return ctx.currentTakeProfit;

  const { initialStopLoss, currentStopLoss, currentTakeProfit, initialTakeProfit, entryPrice, latestPrice, direction } = ctx;
  
  let finalTP = currentTakeProfit;

  const initialSlDistance = Math.abs(entryPrice - initialStopLoss);
  
  // Calculate how much distance latest price has traveled from initial SL
  const distance = direction === 'LONG' 
    ? (latestPrice - initialStopLoss)
    : (initialStopLoss - latestPrice);
    
  // Reward factor definition: 1.0 at entry, 2.0 at 1R profit.
  // Profit factor is purely based on entry distance
  const profitMade = direction === 'LONG' ? (latestPrice - entryPrice) : (entryPrice - latestPrice);
  const currentRewardFactor = initialSlDistance === 0 ? 0 : (profitMade / initialSlDistance);

  // 1. Update Take Profit at a particular price target using multiplier on SL band
  if (config.enableUpdateTpAtTarget && currentRewardFactor >= config.tpUpdateRewardTarget) {
     const stopLossBand = Math.abs(latestPrice - currentStopLoss);
     const tpDistance = stopLossBand * config.tpUpdateMultiplier;
     
     if (direction === 'LONG') {
        const potentialTP = latestPrice + tpDistance;
        if (potentialTP > finalTP) {
           finalTP = potentialTP; // Only push it further out
        }
     } else {
        const potentialTP = latestPrice - tpDistance;
        if (potentialTP < finalTP) {
           finalTP = potentialTP;
        }
     }
  }

  // 2. Activate trail take profit after breakeven
  if (config.enableTrailTpAfterBreakeven) {
     if (profitMade > 0) {
        // We trail it by maintaining its initial distance from the current price
        const initialTpDistance = Math.abs(initialTakeProfit - entryPrice);
        
        if (direction === 'LONG') {
           const trailedTP = latestPrice + initialTpDistance;
           if (trailedTP > finalTP) {
              finalTP = trailedTP;
           }
        } else {
           const trailedTP = latestPrice - initialTpDistance;
           if (trailedTP < finalTP) {
              finalTP = trailedTP;
           }
        }
     }
  }

  return finalTP;
}
