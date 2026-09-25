import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import TemplateCard from '@/components/TemplateCard'
import { CATEGORIES, FRAMEWORKS, templates } from '@/data/templates'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SORTS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'name', label: 'Name A–Z' },
] as const

type SortKey = (typeof SORTS)[number]['value']

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'
  const framework = params.get('framework') ?? 'all'
  const sort = (params.get('sort') as SortKey) ?? 'featured'

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all' || value === '' || (key === 'sort' && value === 'featured')) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    let list = [...templates]
    if (q.trim()) {
      const needle = q.trim().toLowerCase()
      list = list.filter((template) => [template.name, template.tagline, template.description, template.category, ...template.tags, ...template.frameworks].join(' ').toLowerCase().includes(needle))
    }
    if (category !== 'all') list = list.filter((template) => template.category === category)
    if (framework !== 'all') list = list.filter((template) => template.frameworks.includes(framework))
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    return list
  }, [q, category, framework, sort])

  const hasFilters = Boolean(q) || category !== 'all' || framework !== 'all'
  const selectedClass = 'flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors bg-indigo-50 font-medium text-indigo-700'
  const idleClass = 'flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors text-slate-600 hover:bg-slate-100'
  const filters = (
    <div className="space-y-7">
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Search</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Name, tag, keyword…" className="h-9 w-full rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
          {q && <button onClick={() => setParam('q', '')} className="absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Category</label>
        <div className="mt-2 space-y-1">
          {['all', ...CATEGORIES].map((value) => <button key={value} onClick={() => setParam('category', value)} className={category === value ? selectedClass : idleClass}>{value === 'all' ? 'All categories' : value}<span className="text-xs text-slate-400">{value === 'all' ? templates.length : templates.filter((template) => template.category === value).length}</span></button>)}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Framework</label>
        <div className="mt-2 space-y-1">
          {['all', ...FRAMEWORKS].map((value) => <button key={value} onClick={() => setParam('framework', value)} className={framework === value ? selectedClass : idleClass}>{value === 'all' ? 'All frameworks' : value}<span className="text-xs text-slate-400">{value === 'all' ? templates.length : templates.filter((template) => template.frameworks.includes(value)).length}</span></button>)}
        </div>
      </div>
      {hasFilters && <Button variant="outline" className="w-full" onClick={() => setParams({}, { replace: true })}>Clear all filters</Button>}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{category !== 'all' ? category : 'All agent surfaces'}</h1>
          <p className="mt-1 text-slate-500">{results.length} result{results.length === 1 ? '' : 's'}{q && <> for “<span className="font-medium text-slate-700">{q}</span>”</>}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilters((value) => !value)}><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
          <Select value={sort} onValueChange={(value) => setParam('sort', value)}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent>{SORTS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24">{filters}</div></aside>
        {mobileFilters && <div className="rounded-xl border border-slate-200 bg-white p-5 lg:hidden">{filters}</div>}
        <div>
          {results.length === 0 ? <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 py-24 text-center"><Search className="h-8 w-8 text-slate-300" /><h3 className="mt-4 font-semibold text-slate-900">No surfaces match</h3><p className="mt-1 max-w-sm text-sm text-slate-500">Try a different keyword or clear the filters.</p><Button variant="outline" className="mt-6" onClick={() => setParams({}, { replace: true })}>Clear filters</Button></div> : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.map((template) => <TemplateCard key={template.id} template={template} />)}</div>}
        </div>
      </div>
    </div>
  )
}
