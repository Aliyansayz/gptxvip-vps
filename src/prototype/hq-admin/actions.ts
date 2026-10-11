import type { State } from "./data";
import { uid } from "../shared/helpers";
export function appendAudit(
  state: State,
  workspaceId: string,
  action: string,
  targetId: string,
): State {
  return {
    ...state,
    audit: [
      ...state.audit,
      {
        id: uid(state.audit, "audit"),
        workspaceId,
        action,
        targetId,
        at: "2026-10-05T12:00 · demo action",
      },
    ],
  };
}
