import { useState } from "react";
import {
  ArrowDownRight, ArrowRight, Check, CheckCircle2, ChevronDown,
  CircleHelp, Copy, ExternalLink, FileText, Grid2X2, Layers3, LayoutGrid,
  Menu, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Workflow, X,
} from "lucide-react";
import "./design-system.css";

const sections = [
  { id: "overview", number: "00", label: "Overview" },
  { id: "color", number: "01", label: "Color" },
  { id: "typography", number: "02", label: "Typography" },
  { id: "foundations", number: "03", label: "Foundations" },
  { id: "usage", number: "04", label: "Component usage" },
  { id: "components", number: "05", label: "Components" },
] as const;

const neutral = [
  ["100", "#F4F6F8"], ["200", "#DCE1E8"], ["300", "#B8C0CD"],
  ["400", "#8E99A9"], ["500", "#657183"], ["600", "#465263"],
  ["700", "#303B4A"], ["800", "#202A38"], ["900", "#111A27"],
];
const blue = [
  ["100", "#E8F2FF"], ["200", "#BEDBFF"], ["300", "#8BC0FF"],
  ["400", "#5BA4FF"], ["500", "#368BFA"], ["600", "#2474E8"],
  ["700", "#1E5EC0"], ["800", "#1D4A94"], ["900", "#1B396D"],
];

function SectionHeading({ id, number, title, description }: { id: string; number: string; title: string; description: string }) {
  return (
    <div className="ds-section-heading" id={id}>
      <div className="ds-section-index">DS — {number}</div>
      <div className="ds-section-title-line">
        <h2>{title}</h2>
        <span className="ds-heading-rule" />
      </div>
      <p>{description}</p>
    </div>
  );
}

function PanelTitle({ eyebrow, title, aside }: { eyebrow?: string; title: string; aside?: string }) {
  return <div className="ds-panel-title"><div>{eyebrow && <span>{eyebrow}</span>}<h3>{title}</h3></div>{aside && <small>{aside}</small>}</div>;
}

function SwatchScale({ title, data }: { title: string; data: string[][] }) {
  return <div className="ds-scale"><div className="ds-scale-label"><strong>{title}</strong><span>100 — 900</span></div><div className="ds-swatch-grid">{data.map(([step, hex]) => <div className="ds-swatch" key={step}><div className="ds-swatch-color" style={{ background: hex }} /><div className="ds-swatch-meta"><b>{step}</b><span>{hex}</span></div></div>)}</div></div>;
}

const semanticRows = [
  { group: "Surface", items: [["Canvas", "#0B111C"], ["Surface", "#111A27"], ["Raised", "#202A38"]] },
  { group: "Content", items: [["Primary", "#F4F6F8"], ["Secondary", "#B8C0CD"], ["Muted", "#8E99A9"]] },
  { group: "Border", items: [["Subtle", "#303B4A"], ["Strong", "#465263"]] },
  { group: "Feedback", items: [["Success", "#4DD6A3"], ["Warning", "#F4BA60"], ["Error", "#F17D89"], ["Info", "#5BA4FF"]] },
];

const typeRows = [
  { token: "Display / H1", sample: "Build with clarity.", size: "40 / 48", weight: "Semibold", className: "display" },
  { token: "Heading / H2", sample: "Automation at scale", size: "30 / 38", weight: "Semibold", className: "h2" },
  { token: "Heading / H3", sample: "A connected workspace", size: "24 / 32", weight: "Semibold", className: "h3" },
  { token: "Heading / H4", sample: "Workflow settings", size: "18 / 26", weight: "Semibold", className: "h4" },
  { token: "Body / Large", sample: "Make every process visible and reliable.", size: "16 / 26", weight: "Regular", className: "body-lg" },
  { token: "Body / Default", sample: "A clear system makes complex work feel simple.", size: "14 / 22", weight: "Regular", className: "body" },
  { token: "Label / Small", sample: "ACTIVE WORKFLOWS", size: "12 / 18", weight: "Semibold", className: "label" },
  { token: "Caption / Small", sample: "Updated 2 minutes ago", size: "11 / 16", weight: "Regular", className: "caption" },
];

