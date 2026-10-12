import React, { useMemo } from 'react';
import katex from 'katex';
// Loaded once, here, rather than per consumer: every previous maths surface in
// this app imported the stylesheet at its own top level, so Vite bundled the
// same font metrics into several chunks.
import 'katex/dist/katex.min.css';
import { cn } from './cn';

/**
 * KaTeX is this project's math renderer (see ReinforcementLearningOverviewActivity
 * and ConvexConcaveOverview). The source template used MathJax; swapping in a
 * second math engine would double the payload and ship two sets of font metrics
 * for no gain.
 *
 * `throwOnError: false` matters here more than in a lab: an article body is
 * authored prose, so a single malformed macro must degrade to a visible error
 * string inside the plate rather than throwing during render and blanking the
 * whole page.
 */
function renderMath(tex: string, displayMode: boolean): string {
  return katex.renderToString(tex, { throwOnError: false, displayMode });
}

interface MathBlockProps {
  /** TeX source. Wrap inline snippets in `$…$` yourself only for display mode. */
  children: string;
  /** Block (centred, own line) or inline (flows with the sentence). */
  mode?: 'block' | 'inline';
  className?: string;
}

/**
 * Display maths. Rendered through `dangerouslySetInnerHTML` because KaTeX returns
 * an HTML string by design — it escapes its own output, and the input is a
 * build-time constant in every call site rather than user input.
 */
export const MathBlock: React.FC<MathBlockProps> = ({ children, mode = 'block', className }) => {
  const html = useMemo(() => renderMath(children, mode === 'block'), [children, mode]);

  if (mode === 'inline') {
    return (
      <span
        className={cn('[&_.katex]:text-inherit', className)}
        // Safe: KaTeX-escaped output from a build-time constant.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={cn(
        'article-print-plain my-4 overflow-x-auto rounded-r-sm border-l-4 border-tablet-ink bg-tablet-highlight p-4 font-mono text-xs sm:my-6 sm:p-6 sm:text-sm',
        className,
      )}
    >
      {/* Safe: KaTeX-escaped output from a build-time constant. */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

/**
 * Renders TeX embedded in a plain-text string, splitting on `$…$` delimiters.
 *
 * Article copy in this app is stored as prose with inline maths written by hand,
 * so this is what turns "…returns $\rho$ between…" into readable typography
 * without the author needing to build an array of nodes.
 */
export const MathText: React.FC<{ children: string; className?: string }> = ({
  children,
  className,
}) => {
  const parts = useMemo(() => {
    // Split on $…$ keeping the delimiters, so the maths survives as a segment.
    const segments = children.split(/(\$[^$]+\$)/g).filter((segment) => segment !== '');
    return segments.map((segment, index) => {
      const isMath = segment.startsWith('$') && segment.endsWith('$') && segment.length > 2;
      return {
        key: `${index}-${segment.slice(0, 12)}`,
        isMath,
        tex: isMath ? segment.slice(1, -1) : segment,
      };
    });
  }, [children]);

  return (
    <span className={className}>
      {parts.map((part) =>
        part.isMath ? (
          <MathBlock key={part.key} mode="inline">
            {part.tex}
          </MathBlock>
        ) : (
          <React.Fragment key={part.key}>{part.tex}</React.Fragment>
        ),
      )}
    </span>
  );
};
