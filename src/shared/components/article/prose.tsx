import React from 'react';
import { cn } from './cn';

/**
 * Opening paragraph. The `.drop-cap` class is what applies the floated initial
 * letter (see article.css); the element carries it rather than the parent so a
 * chapter can lead with a figure instead and simply not render this.
 */
export const LeadParagraph: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('drop-cap text-lg leading-relaxed text-tablet-ink sm:text-xl', className)}>
    {children}
  </p>
);

/**
 * Pull quote. The double rule above and below is the element that reads as
 * "editorial" at a glance, so it is deliberately not a bordered card.
 */
export const PullQuote: React.FC<{ quote: string; attribution?: string }> = ({
  quote,
  attribution,
}) => (
  <blockquote className="my-8 border-y-2 border-tablet-ink bg-tablet-highlight/50 px-4 py-6 text-center sm:my-10 sm:px-6 sm:py-8">
    <p className="font-serif text-xl font-bold italic leading-snug text-tablet-ink sm:text-3xl">
      &ldquo;{quote}&rdquo;
    </p>
    {attribution ? (
      <footer className="mt-3 font-sans text-[10px] uppercase tracking-widest text-tablet-muted sm:mt-4 sm:text-xs">
        — {attribution}
      </footer>
    ) : null}
  </blockquote>
);

interface SectionHeadingProps {
  /** Rendered as "1. Title" when given. Pass nothing for an unnumbered section. */
  number?: number | string;
  children: React.ReactNode;
  level?: 2 | 3;
  id?: string;
  className?: string;
}

/**
 * Section heading. `h2`/`h3` rather than a `<div>` so the article exposes a real
 * document outline; the base layer's uppercase rule is already cancelled inside
 * `.article-prose` by article.css, so no per-element `normal-case` is needed.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  children,
  level = 2,
  id,
  className,
}) => {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <Tag
      id={id}
      className={cn(
        'border-b border-tablet-border pb-2 pt-4 font-serif font-bold text-tablet-ink sm:pt-6',
        level === 2 ? 'text-xl sm:text-3xl' : 'text-lg sm:text-xl',
        className,
      )}
    >
      {number !== undefined ? `${number}. ` : null}
      {children}
    </Tag>
  );
};

interface FootnoteRefProps {
  /** Target id inside the notes section, e.g. "note-1". */
  target: string;
  children: React.ReactNode;
}

/**
 * Superscript source marker. Upward-pointing superscript is the convention that
 * tells a reader "a citation lives at the foot", so it is not spelled out.
 */
export const FootnoteRef: React.FC<FootnoteRefProps> = ({ target, children }) => (
  <a href={`#${target}`} className="article-footnote-ref">
    [{children}]
  </a>
);

interface Note {
  id: string;
  content: React.ReactNode;
}

/**
 * Notes and references section. `ol` keeps the numbering semantic even though
 * each entry also renders its own "[n]" prefix for skimmers who scan rather
 * than read in order.
 */
export const NotesSection: React.FC<{ notes: Note[]; title?: string }> = ({
  notes,
  title = 'Notes & Academic References',
}) => {
  if (notes.length === 0) return null;

  return (
    <section className="mt-8 border-t border-tablet-border pt-6 font-sans text-xs text-tablet-muted sm:mt-12">
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-tablet-ink">
        {title}
      </h4>
      <ol className="space-y-2">
        {notes.map((note, index) => (
          <li key={note.id} id={note.id} className="scroll-mt-24 leading-relaxed">
            <span aria-hidden="true">[{index + 1}] </span>
            {note.content}
          </li>
        ))}
      </ol>
    </section>
  );
};
