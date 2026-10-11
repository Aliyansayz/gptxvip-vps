import { isTimestampAllowed, TimeFilterConfig } from '../timeFilter/timeFilterManager';

export function shouldAllowTradeByTimeFilter(timestamp: number, config?: TimeFilterConfig): boolean {
  if (!config) return true;
  return isTimestampAllowed(timestamp, config);
}
