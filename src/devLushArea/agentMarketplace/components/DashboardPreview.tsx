import type { Template } from '@/data/templates'

const signalLabels = ['Discovery', 'Alignment', 'Build', 'Review']
const chartValues = [34, 58, 45, 72, 64, 84, 70, 92]

function SignalChart({ accent, kind }: { accent: string; kind: Template['chart'] }) {
  if (kind === 'donut') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="relative h-32 w-32 rounded-full" style={{ background: `conic-gradient(${accent} 0 42%, #dbeafe 42% 74%, #e2e8f0 74% 100%)` }}>
          <div className="absolute inset-5 flex items-center justify-center rounded-full bg-white text-center text-[10px] font-semibold text-slate-700">Focus<br /><span className="text-lg">42%</span></div>
        </div>
      </div>
    )
  }

  if (kind === 'bars') {
    return (
      <div className="flex h-full items-end gap-2 px-2 pb-1">
        {chartValues.map((value, index) => <div key={index} className="flex-1 rounded-t-md" style={{ height: `${value}%`, backgroundColor: accent, opacity: 0.4 + index / 20 }} />)}
      </div>
    )
  }

  const points = chartValues.map((value, index) => `${(index / (chartValues.length - 1)) * 100},${100 - value}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <polygon points={`0,100 ${points} 100,100`} fill={accent} opacity=".12" />
      <polyline points={points} fill="none" stroke={accent} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function DashboardPreview({ template }: { template: Template; interactive?: boolean }) {
  return (
    <div className="h-full overflow-hidden bg-slate-50 p-[4%] text-slate-800">
      <div className="flex h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <aside className="hidden w-[22%] shrink-0 border-r border-slate-100 bg-slate-50/70 p-[3%] sm:block">
          <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: template.accent }} />
          <div className="mt-5 space-y-2">
            {['Overview', 'Signals', 'Workspace', 'Notes'].map((item, index) => <div key={item} className={`h-1.5 rounded-full ${index === 0 ? 'w-4/5' : 'w-2/3 bg-slate-200'}`} style={index === 0 ? { backgroundColor: template.accent, opacity: 0.7 } : undefined} />)}
          </div>
        </aside>
        <main className="min-w-0 flex-1 p-[4%]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div><div className="text-[8px] font-medium text-slate-400">Agent Lab · {template.category}</div><div className="mt-1 truncate text-sm font-semibold">{template.name}</div></div>
            <div className="h-5 w-5 rounded-full" style={{ backgroundColor: template.accent, opacity: 0.18 }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['Scope', 'Signals', 'Next step'].map((label, index) => <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-2"><div className="text-[7px] text-slate-400">{label}</div><div className="mt-1 text-xs font-semibold text-slate-700">{['Ready', `${template.tags.length + 3}`, signalLabels[index + 1] ?? 'Review'][index]}</div></div>)}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr]">
            <div className="rounded-lg border border-slate-100 p-2.5"><div className="flex items-center justify-between text-[8px] font-semibold"><span>Project signals</span><span className="text-slate-400">Last 30 days</span></div><div className="mt-3 h-24"><SignalChart accent={template.accent} kind={template.chart} /></div></div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-2.5"><div className="text-[8px] font-semibold">Conversation path</div><div className="mt-3 space-y-2">{signalLabels.map((label, index) => <div key={label} className="flex items-center gap-2 text-[7px] text-slate-500"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: template.accent, opacity: 0.35 + index * 0.2 }} />{label}<span className="ml-auto text-slate-300">0{index + 1}</span></div>)}</div></div>
          </div>
          <div className="mt-2 rounded-lg border border-slate-100 p-2.5"><div className="text-[8px] font-semibold">Working notes</div><div className="mt-2 grid grid-cols-3 gap-2">{template.features.slice(0, 3).map((feature) => <div key={feature} className="h-1.5 rounded-full bg-slate-200" title={feature} />)}</div></div>
        </main>
      </div>
    </div>
  )
}
