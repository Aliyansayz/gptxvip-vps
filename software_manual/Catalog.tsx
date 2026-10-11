import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { manuals, type Manual, type ManualCategory } from "./catalogData";
import { ManualCard, useManualSurface, manualTheme } from "./shared";
import sunshineImage from "./sunshine-manual.png";
import "./styles.css";
import "./components/manualNavigation.css";

export default function Catalog() {
  const surfaceRef = useManualSurface("Manual Vault // Software Catalog");
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [filter, setFilter] = useState<ManualCategory>("all");
  const [toast, setToast] = useState<Manual | null>(null);
  const navigate = useNavigate();
  const matches = (manual: Manual) => (filter === "all" || manual.category === filter) && `${manual.title} ${manual.searchText}`.toLowerCase().includes(query.trim().toLowerCase());
  const visibleManuals = manuals.filter(matches);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0, .1, .4] });
    ["top", "featured", "catalog", "collections"].forEach(id => {
      const section = surfaceRef.current?.querySelector(`#${id}`);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [surfaceRef]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);
  function openManual(manual: Manual) {
    if (manual.href) navigate(manual.href);
    else setToast(manual);
  }
  function browseCollection(category: ManualCategory) {
    setFilter(category); setQuery("");
    surfaceRef.current?.querySelector("#catalog")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function randomPick() {
    if (!visibleManuals.length) return;
    const manual = visibleManuals[Math.floor(Math.random() * visibleManuals.length)];
    const card = surfaceRef.current?.querySelector<HTMLElement>(`[data-manual-id="${manual.id}"]`);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    card?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
    card?.focus({ preventScroll: true });
    if (!reduced) card?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-9px)" }, { transform: "translateY(0)" }], { duration: 900, easing: "ease" });
    setToast(manual);
  }
  return <div ref={surfaceRef} className="manual-catalog manual-navigation" style={manualTheme}>

  <div className="aurora-background">
    <div className="aurora-layer aurora-left" aria-hidden="true" />
    <div className="aurora-layer aurora-right" aria-hidden="true" />
    <div className="aurora-layer aurora-center" aria-hidden="true" />
  </div>

  <div className="fx-grid" aria-hidden="true"></div>
  <div className="fx-orb orb-one" aria-hidden="true"></div>
  <div className="fx-orb orb-two" aria-hidden="true"></div>
  <div className="noise" aria-hidden="true"></div>

  <header className="topbar">
    <a href="#top" className="vault-brand" aria-label="Manual Vault home">
      <span className="vault-mark"><i></i><i></i><i></i></span>
      <span><strong>MANUAL</strong><em>// VAULT</em></span>
    </a>

    <div className="system-state"><i></i><span>CATALOG ONLINE</span><b>08 MANUALS</b></div>

    <nav aria-label="Catalog sections">
      <a href="#featured" aria-current={activeSection === "featured" ? "location" : undefined}>Featured</a>
      <a href="#catalog" aria-current={activeSection === "catalog" ? "location" : undefined}>Catalog</a>
      <a href="#collections" aria-current={activeSection === "collections" ? "location" : undefined}>Collections</a>
    </nav>

    <div className="topbar-actions">
      <a className="home-button" href="/" aria-label="Back to home"><ArrowLeft size={16} aria-hidden="true" /><span>BACK TO HOME</span></a>
      <button className="energy-button" id="randomPick" type="button" onClick={randomPick} aria-label="Pick a manual"><span>ENERGY PICK</span><b>↗</b></button>
    </div>
  </header>

  <main id="top">
    <section className="hero" style={{background: 'var(--gradient-aqua)', backgroundSize: '400% 400%', animation: 'gradient-shift 15s ease infinite'}}>
      <div className="hero-kicker"><span>SOFTWARE DOCUMENTATION LIBRARY</span><i></i><b>V3 / CATALOG VIEW</b></div>
      <div className="hero-grid">
        <div className="hero-copy reveal">
          <h1>Explore the<br /><em>manual universe.</em></h1>
          <p>A high-energy catalog for software manuals, operating guides and agent handbooks. Scan by category, preview the interface, and jump directly into the documentation you need.</p>
          <div className="hero-actions">
            <a href="#catalog" className="cta primary"><span>BROWSE CATALOG</span><b>↓</b></a>
            <a href="#featured" className="cta secondary"><span>FEATURED MANUAL</span><b>01</b></a>
          </div>
        </div>

        <div className="hero-console reveal delay-1" aria-label="Catalog summary">
          <div className="console-head"><span><i></i>VAULT INDEX</span><b>LIVE</b></div>
          <div className="console-metrics">
            <div><small>MANUALS</small><strong>08</strong><em>INDEXED</em></div>
            <div><small>COLLECTIONS</small><strong>04</strong><em>ACTIVE</em></div>
            <div><small>AVG. PAGES</small><strong>03</strong><em>QUICK READ</em></div>
          </div>
          <div className="signal-chart" aria-hidden="true">
            <i style={{ "--h": "31%" } as CSSProperties}></i><i style={{ "--h": "52%" } as CSSProperties}></i><i style={{ "--h": "41%" } as CSSProperties}></i><i style={{ "--h": "78%" } as CSSProperties}></i><i style={{ "--h": "64%" } as CSSProperties}></i><i style={{ "--h": "93%" } as CSSProperties}></i><i style={{ "--h": "72%" } as CSSProperties}></i><i style={{ "--h": "88%" } as CSSProperties}></i><i style={{ "--h": "61%" } as CSSProperties}></i><i style={{ "--h": "97%" } as CSSProperties}></i><i style={{ "--h": "82%" } as CSSProperties}></i><i style={{ "--h": "100%" } as CSSProperties}></i>
          </div>
          <div className="console-foot"><span>DOCUMENT SIGNAL</span><strong>98.7%</strong></div>
        </div>
      </div>
    </section>

    <section className="energy-strip" aria-hidden="true">
      <div className="energy-track">
        <span>DISTRIBUTION</span><i>◆</i><span>AI AGENTS</span><i>◆</i><span>CYBERSECURITY</span><i>◆</i><span>MARKET INTELLIGENCE</span><i>◆</i><span>ERP</span><i>◆</i><span>SUPPORT</span><i>◆</i>
        <span>DISTRIBUTION</span><i>◆</i><span>AI AGENTS</span><i>◆</i><span>CYBERSECURITY</span><i>◆</i><span>MARKET INTELLIGENCE</span><i>◆</i><span>ERP</span><i>◆</i><span>SUPPORT</span><i>◆</i>
      </div>
    </section>

    <section id="featured" className="section featured reveal">
      <div className="section-title">
        <div><span className="eyebrow">01 / FEATURED DROP</span><h2>Manual of the <em>moment.</em></h2></div>
        <p>The strongest visual story gets the spotlight — then the rest of the library becomes a fast, filterable catalog.</p>
      </div>

      <article className="featured-card" data-category="operations">
        <div className="featured-visual">
          <div className="visual-toolbar"><span><i></i>LIVE PREVIEW</span><b>3 PAGE SYSTEM</b></div>
          <div className="manual-window">
            <img src={sunshineImage} alt="Sunshine Distribution software manual" />
            <div className="scan"></div>
          </div>
          <div className="float-tag tag-one"><small>FLOW</small><strong>Receive → Dispatch</strong></div>
          <div className="float-tag tag-two"><small>CORE</small><strong>FIFO / SQLite</strong></div>
        </div>

        <div className="featured-copy">
          <div className="featured-meta"><span>OPERATIONS</span><span>3 PAGES</span><span>LOCAL-FIRST</span></div>
          <h3>Sunshine<br />Distribution</h3>
          <p>Warehouse receiving, FIFO inventory, store dispatch, receivables, profitability, audit lineage and local data safety — organized into one concise operating manual.</p>
          <div className="feature-stat-grid">
            <div><small>MODULES</small><strong>10</strong></div>
            <div><small>ROLES</small><strong>06</strong></div>
            <div><small>DATA</small><strong>LOCAL</strong></div>
          </div>
          <div className="feature-actions">
            <Link className="open-manual" to="/sunshine_distribution_manual"><span>OPEN MANUAL</span><b>↗</b></Link>
            <span className="availability"><i></i> READY TO READ</span>
          </div>
        </div>
      </article>
    </section>

    <section id="catalog" className="section catalog-section">
      <div className="section-title catalog-heading reveal">
        <div><span className="eyebrow">02 / VAULT INDEX</span><h2>Software manuals.<br /><em>Built to scan fast.</em></h2></div>
        <div className="catalog-tools">
          <label className="search-box">
            <span>⌕</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search manuals" id="manualSearch" type="search" placeholder="Search manuals..." autoComplete="off" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="filter-row" role="group" aria-label="Filter manuals">
            <button type="button" className={filter === "all" ? "filter active" : "filter"} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>ALL</button>
            <button type="button" className={filter === "operations" ? "filter active" : "filter"} aria-pressed={filter === "operations"} onClick={() => setFilter("operations")}>OPS</button>
            <button type="button" className={filter === "ai" ? "filter active" : "filter"} aria-pressed={filter === "ai"} onClick={() => setFilter("ai")}>AI AGENTS</button>
            <button type="button" className={filter === "security" ? "filter active" : "filter"} aria-pressed={filter === "security"} onClick={() => setFilter("security")}>SECURITY</button>
            <button type="button" className={filter === "finance" ? "filter active" : "filter"} aria-pressed={filter === "finance"} onClick={() => setFilter("finance")}>FINANCE</button>
          </div>
        </div>
      </div>

      <div className="catalog-grid" id="catalogGrid">
        <ManualCard key={manuals[0].id} manual={manuals[0]} hidden={!matches(manuals[0])} onOpen={openManual}>
<div className="manual-cover cover-sun">
            <div className="cover-label">SOFTWARE MANUAL</div>
            <div className="cover-glyph sun-glyph">☀</div>
            <strong>Sunshine<br />Distribution</strong>
            <small>Warehouse · Inventory · Distribution</small>
            <div className="cover-lines"><i></i><i></i><i></i></div>
          </div>
</ManualCard>

        <ManualCard key={manuals[1].id} manual={manuals[1]} hidden={!matches(manuals[1])} onOpen={openManual}>
<div className="manual-cover cover-cyan">
            <div className="cover-label">AGENT HANDBOOK</div>
            <div className="network-glyph"><i></i><i></i><i></i><i></i><span></span></div>
            <strong>AI Data<br />Analyst Agent</strong>
            <small>Query · Validate · Visualize · Explain</small>
            <div className="cover-metric">SQL / PY / BI</div>
          </div>
</ManualCard>

        <ManualCard key={manuals[2].id} manual={manuals[2]} hidden={!matches(manuals[2])} onOpen={openManual}>
<div className="manual-cover cover-violet">
            <div className="cover-label">INTELLIGENCE MANUAL</div>
            <div className="radar-glyph"><i></i><i></i><i></i><b></b></div>
            <strong>Competitive<br />Intelligence</strong>
            <small>Pricing · Hiring · Releases · Patents</small>
            <div className="cover-stamp">CHANGE SIGNAL</div>
          </div>
</ManualCard>

        <ManualCard key={manuals[3].id} manual={manuals[3]} hidden={!matches(manuals[3])} onOpen={openManual}>
<div className="manual-cover cover-lime">
            <div className="cover-label">MARKET PLAYBOOK</div>
            <div className="pulse-glyph"><span></span><i></i><i></i><i></i><i></i></div>
            <strong>Market<br />Intelligence</strong>
            <small>Customers · Trends · Regulation · Risk</small>
            <div className="cover-metric">OPPORTUNITY / RISK</div>
          </div>
</ManualCard>

        <ManualCard key={manuals[4].id} manual={manuals[4]} hidden={!matches(manuals[4])} onOpen={openManual}>
<div className="manual-cover cover-red">
            <div className="cover-label">SECURITY RUNBOOK</div>
            <div className="shield-glyph"><span>!</span></div>
            <strong>Vulnerability<br />Remediation</strong>
            <small>CVE · Owner · Patch · Validate</small>
            <div className="risk-bars"><i></i><i></i><i></i><i></i></div>
          </div>
</ManualCard>

        <ManualCard key={manuals[5].id} manual={manuals[5]} hidden={!matches(manuals[5])} onOpen={openManual}>
<div className="manual-cover cover-orange">
            <div className="cover-label">CLAIMS WORKFLOW</div>
            <div className="claim-glyph"><i></i><span>✓</span></div>
            <strong>Insurance<br />Claims Agent</strong>
            <small>Intake · Coverage · Fraud · Settlement</small>
            <div className="cover-stamp">ADJUSTER READY</div>
          </div>
</ManualCard>

        <ManualCard key={manuals[6].id} manual={manuals[6]} hidden={!matches(manuals[6])} onOpen={openManual}>
<div className="manual-cover cover-ice">
            <div className="cover-label">ERP OPERATIONS</div>
            <div className="snow-glyph">✣</div>
            <strong>ColdChain<br />ERP</strong>
            <small>Batch · FEFO · Delivery · Reconciliation</small>
            <div className="temp-readout"><span>2.8°C</span><i></i><b>STABLE</b></div>
          </div>
</ManualCard>

        <ManualCard key={manuals[7].id} manual={manuals[7]} hidden={!matches(manuals[7])} onOpen={openManual}>
<div className="manual-cover cover-blue">
            <div className="cover-label">SUPPORT PLAYBOOK</div>
            <div className="chat-glyph"><i></i><span></span><b></b></div>
            <strong>Customer<br />Support Agent</strong>
            <small>Intent · KB · CRM · SLA · Escalation</small>
            <div className="cover-metric">SLA / 24×7</div>
          </div>
</ManualCard>
      </div>

      <div className="empty-state" id="emptyState" hidden={visibleManuals.length !== 0}>
        <span>NO SIGNAL</span>
        <h3>No manuals match that search.</h3>
        <p>Try a broader keyword or switch back to ALL.</p>
      </div>
    </section>

    <section id="collections" className="section collections reveal">
      <div className="section-title">
        <div><span className="eyebrow">03 / COLLECTIONS</span><h2>Organize by<br /><em>mission.</em></h2></div>
        <p>Group manuals by the kind of work they support so the library feels closer to an operating system than a folder of PDFs.</p>
      </div>

      <div className="collection-grid">
        <article tabIndex={0} role="button" aria-label="Browse operations manuals" onClick={() => browseCollection("operations")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("operations"); } } }><span>01</span><div><small>OPERATIONS</small><h3>Move goods.<br />Control stock.</h3></div><b>2 MANUALS ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse ai manuals" onClick={() => browseCollection("ai")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("ai"); } } }><span>02</span><div><small>AI AGENTS</small><h3>Observe.<br />Reason. Act.</h3></div><b>4 MANUALS ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse security manuals" onClick={() => browseCollection("security")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("security"); } } }><span>03</span><div><small>SECURITY</small><h3>Find risk.<br />Close gaps.</h3></div><b>1 MANUAL ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse finance manuals" onClick={() => browseCollection("finance")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("finance"); } } }><span>04</span><div><small>FINANCE</small><h3>Process cases.<br />Resolve value.</h3></div><b>1 MANUAL ↗</b></article>
      </div>
    </section>
  </main>

  <div className={toast ? "manual-toast show" : "manual-toast"} id="manualToast" role="status" aria-live="polite">
    <span className="toast-pulse"></span>
    <div><small>{toast?.href ? "MANUAL SELECTED" : "COVER PREVIEW · FULL MANUAL COMING SOON"}</small><strong id="toastTitle">{toast?.title}</strong></div>
    <b>{toast?.href ? "READY ↗" : "PREVIEW"}</b>
  </div>

  <footer>
    <a href="#top" className="vault-brand compact"><span className="vault-mark"><i></i><i></i><i></i></span><span><strong>MANUAL</strong><em>// VAULT</em></span></a>
    <p>ENERGETIC SOFTWARE DOCUMENTATION CATALOG · VERSION 3</p>
    <a href="#top">BACK TO TOP ↑</a>
  </footer>

  

  </div>;
}
