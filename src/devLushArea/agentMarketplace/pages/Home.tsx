import { Link } from 'react-router'
import { ArrowRight, Check, Code2, FlaskConical, Mail, MessageSquare, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TemplateCard from '@/components/TemplateCard'
import TemplateThumb from '@/components/TemplateThumb'
import { CATEGORIES, CONTACT_EMAIL, templates } from '@/data/templates'
import { agentLabTopics } from '../../agentLabsData'

const categoryIcons: Record<string, string> = {
  Analytics: '📈',
  'E-commerce': '🛍️',
  SaaS: '☁️',
  Finance: '💳',
  CRM: '🤝',
  Marketing: '📣',
  Healthcare: '🩺',
  Crypto: '🪙',
}

export default function Home() {
  const featured = templates.filter((template) => template.featured)
  const heroTemplate = templates[0]

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              Agent Labs · project surfaces
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Start with the topic or surface
              <span className="text-indigo-600"> closest to your question.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
              Explore lab topics and focused workflow surfaces, then contact the site owner directly when you are ready to discuss a project fit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                <Link to="/templates">Explore surfaces <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="/agents/lab"><FlaskConical className="mr-2 h-4 w-4" /> Open Agent Labs</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={'mailto:' + CONTACT_EMAIL}><Mail className="mr-2 h-4 w-4" /> Contact the owner</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-slate-500">
              <div><div className="text-xl font-semibold text-slate-900">{agentLabTopics.length}</div>lab topics</div>
              <div><div className="text-xl font-semibold text-slate-900">{templates.length}</div>project surfaces</div>
              <div><div className="text-xl font-semibold text-slate-900">1:1</div>owner conversation</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-indigo-100 via-sky-50 to-transparent blur-2xl" />
            <Link to={'/templates/' + heroTemplate.slug} className="block">
              <TemplateThumb template={heroTemplate} large />
            </Link>
            <div className="absolute -bottom-4 left-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <div>
                <div className="text-sm font-semibold text-slate-900">{heroTemplate.name}</div>
                <div className="text-xs text-slate-500">{heroTemplate.components}+ components · v{heroTemplate.version}</div>
              </div>
              <div className="ml-4 text-sm font-semibold text-indigo-600">Discuss this surface</div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/70" aria-labelledby="lab-topics-heading">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Agent Labs</p>
              <h2 id="lab-topics-heading" className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Choose a real topic</h2>
              <p className="mt-1 text-slate-500">Use the lab-topic hierarchy before browsing the broader surface catalog.</p>
            </div>
            <FlaskConical className="hidden h-8 w-8 text-indigo-300 sm:block" />
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agentLabTopics.map((topic, index) => (
              <div key={topic.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400">0{index + 1}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{topic.family}</span></div>
                <h3 className="mt-7 font-semibold text-slate-900">{topic.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{topic.outcome}</p>
                <Link to={'/templates?q=' + encodeURIComponent(topic.query)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800">Explore related surfaces <ArrowRight className="h-4 w-4" /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Project surfaces</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Browse by the work you need to support</h2>
          <p className="mt-1 text-slate-500">Review the structure, then contact the owner to discuss adaptation.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((category) => {
            const count = templates.filter((template) => template.category === category).length
            return (
              <Link key={category} to={'/templates?category=' + encodeURIComponent(category)} className="group rounded-xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                <div className="text-2xl">{categoryIcons[category]}</div>
                <div className="mt-3 font-medium text-slate-900 group-hover:text-indigo-700">{category}</div>
                <div className="text-sm text-slate-400">{count} surface{count === 1 ? '' : 's'}</div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">A considered starting set</h2>
              <p className="mt-1 text-slate-500">Review a few clear examples, then start a direct conversation.</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex"><Link to="/templates">View all <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((template) => <TemplateCard key={template.id} template={template} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900">A simple path from interest to conversation</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Code2, title: 'Inspect the surface', body: 'Review the structure, interaction patterns, and technical context before you decide what fits.' },
            { icon: RefreshCw, title: 'Describe your use case', body: 'Share the problem, product context, and level of adaptation you need.' },
            { icon: MessageSquare, title: 'Talk directly', body: 'The site owner handles project questions personally at ' + CONTACT_EMAIL + '.' },
          ].map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600"><feature.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900 px-6 py-14 text-center sm:px-12">
          <Check className="mx-auto h-8 w-8 text-cyan-300" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white">Have a project in mind?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">Send a short description and the site owner will follow up by email.</p>
          <Button asChild size="lg" className="mt-8 bg-white text-slate-900 hover:bg-slate-100"><a href={'mailto:' + CONTACT_EMAIL}><Mail className="mr-2 h-4 w-4" /> {CONTACT_EMAIL}</a></Button>
        </div>
      </section>
    </div>
  )
}
