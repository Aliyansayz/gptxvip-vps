import type { ElementType, ReactNode } from 'react';
import './glass.css';

interface GlassPanelProps {
  as?: ElementType;
  /** `dark` is the hero carousel surface; `light` is a frosted control on the paper shell. */
  variant?: 'dark' | 'light';
  className?: string;
  children: ReactNode;
}

/**
 * Frosted surface primitive. Renders a `<div>` unless told otherwise, so it can
 * stand in for a `<section>`, `<article>` or `<aside>` without nesting shims.
 *
 * Blur is applied only where it is supported; the opaque fallback lives in
 * `glass.css` so legibility never depends on the enhancement.
 */
export function GlassPanel({
  as: Tag = 'div',
  variant = 'dark',
  className = '',
  children,
}: GlassPanelProps) {
  const variantClass = variant === 'light' ? 'glass-panel-light' : 'glass-panel';
  return <Tag className={`${variantClass} ${className}`.trim()}>{children}</Tag>;
}

export default GlassPanel;