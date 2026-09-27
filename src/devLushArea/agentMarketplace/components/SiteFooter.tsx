import { Link } from 'react-router'
import { Bot, Mail } from 'lucide-react'
import { CATEGORIES, CONTACT_EMAIL } from '@/data/templates'

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-cyan-300"><Bot className="h-4.5 w-4.5" /></span>
            <span className="text-lg font-semibold text-slate-900">GPTX<span className="text-cyan-600">.VIP</span></span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">Focused agent and workflow surfaces for teams that want a clear starting point.</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Explore</h4>
          <ul className="mt-4 space-y-2.5">
            <li><a href="/" className="text-sm text-slate-500 hover:text-slate-900">GPTX.VIP Home</a></li>
            <li><Link to="/" className="text-sm text-slate-500 hover:text-slate-900">Agent Labs</Link></li>
            <li><Link to="/templates" className="text-sm text-slate-500 hover:text-slate-900">Project surfaces</Link></li>
            <li><Link to="/lab" className="text-sm text-slate-500 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Open a lab</Link></li>
            <li><Link to={'/templates?category=' + encodeURIComponent(CATEGORIES[0])} className="text-sm text-slate-500 hover:text-slate-900">Analytics</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900">Start a conversation</h4>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">Tell the site owner what you are building and which surface you want to discuss.</p>
          <a href={'mailto:' + CONTACT_EMAIL} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"><Mail className="h-4 w-4" />{CONTACT_EMAIL}</a>
        </div>
      </div>
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>© 2026 GPTX.VIP. Agent Labs and project surfaces.</span>
          <span>Questions and project inquiries are handled by email.</span>
        </div>
      </div>
    </footer>
  )
}
