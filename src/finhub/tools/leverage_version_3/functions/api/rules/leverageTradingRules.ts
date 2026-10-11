import { LeverageConfig, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';
import { evaluateDynamicPositionSize, evaluateRiskPerPip } from '../position_sizing/leveragedDynamicPositionSize';

/**
 * Checks if a new trade can be opened given the current balance and leverage.
 */
export function isSufficientBalanceToOpenTrade(
  currentPrice: number,
  config: LeverageConfig,
  currentBalance: number,
  assetName: string = 'gold'
): boolean {
  if (!config.enabled) return true; // unlimited trades

  if (config.positionSizingType === 'dynamic_risk_per_pip') {
    let riskVal = config.dynamicRiskPerPipValue || 1;
    if (config.dynamicRiskPerPipType === 'percentage') {
       const basePct = config.dynamicRiskPerPipPercentage || 1;
       riskVal = currentBalance * (basePct / 100);
    }
    const evaluation = evaluateRiskPerPip(
      currentBalance,
      currentPrice,
      config.leverage,
      riskVal,
      undefined,
      assetName
    );
    return evaluation.possibleLotSize >= 0.01;
  } else if (config.positionSizingType === 'dynamic_margin') {
    const evaluation = evaluateDynamicPositionSize(
      currentBalance,
      currentPrice,
      config.leverage,
      config.dynamicMarginType || 'percentage',
      config.dynamicMarginType === 'value' ? (config.dynamicMarginValue || 100) : (config.dynamicMarginPercentage || 5),
      config.useExplicitLiquidationPips ? config.explicitLiquidationPips : undefined,
      undefined,
      assetName
    );
    return evaluation.possibleLotSize >= 0.01;
  } else if (config.positionSizingType === 'dynamic_risk_atr_pips') {
    const riskPercentage = config.dynamicRiskAtrPipsPercentage || 2;
    const mockAtrPips = config.explicitLiquidationPips || 50;
    const evaluation = evaluateDynamicPositionSize(
      currentBalance,
      currentPrice,
      config.leverage,
      'percentage',
      riskPercentage,
      mockAtrPips,
      undefined,
      assetName
    );
    return evaluation.possibleLotSize >= 0.01;
  } else {
    const marginRequired = calculateRequiredMargin(currentPrice, config.positionSize, config.leverage, assetName);
    return currentBalance >= marginRequired;
  }
}

