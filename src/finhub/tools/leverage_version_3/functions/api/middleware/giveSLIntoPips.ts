import { priceToPips } from './pipsTranslation';

export const giveSLIntoPips = (currentPrice: number, slPrice: number, assetType: string): number => {
  const difference = currentPrice - slPrice;
  return Number(priceToPips(difference, assetType, currentPrice).toFixed(1));
};

export const giveSLDifferenceInPips = (priceDiff: number, assetType: string, currentPrice: number): number => {
    return Number(priceToPips(priceDiff, assetType, currentPrice).toFixed(1));
};
