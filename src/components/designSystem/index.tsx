import { useId, type ComponentProps, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "../../devLushArea/agentMarketplace/components/ui/button";
import { Badge } from "../../devLushArea/agentMarketplace/components/ui/badge";
import "./components.css";

export { tokens, tokenStyles } from "./tokens";

export function SystemButton({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <Button
      {...props}
      type={type}
      variant={
        variant === "danger"
          ? "destructive"
          : variant === "primary"
            ? "default"
            : "secondary"
      }
      size={size === "md" ? "default" : size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`ds-control-button ${variant} ${className}`}
    >
      {loading && <LoaderCircle className="ds-spinner" aria-hidden="true" />}
      {children}
    </Button>
  );
}

export function TextField({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string; error?: string }) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const description =
    [
      props["aria-describedby"],
      hint && `${fieldId}-hint`,
      error && `${fieldId}-error`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={`ds-control-field ${className}`}>
      <label htmlFor={fieldId}>{label}</label>
      <input
        {...props}
        id={fieldId}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={description}
      />
      {hint && <p id={`${fieldId}-hint`}>{hint}</p>}
      {error && (
        <p id={`${fieldId}-error`} className="ds-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export type Status = "success" | "warning" | "error" | "info" | "neutral";
export function StatusBadge({
  status = "neutral",
  children,
}: {
  status?: Status;
  children: ReactNode;
}) {
  return (
    <Badge variant="outline" className={`ds-control-badge ${status}`}>
      <span aria-hidden="true">●</span>
      {children}
    </Badge>
  );
}

export function NavigationItem({
  selected,
  children,
  ...props
}: ComponentProps<"button"> & { selected?: boolean }) {
  return (
    <button
      {...props}
      type="button"
      className="ds-control-navigation"
      aria-current={selected ? "page" : undefined}
    >
      {children}
    </button>
  );
}
