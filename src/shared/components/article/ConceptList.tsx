import React from 'react';
import { ChevronDown, ListOrdered } from 'lucide-react';
import { cn } from './cn';

/**
 * A concept as the theory pane stores it. Declared locally rather than imported
 * from the agentic-roles types so `shared/` stays independent of any feature
 * area — the article system must be usable from the software manual and blogs
 * without pulling in the whole agentic-roles module graph.
 */
export interface Concept {
  concept: string;
  definition: string;
  elaboration: string;
  industry_application: string;
}

/**
 * The glossary list of a chapter's `critical_concepts`.
 *
 * Native `<details>` so keyboard support, find-in-page, and print behaviour all
 * come from the browser rather than being reimplemented. The theory pane
 * collapsed these behind the same affordance, so keeping them collapsed here
 * preserves the reader's learned expectation that there is more to expand.
 *
 * First item is open by default: a fully collapsed list on landing reads as an
 * empty page, and the first entry is the one that defines the chapter.
 */
export const ConceptList: React.FC<{ concepts: Concept[] }> = ({ concepts }) => {
  if (!concepts || concepts.length === 0) return null;

  return (
    <section className="my-8">
      <h3 className="mb-4 flex items-center gap-2 font-serif text-lg font-bold text-tablet-ink sm:text-xl">
        <ListOrdered className="h-4 w-4 text-tablet-red" aria-hidden="true" />
        Critical Concepts
      </h3>

      <div className="divide-y divide-tablet-border border-y border-tablet-border">
        {concepts.map((item, index) => (
          <details key={item.concept} open={index === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-1 py-3 font-sans text-sm font-semibold text-tablet-ink marker:content-none hover:text-tablet-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tablet-red">
              <span>
                <span className="mr-2 font-mono text-xs text-tablet-muted">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {item.concept}
              </span>
              {/* Rotates to indicate open state; purely decorative since
                  `details[open]` is already exposed to assistive tech. */}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-tablet-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </summary>

            <div className="space-y-3 px-1 pb-4 pl-7 font-body text-sm leading-7 text-tablet-muted">
              <p>
                <strong className="font-semibold text-tablet-ink">Definition. </strong>
                {item.definition}
              </p>
              <p>{item.elaboration}</p>
              <p className="border-l-2 border-tablet-border pl-3 italic">
                <strong className="not-italic text-tablet-ink">Industry application. </strong>
                {item.industry_application}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

/**
 * Compact concept chips for surfaces where the full list is too tall — the
 * landing-page preview, a chapter index, search results. Names only; the
 * definitions stay one tap away in the article.
 */
export const ConceptChips: React.FC<{ concepts: Concept[]; className?: string }> = ({
  concepts,
  className,
}) => {
  if (!concepts || concepts.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {concepts.map((item) => (
        <li
          key={item.concept}
          className="rounded-full border border-tablet-border bg-tablet-highlight px-2.5 py-1 font-sans text-[11px] text-tablet-muted"
        >
          {item.concept}
        </li>
      ))}
    </ul>
  );
};
