import React, { useState } from 'react';
import { CheckCircle2, Search } from 'lucide-react';
import { ActivityComponentProps } from '../FallbackRoleActivity';
import RoleActivityFrame from '../../views/components/RoleActivityFrame';
import { contrastRatio } from '../../utils/colorContrast';

type VisionMode = 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia';
const canvas = '#0F172A';
const palettes = [
  { name: 'Original red / green', colors: ['#E11D48', '#10B981'], modes: { normal: ['#E11D48', '#10B981'], deuteranopia: ['#8f5e3b', '#7fa375'], protanopia: ['#636f45', '#8aa16f'], tritanopia: ['#dc2e3d', '#0fb0a3'] } },
  { name: 'Blue / amber with direct labels', colors: ['#2563EB', '#F59E0B'], modes: { normal: ['#2563EB', '#F59E0B'], deuteranopia: ['#3b6fcb', '#c29d33'], protanopia: ['#2a69d4', '#c09b30'], tritanopia: ['#2c6ea3', '#f2929e'] } },
];
const series = [{ name: 'Q3 Churn', value: 12 }, { name: 'Q3 Expansion', value: 24 }];

export default function ColorContrastA11yActivity({ step, exercises, onComplete }: ActivityComponentProps) {
  const exercise = exercises[step] || exercises[0];
  const [vision, setVision] = useState<VisionMode>('normal');
  const [candidate, setCandidate] = useState(1);
  const [audited, setAudited] = useState(false);
  const palette = palettes[candidate];
  const colors = palette.modes[vision];
  return (
    <RoleActivityFrame exercise={exercise} onComplete={onComplete} toolbar={<button type="button" onClick={() => setAudited(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"><Search className="h-4 w-4" />Measure contrast</button>}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <figure className="min-w-0 overflow-hidden rounded-2xl border border-slate-700 p-5 text-slate-100" style={{ backgroundColor: canvas }}>
          <figcaption className="mb-5 text-base font-semibold text-white">Executive dashboard · Q3 retention</figcaption>
          <p className="mb-6 text-sm text-slate-300">Illustrative values · {palette.name}</p>
          <div className="space-y-7" aria-label="Q3 Churn 12 percent; Q3 Expansion 24 percent">
            {series.map((item, index) => <div key={item.name}>
              <div className="mb-2 flex justify-between gap-3 text-sm text-white"><span>{item.name}</span><span className="font-mono">{item.value}%</span></div>
              <div className="h-14 rounded-lg bg-slate-800"><div className="h-full rounded-lg border border-white/30 transition-colors" style={{ width: `${item.value / 30 * 100}%`, backgroundColor: colors[index], backgroundImage: candidate === 1 && index === 0 ? 'repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(255,255,255,.5) 8px, rgba(255,255,255,.5) 10px)' : undefined }} /></div>
            </div>)}
          </div>
          <div className="mt-5 flex justify-between text-xs text-slate-300"><span>0%</span><span>30%</span></div>
          <p className="mt-6 text-sm leading-6 text-slate-300">Direct names and values stay readable in every preview. The revised example adds a stripe pattern to Churn.</p>
        </figure>
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <fieldset className="space-y-3"><legend className="mb-3 text-sm font-semibold">Compare palettes</legend>{palettes.map((item, index) => <label key={item.name} className="flex cursor-pointer items-start gap-2 text-sm leading-6"><input type="radio" name="palette-candidate" checked={candidate === index} onChange={() => { setCandidate(index); setAudited(false); }} className="mt-1 h-4 w-4 accent-indigo-600" /><span>{item.name}</span></label>)}</fieldset>
          <div className="space-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">{palette.colors.map((hex, index) => <div key={hex} className="flex items-center gap-3"><span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-lg border border-slate-300" style={{ backgroundColor: hex }} /><div><p className="text-sm">{series[index].name}</p><p className="font-mono text-xs text-slate-500 dark:text-slate-400">{hex}</p></div></div>)}</div>
        </div>
      </div>
      <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <legend className="px-2 text-sm font-semibold">Vision preview</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{(['normal', 'deuteranopia', 'protanopia', 'tritanopia'] as VisionMode[]).map(mode => <label key={mode} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm capitalize ${vision === mode ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-700'}`}><input type="radio" name="vision-preview" checked={vision === mode} onChange={() => setVision(mode)} className="h-4 w-4 accent-indigo-600" />{mode}</label>)}</div>
        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">These approximate color transformations illustrate perception differences. They do not certify a palette as universally distinguishable.</p>
      </fieldset>
      {audited && <section role="status" aria-label="Contrast measurements" className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold"><CheckCircle2 className="h-5 w-5 text-indigo-600" />Contrast measurements</h3>
        <p className="mb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Measured from the original sRGB colors against canvas <code>{canvas}</code>. Vision preview colors are illustrative. Text and chart graphics use different criteria.</p>
        <div className="space-y-3">{palette.colors.map((hex, index) => { const ratio = contrastRatio(hex, canvas); return <div key={hex} className="flex flex-wrap justify-between gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950"><span>{series[index].name} · <code>{hex}</code></span><span className="font-medium">{ratio.toFixed(2)}:1 · {ratio >= 3 ? 'Passes 3:1 for essential graphics' : 'Below 3:1 for essential graphics'}</span></div>; })}<div className="flex flex-wrap justify-between gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950"><span>White text · <code>#FFFFFF</code></span><span className="font-medium">{contrastRatio('#FFFFFF', canvas).toFixed(2)}:1 · Passes 7:1 for AAA normal text</span></div></div>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">A contrast check does not establish full WCAG conformance. Direct labels and patterns also help distinguish the categories.</p>
      </section>}
    </RoleActivityFrame>
  );
}
