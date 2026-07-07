import { pipsToPrice } from './pipsTranslation';

export const lowForLongAtrOffset = (slPrice: number, atrPips: number, assetType: string, currentPrice: number): number => {
  const offsetPrice = pipsToPrice(atrPips, assetType, currentPrice);
  return slPrice - offsetPrice;
};

export const highForShortAtrOffset = (slPrice: number, atrPips: number, assetType: string, currentPrice: number): number => {
  const offsetPrice = pipsToPrice(atrPips, assetType, currentPrice);
  return slPrice + offsetPrice;
};

export const manualPipsOffset = (slPrice: number, manualPips: number, assetType: string, currentPrice: number, isLong: boolean): number => {
  const offsetPrice = pipsToPrice(manualPips, assetType, currentPrice);
  return isLong ? slPrice - offsetPrice : slPrice + offsetPrice;
};
