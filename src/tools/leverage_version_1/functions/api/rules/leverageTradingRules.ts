import { LeverageConfig, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize } from '../position_sizing/leveragedDynamicPositionSize';

/**
 * Checks if a new trade can be opened given the current balance and leverage.
 */
export function isSufficientBalanceToOpenTrade(
  currentPrice: number,
  config: LeverageConfig,
  currentBalance: number
): boolean {
  if (!config.enabled) return true; // unlimited trades

  if (config.positionSizingType === 'dynamic_margin') {
    const evaluation = evaluateDynamicPositionSize(
      currentBalance,
      currentPrice,
      config.leverage,
      config.dynamicMarginType || 'percentage',
      config.dynamicMarginType === 'value' ? (config.dynamicMarginValue || 100) : (config.dynamicMarginPercentage || 5),
      config.useExplicitLiquidationPips ? config.explicitLiquidationPips : undefined
    );
    return evaluation.possibleLotSize >= 0.01;
  } else {
    const marginRequired = calculateRequiredMargin(currentPrice, config.positionSize, config.leverage);
    return currentBalance >= marginRequired;
  }
}