export default function DesignSystemBoard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [fieldValue, setFieldValue] = useState("");

  const copyTokens = async () => {
    const tokens = { color: { canvas: "#0B111C", surface: "#111A27", primary: "#368BFA", text: "#F4F6F8", border: "#303B4A", success: "#4DD6A3", warning: "#F4BA60", error: "#F17D89" }, spacing: [4, 8, 12, 16, 24, 32, 48, 64], radius: [4, 8, 12, 16, 999] };
    try {
      await navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  return <div className="ds-app">
    <aside className={`ds-sidebar ${navOpen ? "is-open" : ""}`}>
      <div className="ds-brand"><div className="ds-brand-mark"><Workflow size={21} strokeWidth={2.4} /></div><div><strong>STRATA<span> / UI</span></strong><small>DESIGN SYSTEM</small></div><button className="ds-mobile-close" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="ds-side-divider" />
      <div className="ds-nav-kicker">DOCUMENTATION <span>06</span></div>
      <nav aria-label="Design system sections">{sections.map((section) => <a key={section.id} href={`#${section.id}`} className={activeSection === section.id ? "active" : ""} onClick={() => { setActiveSection(section.id); setNavOpen(false); }}><span className="ds-nav-number">{section.number}</span><span>{section.label}</span><ArrowRight size={15} /></a>)}</nav>
      <div className="ds-sidebar-bottom"><div className="ds-version-dot" /><div><strong>System v1.0</strong><span>Ready for handoff</span></div><ExternalLink size={14} /></div>
    </aside>

    <div className="ds-workspace">
      <header className="ds-topbar"><div className="ds-topbar-left"><button className="ds-menu" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><span>Workspace</span><span className="ds-crumb-slash">/</span><strong>Design system</strong><span className="ds-topbar-tag">FOUNDATIONS</span></div><div className="ds-topbar-right"><span className="ds-online"><i /> All systems operational</span><div className="ds-topbar-separator" /><span>v1.0.0</span><div className="ds-avatar">S</div></div></header>
      <main className="ds-main">
        <div className="ds-page-breadcrumb">DESIGN SYSTEM <span>/</span> DOCUMENTATION BOARD <span>/</span> 2026</div>
        <div className="ds-hero"><div className="ds-hero-copy"><div className="ds-hero-pill"><span /> THE SINGLE SOURCE OF TRUTH</div><h1>Built for complex work.<br /><em>Designed for clarity.</em></h1><p>A practical design language for enterprise automation. Every token, pattern, and component is made to keep powerful workflows predictable and easy to use.</p><div className="ds-hero-actions"><a href="#components" className="ds-primary-action">Explore components <ArrowRight size={16} /></a><button onClick={copyTokens} className="ds-outline-action">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Tokens copied" : "Copy core tokens"}</button></div></div><div className="ds-hero-art" aria-hidden="true"><div className="ds-art-grid" /><div className="ds-art-orbit orbit-one" /><div className="ds-art-orbit orbit-two" /><div className="ds-art-center"><Workflow size={38} strokeWidth={1.4} /></div><div className="ds-art-node node-one"><Grid2X2 size={14} /></div><div className="ds-art-node node-two"><Sparkles size={15} /></div><div className="ds-art-node node-three"><Layers3 size={15} /></div><div className="ds-art-label">SYSTEM / 01 <span>● LIVE</span></div></div></div>

        <div className="ds-metrics"><div><span>01 / SYSTEM</span><strong>6 sections</strong><small>Complete reference</small></div><div><span>02 / FOUNDATION</span><strong>2 palettes</strong><small>Primitive + semantic</small></div><div><span>03 / COMPONENTS</span><strong>5 families</strong><small>States and usage</small></div><div><span>04 / PRINCIPLE</span><strong>AA first</strong><small>Accessible by default</small></div></div>

        <section className="ds-section"><SectionHeading id="overview" number="00" title="Overview" description="The rules behind a coherent product experience." /><div className="ds-overview-grid"><div className="ds-panel ds-overview-lead"><PanelTitle eyebrow="OUR APPROACH" title="Consistency creates confidence." /><p>Strata is the shared visual language for operational software. It supports dense data, frequent decisions, and workflows that need to stay understandable under pressure. Use these rules as the default when designing new surfaces or extending existing ones.</p><div className="ds-principles"><div><span>01</span><strong>Clarity over decoration</strong><p>Make the next action and current system state immediately visible.</p></div><div><span>02</span><strong>One pattern, one purpose</strong><p>Reuse established behavior before creating a new interaction.</p></div><div><span>03</span><strong>Accessible by design</strong><p>Keep contrast, focus, and keyboard access in every state.</p></div></div></div><div className="ds-panel ds-overview-rules"><PanelTitle eyebrow="GENERAL USAGE" title="Working rules" /><div className="ds-rule"><CheckCircle2 size={17} /><div><strong>Start with semantic tokens</strong><p>Use role names in product UI; reserve raw palette values for documentation.</p></div></div><div className="ds-rule"><CheckCircle2 size={17} /><div><strong>Prefer familiar patterns</strong><p>Keep navigation, forms, and feedback consistent across workspaces.</p></div></div><div className="ds-rule"><CheckCircle2 size={17} /><div><strong>Design every state</strong><p>Specify default, hover, focus, disabled, loading, and error where relevant.</p></div></div><div className="ds-rule"><CheckCircle2 size={17} /><div><strong>Write for action</strong><p>Use short labels, direct verbs, and useful recovery guidance.</p></div></div></div></div></section>

        <section className="ds-section"><SectionHeading id="color" number="01" title="Color" description="A restrained dark foundation with blue reserved for intent and action." /><div className="ds-panel"><PanelTitle eyebrow="01 / PRIMITIVES" title="Primitive palette" aside="Use semantic roles in product surfaces" /><SwatchScale title="Neutral / Slate" data={neutral} /><SwatchScale title="Primary / Blue" data={blue} /></div><div className="ds-panel ds-semantic-panel"><PanelTitle eyebrow="02 / APPLICATION" title="Semantic roles" aside="Tokens describe purpose, not appearance" /><div className="ds-semantic-grid">{semanticRows.map((row) => <div className="ds-semantic-group" key={row.group}><h4>{row.group}</h4>{row.items.map(([name, hex]) => <div className="ds-semantic-row" key={name}><i style={{ background: hex }} /><span>{name}</span><code>{hex}</code></div>)}</div>)}</div><div className="ds-color-note"><CircleHelp size={16} /><span>Interactive blue: default <b>#368BFA</b> · hover <b>#5BA4FF</b> · pressed <b>#2474E8</b> · focus ring <b>#8BC0FF</b>. Pair status colors with text or icons; color alone must not carry meaning.</span></div></div></section>

        <section className="ds-section"><SectionHeading id="typography" number="02" title="Typography" description="A clear hierarchy for fast scanning and careful reading." /><div className="ds-typography-grid"><div className="ds-panel"><PanelTitle eyebrow="01 / TYPE SCALE" title="Hierarchy" aside="Inter / UI and documentation" /><div className="ds-type-head"><span>STYLE</span><span>SPECIMEN</span><span>SIZE / LINE</span><span>WEIGHT</span></div>{typeRows.map((row) => <div className="ds-type-row" key={row.token}><span className="ds-type-token">{row.token}</span><span className={`ds-type-sample ${row.className}`}>{row.sample}</span><span className="ds-type-spec">{row.size}</span><span className="ds-type-spec">{row.weight}</span></div>)}</div><div className="ds-panel ds-writing"><PanelTitle eyebrow="02 / CONTENT" title="Writing rules" /><div className="ds-writing-item"><span>01</span><div><strong>Lead with the action.</strong><p>Use verbs in buttons and useful nouns in navigation. “Create workflow” is clearer than “Submit”.</p></div></div><div className="ds-writing-item"><span>02</span><div><strong>Be precise and brief.</strong><p>Keep labels short; place explanation where decisions need context.</p></div></div><div className="ds-writing-item"><span>03</span><div><strong>Use sentence case.</strong><p>Reserve uppercase for short metadata, overlines, and system labels.</p></div></div><div className="ds-writing-item"><span>04</span><div><strong>Make errors useful.</strong><p>State what happened and give a specific next step.</p></div></div><div className="ds-writing-example"><small>EXAMPLE / ACTION COPY</small><div><span>✕ &nbsp; Confirm</span><ArrowRight size={14} /><strong>✓ &nbsp; Save workflow</strong></div></div></div></div></section>

        <section className="ds-section"><SectionHeading id="foundations" number="03" title="Foundations" description="The measurements that make every surface feel related." /><div className="ds-foundation-grid"><div className="ds-panel"><PanelTitle eyebrow="01 / SPACING" title="4px base unit" /><p className="ds-panel-intro">Use consistent increments for padding, gaps, and section rhythm.</p><div className="ds-spacing-list">{[["01",4],["02",8],["03",12],["04",16],["06",24],["08",32],["12",48],["16",64]].map(([token, px]) => <div key={token}><code>{token}</code><span className="ds-spacing-track"><i style={{ width: `${Number(px) * 2}px` }} /></span><b>{px}px</b></div>)}</div></div><div className="ds-panel"><PanelTitle eyebrow="02 / CORNERS" title="Border radius" /><p className="ds-panel-intro">Round controls gently; reserve full pills for compact labels.</p><div className="ds-radius-list">{[["XS", "4px"],["SM", "8px"],["MD", "12px"],["LG", "16px"],["FULL", "999px"]].map(([token, radius]) => <div key={token}><div style={{ borderRadius: radius }} /><strong>{token}</strong><span>{radius}</span></div>)}</div></div><div className="ds-panel"><PanelTitle eyebrow="03 / DEPTH" title="Elevation" /><p className="ds-panel-intro">Use depth to distinguish layers, not to decorate flat content.</p><div className="ds-elevation-list"><div><i className="elevation-0" /><span><strong>Level 0</strong><small>Base surfaces</small></span></div><div><i className="elevation-1" /><span><strong>Level 1</strong><small>Cards & panels</small></span></div><div><i className="elevation-2" /><span><strong>Level 2</strong><small>Menus & overlays</small></span></div></div></div></div></section>

        <section className="ds-section"><SectionHeading id="usage" number="04" title="Component usage" description="Behavior and anatomy guidelines for predictable interaction." /><div className="ds-usage-grid"><div className="ds-panel ds-anatomy"><PanelTitle eyebrow="01 / ANATOMY" title="Make every action legible" /><div className="ds-anatomy-preview"><span className="ds-callout callout-one">01</span><span className="ds-callout callout-two">02</span><span className="ds-callout callout-three">03</span><button><Plus size={17} /> Create workflow <ArrowRight size={16} /></button></div><div className="ds-anatomy-keys"><div><b>01</b><span>Leading icon</span><small>Supports recognition; never replaces a necessary label.</small></div><div><b>02</b><span>Action label</span><small>Describes the result in two or three clear words.</small></div><div><b>03</b><span>Trailing cue</span><small>Use only when it adds direction or reveals a destination.</small></div></div></div><div className="ds-panel ds-behavior"><PanelTitle eyebrow="02 / BEHAVIOR" title="Interaction contract" /><div className="ds-behavior-row"><span>01</span><div><strong>Focus is visible</strong><p>Keyboard focus uses a 2px blue outline with 2px offset.</p></div></div><div className="ds-behavior-row"><span>02</span><div><strong>Feedback is immediate</strong><p>Show loading during work, then success or a recoverable error.</p></div></div><div className="ds-behavior-row"><span>03</span><div><strong>Disabled means unavailable</strong><p>Reduce emphasis and explain prerequisites nearby when useful.</p></div></div><div className="ds-behavior-row"><span>04</span><div><strong>Destructive actions require care</strong><p>Use explicit labels and confirmation for permanent outcomes.</p></div></div></div></div></section>

        <section className="ds-section ds-last-section"><SectionHeading id="components" number="05" title="Components" description="A native starter library with visible states and implementation guidance." /><div className="ds-component-panel ds-panel"><PanelTitle eyebrow="01 / ACTIONS" title="Buttons" aside="Primary for the main task · secondary for alternatives" /><div className="ds-component-table"><div className="ds-component-table-head"><span>VARIANT</span><span>DEFAULT</span><span>HOVER</span><span>DISABLED</span></div><div className="ds-component-table-row"><strong>Primary</strong><button className="ds-button primary"><Plus size={15} /> Create workflow</button><button className="ds-button primary hover-demo"><Plus size={15} /> Create workflow</button><button className="ds-button primary" disabled><Plus size={15} /> Create workflow</button></div><div className="ds-component-table-row"><strong>Secondary</strong><button className="ds-button secondary"><Settings2 size={15} /> Configure</button><button className="ds-button secondary hover-demo"><Settings2 size={15} /> Configure</button><button className="ds-button secondary" disabled><Settings2 size={15} /> Configure</button></div></div></div><div className="ds-components-grid"><div className="ds-panel"><PanelTitle eyebrow="02 / INPUT" title="Text fields" /><div className="ds-fields"><label>Default<span>Workflow name</span><input value={fieldValue} onChange={(event) => setFieldValue(event.target.value)} placeholder="e.g. Invoice approval" /></label><label>Focused<span>Search workflows</span><div className="ds-field-with-icon"><Search size={16} /><input placeholder="Search by name or owner" /></div></label><label>Disabled<span>System identifier</span><input placeholder="Generated automatically" disabled /></label></div><p className="ds-component-caption">Keep labels persistent. Use helper text for format or requirements.</p></div><div className="ds-panel"><PanelTitle eyebrow="03 / FEEDBACK" title="Status badges" /><div className="ds-badges"><div><span>SUCCESS</span><b className="ds-badge success"><i /> Completed</b></div><div><span>WARNING</span><b className="ds-badge warning"><i /> Needs review</b></div><div><span>ERROR</span><b className="ds-badge error"><i /> Failed</b></div><div><span>INFO</span><b className="ds-badge info"><i /> In progress</b></div><div><span>NEUTRAL</span><b className="ds-badge neutral"><i /> Draft</b></div></div><p className="ds-component-caption">Pair status color with a readable state label.</p></div></div><div className="ds-panel ds-navigation-panel"><PanelTitle eyebrow="04 / WAYFINDING" title="Navigation items" aside="Clear selected, hover, and disabled states" /><div className="ds-navigation-grid"><div><small>DEFAULT</small><div className="ds-nav-preview"><LayoutGrid size={17} /> Overview <span>⌘ 1</span></div></div><div><small>SELECTED</small><div className="ds-nav-preview selected"><Workflow size={17} /> Workflows <span>12</span></div></div><div><small>HOVER</small><div className="ds-nav-preview hovered"><FileText size={17} /> Activity <span><ArrowDownRight size={15} /></span></div></div><div><small>DISABLED</small><div className="ds-nav-preview disabled"><ShieldCheck size={17} /> Admin tools <span><ChevronDown size={15} /></span></div></div></div></div></section>

        <footer className="ds-footer"><div><div className="ds-footer-mark"><Workflow size={17} /></div><span>STRATA / UI</span><i /> Enterprise automation design system</div><span>DOCUMENTATION BOARD · V1.0 · 2026</span></footer>
      </main>
    </div>
  </div>;
}
