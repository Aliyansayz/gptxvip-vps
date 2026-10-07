import { money } from "../shared";
export function MovementBridge({
  start,
  end,
  movements,
}: {
  start: number;
  end: number;
  movements: { kind: string; deltaCents: number }[];
}) {
  const entries = ["new", "expansion", "contraction", "churn"].map((label) => ({
    label,
    value: movements
      .filter((m) => m.kind === label)
      .reduce((n, m) => n + m.deltaCents, 0),
  }));
  let running = start;
  const bars = [
    { label: "Starting", from: 0, to: start, value: start },
    ...entries.map((r) => {
      const from = running;
      running += r.value;
      return { ...r, from, to: running };
    }),
    { label: "Ending", from: 0, to: end, value: end },
  ];
  const max = Math.max(
    1,
    start,
    end,
    ...bars.map((b) => Math.max(b.from, b.to)),
  );
  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox="0 0 720 230"
        style={{ minWidth: 540, width: "100%" }}
        role="img"
        aria-label={`MRR bridge: starting ${money(start)}, ${entries.map((e) => `${e.label} ${money(e.value)}`).join(", ")}, ending ${money(end)}`}
      >
        <line x1="20" x2="700" y1="185" y2="185" stroke="var(--line)" />
        {bars.map((b, i) => {
          const top = 185 - (Math.max(b.from, b.to) / max) * 140;
          const h = Math.max(3, (Math.abs(b.to - b.from) / max) * 140);
          const x = 30 + i * 115;
          return (
            <g key={b.label}>
              <rect
                x={x}
                y={top}
                width="85"
                height={h}
                rx="4"
                fill={b.value < 0 ? "#be4c69" : "var(--accent)"}
                opacity={i === 0 || i === 5 ? 1 : 0.72}
              />
              <text
                x={x + 42}
                y={Math.max(16, top - 8)}
                textAnchor="middle"
                fontSize="12"
                fill="var(--ink)"
              >
                {money(b.value)}
              </text>
              <text
                x={x + 42}
                y="212"
                textAnchor="middle"
                fontSize="12"
                fill="var(--muted)"
              >
                {b.label}
              </text>
              {i < 5 && (
                <line
                  x1={x + 85}
                  x2={x + 115}
                  y1={185 - (b.to / max) * 140}
                  y2={185 - (b.to / max) * 140}
                  stroke="var(--muted)"
                  strokeDasharray="3 3"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
