import React from 'react';
import { BookOpen } from 'lucide-react';
import { cn } from './cn';
import { useReadingProgress } from './useReadingProgress';

interface ReadingRibbonProps {
  /** Element whose scroll position defines "100%". Omit to track the document. */
  articleRef: React.RefObject<HTMLElement | null>;
  /** Rendered beside the percentage; typically a jump link to the analytics tool. */
  action?: React.ReactNode;
  onComplete?: () => void;
  className?: string;
}

/**
 * The fixed reading-progress ribbon and its percentage read-out.
 *
 * Split from `useReadingProgress` so a page can show the number without the
 * bar, or the bar without the number. The percentage is `aria-hidden` because
 * the bar below it already exposes the same value to assistive tech through
 * `role="progressbar"` — announcing both would just double up.
 */
export const ReadingRibbon: React.FC<ReadingRibbonProps> = ({
  articleRef,
  action,
  onComplete,
  className,
}) => {
  const { percent } = useReadingProgress(articleRef, { onComplete });

  return (
    <div className={cn('w-full', className)}>
      <div
        role="progressbar"
        aria-label="Article reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% read`}
        className="h-1 w-full bg-tablet-border/40"
      >
        <div
          className="h-full bg-tablet-red transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="article-no-print flex items-center gap-1.5 font-mono text-xs font-bold text-tablet-red">
        <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{percent}%</span>
      </div>
      {action}
    </div>
  );
};

export default ReadingRibbon;
