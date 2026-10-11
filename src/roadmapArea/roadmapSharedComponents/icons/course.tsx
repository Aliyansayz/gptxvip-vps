
import React from 'react';
import { BrainCircuit, AreaChart, Bot, Sigma, Dna, Leaf as LucideLeaf, TreeDeciduous as LucideTreeDeciduous, Rabbit as LucideRabbit, Bird as LucideBird, Activity, Heart, Wind, Droplets, Baby, Beaker, Stethoscope, Shield, Bug, TestTube, Scissors, Skull } from 'lucide-react';

export const CellIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ScissorsIcon = Scissors;
export const SkullIcon = Skull;

export const MicroscopeIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
    </svg>
);

export const PillIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
    </svg>
);


export const PartialDerivativeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5 5 5" />
    <path d="M9 4v16" />
  </svg>
);

export const RatioIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20L20 4"/>
        <path d="M4 4h16v16"/>
    </svg>
);

export const CircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
  </svg>
);

export const WaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h2l3 -9l4 18l4 -18l3 9h2"></path>
  </svg>
);

export const LightningBoltIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

export const AtomIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"></circle>
        <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5z"></path>
        <path d="M3.8 20.2c-2.04-2.03-.02-7.36 4.5-11.9 4.54-4.52-9.87-6.54-11.9-4.5 2.04 2.03.02 7.36-4.5 11.9-4.54 4.52-9.87-6.54-11.9 4.5z"></path>
    </svg>
);

export const QuantumIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5a9.5 9.5 0 1 0 0 19a9.5 9.5 0 1 0 0-19" />
        <path d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0" />
        <path d="M12 2.5V1" />
        <path d="M12 23v-1.5" />
        <path d="M2.5 12H1" />
        <path d="M23 12h-1.5" />
    </svg>
);

export const RotationalMotionIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 8.85A9.2 9.2 0 0 1 12 3v1a4 4 0 0 0 4 4h1a9.2 9.2 0 0 1-9.15 12.5v0A9.2 9.2 0 0 1 3 12h1a4 4 0 0 0 4-4H3Z" />
        <path d="M12 18a6 6 0 0 0 6-6h-1a4 4 0 0 1-4-4V7a6 6 0 0 0-6 6h1a4 4 0 0 1 4 4v1Z" />
    </svg>
);

export const MechanicsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M4 21c0-7.7 5.7-14 13-14" />
        <circle cx="17" cy="7" r="2" />
    </svg>
);

export const ThermodynamicsIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
);

export const SpecialRelativityIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0-14 0" />
        <path d="M12 9v3l1.5 1.5" />
        <path d="M22 12c0 6-4.5 9-9 9" />
        <path d="M2 12c0-6 4.5-9 9-9" />
    </svg>
);

export const TriangleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
  </svg>
);

export const SlopeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22h20" />
    <path d="M5 17h14" />
    <path d="M8 12h11" />
    <path d="M11 7h8" />
    <path d="M14 2h5" />
  </svg>
);

export const MinMaxIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12c.74-2.5 2.5-5 5-6 2.5-1 5 0 6 2 1 2 3 3 5 2" />
    <path d="M20 12c-.74 2.5-2.5 5-5 6-2.5 1-5 0-6-2-1-2-3-3-5-2" />
    <path d="M13 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
    <path d="M5 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

export const ConvexConcaveIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 18c4-8 12-8 16 0" />
    <path d="M4 6c4 8 12 8 16 0" />
  </svg>
);

export const LinearAlgebraIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5H4v14h2"/>
    <path d="M18 5h2v14h-2"/>
    <path d="M10 7h4"/>
    <path d="M10 12h4"/>
    <path d="M10 17h4"/>
  </svg>
);

export const BrainCircuitIcon = BrainCircuit;
export const GeneIcon = Dna;
export const Leaf = LucideLeaf;
export const TreeDeciduous = LucideTreeDeciduous;
export const Rabbit = LucideRabbit;
export const Bird = LucideBird;

export const BotIcon = Bot;

export const SigmaIcon = Sigma;

export const ActivityIcon = Activity;
export const HeartIcon = Heart;
export const WindIcon = Wind;
export const DropletsIcon = Droplets;
export const BabyIcon = Baby;
export const BeakerIcon = Beaker;
export const StethoscopeIcon = Stethoscope;
export const ShieldIcon = Shield;
export const BugIcon = Bug;
export const TestTubeIcon = TestTube;

export const LogarithmIcon = ({ className }: { className?: string }) => (
    <AreaChart className={className} />
);
