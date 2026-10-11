import type { State, Holding } from "./data";
export function saveHolding(state: State, holding: Holding): State {
  if (
    !Object.keys(state.candles).includes(holding.asset) ||
    !Number.isFinite(holding.quantity) ||
    holding.quantity < 0 ||
    !Number.isFinite(holding.averageCost) ||
    holding.averageCost < 0
  )
    return state;
  return {
    ...state,
    holdings: [
      ...state.holdings.filter((h) => h.asset !== holding.asset),
      { ...holding },
    ],
  };
}
