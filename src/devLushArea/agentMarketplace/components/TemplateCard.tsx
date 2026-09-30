import { Link } from 'react-router'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Template } from '@/data/templates'
import { getContactHref } from '@/data/templates'
import TemplateThumb from '@/components/TemplateThumb'

export default function TemplateCard({ template, compared = false, onToggleCompare, compareDisabled = false }: { template: Template; compared?: boolean; onToggleCompare?: (slug: string) => void; compareDisabled?: boolean }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60">
      <Link to={'/templates/' + template.slug} className="relative block">
        <TemplateThumb template={template} />
        {template.featured && (
          <span className="absolute top-3 left-3 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={'/templates/' + template.slug} className="block">
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{template.name}</h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{template.tagline}</p>
        <p className="mt-3 text-xs leading-relaxed text-slate-600">
          <span className="font-semibold">Example focus: </span>{template.features.slice(0, 2).join(' · ')}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">{template.category}</span>
          {template.frameworks.slice(0, 2).map((framework) => (
            <span key={framework} className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500">{framework}</span>
          ))}
        </div>

        {onToggleCompare && <button type="button" onClick={() => onToggleCompare(template.slug)} aria-pressed={compared} disabled={compareDisabled && !compared} className={`mt-4 min-h-11 rounded-lg border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 ${compared ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'}`}>{compared ? 'Remove from comparison' : 'Add to comparison'}</button>}

        <div className="mt-4 flex gap-2 pt-1">
          <Button asChild variant="outline" className="flex-1">
            <Link to={'/templates/' + template.slug}>View details <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <Button asChild className="flex-1 bg-indigo-600 hover:bg-indigo-700">
            <a href={getContactHref(template)}><Mail className="mr-1.5 h-4 w-4" /> Contact</a>
          </Button>
        </div>
      </div>
    </article>
  )
}
