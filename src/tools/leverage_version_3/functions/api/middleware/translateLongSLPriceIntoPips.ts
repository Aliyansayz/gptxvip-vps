import { priceToPips } from './pipsTranslation';

export const getLongAtrStopLossPrice = (
  lowerBandValue: number | undefined
): number => {
  if (!lowerBandValue) return 0;
  return Number(lowerBandValue.toFixed(2));
};

export const getLongAtrStopLossDifferenceInPips = (
  currentPrice: number,
  lowerBandValue: number | undefined,
  assetType: string
): number => {
  if (!lowerBandValue) return 0;
  const difference = currentPrice - lowerBandValue;
  return Number(priceToPips(difference, assetType, currentPrice).toFixed(1));
};
