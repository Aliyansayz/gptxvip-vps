import React, { useState } from 'react';
import { CheckCircle2, Database, ScanSearch, Workflow } from 'lucide-react';
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
  const lastIndex = stages.length - 1;
  return (
    <figure aria-label="Case learning flow" className="role-visual @container rounded-[22px] bg-slate-100/80 p-1.5 dark:bg-slate-900/70">
      <figcaption className="px-3 pb-3 pt-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">How this case works</figcaption>
      <div className="role-panel rounded-2xl bg-white p-3 dark:bg-slate-950 sm:p-4">
        <div className="relative">
          {/* Track + progress fill sit behind the step badges (transform only). */}
          <div aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-[1.625rem] h-px bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full origin-left bg-slate-900 transition-transform duration-300 dark:bg-slate-100"
              style={{ transform: `scaleX(${selected / lastIndex})`, transitionTimingFunction: 'var(--role-ease-out)' }}
            />
          </div>
          <ol className="relative grid grid-cols-4 gap-1">
            {stages.map((stage, index) => {
              const active = selected === index;
              const done = index < selected;
              return (
                <li key={stage.key}>
                  <button
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-pressed={active}
                    aria-current={active ? 'step' : undefined}
                    className="role-press group flex w-full flex-col items-center gap-2 rounded-xl px-1 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-150 ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : done
                            ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                            : 'bg-white text-slate-500 shadow-[0_0_0_1px_rgb(15_23_42/0.1)] group-hover:text-slate-900 dark:bg-slate-950 dark:text-slate-400 dark:shadow-[0_0_0_1px_rgb(255_255_255/0.12)]'
                      }`}
                    >
                      <stage.icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </span>
                    <span className={`text-xs ${active ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
                      <span className="tabular-nums">{index + 1}</span> · {stage.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div role="status" key={selected} className="role-swap mt-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            <current.icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            {current.label}
            <span className="ml-auto font-medium normal-case tracking-normal text-slate-400 tabular-nums">{selected + 1} / {stages.length}</span>
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700 text-pretty dark:text-slate-300">{flow[current.key]}</p>
        </div>
      </div>
    </figure>
  );
}
