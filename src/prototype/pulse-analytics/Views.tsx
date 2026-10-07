export function Trend({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value)),
    width = 650,
    height = 180;
  const points = rows
    .map(
      (r, i) =>
        `${30 + (i * (width - 60)) / Math.max(1, rows.length - 1)},${height - 25 - (r.value / max) * (height - 55)}`,
    )
    .join(" ");
  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Daily unique users: ${rows.map((r) => `${r.label}: ${r.value}`).join("; ")}`}
        style={{ width: "100%", height: "auto" }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <g key={v}>
            <line
              x1="30"
              x2={width - 30}
              y1={height - 25 - v * (height - 55)}
              y2={height - 25 - v * (height - 55)}
              stroke="var(--line)"
            />
            <text
              x="0"
              y={height - 20 - v * (height - 55)}
              fontSize="11"
              fill="var(--muted)"
            >
              {Math.round(v * max)}
            </text>
          </g>
        ))}
        <polyline
          fill="none"
          stroke="var(--accent-chart)"
          strokeWidth="3"
          points={points}
        />
        {rows.map((r, i) => (
          <circle
            key={r.label}
            cx={30 + (i * (width - 60)) / Math.max(1, rows.length - 1)}
            cy={height - 25 - (r.value / max) * (height - 55)}
            r="5"
            fill="var(--surface)"
            stroke="var(--accent-chart)"
            strokeWidth="3"
          />
        ))}
      </svg>
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          fontSize: 11,
          color: "var(--muted)",
          flexWrap: "wrap",
        }}
      >
        {rows.map((r) => (
          <span key={r.label}>
            {r.label.slice(5)} · {r.value}
          </span>
        ))}
      </div>
    </div>
  );
}
