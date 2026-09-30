import { Link } from 'react-router'
import { X } from 'lucide-react'
import type { Template } from '@/data/templates'

interface TemplateComparisonProps {
  items: Template[]
  onRemove: (slug: string) => void
  onClear: () => void
}

export default function TemplateComparison({ items, onRemove, onClear }: TemplateComparisonProps) {
  if (items.length === 0) return null

  return (
    <section id="template-compare" aria-labelledby="template-compare-heading" className="mt-6 scroll-mt-24 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-700">Comparison shortlist</p>
          <h2 id="template-compare-heading" className="mt-1 text-xl font-semibold text-slate-950">Compare {items.length} project surface{items.length === 1 ? '' : 's'}</h2>
          <p className="mt-1 text-sm text-slate-600">These are surface concepts. Confirm data sources, integration, deployment, and support before a project.</p>
        </div>
        <button type="button" onClick={onClear} className="min-h-10 rounded-lg px-3 text-sm font-semibold text-indigo-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">Clear shortlist</button>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.slug} className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-indigo-700">{item.category}</p>
                <h3 className="mt-1 font-bold text-slate-950">{item.name}</h3>
              </div>
              <button type="button" onClick={() => onRemove(item.slug)} aria-label={`Remove ${item.name} from comparison`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"><X className="h-4 w-4" /></button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.tagline}</p>
            <dl className="mt-4 space-y-3 border-t border-slate-200 pt-3 text-sm">
              <div><dt className="font-semibold text-slate-900">Frameworks</dt><dd className="text-slate-600">{item.frameworks.join(', ')}</dd></div>
              <div><dt className="font-semibold text-slate-900">Example capabilities</dt><dd className="text-slate-600">{item.features.slice(0, 3).join(' · ')}</dd></div>
              <div><dt className="font-semibold text-slate-900">Included context</dt><dd className="text-slate-600">{item.includes.slice(0, 3).join(' · ')}</dd></div>
            </dl>
            <Link to={`/templates/${item.slug}`} className="mt-auto inline-flex min-h-11 items-center justify-center rounded-lg border border-indigo-200 px-3 pt-1 text-sm font-semibold text-indigo-800 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">Review fit and details</Link>
          </article>
        ))}
      </div>
    </section>
  )
}
