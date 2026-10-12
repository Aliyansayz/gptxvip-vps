import { useEffect, useState } from 'react';

export interface ReadingProgress {
  /** 0–100, integer. */
  percent: number;
  /** True once the reader has reached the foot of the article. */
  complete: boolean;
}

export interface Options {
  /** Fallback when no ancestor scroller is found. */
  selector?: string;
  /** Called at most once per article, when `percent` first reaches 100. */
  onComplete?: () => void;
}

/**
 * Tracks how far through an article the reader is, as a percentage.
 *
 * Two corrections to the naive version of this calculation:
 *
 * 1. **Nested scrollers.** Articles in this app sometimes sit inside an
 *    overflow container rather than scrolling the window (see
 *    `[data-blog-scroll]` in BlogArticle.tsx). Measuring the window when the
 *    real scroller is an ancestor element reports 100% permanently, so the
 *    nearest scrollable ancestor wins and the window is only the fallback.
 *
 * 2. **Short articles.** When an article is shorter than its viewport,
 *    `scrollHeight - clientHeight` is zero. Dividing by zero yields `NaN`, which
 *    renders as an empty percentage. A complete-but-unscrollable article is
 *    reported as 100% instead, since the reader can see all of it already.
 *
 * Reads are batched into a `requestAnimationFrame` because `scroll` fires far
 * more often than the screen refreshes, and a synchronous `setState` per event
 * is what makes progress bars feel expensive to drag.
 */
export function useReadingProgress(
  ref: React.RefObject<HTMLElement | null>,
  { selector, onComplete }: Options = {},
): ReadingProgress {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const article = ref.current;
    if (!article) return;

    let frame = 0;
    let announced = false;

    const resolveScroller = (): HTMLElement | Window => {
      const explicit = selector ? article.closest<HTMLElement>(selector) : null;
      if (explicit && explicit.scrollHeight > explicit.clientHeight + 1) return explicit;

      // Walk up for the first ancestor that can actually scroll vertically.
      let node = article.parentElement;
      while (node && node !== document.body) {
        const overflowY = window.getComputedStyle(node).overflowY;
        const scrollable = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
        if (scrollable && node.scrollHeight > node.clientHeight + 1) return node;
        node = node.parentElement;
      }
      return window;
    };

    const measure = (scroller: HTMLElement | Window) => {
      if (scroller === window) {
        const document = window.document;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const top = window.scrollY || document.documentElement.scrollTop;
        return max > 0 ? (top / max) * 100 : 100;
      }
      const element = scroller as HTMLElement;
      const max = element.scrollHeight - element.clientHeight;
      return max > 0 ? (element.scrollTop / max) * 100 : 100;
    };

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scroller = resolveScroller();
        const next = Math.max(0, Math.min(100, Math.round(measure(scroller))));
        setPercent(next);

        if (next >= 100 && !announced) {
          announced = true;
          onComplete?.();
        }
      });
    };

    // Re-resolve after fonts land: Playfair/Lora are `display=swap`, so the
    // article reflows once they arrive and every measurement shifts.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(update).catch(() => {});

    update();
    const scroller = resolveScroller();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ref, selector, onComplete]);

  return { percent, complete: percent >= 100 };
}
