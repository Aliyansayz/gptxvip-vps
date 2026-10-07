import type { State, CapitalEvent } from "./data";
import { capitalError } from "./formulas";
import { uid, money } from "../shared/helpers";
export function recordCapital(
  state: State,
  event: Omit<CapitalEvent, "id">,
): State {
  const investor = state.investors.find(
    (i) => i.id === event.investorId && i.fundId === event.fundId,
  );
  if (
    !investor ||
    capitalError(
      investor,
      state.capital,
      event.kind,
      event.amountCents,
      event.date,
    )
  )
    return state;
  const id = uid(state.capital, "capital");
  return {
    ...state,
    capital: [...state.capital, { ...event, id }],
    audit: [
      ...state.audit,
      {
        id: uid(state.audit, "audit"),
        fundId: event.fundId,
        date: event.date,
        action: `${event.kind} recorded for ${investor.name}: ${money(event.amountCents)} (${id})`,
      },
    ],
  };
}
