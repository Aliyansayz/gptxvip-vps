import { CircleHelp } from "lucide-react";
import { SectionHeading, PanelTitle, SwatchScale } from "../DocParts";
import {
  tokens,
  contrastRatio,
} from "../../src/components/designSystem/tokens";
const semanticRows = [
  {
    group: "Surface",
    items: [
      ["Canvas", tokens.color.canvas],
      ["Surface", tokens.color.surface],
      ["Raised", tokens.color.raised],
    ],
  },
  {
    group: "Content",
    items: [
      ["Primary", tokens.color.text],
      ["Secondary", tokens.color.secondary],
      ["Muted", tokens.color.muted],
    ],
  },
  {
    group: "Border",
    items: [
      ["Subtle", tokens.color.border],
      ["Strong", tokens.color.borderStrong],
    ],
  },
  {
    group: "Feedback",
    items: [
      ["Success", tokens.color.success],
      ["Warning", tokens.color.warning],
      ["Error", tokens.color.error],
      ["Info", tokens.color.info],
    ],
  },
];
export default function Color() {
  return (
    <section className="ds-section">
      <SectionHeading
        id="color"
        number="01"
        title="Color"
        description="A restrained dark foundation with blue reserved for intent and action."
      />
      <div className="ds-panel">
        <PanelTitle
          eyebrow="01 / PRIMITIVES"
          title="Primitive palette"
          aside="Use semantic roles in product surfaces"
        />
        <SwatchScale
          title="Neutral / Slate"
          data={Object.entries(tokens.palette.neutral)}
        />
        <SwatchScale
          title="Primary / Blue"
          data={Object.entries(tokens.palette.blue)}
        />
      </div>
      <div className="ds-panel ds-semantic-panel">
        <PanelTitle
          eyebrow="02 / APPLICATION"
          title="Semantic roles"
          aside="Tokens describe purpose, not appearance"
        />
        <div className="ds-semantic-grid">
          {semanticRows.map((row) => (
            <div className="ds-semantic-group" key={row.group}>
              <h4>{row.group}</h4>
              {row.items.map(([name, hex]) => (
                <div className="ds-semantic-row" key={name}>
                  <i style={{ background: hex }} />
                  <span>{name}</span>
                  <code>{hex}</code>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="ds-color-note">
          <CircleHelp size={16} />
          <span>
            Interactive blue: default <b>{tokens.color.primary}</b> · hover{" "}
            <b>{tokens.color.hover}</b> · pressed <b>{tokens.color.pressed}</b>{" "}
            · focus ring <b>{tokens.color.focus}</b>. Pair status colors with
            text or icons; color alone must not carry meaning.
          </span>
        </div>
      </div>
      <div className="ds-panel ds-contrast">
        <PanelTitle
          title="Text contrast checks"
          aside="Normal text target: 4.5:1"
        />
        {["primary", "hover", "pressed", "surface", "raised"].map((role) => (
          <p key={role}>
            White on {role}:{" "}
            <strong>
              {contrastRatio(
                tokens.color.onPrimary,
                tokens.color[role as keyof typeof tokens.color],
              ).toFixed(2)}
              :1
            </strong>
          </p>
        ))}
        <p>
          These checks cover the listed pairs. Verify focus, keyboard access,
          and complete product screens separately.
        </p>
      </div>
    </section>
  );
}
