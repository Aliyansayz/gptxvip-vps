import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Class joiner for the article system.
 *
 * Local to `shared/components/article` on purpose: the app-wide helper lives in
 * the agentMarketplace feature area (`@/lib/utils`, aliased in vite.config.ts),
 * and shared components must not reach into a feature. Both `clsx` and
 * `tailwind-merge` are direct dependencies of this project, so the only cost of
 * duplicating this is three lines.
 *
 * `twMerge` is what makes the editorial overrides safe: it resolves conflicting
 * Tailwind classes by last-wins, so `bg-tablet-bg` genuinely beats an inherited
 * `bg-zinc-950` rather than depending on stylesheet order.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
