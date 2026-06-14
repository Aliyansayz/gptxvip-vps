export type MainTradeExecution = "market execution";

export interface MainTradeParameters {
  executionType: MainTradeExecution;
  countToExecute: number;
}

export interface RecurrentTradeParameters {
  countToExecute: number;
  entryAfterNSeconds?: number;
  entryAfterNSecondsMin?: number;
  entryAfterNSecondsMax?: number;
  entryAfterNCandles?: number;
  entryAfterNCandlesMin?: number;
  entryAfterNCandlesMax?: number;
  entryOnPipsFavor?: number;
  onlyExecuteIfLatestTradeInSurplus?: boolean;
  onlyExecuteIfSqueezeMomentumValid?: boolean;
  adxFilterThreshold?: number;
  onlyExecuteIfTrendStrengthFavorable?: boolean;
  onlyExecuteIfHeikinAshiFavorable?: boolean;
  exitAfterNSeconds?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
  exitAfterNCandles?: number;
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNPips?: number;
  closeAlongsideMainTrade?: boolean;
  entryOnMainTradeTrail?: boolean;
  entryOnCandlePattern?: boolean;
  entryOnCandlePatternSource?: 'none' | 'any' | 'alpha' | 'beta' | 'delta';
  entryOnTrendRevert?: boolean;
  entryOnCandlesRevert?: boolean;
  closeAllRecurrentOnPartialExit?: boolean;
  closePctRecurrentOnPartialExitActive?: boolean;
  closePctRecurrentPercentage?: number;
}

export type TradeCategory = "main trade" | "recurrent trade" | "hft hedge trade";

// Adding some metadata for trading rules
export interface TradeTypeInfo {
  category: TradeCategory;
  mainTradeParams?: MainTradeParameters;
  recurrentTradeParams?: RecurrentTradeParameters;
  isRecurrentTradeActive?: boolean;
}
