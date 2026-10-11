import { TradingRulesConfig } from './tradingRules';

export function isTradeRestricted(
  config: TradingRulesConfig,
  direction: 'long' | 'short' | 1 | -1
): boolean {
  if (direction === 'long' || direction === 1) {
    return config.restrictLongTrades === true;
  }
  
  if (direction === 'short' || direction === -1) {
    return config.restrictShortTrades === true;
  }

  return false;
}
