import { useLayoutEffect, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import type { InfoPage } from "./Navigation";
import { AppleMark, WindowsMark } from "./Marks";
export type PreviewContent =
  | { kind: "info"; page: InfoPage }
  | { kind: "download"; os: "Mac" | "Windows" }
  | { kind: "command"; title: string };
const pages: Record<
  InfoPage,
  { title: string; body: string; points?: string[] }
> = {
  docs: {
    title: "Start with one command.",
    body: "Basalt brings your everyday developer tools into one command bar.",
    points: [
      "Use Cmd + K (Ctrl + K on Windows) to open the launcher.",
      "Use the arrow keys to choose a command, then Enter to open it.",
      "Search for a build, a project, or an AI question.",
    ],
  },
  pricing: {
    title: "Simple tools. Clear pricing.",
    body: "Plan details will be available when Basalt launches. This concept preview has no checkout or paid subscriptions.",
  },
  changelog: {
    title: "Meet Basalt v2.0.",
    body: "A faster way from an idea to your next action.",
    points: [
      "An AI command bar for your everyday questions.",
      "Projects, build commands, and deployments in one place.",
      "A familiar keyboard-first workflow on Mac and Windows.",
    ],
  },
  blog: {
    title: "A little less friction.",
    body: "Great tools get out of your way. Basalt is designed around a simple idea: keep your work close, and the next action closer.",
  },
  login: {
    title: "Log in to Basalt",
    body: "Account sign-in is not available in this concept preview. You can explore the command bar without an account.",
  },
  learn: {
    title: "Your workspace, one keystroke away.",
    body: "Find a project, run a build, or ask a question without hunting through windows. The command bar keeps your next move in reach.",
    points: [
      "One place for tools, projects, and workflows.",
      "A familiar shortcut for every action.",
      "Built for Mac and Windows.",
    ],
  },
};
export function PreviewDialog({
  content,
  onClose,
}: {
  content: PreviewContent | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useLayoutEffect(() => {
    setCopied(false);
    setFailed(false);
    if (content) dialog.current?.showModal();
    else dialog.current?.close();
  }, [content]);
  const info = content?.kind === "info" ? pages[content.page] : undefined;
  const install =
    content?.kind === "download"
      ? content.os === "Mac"
        ? "brew install basalt"
        : "winget install basalt"
      : "";
  async function copy() {
    try {
      await navigator.clipboard.writeText(install);
      setCopied(true);
      setFailed(false);
    } catch {
      setFailed(true);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="basalt-dialog"
      aria-labelledby="basalt-dialog-title"
      aria-describedby="basalt-dialog-description"
      onClose={() => {
        if (!dialog.current?.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="basalt-dialog-close"
        aria-label="Close dialog"
        onClick={onClose}
        autoFocus
      >
        <X size={18} />
      </button>
      {content?.kind === "download" && (
        <>
          <div className="basalt-dialog-mark">
            {content.os === "Mac" ? <AppleMark /> : <WindowsMark />}
          </div>
          <h2 id="basalt-dialog-title">Basalt for {content.os}</h2>
          <p id="basalt-dialog-description">
            Installer downloads are not available in this concept preview. The
            installation command below is part of the product concept.
          </p>
          <div className="basalt-install-command">
            <code>{install}</code>
            <button onClick={copy} aria-label="Copy installation command">
              {copied ? <Check size={17} /> : <Copy size={17} />}
            </button>
          </div>
          <p className="basalt-dialog-status" role="status">
            {failed
              ? "Clipboard unavailable. Select and copy the command above."
              : copied
                ? "Installation command copied."
                : ""}
          </p>
        </>
      )}
      {info && (
        <>
          <h2 id="basalt-dialog-title">{info.title}</h2>
          <p id="basalt-dialog-description">{info.body}</p>
          {info.points && (
            <ul>
              {info.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {content?.kind === "command" && (
        <>
          <span className="basalt-dialog-eyebrow">COMMAND PREVIEW</span>
          <h2 id="basalt-dialog-title">{content.title}</h2>
          <p id="basalt-dialog-description">
            Your next action, without the context switch. This interactive
            preview selects commands without running them on a project.
          </p>
          <button
            className="basalt-keycap basalt-dialog-return"
            onClick={onClose}
          >
            Back to the command bar
          </button>
        </>
      )}
    </dialog>
  );
}
