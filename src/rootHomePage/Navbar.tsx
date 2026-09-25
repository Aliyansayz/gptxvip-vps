import React, { useState } from 'react';
import { ArrowRight, Menu, Sparkles, X } from 'lucide-react';

interface NavbarProps {
    onNavigateFinhub: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateBlogs: () => void;
    onBookDemo?: () => void;
}

/** Shared V2 shell for pages that need the root navigation outside RootHomePage. */
export const Navbar: React.FC<NavbarProps> = ({ onNavigateFinhub, onNavigateDevLush, onNavigateAgents, onNavigateBlogs, onBookDemo }) => {
    const [open, setOpen] = useState(false);
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigate = (action: () => void) => {
        setOpen(false);
        action();
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f7f8f5]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                <button onClick={() => window.location.assign('/')} className="flex items-center gap-3 text-left" aria-label="GPTX.VIP home">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-cyan-300"><Sparkles className="h-4 w-4" /></span>
                    <span className="font-display text-lg font-black tracking-tight">GPTX<span className="text-cyan-600">.VIP</span></span>
                </button>
                <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Primary navigation">
                    <button onClick={navigateAgents} className="hover:text-slate-950">Agent Labs</button>
                    <button onClick={onNavigateFinhub} className="hover:text-slate-950">Finhub</button>
                    <button onClick={onNavigateBlogs} className="hover:text-slate-950">Notes</button>
                </nav>
                <div className="flex items-center gap-2">
                    {onBookDemo && <button onClick={onBookDemo} className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white sm:inline-flex">Start a conversation <ArrowRight className="h-3.5 w-3.5" /></button>}
                    <button onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900/10 bg-white text-slate-700 md:hidden" aria-expanded={open} aria-label={open ? 'Close navigation' : 'Open navigation'}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
                </div>
            </div>
            {open && <nav className="border-t border-slate-900/10 bg-white px-5 py-3 md:hidden" aria-label="Mobile navigation"><div className="mx-auto flex max-w-6xl flex-col gap-1"><button onClick={() => navigate(navigateAgents)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Agent Labs</button><button onClick={() => navigate(onNavigateFinhub)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Finhub</button><button onClick={() => navigate(onNavigateBlogs)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Notes</button></div></nav>}
        </header>
    );
};

export default Navbar;
