export type MainTradeExecution = "market execution";

export interface MainTradeParameters {
  executionType: MainTradeExecution;
  countToExecute: number;
}

export interface RecurrentTradeParameters {
  supported: false;
}

export type TradeCategory = "main trade" | "recurrent trade";

// Adding some metadata for trading rules
export interface TradeTypeInfo {
  category: TradeCategory;
  mainTradeParams?: MainTradeParameters;
  recurrentTradeParams?: RecurrentTradeParameters;
}
