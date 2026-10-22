import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { Logo } from '../shared/components/Logo';

interface NavbarProps {
    onNavigateFinhub: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateAgentWorkspace?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateSoftware?: () => void;
    onNavigateBlogs: () => void;
    onBookDemo?: () => void;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    /**
     * `default` is the light pill used by the Agent catalog root.
     * `glass` is the frosted treatment the landing page sits inside its
     * aurora. Both variants must stay legible against their own ground.
     */
    variant?: 'default' | 'glass';
}

/**
 * Shared V2 shell for pages that need the root navigation outside RootHomePage.
 */
export const Navbar: React.FC<NavbarProps> = ({
    onNavigateFinhub,
    onNavigateCodeConcepts,
    onNavigateDevLush,
    onNavigateAgents,
    onNavigateAgentWorkspace,
    onNavigateProjectSurfaces,
    onNavigateSoftware,
    onNavigateBlogs,
    onBookDemo,
    onSearch,
    searchPlaceholder = 'Search',
    variant = 'default',
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigateCodeConcepts = onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'));
    const navigateAgentWorkspace = onNavigateAgentWorkspace || (() => {
        if ((window as any).smartNavigate) {
            (window as any).smartNavigate('/workspace');
        } else {
            window.location.assign('/workspace');
        }
    });
    const pathname = window.location.pathname;
    const isAgentWorkspace = pathname.startsWith('/workspace') || pathname.startsWith('/agent-workspace');
    const currentArea = pathname.startsWith('/agents/templates')
        ? 'Project surfaces'
        : isAgentWorkspace
        ? 'Agent Workspace'
        : pathname.startsWith('/agents')
        ? 'Agent catalog'
        : pathname.startsWith('/contact')
        ? 'Contact'
        : pathname.startsWith('/finhub')
        ? 'Finhub'
        : pathname.startsWith('/code_concepts')
        ? 'Code Concepts'
        : pathname.startsWith('/blogs')
        ? 'Notes'
        : 'Home';

    const glass = variant === 'glass';

    const skin = glass
        ? {
            header: 'border-transparent bg-transparent',
            markTile: 'bg-ink text-accent-400',
            wordmark: 'text-slate-950',
            wordmarkAccent: 'accent-text-gradient-ink',
            pill: 'glass-panel-light text-slate-700',
            navIdle: 'text-slate-600 hover:bg-white/60 hover:text-ink',
            navActive: 'bg-white/70 text-ink',
            ring: 'focus-visible:ring-accent-600',
            cta: 'bg-ink text-white hover:bg-ink/85',
            search: 'border-ink/10 bg-white/80 text-slate-700 placeholder:text-slate-400 focus:border-accent-300 focus:ring-accent-100',
            menu: 'border-ink/10 bg-paper/95 backdrop-blur-2xl',
            menuLink: 'text-slate-700 hover:bg-ink/5 hover:text-ink',
            trigger: 'glass-panel-light text-slate-700',
        }
        : {
            header: 'border-slate-900/10 bg-[#f7f8f5]/95 backdrop-blur-xl',
            markTile: 'bg-slate-950 text-cyan-300',
            wordmark: '',
            wordmarkAccent: 'text-cyan-600',
            pill: 'border-slate-900/10 bg-white/80 text-slate-600',
            navIdle: 'text-slate-600 hover:bg-white hover:text-slate-950',
            navActive: 'bg-cyan-50 text-cyan-900',
            ring: 'focus-visible:ring-cyan-500',
            cta: 'bg-slate-950 text-white hover:bg-slate-800',
            search: 'border-slate-900/10 bg-white text-slate-700 placeholder:text-slate-400 focus:border-cyan-300 focus:ring-cyan-100',
            menu: 'border-slate-900/10 bg-white',
            menuLink: 'text-slate-700 hover:bg-slate-50',
            trigger: 'border-slate-900/10 bg-white text-slate-700',
        };

    const navClass = (selected: boolean) => `rounded-lg px-2 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${selected ? skin.navActive : skin.navIdle}`;
    const menuLinkClass = `rounded-xl px-3 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${skin.menuLink} ${skin.ring}`;
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
        <header className={`sticky top-0 z-40 border-b ${skin.header}`}>
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <button type="button" onClick={() => window.location.assign('/')} className={`flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`} aria-label="GPTX.VIP home">
                    <Logo size="md" variant="default" />
                </button>
                <span className={`max-w-24 truncate rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide sm:max-w-none ${skin.pill}`} aria-label={`Current area: ${currentArea}`}>{currentArea}</span>
                <nav className={`hidden items-center gap-1 text-sm font-semibold xl:flex ${glass ? 'text-slate-600' : 'text-slate-600'}`} aria-label="Primary navigation">
                    <button type="button" onClick={navigateAgentWorkspace} aria-current={currentArea === 'Agent Workspace' ? 'page' : undefined} className={navClass(currentArea === 'Agent Workspace')}>Agent Workspace</button>
                    <button type="button" onClick={navigateAgents} aria-current={currentArea === 'Agent catalog' ? 'page' : undefined} className={navClass(currentArea === 'Agent catalog')}>Agent catalog</button>
                    {onNavigateProjectSurfaces && <button type="button" onClick={onNavigateProjectSurfaces} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className={navClass(currentArea === 'Project surfaces')}>Project surfaces</button>}
                    {onNavigateSoftware && <button type="button" onClick={onNavigateSoftware} className={navClass(false)}>Software</button>}
                    <button type="button" onClick={onNavigateFinhub} aria-current={currentArea === 'Finhub' ? 'page' : undefined} className={navClass(currentArea === 'Finhub')}>Finhub</button>
                    <button type="button" onClick={navigateCodeConcepts} aria-current={currentArea === 'Code Concepts' ? 'page' : undefined} className={navClass(currentArea === 'Code Concepts')}>Code Concepts</button>
                    <button type="button" onClick={onNavigateBlogs} aria-current={currentArea === 'Notes' ? 'page' : undefined} className={navClass(currentArea === 'Notes')}>Notes</button>
                </nav>
                <div className="flex items-center gap-2">
                    {onSearch && <form onSubmit={submitSearch} role="search" className="hidden lg:block"><label className="sr-only" htmlFor="root-site-search">Search project surfaces</label><input id="root-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className={`h-9 w-44 rounded border px-4 text-sm outline-none xl:w-52 ${skin.search} ${skin.ring}`} /></form>}
                    {onBookDemo && <button type="button" onClick={onBookDemo} aria-current={currentArea === 'Contact' ? 'page' : undefined} className={`group hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 motion-reduce:transform-none xl:inline-flex ${skin.cta} ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`}>Start a conversation <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" /></button>}
                    <button ref={mobileTriggerRef} type="button" onClick={() => setOpen((value) => !value)} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 xl:hidden ${skin.trigger} ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`} aria-expanded={open} aria-controls="root-mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                </div>
            </div>
            {open && <nav id="root-mobile-navigation" className={`border-t px-5 py-3 backdrop-blur-2xl xl:hidden ${skin.menu}`} aria-label="Mobile navigation"><div className="mx-auto flex max-w-6xl flex-col gap-1">
                {onSearch && <form onSubmit={submitSearch} role="search" className="mb-2"><label className="sr-only" htmlFor="root-mobile-site-search">Search project surfaces</label><input id="root-mobile-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className={`h-11 w-full rounded border px-4 text-sm outline-none ${skin.search} ${skin.ring}`} /></form>}
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Explore</p>
                <button type="button" onClick={() => navigate(navigateAgentWorkspace)} aria-current={currentArea === 'Agent Workspace' ? 'page' : undefined} className={menuLinkClass}>Agent Workspace</button>
                <button type="button" onClick={() => navigate(navigateAgents)} aria-current={currentArea === 'Agent catalog' ? 'page' : undefined} className={menuLinkClass}>Agent catalog</button>
                {onNavigateProjectSurfaces && <button type="button" onClick={() => navigate(onNavigateProjectSurfaces)} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className={menuLinkClass}>Project surfaces</button>}
                <button type="button" onClick={() => navigate(onNavigateFinhub)} className={menuLinkClass}>Finhub</button>
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Learn and read</p>
                {onNavigateSoftware && <button type="button" onClick={() => navigate(onNavigateSoftware)} className={menuLinkClass}>Software</button>}
                <button type="button" onClick={() => navigate(navigateCodeConcepts)} className={menuLinkClass}>Code Concepts</button>
                <button type="button" onClick={() => navigate(onNavigateBlogs)} className={menuLinkClass}>Notes</button>
                {onBookDemo && <button type="button" onClick={() => navigate(onBookDemo)} aria-current={currentArea === 'Contact' ? 'page' : undefined} className={menuLinkClass}>Contact</button>}
            </div></nav>}
        </header>
    );
};

export default Navbar;
