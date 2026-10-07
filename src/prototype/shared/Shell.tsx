import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  NavigationItem,
  SystemButton as Button,
  tokenStyles,
} from "../../components/designSystem";
import { Dialog } from "./controls";
import { useFocusLayer } from "./focus";
import { readStorage, writeStorage, useStorageStatus } from "./storage";

type ShellProps = {
  slug: string;
  title: string;
  subtitle: string;
  accent?: string;
  tabs: string[];
  view: string;
  onView: (view: string) => void;
  children: ReactNode;
  actions?: ReactNode;
  onReset: () => void;
  theme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
};
export function Shell({
  slug,
  title,
  subtitle,
  accent = "#635bdb",
  tabs,
  view,
  onView,
  children,
  actions,
  onReset,
  theme: controlledTheme,
  onThemeChange,
}: ShellProps) {
  const themeKey = `gptx.prototype.${slug}.theme`;
  const [localTheme, setLocalTheme] = useState<"light" | "dark">(() =>
    readStorage(slug, themeKey) === "dark" ? "dark" : "light",
  );
  const theme = controlledTheme ?? localTheme;
  const setTheme = (value: "light" | "dark") => {
    setLocalTheme(value);
    onThemeChange?.(value);
  };
  const [mobile, setMobile] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const side = useRef<HTMLElement>(null);
  const drawerId = useId();
  const storage = useStorageStatus(slug);
  useFocusLayer(side, mobile, () => setMobile(false));
  useEffect(() => {
    writeStorage(slug, themeKey, theme);
  }, [theme, themeKey, slug]);
  useEffect(() => {
    const wide = matchMedia("(min-width: 701px)");
    const resize = () => {
      if (wide.matches) setMobile(false);
    };
    wide.addEventListener("change", resize);
    return () => wide.removeEventListener("change", resize);
  }, []);
  const localTokens = {
    ...tokenStyles,
    "--accent": accent,
    "--ds-canvas": "var(--canvas)",
    "--ds-surface": "var(--surface)",
    "--ds-raised": "var(--canvas)",
    "--ds-text": "var(--ink)",
    "--ds-secondary": "var(--muted)",
    "--ds-muted": "var(--muted)",
    "--ds-border": "var(--line)",
    "--ds-borderStrong": "var(--line)",
    "--ds-primary": "var(--accent)",
    "--ds-focus": "var(--focus)",
    "--ds-onDanger": "#ffffff",
  } as CSSProperties;
  return (
    <div
      className="product-workspace"
      data-prototype={slug}
      data-theme={theme}
      style={localTokens}
    >
      <aside
        ref={side}
        id={drawerId}
        className={`product-side${mobile ? " open" : ""}`}
        role={mobile ? "dialog" : undefined}
        aria-modal={mobile || undefined}
        aria-label={`${title} navigation`}
        tabIndex={mobile ? -1 : undefined}
      >
        <div className="product-logo">
          <span aria-hidden="true">{title.slice(0, 1)}</span>
          <strong>{title}</strong>
        </div>
        <button
          className="product-drawer-close"
          aria-label="Close navigation"
          onClick={() => setMobile(false)}
        >
          Close <span aria-hidden="true">×</span>
        </button>
        <p className="product-kicker">YOUR WORKSPACE</p>
        <nav aria-label={`${title} pages`}>
          {tabs.map((tab, index) => (
            <NavigationItem
              key={tab}
              selected={view === tab}
              onClick={() => {
                onView(tab);
                setMobile(false);
              }}
            >
              <span className="product-nav-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {tab}
            </NavigationItem>
          ))}
        </nav>
        <div className="product-side-bottom">
          <span className="product-avatar" aria-hidden="true">
            JD
          </span>
          <div>
            <strong>Jordan Davis</strong>
            <small>Sample workspace</small>
          </div>
        </div>
      </aside>
      {mobile && (
        <div
          className="product-backdrop"
          aria-hidden="true"
          onClick={() => setMobile(false)}
        />
      )}
      <main className="product-main">
        <header className="product-header">
          <div className="product-breadcrumb">
            <button
              className="product-menu"
              aria-label="Open navigation"
              aria-expanded={mobile}
              aria-controls={drawerId}
              onClick={() => setMobile((value) => !value)}
            >
              <span aria-hidden="true">☰</span>
            </button>
            <span>
              {title} <b>/</b> {view}
            </span>
          </div>
          <div className="product-header-actions">
            <Button
              variant="secondary"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "Dark theme" : "Light theme"}
            </Button>
            <Button variant="secondary" onClick={() => setResetOpen(true)}>
              Reset demo
            </Button>
          </div>
        </header>
        <div className="product-content">
          <div className="product-heading">
            <div>
              <p className="product-kicker">FICTIONAL DEMO · OCTOBER 2026</p>
              <h1>{view}</h1>
              <p>{subtitle}</p>
            </div>
            <div className="product-actions">{actions}</div>
          </div>
          {storage === "session" && (
            <p className="product-notice" role="status">
              Browser storage is unavailable. You can explore this demo; changes
              will last for this tab.
            </p>
          )}
          {children}
          <footer className="product-footer">
            {title} · Interactive browser demo ·{" "}
            {storage === "session"
              ? "Changes kept in this tab"
              : storage === "saved"
                ? "Changes saved on this device"
                : "Saving demo changes…"}
          </footer>
        </div>
      </main>
      {resetOpen && (
        <Dialog title="Reset this demo?" onClose={() => setResetOpen(false)}>
          <p>This restores {title} sample records on this device.</p>
          <Button
            variant="danger"
            onClick={() => {
              onReset();
              setTheme("light");
              setResetOpen(false);
            }}
          >
            Confirm reset
          </Button>
        </Dialog>
      )}
    </div>
  );
}
