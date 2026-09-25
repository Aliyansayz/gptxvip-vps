import { Link, NavLink, useNavigate } from 'react-router'
import { Bot, Mail, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { CONTACT_EMAIL } from '@/data/templates'

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(q.trim() ? `/templates?q=${encodeURIComponent(q.trim())}` : '/templates')
    setOpen(false)
  }

  const navCls = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-cyan-300">
            <Bot className="h-4.5 w-4.5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            GPTX<span className="text-cyan-600">.VIP</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navCls}>Agent Labs</NavLink>
          <NavLink to="/templates" className={navCls}>Project surfaces</NavLink>
          <a href="/agents/lab" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">Open a lab</a>
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search topics or surfaces…"
              className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pr-4 pl-9 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </form>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 sm:inline-flex"
        >
          <Mail className="h-4 w-4" /> Contact owner
        </a>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden">
          <form onSubmit={submit} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search topics or surfaces…"
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-4 pl-9 text-sm outline-none focus:border-indigo-300"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Agent Labs</Link>
            <Link to="/templates" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Project surfaces</Link>
            <a href="/agents/lab" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Open a lab</a>
            <a href={`mailto:${CONTACT_EMAIL}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50">Contact {CONTACT_EMAIL}</a>
          </nav>
        </div>
      )}
    </header>
  )
}
