import type { SVGProps } from "react";
type MarkProps = SVGProps<SVGSVGElement>;
export function DiamondMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true" {...props}>
      <path d="m14 1 13 13-13 13L1 14 14 1Z" fill="url(#basalt-diamond)" />
      <path d="m14 7 7 7-7 7-7-7 7-7Z" fill="#07080a" fillOpacity=".52" />
      <path d="m14 7 7 7-7 7V7Z" fill="#ffffff" fillOpacity=".13" />
      <defs>
        <linearGradient
          id="basalt-diamond"
          x1="2"
          y1="2"
          x2="24"
          y2="26"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffb347" />
          <stop offset=".52" stopColor="#ff6b4a" />
          <stop offset="1" stopColor="#ff2f3a" />
        </linearGradient>
      </defs>
    </svg>
  );
}
export function AppleMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.1 12.7c0-2 1.6-3 1.7-3.1-1-1.5-2.6-1.7-3.1-1.7-1.3-.1-2.6.8-3.3.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.6 2.2-1.5 2.6-.4 6.5 1 8.5.7 1 1.5 2.1 2.6 2.1 1.1 0 1.5-.7 2.9-.7 1.4 0 1.8.7 3 .7 1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2-.8-2-3.6ZM15 6.5c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.3-.6.7-1.2 1.8-1 2.8 1 .1 2.1-.5 2.7-1.1Z" />
    </svg>
  );
}
export function WindowsMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M3 4.7 11 3.6v7.6H3V4.7Zm9-1.3L22 2v9.2H12V3.4ZM3 12.3h8v7.6l-8-1.1v-6.5Zm9 0h10v9.2l-10-1.4v-7.8Z" />
    </svg>
  );
}
export function ProductHuntMark(props: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity=".5" />
      <path
        d="M11 24V8h7a5 5 0 0 1 0 10h-4v6h-3Zm3-9h4a2 2 0 0 0 0-4h-4v4Z"
        fill="currentColor"
      />
    </svg>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`basalt-brand${compact ? " basalt-brand--compact" : ""}`}>
      <DiamondMark />
      Basalt
    </span>
  );
}
