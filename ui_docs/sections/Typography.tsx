import { ArrowRight } from "lucide-react";
import { SectionHeading, PanelTitle } from "../DocParts";
import { tokens } from "../../src/components/designSystem/tokens";
export default function Typography() {
  return (
    <section className="ds-section">
      <SectionHeading
        id="typography"
        number="02"
        title="Typography"
        description="A clear hierarchy for fast scanning and careful reading."
      />
      <div className="ds-typography-grid">
        <div className="ds-panel">
          <PanelTitle
            eyebrow="01 / TYPE SCALE"
            title="Hierarchy"
            aside="Inter / UI and documentation"
          />
          <div className="ds-type-head">
            <span>STYLE</span>
            <span>SPECIMEN</span>
            <span>SIZE / LINE</span>
            <span>WEIGHT</span>
          </div>
          {tokens.typography.map((row) => (
            <div className="ds-type-row" key={row.name}>
              <span className="ds-type-token">{row.name}</span>
              <span
                className={`ds-type-sample ${row.name}`}
                style={{
                  fontSize: row.fontSize,
                  lineHeight: `${row.lineHeight}px`,
                  fontWeight: row.fontWeight,
                }}
              >
                {row.sample}
              </span>
              <span className="ds-type-spec">
                {row.fontSize} / {row.lineHeight}
              </span>
              <span className="ds-type-spec">{row.fontWeight}</span>
            </div>
          ))}
        </div>
        <div className="ds-panel ds-writing">
          <PanelTitle eyebrow="02 / CONTENT" title="Writing rules" />
          <div className="ds-writing-item">
            <span>01</span>
            <div>
              <strong>Lead with the action.</strong>
              <p>
                Use verbs in buttons and useful nouns in navigation. “Create
                workflow” is clearer than “Submit”.
              </p>
            </div>
          </div>
          <div className="ds-writing-item">
            <span>02</span>
            <div>
              <strong>Be precise and brief.</strong>
              <p>
                Keep labels short; place explanation where decisions need
                context.
              </p>
            </div>
          </div>
          <div className="ds-writing-item">
            <span>03</span>
            <div>
              <strong>Use sentence case.</strong>
              <p>
                Reserve uppercase for short metadata, overlines, and system
                labels.
              </p>
            </div>
          </div>
          <div className="ds-writing-item">
            <span>04</span>
            <div>
              <strong>Make errors useful.</strong>
              <p>State what happened and give a specific next step.</p>
            </div>
          </div>
          <div className="ds-writing-example">
            <small>EXAMPLE / ACTION COPY</small>
            <div>
              <span>✕ &nbsp; Confirm</span>
              <ArrowRight size={14} />
              <strong>✓ &nbsp; Save workflow</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
