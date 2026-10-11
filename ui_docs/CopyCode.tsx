import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { SystemButton } from "../src/components/designSystem";

export function CopyCode({
  text,
  label = "Copy code",
  showFallback = false,
}: {
  text: string;
  label?: string;
  showFallback?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("failed");
    }
  }
  return (
    <div className="ds-copy">
      <SystemButton variant="secondary" onClick={copy}>
        {status === "copied" ? (
          <Check aria-hidden="true" size={16} />
        ) : (
          <Copy aria-hidden="true" size={16} />
        )}
        {status === "copied" ? "Copied" : label}
      </SystemButton>
      <span className="ds-copy-status" role="status">
        {status === "failed"
          ? "Clipboard unavailable. Select and copy the text below."
          : status === "copied"
            ? "Copied to clipboard."
            : ""}
      </span>
      {(showFallback || status === "failed") && (
        <details open={status === "failed" || undefined}>
          <summary>View {showFallback ? "tokens" : "copyable text"}</summary>
          <pre tabIndex={0}>{text}</pre>
        </details>
      )}
    </div>
  );
}
