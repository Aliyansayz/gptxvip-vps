import React from 'react';
import { SectionHeading } from '../article/prose';
import { cn } from '../article/cn';
import type { ArticleSection } from './conceptText';

interface ConceptSectionProps {
  section: ArticleSection;
  theme?: {
    bgSoft: string;
    borderSoft: string;
    text: string;
  };
}

export const ConceptSection: React.FC<ConceptSectionProps> = ({
  section,
  theme = { bgSoft: 'bg-slate-50 dark:bg-slate-950', borderSoft: 'border-slate-200 dark:border-slate-800', text: 'text-slate-900 dark:text-white' },
}) => (
  <article className={cn('rounded-2xl border p-4', theme.borderSoft, theme.bgSoft)}>
    <header className="mb-3 flex items-baseline gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Concept {section.number}
      </span>
      <h3 className="text-lg font-semibold">{section.concept}</h3>
    </header>

    <div className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
      {section.definition && (
        <p>{section.definition}</p>
      )}
      {section.elaboration && (
        <p>{section.elaboration}</p>
      )}
      {section.industryApplication && (
        <p className="border-l-2 border-indigo-300 pl-3">
          <span className="font-semibold">In practice: </span>
          {section.industryApplication}
        </p>
      )}
    </div>
  </article>
);