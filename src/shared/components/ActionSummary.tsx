interface ActionSummaryProps {
  input: string;
  action: string;
  result: string;
  nextStep: string;
  status: 'idle' | 'running' | 'done';
}

export function ActionSummary({ input, action, result, nextStep, status }: ActionSummaryProps) {
  const steps = [
    { label: 'Input', value: input },
    { label: 'Action', value: action },
    { label: 'Result', value: status === 'done' ? result : status === 'running' ? 'Running the sample scenario…' : 'Run the sample to reveal a result.' },
    { label: 'Next step', value: status === 'done' ? nextStep : 'Review the result before choosing a next step.' },
  ];
  return <ol aria-label="Task sequence" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{steps.map((step, index) => <li key={step.label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">{String(index + 1).padStart(2, '0')} · {step.label}</p><p className="mt-2 text-sm leading-6 text-slate-700">{step.value}</p></li>)}</ol>;
}
