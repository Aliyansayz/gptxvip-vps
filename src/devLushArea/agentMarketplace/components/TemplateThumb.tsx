import { useMemo } from 'react'
import type { Template } from '@/data/templates'
import { DashboardPreview } from '@/components/DashboardPreview'

/** Deterministic pseudo-random series from a seed string */
function series(seed: string, n: number, min = 20, max = 95): number[] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const out: number[] = []
  let x = h >>> 0
  for (let i = 0; i < n; i++) {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    out.push(min + (Math.abs(x >>> 0) % (max - min)))
  }
  return out
}

function Bars({ seed, accent }: { seed: string; accent: string }) {
  const vals = useMemo(() => series(seed, 14), [seed])
  return (
    <div className="flex h-full items-end gap-[6%] px-1">
      {vals.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[2px]"
          style={{ height: `${v}%`, backgroundColor: accent, opacity: 0.25 + (v / 100) * 0.75 }}
        />
      ))}
    </div>
  )
}

function Area({ seed, accent }: { seed: string; accent: string }) {
  const vals = useMemo(() => series(seed, 24, 30, 90), [seed])
  const points = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${100 - v}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
      <polygon points={`0,100 ${points} 100,100`} fill={accent} opacity="0.15" />
      <polyline points={points} fill="none" stroke={accent} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function Donut({ seed, accent }: { seed: string; accent: string }) {
  const vals = useMemo(() => series(seed, 3, 20, 60), [seed])
  const total = vals.reduce((a, b) => a + b, 0)
  const palette = [accent, '#cbd5e1', '#e2e8f0']
  let offset = 0
  const r = 15.9155
  return (
    <div className="flex h-full items-center justify-center">
      <svg viewBox="0 0 42 42" className="h-[85%]">
        {vals.map((v, i) => {
          const pct = (v / total) * 100
          const el = (
            <circle
              key={i}
              cx="21"
              cy="21"
              r={r}
              fill="transparent"
              stroke={palette[i]}
              strokeWidth="6"
              strokeDasharray={`${pct} ${100 - pct}`}
              strokeDashoffset={25 - offset}
            />
          )
          offset += pct
          return el
        })}
        <circle cx="21" cy="21" r="8" fill="white" />
      </svg>
    </div>
  )
}

function Chart({ kind, seed, accent }: { kind: Template['chart']; seed: string; accent: string }) {
  if (kind === 'bars') return <Bars seed={seed} accent={accent} />
  if (kind === 'donut') return <Donut seed={seed} accent={accent} />
  return <Area seed={seed} accent={accent} />
}

function StatCards({ accent }: { accent: string }) {
  return (
    <div className="grid grid-cols-3 gap-[4%]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-md border border-slate-200/80 bg-white p-[6%] shadow-sm">
          <div className="h-1.5 w-1/2 rounded-full bg-slate-200" />
          <div className="mt-[12%] h-2 w-3/4 rounded-full" style={{ backgroundColor: accent, opacity: 0.85 }} />
        </div>
      ))}
    </div>
  )
}

function Rows({ accent }: { accent: string }) {
  return (
    <div className="space-y-[6%]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-[6%]">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent, opacity: 0.3 + i * 0.25 }} />
          <div className="h-1.5 rounded-full bg-slate-200" style={{ width: `${70 - i * 15}%` }} />
        </div>
      ))}
    </div>
  )
}

export default function TemplateThumb({
  template,
  large,
  interactive = false,
}: {
  template: Template
  large?: boolean
  interactive?: boolean
}) {
  const { accent, layout, chart, slug } = template

  if (template.preview) {
    return (
      <div
        className={`relative w-full overflow-hidden bg-slate-100 ${large ? 'aspect-[16/10] rounded-xl' : 'aspect-[16/10]'}`}
        {...(interactive ? {} : { role: 'img', 'aria-label': `${template.name} dashboard preview` })}
      >
        <DashboardPreview template={template} interactive={interactive} />
      </div>
    )
  }
  const chartBox = (
    <div className="rounded-md border border-slate-200/80 bg-white p-[4%] shadow-sm" style={{ height: '58%' }}>
      <div className="mb-[3%] flex items-center justify-between">
        <div className="h-1.5 w-1/4 rounded-full bg-slate-200" />
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-slate-200" />
          ))}
        </div>
      </div>
      <div style={{ height: '78%' }}>
        <Chart kind={chart} seed={slug} accent={accent} />
      </div>
    </div>
  )

  const bottomRow = (
    <div className="grid flex-1 grid-cols-5 gap-[3%]" style={{ minHeight: 0 }}>
      <div className="col-span-3 rounded-md border border-slate-200/80 bg-white p-[5%] shadow-sm">
        <Rows accent={accent} />
      </div>
      <div className="col-span-2 rounded-md border border-slate-200/80 bg-white p-[6%] shadow-sm">
        <div className="h-full">
          <Chart kind={chart === 'donut' ? 'bars' : 'donut'} seed={slug + '-2'} accent={accent} />
        </div>
      </div>
    </div>
  )

  return (
    <div
      className={`relative w-full overflow-hidden bg-slate-100 ${large ? 'aspect-[16/10] rounded-xl' : 'aspect-[16/10]'}`}
      aria-label={`${template.name} preview`}
    >
      <div className="absolute inset-[6%] flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-md">
        {layout !== 'topnav' && (
          <div className="flex w-[18%] flex-col gap-[8%] border-r border-slate-200 bg-white p-[4%]">
            <div className="h-2 w-2/3 rounded-full" style={{ backgroundColor: accent }} />
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-1.5 rounded-full bg-slate-200" style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-[3%] p-[3%]">
          {layout === 'topnav' && (
            <div className="flex items-center gap-[3%] rounded-md border border-slate-200/80 bg-white px-[3%] py-[2%] shadow-sm">
              <div className="h-2 w-[8%] rounded-full" style={{ backgroundColor: accent }} />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-1.5 w-[7%] rounded-full bg-slate-200" />
              ))}
              <div className="ml-auto h-2.5 w-2.5 rounded-full bg-slate-300" />
            </div>
          )}
          {layout === 'sidebar' && <StatCards accent={accent} />}
          {chartBox}
          {bottomRow}
        </div>
      </div>
    </div>
  )
}
