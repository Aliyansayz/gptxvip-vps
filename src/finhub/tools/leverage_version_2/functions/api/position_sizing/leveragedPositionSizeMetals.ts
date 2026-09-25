import { LeverageType, DEFAULT_LEVERAGE_TYPE } from '../leveragedAccount/leverageType';
import { CONTRACT_SIZE_OIL } from './leveragedPositionSizeEnergy';

export interface LeverageConfig {
  enabled: boolean;
  balance: number;
  currency: '$' | '€';
  positionSize: number; // in lots
  positionSizingType: 'fix' | 'dynamic_margin' | 'dynamic_risk_per_pip';
  dynamicMarginType: 'percentage' | 'value';
  dynamicMarginPercentage: number;
  dynamicMarginValue: number;
  dynamicRiskPerPipValue?: number; // New property for dynamic_risk_per_pip
  useExplicitLiquidationPips: boolean;
  explicitLiquidationPips: number;
  leverage: number;
  recurrentPositionSizingMode?: 'WEIGHT_FACTOR' | 'FLOATING_GAIN_PERCENTAGE';
  recurrentTradeWeightFactor?: number;
  recurrentFloatingGainPercentage?: number;
  leverageType?: LeverageType;
}

export const DEFAULT_LEVERAGE_CONFIG: LeverageConfig = {
  enabled: false,
  balance: 100,
  currency: '$',
  positionSize: 0.01,
  positionSizingType: 'fix',
  dynamicMarginType: 'percentage',
  dynamicMarginPercentage: 5,
  dynamicMarginValue: 100,
  dynamicRiskPerPipValue: 1,
  useExplicitLiquidationPips: false,
  explicitLiquidationPips: 50,
  leverage: 500,
  recurrentPositionSizingMode: 'WEIGHT_FACTOR',
  recurrentTradeWeightFactor: 0.33,
  recurrentFloatingGainPercentage: 20,
  leverageType: DEFAULT_LEVERAGE_TYPE,
};

export const CONTRACT_SIZE_GOLD = 100; // Standard lot for gold is 100 oz. So 1.0 lot * $1 move = $100
export const CONTRACT_SIZE_SILVER = 5000;
export const CONTRACT_SIZE_NASDAQ = 20; // Example for E-mini Nasdaq 100

export function getContractSize(asset?: string): number {
  if (asset === 'Silver') return CONTRACT_SIZE_SILVER;
  if (asset === 'Oil') return CONTRACT_SIZE_OIL;
  if (asset === 'Nasdaq100') return CONTRACT_SIZE_NASDAQ;
  return CONTRACT_SIZE_GOLD;
}

export function calculateRequiredMargin(price: number, lotSize: number, leverage: number, asset: string = 'Gold'): number {
  return (price * lotSize * getContractSize(asset)) / leverage;
}

export function calculatePnL(entryPrice: number, exitPrice: number, lotSize: number, side: 'LONG' | 'SHORT', asset: string = 'Gold'): number {
  const move = side === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;
  return move * lotSize * getContractSize(asset);
}
