import type { ReactNode } from 'react';

interface StatePanelProps {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  children?: ReactNode;
  tone?: 'neutral' | 'warning';
  className?: string;
  headingLevel?: 1 | 2;
}

export function StatePanel({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  children,
  tone = 'neutral',
  className = '',
  headingLevel = 2,
}: StatePanelProps) {
  const actionClass = 'mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200';
  const Heading = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <section role="status" className={`rounded-2xl border p-6 sm:p-8 ${tone === 'warning' ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'} ${className}`}>
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700 dark:text-cyan-300">{eyebrow}</p>}
      <Heading className="mt-2 text-xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-2xl">{title}</Heading>
      <p className="mt-3 max-w-prose leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      {children}
      {actionLabel && actionHref && <a href={actionHref} className={actionClass}>{actionLabel}</a>}
      {actionLabel && !actionHref && onAction && <button type="button" onClick={onAction} className={actionClass}>{actionLabel}</button>}
    </section>
  );
}
