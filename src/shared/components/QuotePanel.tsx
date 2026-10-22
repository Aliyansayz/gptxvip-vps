import React from 'react';
import { ArrowRight, Quote } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from './Reveal';

/**
 * Split offer + quote panel.
 *
 * Left column makes a concrete claim and offers a way in; right column carries a
 * single attributed quote. Lives in `shared/` because both landing surfaces use
 * it, and because the two halves are only useful together.
 *
 * The attribution is deliberately a prop with no default. Anonymous quotes are
 * honest about being anonymous; inventing a name and a company to fill the slot
 * would be a fabricated testimonial, which is worse than having none.
 */
export interface QuotePanelAction {
  label: string;
  onSelect: () => void;
}

export interface QuotePanelProps {
  /** Small uppercase label above the headline. */
  eyebrow: string;
  /**
   * Headline. Pass a fragment so the emphasis split reads as structure:
   * `<>Stop reading about it.<span className="text-slate-400">Run it.</span></>`
   */
  headline: React.ReactNode;
  body: string;
  /** Short uppercase facts, rendered as a dot-separated row. */
  highlights: string[];
  primaryAction: QuotePanelAction;
  secondaryAction?: QuotePanelAction;
  quote: string;
  /** e.g. "Anonymous" */
  attribution: string;
  /** e.g. "Beta reader" — rendered after the attribution. */
  attributionDetail?: string;
  className?: string;
}

export function QuotePanel({
  eyebrow,
  headline,
  body,
  highlights,
  primaryAction,
  secondaryAction,
  quote,
  attribution,
  attributionDetail,
  className = '',
}: QuotePanelProps) {
  return (
    <section className={`bg-white/65 px-4 py-16 sm:px-6 sm:py-24 ${className}`} aria-label={eyebrow}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink text-white">
            <div className="grid lg:grid-cols-2">
              {/* -------------------------------------------------- offer */}
              <div className="px-6 py-10 sm:px-10 sm:py-12 lg:pr-14">
                <RevealGroup stagger={0.07}>
                  <RevealItem>
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-accent-400">{eyebrow}</p>
                  </RevealItem>
                  <RevealItem>
                    <h2 className="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.035em]">
                      {headline}
                    </h2>
                  </RevealItem>
                  <RevealItem>
                    <p className="mt-5 max-w-lg leading-7 text-slate-300">{body}</p>
                  </RevealItem>
                  <RevealItem>
                    {highlights.length > 0 && (
                      <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
                        {highlights.map((item) => (
                          <li key={item} className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </RevealItem>
                  <RevealItem>
                    <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <button
                        type="button"
                        onClick={primaryAction.onSelect}
                        className="group inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-zinc-950 transition-[transform,background-color] duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink active:scale-[0.96] motion-reduce:transform-none"
                      >
                        {primaryAction.label}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                      </button>
                      {secondaryAction && (
                        <button
                          type="button"
                          onClick={secondaryAction.onSelect}
                          className="inline-flex min-h-12 items-center rounded-lg px-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-slate-300 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                        >
                          {secondaryAction.label}
                        </button>
                      )}
                    </div>
                  </RevealItem>
                </RevealGroup>
              </div>

              {/* -------------------------------------------------- quote */}
              {/*
                Dashed rather than solid: this is a separation between two
                independent voices, not a structural division, and a hairline
                border would read as a table cell.
              */}
              <div className="flex flex-col justify-center border-t border-dashed border-white/15 px-6 py-10 sm:px-10 sm:py-12 lg:border-l lg:border-t-0 lg:pl-14">
                <Reveal from="right" distance={24}>
                  <Quote className="h-8 w-8 text-accent-400/70" aria-hidden="true" />
                  <blockquote className="mt-6 text-balance text-xl font-medium leading-relaxed tracking-[-0.01em] text-slate-100 sm:text-2xl">
                    {quote}
                  </blockquote>
                  <footer className="mt-7 text-sm text-slate-300">
                    <span className="font-bold text-white">{attribution}</span>
                    {attributionDetail && <span className="text-slate-400"> · {attributionDetail}</span>}
                  </footer>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default QuotePanel;
