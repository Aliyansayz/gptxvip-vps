import type { Candle } from "./data";
export function Candlesticks({
  rows,
  asset,
}: {
  rows: Candle[];
  asset: string;
}) {
  const max = Math.max(...rows.map((c) => c.high)),
    min = Math.min(...rows.map((c) => c.low));
  const y = (v: number) => 20 + ((max - v) / (max - min || 1)) * 200;
  const width = 600 / rows.length;
  return (
    <figure style={{ margin: 0 }}>
      <svg
        viewBox="0 0 700 260"
        role="img"
        aria-label={`${asset} sample OHLC candlesticks, ${rows.length} periods`}
        style={{ width: "100%", display: "block" }}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((n) => (
          <g key={n}>
            <line
              x1="10"
              x2="610"
              y1={20 + n * 200}
              y2={20 + n * 200}
              stroke="var(--line)"
            />
            <text x="620" y={24 + n * 200} fill="var(--muted)" fontSize="12">
              {(max - n * (max - min)).toFixed(0)}
            </text>
          </g>
        ))}
        {rows.map((c, i) => {
          const color = c.close >= c.open ? "#267d66" : "#cd5363";
          return (
            <g key={c.time}>
              <title>
                {c.time}: open {c.open.toFixed(2)}, high {c.high.toFixed(2)},
                low {c.low.toFixed(2)}, close {c.close.toFixed(2)}
              </title>
              <line
                x1={10 + width * (i + 0.5)}
                x2={10 + width * (i + 0.5)}
                y1={y(c.high)}
                y2={y(c.low)}
                stroke={color}
                strokeWidth="2"
              />
              <rect
                x={10 + width * (i + 0.2)}
                y={Math.min(y(c.open), y(c.close))}
                width={width * 0.6}
                height={Math.max(2, Math.abs(y(c.close) - y(c.open)))}
                fill={color}
              />
            </g>
          );
        })}
        <text x="10" y="248" fill="var(--muted)" fontSize="12">
          {rows[0]?.time.replace("T", " ")}
        </text>
        <text x="420" y="248" fill="var(--muted)" fontSize="12">
          {rows.at(-1)?.time.replace("T", " ")}
        </text>
      </svg>
      <figcaption>
        Green: close ≥ open. Red: close &lt; open. Wick spans low to high. All
        prices are fictional USD samples.
      </figcaption>
    </figure>
  );
}
