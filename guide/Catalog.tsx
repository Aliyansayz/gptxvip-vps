import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { guides, type GuideItem, type GuideCategory } from "./catalogData";
import { GuideCard, useGuideSurface, guideTheme } from "./shared";
import GuideFaq from "./components/GuideFaq";
import GuideFooter from "./components/GuideFooter";
import sunshineImage from "./sunshine-guide.png";
import "./styles.css";
import "./components/guideNavigation.css";

export default function Catalog() {
  const surfaceRef = useGuideSurface("Guide Vault // Software Guide Catalog");
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [filter, setFilter] = useState<GuideCategory>("all");
  const [toast, setToast] = useState<GuideItem | null>(null);
  const navigate = useNavigate();
  const matches = (guide: GuideItem) => (filter === "all" || guide.category === filter) && `${guide.title} ${guide.searchText}`.toLowerCase().includes(query.trim().toLowerCase());
  const visibleGuides = guides.filter(matches);

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
  function openGuide(guide: GuideItem) {
    if (guide.href) navigate(guide.href);
    else setToast(guide);
  }
  function browseCollection(category: GuideCategory) {
    setFilter(category); setQuery("");
    surfaceRef.current?.querySelector("#catalog")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  function randomPick() {
    if (!visibleGuides.length) return;
    const guide = visibleGuides[Math.floor(Math.random() * visibleGuides.length)];
    const card = surfaceRef.current?.querySelector<HTMLElement>(`[data-manual-id="${guide.id}"]`);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    card?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
    card?.focus({ preventScroll: true });
    if (!reduced) card?.animate([{ transform: "translateY(0)" }, { transform: "translateY(-9px)" }, { transform: "translateY(0)" }], { duration: 900, easing: "ease" });
    setToast(guide);
  }
  return <div ref={surfaceRef} className="manual-catalog manual-navigation blvd-guide-surface" style={guideTheme}>

  <header className="topbar">
    <a href="#top" className="vault-brand" aria-label="Guide Vault home">
      <span className="vault-mark"><i></i><i></i><i></i></span>
      <span><strong>Guide®</strong><em>// VAULT</em></span>
    </a>

    <div className="system-state"><i></i><span>CATALOG ONLINE</span><b>08 GUIDES</b></div>

    <nav aria-label="Catalog sections">
      <a href="#featured" aria-current={activeSection === "featured" ? "location" : undefined}>Featured</a>
      <a href="#catalog" aria-current={activeSection === "catalog" ? "location" : undefined}>Catalog</a>
      <a href="#collections" aria-current={activeSection === "collections" ? "location" : undefined}>Collections</a>
    </nav>

    <div className="topbar-actions">
      <a className="home-button" href="/" aria-label="Back to home"><ArrowLeft size={15} aria-hidden="true" /><span>BACK TO HOME</span></a>
      <button className="energy-button" id="randomPick" type="button" onClick={randomPick} aria-label="Pick a guide"><span>RANDOM GUIDE</span><b>↗</b></button>
    </div>
  </header>

  <main id="top" className="blvd-site-shell">
    <section className="hero blvd-hero-top">
      <div className="hero-kicker"><span>INTERACTIVE GUIDE STUDIO &amp; OPERATING PLAYBOOKS</span><i></i><b>V3 / GUIDE VIEW</b></div>
      <div className="hero-grid">
        <div className="hero-copy reveal">
          <h1>Guides that not only document software, but elevate <em>how teams operate.</em></h1>
          <p>An interactive studio catalog for operating guides, workflow playbooks, and agent handbooks. Scan by mission, preview the interface, and jump directly into the guide you need.</p>
          <div className="hero-actions">
            <a href="#catalog" className="cta primary"><span>BROWSE GUIDES</span><b>↗</b></a>
            <a href="#featured" className="cta secondary"><span>FEATURED GUIDE</span><b>01</b></a>
          </div>
        </div>

        <div className="hero-console reveal delay-1" aria-label="Catalog summary">
          <div className="console-head"><span><i></i>GUIDE INDEX</span><b>LIVE</b></div>
          <div className="console-metrics">
            <div><small>GUIDES</small><strong>08</strong><em>INDEXED</em></div>
            <div><small>COLLECTIONS</small><strong>04</strong><em>ACTIVE</em></div>
            <div><small>AVG. PAGES</small><strong>03</strong><em>QUICK READ</em></div>
          </div>
          <div className="signal-chart" aria-hidden="true">
            <i style={{ "--h": "31%" } as CSSProperties}></i><i style={{ "--h": "52%" } as CSSProperties}></i><i style={{ "--h": "41%" } as CSSProperties}></i><i style={{ "--h": "78%" } as CSSProperties}></i><i style={{ "--h": "64%" } as CSSProperties}></i><i style={{ "--h": "93%" } as CSSProperties}></i><i style={{ "--h": "72%" } as CSSProperties}></i><i style={{ "--h": "88%" } as CSSProperties}></i><i style={{ "--h": "61%" } as CSSProperties}></i><i style={{ "--h": "97%" } as CSSProperties}></i><i style={{ "--h": "82%" } as CSSProperties}></i><i style={{ "--h": "100%" } as CSSProperties}></i>
          </div>
          <div className="console-foot"><span>DOCUMENT SIGNAL</span><strong>98.7%</strong></div>
        </div>
      </div>
      <div className="blvd-tiny-note" aria-hidden="true">Scroll to explore ↓</div>
      <div className="blvd-hero-word" aria-hidden="true">Guide</div>
    </section>

    {/* Boulevard Intro & Feature Trio */}
    <section className="blvd-intro-section reveal">
      <div className="blvd-intro-line">
        <h2>Reshaping how software is explained — we’re here to help your team move faster with clarity, structure, and edge.</h2>
        <span className="blvd-round-icon">✳</span>
      </div>
      <div className="blvd-feature-grid">
        <article className="blvd-feature blvd-feature-blue">
          <div className="blvd-mark">✳</div>
          <h3>Made for clarity.</h3>
          <p>Step-by-step operating experiences, not dense static PDFs. Follow real screens and verified workflows.</p>
        </article>
        <article className="blvd-feature blvd-feature-black">
          <div className="blvd-mini-label">Operational direction</div>
          <h3>Workflows in motion.</h3>
          <p>We turn complex enterprise systems into clear, memorable six-stage playbooks anyone can run.</p>
        </article>
        <article className="blvd-feature blvd-feature-white">
          <div className="blvd-mini-label">Efficiency</div>
          <div className="blvd-plus">+100%</div>
          <p>More clarity. Faster onboarding. Stronger operational outcomes.</p>
        </article>
      </div>
    </section>

    <section className="energy-strip" aria-hidden="true">
      <div className="energy-track">
        <span>DISTRIBUTION</span><i>✳</i><span>AI AGENTS</span><i>✳</i><span>CYBERSECURITY</span><i>✳</i><span>MARKET INTELLIGENCE</span><i>✳</i><span>ERP</span><i>✳</i><span>SUPPORT</span><i>✳</i>
        <span>DISTRIBUTION</span><i>✳</i><span>AI AGENTS</span><i>✳</i><span>CYBERSECURITY</span><i>✳</i><span>MARKET INTELLIGENCE</span><i>✳</i><span>ERP</span><i>✳</i><span>SUPPORT</span><i>✳</i>
      </div>
    </section>

    <section id="featured" className="section featured reveal">
      <div className="section-title">
        <div><span className="eyebrow">01 / FEATURED GUIDE</span><h2>Guide of the <em>moment.</em></h2></div>
        <p>The strongest visual operating story gets the spotlight — then the rest of the library becomes a fast, filterable catalog.</p>
      </div>

      <article className="featured-card" data-category="operations">
        <div className="featured-visual">
          <div className="visual-toolbar"><span><i></i>LIVE PREVIEW</span><b>3 PAGE SYSTEM</b></div>
          <div className="manual-window">
            <img src={sunshineImage} alt="Sunshine Distribution software guide" />
            <div className="scan"></div>
          </div>
          <div className="float-tag tag-one"><small>FLOW</small><strong>Receive → Dispatch</strong></div>
          <div className="float-tag tag-two"><small>CORE</small><strong>FIFO / SQLite</strong></div>
        </div>

        <div className="featured-copy">
          <div className="featured-meta"><span>OPERATIONS</span><span>3 PAGES</span><span>LOCAL-FIRST</span></div>
          <h3>Sunshine<br />Distribution</h3>
          <p>Warehouse receiving, FIFO inventory, store dispatch, receivables, profitability, audit lineage and local data safety — organized into one concise operating guide.</p>
          <div className="feature-stat-grid">
            <div><small>MODULES</small><strong>10</strong></div>
            <div><small>ROLES</small><strong>06</strong></div>
            <div><small>DATA</small><strong>LOCAL</strong></div>
          </div>
          <div className="feature-actions">
            <Link className="open-manual" to="/sunshine_distribution_guide"><span>OPEN GUIDE</span><b>↗</b></Link>
            <span className="availability"><i></i> READY TO READ</span>
          </div>
        </div>
      </article>
    </section>

    <section id="catalog" className="section catalog-section">
      <div className="section-title catalog-heading reveal">
        <div><span className="eyebrow">02 / GUIDE INDEX</span><h2>Operating guides.<br /><em>Built to scan fast.</em></h2></div>
        <div className="catalog-tools">
          <label className="search-box">
            <span>⌕</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search guides" id="manualSearch" type="search" placeholder="Search guides..." autoComplete="off" />
            <kbd>⌘ K</kbd>
          </label>
          <div className="filter-row" role="group" aria-label="Filter guides">
            <button type="button" className={filter === "all" ? "filter active" : "filter"} aria-pressed={filter === "all"} onClick={() => setFilter("all")}>ALL</button>
            <button type="button" className={filter === "operations" ? "filter active" : "filter"} aria-pressed={filter === "operations"} onClick={() => setFilter("operations")}>OPS</button>
            <button type="button" className={filter === "ai" ? "filter active" : "filter"} aria-pressed={filter === "ai"} onClick={() => setFilter("ai")}>AI AGENTS</button>
            <button type="button" className={filter === "security" ? "filter active" : "filter"} aria-pressed={filter === "security"} onClick={() => setFilter("security")}>SECURITY</button>
            <button type="button" className={filter === "finance" ? "filter active" : "filter"} aria-pressed={filter === "finance"} onClick={() => setFilter("finance")}>FINANCE</button>
          </div>
        </div>
      </div>

      <div className="catalog-grid" id="catalogGrid">
        <GuideCard key={guides[0].id} guide={guides[0]} hidden={!matches(guides[0])} onOpen={openGuide}>
          <div className="manual-cover cover-sun">
            <div className="cover-label">OPERATING GUIDE</div>
            <div className="cover-glyph sun-glyph">☀</div>
            <strong>Sunshine<br />Distribution</strong>
            <small>Warehouse · Inventory · Distribution</small>
            <div className="cover-lines"><i></i><i></i><i></i></div>
          </div>
        </GuideCard>

        <GuideCard key={guides[1].id} guide={guides[1]} hidden={!matches(guides[1])} onOpen={openGuide}>
          <div className="manual-cover cover-cyan">
            <div className="cover-label">AGENT GUIDE</div>
            <div className="network-glyph"><i></i><i></i><i></i><i></i><span></span></div>
            <strong>AI Data<br />Analyst Agent</strong>
            <small>Query · Validate · Visualize · Explain</small>
            <div className="cover-metric">SQL / PY / BI</div>
          </div>
        </GuideCard>

        <GuideCard key={guides[2].id} guide={guides[2]} hidden={!matches(guides[2])} onOpen={openGuide}>
          <div className="manual-cover cover-violet">
            <div className="cover-label">INTELLIGENCE GUIDE</div>
            <div className="radar-glyph"><i></i><i></i><i></i><b></b></div>
            <strong>Competitive<br />Intelligence</strong>
            <small>Pricing · Hiring · Releases · Patents</small>
            <div className="cover-stamp">CHANGE SIGNAL</div>
          </div>
        </GuideCard>

        <GuideCard key={guides[3].id} guide={guides[3]} hidden={!matches(guides[3])} onOpen={openGuide}>
          <div className="manual-cover cover-lime">
            <div className="cover-label">MARKET GUIDE</div>
            <div className="pulse-glyph"><span></span><i></i><i></i><i></i><i></i></div>
            <strong>Market<br />Intelligence</strong>
            <small>Customers · Trends · Regulation · Risk</small>
            <div className="cover-metric">OPPORTUNITY / RISK</div>
          </div>
        </GuideCard>

        <GuideCard key={guides[4].id} guide={guides[4]} hidden={!matches(guides[4])} onOpen={openGuide}>
          <div className="manual-cover cover-red">
            <div className="cover-label">SECURITY GUIDE</div>
            <div className="shield-glyph"><span>!</span></div>
            <strong>Vulnerability<br />Remediation</strong>
            <small>CVE · Owner · Patch · Validate</small>
            <div className="risk-bars"><i></i><i></i><i></i><i></i></div>
          </div>
        </GuideCard>

        <GuideCard key={guides[5].id} guide={guides[5]} hidden={!matches(guides[5])} onOpen={openGuide}>
          <div className="manual-cover cover-orange">
            <div className="cover-label">CLAIMS GUIDE</div>
            <div className="claim-glyph"><i></i><span>✓</span></div>
            <strong>Insurance<br />Claims Agent</strong>
            <small>Intake · Coverage · Fraud · Settlement</small>
            <div className="cover-stamp">ADJUSTER READY</div>
          </div>
        </GuideCard>

        <GuideCard key={guides[6].id} guide={guides[6]} hidden={!matches(guides[6])} onOpen={openGuide}>
          <div className="manual-cover cover-ice">
            <div className="cover-label">ERP GUIDE</div>
            <div className="snow-glyph">✣</div>
            <strong>ColdChain<br />ERP</strong>
            <small>Batch · FEFO · Delivery · Reconciliation</small>
            <div className="temp-readout"><span>2.8°C</span><i></i><b>STABLE</b></div>
          </div>
        </GuideCard>

        <GuideCard key={guides[7].id} guide={guides[7]} hidden={!matches(guides[7])} onOpen={openGuide}>
          <div className="manual-cover cover-blue">
            <div className="cover-label">SUPPORT GUIDE</div>
            <div className="chat-glyph"><i></i><span></span><b></b></div>
            <strong>Customer<br />Support Agent</strong>
            <small>Intent · KB · CRM · SLA · Escalation</small>
            <div className="cover-metric">SLA / 24×7</div>
          </div>
        </GuideCard>
      </div>

      <div className="empty-state" id="emptyState" hidden={visibleGuides.length !== 0}>
        <span>NO SIGNAL</span>
        <h3>No guides match that search.</h3>
        <p>Try a broader keyword or switch back to ALL.</p>
      </div>
    </section>

    <section id="collections" className="section collections reveal">
      <div className="section-title">
        <div><span className="eyebrow">03 / COLLECTIONS</span><h2>Organize by<br /><em>mission.</em></h2></div>
        <p>Group guides by the kind of work they support so the library feels closer to an operating studio than a folder of PDFs.</p>
      </div>

      <div className="collection-grid">
        <article tabIndex={0} role="button" aria-label="Browse operations guides" onClick={() => browseCollection("operations")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("operations"); } } }><span>01.</span><div><small>OPERATIONS</small><h3>Move goods.<br />Control stock.</h3></div><b>2 GUIDES ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse ai guides" onClick={() => browseCollection("ai")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("ai"); } } }><span>02.</span><div><small>AI AGENTS</small><h3>Observe.<br />Reason. Act.</h3></div><b>4 GUIDES ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse security guides" onClick={() => browseCollection("security")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("security"); } } }><span>03.</span><div><small>SECURITY</small><h3>Find risk.<br />Close gaps.</h3></div><b>1 GUIDE ↗</b></article>
        <article tabIndex={0} role="button" aria-label="Browse finance guides" onClick={() => browseCollection("finance")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); browseCollection("finance"); } } }><span>04.</span><div><small>FINANCE</small><h3>Process cases.<br />Resolve value.</h3></div><b>1 GUIDE ↗</b></article>
      </div>
    </section>

    <GuideFaq />
    <GuideFooter caption="BOULEVARD STUDIO OPERATING GUIDE CATALOG · VERSION 3" />
  </main>

  <div className={toast ? "manual-toast show" : "manual-toast"} id="manualToast" role="status" aria-live="polite">
    <span className="toast-pulse"></span>
    <div><small>{toast?.href ? "GUIDE SELECTED" : "COVER PREVIEW · FULL GUIDE COMING SOON"}</small><strong id="toastTitle">{toast?.title}</strong></div>
    <b>{toast?.href ? "READY ↗" : "PREVIEW"}</b>
  </div>

  </div>;
}
