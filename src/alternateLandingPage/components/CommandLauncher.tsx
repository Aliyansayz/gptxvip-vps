import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  FolderOpen,
  Rocket,
  Search,
  Sparkles,
  Terminal,
} from "lucide-react";
const commands = [
  {
    id: "deploy",
    label: "Deploy to",
    argument: "staging",
    shortcut: "Cmd + Enter",
    icon: Rocket,
    title: "Deploy to staging",
  },
  {
    id: "build",
    label: "Run build",
    argument: "pnpm build",
    shortcut: "Cmd + B",
    icon: Terminal,
    title: "Run your project build",
  },
  {
    id: "open",
    label: "Open project",
    argument: "~/projects/app",
    shortcut: "Cmd + O",
    icon: FolderOpen,
    title: "Open your project",
  },
  {
    id: "ask",
    label: "Ask Basalt AI",
    argument: "anything",
    shortcut: "Cmd + K",
    icon: Sparkles,
    title: "Ask Basalt AI",
  },
];
export function CommandLauncher({
  onCommand,
}: {
  onCommand: (title: string) => void;
}) {
  const [query, setQuery] = useState("deploy staging");
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const input = useRef<HTMLInputElement>(null);
  const reopenButton = useRef<HTMLButtonElement>(null);
  const focusOnOpen = useRef(false);
  function openCommandBar() {
    if (input.current) input.current.focus();
    else {
      focusOnOpen.current = true;
      setVisible(true);
    }
  }
  useEffect(() => {
    if (!visible) reopenButton.current?.focus();
    else if (focusOnOpen.current) {
      input.current?.focus();
      focusOnOpen.current = false;
    }
  }, [visible]);
  const results =
    !query.trim() || query.trim().toLowerCase() === "deploy staging"
      ? commands
      : commands.filter((command) =>
          query
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .every((word) =>
              `${command.label} ${command.argument}`
                .toLowerCase()
                .includes(word),
            ),
        );

  const selected = results[active];
  useEffect(() => {
    const open = (event: globalThis.KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !(event.target as HTMLElement)?.closest(".basalt-launcher")
      ) {
        if (document.querySelector(".basalt-dialog[open]")) return;
        event.preventDefault();
        openCommandBar();
      }
    };
    document.addEventListener("keydown", open);
    return () => document.removeEventListener("keydown", open);
  }, []);
  function handleKeys(event: KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) =>
        results.length
          ? (index + (event.key === "ArrowDown" ? 1 : -1) + results.length) %
            results.length
          : 0,
      );
      input.current?.focus();
    } else if (event.key === "Enter" && selected) {
      event.preventDefault();
      onCommand(selected.title);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setVisible(false);
    } else if (
      (event.metaKey || event.ctrlKey) &&
      ["b", "o", "k"].includes(event.key.toLowerCase())
    ) {
      event.preventDefault();
      const match = commands.find((command) =>
        command.shortcut.endsWith(event.key.toUpperCase()),
      );
      if (match) onCommand(match.title);
    }
  }
  return (
    <div id="product" className="basalt-product-anchor">
      {visible ? (
        <section
          className="basalt-launcher"
          aria-label="Interactive command bar preview"
          onKeyDown={handleKeys}
        >
          <div className="basalt-command-input-row">
            <Search aria-hidden="true" size={19} />
            <div className="basalt-query">
              <input
                ref={input}
                aria-label="Search commands"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={results.length > 0}
                aria-controls="basalt-results"
                aria-activedescendant={
                  selected ? `basalt-command-${selected.id}` : undefined
                }
                value={query}
                style={{ width: `${Math.max(1, query.length) * 0.54 + 0.3}em` }}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <span className="basalt-caret" aria-hidden="true" />
            </div>
            <span className="basalt-mode">Command</span>
          </div>
          <div
            className="basalt-command-results"
            id="basalt-results"
            role="listbox"
            hidden={!results.length}
            aria-label="Commands"
          >
            {results.map((command, index) => (
              <div
                key={command.id}
                id={`basalt-command-${command.id}`}
                role="option"
                aria-selected={index === active}
                className={`basalt-command-row${index === active ? " is-active" : ""}`}
                onMouseMove={() => setActive(index)}
                onClick={() => onCommand(command.title)}
              >
                <command.icon aria-hidden="true" size={18} />
                <span className="basalt-command-label">
                  {command.label} <code>{command.argument}</code>
                </span>
                <kbd>{command.shortcut}</kbd>
              </div>
            ))}
          </div>
          {!results.length && (
            <div className="basalt-no-results" role="status">
              No matching commands. Try “build”, “project”, or “AI”.
            </div>
          )}
          <div className="basalt-launcher-footer">
            <span>
              <ArrowUp aria-hidden="true" />
              <ArrowDown aria-hidden="true" /> navigate{" "}
              <CornerDownLeft aria-hidden="true" /> open <kbd>esc</kbd> dismiss
            </span>
            <span>basalt</span>
          </div>
        </section>
      ) : (
        <div className="basalt-launcher-dismissed">
          <p>Your next command is one keystroke away.</p>
          <button
            ref={reopenButton}
            id="basalt-reopen"
            onClick={openCommandBar}
          >
            Open command bar <kbd>Cmd + K</kbd>
          </button>
        </div>
      )}
    </div>
  );
}
