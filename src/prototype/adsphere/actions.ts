import type { State, Campaign } from "./data";
export function updateCampaign(
  state: State,
  id: string,
  patch: Partial<Campaign>,
): State {
  return {
    ...state,
    campaigns: state.campaigns.map((c) =>
      c.id === id ? { ...c, ...patch } : c,
    ),
  };
}
