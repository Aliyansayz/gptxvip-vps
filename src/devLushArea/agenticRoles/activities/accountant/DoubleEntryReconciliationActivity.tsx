import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import RoleVisualCard from '../../views/components/RoleVisualCard';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, Play, RotateCcw, Scale, BookOpenCheck } from 'lucide-react';

interface JournalLine {
  id: string;
  account: string;
  memo: string;
  debit: number;
  credit: number;
}

// Cash received for a EUR invoice: Dr Cash 11,000 = Cr A/R 10,500 + Cr FX gain 500.
const ENTRIES: JournalLine[] = [
  { id: 'JE-01', account: 'Cash - Silicon Valley Bank', memo: 'EUR settlement received', debit: 11000, credit: 0 },
  { id: 'JE-02', account: 'Accounts Receivable (EUR)', memo: 'Invoice cleared at booked rate', debit: 0, credit: 10500 },
  { id: 'JE-03', account: 'Realized FX Gain', memo: 'Spot vs. booked rate difference', debit: 0, credit: 500 },
];

const MAX_TILT = 14;
const money = (value: number) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const DoubleEntryReconciliationActivity: React.FC<ActivityComponentProps> = ({ step, exercises, onComplete }) => {
  const currentExercise = exercises[step] || exercises[0];
  const [posted, setPosted] = useState<Set<string>>(() => new Set());
  const [isReconciling, setIsReconciling] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const { debits, credits } = useMemo(() => {
    const active = ENTRIES.filter((entry) => posted.has(entry.id));
    return {
      debits: active.reduce((sum, entry) => sum + entry.debit, 0),
      credits: active.reduce((sum, entry) => sum + entry.credit, 0),
    };
  }, [posted]);

  const variance = debits - credits;
  const isBalanced = posted.size === ENTRIES.length && variance === 0;
  const hasEntries = posted.size > 0;
  // Heavier side drops: credits heavy -> clockwise (right end down).
  const total = Math.max(debits, credits, 1);
  const tilt = Math.max(-MAX_TILT, Math.min(MAX_TILT, ((credits - debits) / total) * MAX_TILT));

  const toggleEntry = (id: string) => {
    if (isReconciling) return;
    setPosted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setIsReconciling(false);
    setPosted(new Set());
  };

  const handleReconcile = () => {
    reset();
    setIsReconciling(true);
    toast.info('Posting journal lines to the general ledger...');
    ENTRIES.forEach((entry, index) => {
      timers.current.push(setTimeout(() => setPosted((prev) => new Set(prev).add(entry.id)), 450 * (index + 1)));
    });
    timers.current.push(
      setTimeout(() => {
        setIsReconciling(false);
        toast.success('Ledger balanced: debits = credits = $11,000.00 USD.');
      }, 450 * (ENTRIES.length + 1)),
    );
  };

  const status = !hasEntries
    ? { label: 'Nothing posted', tone: 'text-slate-500 dark:text-slate-400', Icon: BookOpenCheck }
    : isBalanced
      ? { label: 'Balanced', tone: 'text-emerald-700 dark:text-emerald-400', Icon: CheckCircle2 }
      : { label: `Out of balance by ${money(Math.abs(variance))}`, tone: 'text-amber-700 dark:text-amber-400', Icon: AlertTriangle };

  const toolbar = (
    <>
      <button
        type="button"
        onClick={reset}
        disabled={!hasEntries && !isReconciling}
        data-role-custom
        aria-label="Reset ledger"
        className="role-press flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-600 role-panel hover:text-slate-900 disabled:opacity-40 dark:bg-slate-950 dark:text-slate-300"
      >
        <RotateCcw aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <button type="button" onClick={handleReconcile} disabled={isReconciling}>
        <span className="flex items-center gap-2">
          <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} fill="currentColor" />
          {isReconciling ? 'Posting…' : 'Run auto-reconciler'}
        </span>
      </button>
    </>
  );

  return (
    <RoleActivityFrame exercise={currentExercise} onComplete={onComplete} toolbar={toolbar}>
      <RoleVisualCard
        index={1}
        icon={Scale}
        title="Double-entry balance scale"
        description="Post each journal line and watch the heavier side drop."
        aside={
          <span role="status" className={`inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold dark:bg-slate-900 ${status.tone}`}>
            <status.Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
            {status.label}
          </span>
        }
      >
        <div className="flex justify-center rounded-xl bg-slate-50 py-3 dark:bg-slate-900">
          <svg viewBox="0 0 240 110" className="h-32 w-full max-w-sm" role="img" aria-label={`Scale showing debits ${money(debits)} against credits ${money(credits)}`}>
            <rect x="116" y="26" width="8" height="64" rx="3" className="fill-slate-300 dark:fill-slate-700" />
            <rect x="88" y="88" width="64" height="8" rx="4" className="fill-slate-400 dark:fill-slate-600" />
            <g style={{ transformOrigin: '120px 26px', transform: `rotate(${tilt}deg)`, transition: 'transform 450ms cubic-bezier(0.23, 1, 0.32, 1)' }}>
              <rect x="28" y="24" width="184" height="4" rx="2" className="fill-slate-800 dark:fill-slate-200" />
              <g stroke="currentColor" strokeWidth="1.25" className="text-slate-400">
                <line x1="44" y1="28" x2="26" y2="58" /><line x1="44" y1="28" x2="62" y2="58" />
                <line x1="196" y1="28" x2="178" y2="58" /><line x1="196" y1="28" x2="214" y2="58" />
              </g>
              <path d="M22 58 Q44 72 66 58 Z" className="fill-emerald-600" />
              <path d="M174 58 Q196 72 218 58 Z" className="fill-cyan-600" />
            </g>
            <circle cx="120" cy="26" r="6" className="fill-slate-900 dark:fill-slate-100" />
          </svg>
        </div>

        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Debits', value: money(debits), tone: 'text-emerald-700 dark:text-emerald-400' },
            { label: 'Credits', value: money(credits), tone: 'text-cyan-700 dark:text-cyan-400' },
            { label: 'Variance', value: money(Math.abs(variance)), tone: variance === 0 ? 'text-slate-900 dark:text-slate-100' : 'text-amber-700 dark:text-amber-400' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-slate-50 px-2 py-2.5 dark:bg-slate-900">
              <dt className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</dt>
              <dd className={`mt-0.5 text-sm font-semibold tabular-nums sm:text-base ${stat.tone}`}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </RoleVisualCard>

      <RoleVisualCard
        index={2}
        icon={BookOpenCheck}
        title="General ledger journal entries"
        description="Base currency USD. Select a line to post or unpost it."
        aside={<span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-500 dark:bg-slate-900 dark:text-slate-400">{posted.size} / {ENTRIES.length} posted</span>}
      >
        <ul className="space-y-2">
          {ENTRIES.map((entry, index) => {
            const isPosted = posted.has(entry.id);
            return (
              <li key={entry.id} style={{ '--i': index + 2 } as React.CSSProperties} className="role-enter">
                <button
                  type="button"
                  onClick={() => toggleEntry(entry.id)}
                  aria-pressed={isPosted}
                  className={`role-press flex w-full flex-wrap items-center justify-between gap-3 rounded-xl p-3 text-left ${
                    isPosted
                      ? 'bg-emerald-50 shadow-[0_0_0_1px_rgb(16_185_129/0.35)] dark:bg-emerald-950/30'
                      : 'bg-slate-50 shadow-[0_0_0_1px_rgb(15_23_42/0.06)] hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      aria-hidden="true"
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ${isPosted ? 'bg-emerald-600 text-white' : 'bg-white text-transparent shadow-[0_0_0_1px_rgb(15_23_42/0.15)] dark:bg-slate-950'}`}
                    >
                      <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">{entry.account}</span>
                      <span className="block text-xs text-slate-500 dark:text-slate-400"><span className="font-mono">{entry.id}</span> · {entry.memo}</span>
                    </span>
                  </span>
                  <span className="flex items-center gap-5 font-mono text-sm tabular-nums">
                    <span className="text-right">
                      <span className="block text-[11px] font-sans uppercase tracking-wider text-slate-400">Debit</span>
                      <span className={entry.debit ? 'font-semibold text-emerald-700 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'}>{entry.debit ? money(entry.debit) : '—'}</span>
                    </span>
                    <span className="text-right">
                      <span className="block text-[11px] font-sans uppercase tracking-wider text-slate-400">Credit</span>
                      <span className={entry.credit ? 'font-semibold text-cyan-700 dark:text-cyan-400' : 'text-slate-300 dark:text-slate-600'}>{entry.credit ? money(entry.credit) : '—'}</span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </RoleVisualCard>
    </RoleActivityFrame>
  );
};

export default DoubleEntryReconciliationActivity;
