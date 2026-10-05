import { useId, useState, type ReactNode } from "react";
import { CopyCode } from "./CopyCode";
import { PanelTitle } from "./DocParts";
export function Playground({
  title,
  controls,
  code,
  children,
  props,
}: {
  title: string;
  controls: ReactNode;
  code: string;
  children: ReactNode;
  props: [string, string, string][];
}) {
  const [view, setView] = useState("preview");
  const id = useId();
  return (
    <div className="ds-panel ds-playground">
      <PanelTitle title={title} aside="Shared app component" />
      <div className="ds-view-switch" role="group" aria-label={`${title} view`}>
        <button
          aria-pressed={view === "preview"}
          aria-controls={id}
          onClick={() => setView("preview")}
        >
          Preview
        </button>
        <button
          aria-pressed={view === "code"}
          aria-controls={id}
          onClick={() => setView("code")}
        >
          Code
        </button>
      </div>
      <div className="ds-playground-controls">{controls}</div>
      <div id={id}>
        {view === "preview" ? (
          <div className="ds-preview">{children}</div>
        ) : (
          <div className="ds-code">
            <pre tabIndex={0}>{code}</pre>
            <CopyCode text={code} />
          </div>
        )}
      </div>
      <div className="ds-table-scroll">
        <table className="ds-props">
          <caption>{title} properties</caption>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Values</th>
              <th scope="col">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {props.map(([name, values, description]) => (
              <tr key={name}>
                <th scope="row">
                  <code>{name}</code>
                </th>
                <td>{values}</td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export function Choice({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div className="ds-choice">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
