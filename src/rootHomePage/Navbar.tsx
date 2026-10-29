import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, Code2, FlaskConical, Layers, LineChart, Menu, Sparkles, X } from 'lucide-react';
import { Logo } from '../shared/components/Logo';

interface NavbarProps {
    onNavigateFinhub?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateAgentWorkspace?: () => void;
    onNavigateUseCases?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateGuide?: () => void;
    onNavigateSoftware?: () => void;
    onNavigateBlogs?: () => void;
    onBookDemo?: () => void;
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    /**
     * `default` is the light pill used by the Agent catalog root.
     * `glass` is the frosted treatment the landing page sits inside its
     * aurora. Both variants must stay legible against their own ground.
     */
    variant?: 'default' | 'glass';
    /**
     * Whether to show the subnavbar row of prototypes directly under the main bar.
     */
    showPrototypesSubnav?: boolean;
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
    onNavigateUseCases,
    onNavigateProjectSurfaces,
    onNavigateGuide,
    onNavigateSoftware,
    onNavigateBlogs,
    onBookDemo,
    onSearch,
    searchPlaceholder = 'Search',
    variant = 'default',
    showPrototypesSubnav = false,
}) => {
    const [open, setOpen] = useState(false);
    const [resourcesOpen, setResourcesOpen] = useState(false);
    const [prototypesOpen, setPrototypesOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const mobileTriggerRef = useRef<HTMLButtonElement>(null);
    const resourcesRef = useRef<HTMLDivElement>(null);
    const prototypesRef = useRef<HTMLDivElement>(null);

    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigateGuide = onNavigateGuide || onNavigateSoftware || (() => window.location.assign('/guide'));
    const navigateAgentWorkspace = onNavigateAgentWorkspace || (() => {
        if ((window as any).smartNavigate) {
            (window as any).smartNavigate('/workspace');
        } else {
            window.location.assign('/workspace');
        }
    });
    const navigateUseCases = onNavigateUseCases || (() => {
        if ((window as any).smartNavigate) {
            (window as any).smartNavigate('/resources/usecases');
        } else {
            window.location.assign('/resources/usecases');
        }
    });
    const navigateFinhub = onNavigateFinhub || (() => window.location.assign('/finhub'));
    const navigateCodeConcepts = onNavigateCodeConcepts || (() => window.location.assign('/code_concepts/general'));

    const pathname = window.location.pathname;
    const isAgentWorkspace = pathname.startsWith('/workspace') || pathname.startsWith('/agent-workspace');
    const isUseCases = pathname.startsWith('/resources') || pathname.startsWith('/usecases') || pathname.startsWith('/case-studies');
    const isGuide = pathname.startsWith('/guide') || pathname.startsWith('/software_manual') || pathname.startsWith('/software-manual') || pathname.startsWith('/software');
    const currentArea = pathname.startsWith('/agents/templates')
        ? 'Project surfaces'
        : isAgentWorkspace
        ? 'Agent Workspace'
        : isUseCases
        ? 'Use Cases'
        : isGuide
        ? 'Guide'
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

    const isResourcesActive = currentArea === 'Use Cases' || currentArea === 'Guide' || currentArea === 'Agent catalog';
    const isPrototypesActive = currentArea === 'Finhub' || currentArea === 'Code Concepts';
    const glass = variant === 'glass';

    const prototypeItems = [
        {
            id: 'remove-watermark',
            label: 'Remove Watermark',
            hint: 'remove.gptx.vip',
            icon: Sparkles,
            href: 'https://remove.gptx.vip',
            isExternal: true,
            action: () => window.open('https://remove.gptx.vip', '_blank', 'noopener,noreferrer'),
        },
        {
            id: 'finhub',
            label: 'Finhub',
            hint: 'Financial analytics',
            icon: LineChart,
            prefix: '/finhub',
            isExternal: false,
            action: navigateFinhub,
        },
        {
            id: 'code-concepts',
            label: 'Code Concepts',
            hint: 'Guided walkthroughs',
            icon: Code2,
            prefix: '/code_concepts',
            isExternal: false,
            action: navigateCodeConcepts,
        },
        {
            id: 'agent-labs',
            label: 'Agent Labs',
            hint: 'Run an agent topic',
            icon: FlaskConical,
            prefix: '/agents/lab',
            isExternal: false,
            action: () => window.location.assign('/agents/lab'),
        },
        {
            id: 'usecases',
            label: 'Case Studies',
            hint: 'Enterprise sandboxes',
            icon: Layers,
            prefix: '/resources/usecases',
            isExternal: false,
            action: navigateUseCases,
        },
    ];

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

    useEffect(() => {
        if (!resourcesOpen && !prototypesOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
                setResourcesOpen(false);
            }
            if (prototypesRef.current && !prototypesRef.current.contains(event.target as Node)) {
                setPrototypesOpen(false);
            }
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setResourcesOpen(false);
            setPrototypesOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [resourcesOpen, prototypesOpen]);

    return (
        <header className={`sticky top-0 z-40 border-b ${skin.header}`}>
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <button type="button" onClick={() => window.location.assign('/')} className={`flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`} aria-label="GPTX.VIP home">
                    <Logo size="md" variant="default" />
                </button>
                <span className={`max-w-24 truncate rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide sm:max-w-none ${skin.pill}`} aria-label={`Current area: ${currentArea}`}>{currentArea}</span>
                <nav className={`hidden items-center gap-1 text-sm font-semibold xl:flex ${glass ? 'text-slate-600' : 'text-slate-600'}`} aria-label="Primary navigation">
                    <button type="button" onClick={navigateAgentWorkspace} aria-current={currentArea === 'Agent Workspace' ? 'page' : undefined} className={navClass(currentArea === 'Agent Workspace')}>Agent Workspace</button>
                    
                    {/* Resources Dropdown */}
                    <div className="relative" ref={resourcesRef}>
                        <button
                            type="button"
                            onClick={() => { setResourcesOpen((prev) => !prev); setPrototypesOpen(false); }}
                            aria-expanded={resourcesOpen}
                            aria-haspopup="true"
                            aria-current={isResourcesActive ? 'page' : undefined}
                            className={`inline-flex items-center gap-1 ${navClass(isResourcesActive || resourcesOpen)}`}
                        >
                            <span>Resources</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${resourcesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {resourcesOpen && (
                            <div
                                role="menu"
                                aria-label="Resources"
                                className={`absolute left-0 mt-2 w-48 rounded-xl border p-1.5 shadow-xl backdrop-blur-2xl z-50 ${glass ? 'border-ink/10 bg-paper/95 text-slate-800 shadow-slate-900/10' : 'border-slate-900/10 bg-white text-slate-800 shadow-slate-900/10'}`}
                            >
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => { setResourcesOpen(false); navigateUseCases(); }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${currentArea === 'Use Cases' ? (glass ? 'bg-ink/10 text-ink' : 'bg-cyan-50 text-cyan-900') : 'hover:bg-slate-100 text-slate-700 hover:text-slate-950'}`}
                                >
                                    <span>Use Cases</span>
                                    {currentArea === 'Use Cases' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />}
                                </button>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => { setResourcesOpen(false); navigateGuide(); }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${currentArea === 'Guide' ? (glass ? 'bg-ink/10 text-ink' : 'bg-cyan-50 text-cyan-900') : 'hover:bg-slate-100 text-slate-700 hover:text-slate-950'}`}
                                >
                                    <span>Guide</span>
                                    {currentArea === 'Guide' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />}
                                </button>
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={() => { setResourcesOpen(false); navigateAgents(); }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${currentArea === 'Agent catalog' ? (glass ? 'bg-ink/10 text-ink' : 'bg-cyan-50 text-cyan-900') : 'hover:bg-slate-100 text-slate-700 hover:text-slate-950'}`}
                                >
                                    <span>Agent Catalog</span>
                                    {currentArea === 'Agent catalog' && <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Prototypes Dropdown */}
                    <div className="relative" ref={prototypesRef}>
                        <button
                            type="button"
                            onClick={() => { setPrototypesOpen((prev) => !prev); setResourcesOpen(false); }}
                            aria-expanded={prototypesOpen}
                            aria-haspopup="true"
                            aria-current={isPrototypesActive ? 'page' : undefined}
                            className={`inline-flex items-center gap-1 ${navClass(isPrototypesActive || prototypesOpen)}`}
                        >
                            <span>Prototypes</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${prototypesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {prototypesOpen && (
                            <div
                                role="menu"
                                aria-label="Prototypes"
                                className={`absolute left-0 mt-2 w-56 rounded-xl border p-1.5 shadow-xl backdrop-blur-2xl z-50 ${glass ? 'border-ink/10 bg-paper/95 text-slate-800 shadow-slate-900/10' : 'border-slate-900/10 bg-white text-slate-800 shadow-slate-900/10'}`}
                            >
                                {prototypeItems.map((proto) => {
                                    const ProtoIcon = proto.icon;
                                    if (proto.isExternal) {
                                        return (
                                            <a
                                                key={proto.id}
                                                href={proto.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                role="menuitem"
                                                onClick={() => setPrototypesOpen(false)}
                                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors hover:bg-slate-100 text-slate-700 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <ProtoIcon className="h-4 w-4 text-accent-600" />
                                                    <span>{proto.label}</span>
                                                </span>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                                            </a>
                                        );
                                    }
                                    const isSelected = proto.prefix ? pathname.startsWith(proto.prefix) : false;
                                    return (
                                        <button
                                            key={proto.id}
                                            type="button"
                                            role="menuitem"
                                            onClick={() => { setPrototypesOpen(false); proto.action(); }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 ${isSelected ? (glass ? 'bg-ink/10 text-ink' : 'bg-cyan-50 text-cyan-900') : 'hover:bg-slate-100 text-slate-700 hover:text-slate-950'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <ProtoIcon className="h-4 w-4 text-accent-600" />
                                                <span>{proto.label}</span>
                                            </span>
                                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-600" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {onNavigateProjectSurfaces && <button type="button" onClick={onNavigateProjectSurfaces} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className={navClass(currentArea === 'Project surfaces')}>Project surfaces</button>}
                </nav>
                <div className="flex items-center gap-2">
                    {onSearch && <form onSubmit={submitSearch} role="search" className="hidden lg:block"><label className="sr-only" htmlFor="root-site-search">Search project surfaces</label><input id="root-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className={`h-9 w-44 rounded border px-4 text-sm outline-none xl:w-52 ${skin.search} ${skin.ring}`} /></form>}
                    {onBookDemo && <button type="button" onClick={onBookDemo} aria-current={currentArea === 'Contact' ? 'page' : undefined} className={`group hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-[transform,background-color] duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 motion-reduce:transform-none xl:inline-flex ${skin.cta} ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`}>Start a conversation <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" /></button>}
                    <button ref={mobileTriggerRef} type="button" onClick={() => setOpen((value) => !value)} className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-none focus-visible:ring-2 xl:hidden ${skin.trigger} ${skin.ring} ${glass ? 'focus-visible:ring-offset-0' : 'focus-visible:ring-offset-2'}`} aria-expanded={open} aria-controls="root-mobile-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                </div>
            </div>

            {/* Subnavbar of prototypes */}
            {showPrototypesSubnav && (
                <nav aria-label="Inbuilt prototypes" className={`border-t ${glass ? 'border-ink/10 bg-white/75 backdrop-blur-xl' : 'border-slate-900/10 bg-white/95 backdrop-blur-xl'}`}>
                    <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto no-scrollbar px-5 py-2 sm:px-8 sm:gap-4">
                        <p className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            <Layers className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
                            <span className="whitespace-nowrap">Prototypes</span>
                        </p>
                        <ul className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            {prototypeItems.map((proto) => {
                                const ProtoIcon = proto.icon;
                                if (proto.isExternal) {
                                    return (
                                        <li key={proto.id} className="shrink-0">
                                            <a
                                                href={proto.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex min-h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${skin.ring} text-slate-600 hover:bg-white/80 hover:text-ink sm:px-3.5`}
                                            >
                                                <ProtoIcon className="h-3.5 w-3.5 shrink-0 text-accent-600" aria-hidden="true" />
                                                <span className="truncate">{proto.label}</span>
                                                <span className="hidden text-[11px] font-medium text-slate-400 lg:inline">{proto.hint}</span>
                                                <ArrowUpRight className="h-3 w-3 opacity-60 ml-0.5 shrink-0" aria-hidden="true" />
                                            </a>
                                        </li>
                                    );
                                }
                                const isSelected = proto.prefix ? pathname.startsWith(proto.prefix) : false;
                                return (
                                    <li key={proto.id} className="shrink-0">
                                        <button
                                            type="button"
                                            onClick={proto.action}
                                            aria-current={isSelected ? 'page' : undefined}
                                            className={`flex min-h-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ${skin.ring} sm:px-3.5 ${
                                                isSelected ? 'bg-white text-ink shadow-xs font-bold' : 'text-slate-600 hover:bg-white/80 hover:text-ink'
                                            }`}
                                        >
                                            <ProtoIcon className="h-3.5 w-3.5 shrink-0 text-accent-600" aria-hidden="true" />
                                            <span className="truncate">{proto.label}</span>
                                            <span className="hidden text-[11px] font-medium text-slate-400 lg:inline">{proto.hint}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            )}

            {open && <nav id="root-mobile-navigation" className={`border-t px-5 py-3 backdrop-blur-2xl xl:hidden ${skin.menu}`} aria-label="Mobile navigation"><div className="mx-auto flex max-w-6xl flex-col gap-1">
                {onSearch && <form onSubmit={submitSearch} role="search" className="mb-2"><label className="sr-only" htmlFor="root-mobile-site-search">Search project surfaces</label><input id="root-mobile-site-search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={searchPlaceholder} className={`h-11 w-full rounded border px-4 text-sm outline-none ${skin.search} ${skin.ring}`} /></form>}
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Explore</p>
                <button type="button" onClick={() => navigate(navigateAgentWorkspace)} aria-current={currentArea === 'Agent Workspace' ? 'page' : undefined} className={menuLinkClass}>Agent Workspace</button>
                {onNavigateProjectSurfaces && <button type="button" onClick={() => navigate(onNavigateProjectSurfaces)} aria-current={currentArea === 'Project surfaces' ? 'page' : undefined} className={menuLinkClass}>Project surfaces</button>}
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Resources</p>
                <button type="button" onClick={() => navigate(navigateUseCases)} aria-current={currentArea === 'Use Cases' ? 'page' : undefined} className={menuLinkClass}>Use Cases</button>
                <button type="button" onClick={() => navigate(navigateGuide)} aria-current={currentArea === 'Guide' ? 'page' : undefined} className={menuLinkClass}>Guide</button>
                <button type="button" onClick={() => navigate(navigateAgents)} aria-current={currentArea === 'Agent catalog' ? 'page' : undefined} className={menuLinkClass}>Agent Catalog</button>
                <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Prototypes</p>
                {prototypeItems.map((proto) => {
                    const ProtoIcon = proto.icon;
                    if (proto.isExternal) {
                        return (
                            <a
                                key={proto.id}
                                href={proto.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={menuLinkClass}
                            >
                                <span className="flex items-center justify-between w-full">
                                    <span className="flex items-center gap-2">
                                        <ProtoIcon className="h-4 w-4 text-accent-600" />
                                        <span>{proto.label}</span>
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                                </span>
                            </a>
                        );
                    }
                    return (
                        <button
                            key={proto.id}
                            type="button"
                            onClick={() => navigate(proto.action)}
                            className={menuLinkClass}
                        >
                            <span className="flex items-center gap-2">
                                <ProtoIcon className="h-4 w-4 text-accent-600" />
                                <span>{proto.label}</span>
                            </span>
                        </button>
                    );
                })}
                {onBookDemo && <button type="button" onClick={() => navigate(onBookDemo)} aria-current={currentArea === 'Contact' ? 'page' : undefined} className={menuLinkClass}>Contact</button>}
            </div></nav>}
        </header>
    );
};

export default Navbar;
