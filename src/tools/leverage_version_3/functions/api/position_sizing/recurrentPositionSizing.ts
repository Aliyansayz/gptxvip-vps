import { evaluateAccountFloatingValue } from '../accountState/evaluateAccountFloatingValue';
import { LeverageConfig, getContractSize } from './leveragedPositionSizeMetals';
import { Trade } from '../../../../types/trading';

export type RecurrentPositionSizingMode = 'WEIGHT_FACTOR' | 'FLOATING_GAIN_PERCENTAGE' | 'DYNAMIC_RISK_ATR_PIPS' | 'DYNAMIC_RISK_PER_PIP';

export function calculateRecurrentPositionSize(
  mainTradeSize: number,
  mode: RecurrentPositionSizingMode,
  weightFactor: number,
  floatingGainPercentage: number,
  trades: Trade[],
  currentPrice: number,
  leverageConfig: LeverageConfig,
  asset?: string,
  stopLossPips?: number // To figure out how much size we can get from floating gain
): number {
  if (mode === 'WEIGHT_FACTOR') {
    return mainTradeSize * weightFactor;
  }

  if (mode === 'FLOATING_GAIN_PERCENTAGE') {
    // 1. Fetch floating gain
    const floatingPnL = evaluateAccountFloatingValue(trades, currentPrice, leverageConfig.enabled, asset);

    if (floatingPnL <= 0) {
      // safe fallback if no gain
      return mainTradeSize * weightFactor;
    }

    const marginAvailableFromGain = floatingPnL * (floatingGainPercentage / 100);

    // 2. We need to define size based on this margin and the leverage rules or an explicit pip value.
    // If not possible, perhaps fallback
    
    // Simplification: In dynamic margin, this marginAvailableFromGain *can* be used.
    // For now, if we don't have explicit liquidation pips, we might just use the "margin value" logic:
    // Required Margin = (price * lotSize * CONTRACT_SIZE) / leverage
    // lotSize = (Margin * leverage) / (price * CONTRACT_SIZE)

    const CONTRACT_SIZE = getContractSize(asset); // Contract size for asset
    let calculatedSize = (marginAvailableFromGain * leverageConfig.leverage) / (currentPrice * CONTRACT_SIZE);
    
    // Ensure 2 decimals max precision and at least 0.01 lot size
    calculatedSize = Math.max(0.01, Math.floor(calculatedSize * 100) / 100);
    return calculatedSize;
  }

  // Handle DYNAMIC_RISK_ATR_PIPS mode is processed in tradingRecurrentTradeRules.ts 
  // similar to dynamic risk atr in main trade, so we will skip redefining logic here
  // and handle it in the caller, returning mainTradeSize * weightFactor as a structural fallback
  // if caller somehow invokes this for DYNAMIC_RISK_ATR_PIPS without passing sizes directly
  return mainTradeSize * weightFactor;
}
