import { CONTRACT_SIZE_GOLD, getContractSize } from './leveragedPositionSizeMetals';
import { pipsToPrice, priceToPips } from '../middleware/pipsTranslation';

export function autoAdjustPriceLiquidation(
  assetName: string,
  leverage: number,
  availableBalance: number,
  currentMarginValue: number,
  currentPips: number,
  entryPrice?: number
): number {
  const contractSize = getContractSize(assetName);
  const minLotSize = 0.01;
  const priceMove = currentMarginValue / (minLotSize * contractSize);
  return priceToPips(priceMove, assetName, entryPrice);
}

export function autoAdjustMargin(
  assetName: string,
  leverage: number,
  availableBalance: number,
  currentMarginValue: number,
  currentPips: number,
  entryPrice?: number
): number {
  const contractSize = getContractSize(assetName);
  const minLotSize = 0.01;
  let newMargin = 0;

  if (currentPips > 0 && entryPrice === undefined) {
    const priceMove = pipsToPrice(currentPips, assetName, entryPrice);
    newMargin = priceMove * minLotSize * contractSize;
  } else if (entryPrice) {
    newMargin = (minLotSize * entryPrice * contractSize) / leverage;
  } else {
    const priceMove = pipsToPrice(currentPips, assetName, entryPrice);
    newMargin = priceMove * minLotSize * contractSize;
  }
  
  return newMargin;
}

export function evaluateRiskPerPip(
  balance: number,
  entryPrice: number,
  leverage: number,
  riskPerPipValue: number,
  contractSize: number = CONTRACT_SIZE_GOLD,
  assetName: string = 'gold'
): DynamicPositionEvaluation {
  const priceOf1Pip = pipsToPrice(1, assetName, entryPrice);
  const exactLotSize = riskPerPipValue / (priceOf1Pip * contractSize);
  
  let possibleLotSize = Math.max(0, Math.floor(exactLotSize * 100) / 100);
  
  const requiredMargin = (entryPrice * possibleLotSize * contractSize) / leverage;
  if (requiredMargin > balance) {
    possibleLotSize = Math.floor(((balance * leverage) / (entryPrice * contractSize)) * 100) / 100;
  }

  let pipsToLiquidation = 0;
  if (possibleLotSize > 0) {
    const priceMove = balance / (possibleLotSize * contractSize);
    pipsToLiquidation = priceToPips(priceMove, assetName, entryPrice);
  }

  return {
    maxMarginAllowed: balance,
    possibleLotSize: possibleLotSize,
    pipsToLiquidation,
    liquidationLossAmount: balance,
    warningMargin: possibleLotSize < 0.01 ? "Risk per pip is too low to meet 0.01 min lot size. Increase risk/pip." : undefined
  };
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
  contractSize: number = CONTRACT_SIZE_GOLD,
  assetName: string = 'gold'
): DynamicPositionEvaluation {
  const maxMarginAllowed = marginType === 'percentage' 
    ? balance * (marginValue / 100)
    : marginValue;

  let exactLotSize = 0;
  let pipsToLiquidation = 0;
  let finalLiquidationLossAmount = maxMarginAllowed;

  if (explicitPips && explicitPips > 0) {
    const explicitPriceMove = pipsToPrice(explicitPips, assetName, entryPrice);
    exactLotSize = maxMarginAllowed / (explicitPriceMove * contractSize);
    
    // Ensure the required margin does not exceed available balance
    const requiredMargin = (entryPrice * exactLotSize * contractSize) / leverage;
    if (requiredMargin > balance) {
      exactLotSize = (balance * leverage) / (entryPrice * contractSize);
    }
  } else {
    // Lot Size by matching required initial margin to the available target margin.
    exactLotSize = (maxMarginAllowed * leverage) / (entryPrice * contractSize);
  }

  const possibleLotSize = Math.max(0, Math.floor(exactLotSize * 100) / 100);
  
  if (explicitPips && explicitPips > 0) {
    pipsToLiquidation = explicitPips;
    const explicitPriceMove = pipsToPrice(explicitPips, assetName, entryPrice);
    finalLiquidationLossAmount = possibleLotSize * explicitPriceMove * contractSize;
  } else {
    if (possibleLotSize > 0) {
      const priceMove = maxMarginAllowed / (possibleLotSize * contractSize);
      pipsToLiquidation = priceToPips(priceMove, assetName, entryPrice);
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

