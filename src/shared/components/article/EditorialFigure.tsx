import React from 'react';
import { ColorfulIcon } from '../icons/ColorfulIcon';
import { cn } from './cn';

interface FigureProps {
  /** Small uppercase label sitting above the headline, e.g. a metric name. */
  eyebrow?: string;
  headline: React.ReactNode;
  caption: React.ReactNode;
  /** Decorative colorful icon shown above the headline. */
  iconKey?: string;
  /** Supply when the icon carries meaning on its own; otherwise decorative. */
  iconTitle?: string;
  className?: string;
}

/**
 * Editorial illustration plate.
 *
 * Deliberately inverted against the page ground: an article that is otherwise
 * all paper needs one dark anchor near the top to establish hierarchy. It is
 * also the only place the colorful icon packs render large enough for their
 * palette to be the point — elsewhere they sit at 20–32px where the colour
 * difference from a monochrome glyph is marginal.
 */
export const EditorialFigure: React.FC<FigureProps> = ({
  eyebrow,
  headline,
  caption,
  iconKey,
  iconTitle,
  className,
}) => (
  <figure className={cn('article-print-plain mb-8 sm:mb-12', className)}>
    <div className="relative overflow-hidden rounded-sm border border-tablet-border bg-zinc-900 p-5 text-white shadow-lg sm:p-10">
      {/* Dot grid. Purely atmospheric, so it is hidden from assistive tech. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {eyebrow ? (
          <div className="mb-2 rounded-full border border-amber-800/50 bg-amber-950/60 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-400/90 sm:mb-3 sm:text-[11px]">
            {eyebrow}
          </div>
        ) : null}

        {iconKey ? (
          <ColorfulIcon
            name={iconKey}
            size={96}
            title={iconTitle}
            className="mb-3 sm:mb-4"
          />
        ) : null}

        <div className="my-3 font-serif text-2xl font-bold tracking-wide text-white sm:my-4 sm:text-5xl">
          {headline}
        </div>

        <div className="my-3 h-0.5 w-20 bg-gradient-to-r from-tablet-red via-amber-400 to-amber-200 sm:my-4 sm:w-24" />

        <p className="max-w-xl font-sans text-xs leading-relaxed text-zinc-300 sm:text-sm">
          {caption}
        </p>
      </div>
    </div>

    {/* Doubles as the accessible name for the whole figure. */}
    <figcaption className="mt-2.5 text-center font-sans text-[11px] italic text-tablet-muted sm:text-xs">
      {caption}
    </figcaption>
  </figure>
);

