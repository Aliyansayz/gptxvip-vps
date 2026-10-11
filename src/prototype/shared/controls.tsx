import { useId, useRef, type ReactNode } from "react";
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
export function Kpis({
  items,
}: {
  items: { label: string; value: ReactNode; note?: string }[];
}) {
  return (
    <div className="product-kpis">
      {items.map((item) => (
        <Card key={item.label}>
          <p>{item.label}</p>
          <strong>{item.value}</strong>
          {item.note && <small>{item.note}</small>}
        </Card>
      ))}
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
          const value = typeof option === "string" ? option : option.value;
          return (
            <option key={value} value={value}>
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
                background: row.value < 0 ? "var(--negative)" : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
