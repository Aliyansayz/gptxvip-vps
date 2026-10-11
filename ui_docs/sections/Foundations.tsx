import { SectionHeading, PanelTitle } from "../DocParts";
import { tokens } from "../../src/components/designSystem/tokens";
export default function Foundations() {
  return (
    <section className="ds-section">
      <SectionHeading
        id="foundations"
        number="03"
        title="Foundations"
        description="The measurements that make every surface feel related."
      />
      <div className="ds-foundation-grid">
        <div className="ds-panel">
          <PanelTitle eyebrow="01 / SPACING" title="4px base unit" />
          <p className="ds-panel-intro">
            Use consistent increments for padding, gaps, and section rhythm.
          </p>
          <div className="ds-spacing-list">
            {tokens.spacing
              .map((px) => [String(px / 4).padStart(2, "0"), px])
              .map(([token, px]) => (
                <div key={token}>
                  <code>{token}</code>
                  <span className="ds-spacing-track">
                    <i style={{ width: `${Number(px) * 2}px` }} />
                  </span>
                  <b>{px}px</b>
                </div>
              ))}
          </div>
        </div>
        <div className="ds-panel">
          <PanelTitle eyebrow="02 / CORNERS" title="Border radius" />
          <p className="ds-panel-intro">
            Round controls gently; reserve full pills for compact labels.
          </p>
          <div className="ds-radius-list">
            {Object.entries(tokens.radius).map(([token, radius]) => (
              <div key={token}>
                <div style={{ borderRadius: radius }} />
                <strong>{token}</strong>
                <span>{radius}px</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ds-panel">
          <PanelTitle eyebrow="03 / DEPTH" title="Elevation" />
          <p className="ds-panel-intro">
            Use depth to distinguish layers, not to decorate flat content.
          </p>
          <div className="ds-elevation-list">
            <div>
              <i className="elevation-0" />
              <span>
                <strong>Level 0</strong>
                <small>Base surfaces</small>
              </span>
            </div>
            <div>
              <i className="elevation-1" />
              <span>
                <strong>Level 1</strong>
                <small>Cards & panels</small>
              </span>
            </div>
            <div>
              <i className="elevation-2" />
              <span>
                <strong>Level 2</strong>
                <small>Menus & overlays</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
