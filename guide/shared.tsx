import { useEffect, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import type { GuideItem } from "./catalogData";
import "./theme.css";

/**
 * Boulevard Creative Studio theme tokens applied across all /guide surfaces.
 * Matches boulevard-landing-page.html palette:
 * --ink: #101014, --blue: #343edb, --blue2: #7d91ff, --lime: #d8ff38,
 * --paper: #ffffff, --muted: #777780, --line: #e9e9ec, --night: #111114
 */
export const guideTheme = {
  "--ink": "#101014",
  "--blue": "#343edb",
  "--blue2": "#7d91ff",
  "--lime": "#d8ff38",
  "--paper": "#ffffff",
  "--muted": "#777780",
  "--line": "#e9e9ec",
  "--night": "#111114",
  "--manual-canvas": "#ffffff",
  "--manual-surface": "#f5f5f7",
  "--manual-raised": "#ececf0",
  "--manual-text": "#101014",
  "--manual-secondary": "#45454f",
  "--manual-muted": "#777780",
  "--manual-border": "#e9e9ec",
  "--manual-primary": "#343edb",
  "--manual-hover": "#2534bf",
  "--manual-info": "#343edb",
  "--manual-focus": "#343edb",
  "--manual-accent-warm": "#7d91ff",
  "--manual-accent-warm-soft": "#9ba7ff",
  "--manual-hero-face": "'Space Grotesk', var(--font-sans), sans-serif",
  "--manual-success": "#16a34a",
  "--manual-warning": "#d97706",
  "--manual-error": "#dc2626",
} as CSSProperties;

export const manualTheme = guideTheme;

export function useGuideSurface(title: string) {
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
    const frame = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (id) document.getElementById(id)?.scrollIntoView();
      else window.scrollTo(0, 0);
    });
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.title = previousTitle; };
  }, [title]);
  return ref;
}

export const useManualSurface = useGuideSurface;

export function GuideCard({ guide, manual, hidden, onOpen, children }: {
  guide?: GuideItem; manual?: GuideItem; hidden: boolean; onOpen: (item: GuideItem) => void; children: ReactNode;
}) {
  const item = (guide || manual)!;
  function tilt(event: PointerEvent<HTMLElement>) {
    if (!matchMedia("(pointer:fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.transform = `translateY(-5px) perspective(800px) rotateX(${y * -2}deg) rotateY(${x * 2}deg)`;
  }
  return <article className={`manual-card ${item.classes}${hidden ? " hidden" : ""}`}
    data-manual-id={item.id} data-category={item.category} data-title={item.title}
    tabIndex={hidden ? -1 : 0} role="link" aria-label={item.href ? `Open ${item.title} guide` : `Preview ${item.title}; full guide coming soon`}
    onClick={() => onOpen(item)} onKeyDown={(event) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onOpen(item); }
    }} onPointerMove={tilt} onPointerLeave={(event) => { event.currentTarget.style.transform = ""; }}>
    <div className="card-no">{item.id.padStart(2, "0")}</div>
    {children}
    <div className="manual-info">
      <div className="manual-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <h3>{item.heading}</h3><p>{item.description}</p>
      <div className="card-bottom"><span><i />{item.href ? " READY" : " COVER PREVIEW"}</span>
        <button className="mini-open" type="button" aria-label={item.href ? `Open ${item.title}` : `Preview ${item.title}`} onClick={(event) => { event.stopPropagation(); onOpen(item); }}>↗</button>
      </div>
    </div>
  </article>;
}

export const ManualCard = GuideCard;
