import { ArrowRight, Plus } from "lucide-react";
import { SectionHeading, PanelTitle } from "../DocParts";
import { SystemButton } from "../../src/components/designSystem";
export default function Usage() {
  return (
    <section className="ds-section">
      <SectionHeading
        id="usage"
        number="04"
        title="Component usage"
        description="Behavior and anatomy guidelines for predictable interaction."
      />
      <div className="ds-usage-grid">
        <div className="ds-panel ds-anatomy">
          <PanelTitle
            eyebrow="01 / ANATOMY"
            title="Make every action legible"
          />
          <div className="ds-anatomy-preview">
            <span className="ds-callout callout-one">01</span>
            <span className="ds-callout callout-two">02</span>
            <span className="ds-callout callout-three">03</span>
            <SystemButton>
              <Plus size={17} /> Create workflow <ArrowRight size={16} />
            </SystemButton>
          </div>
          <div className="ds-anatomy-keys">
            <div>
              <b>01</b>
              <span>Leading icon</span>
              <small>
                Supports recognition; never replaces a necessary label.
              </small>
            </div>
            <div>
              <b>02</b>
              <span>Action label</span>
              <small>Describes the result in two or three clear words.</small>
            </div>
            <div>
              <b>03</b>
              <span>Trailing cue</span>
              <small>
                Use only when it adds direction or reveals a destination.
              </small>
            </div>
          </div>
        </div>
        <div className="ds-panel ds-behavior">
          <PanelTitle eyebrow="02 / BEHAVIOR" title="Interaction contract" />
          <div className="ds-behavior-row">
            <span>01</span>
            <div>
              <strong>Focus is visible</strong>
              <p>Keyboard focus uses a 2px blue outline with 2px offset.</p>
            </div>
          </div>
          <div className="ds-behavior-row">
            <span>02</span>
            <div>
              <strong>Feedback is immediate</strong>
              <p>
                Show loading during work, then success or a recoverable error.
              </p>
            </div>
          </div>
          <div className="ds-behavior-row">
            <span>03</span>
            <div>
              <strong>Disabled means unavailable</strong>
              <p>
                Reduce emphasis and explain prerequisites nearby when useful.
              </p>
            </div>
          </div>
          <div className="ds-behavior-row">
            <span>04</span>
            <div>
              <strong>Destructive actions require care</strong>
              <p>
                Use explicit labels and confirmation for permanent outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
