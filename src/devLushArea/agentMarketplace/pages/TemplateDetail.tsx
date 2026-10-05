import { Link, useParams } from 'react-router'
import { Check, FileCode2, Layers, LayoutDashboard, Mail, RefreshCw, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import TemplateThumb from '@/components/TemplateThumb'
import TemplateCard from '@/components/TemplateCard'
import { getPrototypePath } from '../../../prototype/registry'
import { CONTACT_EMAIL, getContactHref, getTemplate, templates } from '@/data/templates'

export default function TemplateDetail() {
  const { slug } = useParams()
  const template = slug ? getTemplate(slug) : undefined

  if (!template) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Surface not found</h1>
        <p className="mt-2 text-slate-500">The surface you are looking for does not exist or was removed.</p>
        <Button asChild className="mt-6 bg-indigo-600 hover:bg-indigo-700"><Link to="/templates">Back to catalog</Link></Button>
      </div>
    )
  }

  const related = templates.filter((item) => item.category === template.category && item.id !== template.id).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/templates" className="hover:text-slate-900">Catalog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={'/templates?category=' + encodeURIComponent(template.category)} className="hover:text-slate-900">{template.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-900">{template.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><TemplateThumb template={template} large interactive /></div>
          <div className="mt-8"><h2 className="text-lg font-semibold text-slate-900">About this surface</h2><p className="mt-3 leading-relaxed text-slate-600">{template.description}</p></div>
          {template.prototype && <Button asChild className="mt-4 bg-indigo-600 hover:bg-indigo-700"><Link to={getPrototypePath(template.prototype)}>Open prototype dashboard</Link></Button>}
          <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5" aria-labelledby="surface-fit-heading">
            <h2 id="surface-fit-heading" className="font-semibold text-slate-900">Confirm fit before a project</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">This listing describes a surface concept and its included patterns. It does not specify a connected data source, deployment readiness, support terms, or compatibility with your environment; confirm those details for your project.</p>
            <p className="mt-3 text-xs font-semibold text-slate-600">Useful discussion context: your users, data sources, required integrations, and operational constraints.</p>
          </section>
          <Separator className="my-8" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Key capabilities</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">{template.features.map((feature) => <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{feature}</li>)}</ul>
          </div>
          <Separator className="my-8" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Included context</h2>
            <div className="mt-4 flex flex-wrap gap-2">{template.includes.map((item) => <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">{item}</span>)}</div>
          </div>
          <Separator className="my-8" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[{ icon: LayoutDashboard, label: 'Pages', value: String(template.pages) }, { icon: Layers, label: 'Components', value: template.components + '+' }, { icon: RefreshCw, label: 'Version', value: 'v' + template.version }, { icon: FileCode2, label: 'Updated', value: template.updated }].map((stat) => <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 text-center"><stat.icon className="mx-auto h-5 w-5 text-indigo-500" /><div className="mt-2 font-semibold text-slate-900">{stat.value}</div><div className="text-xs text-slate-500">{stat.label}</div></div>)}
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="flex flex-wrap gap-1.5"><Badge variant="outline">{template.category}</Badge>{template.featured && <Badge className="bg-slate-900 text-white hover:bg-slate-900">Featured</Badge>}</div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{template.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{template.tagline}</p>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">Interested in adapting this surface? Contact the site owner with your project context and requirements.</p>
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Prepare your project brief</h2>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                <li>Who will use this surface?</li>
                <li>Which data sources and integrations are available?</li>
                <li>What outcome, deployment, and support do you need?</li>
              </ul>
              <p className="mt-3 text-xs text-slate-600">The email action includes these prompts so you can explain the fit.</p>
            </div>
            <Button asChild size="lg" className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700"><a href={getContactHref(template)}><Mail className="mr-2 h-4 w-4" /> Contact {CONTACT_EMAIL}</a></Button>
            <p className="mt-3 text-center text-xs text-slate-400">Project conversations happen directly by email.</p>
            <Separator className="my-5" />
            <div className="flex flex-wrap gap-1.5">{template.frameworks.map((framework) => <span key={framework} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{framework}</span>)}{template.tags.map((tag) => <span key={tag} className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">#{tag}</span>)}</div>
          </div>
        </aside>
      </div>

      {related.length > 0 && <div className="mt-20"><h2 className="text-2xl font-semibold tracking-tight text-slate-900">More in {template.category}</h2><div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <TemplateCard key={item.id} template={item} />)}</div></div>}
    </div>
  )
}
