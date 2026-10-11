
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const TrendingUpIcon = TrendingUp;
export const TrendingDownIcon = TrendingDown;
export const MinusIcon = Minus;

export const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export const RadioIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1"/></svg>
);

export const WavesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6c.7.5 1.4 1 2.2 1 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 .8 0 1.5-.5 2.2-1"/><path d="M3 12c.7.5 1.4 1 2.2 1 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 .8 0 1.5-.5 2.2-1"/><path d="M3 18c.7.5 1.4 1 2.2 1 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 1.4 0 1.4-2 2.8-2 1.4 0 1.4 2 2.8 2 .8 0 1.5-.5 2.2-1"/></svg>
);

export const ZapIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export const MousePointer2Icon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>
);

export const LightbulbIcon = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
    <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);

export const BatteryChargingIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/></svg>
);

export const ArrowRightLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>
);

export const SplineIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3c-4 4-4 11 0 15"/><path d="M16 3c4 4 4 11 0 15"/><circle cx="12" cy="12" r="2"/></svg>
);

export const MagnetIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg style={style} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 13a8 8 0 0 1 8-8h1a8 8 0 0 1 8 8v2a8 8 0 0 1-8 8h-1a8 8 0 0 1-8-8z"/>
    <path d="M8 13v-2" />
    <path d="M16 13v-2" />
  </svg>
);

export const MountainIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>
);

export const MousePointerClickIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.4 2.6c.3-.3.8-.3 1.1 0l1.5 1.5c.3.3.3.8 0 1.1L8.8 6.4c-.3.3-.8.3-1.1 0L6.2 4.9c-.3-.3-.3.8 0-1.1l1.2-1.2z"/><path d="m2.6 7.4.3-.3c.3-.3.8-.3 1.1 0l1.5 1.5c.3.3.3.8 0 1.1L4.3 11c-.3.3-.8.3-1.1 0L1.7 9.5c-.3-.3-.3-.8 0-1.1l.9-.9z"/><path d="m14 2.1.9.9c.3.3.3.8 0 1.1l-1.5 1.5c-.3.3-.8.3-1.1 0l-.9-.9c-.3-.3-.3-.8 0-1.1l1.5-1.5c.3-.3.8-.3 1.1 0z"/><path d="M21.9 9.3.3.3"/></svg>
);

export const PlanetIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.4 16.8A9 9 0 1 0 5.6 7.2"/><path d="M18 8h-4.26a2 2 0 1 0 0 4h4.26a2 2 0 1 1 0 4h-4.26a2 2 0 1 0 0 4h4.26"/></svg>
);

export const RocketIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.09-3.1a2 2 0 0 0-2.43-2.43c-.81.61-2.26.6-3.1-.09z"/><path d="m12 15-3-3a9 9 0 0 1 3-7 9 9 0 0 1 7 3l-3 3"/><path d="m9 9 6 6"/><path d="m21 21-6-6"/></svg>
);

export const ArrowCurveIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 17.5a4.5 4.5 0 0 0-4.5-4.5H6"/><path d="m10 17-4-4 4-4"/></svg>
);
