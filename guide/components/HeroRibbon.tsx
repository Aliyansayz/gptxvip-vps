/**
 * Hero ribbon — the flowing 3D tube that anchors the software manual landing
 * hero.
 *
 * A single stroked path reads as a flat ribbon. The tube look comes from a
 * stack of decreasing widths over one spine plus an offset highlight, because
 * SVG cannot shade perpendicular to a stroke:
 *
 *   1. bloom     wide + blurred, screen-blended  -> ambient light in the air
 *   2. body      widest surface layer             -> dark edges
 *   3. core      mid width, brighter ramp        -> mid band
 *   4. inner     narrow, brightest               -> lit core
 *   5. specular  thinnest, blurred, offset       -> highlight ridge
 *
 * Layers 2-4 step in width so each edge reads as the next band of shading.
 * An earlier version painted a wider near-black stroke underneath to fake a
 * silhouette; against a dark ground that just drew a hard outline, so the
 * gradient darkens the edges instead.
 *
 * Layer 5 is the one that makes it read as a surface rather than a stripe —
 * centred, the highlight looks painted; only an offset one looks curved.
 *
 * Pure SVG and CSS, so it scales to any viewport without raster assets.
 */
export default function HeroRibbon() {
  // Two full waves: enters top-left, folds back left, exits bottom-right.
  const spine =
    "M -60 -80 C 40 10 210 -10 268 84 C 322 172 96 150 58 236 " +
    "C 20 322 190 300 286 396 L 400 560";

  return (
    <div className="hero-ribbon" aria-hidden="true">
      <svg viewBox="0 0 355 498" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Dark edges into a saturated blue body. */}
          <linearGradient id="rb-body" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#050b1e" />
            <stop offset="22%" stopColor="#123c94" />
            <stop offset="46%" stopColor="#2f8ef0" />
            <stop offset="70%" stopColor="#4fb6f7" />
            <stop offset="100%" stopColor="#0a1838" />
          </linearGradient>

          <linearGradient id="rb-core" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#17509f" />
            <stop offset="38%" stopColor="#3fa4f2" />
            <stop offset="68%" stopColor="#8fe2ff" />
            <stop offset="100%" stopColor="#1d63cc" />
          </linearGradient>

          <linearGradient id="rb-inner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4fb0f0" />
            <stop offset="45%" stopColor="#a8ecff" />
            <stop offset="100%" stopColor="#5aa8ee" />
          </linearGradient>

          <linearGradient id="rb-specular" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="42%" stopColor="#e6f9ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Ground: near-black with a faint blue pool where the tube passes. */}
          <radialGradient id="rb-ground" cx="52%" cy="40%" r="78%">
            <stop offset="0%" stopColor="#0b1a3c" />
            <stop offset="48%" stopColor="#050c1f" />
            <stop offset="100%" stopColor="#01030a" />
          </radialGradient>

          <filter id="rb-bloom" x="-45%" y="-25%" width="190%" height="150%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="rb-spec-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>

        <rect width="355" height="498" fill="url(#rb-ground)" />

        <g filter="url(#rb-bloom)" opacity="0.5" style={{ mixBlendMode: "screen" }}>
          <path d={spine} stroke="#2f8ef0" strokeWidth="96" fill="none" strokeLinecap="round" />
        </g>

        <path d={spine} stroke="url(#rb-body)" strokeWidth="54" fill="none" strokeLinecap="round" />
        <path d={spine} stroke="url(#rb-core)" strokeWidth="36" fill="none" strokeLinecap="round" />
        <path d={spine} stroke="url(#rb-inner)" strokeWidth="20" fill="none" strokeLinecap="round" />

        <path
          d={spine}
          stroke="url(#rb-specular)"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          filter="url(#rb-spec-blur)"
          transform="translate(5 -4)"
        />
      </svg>

      {/* Out-of-focus motes, echoing the floating particles in the reference. */}
      <div className="ribbon-motes">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
    </div>
  );
}