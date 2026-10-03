import React from 'react';

interface SpotlightBorderCardProps {
  children: React.ReactNode;
  spotlightRgb: string;
  baseColorClassName?: string;
  className?: string;
  innerClassName?: string;
}

/** The inner surface masks the spotlight so color appears only along the card edge. */
export const SpotlightBorderCard: React.FC<SpotlightBorderCardProps> = ({
  children,
  spotlightRgb,
  baseColorClassName = 'bg-slate-200 dark:bg-slate-800',
  className = '',
  innerClassName = '',
}) => {
  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - bounds.top}px`);
  };

  return (
    <article
      onPointerMove={handlePointerMove}
      className={`group relative min-w-0 overflow-hidden rounded-2xl p-[2px] shadow-sm transition-shadow duration-200 hover:shadow-md ${baseColorClassName} ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ background: `radial-gradient(600px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), rgba(${spotlightRgb}, 0.8), transparent 40%)` }}
      />
      <div className={`relative z-10 rounded-[14px] bg-white dark:bg-slate-900 ${innerClassName}`}>
        {children}
      </div>
    </article>
  );
};
