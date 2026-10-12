import type { ReactNode } from "react";

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface ManualFooterProps {
  /** Existing brand markup for the surface, passed through so each keeps its own mark. */
  brand: ReactNode;
  /** Small print under the brand. */
  caption: string;
  links: FooterLink[];
}

/**
 * Shared manual footer.
 *
 * The three manual surfaces each grew their own footer markup. This is the one
 * implementation they now share: brand block on the left, navigation on the
 * right.
 *
 * Links accept either `href` or `onClick` so callers can use in-page anchors
 * or router navigation without wrapping them in an extra element.
 */
export function ManualFooter({ brand, caption, links }: ManualFooterProps) {
  return (
    <footer className="manual-footer">
      <div className="manual-footer-brand">
        {brand}
        <p className="manual-footer-caption">{caption}</p>
      </div>

      <nav className="manual-footer-links" aria-label="Footer">
        {links.map((link) =>
          link.href ? (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ) : (
            <button key={link.label} type="button" onClick={link.onClick}>
              {link.label}
            </button>
          ),
        )}
      </nav>
    </footer>
  );
}

export default ManualFooter;