import React from 'react';
import { ArrowUpRight, BookOpen, Code2, LineChart, Mail, Sparkles } from 'lucide-react';

interface FooterProps {
    onNavigateFinhub: () => void;
    onNavigateDevLush: () => void;
    onNavigateBlogs: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateAnalyticsSurfaces?: () => void;
    theme?: 'light' | 'dark';
}

export const Footer: React.FC<FooterProps> = ({
    onNavigateFinhub,
    onNavigateDevLush,
    onNavigateBlogs,
    onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
    onNavigateProjectSurfaces,
    onNavigateAnalyticsSurfaces,
    theme = 'light',
}) => (
    <footer className={`border-t ${theme === 'dark' ? 'border-zinc-800 bg-zinc-950/90 text-zinc-300' : 'border-slate-900/10 bg-white/70 text-slate-600'}`}>
        <div className="mx-auto grid max-w-6xl gap-9 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr] md:py-12">
            <div>
                <a href="/" className={`inline-flex items-center gap-3 ${theme === 'dark' ? 'text-white' : 'text-slate-950'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2`} aria-label="GPTX.VIP home">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-cyan-300"><Sparkles className="h-4 w-4" /></span>
                    <span className="font-display text-lg font-black tracking-tight">GPTX<span className="text-cyan-600">.VIP</span></span>
                </a>
                <p className="mt-4 max-w-sm text-sm leading-6">
                    Interactive lessons, agent labs, and finance tools for exploring code, systems, and trading ideas.
                </p>
            </div>

            <div>
                <h2 className={`text-xs font-bold uppercase tracking-[0.16em] ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-950'}`}>Explore</h2>
                <ul className="mt-4 space-y-3 text-sm">
                    <li><button onClick={onNavigateCodeConcepts} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Code2 className="h-4 w-4" />Code Concepts</button></li>
                    <li><button onClick={onNavigateDevLush} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><Sparkles className="h-4 w-4" />Agent Labs</button></li>
                    {onNavigateProjectSurfaces && <li><button onClick={onNavigateProjectSurfaces} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Project surfaces</button></li>}
                    {onNavigateAnalyticsSurfaces && <li><button onClick={onNavigateAnalyticsSurfaces} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><LineChart className="h-4 w-4" />Analytics surfaces</button></li>}
                    <li><button onClick={onNavigateFinhub} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><LineChart className="h-4 w-4" />Finhub</button></li>
                    <li><button onClick={onNavigateBlogs} className="inline-flex items-center gap-2 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"><BookOpen className="h-4 w-4" />Notes</button></li>
                </ul>
            </div>

            <div className="flex flex-col items-start gap-3">
                <h2 className={`text-xs font-bold uppercase tracking-[0.16em] ${theme === 'dark' ? 'text-zinc-100' : 'text-slate-950'}`}>Contact</h2>
                <p className="text-sm leading-6">Questions or feedback about a lesson or tool?</p>
                <a href="mailto:aliyan@gptx.vip" className={`inline-flex items-center gap-2 text-sm font-semibold hover:text-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-800'}`}>
                    <Mail className="h-4 w-4" /> aliyan@gptx.vip <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
            </div>
        </div>
        <div className={`border-t px-5 py-4 text-xs sm:px-8 ${theme === 'dark' ? 'border-zinc-800 text-zinc-500' : 'border-slate-900/10 text-slate-500'}`}>
            <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span>© {new Date().getFullYear()} GPTX.VIP</span>
                <span>Code Concepts · Agent Labs · Finhub · Notes</span>
            </div>
        </div>
    </footer>
);

export default Footer;
