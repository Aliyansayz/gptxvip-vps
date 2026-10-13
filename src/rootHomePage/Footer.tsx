import React from 'react';
import { ArrowUpRight, BookOpen, Code2, LineChart, Mail } from 'lucide-react';
import { ContactForm } from '../shared/components/ContactForm';
import { Logo } from '../shared/components/Logo';

interface FooterProps {
    onNavigateFinhub: () => void;
    onNavigateDevLush: () => void;
    onNavigateBlogs: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateProjectSurfaces?: () => void;
    onNavigateAnalyticsSurfaces?: () => void;
    theme?: 'light' | 'dark';
    /**
     * `warm` matches the landing page's orange-red accent ramp.
     * Defaults to `cyan` so the Agent catalog root keeps its existing palette.
     */
    accent?: 'cyan' | 'warm';
}

export const Footer: React.FC<FooterProps> = ({
    onNavigateFinhub,
    onNavigateDevLush,
    onNavigateBlogs,
    onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
    onNavigateProjectSurfaces,
    onNavigateAnalyticsSurfaces,
    theme = 'light',
    accent = 'cyan',
}) => {
    const warm = accent === 'warm';
    const skin = warm
        ? {
            shell: 'border-ink/10 bg-white/70 text-slate-600',
            markTile: 'bg-ink text-accent-400',
            wordmarkAccent: 'accent-text-gradient-ink',
            heading: 'text-slate-950',
            link: 'hover:text-accent-700 focus-visible:ring-accent-600',
            homeLink: 'focus-visible:ring-accent-600',
            mail: 'text-accent-700 hover:text-accent-800 focus-visible:ring-accent-600',
            rule: 'border-ink/10 text-slate-500',
        }
        : {
            shell: 'border-slate-900/10 bg-white/70 text-slate-600',
            markTile: 'bg-slate-950 text-cyan-300',
            wordmarkAccent: 'text-cyan-600',
            heading: 'text-slate-950',
            link: 'hover:text-cyan-700 focus-visible:ring-cyan-500',
            homeLink: 'focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
            mail: 'text-cyan-800 hover:text-cyan-600 focus-visible:ring-cyan-500',
            rule: 'border-slate-900/10 text-slate-500',
        };

    const dark = theme === 'dark';

    const linkClass = `inline-flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 ${skin.link}`;

    return (
        <footer className={`border-t ${dark ? 'border-zinc-800 bg-zinc-950/90 text-zinc-300' : skin.shell}`}>
            <div className="mx-auto grid max-w-6xl gap-9 px-5 py-10 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr] md:py-12">
                <div>
                    <a href="/" className={`inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 ${skin.homeLink}`} aria-label="GPTX.VIP home">
                        <Logo size="md" variant="default" />
                    </a>
                    <p className="mt-4 max-w-sm text-sm leading-6">
                        Interactive lessons, agent labs, and finance tools for exploring code, systems, and trading ideas.
                    </p>
                </div>

                <div>
                    <h2 className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? 'text-zinc-100' : skin.heading}`}>Explore</h2>
                    <ul className="mt-4 space-y-3 text-sm">
                        <li><button onClick={onNavigateCodeConcepts} className={linkClass}><Code2 className="h-4 w-4" />Code Concepts</button></li>
                        <li><button onClick={onNavigateDevLush} className={linkClass}><Logo size="sm" variant="icon-only" className="mr-2" />Agent Labs</button></li>
                        {onNavigateProjectSurfaces && <li><button onClick={onNavigateProjectSurfaces} className={linkClass}>Project surfaces</button></li>}
                        {onNavigateAnalyticsSurfaces && <li><button onClick={onNavigateAnalyticsSurfaces} className={linkClass}><LineChart className="h-4 w-4" />Analytics surfaces</button></li>}
                        <li><button onClick={onNavigateFinhub} className={linkClass}><LineChart className="h-4 w-4" />Finhub</button></li>
                        <li><button onClick={onNavigateBlogs} className={linkClass}><BookOpen className="h-4 w-4" />Notes</button></li>
                    </ul>
                </div>

                <div className="flex flex-col items-start gap-3">
                    <h2 className={`text-xs font-bold uppercase tracking-[0.16em] ${dark ? 'text-zinc-100' : skin.heading}`}>Contact</h2>
                    <p className="text-sm leading-6">Questions or feedback about a lesson or tool?</p>
                    <ContactForm
                      variant="compact"
                      title="Send us a message"
                      description="We'll get back to you within 24 hours."
                      subject="Contact from GPTX.VIP Footer"
                    />
                </div>
            </div>
            <div className={`border-t px-5 py-4 text-xs sm:px-8 ${dark ? 'border-zinc-800 text-zinc-500' : skin.rule}`}>
                <div className="mx-auto flex max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {new Date().getFullYear()} GPTX.VIP</span>
                    <span>Code Concepts · Agent Labs · Finhub · Notes</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;