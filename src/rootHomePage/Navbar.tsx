import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';

interface NavbarProps {
    onNavigateFinhub: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateBlogs: () => void;
    onBookDemo?: () => void;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
}

/** Shared V2 shell for pages that need the root navigation outside RootHomePage. */
export const Navbar: React.FC<NavbarProps> = ({ onNavigateFinhub, onNavigateCodeConcepts, onNavigateDevLush, onNavigateAgents, onNavigateProjectSurfaces, onNavigateBlogs, onBookDemo, onSearch, searchPlaceholder = 'Search' }) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigateCodeConcepts = onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'));
    const pathname = window.location.pathname;
    const currentArea = pathname.startsWith('/agents/templates') ? 'Project surfaces' : pathname.startsWith('/agents') ? 'Agent catalog' : pathname.startsWith('/finhub') ? 'Finhub' : pathname.startsWith('/code_concepts') ? 'Code Concepts' : pathname.startsWith('/blogs') ? 'Notes' : 'Home';
    const navClass = (selected: boolean) => `rounded-lg px-2 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${selected ? 'bg-cyan-50 text-cyan-900' : 'text-slate-600 hover:bg-white hover:text-slate-950'}`;
    const navigate = (action: () => void) => {
        setOpen(false);
        action();
    };

    const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!onSearch) return;
        onSearch(searchQuery.trim());
        setOpen(false);
    };

    useEffect(() => {
        if (!open) return;
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setOpen(false);
            mobileTriggerRef.current?.focus();
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f7f8f5]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <button type="button" onClick={() => window.location.assign('/')} className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2" aria-label="GPTX.VIP home">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-cyan-300"><Sparkles className="h-4 w-4" /></span>
                    <span className="font-display text-lg font-black tracking-tight">GPTX<span className="text-cyan-600">.VIP</span></span>
                </button>
                <span className="max-w-24 truncate rounded-full border border-slate-900/10 bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-600 sm:max-w-none" aria-label={`Current area: ${currentArea}`}>{currentArea}</span>
                <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-600 xl:flex" aria-label="Primary navigation">
                    <button type="button" onClick={navigateAgents} aria-current={currentArea === 'Agent catalog' ? 'page' : undefined} className={navClass(currentArea === 'Agent catalog')}>Agent catalog</button>
                    {onNavigateProjectSurfaces && <button type="button" onClick={onNavigateProjectSurfaces} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className={navClass(currentArea === 'Project surfaces')}>Project surfaces</button>}
                    <button type="button" onClick={onNavigateFinhub} aria-current={currentArea === 'Finhub' ? 'page' : undefined} className={navClass(currentArea === 'Finhub')}>Finhub</button>
                    <button type="button" onClick={navigateCodeConcepts} aria-current={currentArea === 'Code Concepts' ? 'page' : undefined} className={navClass(currentArea === 'Code Concepts')}>Code Concepts</button>
                    <button type="button" onClick={onNavigateBlogs} aria-current={currentArea === 'Notes' ? 'page' : undefined} className={navClass(currentArea === 'Notes')}>Notes</button>
                </nav>
                <div className="flex items-center gap-2">
                    {onSearch && <form onSubmit={submitSearch} role="search" className="hidden lg:block"><label className="sr-only" htmlFor="root-site-search">Search project surfaces</label><input id="root-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className="h-9 w-44 rounded-full border border-slate-900/10 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100 xl:w-52" /></form>}
                    {onBookDemo && <button type="button" onClick={onBookDemo} className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 xl:inline-flex">Start a conversation <ArrowRight className="h-3.5 w-3.5" /></button>}
                    <button ref={mobileTriggerRef} type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900/10 bg-white text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 xl:hidden" aria-expanded={open} aria-controls="root-mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                </div>
            </div>
            {open && <nav id="root-mobile-navigation" className="border-t border-slate-900/10 bg-white px-5 py-3 xl:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-6xl flex-col gap-1">
                {onSearch && <form onSubmit={submitSearch} role="search" className="mb-2"><label className="sr-only" htmlFor="root-mobile-site-search">Search project surfaces</label><input id="root-mobile-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className="h-11 w-full rounded-xl border border-slate-900/10 bg-white px-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-100" /></form>}
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Explore</p>
                <button type="button" onClick={() => navigate(navigateAgents)} aria-current={currentArea === 'Agent catalog' ? 'page' : undefined} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Agent catalog</button>
                {onNavigateProjectSurfaces && <button type="button" onClick={() => navigate(onNavigateProjectSurfaces)} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Project surfaces</button>}
                <button type="button" onClick={() => navigate(onNavigateFinhub)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Finhub</button>
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Learn and read</p>
                <button type="button" onClick={() => navigate(navigateCodeConcepts)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Code Concepts</button>
                <button type="button" onClick={() => navigate(onNavigateBlogs)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Notes</button>
                {onBookDemo && <button type="button" onClick={() => navigate(onBookDemo)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">Contact</button>}
            </div></nav>}
        </header>
    );
};

export default Navbar;
