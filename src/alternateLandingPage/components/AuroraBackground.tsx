export function AuroraBackground() {
  return (
    <div className="basalt-atmosphere" aria-hidden="true">
      <div className="basalt-aurora">
        <span className="basalt-blade basalt-blade--one" />
        <span className="basalt-blade basalt-blade--two" />
        <span className="basalt-blade basalt-blade--three" />
        <span className="basalt-blade basalt-blade--four" />
      </div>
      <svg className="basalt-grain" width="100%" height="100%">
        <filter id="basalt-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency=".84"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#basalt-film-grain)"
          opacity=".24"
        />
      </svg>
      <div className="basalt-vignette" />
    </div>
  );
}
