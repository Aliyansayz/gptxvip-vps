import React from 'react';
import { Printer, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from './cn';

interface ShareBarProps {
  title: string;
  className?: string;
}

/**
 * Share affordances.
 *
 * Uses `sonner` rather than the bespoke toast in the source template because
 * `sonner` is already a dependency and three `<Toaster>` instances are already
 * mounted in the app — a second toast implementation would compete with them.
 *
 * The Web Share API is used when present so mobile readers get the OS sheet;
 * everywhere else the action degrades to copying the URL, which is the only
 * sharing gesture that works without a backend.
 */
export const ShareBar: React.FC<ShareBarProps> = ({ title, className }) => {
  const share = async () => {
    const url = window.location.href;
    const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    if (canShare) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User dismissed the OS sheet, or the browser refused. Fall through to
        // the clipboard path rather than surfacing an error for a cancelled share.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      // Clipboard is unavailable on insecure origins and in some embedded
      // webviews, so the URL is shown as a last resort instead of failing silently.
      toast.message('Copy this link', { description: url });
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <span className="text-[10px] uppercase tracking-widest text-tablet-muted">Share</span>
      <button
        type="button"
        onClick={share}
        className="rounded-sm p-2 text-tablet-muted transition-colors hover:text-tablet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tablet-red"
        aria-label={`Share: ${title}`}
      >
        <Share2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="hidden rounded-sm p-2 text-tablet-muted transition-colors hover:text-tablet-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tablet-red sm:inline"
        aria-label="Print this article"
      >
        <Printer className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};
