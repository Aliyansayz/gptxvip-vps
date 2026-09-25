export interface LeverageConfig {
  enabled: boolean;
  balance: number;
  currency: '$' | '€';
  positionSize: number; // in lots
  positionSizingType: 'fix' | 'dynamic_margin';
  dynamicMarginType: 'percentage' | 'value';
  dynamicMarginPercentage: number;
  dynamicMarginValue: number;
  useExplicitLiquidationPips: boolean;
  explicitLiquidationPips: number;
  leverage: number;
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
  useExplicitLiquidationPips: false,
  explicitLiquidationPips: 50,
  leverage: 500,
};

export const CONTRACT_SIZE_GOLD = 100; // Standard lot for gold is 100 oz. So 1.0 lot * $1 move = $100

export function calculateRequiredMargin(price: number, lotSize: number, leverage: number): number {
  // 1 lot = 100 units
  return (price * lotSize * CONTRACT_SIZE_GOLD) / leverage;
}

export function calculatePnL(entryPrice: number, exitPrice: number, lotSize: number, side: 'LONG' | 'SHORT'): number {
  const move = side === 'LONG' ? exitPrice - entryPrice : entryPrice - exitPrice;
  return move * lotSize * CONTRACT_SIZE_GOLD;
}
