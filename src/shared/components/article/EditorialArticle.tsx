import React, { useRef } from 'react';
import { Link } from 'react-router';
import { ReadingRibbon } from './ReadingRibbon';
import { ShareBar } from './ShareBar';
import { EditorialFigure } from './EditorialFigure';
import { cn } from './cn';

export interface ArticleRelatedItem {
  id: string;
  eyebrow: string;
  title: string;
  meta: string;
  href: string;
}

export interface EditorialArticleProps {
  /** Breadcrumb leaf names, most general first. */
  crumbs: { label: string; href?: string }[];
  /** Eyebrow above the headline. */
  section: string;
  title: string;
  /** Standfirst — the italic one-liner under the headline. */
  deck: string;
  /** "Published 12 October 2026 · 14 min read". */
  byline: string;
  figure?: {
    eyebrow?: string;
    headline: React.ReactNode;
    caption: string;
    iconKey?: string;
    iconTitle?: string;
  };
  /** Rendered inside `.article-prose`; wrap paragraphs in the prose primitives. */
  children: React.ReactNode;
  related?: ArticleRelatedItem[];
  relatedHeading?: string;
  /** Jump target for the ribbon's right-hand link. */
  toolHref?: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * The standard long-form reading surface.
 *
 * This is the single component every article-shaped page in the app should
 * render through — agent-lab chapters, software-manual deep dives, blog posts.
 * It owns the parts that must be identical everywhere: the reading ribbon, the
 * breadcrumb, the standfirst, the plate, the measure, and the related strip.
 * Content between the plate and the related strip is entirely the caller's.
 *
 * **Author section intentionally absent.** The design this was ported from ended
 * with an "About the author" card. That card assumes a named human byline, which
 * does not hold for generated agent content, and it pushed the related strip
 * below a block of biography most readers skipped. Removing it is a deliberate
 * product decision, not an omission.
 */
export const EditorialArticle: React.FC<EditorialArticleProps> = ({
  crumbs,
  section,
  title,
  deck,
  byline,
  figure,
  children,
  related,
  relatedHeading = 'Related Readings',
  toolHref,
  onComplete,
  className,
}) => {
  const articleRef = useRef<HTMLElement>(null);

  return (
    <div className={cn('bg-tablet-bg text-tablet-ink', className)}>
      {/* Fixed ribbon. Sits outside the article ref because it measures it. */}
      <div className="article-no-print fixed inset-x-0 top-0 z-50">
        <ReadingRibbon
          articleRef={articleRef}
          onComplete={onComplete}
          action={
            toolHref ? (
              <Link
                to={toolHref}
                className="hidden text-[11px] uppercase tracking-widest text-tablet-muted transition-colors hover:text-tablet-ink sm:inline"
              >
                Analytics Tool
              </Link>
            ) : null
          }
        />
      </div>

      <main className="mx-auto max-w-4xl px-4 pb-6 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 font-sans text-[11px] uppercase tracking-widest sm:mb-4 sm:text-xs"
        >
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                {index > 0 ? (
                  <span className="text-tablet-muted" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {crumb.href ? (
                  <Link to={crumb.href} className="font-bold text-tablet-red hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-tablet-muted">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-6 sm:mb-8">
          <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-widest text-tablet-red sm:text-xs">
            {section}
          </p>
          <h1 className="font-serif text-2xl font-bold leading-[1.15] tracking-tight text-tablet-ink sm:text-5xl sm:leading-[1.12] lg:text-6xl">
            {title}
          </h1>
          <p className="mt-4 border-l-2 border-tablet-red pl-3 font-serif text-base italic leading-relaxed text-tablet-muted sm:mt-6 sm:pl-4 sm:text-2xl">
            {deck}
          </p>

          <div className="flex flex-col gap-3 border-y border-tablet-border py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:py-4">
            <p className="font-sans text-xs text-tablet-muted">{byline}</p>
            <ShareBar title={title} className="article-no-print" />
          </div>
        </header>

        {figure ? (
          <EditorialFigure
            eyebrow={figure.eyebrow}
            headline={figure.headline}
            caption={figure.caption}
            iconKey={figure.iconKey}
            iconTitle={figure.iconTitle}
          />
        ) : null}

        <article
          ref={articleRef}
          className="article-prose text-base leading-relaxed text-tablet-ink sm:text-lg"
        >
          {children}
        </article>

        {related && related.length > 0 ? (
          <section className="mt-12 border-t-2 border-tablet-ink pt-6 sm:mt-16 sm:pt-8">
            <h3 className="mb-4 font-serif text-xl font-bold text-tablet-ink sm:mb-6 sm:text-2xl">
              {relatedHeading}
            </h3>
            <div className="grid grid-cols-1 gap-4 font-sans md:grid-cols-2 sm:gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="border border-tablet-border bg-tablet-surface p-4 transition-colors hover:border-tablet-ink sm:p-5"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-tablet-red">
                    {item.eyebrow}
                  </span>
                  <h4 className="mt-2 font-serif text-base font-bold text-tablet-ink transition-colors hover:text-tablet-red sm:text-lg">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-xs text-tablet-muted">{item.meta}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
};

export default EditorialArticle;
