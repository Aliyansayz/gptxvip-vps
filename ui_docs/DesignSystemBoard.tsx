import {
  ArrowRight,
  Grid2X2,
  Layers3,
  Menu,
  Sparkles,
  Workflow,
  X,
  ExternalLink,
} from "lucide-react";
import { tokenJSON, tokenStyles } from "../src/components/designSystem/tokens";
import { CopyCode } from "./CopyCode";
import { useDocumentationNavigation } from "./useDocumentationNavigation";
import "./design-system.css";
import Overview from "./sections/Overview";
import Color from "./sections/Color";
import Typography from "./sections/Typography";
import Foundations from "./sections/Foundations";
import Usage from "./sections/Usage";
import Components from "./sections/Components";
import Patterns from "./sections/Patterns";
const sections = [
  { id: "overview", number: "00", label: "Overview" },
  { id: "color", number: "01", label: "Color" },
  { id: "typography", number: "02", label: "Typography" },
  { id: "foundations", number: "03", label: "Foundations" },
  { id: "usage", number: "04", label: "Component usage" },
  { id: "components", number: "05", label: "Components" },
  { id: "patterns", number: "06", label: "Product patterns" },
] as const;

export default function DesignSystemBoard() {
  const {
    activeSection,
    navOpen,
    setNavOpen,
    sidebarRef,
    menuRef,
    workspaceRef,
  } = useDocumentationNavigation(sections);
  return (
    <div className="ds-app" style={tokenStyles}>
      <a className="ds-skip" href="#main-content">
        Skip to documentation
      </a>
      {navOpen && (
        <button
          className="ds-nav-overlay"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id="documentation-navigation"
        className={`ds-sidebar ${navOpen ? "is-open" : ""}`}
      >
        <div className="ds-brand">
          <div className="ds-brand-mark">
            <Workflow size={21} strokeWidth={2.4} />
          </div>
          <div>
            <strong>
              STRATA<span> / UI</span>
            </strong>
            <small>DESIGN SYSTEM</small>
          </div>
          <button
            className="ds-mobile-close"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
        <div className="ds-side-divider" />
        <div className="ds-nav-kicker">
          DOCUMENTATION <span>{String(sections.length).padStart(2, "0")}</span>
        </div>
        <nav aria-label="Design system sections">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-current={
                activeSection === section.id ? "location" : undefined
              }
              className={activeSection === section.id ? "active" : ""}
              onClick={() => {
                setNavOpen(false);
              }}
            >
              <span className="ds-nav-number">{section.number}</span>
              <span>{section.label}</span>
              <ArrowRight size={15} />
            </a>
          ))}
        </nav>
        <div className="ds-sidebar-bottom">
          <div className="ds-version-dot" />
          <div>
            <strong>System v1.0</strong>
            <span>Shared tokens + examples</span>
          </div>
          <ExternalLink size={14} />
        </div>
      </aside>

      <div className="ds-workspace" ref={workspaceRef}>
        <header className="ds-topbar">
          <div className="ds-topbar-left">
            <button
              ref={menuRef}
              aria-expanded={navOpen}
              aria-controls="documentation-navigation"
              className="ds-menu"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={19} />
            </button>
            <span>Workspace</span>
            <span className="ds-crumb-slash">/</span>
            <strong>Design system</strong>
            <span className="ds-topbar-tag">FOUNDATIONS</span>
          </div>
          <div className="ds-topbar-right">
            <span className="ds-online">
              <i /> Component reference
            </span>
            <div className="ds-topbar-separator" />
            <span>v1.0.0</span>
            <div className="ds-avatar">S</div>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="ds-main">
          <div className="ds-page-breadcrumb">
            DESIGN SYSTEM <span>/</span> DOCUMENTATION BOARD <span>/</span> 2026
          </div>
          <div className="ds-hero">
            <div className="ds-hero-copy">
              <div className="ds-hero-pill">
                <span /> THE SINGLE SOURCE OF TRUTH
              </div>
              <h1>
                Built for complex work.
                <br />
                <em>Designed for clarity.</em>
              </h1>
              <p>
                A practical design language for enterprise automation. Every
                token, pattern, and component is made to keep powerful workflows
                predictable and easy to use.
              </p>
              <div className="ds-hero-actions">
                <a href="#components" className="ds-primary-action">
                  Explore components <ArrowRight size={16} />
                </a>
                <CopyCode
                  text={tokenJSON}
                  label="Copy core tokens"
                  showFallback
                />
              </div>
            </div>
            <div className="ds-hero-art" aria-hidden="true">
              <div className="ds-art-grid" />
              <div className="ds-art-orbit orbit-one" />
              <div className="ds-art-orbit orbit-two" />
              <div className="ds-art-center">
                <Workflow size={38} strokeWidth={1.4} />
              </div>
              <div className="ds-art-node node-one">
                <Grid2X2 size={14} />
              </div>
              <div className="ds-art-node node-two">
                <Sparkles size={15} />
              </div>
              <div className="ds-art-node node-three">
                <Layers3 size={15} />
              </div>
              <div className="ds-art-label">
                SYSTEM / 01 <span>● LIVE</span>
              </div>
            </div>
          </div>

          <div className="ds-metrics">
            <div>
              <span>01 / SYSTEM</span>
              <strong>{sections.length} sections</strong>
              <small>Complete reference</small>
            </div>
            <div>
              <span>02 / FOUNDATION</span>
              <strong>2 palettes</strong>
              <small>Neutral + blue</small>
            </div>
            <div>
              <span>03 / COMPONENTS</span>
              <strong>4 families</strong>
              <small>States and usage</small>
            </div>
            <div>
              <span>04 / PRINCIPLE</span>
              <strong>Contrast checked</strong>
              <small>Documented text pairs</small>
            </div>
          </div>

          <Overview />

          <Color />

          <Typography />

          <Foundations />

          <Usage />

          <Components />

          <Patterns />

          <footer className="ds-footer">
            <div>
              <div className="ds-footer-mark">
                <Workflow size={17} />
              </div>
              <span>STRATA / UI</span>
              <i /> Enterprise automation design system
            </div>
            <span>DOCUMENTATION BOARD · V1.0 · 2026</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
