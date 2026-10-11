export function PerformancePlot({
  points,
  benchmark,
}: {
  points: { period: string; nav: number; benchmark: number }[];
  benchmark: boolean;
}) {
  const first = points[0];
  const rows = points.map((p) => ({
    ...p,
    n: first?.nav ? (p.nav / first.nav) * 100 : 100,
    b: first?.benchmark ? (p.benchmark / first.benchmark) * 100 : 100,
  }));
  const max = Math.max(
    110,
    ...rows.flatMap((p) => (benchmark ? [p.n, p.b] : [p.n])),
  );
  const min = Math.min(
    95,
    ...rows.flatMap((p) => (benchmark ? [p.n, p.b] : [p.n])),
  );
  const y = (v: number) => 190 - ((v - min) / (max - min)) * 150;
  const x = (i: number) => 45 + i * 240;
  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 600 240"
        style={{ width: "100%" }}
        role="img"
        aria-label="Fund NAV and sample benchmark rebased to 100 at first selected period"
      >
        {[0, 0.5, 1].map((n) => (
          <g key={n}>
            <line
              x1="40"
              x2="530"
              y1={40 + n * 150}
              y2={40 + n * 150}
              stroke="var(--line)"
            />
            <text x="0" y={45 + n * 150} fontSize="12" fill="var(--muted)">
              {(max - n * (max - min)).toFixed(0)}
            </text>
          </g>
        ))}
        <polyline
          fill="none"
          stroke="var(--accent-chart)"
          strokeWidth="3"
          points={rows.map((p, i) => `${x(i)},${y(p.n)}`).join(" ")}
        />
        {benchmark && (
          <polyline
            fill="none"
            stroke="var(--muted)"
            strokeDasharray="5 4"
            strokeWidth="2"
            points={rows.map((p, i) => `${x(i)},${y(p.b)}`).join(" ")}
          />
        )}{" "}
        {rows.map((p, i) => (
          <g key={p.period}>
            <circle cx={x(i)} cy={y(p.n)} r="5" fill="var(--accent-chart)" />
            <text x={x(i) - 25} y="222" fontSize="12" fill="var(--muted)">
              {p.period}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        NAV index (solid) {benchmark ? "and sample benchmark (dashed)" : ""},
        each rebased to 100 at the first displayed quarter. NAV includes capital
        flows; it is not a time-weighted return.
      </figcaption>
    </figure>
  );
}
