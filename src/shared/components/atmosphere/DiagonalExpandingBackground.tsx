import { memo, useEffect, useId, useRef } from 'react';
import './diagonal.css';

interface DiagonalExpandingBackgroundProps {
  /** Starting SVG stroke width percentage before scroll expansion (default: 30). */
  baseWidthPercent?: number;
  /** Divisor matching the `30 + scrollY / scrollDivisor` expansion rate (default: 10). */
  scrollDivisor?: number;
  /** Upper bound percentage so the stroke stays visually balanced on long pages. */
  maxWidthPercent?: number;
}

/**
 * Root atmosphere visual for hero headers: a responsive diagonal blue stroke
 * matching the signature `#1528b7` / `#272bc3` / `#6f78ff` / `#7f8cff` palette
 * that expands smoothly on window scroll (`baseWidthPercent + scrollY / scrollDivisor`%)
 * layered with a specular shine glare.
 *
 * Updates SVG attributes directly inside `requestAnimationFrame` so scrolling
 * causes zero React re-renders.
 */
export const DiagonalExpandingBackground = memo(function DiagonalExpandingBackground({
  baseWidthPercent = 30,
  scrollDivisor = 10,
  maxWidthPercent = 165,
}: DiagonalExpandingBackgroundProps) {
  const uid = useId().replace(/:/g, '');
  const auraGradientId = `diag-aura-${uid}`;
  const bandGradientId = `diag-band-${uid}`;
  const glareGradientId = `diag-glare-${uid}`;

  const auraLineRef = useRef<SVGLineElement | null>(null);
  const mainLineRef = useRef<SVGLineElement | null>(null);
  const glareLineRef = useRef<SVGLineElement | null>(null);

  useEffect(() => {
    let rafId = 0;

    const applyStrokeWidth = () => {
      rafId = 0;
      const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
      const nextWidth = Math.min(
        maxWidthPercent,
        baseWidthPercent + scrollY / scrollDivisor,
      );
      const auraWidth = Math.min(maxWidthPercent + 20, nextWidth + 14);
      const glareWidth = Math.max(8, nextWidth * 0.38);

      mainLineRef.current?.setAttribute('stroke-width', `${nextWidth.toFixed(2)}%`);
      auraLineRef.current?.setAttribute('stroke-width', `${auraWidth.toFixed(2)}%`);
      glareLineRef.current?.setAttribute('stroke-width', `${glareWidth.toFixed(2)}%`);
    };

    const handleScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(applyStrokeWidth);
    };

    applyStrokeWidth();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [baseWidthPercent, scrollDivisor, maxWidthPercent]);

  return (
    <div className="diagonal-bg" aria-hidden="true">
      <svg
        className="diagonal-bg-svg"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={auraGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1528b7" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#272bc3" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#7f8cff" stopOpacity="0.32" />
          </linearGradient>

          <linearGradient id={bandGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1528b7" stopOpacity="0.92" />
            <stop offset="48%" stopColor="#272bc3" stopOpacity="0.98" />
            <stop offset="82%" stopColor="#6f78ff" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#7f8cff" stopOpacity="0.88" />
          </linearGradient>

          <linearGradient id={glareGradientId} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6f78ff" stopOpacity="0.06" />
            <stop offset="38%" stopColor="#7f8cff" stopOpacity="0.24" />
            <stop offset="52%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="68%" stopColor="#7f8cff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.14" />
          </linearGradient>
        </defs>

        <line
          ref={auraLineRef}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          stroke={`url(#${auraGradientId})`}
          strokeWidth={`${baseWidthPercent + 14}%`}
        />
        <line
          ref={mainLineRef}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          stroke={`url(#${bandGradientId})`}
          strokeWidth={`${baseWidthPercent}%`}
        />
        <line
          ref={glareLineRef}
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
          stroke={`url(#${glareGradientId})`}
          strokeWidth={`${(baseWidthPercent * 0.38).toFixed(2)}%`}
        />
      </svg>

      <div className="diagonal-shine-glare" />
      <div className="diagonal-glare-halo" />
      <div className="diagonal-contrast-scrim" />
    </div>
  );
});

export default DiagonalExpandingBackground;
