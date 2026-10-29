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
    <section className={`border-b border-ink/10 bg-white/65 py-16 sm:py-20 ${className}`} aria-label={eyebrow}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0c0d12] text-white shadow-xl shadow-slate-900/10">
            <div className="grid lg:grid-cols-2">
              {/* -------------------------------------------------- offer */}
              <div className="p-6 sm:p-8 lg:p-10">
                <RevealGroup stagger={0.07}>
                  <RevealItem>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8ff38]">{eyebrow}</p>
                  </RevealItem>
                  <RevealItem>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-bold leading-[1.1] tracking-tight font-display" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {headline}
                    </h2>
                  </RevealItem>
                  <RevealItem>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">{body}</p>
                  </RevealItem>
                  <RevealItem>
                    {highlights.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                        {highlights.map((item) => (
                          <li key={item} className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#d8ff38]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </RevealItem>
                  <RevealItem>
                    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3">
                      <button
                        type="button"
                        onClick={primaryAction.onSelect}
                        className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#d8ff38] px-5 py-2.5 text-xs font-bold text-[#101014] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#c6f028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 active:scale-[0.96] motion-reduce:transform-none"
                      >
                        {primaryAction.label}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                      </button>
                      {secondaryAction && (
                        <button
                          type="button"
                          onClick={secondaryAction.onSelect}
                          className="inline-flex min-h-11 items-center rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-slate-300 transition-colors duration-150 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                        >
                          {secondaryAction.label}
                        </button>
                      )}
                    </div>
                  </RevealItem>
                </RevealGroup>
              </div>

              {/* -------------------------------------------------- quote */}
              <div className="flex flex-col justify-center border-t border-dashed border-white/15 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <Reveal from="right" distance={24}>
                  <Quote className="h-6 w-6 text-[#d8ff38]/80" aria-hidden="true" />
                  <blockquote className="mt-4 text-balance text-lg sm:text-xl font-medium leading-relaxed tracking-[-0.01em] text-slate-100">
                    {quote}
                  </blockquote>
                  <footer className="mt-5 text-xs text-slate-400">
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
