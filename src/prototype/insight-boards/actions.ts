import type { State } from "./data";
export function replaceBoardWidgets(
  state: State,
  boardId: string,
  widgetIds: string[],
): State {
  const ids = [...new Set(widgetIds)].filter((id) =>
    state.widgets.some((w) => w.id === id),
  );
  return {
    ...state,
    boards: state.boards.map((b) =>
      b.id === boardId ? { ...b, widgetIds: ids } : b,
    ),
  };
}
