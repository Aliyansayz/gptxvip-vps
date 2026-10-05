import { useEffect, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { Link } from "react-router";
import { useManualSurface, manualTheme } from "../shared";
import sunshineImage from "./sunshine-manual.png";
import "./styles.css";

const pageNames = ["Foundation", "Operations", "Control"];
const sectionIds = ["overview", "modules", "flow", "manual", "security"];
export default function SunshineManual() {
  const surfaceRef = useManualSurface("Sunshine Distribution // Manual");
  const [page, setPage] = useState(0);
  const [activeSection, setActiveSection] = useState("overview");
  const changePage = (delta: number) => setPage((current) => (current + delta + 3) % 3);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-22% 0px -58% 0px", threshold: [0, .15, .4, .7] });
    sectionIds.forEach((id) => { const section = surfaceRef.current?.querySelector(`#${id}`); if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, [surfaceRef]);
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const next = event.key === "ArrowRight" ? (page + 1) % 3 : event.key === "ArrowLeft" ? (page + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
    if (next === null) return;
    event.preventDefault(); setPage(next);
    surfaceRef.current?.querySelector<HTMLButtonElement>(`#manual-tab-${next}`)?.focus();
  }
  function onViewerKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault(); changePage(event.key === "ArrowRight" ? 1 : -1);
  }
  function tiltPreview(event: PointerEvent<HTMLDivElement>) {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    const shell = event.currentTarget.querySelector<HTMLElement>(".holo-shell");
    if (shell) shell.style.transform = `rotateY(${-5 + x * 3}deg) rotateX(${2 - y * 3}deg) translateY(${y * -2}px)`;
  }
  function resetPreview(event: PointerEvent<HTMLDivElement>) {
    const shell = event.currentTarget.querySelector<HTMLElement>(".holo-shell");
    if (shell) shell.style.transform = "";
  }
  return <div ref={surfaceRef} className="sunshine-manual" style={manualTheme}>

  <div className="noise" aria-hidden="true"></div>
  <div className="aurora aurora-a" aria-hidden="true"></div>
  <div className="aurora aurora-b" aria-hidden="true"></div>

  <header className="topbar">
    <a className="brand" href="#overview" aria-label="Sunshine Distribution home">
      <span className="sun-logo" aria-hidden="true"><i></i></span>
      <span className="brand-text"><b>SUNSHINE</b><em>DISTRIBUTION</em></span>
    </a>

    <div className="command" aria-label="Product status">
      <span className="pulse"></span>
      <span>LOCAL CORE</span>
      <Link className="back-catalog" to="/">← CATALOG</Link>
    </div>

    <nav className="top-links" aria-label="Primary">
      <a href="#modules">Modules</a>
      <a href="#flow">Flow</a>
      <a href="#manual">Manual</a>
      <a href="#security">Security</a>
    </nav>

    <a className="launch-btn" href="#manual"><span>OPEN MANUAL</span><b>↗</b></a>
  </header>

  <aside className="rail" aria-label="Chapter navigation">
    <div className="rail-line"></div>
    <a className={activeSection === "overview" ? "rail-link active" : "rail-link"} aria-current={activeSection === "overview" ? "location" : undefined} href="#overview" data-label="Overview"><span>00</span></a>
    <a className={activeSection === "modules" ? "rail-link active" : "rail-link"} aria-current={activeSection === "modules" ? "location" : undefined} href="#modules" data-label="Modules"><span>01</span></a>
    <a className={activeSection === "flow" ? "rail-link active" : "rail-link"} aria-current={activeSection === "flow" ? "location" : undefined} href="#flow" data-label="Workflow"><span>02</span></a>
    <a className={activeSection === "manual" ? "rail-link active" : "rail-link"} aria-current={activeSection === "manual" ? "location" : undefined} href="#manual" data-label="Manual"><span>03</span></a>
    <a className={activeSection === "security" ? "rail-link active" : "rail-link"} aria-current={activeSection === "security" ? "location" : undefined} href="#security" data-label="Security"><span>04</span></a>
    <div className="rail-status"><i></i><small>ONLINE</small></div>
  </aside>

  <main>
    <section id="overview" className="hero section">
      <div className="hero-copy reveal">
        <div className="micro-label"><span>V2 / FUTURE OPERATIONS</span><i></i><span>LOCAL-FIRST</span></div>
        <h1>Distribution,<br /><strong>synchronized.</strong></h1>
        <p className="lead">A high-clarity operating cockpit for warehouse receiving, FIFO inventory, multi-store distribution, receivables, reporting and audit — all on your machine.</p>
        <div className="hero-actions">
          <a href="#modules" className="btn btn-energy"><span>EXPLORE SYSTEM</span><b>→</b></a>
          <a href="#manual" className="btn btn-glass"><span>VIEW MANUAL</span><b>03 PAGES</b></a>
        </div>
        <div className="hero-metrics">
          <div><small>MODULES</small><strong>10</strong><em>CONNECTED</em></div>
          <div><small>VALUATION</small><strong>FIFO</strong><em>TRACEABLE</em></div>
          <div><small>STORAGE</small><strong>LOCAL</strong><em>SQLITE</em></div>
          <div><small>AUDIT</small><strong>360°</strong><em>LINEAGE</em></div>
        </div>
      </div>

      <div className="hero-visual reveal delay-1" onPointerMove={tiltPreview} onPointerLeave={resetPreview}>
        <div className="orbit orbit-a"></div>
        <div className="orbit orbit-b"></div>
        <div className="holo-shell">
          <div className="holo-head">
            <span><i></i>SYSTEM / MANUAL PREVIEW</span>
            <div className="holo-dots"><i></i><i></i><i></i></div>
          </div>
          <div className="screen-grid"></div>
          <img src={sunshineImage} alt="Sunshine Distribution three-page software manual" />
          <div className="scan-line"></div>
          <div className="corner c1"></div><div className="corner c2"></div><div className="corner c3"></div><div className="corner c4"></div>
        </div>

        <div className="float-card stock-card">
          <span className="float-icon">▦</span>
          <div><small>ON-HAND STOCK</small><strong>1,240 pcs</strong><em>+12.4% this cycle</em></div>
          <b>LIVE</b>
        </div>
        <div className="float-card dispatch-card">
          <span className="float-icon check">✓</span>
          <div><small>LAST EVENT</small><strong>Dispatch posted</strong><em>City Mart · Rs 48,000</em></div>
        </div>
        <div className="signal-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
      </div>
    </section>

    <section className="ticker" aria-label="System capabilities">
      <div className="ticker-track">
        <span>WAREHOUSE RECEIVING</span><i>◆</i><span>FIFO INVENTORY</span><i>◆</i><span>MULTI-STORE DISTRIBUTION</span><i>◆</i><span>RECEIVABLES</span><i>◆</i><span>PROFITABILITY</span><i>◆</i><span>AUDIT LINEAGE</span><i>◆</i>
        <span>WAREHOUSE RECEIVING</span><i>◆</i><span>FIFO INVENTORY</span><i>◆</i><span>MULTI-STORE DISTRIBUTION</span><i>◆</i><span>RECEIVABLES</span><i>◆</i><span>PROFITABILITY</span><i>◆</i><span>AUDIT LINEAGE</span><i>◆</i>
      </div>
    </section>

    <section id="modules" className="section modules">
      <div className="section-head reveal">
        <div><span className="eyebrow">01 / SYSTEM MAP</span><h2>Ten modules.<br /><em>One operating core.</em></h2></div>
        <p>The manual becomes an interactive information architecture: operational, visual, permission-aware and easy to scan.</p>
      </div>

      <div className="bento-grid">
        <article className="sys-card span-2 violet reveal">
          <div className="card-top"><span className="chip">01 / MASTER DATA</span><b>◆</b></div>
          <h3>Products & Pricing</h3>
          <p>SKU, barcode, category, packaging rules, purchase costs, store margins, tax timelines and immutable pricing snapshots.</p>
          <div className="data-strip"><span>SKU</span><span>PACK</span><span>COST</span><span>MARGIN</span><span>TAX</span></div>
          <div className="mini-table"><div><small>SKU</small><b>SUN-001</b></div><div><small>COST</small><b>Rs 1,200</b></div><div><small>MARGIN</small><b>20%</b></div></div>
        </article>

        <article className="sys-card emerald reveal delay-1">
          <div className="card-top"><span className="chip">02 / INBOUND</span><b>▤</b></div>
          <h3>Warehouse Receiving</h3>
          <p>Supplier receipt drafts become exact piece quantities, FIFO lots and payables in one atomic post.</p>
          <div className="spark"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <span className="status-pill">POST → FIFO LOT</span>
        </article>

        <article className="sys-card magenta reveal delay-2">
          <div className="card-top"><span className="chip">03 / OUTBOUND</span><b>▰</b></div>
          <h3>Store Distribution</h3>
          <p>Dispatch documents, delivery dates, receivables and profitability snapshots for each retail store.</p>
          <div className="route-map"><i></i><i></i><i></i><span></span></div>
          <div className="mini-stat"><small>OPEN RECEIVABLE</small><strong>Rs 48,000</strong></div>
        </article>

        <article className="sys-card blue span-2 reveal">
          <div className="card-top"><span className="chip">04 / INVENTORY CORE</span><b>▣</b></div>
          <h3>Inventory</h3>
          <p>Real-time on-hand stock, FIFO lot lineage, valuation, adjustments and low-stock signals.</p>
          <div className="inventory-bars">
            <div><span>Water 500ml</span><i style={{ "--w": "86%" } as CSSProperties}></i><b>1,240</b></div>
            <div><span>Juice Mango 1L</span><i style={{ "--w": "62%" } as CSSProperties}></i><b>560</b></div>
            <div><span>Chips 100g</span><i style={{ "--w": "24%" } as CSSProperties}></i><b>35</b></div>
          </div>
        </article>

        <article className="sys-card amber reveal delay-1">
          <div className="card-top"><span className="chip">05 / AUDIT</span><b>⌁</b></div>
          <h3>Track Activity</h3>
          <p>Actor, timestamp, business date and record lineage — from source document to stock movement.</p>
          <div className="heatmap" aria-hidden="true"></div>
        </article>

        <article className="sys-card mint reveal delay-2">
          <div className="card-top"><span className="chip">06 / FINANCE</span><b>▥</b></div>
          <h3>Reports & Accounting</h3>
          <p>Valuation, tax, profitability, balances and export-ready operational reporting.</p>
          <div className="profit"><span>NET PROFIT</span><strong>Rs 240,000</strong><i>↑ 18.2%</i></div>
        </article>

        <article className="sys-card purple reveal">
          <div className="card-top"><span className="chip">07 / ACCESS</span><b>♟</b></div>
          <h3>Roles & Security</h3>
          <p>Role-based access and protected maintenance operations.</p>
          <div className="role-stack"><span>ADMIN</span><span>WAREHOUSE</span><span>DISTRIBUTION</span><span>VIEWER</span></div>
        </article>

        <article className="sys-card forest reveal delay-1">
          <div className="card-top"><span className="chip">08 / SAFETY</span><b>◉</b></div>
          <h3>Data Safety</h3>
          <p>Local SQLite, verified backups, SHA-256 integrity and validated restore.</p>
          <div className="safe-ring"><span>100%</span><small>LOCAL</small></div>
        </article>

        <article className="sys-card orange reveal delay-2">
          <div className="card-top"><span className="chip">09 / TRAINING</span><b>▶</b></div>
          <h3>Walkthrough Mode</h3>
          <p>Guided training against isolated demo data with resumable progress.</p>
          <div className="steps"><i className="done"></i><i className="done"></i><i className="done"></i><i></i><i></i><i></i></div>
        </article>

        <article className="sys-card indigo span-2 reveal">
          <div className="card-top"><span className="chip">10 / EXPERIENCE</span><b>✣</b></div>
          <h3>Themes & Usability</h3>
          <p>Theme modes, consistent forms, keyboard focus, responsive layouts and print-safe business documents.</p>
          <div className="theme-previews"><span className="light"><i></i><i></i><i></i></span><span className="dark"><i></i><i></i><i></i></span></div>
        </article>
      </div>
    </section>

    <section id="flow" className="section flow-section">
      <div className="section-head reveal">
        <div><span className="eyebrow">02 / OPERATIONAL CHAIN</span><h2>Goods in.<br /><em>Cash back.</em></h2></div>
        <p>The interface mirrors the distribution business: every state transition is visible, traceable and controlled.</p>
      </div>

      <div className="pipeline reveal">
        <div className="pipeline-line"><span></span></div>
        <article><b>01</b><i>↓</i><h3>Receive</h3><p>Supplier invoices, cartons, loose pieces and charges.</p><small>INWARD → POST</small></article>
        <article><b>02</b><i>▦</i><h3>Inventory</h3><p>FIFO lots, on-hand stock, valuation and exceptions.</p><small>STORE → CONTROL</small></article>
        <article><b>03</b><i>→</i><h3>Dispatch</h3><p>Store allocation, pricing snapshots and delivery due dates.</p><small>ALLOCATE → SHIP</small></article>
        <article><b>04</b><i>₹</i><h3>Collect</h3><p>Store payments, cleared balances and receivable status.</p><small>COLLECT → CLEAR</small></article>
        <article><b>05</b><i>↗</i><h3>Analyze</h3><p>Gross margin, profitability, stock and audit intelligence.</p><small>REPORT → DECIDE</small></article>
      </div>
    </section>

    <section id="manual" className="section manual-section">
      <div className="section-head reveal">
        <div><span className="eyebrow">03 / INTERACTIVE MANUAL</span><h2>One manual.<br /><em>Three focused views.</em></h2></div>
        <p>Use the page controller to inspect the original manual while keeping the product experience futuristic.</p>
      </div>

      <div className="manual-layout reveal">
        <div className="manual-controller">
          <div className="controller-top"><span>DOCUMENT / SUNSHINE-MANUAL.PNG</span><b>3 PAGES</b></div>
          <div className="page-tabs" role="tablist" aria-label="Manual pages">
            <button id="manual-tab-0" className={page === 0 ? "page-tab active" : "page-tab"} type="button" role="tab" aria-selected={page === 0} aria-controls="manual-page" tabIndex={page === 0 ? 0 : -1} onClick={() => setPage(0)} onKeyDown={onTabKey}><span>01</span><strong>Foundation</strong><small>Product · Receiving · Stores</small></button>
            <button id="manual-tab-1" className={page === 1 ? "page-tab active" : "page-tab"} type="button" role="tab" aria-selected={page === 1} aria-controls="manual-page" tabIndex={page === 1 ? 0 : -1} onClick={() => setPage(1)} onKeyDown={onTabKey}><span>02</span><strong>Operations</strong><small>Inventory · Audit · Reports</small></button>
            <button id="manual-tab-2" className={page === 2 ? "page-tab active" : "page-tab"} type="button" role="tab" aria-selected={page === 2} aria-controls="manual-page" tabIndex={page === 2 ? 0 : -1} onClick={() => setPage(2)} onKeyDown={onTabKey}><span>03</span><strong>Control</strong><small>Roles · Safety · Usability</small></button>
          </div>
          <div className="manual-readout"><span><i></i> ORIGINAL ARTWORK</span><small>Use ← → keys</small></div>
        </div>

        <div className="manual-viewer" style={{ "--page": page } as CSSProperties}>
          <div className="viewer-head"><span>PREVIEW / 100%</span><div><button type="button" className="prev-page" aria-label="Previous page" onClick={() => changePage(-1)}>←</button><button type="button" className="next-page" aria-label="Next page" onClick={() => changePage(1)}>→</button></div></div>
          <div id="manual-page" className="page-window" role="tabpanel" aria-labelledby={`manual-tab-${page}`} tabIndex={0} onKeyDown={onViewerKey}><img src={sunshineImage} alt={`Sunshine Distribution manual page ${page + 1}: ${pageNames[page]}`} /></div>
          <div className="viewer-grid"></div>
        </div>
      </div>
    </section>

    <section id="security" className="section security-section">
      <div className="security-panel reveal">
        <div className="security-copy">
          <span className="eyebrow">04 / TRUST LAYER</span>
          <h2>Built to keep the business <em>under your control.</em></h2>
          <p>Local storage, role controls, verified backups and auditable activity give the application a strong operational boundary without cloud dependency.</p>
          <div className="security-tags"><span>LOCAL SQLITE</span><span>SHA-256</span><span>RBAC</span><span>ROLLBACK COPY</span><span>AUDIT TRAIL</span></div>
        </div>
        <div className="security-orb">
          <div className="orb-rings"><i></i><i></i><i></i></div>
          <div className="orb-core"><strong>DATA</strong><span>LOCAL</span><small>VERIFIED</small></div>
        </div>
        <div className="security-readouts">
          <div><span>BACKUP INTEGRITY</span><strong>VERIFIED</strong><i>●</i></div>
          <div><span>ACTIVE MODE</span><strong>LOCAL-FIRST</strong><i>●</i></div>
          <div><span>CHANGE HISTORY</span><strong>AUDITED</strong><i>●</i></div>
        </div>
      </div>
    </section>

    <footer>
      <a className="brand footer-brand" href="#overview"><span className="sun-logo small" aria-hidden="true"><i></i></span><span className="brand-text"><b>SUNSHINE</b><em>DISTRIBUTION</em></span></a>
      <Link className="back-catalog" to="/">← SOFTWARE MANUAL CATALOG</Link>
      <a href="#overview">BACK TO TOP ↑</a>
    </footer>
  </main>

  

  </div>;
}
