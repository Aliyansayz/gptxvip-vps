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
  exitAfterNSeconds?: number;
  exitAfterNSecondsMin?: number;
  exitAfterNSecondsMax?: number;
  exitAfterNCandles?: number;
  exitAfterNCandlesMin?: number;
  exitAfterNCandlesMax?: number;
  exitAfterNPips?: number;
  closeAlongsideMainTrade?: boolean;
  entryOnMainTradeTrail?: boolean;
}

export type TradeCategory = "main trade" | "recurrent trade";

// Adding some metadata for trading rules
export interface TradeTypeInfo {
  category: TradeCategory;
  mainTradeParams?: MainTradeParameters;
  recurrentTradeParams?: RecurrentTradeParameters;
  isRecurrentTradeActive?: boolean;
}
