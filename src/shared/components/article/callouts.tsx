import React from 'react';
import { Building2, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from './cn';

/**
 * Named accents. Concrete hexes rather than theme tokens because each of these
 * has to read as a distinct hue on both the paper and dark grounds, and the
 * article palette only defines one accent colour.
 */
const ACCENTS = {
  red: '#b91c1c',
  amber: '#b45309',
  blue: '#1d4ed8',
} as const;

export type CalloutAccent = keyof typeof ACCENTS;

interface CalloutProps {
  /** Eyebrow label, e.g. "Mental model". */
  label: string;
  accent: CalloutAccent;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Labeled aside for the supporting notes in a chapter: the analogy, the
 * practical takeaway, and the industry case study.
 *
 * One component rather than three, because they differ only in accent and icon.
 * Three near-identical blocks is how a design system drifts apart over time.
 *
 * The accent reaches the wrapper through a CSS custom property set on the root,
 * so the border and the label cannot fall out of sync — both read the same
 * variable.
 */
export const Callout: React.FC<CalloutProps> = ({
  label,
  accent,
  icon,
  children,
  className,
}) => (
  <aside
    style={{ '--callout-accent': ACCENTS[accent] } as React.CSSProperties}
    className={cn(
      'my-6 rounded-sm border border-l-4 border-tablet-border border-l-[--callout-accent] bg-tablet-highlight p-4 sm:p-5',
      className,
    )}
  >
    <p className="mb-2 flex items-center gap-1.5 font-sans text-[10px] font-extrabold uppercase tracking-wider text-[--callout-accent] sm:text-xs">
      {icon}
      {label}
    </p>
    <p className="font-body text-sm leading-7 text-tablet-ink sm:text-base">{children}</p>
  </aside>
);

/**
 * The analogy — the plain-language explanation of a technical idea. The most
 * quotable line in a chapter, so it gets its own amber accent.
 */
export const MentalModel: React.FC<{ analogy: string }> = ({ analogy }) => (
  <Callout
    label="Mental model"
    accent="amber"
    icon={<Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />}
  >
    {analogy}
  </Callout>
);

/** The single action a reader should take away. */
export const PracticalTakeaway: React.FC<{ takeaway: string }> = ({ takeaway }) => (
  <Callout
    label="Practical takeaway"
    accent="red"
    icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
  >
    {takeaway}
  </Callout>
);

/** Real-world evidence that the mechanism matters. */
export const InTheField: React.FC<{ caseStudy: string }> = ({ caseStudy }) => (
  <Callout
    label="In the field"
    accent="blue"
    icon={<Building2 className="h-3.5 w-3.5" aria-hidden="true" />}
  >
    {caseStudy}
  </Callout>
);

export default Callout;

