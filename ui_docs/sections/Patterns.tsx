import { useEffect, useRef, useState, type FormEvent } from "react";
import { Workflow } from "lucide-react";
import {
  SystemButton,
  TextField,
  StatusBadge,
} from "../../src/components/designSystem";
import { PanelTitle, SectionHeading } from "../DocParts";
export default function Patterns() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"empty" | "loading" | "error" | "ready">(
    "empty",
  );
  const [savedName, setSavedName] = useState("");
  const [deleted, setDeleted] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLDivElement>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function save(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a workflow name before saving.");
      field.current?.querySelector("input")?.focus();
      return;
    }
    setError("");
    setDeleted(false);
    setState("loading");
    timer.current = setTimeout(() => {
      setSavedName(name.trim());
      setState("ready");
    }, 800);
  }
  function simulateFailure() {
    clearTimeout(timer.current);
    setState("error");
  }
  function retry() {
    setState("loading");
    timer.current = setTimeout(
      () => setState(savedName ? "ready" : "empty"),
      800,
    );
  }
  return (
    <section className="ds-section ds-last-section">
      <SectionHeading
        id="patterns"
        number="06"
        title="Product patterns"
        description="A local workflow example combining forms, empty states, progress, recovery, tables, and confirmation."
      />
      <div className="ds-pattern-grid">
        <div className="ds-panel">
          <PanelTitle
            title="Create a workflow"
            aside="Demo data stays in this page"
          />
          <form onSubmit={save} className="ds-demo-form">
            <div ref={field}>
              <TextField
                label="Workflow name"
                hint="Use a descriptive name, up to 60 characters."
                maxLength={60}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                }}
                error={error}
                disabled={state === "loading"}
              />
            </div>
            <SystemButton type="submit" loading={state === "loading"}>
              {state === "loading" ? "Saving workflow…" : "Save workflow"}
            </SystemButton>
          </form>
          <p className="ds-section-note">
            Validation keeps focus on the field and explains how to continue.
          </p>
        </div>
        <div className="ds-panel">
          <PanelTitle title="Workflow list" />
          <div className="ds-pattern-actions">
            <SystemButton
              variant="secondary"
              onClick={simulateFailure}
              disabled={state === "loading"}
            >
              Simulate load error
            </SystemButton>
            <SystemButton
              variant="secondary"
              onClick={() => {
                clearTimeout(timer.current);
                setState("empty");
                setSavedName("");
                setDeleted(false);
                setName("");
                setError("");
              }}
              disabled={state === "loading"}
            >
              Reset demo
            </SystemButton>
          </div>
          {state === "empty" && (
            <div className="ds-empty" role="status">
              <Workflow size={28} aria-hidden="true" />
              <h4>{deleted ? "Workflow deleted" : "No workflows yet"}</h4>
              <p>Create your first workflow using the form.</p>
              <SystemButton
                variant="secondary"
                onClick={() => field.current?.querySelector("input")?.focus()}
              >
                Name a workflow
              </SystemButton>
            </div>
          )}
          {state === "loading" && (
            <div className="ds-empty" role="status" aria-busy="true">
              <h4>Loading workflows…</h4>
              <p>Please wait while this example finishes.</p>
            </div>
          )}
          {state === "error" && (
            <div className="ds-empty ds-error-panel" role="alert">
              <h4>Workflows couldn’t load</h4>
              <p>The example request failed. Retry to restore the list.</p>
              <SystemButton onClick={retry}>Retry loading</SystemButton>
            </div>
          )}
          {state === "ready" && (
            <>
              <p role="status" className="ds-section-note">
                Workflow saved.
              </p>
              <div className="ds-table-scroll">
                <table className="ds-workflow-table">
                  <caption>Saved workflows</caption>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">{savedName}</th>
                      <td>
                        <StatusBadge status="neutral">Draft</StatusBadge>
                      </td>
                      <td>
                        <SystemButton
                          variant="danger"
                          onClick={() => dialog.current?.showModal()}
                        >
                          Delete workflow
                        </SystemButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        className="ds-confirmation"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <h3 id="delete-title">Delete workflow?</h3>
        <p id="delete-description">
          Delete “{savedName}” from this demo? This action cannot be undone.
        </p>
        <div className="ds-pattern-actions">
          <SystemButton
            variant="secondary"
            autoFocus
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </SystemButton>
          <SystemButton
            variant="danger"
            onClick={() => {
              dialog.current?.close();
              setSavedName("");
              setDeleted(true);
              setState("empty");
            }}
          >
            Delete workflow
          </SystemButton>
        </div>
      </dialog>
    </section>
  );
}
