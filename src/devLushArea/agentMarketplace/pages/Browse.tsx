import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import TemplateCard from '@/components/TemplateCard'
import TemplateComparison from '@/components/TemplateComparison'
import { CATEGORIES, FRAMEWORKS, templates } from '@/data/templates'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatePanel } from '../../../shared/components/StatePanel'

const SORTS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'name', label: 'Name A–Z' },
] as const

type SortKey = (typeof SORTS)[number]['value']

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [comparedSlugs, setComparedSlugs] = useState<string[]>([])
  const serializedParams = params.toString()
  const q = params.get('q') ?? ''
  const requestedCategory = params.get('category')
  const requestedFramework = params.get('framework')
  const requestedSort = params.get('sort')
  const category = CATEGORIES.find((value) => value === requestedCategory) ?? 'all'
  const framework = FRAMEWORKS.find((value) => value === requestedFramework) ?? 'all'
  const sort: SortKey = requestedSort === 'name' ? 'name' : 'featured'

  useEffect(() => {
    const canonicalParams = new URLSearchParams(serializedParams)
    if (!q.trim()) canonicalParams.delete('q')
    if (category === 'all') canonicalParams.delete('category')
    if (framework === 'all') canonicalParams.delete('framework')
    if (sort === 'featured') canonicalParams.delete('sort')
    if (canonicalParams.toString() !== serializedParams) {
      setParams(canonicalParams, { replace: true })
    }
  }, [category, framework, q, serializedParams, setParams, sort])

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

  const hasFilters = Boolean(q) || category !== 'all' || framework !== 'all' || sort !== 'featured'
  const comparedTemplates = comparedSlugs.flatMap((slug) => {
    const item = templates.find((template) => template.slug === slug)
    return item ? [item] : []
  })
  const toggleCompare = (slug: string) => {
    setComparedSlugs((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : current)
  }
  const activeFilters = [
    ...(q ? [{ key: 'q', label: `Search: ${q}` }] : []),
    ...(category !== 'all' ? [{ key: 'category', label: `Category: ${category}` }] : []),
    ...(framework !== 'all' ? [{ key: 'framework', label: `Framework: ${framework}` }] : []),
    ...(sort !== 'featured' ? [{ key: 'sort', label: `Sort: ${SORTS.find((item) => item.value === sort)?.label || sort}` }] : []),
  ]
  const selectedClass = 'flex min-h-11 w-full items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
  const idleClass = 'flex min-h-11 w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
  const filters = (
    <div className="space-y-7">
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Search</label>
        <div className="relative mt-2">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input aria-label="Search templates" value={q} onChange={(e) => setParam('q', e.target.value)} placeholder="Name, tag, keyword…" className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-11 pl-9 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500" />
          {q && <button type="button" onClick={() => setParam('q', '')} className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500" aria-label="Clear search"><X className="h-4 w-4" /></button>}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Category</label>
        <div className="mt-2 space-y-1">
          {['all', ...CATEGORIES].map((value) => <button key={value} type="button" aria-pressed={category === value} onClick={() => setParam('category', value)} className={category === value ? selectedClass : idleClass}>{value === 'all' ? 'All categories' : value}<span className="text-xs text-slate-400">{value === 'all' ? templates.length : templates.filter((template) => template.category === value).length}</span></button>)}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Framework</label>
        <div className="mt-2 space-y-1">
          {['all', ...FRAMEWORKS].map((value) => <button key={value} type="button" aria-pressed={framework === value} onClick={() => setParam('framework', value)} className={framework === value ? selectedClass : idleClass}>{value === 'all' ? 'All frameworks' : value}<span className="text-xs text-slate-400">{value === 'all' ? templates.length : templates.filter((template) => template.frameworks.includes(value)).length}</span></button>)}
        </div>
      </div>
      {hasFilters && <Button type="button" variant="outline" className="w-full" onClick={() => setParams({}, { replace: true })}>Clear all filters</Button>}
    </div>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{category !== 'all' ? category : 'All agent surfaces'}</h1>
          <p aria-live="polite" className="mt-1 text-slate-500">{results.length} result{results.length === 1 ? '' : 's'}{q && <> for “<span className="font-medium text-slate-700">{q}</span>”</>}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" className="lg:hidden" aria-expanded={mobileFilters} aria-controls="browse-mobile-filters" onClick={() => setMobileFilters((value) => !value)}><SlidersHorizontal className="mr-2 h-4 w-4" /> {mobileFilters ? 'Hide filters' : 'Show filters'}</Button>
          <Select value={sort} onValueChange={(value) => setParam('sort', value)}><SelectTrigger aria-label="Sort templates" className="w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger><SelectContent>{SORTS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectContent></Select>
        </div>
      </div>
      {activeFilters.length > 0 && <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
        <span className="text-xs font-semibold text-slate-500">Active filters:</span>
        {activeFilters.map((filter) => <button key={filter.key} type="button" onClick={() => setParam(filter.key, '')} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100">{filter.label}<X className="h-3 w-3" /><span className="sr-only">Clear this filter</span></button>)}
        <button type="button" onClick={() => setParams({}, { replace: true })} className="text-xs font-medium text-slate-600 underline underline-offset-2">Clear all</button>
      </div>}
      <p role="status" aria-live="polite" className="sr-only">{comparedSlugs.length} of 3 surfaces selected for comparison</p>
      <TemplateComparison items={comparedTemplates} onRemove={toggleCompare} onClear={() => setComparedSlugs([])} />
      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block"><div className="sticky top-24">{filters}</div></aside>
        <div id="browse-mobile-filters" className={`${mobileFilters ? 'rounded-xl border border-slate-200 bg-white p-5' : 'hidden'} lg:hidden`}>{filters}</div>
        <div>
          {results.length === 0 ? <StatePanel title="No surfaces match" description="Try a different keyword or clear the active filters to see the available project surfaces." actionLabel="Clear filters" onAction={() => setParams({}, { replace: true })} /> : <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.map((template) => <TemplateCard key={template.id} template={template} compared={comparedSlugs.includes(template.slug)} onToggleCompare={toggleCompare} compareDisabled={comparedSlugs.length >= 3} />)}</div>}
        </div>
      </div>
    </div>
  )
}
