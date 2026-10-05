import { CheckCircle2 } from "lucide-react";
import { SectionHeading, PanelTitle } from "../DocParts";
export default function Overview() {
  return (
    <section className="ds-section">
      <SectionHeading
        id="overview"
        number="00"
        title="Overview"
        description="The rules behind a coherent product experience."
      />
      <div className="ds-overview-grid">
        <div className="ds-panel ds-overview-lead">
          <PanelTitle
            eyebrow="OUR APPROACH"
            title="Consistency creates confidence."
          />
          <p>
            Strata is the shared visual language for operational software. It
            supports dense data, frequent decisions, and workflows that need to
            stay understandable under pressure. Use these rules as the default
            when designing new surfaces or extending existing ones.
          </p>
          <div className="ds-principles">
            <div>
              <span>01</span>
              <strong>Clarity over decoration</strong>
              <p>
                Make the next action and current system state immediately
                visible.
              </p>
            </div>
            <div>
              <span>02</span>
              <strong>One pattern, one purpose</strong>
              <p>
                Reuse established behavior before creating a new interaction.
              </p>
            </div>
            <div>
              <span>03</span>
              <strong>Accessible by design</strong>
              <p>Keep contrast, focus, and keyboard access in every state.</p>
            </div>
          </div>
        </div>
        <div className="ds-panel ds-overview-rules">
          <PanelTitle eyebrow="GENERAL USAGE" title="Working rules" />
          <div className="ds-rule">
            <CheckCircle2 size={17} />
            <div>
              <strong>Start with semantic tokens</strong>
              <p>
                Use role names in product UI; reserve raw palette values for
                documentation.
              </p>
            </div>
          </div>
          <div className="ds-rule">
            <CheckCircle2 size={17} />
            <div>
              <strong>Prefer familiar patterns</strong>
              <p>
                Keep navigation, forms, and feedback consistent across
                workspaces.
              </p>
            </div>
          </div>
          <div className="ds-rule">
            <CheckCircle2 size={17} />
            <div>
              <strong>Design every state</strong>
              <p>
                Specify default, hover, focus, disabled, loading, and error
                where relevant.
              </p>
            </div>
          </div>
          <div className="ds-rule">
            <CheckCircle2 size={17} />
            <div>
              <strong>Write for action</strong>
              <p>
                Use short labels, direct verbs, and useful recovery guidance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
