import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface RoleVisualCardProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  /** Right-aligned header slot (pills, toggles). */
  aside?: React.ReactNode;
  /** Position in the stagger sequence (60ms per step). */
  index?: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * White bento card used inside the activity tray (26px tray - 8px padding = 18px card).
 * Header: dark circular icon badge, title, description and an optional status slot.
 */
export default function RoleVisualCard({ icon: Icon, title, description, aside, index = 0, className = '', children }: RoleVisualCardProps) {
  return (
    <section
      style={{ '--i': index } as React.CSSProperties}
      className={`role-enter role-panel min-w-0 rounded-[18px] bg-white p-4 dark:bg-slate-950 sm:p-5 ${className}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span aria-hidden="true" className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug text-slate-900 text-balance dark:text-slate-100">{title}</h3>
            {description && <p className="mt-0.5 text-xs leading-5 text-slate-500 text-pretty dark:text-slate-400">{description}</p>}
          </div>
        </div>
        {aside && <div className="flex shrink-0 items-center gap-2">{aside}</div>}
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
