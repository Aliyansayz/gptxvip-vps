import { ArrowRight, BookOpen, CheckCircle2, Layers3, type LucideIcon } from "lucide-react";
import type { PointerEvent } from "react";
import type { ManualDefinition } from "./manualTypes";

export default function ManualPreview({ manual, stages, Icon }: { manual: ManualDefinition; stages: string[]; Icon: LucideIcon }) {
  const images = [...new Map(manual.illustrations.map(image => [image.src, image])).values()].slice(0, 3);
  const isTriptych = images[0]?.panels === 3;
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    const shell = event.currentTarget.querySelector<HTMLElement>(".holo-shell");
    if (shell) shell.style.transform = `rotateY(${-5 + x * 3}deg) rotateX(${2 - y * 3}deg) translateY(${y * -2}px)`;
  }
  return <div className={`hero-visual reveal delay-1${images.length ? "" : " guide-preview-text"}`} onPointerMove={tilt} onPointerLeave={event => { const shell = event.currentTarget.querySelector<HTMLElement>(".holo-shell"); if (shell) shell.style.transform = ""; }}>
    <div className="orbit orbit-a" aria-hidden="true" /><div className="orbit orbit-b" aria-hidden="true" />
    <div className="holo-shell">
      <div className="holo-head"><span><i />{images.length ? "HANDBOOK / VISUAL PREVIEW" : "OPERATING WORKFLOW / PREVIEW"}</span><div className="holo-dots" aria-hidden="true"><i /><i /><i /></div></div>
      <div className="screen-grid" aria-hidden="true" />
      {images.length ? <div className={isTriptych ? "guide-preview-pages triptych" : "guide-preview-pages"}>
        {(isTriptych ? images.slice(0, 1) : images).map(image => <img key={image.src} src={image.src} alt={`${manual.title} illustrated handbook preview`} width={image.width} height={image.height} />)}
      </div> : <div className="guide-workflow-preview" aria-label={`${manual.title} workflow preview`}>
        <div className="guide-preview-heading"><span className="guide-preview-icon"><Icon size={27} /></span><div><span>OPERATING PLAYBOOK</span><strong>{manual.title}</strong></div></div>
        <div className="guide-preview-chain">{stages.map((stage, i) => <div key={stage}><span>{String(i + 1).padStart(2, "0")}</span><strong>{stage}</strong><i aria-hidden="true"><ArrowRight size={15} /></i></div>)}</div>
        <div className="guide-preview-record"><span><Layers3 size={16} /> Six connected stages</span><span><CheckCircle2 size={16} /> Review at each handoff</span></div>
        <div className="guide-preview-note"><span>THE WORKING RECORD</span><p>{manual.sections[0].summary}</p><div>{manual.highlights.map(item => <span key={item}>{item}</span>)}</div></div>
      </div>}
      <div className="scan-line" aria-hidden="true" />{[1, 2, 3, 4].map(i => <div key={i} className={`corner c${i}`} aria-hidden="true" />)}
    </div>
    <div className="float-card stock-card"><span className="float-icon"><BookOpen size={18} /></span><div><small>START HERE</small><strong>{manual.highlights[0]}</strong><em>Follow the chapter guide</em></div><b>01</b></div>
    <div className="float-card dispatch-card"><span className="float-icon check"><CheckCircle2 size={18} /></span><div><small>WORKFLOW OUTCOME</small><strong>{manual.highlights[2]}</strong><em>Keep the evidence connected</em></div></div>
    <div className="signal-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
  </div>;
}
