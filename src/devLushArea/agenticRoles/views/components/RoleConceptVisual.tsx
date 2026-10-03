import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Database, ScanSearch, Workflow } from 'lucide-react';
import { AgenticRoleChapter } from '../../agenticRoleTypes';
import { caseLearningFlows } from '../../data/caseLearningFlows';

const stages = [
  { key: 'input' as const, label: 'Observe', icon: Database },
  { key: 'check' as const, label: 'Reason', icon: ScanSearch },
  { key: 'action' as const, label: 'Act', icon: Workflow },
  { key: 'outcome' as const, label: 'Verify', icon: CheckCircle2 },
];

/** A reading companion with a different learning flow for each registered case. */
export default function RoleConceptVisual({ chapter }: { chapter: AgenticRoleChapter }) {
  const [selected, setSelected] = useState(0);
  const flow = caseLearningFlows[chapter.labComponentId];
  if (!flow) return null;
  const current = stages[selected];
  return (
    <figure aria-label="Case learning flow" className="@container rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950 sm:p-5">
      <figcaption className="mb-4 text-base font-semibold text-slate-900 dark:text-slate-100">How this case works</figcaption>
      <div className="grid grid-cols-2 gap-3 @min-[36rem]:grid-cols-4">
        {stages.map((stage, index) => <button key={stage.key} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} className={`relative flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${selected === index ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}><stage.icon className="h-5 w-5" /><span>{index + 1}. {stage.label}</span>{index < 3 && <ArrowRight aria-hidden="true" className="absolute -right-3 z-10 hidden h-4 w-4 rounded-full bg-slate-50 text-slate-400 dark:bg-slate-950 @min-[36rem]:block" />}</button>)}
      </div>
      <div role="status" className="mt-4 rounded-lg border-l-2 border-indigo-400 pl-4"><p className="text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">{current.label}</p><p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{flow[current.key]}</p></div>
    </figure>
  );
}
