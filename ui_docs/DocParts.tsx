export function SectionHeading({
  id,
  number,
  title,
  description,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="ds-section-heading" id={id}>
      <div className="ds-section-index">DS — {number}</div>
      <div className="ds-section-title-line">
        <h2>{title}</h2>
        <span className="ds-heading-rule" />
      </div>
      <p>{description}</p>
    </div>
  );
}

export function PanelTitle({
  eyebrow,
  title,
  aside,
}: {
  eyebrow?: string;
  title: string;
  aside?: string;
}) {
  return (
    <div className="ds-panel-title">
      <div>
        {eyebrow && <span>{eyebrow}</span>}
        <h3>{title}</h3>
      </div>
      {aside && <small>{aside}</small>}
    </div>
  );
}

export function SwatchScale({
  title,
  data,
}: {
  title: string;
  data: [string, string][];
}) {
  return (
    <div className="ds-scale">
      <div className="ds-scale-label">
        <strong>{title}</strong>
        <span>100 — 900</span>
      </div>
      <div className="ds-swatch-grid">
        {data.map(([step, hex]) => (
          <div className="ds-swatch" key={step}>
            <div className="ds-swatch-color" style={{ background: hex }} />
            <div className="ds-swatch-meta">
              <b>{step}</b>
              <span>{hex}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
