import { LeverageType, DEFAULT_LEVERAGE_TYPE } from '../leveragedAccount/leverageType';
import { CONTRACT_SIZE_OIL } from './leveragedPositionSizeEnergy';

export interface LeverageConfig {
  enabled: boolean;
  balance: number;
  currency: '$' | '€';
  positionSize: number; // in lots
  positionSizingType: 'fix' | 'dynamic_margin' | 'dynamic_risk_per_pip' | 'dynamic_risk_atr_pips';
  adaptivePositionSizingMode?: 'none' | 'trend_based' | 'volatility_based'; // New adaptive modes
  adaptiveMinPercentage?: number;
  adaptiveMaxPercentage?: number;
  dynamicMarginType: 'percentage' | 'value';
  dynamicMarginPercentage: number;
  dynamicMarginValue: number;
  dynamicRiskPerPipValue?: number; // New property for dynamic_risk_per_pip
  dynamicRiskPerPipPercentage?: number; // Risk percentage equivalent for per-pip
  dynamicRiskPerPipType?: 'value' | 'percentage';
  dynamicRiskAtrPipsPercentage?: number; // Risk percentage of balance for ATR pips
  useExplicitLiquidationPips: boolean;
  explicitLiquidationPips: number;
  leverage: number;
  recurrentPositionSizingMode?: 'WEIGHT_FACTOR' | 'FLOATING_GAIN_PERCENTAGE' | 'DYNAMIC_RISK_ATR_PIPS' | 'DYNAMIC_RISK_PER_PIP';
  recurrentTradeWeightFactor?: number;
  recurrentFloatingGainPercentage?: number;
  recurrentRiskPerPipType?: 'value' | 'percentage';
  recurrentRiskPerPipValue?: number;
  recurrentRiskPerPipPercentage?: number;
  recurrentRiskAtrPipsPercentage?: number;
  leverageType?: LeverageType;
}

export const DEFAULT_LEVERAGE_CONFIG: LeverageConfig = {
  enabled: false,
  balance: 100,
  currency: '$',
  positionSize: 0.01,
  positionSizingType: 'fix',
  adaptivePositionSizingMode: 'none',
  adaptiveMinPercentage: 0.5,
  adaptiveMaxPercentage: 2.0,
  dynamicMarginType: 'percentage',
  dynamicMarginPercentage: 5,
  dynamicMarginValue: 100,
  dynamicRiskPerPipValue: 1,
  dynamicRiskPerPipPercentage: 1,
  dynamicRiskPerPipType: 'value',
  dynamicRiskAtrPipsPercentage: 2,
  useExplicitLiquidationPips: false,
  explicitLiquidationPips: 20,
  leverage: 500,
  recurrentPositionSizingMode: 'WEIGHT_FACTOR',
  recurrentTradeWeightFactor: 0.33,
  recurrentFloatingGainPercentage: 20,
  recurrentRiskPerPipType: 'value',
  recurrentRiskPerPipValue: 1,
  recurrentRiskPerPipPercentage: 1,
  recurrentRiskAtrPipsPercentage: 2,
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
