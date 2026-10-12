import { memo, useId, type CSSProperties } from 'react';
import './aurora.css';

export type AuroraTheme = 'light' | 'dark';

interface AuroraBackgroundProps {
  /**
   * `dark` reproduces the Basalt treatment. `light` is the adaptation for
   * light surfaces. See `aurora.css` for why the two differ in blend mode.
   */
  theme?: AuroraTheme;
  /** `hero` fades the field out at the fold; `full` runs edge to edge. */
  variant?: 'hero' | 'full';
  /** Film grain is a per-pixel texture; off is a cheap win on low-end GPUs. */
  showGrain?: boolean;
  /**
   * Dark theme only. Replaces the ground the container paints, so a surface
   * can match its own canvas colour instead of showing a seam.
   */
  ground?: string;
}

/**
 * Root atmosphere component: four independently drifting, blurred light
 * blades plus a static film-grain overlay.
 *
 * Animation and the reduced-motion fallback are handled entirely in CSS, so
 * this mounts once and never re-renders. It is decorative — `aria-hidden`,
 * non-interactive, and `pointer-events: none`.
 */
export const AuroraBackground = memo(function AuroraBackground({
  theme = 'light',
  variant = 'full',
  showGrain = true,
  ground,
}: AuroraBackgroundProps) {
  // Filter ids must be document-unique; `useId` is SSR-safe but emits colons,
  // which need escaping inside a `url(#...)` reference.
  const filterId = `aurora-grain-${useId().replace(/:/g, '')}`;

  const className = [
    'aurora-atmosphere',
    `aurora-atmosphere--${theme}`,
    variant === 'hero' ? 'aurora-atmosphere--hero' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      aria-hidden="true"
      style={ground ? ({ '--aurora-ground': ground } as CSSProperties) : undefined}
    >
      <div className="aurora-field">
        <span className="aurora-blade aurora-blade--one" />
        <span className="aurora-blade aurora-blade--two" />
        <span className="aurora-blade aurora-blade--three" />
        <span className="aurora-blade aurora-blade--four" />
      </div>
      {showGrain && (
        <svg className="aurora-grain" width="100%" height="100%">
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".84"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      )}
      <div className="aurora-vignette" />
    </div>
  );
});

export default AuroraBackground;