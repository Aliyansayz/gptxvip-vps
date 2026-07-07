import { CONTRACT_SIZE_GOLD } from './leveragedPositionSizeMetals';

export function autoAdjustPriceLiquidation(
  assetName: string,
  leverage: number,
  availableBalance: number,
  currentMarginValue: number,
  currentPips: number
): number {
  const contractSize = assetName === 'GLD' || assetName === 'Gold' ? CONTRACT_SIZE_GOLD : 100;
  const minLotSize = 0.01;
  const newPips = currentMarginValue / (minLotSize * contractSize);
  return newPips;
}

export function autoAdjustMargin(
  assetName: string,
  leverage: number,
  availableBalance: number,
  currentMarginValue: number,
  currentPips: number,
  entryPrice?: number
): number {
  const contractSize = assetName === 'GLD' || assetName === 'Gold' ? CONTRACT_SIZE_GOLD : 100;
  const minLotSize = 0.01;
  let newMargin = 0;

  if (currentPips > 0 && entryPrice === undefined) {
    newMargin = currentPips * minLotSize * contractSize;
  } else if (entryPrice) {
    newMargin = (minLotSize * entryPrice * contractSize) / leverage;
  } else {
    newMargin = currentPips * minLotSize * contractSize;
  }
  
  return newMargin;
}

export interface DynamicPositionEvaluation {

  maxMarginAllowed: number;
  possibleLotSize: number;
  pipsToLiquidation: number;
  liquidationLossAmount: number;
  warningMargin?: string;
  warningPips?: string;
}

/**
 * Evaluates the dynamic position size allowing for explicit defining of margin and price of liquidation.
 */
export function evaluateDynamicPositionSize(
  balance: number,
  entryPrice: number,
  leverage: number,
  marginType: 'percentage' | 'value',
  marginValue: number,
  explicitPips?: number,
  contractSize: number = CONTRACT_SIZE_GOLD
): DynamicPositionEvaluation {
  const maxMarginAllowed = marginType === 'percentage' 
    ? balance * (marginValue / 100)
    : marginValue;

  let exactLotSize = 0;
  let pipsToLiquidation = 0;
  let finalLiquidationLossAmount = maxMarginAllowed;

  if (explicitPips && explicitPips > 0) {
    // If Pips to Liquidation is explicit, Calculate Lot Size based on Maximum Loss Margin => Loss = Pips * Lot * ContractSize
    exactLotSize = maxMarginAllowed / (explicitPips * contractSize);
    
    // Ensure the required margin does not exceed available balance or max specified margin limit
    const requiredMargin = (entryPrice * exactLotSize * contractSize) / leverage;
    if (requiredMargin > balance) {
      exactLotSize = (balance * leverage) / (entryPrice * contractSize);
    }
  } else {
    // Lot Size by matching required initial margin to the available target margin.
    exactLotSize = (maxMarginAllowed * leverage) / (entryPrice * contractSize);
  }

  const possibleLotSize = Math.floor(exactLotSize * 100) / 100;
  
  if (explicitPips && explicitPips > 0) {
    pipsToLiquidation = explicitPips;
    finalLiquidationLossAmount = possibleLotSize * pipsToLiquidation * contractSize;
  } else {
    if (possibleLotSize > 0) {
      pipsToLiquidation = maxMarginAllowed / (possibleLotSize * contractSize);
    }
  }

  let warningMargin: string | undefined;
  let warningPips: string | undefined;

  if (possibleLotSize < 0.01) {
    warningMargin = "Increase the Liquidation Margin.";
    if (explicitPips && explicitPips > 0) {
      warningPips = "Decrease/Increase the Price of Liquidation (Pips).";
    }
  }

  return {
    maxMarginAllowed,
    possibleLotSize,
    pipsToLiquidation,
    liquidationLossAmount: finalLiquidationLossAmount,
    warningMargin,
    warningPips
  };
}

