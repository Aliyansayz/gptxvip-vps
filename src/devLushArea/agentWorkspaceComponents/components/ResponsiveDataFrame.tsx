import type { ReactNode } from 'react';

interface ResponsiveDataFrameProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function ResponsiveDataFrame({ label, children, className = '' }: ResponsiveDataFrameProps) {
  return <div role="region" aria-label={label} tabIndex={0} className={`max-w-full overflow-x-auto overscroll-x-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${className}`}>{children}</div>;
}
