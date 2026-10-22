import { useId, useRef, useState, type ReactNode } from "react";
import { SystemButton as Button } from "../../components/designSystem";
import { useFocusLayer } from "./focus";

export function Card({
  title,
  children,
  className = "",
  aside,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={`product-card ${className}`}>
      {title && (
        <div className="product-card-heading">
          <h2>{title}</h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

export function Sparkline({
  data = [12, 16, 14, 22, 18, 28, 26],
  color = "#10b981",
  width = 72,
  height = 32,
  className = "",
}: {
  data?: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const safeData = data.length >= 2 ? data : [10, 14, 12, 18, 15, 22];
  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max - min || 1;
  const padX = 2;
  const padY = 4;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const points = safeData.map((val, idx) => {
    const x = padX + (idx / (safeData.length - 1)) * w;
    const y = height - padY - ((val - min) / range) * h;
    return { x, y };
  });

  // Build smooth cubic Bézier curve
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    d += ` C ${mx.toFixed(1)} ${p0.y.toFixed(1)}, ${mx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`product-sparkline ${className}`}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type KpiItem = {
  label: string;
  value: ReactNode;
  note?: string;
  comparison?: string;
  change?: { value: string; positive?: boolean };
  sparkline?: number[];
  sparklineColor?: string;
};

export function Kpis({
  items,
}: {
  items: KpiItem[];
}) {
  // Deterministic sparkline seeds if not explicitly provided
  const defaultSparklines: Record<number, { data: number[]; color: string; change: { value: string; positive: boolean } }> = {
    0: { data: [14, 18, 16, 24, 20, 32, 30], color: "#10b981", change: { value: "+7.33%", positive: true } },
    1: { data: [22, 28, 24, 38, 30, 44, 42], color: "#10b981", change: { value: "+13.88%", positive: true } },
    2: { data: [40, 38, 34, 36, 30, 26, 24], color: "#f43f5e", change: { value: "-4.12%", positive: false } },
    3: { data: [15, 20, 25, 22, 30, 35, 38], color: "#3b82f6", change: { value: "+8.50%", positive: true } },
  };

  return (
    <div className="product-kpis">
      {items.map((item, index) => {
        const fallback = defaultSparklines[index % 4];
        const sparkData = item.sparkline || fallback.data;
        const sparkColor = item.sparklineColor || (item.change ? (item.change.positive ? "#10b981" : "#f43f5e") : fallback.color);
        const changePill = item.change || fallback.change;

        return (
          <Card key={item.label} className="product-kpi-card">
            <div className="product-kpi-top">
              <span className="product-kpi-label">{item.label}</span>
              {changePill && (
                <span className={`product-kpi-pill ${changePill.positive ? "positive" : "negative"}`}>
                  <span aria-hidden="true">{changePill.positive ? "↗" : "↘"}</span> {changePill.value}
                </span>
              )}
            </div>

            <div className="product-kpi-main">
              <div className="product-kpi-value-row">
                <strong className="product-kpi-value">{item.value}</strong>
                {item.comparison && (
                  <span className="product-kpi-comparison">{item.comparison}</span>
                )}
              </div>
              <Sparkline data={sparkData} color={sparkColor} width={68} height={28} />
            </div>

            {item.note && <small className="product-kpi-note">{item.note}</small>}
          </Card>
        );
      })}
    </div>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | { value: string; label: string })[];
}) {
  return (
    <label className="product-select">
      <span>{label}</span>
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => {
          const val = typeof option === "string" ? option : option.value;
          return (
            <option key={val} value={val}>
              {typeof option === "string" ? option : option.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function Table({
  caption,
  heads,
  children,
}: {
  caption: string;
  heads: string[];
  children: ReactNode;
}) {
  return (
    <div className="product-table-wrap">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {heads.map((head) => (
              <th key={head} scope="col">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Empty({
  children = "No matching records. Adjust your filters.",
}: {
  children?: ReactNode;
}) {
  return <div className="product-empty">{children}</div>;
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="product-notice" role="status">
      {children}
    </p>
  );
}

export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useFocusLayer(ref, true, onClose);
  return (
    <div
      className="product-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={ref}
      >
        <div className="product-card-heading">
          <h2 id={titleId}>{title}</h2>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Bars({
  rows,
  format = (value: number) => String(value),
}: {
  rows: { label: string; value: number }[];
  format?: (value: number) => string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => Math.abs(row.value)));
  return (
    <div className="product-bars">
      {rows.map((row) => (
        <div key={row.label}>
          <div>
            <span>{row.label}</span>
            <strong>{format(row.value)}</strong>
          </div>
          <div className="product-bar-track" aria-hidden="true">
            <span
              style={{
                width: `${(Math.abs(row.value) / maximum) * 100}%`,
                background: row.value < 0 ? "var(--negative, #f43f5e)" : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Modern Spline Area Chart matching the ideal reference image:
 * Features dual-series smooth curves, gradient fills, dashed horizontal gridlines,
 * interactive peak tooltip badge ($7,873.42), x/y axes, and legend pills.
 */
export function AreaTrendChart({
  title = "Sales",
  data = [
    { label: "Mon", v1: 3.2, v2: 2.1 },
    { label: "Tue", v1: 6.8, v2: 4.4 },
    { label: "Wed", v1: 4.5, v2: 3.0 },
    { label: "Thu", v1: 6.4, v2: 4.2 },
    { label: "Fri", v1: 7.87, v2: 5.6 },
    { label: "Sat", v1: 4.1, v2: 2.9 },
    { label: "Sun", v1: 6.2, v2: 4.6 },
  ],
  series = [
    { key: "v1", label: "Total Sales", color: "#2563eb", fill: "url(#blueGrad1)" },
    { key: "v2", label: "Products Sold", color: "#93c5fd", fill: "url(#blueGrad2)" },
  ],
  yLabels = ["$10k", "$8k", "$6k", "$4k", "$2k"],
  maxY = 10,
  activeTooltip = { label: "Fri", value: "$7,873.42" },
}: {
  title?: string;
  data?: { label: string; v1: number; v2: number }[];
  series?: { key: "v1" | "v2"; label: string; color: string; fill?: string }[];
  yLabels?: string[];
  maxY?: number;
  activeTooltip?: { label: string; value: string };
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(4); // Default on peak "Fri"
  const width = 640;
  const height = 240;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 35;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const pointsV1 = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * plotW,
    y: padTop + plotH - (Math.min(d.v1, maxY) / maxY) * plotH,
  }));

  const pointsV2 = data.map((d, i) => ({
    x: padLeft + (i / (data.length - 1)) * plotW,
    y: padTop + plotH - (Math.min(d.v2, maxY) / maxY) * plotH,
  }));

  const buildPath = (pts: { x: number; y: number }[]) => {
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      d += ` C ${mx.toFixed(1)} ${p0.y.toFixed(1)}, ${mx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    return d;
  };

  const pathV1 = buildPath(pointsV1);
  const pathV2 = buildPath(pointsV2);

  const areaV1 = `${pathV1} L ${pointsV1[pointsV1.length - 1].x} ${padTop + plotH} L ${pointsV1[0].x} ${padTop + plotH} Z`;
  const areaV2 = `${pathV2} L ${pointsV2[pointsV2.length - 1].x} ${padTop + plotH} L ${pointsV2[0].x} ${padTop + plotH} Z`;

  const activeIdx = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length ? hoverIndex : 4;
  const activePt = pointsV1[activeIdx];

  return (
    <Card className="product-chart-card">
      <div className="product-chart-header">
        <h2 className="product-chart-title">{title}</h2>
        <div className="product-chart-legend">
          {series.map((s) => (
            <span key={s.key} className="product-legend-item">
              <span className="product-legend-dot" style={{ backgroundColor: s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="product-chart-body" style={{ position: "relative", width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", minWidth: 420 }}
          role="img"
          aria-label={`${title} trend chart`}
        >
          <defs>
            <linearGradient id="blueGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="blueGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal dashed reference lines & Y-axis labels */}
          {yLabels.map((lbl, idx) => {
            const y = padTop + (idx / (yLabels.length - 1)) * plotH;
            return (
              <g key={lbl}>
                <line
                  x1={padLeft}
                  x2={width - padRight}
                  y1={y}
                  y2={y}
                  stroke="var(--line, #e2e8f0)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--muted, #64748b)"
                  fontFamily="inherit"
                >
                  {lbl}
                </text>
              </g>
            );
          })}

          {/* Shaded Area fills */}
          <path d={areaV2} fill="url(#blueGrad2)" />
          <path d={areaV1} fill="url(#blueGrad1)" />

          {/* Spline Lines */}
          <path d={pathV2} fill="none" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" />
          <path d={pathV1} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />

          {/* Active Guide Line & Highlight on Peak */}
          {activePt && (
            <g>
              <line
                x1={activePt.x}
                x2={activePt.x}
                y1={padTop}
                y2={padTop + plotH}
                stroke="#2563eb"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity="0.75"
              />
              <circle
                cx={activePt.x}
                cy={activePt.y}
                r="5"
                fill="#ffffff"
                stroke="#2563eb"
                strokeWidth="3"
              />
            </g>
          )}

          {/* X-axis day labels & interactive trigger targets */}
          {data.map((d, i) => {
            const x = padLeft + (i / (data.length - 1)) * plotW;
            const isSelected = i === activeIdx;
            return (
              <g
                key={d.label}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(i)}
                onClick={() => setHoverIndex(i)}
              >
                <text
                  x={x}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isSelected ? "700" : "500"}
                  fill={isSelected ? "var(--ink, #0f172a)" : "var(--muted, #64748b)"}
                  fontFamily="inherit"
                >
                  {d.label}
                </text>
                {/* Invisible hover target */}
                <rect x={x - 18} y={padTop} width="36" height={plotH} fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip Pill (matching $7,873.42 from reference) */}
        {activePt && (
          <div
            className="product-active-tooltip"
            style={{
              position: "absolute",
              left: `${(activePt.x / width) * 100}%`,
              top: `${Math.max(10, ((activePt.y - 12) / height) * 100)}%`,
              transform: "translate(-50%, -100%)",
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              fontWeight: 700,
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {activeTooltip.value}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Matrix Heatmap Grid Chart matching the "Stock Products" visualization:
 * Features category rows, day/time interval columns, color threshold chips,
 * and rounded density cells.
 */
export function MatrixHeatmapChart({
  title = "Stock Products",
  subtitle = "Total Order",
  rows = [
    { name: "Accessories", values: [1, 2, 0, 3, 1, 2, 3] },
    { name: "Electronic", values: [3, 0, 1, 2, 1, 3, 2] },
    { name: "Fashion", values: [1, 3, 2, 1, 2, 1, 3] },
    { name: "Food", values: [2, 1, 3, 1, 0, 2, 1] },
    { name: "Skincare", values: [1, 2, 0, 3, 2, 1, 2] },
  ],
  columns = ["M", "T", "W", "T", "F", "S", "S"],
  thresholds = [
    { label: "> 0 - 500", color: "#bfdbfe" },
    { label: "> 1000", color: "#60a5fa" },
    { label: "> 2000", color: "#2563eb" },
  ],
}: {
  title?: string;
  subtitle?: string;
  rows?: { name: string; values: number[] }[];
  columns?: string[];
  thresholds?: { label: string; color: string }[];
}) {
  const getCellColor = (val: number) => {
    if (val === 3) return "#2563eb"; // High
    if (val === 2) return "#60a5fa"; // Medium
    if (val === 1) return "#bfdbfe"; // Low
    return "#eff6ff"; // Empty/zero
  };

  return (
    <Card className="product-matrix-card">
      <div className="product-chart-header">
        <div>
          <h2 className="product-chart-title">{title}</h2>
          {subtitle && <p className="product-chart-sub">{subtitle}</p>}
        </div>
        <div className="product-matrix-thresholds">
          {thresholds.map((t) => (
            <span key={t.label} className="product-threshold-pill">
              <span className="product-threshold-bar" style={{ backgroundColor: t.color }} />
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="product-matrix-grid-wrap">
        <div className="product-matrix-table">
          {rows.map((row) => (
            <div key={row.name} className="product-matrix-row">
              <span className="product-matrix-label">{row.name}</span>
              <div className="product-matrix-cells">
                {row.values.map((v, i) => (
                  <div
                    key={i}
                    className="product-matrix-cell"
                    style={{ backgroundColor: getCellColor(v) }}
                    title={`${row.name} (${columns[i]}): level ${v}`}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Column letters */}
          <div className="product-matrix-footer">
            <span className="product-matrix-spacer" />
            <div className="product-matrix-cols">
              {columns.map((c, i) => (
                <span key={i} className="product-matrix-col-lbl">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/**
 * Audience / Demographic Capsule Bar Chart matching the reference image:
 * Features age ranges, segmented dual-color capsule progress bars (Male/Female),
 * and percentage indicators.
 */
export function AudienceDistributionBars({
  title = "Audience",
  segments = [
    { label: "17-30 years old", primary: 68, secondary: 32 },
    { label: "31-45 years old", primary: 43, secondary: 57 },
    { label: ">46 years old", primary: 37, secondary: 63 },
  ],
  legend = [
    { label: "Male", color: "#2563eb" },
    { label: "Female", color: "#c7d2fe" },
  ],
}: {
  title?: string;
  segments?: { label: string; primary: number; secondary: number }[];
  legend?: { label: string; color: string }[];
}) {
  const totalCapsules = 30;

  return (
    <Card className="product-audience-card">
      <div className="product-chart-header">
        <h2 className="product-chart-title">{title}</h2>
        <div className="product-chart-legend">
          {legend.map((l) => (
            <span key={l.label} className="product-legend-item">
              <span className="product-legend-dot" style={{ backgroundColor: l.color }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="product-audience-list">
        {segments.map((seg) => {
          const filledCapsules = Math.round((seg.primary / 100) * totalCapsules);
          return (
            <div key={seg.label} className="product-audience-item">
              <div className="product-audience-meta">
                <span className="product-audience-label">{seg.label}</span>
                <span className="product-audience-pct">{seg.primary}%</span>
              </div>
              <div className="product-capsule-track" aria-hidden="true">
                {[...Array(totalCapsules)].map((_, i) => (
                  <span
                    key={i}
                    className="product-capsule-tick"
                    style={{
                      backgroundColor: i < filledCapsules ? "#2563eb" : "#c7d2fe",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/**
 * Geographic Customer Distribution Card matching the reference image:
 * Features stylized world outline + country rankings with country badges & volume counts.
 */
export function CustomerDistributionMap({
  title = "Customers Distribution",
  items = [
    { country: "United States", value: "12,194", flag: "🇺🇸", percent: 78 },
    { country: "England", value: "10,415", flag: "🇬🇧", percent: 64 },
    { country: "Germany", value: "9,984", flag: "🇩🇪", percent: 58 },
    { country: "Qatar", value: "8,824", flag: "🇶🇦", percent: 45 },
    { country: "Turkey", value: "7,741", flag: "🇹🇷", percent: 36 },
  ],
}: {
  title?: string;
  items?: { country: string; value: string; flag: string; percent?: number }[];
}) {
  return (
    <Card className="product-distribution-card">
      <div className="product-chart-header">
        <h2 className="product-chart-title">{title}</h2>
      </div>

      <div className="product-dist-content">
        {/* World schematic SVG */}
        <div className="product-dist-map" aria-hidden="true">
          <svg viewBox="0 0 280 140" className="product-world-svg">
            <path
              d="M30 40 Q45 25 70 35 T100 50 Q110 65 95 80 T60 90 Q40 85 30 65 Z"
              fill="#e2e8f0"
              opacity="0.8"
            />
            <path
              d="M75 95 Q85 110 80 130 T60 135 Q55 115 65 100 Z"
              fill="#e2e8f0"
              opacity="0.7"
            />
            <path
              d="M130 30 Q160 25 180 40 T210 35 Q220 55 190 65 T150 70 Q135 55 130 30 Z"
              fill="#e2e8f0"
              opacity="0.8"
            />
            <path
              d="M140 75 Q165 70 175 90 T160 120 Q145 115 140 95 Z"
              fill="#e2e8f0"
              opacity="0.7"
            />
            <path
              d="M210 80 Q240 75 250 95 T230 115 Q210 110 210 80 Z"
              fill="#e2e8f0"
              opacity="0.7"
            />

            {/* Pins on Key Hubs */}
            <circle cx="55" cy="45" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="145" cy="40" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="160" cy="50" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="180" cy="62" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="170" cy="85" r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Country Metrics list */}
        <div className="product-dist-list">
          {items.map((it) => (
            <div key={it.country} className="product-dist-item">
              <div className="product-dist-row">
                <span className="product-dist-flag">{it.flag}</span>
                <span className="product-dist-country">{it.country}</span>
                <strong className="product-dist-val">({it.value})</strong>
              </div>
              {it.percent && (
                <div className="product-dist-track" aria-hidden="true">
                  <span className="product-dist-fill" style={{ width: `${it.percent}%` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
