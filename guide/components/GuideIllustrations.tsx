import { useState, type CSSProperties, type KeyboardEvent, type RefObject } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
import type { GuideDefinition } from "./guideTypes";

export default function GuideIllustrations({ guide, manual, surfaceRef }: { guide?: GuideDefinition; manual?: GuideDefinition; surfaceRef: RefObject<HTMLDivElement | null> }) {
  const item = (guide || manual)!;
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = item.illustrations.length;
  const illustration = item.illustrations[page];
  const goToPage = (next: number) => { setPage((next + count) % count); setZoom(false); };
  function onTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    const next = event.key === "ArrowRight" ? (page + 1) % count : event.key === "ArrowLeft" ? (page + count - 1) % count : event.key === "Home" ? 0 : event.key === "End" ? count - 1 : null;
    if (next === null) return;
    event.preventDefault(); goToPage(next);
    surfaceRef.current?.querySelector<HTMLButtonElement>(`#guide-tab-${next}`)?.focus();
  }
  return <section id="illustrations" className="section manual-section guide-artwork" aria-labelledby="illustrations-title">
    <div className="section-head reveal"><div><span className="eyebrow">04 / INTERACTIVE GUIDE</span><h2 id="illustrations-title">Original pages.<br /><em>Every detail in view.</em></h2></div><p>Move between the illustrated pages, zoom in for detail, or open the original picture. Use the arrow keys to navigate.</p></div>
    <div className="manual-layout reveal">
      <div className="manual-controller"><div className="controller-top"><span>DOCUMENT / FIELD GUIDE</span><b>{count} VIEWS</b></div>
        <div role="tablist" aria-label="Illustrated guide pages" className="page-tabs guide-tabs">{item.illustrations.map((illus, i) => <button key={`${illus.src}-${i}`} id={`guide-tab-${i}`} className={page === i ? "page-tab active" : "page-tab"} type="button" role="tab" aria-selected={page === i} aria-controls="guide-illustration" tabIndex={page === i ? 0 : -1} onKeyDown={onTabKey} onClick={() => goToPage(i)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{illus.title}</strong><small>{illus.panels === 3 ? `Panel ${(illus.panel || 0) + 1} / 3` : "Original guide page"}</small></button>)}</div>
        <div className="manual-readout"><span><i /> ORIGINAL ARTWORK</span><small>Use ← → keys</small></div>
      </div>
      <div className="manual-viewer">
        <div className="viewer-head guide-viewer-toolbar"><span aria-live="polite">VIEW {String(page + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><div>
          <button type="button" aria-label="Previous illustrated page" onClick={() => goToPage(page - 1)}><ArrowLeft size={17} /></button>
          <button type="button" aria-label="Next illustrated page" onClick={() => goToPage(page + 1)}><ArrowRight size={17} /></button>
          <button type="button" aria-label={zoom ? "Fit illustration to screen" : "Zoom illustration"} aria-pressed={zoom} onClick={() => setZoom(!zoom)}>{zoom ? <ZoomOut size={17} /> : <ZoomIn size={17} />}</button>
          <a href={illustration.src} target="_blank" rel="noreferrer" aria-label="Open original picture"><ExternalLink size={17} /></a>
        </div></div>
        <div id="guide-illustration" role="tabpanel" aria-labelledby={`guide-tab-${page}`} tabIndex={0} className="guide-viewer" onKeyDown={(event) => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); goToPage(page + (event.key === "ArrowRight" ? 1 : -1)); } }}>
          <figure style={{ "--panel-count": illustration.panels || 1, "--panel-index": illustration.panel || 0, "--panel-ratio": `${illustration.width / (illustration.panels || 1)} / ${illustration.height}` } as CSSProperties} className={zoom ? "guide-image-frame is-zoomed" : "guide-image-frame"}>
            <img src={illustration.src} alt={illustration.alt} width={illustration.width} height={illustration.height} loading="lazy" />
          </figure>
        </div>
        <p className="guide-caption">{illustration.title} · original guide artwork and example screens</p>
      </div>
    </div>
  </section>;
}
