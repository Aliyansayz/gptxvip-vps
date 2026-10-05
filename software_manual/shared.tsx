import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import type { Manual } from "./catalogData";

// Only colors present in RootHomePage, Navbar and Footer. Reference Tailwind's
// native variables so this surface stays aligned with the landing page palette.
export const manualTheme = {
  "--manual-canvas": "var(--color-slate-950)",
  "--manual-surface": "var(--color-slate-900)",
  "--manual-raised": "var(--color-slate-800)",
  "--manual-text": "var(--color-zinc-100)",
  "--manual-secondary": "var(--color-slate-300)",
  "--manual-muted": "var(--color-slate-400)",
  "--manual-border": "color-mix(in srgb, var(--color-white) 10%, transparent)",
  "--manual-primary": "var(--color-cyan-500)",
  "--manual-hover": "var(--color-cyan-700)",
  "--manual-info": "var(--color-cyan-400)",
  "--manual-focus": "var(--color-cyan-300)",
  "--manual-success": "var(--color-emerald-500)",
  "--manual-warning": "var(--color-cyan-300)",
  "--manual-error": "var(--color-violet-500)",
} as CSSProperties;

export function useManualSurface(title: string) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .1 });
    root.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    // Restore section links when entering a route directly, after its lazy chunk loads.
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.title = previousTitle; };
  }, [title]);
  return ref;
}

export function ManualCard({ manual, hidden, onOpen, children }: {
  manual: Manual; hidden: boolean; onOpen: (manual: Manual) => void; children: ReactNode;
}) {
  function tilt(event: PointerEvent<HTMLElement>) {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.transform = `translateY(-7px) perspective(800px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg)`;
  }
  return <article className={`manual-card ${manual.classes}${hidden ? " hidden" : ""}`}
    data-manual-id={manual.id} data-category={manual.category} data-title={manual.title}
    tabIndex={hidden ? -1 : 0} role="link" aria-label={manual.href ? `Open ${manual.title} manual` : `Preview ${manual.title}; full manual coming soon`}
    onClick={() => onOpen(manual)} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(manual); }
    }} onPointerMove={tilt} onPointerLeave={(event) => { event.currentTarget.style.transform = ""; }}>
    <div className="card-no">{manual.id.padStart(2, "0")}</div>
    {children}
    <div className="manual-info">
      <div className="manual-tags">{manual.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <h3>{manual.heading}</h3><p>{manual.description}</p>
      <div className="card-bottom"><span><i />{manual.href ? " READY" : " COVER PREVIEW"}</span>
        <button className="mini-open" type="button" aria-label={manual.href ? `Open ${manual.title}` : `Preview ${manual.title}`} onClick={(event) => { event.stopPropagation(); onOpen(manual); }}>↗</button>
      </div>
    </div>
  </article>;
}
