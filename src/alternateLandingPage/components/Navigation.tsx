import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { AppleMark, Brand } from "./Marks";
export type InfoPage =
  "docs" | "pricing" | "changelog" | "blog" | "login" | "learn";
export function Navigation({
  onInfo,
  onDownload,
}: {
  onInfo: (page: InfoPage) => void;
  onDownload: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 1000) setOpen(false);
    };
    document.addEventListener("keydown", close);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);
  const info = (page: InfoPage) => {
    if (open) menuButton.current?.focus({ preventScroll: true });
    setOpen(false);
    onInfo(page);
  };
  return (
    <header className="basalt-navigation">
      <a href="#top" className="basalt-home" aria-label="Basalt home">
        <Brand />
      </a>
      <nav
        id="basalt-navigation-links"
        className={`basalt-nav-links${open ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        <a href="#product" onClick={() => setOpen(false)}>
          Product
        </a>
        {(
          [
            ["Docs", "docs"],
            ["Pricing", "pricing"],
            ["Changelog", "changelog"],
            ["Blog", "blog"],
          ] as const
        ).map(([label, page]) => (
          <button key={page} onClick={() => info(page)}>
            {label}
          </button>
        ))}
      </nav>
      <div className="basalt-nav-actions">
        <button className="basalt-login" onClick={() => info("login")}>
          Log in
        </button>
        <button className="basalt-nav-download" onClick={onDownload}>
          <AppleMark />
          Download
        </button>
        <button
          ref={menuButton}
          className="basalt-menu-toggle"
          aria-expanded={open}
          aria-controls="basalt-navigation-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
