import { useState } from "react";
import { LayoutGrid, Workflow, ShieldCheck } from "lucide-react";
import {
  SystemButton,
  TextField,
  StatusBadge,
  NavigationItem,
  type Status,
} from "../../src/components/designSystem";
import { SectionHeading } from "../DocParts";
import { Playground, Choice } from "../Playground";
const importLine =
  'import { SystemButton, TextField, StatusBadge, NavigationItem } from "./src/components/designSystem";\nimport { tokenStyles } from "./src/components/designSystem/tokens";\n\n';
const example = (jsx: string) =>
  importLine + "<div style={tokenStyles}>\n  " + jsx + "\n</div>";
export default function Components() {
  const [variant, setVariant] = useState<"primary" | "secondary" | "danger">(
    "primary",
  );
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [buttonState, setButtonState] = useState("default");
  const [fieldState, setFieldState] = useState("default");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("success");
  const [selected, setSelected] = useState("Overview");
  const [feedback, setFeedback] = useState("");
  const badgeLabels: Record<Status, string> = {
    success: "Completed",
    warning: "Needs review",
    error: "Failed",
    info: "In progress",
    neutral: "Draft",
  };
  return (
    <section className="ds-section">
      <SectionHeading
        id="components"
        number="05"
        title="Components"
        description="Explore live controls, inspect their code, and reuse the same components in product screens."
      />
      <p className="ds-section-note">
        Apply tokenStyles to the parent surface. Hover and keyboard focus are
        real interactions; use Tab to inspect the focus ring.
      </p>
      <div className="ds-playgrounds">
        <Playground
          title="Buttons"
          controls={
            <>
              <Choice
                label="Variant"
                value={variant}
                values={["primary", "secondary", "danger"]}
                onChange={(value) => setVariant(value as typeof variant)}
              />
              <Choice
                label="Size"
                value={size}
                values={["sm", "md", "lg"]}
                onChange={(value) => setSize(value as typeof size)}
              />
              <Choice
                label="State"
                value={buttonState}
                values={["default", "disabled", "loading"]}
                onChange={setButtonState}
              />
            </>
          }
          code={example(
            `<SystemButton variant="${variant}" size="${size}"${buttonState === "disabled" ? " disabled" : buttonState === "loading" ? " loading" : ""}>${variant === "danger" ? "Delete workflow" : "Create workflow"}</SystemButton>`,
          )}
          props={[
            [
              "variant",
              "primary | secondary | danger",
              "Match the action's purpose",
            ],
            ["size", "sm | md | lg", "Control density"],
            [
              "loading",
              "boolean",
              "Shows progress and prevents repeat activation",
            ],
            ["disabled", "boolean", "Makes an unavailable action inactive"],
          ]}
        >
          <SystemButton
            variant={variant}
            size={size}
            loading={buttonState === "loading"}
            disabled={buttonState === "disabled"}
            onClick={() =>
              setFeedback("Example action activated. No workflow was changed.")
            }
          >
            {variant === "danger" ? "Delete workflow" : "Create workflow"}
          </SystemButton>
          <p role="status">{feedback}</p>
        </Playground>
        <Playground
          title="Text fields"
          controls={
            <Choice
              label="Field state"
              value={fieldState}
              values={["default", "disabled", "error"]}
              onChange={setFieldState}
            />
          }
          code={example(
            `<TextField label="Workflow name" hint="Use a descriptive name, up to 60 characters." maxLength={60}${fieldState === "disabled" ? " disabled" : fieldState === "error" ? ' error="Enter a workflow name to continue."' : ""} />`,
          )}
          props={[
            ["label", "string", "Persistent accessible name"],
            ["hint", "string", "Requirements linked to the input"],
            [
              "error",
              "string",
              "Marks invalid and announces recovery guidance",
            ],
            ["disabled", "boolean", "Prevents editing"],
          ]}
        >
          <TextField
            label="Workflow name"
            hint="Use a descriptive name, up to 60 characters."
            maxLength={60}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={fieldState === "disabled"}
            error={
              fieldState === "error"
                ? "Enter a workflow name to continue."
                : undefined
            }
          />
        </Playground>
        <Playground
          title="Status badges"
          controls={
            <Choice
              label="Status"
              value={status}
              values={["success", "warning", "error", "info", "neutral"]}
              onChange={(value) => setStatus(value as Status)}
            />
          }
          code={example(
            `<StatusBadge status="${status}">${badgeLabels[status]}</StatusBadge>`,
          )}
          props={[
            [
              "status",
              "success | warning | error | info | neutral",
              "Semantic status color",
            ],
            [
              "children",
              "ReactNode",
              "Readable state label; never rely on color alone",
            ],
          ]}
        >
          <StatusBadge status={status}>{badgeLabels[status]}</StatusBadge>
        </Playground>
        <Playground
          title="Navigation items"
          controls={
            <p>
              Choose an item below. Admin tools are unavailable until
              permissions are granted.
            </p>
          }
          code={example(
            `<NavigationItem selected={${selected === "Overview"}} onClick={() => console.log("Overview selected")}>Overview</NavigationItem>\n  <NavigationItem disabled>Admin tools</NavigationItem>`,
          )}
          props={[
            [
              "selected",
              "boolean",
              "Exposes the current page with aria-current",
            ],
            ["disabled", "boolean", "Prevents activation"],
            ["onClick", "function", "Connect to the app's navigation"],
          ]}
        >
          <div className="ds-example-nav">
            <NavigationItem
              selected={selected === "Overview"}
              onClick={() => setSelected("Overview")}
            >
              <LayoutGrid size={16} aria-hidden="true" />
              Overview
            </NavigationItem>
            <NavigationItem
              selected={selected === "Workflows"}
              onClick={() => setSelected("Workflows")}
            >
              <Workflow size={16} aria-hidden="true" />
              Workflows
            </NavigationItem>
            <NavigationItem disabled>
              <ShieldCheck size={16} aria-hidden="true" />
              Admin tools
            </NavigationItem>
          </div>
        </Playground>
      </div>
    </section>
  );
}
