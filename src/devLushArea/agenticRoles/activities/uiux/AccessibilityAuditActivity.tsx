import React, { useState } from 'react';
import { CheckCircle2, ScanEye } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import { contrastRatio } from '../../utils/colorContrast';

/**
 * Day 1 — Accessibility audit across contrast, heading semantics, and focus order.
 *
 * The contrast maths is real (`contrastRatio`), so the numbers cannot drift from
 * the palette. `#556070` on the `#0F172A` surface measures 2.80:1, which is the
 * figure the case narrative quotes — the failing check and the scenario agree
 * because both read from the same pair.
 */

type Candidate = {
  id: string;
  label: string;
  labelInk: string;
  surface: string;
  headings: string[];
  domOrder: string[];
  focusOrder: string[];
  altText: string;
};

const candidates: Candidate[] = [
  {
    id: 'baseline',
    label: 'Checkout · shipped today',
    labelInk: '#556070',
    surface: '#0F172A',
    headings: ['h1 Checkout', 'h1 Payment', 'h2 Order summary', 'h4 Card details', 'h3 Billing address'],
    domOrder: ['order summary', 'payment', 'card details', 'quantity', 'billing address', 'place order'],
    focusOrder: ['payment', 'card details', 'billing address', 'order summary', 'quantity', 'place order'],
    altText: 'Payment card illustration',
  },
  {
    id: 'repaired',
    label: 'Checkout · proposed repair',
    labelInk: '#E2E8F0',
    surface: '#0F172A',
    headings: ['h1 Checkout', 'h2 Payment', 'h3 Card details', 'h3 Billing address', 'h2 Order summary'],
    domOrder: ['order summary', 'payment', 'card details', 'billing address', 'quantity', 'place order'],
    focusOrder: ['order summary', 'payment', 'card details', 'billing address', 'quantity', 'place order'],
    altText: '',
  },
];

/** A skipped level is a heading-order defect; a reorder is a focus-order defect. */
const headingDefects = (candidate: Candidate) => {
  const levels = candidate.headings.map((heading) => Number(heading.slice(1, 2)));
  const skipped = levels.some((level, index) => index > 0 && level - levels[index - 1] > 1);
  return skipped;
};

const focusDefects = (candidate: Candidate) =>
  candidate.focusOrder.join('|') !== candidate.domOrder.join('|');

const contrastDefect = (candidate: Candidate) => contrastRatio(candidate.labelInk, candidate.surface) < 4.5;

export default function AccessibilityAuditActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [audited, setAudited] = useState(false);
  const candidate = candidates[candidateIndex];
  const ratio = contrastRatio(candidate.labelInk, candidate.surface);

  const checks = [
    { id: 'contrast', label: 'Label contrast', detail: `${candidate.labelInk} on ${candidate.surface}`, pass: ratio >= 4.5, note: `${ratio.toFixed(2)}:1 against a 4.5:1 requirement for normal text` },
    { id: 'headings', label: 'Heading outline', detail: candidate.headings.join(' → '), pass: !headingDefects(candidate), note: headingDefects(candidate) ? 'A heading level is skipped, which breaks the document outline' : 'Levels descend without a skip' },
    { id: 'focus', label: 'Focus order matches DOM order', detail: `${candidate.focusOrder.length} focusable stops`, pass: !focusDefects(candidate), note: focusDefects(candidate) ? 'Focus visits quantity after the summary, so keyboard order contradicts the screen' : 'Focus follows the document order' },
    { id: 'alt', label: 'Alternative text is meaningful', detail: candidate.altText ? `alt="${candidate.altText}"` : 'Decorative image marked empty', pass: candidate.id === 'repaired', note: candidate.id === 'repaired' ? 'A decorative image is correctly hidden from the accessibility tree' : 'The alt text restates the file name instead of the purpose' },
  ];
  const failing = checks.filter((check) => !check.pass);

  return (
    <RoleActivityFrame
      exercise={exercise}
      onComplete={onComplete}
      toolbar={
        <button type="button" onClick={() => setAudited(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime-600 px-4 py-2 text-sm font-semibold text-white hover:bg-lime-700">
          <ScanEye className="h-4 w-4" />Run the audit
        </button>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <figure className="min-w-0 rounded-2xl border border-slate-700 p-5 text-slate-100" style={{ backgroundColor: candidate.surface }}>
          <figcaption className="mb-5 text-base font-semibold text-white">{candidate.label}</figcaption>
          <div className="space-y-4">
            <div className="rounded-xl border border-white/15 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Order summary</p>
              <p className="mt-1 text-sm text-slate-300">2 items · $84.00</p>
            </div>
            <div className="rounded-xl border border-white/15 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Card details</p>
              <label className="mt-2 block text-sm" style={{ color: candidate.labelInk }}>Name on card</label>
              <input readOnly value="" aria-label="Name on card" className="mt-1 w-full rounded-lg border border-white/20 bg-black/30 px-3 py-2 text-sm text-slate-200" />
            </div>
            <button type="button" className="w-full rounded-lg bg-lime-500 px-4 py-3 text-sm font-bold text-zinc-950">Place order</button>
          </div>
        </figure>

        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-semibold">Compare builds</legend>
            {candidates.map((item, index) => (
              <label key={item.id} className="flex cursor-pointer items-start gap-2 text-sm leading-6">
                <input type="radio" name="uiux-a11y-build" checked={candidateIndex === index} onChange={() => { setCandidateIndex(index); setAudited(false); }} className="mt-1 h-4 w-4 accent-lime-600" />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
          <div className="space-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
            <p className="font-semibold">DOM order</p>
            <ol className="space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{candidate.domOrder.map((node) => <li key={node}>{node}</li>)}</ol>
            <p className="pt-2 font-semibold">Focus order</p>
            <ol className="space-y-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{candidate.focusOrder.map((node) => <li key={node}>{node}</li>)}</ol>
          </div>
        </div>
      </div>

      {audited && (
        <section role="status" aria-label="Accessibility audit results" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <CheckCircle2 className="h-5 w-5 text-lime-600" />Audit results
          </h3>
          <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {failing.length === 0
              ? 'No blocking defects in this build. Confirm with a manual keyboard pass and a screen-reader task before shipping.'
              : `${failing.length} of ${checks.length} checks fail. Each is an independent requirement, so each needs its own fix.`}
          </p>
          <ul className="space-y-3">
            {checks.map((check) => (
              <li key={check.id} className="flex flex-wrap justify-between gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                <div className="min-w-0">
                  <p className="font-semibold">{check.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{check.detail}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{check.note}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${check.pass ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                  {check.pass ? 'Pass' : 'Fail'}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            An automated audit reports the automated subset. Contrast, heading structure, focus order, and alternative text
            still need a manual pass, because each one is a different requirement with a different owner.
          </p>
        </section>
      )}
    </RoleActivityFrame>
  );
}
