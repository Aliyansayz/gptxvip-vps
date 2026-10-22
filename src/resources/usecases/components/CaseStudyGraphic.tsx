import React from 'react';

interface CaseStudyGraphicProps {
  type: 'network' | 'cloud' | 'shield' | 'pipeline' | 'chip' | 'telemetry' | 'server';
  accentColor?: 'blue' | 'emerald' | 'cyan' | 'indigo' | 'violet' | 'amber' | 'rose';
  className?: string;
  variant?: 'card' | 'hero';
}

const ACCENT_STYLES = {
  blue: {
    glow: 'from-blue-500/20 via-sky-500/10 to-transparent',
    stroke: '#3b82f6',
    fill: '#1d4ed8',
    pill: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  emerald: {
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    stroke: '#10b981',
    fill: '#047857',
    pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
  cyan: {
    glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    stroke: '#06b6d4',
    fill: '#0e7490',
    pill: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  indigo: {
    glow: 'from-indigo-500/20 via-violet-500/10 to-transparent',
    stroke: '#6366f1',
    fill: '#4338ca',
    pill: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  },
  violet: {
    glow: 'from-violet-500/20 via-fuchsia-500/10 to-transparent',
    stroke: '#8b5cf6',
    fill: '#6d28d9',
    pill: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  },
  amber: {
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
    stroke: '#f59e0b',
    fill: '#b45309',
    pill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  },
  rose: {
    glow: 'from-rose-500/20 via-pink-500/10 to-transparent',
    stroke: '#f43f5e',
    fill: '#be123c',
    pill: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  },
};

export const CaseStudyGraphic: React.FC<CaseStudyGraphicProps> = ({
  type,
  accentColor = 'indigo',
  className = '',
  variant = 'card',
}) => {
  const styles = ACCENT_STYLES[accentColor] || ACCENT_STYLES.indigo;
  const isHero = variant === 'hero';

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-950 border border-white/10 ${
        isHero ? 'h-64 sm:h-80 w-full' : 'h-48 w-full'
      } ${className}`}
    >
      {/* Background ambient radial glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${styles.glow} pointer-events-none opacity-80`}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${styles.stroke} 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Specialized SVG Schematics */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`grad-${accentColor}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={styles.stroke} stopOpacity="0.8" />
            <stop offset="100%" stopColor={styles.stroke} stopOpacity="0.1" />
          </linearGradient>
          <filter id={`glow-${accentColor}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {type === 'cloud' && (
          <g transform="translate(40, 20)">
            {/* Multi-region nodes */}
            <circle cx="90" cy="100" r="38" stroke={styles.stroke} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="210" cy="100" r="48" stroke={styles.stroke} strokeWidth="2" fill={styles.stroke} fillOpacity="0.08" />
            <circle cx="270" cy="130" r="28" stroke={styles.stroke} strokeWidth="1.5" opacity="0.5" />
            <path
              d="M 60 110 C 60 70, 110 50, 150 70 C 180 40, 240 50, 260 80 C 290 80, 310 110, 300 135 C 290 155, 120 160, 60 135 Z"
              stroke={styles.stroke}
              strokeWidth="2.5"
              fill={`url(#grad-${accentColor})`}
              filter={`url(#glow-${accentColor})`}
              opacity="0.9"
            />
            {/* Sync links */}
            <line x1="120" y1="100" x2="200" y2="100" stroke={styles.stroke} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="160" cy="100" r="4" fill={styles.stroke} />
            <line x1="200" y1="100" x2="250" y2="125" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Region tags */}
            <rect x="70" y="165" width="80" height="20" rx="4" fill="#090d16" stroke={styles.stroke} strokeWidth="1" />
            <text x="110" y="179" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">us-east-1</text>
            <rect x="190" y="165" width="80" height="20" rx="4" fill="#090d16" stroke={styles.stroke} strokeWidth="1" />
            <text x="230" y="179" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">us-west-2 (Sync)</text>
          </g>
        )}

        {type === 'shield' && (
          <g transform="translate(60, 15)">
            {/* Outer perimeter rings */}
            <circle cx="140" cy="105" r="85" stroke={styles.stroke} strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
            <circle cx="140" cy="105" r="65" stroke={styles.stroke} strokeWidth="1" opacity="0.5" />
            {/* Shield crest */}
            <path
              d="M 140 35 L 205 60 L 205 115 C 205 155, 140 185, 140 185 C 140 185, 75 155, 75 115 L 75 60 Z"
              stroke={styles.stroke}
              strokeWidth="2.5"
              fill={`url(#grad-${accentColor})`}
              filter={`url(#glow-${accentColor})`}
              opacity="0.9"
            />
            {/* Lock / Keyhole icon */}
            <rect x="126" y="98" width="28" height="22" rx="4" fill="#090d16" stroke={styles.stroke} strokeWidth="1.5" />
            <path d="M 132 98 L 132 88 C 132 83.5, 148 83.5, 148 88 L 148 98" stroke={styles.stroke} strokeWidth="2" fill="none" />
            <circle cx="140" cy="107" r="2.5" fill={styles.stroke} />
            <line x1="140" y1="109.5" x2="140" y2="114" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Zero trust tags */}
            <text x="140" y="215" fill={styles.stroke} fontSize="10" textAnchor="middle" fontWeight="bold" fontFamily="monospace" letterSpacing="2">
              ZERO TRUST VERIFIED
            </text>
          </g>
        )}

        {type === 'chip' && (
          <g transform="translate(65, 20)">
            {/* Central processor unit */}
            <rect x="90" y="55" width="90" height="90" rx="8" fill="#090d16" stroke={styles.stroke} strokeWidth="2.5" filter={`url(#glow-${accentColor})`} />
            <rect x="102" y="67" width="66" height="66" rx="4" fill={`url(#grad-${accentColor})`} stroke={styles.stroke} strokeWidth="1" />
            <text x="135" y="105" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold" fontFamily="monospace">EDGE AI</text>
            {/* Traces Top */}
            <line x1="105" y1="55" x2="105" y2="25" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="135" y1="55" x2="135" y2="20" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="165" y1="55" x2="165" y2="25" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Traces Bottom */}
            <line x1="105" y1="145" x2="105" y2="175" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="135" y1="145" x2="135" y2="180" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="165" y1="145" x2="165" y2="175" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Traces Left */}
            <line x1="90" y1="75" x2="50" y2="75" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="90" y1="100" x2="40" y2="100" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="90" y1="125" x2="50" y2="125" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Traces Right */}
            <line x1="180" y1="75" x2="220" y2="75" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="180" y1="100" x2="230" y2="100" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="180" y1="125" x2="220" y2="125" stroke={styles.stroke} strokeWidth="1.5" />
            {/* Pins */}
            <circle cx="40" cy="100" r="3" fill={styles.stroke} />
            <circle cx="230" cy="100" r="3" fill={styles.stroke} />
            <circle cx="135" cy="20" r="3" fill={styles.stroke} />
            <circle cx="135" cy="180" r="3" fill={styles.stroke} />
          </g>
        )}

        {type === 'pipeline' && (
          <g transform="translate(30, 30)">
            {/* Event streaming pipeline */}
            <path
              d="M 20 90 L 110 90 C 130 90, 150 50, 180 50 L 260 50 C 290 50, 300 130, 320 130 L 340 130"
              stroke={styles.stroke}
              strokeWidth="3"
              fill="none"
              filter={`url(#glow-${accentColor})`}
            />
            <path
              d="M 20 90 L 110 90 C 130 90, 150 130, 180 130 L 260 130 C 290 130, 300 50, 320 50 L 340 50"
              stroke={styles.stroke}
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              opacity="0.6"
            />
            {/* Event packet nodes */}
            <circle cx="60" cy="90" r="8" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="60" cy="90" r="3" fill={styles.stroke} />
            <circle cx="180" cy="50" r="10" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="180" cy="50" r="4" fill={styles.stroke} />
            <circle cx="260" cy="50" r="8" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="260" cy="50" r="3" fill={styles.stroke} />
            <circle cx="320" cy="130" r="9" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="320" cy="130" r="4" fill={styles.stroke} />
            {/* Telemetry pill */}
            <rect x="120" y="155" width="120" height="22" rx="11" fill="#090d16" stroke={styles.stroke} strokeWidth="1" />
            <text x="180" y="170" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">12,000 evt / sec</text>
          </g>
        )}

        {type === 'network' && (
          <g transform="translate(40, 20)">
            {/* Topology ring */}
            <circle cx="160" cy="100" r="65" stroke={styles.stroke} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            <polygon points="160,40 220,135 100,135" stroke={styles.stroke} strokeWidth="2" fill="none" opacity="0.6" />
            {/* Nodes */}
            <circle cx="160" cy="40" r="12" fill="#090d16" stroke={styles.stroke} strokeWidth="2.5" filter={`url(#glow-${accentColor})`} />
            <circle cx="160" cy="40" r="4" fill={styles.stroke} />
            <circle cx="220" cy="135" r="12" fill="#090d16" stroke={styles.stroke} strokeWidth="2.5" filter={`url(#glow-${accentColor})`} />
            <circle cx="220" cy="135" r="4" fill={styles.stroke} />
            <circle cx="100" cy="135" r="12" fill="#090d16" stroke={styles.stroke} strokeWidth="2.5" filter={`url(#glow-${accentColor})`} />
            <circle cx="100" cy="135" r="4" fill={styles.stroke} />
            <circle cx="160" cy="100" r="16" fill={`url(#grad-${accentColor})`} stroke={styles.stroke} strokeWidth="2" />
            <circle cx="160" cy="100" r="6" fill="#f8fafc" />
            {/* Interconnecting rays */}
            <line x1="160" y1="40" x2="160" y2="84" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="100" y1="135" x2="146" y2="108" stroke={styles.stroke} strokeWidth="1.5" />
            <line x1="220" y1="135" x2="174" y2="108" stroke={styles.stroke} strokeWidth="1.5" />
            <text x="160" y="195" fill={styles.stroke} fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              SD-WAN MESH BACKBONE
            </text>
          </g>
        )}

        {type === 'server' && (
          <g transform="translate(85, 25)">
            {/* Chassis 1 */}
            <rect x="40" y="30" width="150" height="34" rx="5" fill="#090d16" stroke={styles.stroke} strokeWidth="2" filter={`url(#glow-${accentColor})`} />
            <circle cx="55" cy="47" r="4" fill={styles.stroke} />
            <circle cx="70" cy="47" r="4" fill="#10b981" />
            <line x1="90" y1="47" x2="170" y2="47" stroke="#334155" strokeWidth="3" strokeDasharray="6 3" />
            {/* Chassis 2 */}
            <rect x="40" y="74" width="150" height="34" rx="5" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="55" cy="91" r="4" fill={styles.stroke} />
            <circle cx="70" cy="91" r="4" fill="#10b981" />
            <line x1="90" y1="91" x2="170" y2="91" stroke="#334155" strokeWidth="3" strokeDasharray="6 3" />
            {/* Chassis 3 */}
            <rect x="40" y="118" width="150" height="34" rx="5" fill="#090d16" stroke={styles.stroke} strokeWidth="2" />
            <circle cx="55" cy="135" r="4" fill={styles.stroke} />
            <circle cx="70" cy="135" r="4" fill="#10b981" />
            <line x1="90" y1="135" x2="170" y2="135" stroke="#334155" strokeWidth="3" strokeDasharray="6 3" />
            <text x="115" y="178" fill={styles.stroke} fontSize="10" textAnchor="middle" fontFamily="monospace">
              99.999% AVAILABILITY
            </text>
          </g>
        )}

        {type === 'telemetry' && (
          <g transform="translate(35, 30)">
            {/* Grid baseline */}
            <line x1="20" y1="130" x2="310" y2="130" stroke="#334155" strokeWidth="1.5" />
            {/* High frequency spline wave */}
            <path
              d="M 20 120 Q 50 110, 80 85 T 140 40 T 190 90 T 240 60 T 280 30 L 310 70 L 310 130 L 20 130 Z"
              fill={`url(#grad-${accentColor})`}
              opacity="0.5"
            />
            <path
              d="M 20 120 Q 50 110, 80 85 T 140 40 T 190 90 T 240 60 T 280 30 L 310 70"
              stroke={styles.stroke}
              strokeWidth="2.5"
              fill="none"
              filter={`url(#glow-${accentColor})`}
            />
            {/* Peak marker */}
            <circle cx="140" cy="40" r="5" fill="#f8fafc" stroke={styles.stroke} strokeWidth="2" />
            <line x1="140" y1="45" x2="140" y2="130" stroke={styles.stroke} strokeWidth="1" strokeDasharray="3 3" />
            <rect x="105" y="15" width="70" height="18" rx="3" fill="#090d16" stroke={styles.stroke} strokeWidth="1" />
            <text x="140" y="27" fill={styles.stroke} fontSize="8.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
              95 MIN WGS
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default CaseStudyGraphic;
