import { Trade } from '../../../../types/trading';
import { LeverageConfig, calculateRequiredMargin } from '../position_sizing/leveragedPositionSizeMetals';

export interface LeveragedAccountInfo {
  totalBalance: number;
  openFloatingPnL: number;
  totalEquity: number;
  marginUsed: number;
  freeMargin: number;
  currency: string;
}

export function getLeverageAccountInfo(displayTrades: Trade[], leverageSettings: LeverageConfig): LeveragedAccountInfo {
  const closedPnL = displayTrades.filter(t => t.status === 'CLOSED').reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalBalance = leverageSettings.balance + closedPnL;

  const openFloatingPnL = displayTrades.filter(t => t.status === 'OPEN').reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalEquity = totalBalance + openFloatingPnL;

  const marginUsed = displayTrades.filter(t => t.status === 'OPEN').reduce((sum, t) => {
    return sum + calculateRequiredMargin(t.entryPrice, t.size || leverageSettings.positionSize, leverageSettings.leverage);
  }, 0);
  
  const freeMargin = totalEquity - marginUsed;

  const currency = leverageSettings.currency || '$';

  return {
    totalBalance,
    openFloatingPnL,
    totalEquity,
    marginUsed,
    freeMargin,
    currency
  };
}
