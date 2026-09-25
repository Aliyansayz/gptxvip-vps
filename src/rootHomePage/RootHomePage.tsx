import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowRight,
    BookOpen,
    Bot,
    Check,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    LineChart,
    Menu,
    Network,
    ShieldCheck,
    Sparkles,
    X,
} from 'lucide-react';
import { agentLabTopics } from '../devLushArea/agentLabsData';

export interface RootHomePageProps {
    onNavigateFinhub?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateBlogs?: () => void;
}

type Tone = 'cyan' | 'emerald' | 'violet';

const slides: Array<{
    eyebrow: string;
    title: string;
    body: string;
    label: string;
    detail: string;
    tone: Tone;
}> = [
    {
        eyebrow: 'Agent Labs',
        title: 'Understand the mechanism before you scale it.',
        body: 'Explore agent architecture, memory, orchestration, and evaluation through focused interactive topics.',
        label: 'Topic-led learning',
        detail: 'Architecture → memory → action',
        tone: 'cyan',
    },
    {
        eyebrow: 'Finhub',
        title: 'Turn difficult systems into visible decisions.',
        body: 'Use interactive technical workspaces to inspect market structure, models, and the assumptions behind a result.',
        label: 'Interactive workspaces',
        detail: 'Model → inspect → refine',
        tone: 'emerald',
    },
    {
        eyebrow: 'GPTX.VIP',
        title: 'Leave every experiment with a clearer next move.',
        body: 'GPTX.VIP keeps the surface area small so the useful signal stays close to the question you came to answer.',
        label: 'Signal-first by design',
        detail: 'Question → evidence → next step',
        tone: 'violet',
    },
];

const intentBlocks: Array<{ icon: React.ElementType; title: string; body: string; action: string; tone: Tone }> = [
    {
        icon: FlaskConical,
        title: 'Learn the mechanism',
        body: 'Start with agent types, memory, orchestration, and evaluation patterns that make a system understandable.',
        action: 'Explore Agent Labs',
        tone: 'cyan',
    },
    {
        icon: LineChart,
        title: 'Run the scenario',
        body: 'Move from an idea to an observable result with a focused technical workspace and a real interaction loop.',
        action: 'Enter Finhub',
        tone: 'emerald',
    },
    {
        icon: Network,
        title: 'Inspect the system',
        body: 'Read the assumptions, compare the output, and keep the evidence that helps you decide what to do next.',
        action: 'Read the notes',
        tone: 'violet',
    },
];

const toneStyles: Record<Tone, { soft: string; text: string; border: string; solid: string }> = {
    cyan: { soft: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', solid: 'bg-cyan-500' },
    emerald: { soft: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', solid: 'bg-emerald-500' },
    violet: { soft: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', solid: 'bg-violet-500' },
};

export const RootHomePage: React.FC<RootHomePageProps> = ({
    onNavigateFinhub = () => window.location.assign('/finhub'),
    onNavigateDevLush,
    onNavigateAgents,
    onNavigateBlogs = () => window.location.assign('/blogs'),
}) => {
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const openLabsRuntime = () => window.location.assign('/agents/lab');
    const [slideIndex, setSlideIndex] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const topicScroller = useRef<HTMLDivElement>(null);
    const slide = slides[slideIndex];
    const slideTone = toneStyles[slide.tone];

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(media.matches);
        update();
        media.addEventListener?.('change', update);
        return () => media.removeEventListener?.('change', update);
    }, []);

    useEffect(() => {
        if (reducedMotion || window.innerWidth < 768) return;
        const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 7000);
        return () => window.clearInterval(timer);
    }, [reducedMotion]);

    const moveSlide = (direction: number) => {
        setSlideIndex((current) => (current + direction + slides.length) % slides.length);
    };

    const scrollTopics = (direction: number) => {
        topicScroller.current?.scrollBy({ left: direction * 300, behavior: reducedMotion ? 'auto' : 'smooth' });
    };

    const navigateFromMenu = (action: () => void) => {
        setMobileMenuOpen(false);
        action();
    };

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f8f5] text-slate-950 selection:bg-cyan-200 selection:text-slate-950">
            <header className="sticky top-0 z-40 border-b border-slate-900/10 bg-[#f7f8f5]/95 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })} className="flex items-center gap-3 text-left" aria-label="GPTX.VIP home">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-cyan-300"><Sparkles className="h-4 w-4" /></span>
                        <span className="font-display text-lg font-black tracking-tight">GPTX<span className="text-cyan-600">.VIP</span></span>
                    </button>

                    <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Primary navigation">
                        <button onClick={navigateAgents} className="transition-colors hover:text-slate-950">Agent Labs</button>
                        <button onClick={onNavigateFinhub} className="transition-colors hover:text-slate-950">Finhub</button>
                        <button onClick={onNavigateBlogs} className="transition-colors hover:text-slate-950">Notes</button>
                    </nav>

                    <div className="flex items-center gap-2">
                        <button onClick={navigateAgents} className="hidden items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800 sm:inline-flex">Open Agent Labs <ArrowRight className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setMobileMenuOpen((open) => !open)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-900/10 bg-white text-slate-700 md:hidden" aria-expanded={mobileMenuOpen} aria-controls="mobile-navigation" aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}>
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <nav id="mobile-navigation" className="border-t border-slate-900/10 bg-white px-5 py-3 md:hidden" aria-label="Mobile navigation">
                        <div className="mx-auto flex max-w-6xl flex-col gap-1">
                            <button onClick={() => navigateFromMenu(navigateAgents)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Agent Labs</button>
                            <button onClick={() => navigateFromMenu(onNavigateFinhub)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Finhub</button>
                            <button onClick={() => navigateFromMenu(onNavigateBlogs)} className="rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">Notes</button>
                        </div>
                    </nav>
                )}
            </header>

            <main>
                <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28" aria-labelledby="hero-heading">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> A focused technical product</div>
                            <h1 id="hero-heading" className="max-w-3xl font-display text-5xl font-black leading-[.96] tracking-[-.06em] text-slate-950 sm:text-7xl">Build, inspect, and improve <span className="text-cyan-600">with intent.</span></h1>
                            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">GPTX.VIP connects Agent Labs and Finhub through small, observable workspaces that keep the useful signal close to the question.</p>
                            <div className="mt-9 flex flex-wrap gap-3">
                                <button onClick={navigateAgents} className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:-translate-y-0.5 hover:bg-cyan-400">Explore Agent Labs <ArrowRight className="h-4 w-4" /></button>
                                <button onClick={onNavigateFinhub} className="inline-flex items-center gap-2 rounded-full border border-slate-900/15 bg-white/70 px-5 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-900/30 hover:text-slate-950">Open Finhub <ChevronRight className="h-4 w-4" /></button>
                            </div>
                            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-900/10 pt-5 text-xs text-slate-500">
                                <div><span className="block text-sm font-bold text-slate-900">Topic-led</span>learning</div>
                                <div><span className="block text-sm font-bold text-slate-900">Source-backed</span>systems</div>
                                <div><span className="block text-sm font-bold text-slate-900">Browser-ready</span>experiments</div>
                            </div>
                        </div>

                        <div className="relative" role="region" aria-roledescription="carousel" aria-label="GPTX.VIP product surfaces" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowRight') moveSlide(1); if (event.key === 'ArrowLeft') moveSlide(-1); }}>
                            <div className={`overflow-hidden rounded-[2rem] border ${slideTone.border} bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15 transition-colors sm:p-7`}>
                                <div className="flex items-center justify-between border-b border-white/10 pb-5 text-xs font-semibold text-slate-300"><span className="flex items-center gap-2"><Bot className="h-4 w-4 text-cyan-300" /> {slide.eyebrow}</span><span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${slideTone.soft} ${slideTone.text}`}>V2 surface</span></div>
                                <div className="mt-8 min-h-[230px]" aria-live="polite">
                                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${slideTone.soft} ${slideTone.text}`}><FlaskConical className="h-6 w-6" /></div>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{slide.label}</p>
                                    <h2 className="mt-3 max-w-md font-display text-3xl font-black leading-tight tracking-tight text-white">{slide.title}</h2>
                                    <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">{slide.body}</p>
                                    <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-slate-400"><span className={`h-2 w-2 rounded-full ${slideTone.solid}`} /> {slide.detail}</div>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
                                    {slides.map((item, index) => <button key={item.eyebrow} onClick={() => setSlideIndex(index)} className={`h-2 rounded-full transition-all ${index === slideIndex ? `w-8 ${toneStyles[item.tone].solid}` : 'w-2 bg-slate-300'}`} aria-label={`Show slide ${index + 1}`} aria-current={index === slideIndex ? 'true' : undefined} />)}
                                    <span className="ml-2 text-xs font-medium text-slate-500">{slideIndex + 1} / {slides.length}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => moveSlide(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 hover:bg-slate-50" aria-label="Previous slide"><ChevronLeft className="h-4 w-4" /></button>
                                    <button onClick={() => moveSlide(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 hover:bg-slate-50" aria-label="Next slide"><ChevronRight className="h-4 w-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-y border-slate-900/10 bg-white/65" aria-labelledby="intent-heading">
                    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                        <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Choose your next move</p><h2 id="intent-heading" className="mt-3 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Three useful ways in.</h2><p className="mt-4 text-slate-600">Each path has one job and one clear action. Start where your question lives.</p></div>
                        <div className="mt-10 grid gap-5 lg:grid-cols-3">
                            {intentBlocks.map((block) => {
                                const style = toneStyles[block.tone];
                                const action = block.tone === 'cyan' ? openLabsRuntime : block.tone === 'emerald' ? onNavigateFinhub : onNavigateBlogs;
                                const Icon = block.icon;
                                return <button key={block.title} onClick={action} className="group rounded-[1.75rem] border border-slate-900/10 bg-[#f7f8f5] p-6 text-left transition-all hover:-translate-y-1 hover:border-slate-900/25 hover:shadow-xl hover:shadow-slate-900/10 sm:p-7"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.soft} ${style.text}`}><Icon className="h-6 w-6" /></div><h3 className="mt-8 font-display text-2xl font-black tracking-tight text-slate-950">{block.title}</h3><p className="mt-3 leading-7 text-slate-600">{block.body}</p><span className={`mt-7 inline-flex items-center gap-2 text-sm font-bold ${style.text}`}>{block.action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></button>;
                            })}
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="topics-heading">
                    <div className="flex flex-wrap items-end justify-between gap-5"><div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Agent Labs</p><h2 id="topics-heading" className="mt-3 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Start with a real topic.</h2><p className="mt-4 text-slate-600">Short, source-backed topic surfaces for learning how an agent system behaves.</p></div><div className="flex gap-2"><button onClick={() => scrollTopics(-1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 hover:bg-slate-50" aria-label="Scroll topics left"><ChevronLeft className="h-4 w-4" /></button><button onClick={() => scrollTopics(1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-900/10 bg-white text-slate-700 hover:bg-slate-50" aria-label="Scroll topics right"><ChevronRight className="h-4 w-4" /></button></div></div>
                    <div ref={topicScroller} className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label="Agent Lab topics">
                        {agentLabTopics.map((topic, index) => <button key={topic.slug} onClick={openLabsRuntime} className="group min-w-[280px] snap-start rounded-2xl border border-slate-900/10 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-300 hover:shadow-lg sm:min-w-[320px]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">0{index + 1}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{topic.family}</span></div><h3 className="mt-10 text-lg font-bold text-slate-950">{topic.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{topic.outcome}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-700">Open topic <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span></button>)}
                    </div>
                </section>

                <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 sm:px-8 sm:pb-28 lg:grid-cols-[.8fr_1.2fr] lg:items-center" aria-labelledby="principles-heading"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-700">The V2 rule</p><h2 id="principles-heading" className="mt-3 font-display text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Less surface area. More signal.</h2></div><div className="grid gap-3">{['One visual hierarchy per screen', 'Interactive examples instead of unsupported claims', 'Composable modules that stay understandable'].map((principle) => <div key={principle} className="flex items-center gap-4 rounded-2xl border border-slate-900/10 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" /></span>{principle}</div>)}</div></section>

                <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28"><div className="rounded-[2rem] bg-slate-950 px-6 py-12 text-center text-white sm:px-12"><ShieldCheck className="mx-auto h-8 w-8 text-cyan-300" /><h2 className="mt-5 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">Make the next experiment count.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-300">Choose a topic, run one meaningful scenario, and let the evidence shape what you do next.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><button onClick={navigateAgents} className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300">Open Agent Labs <ArrowRight className="h-4 w-4" /></button><button onClick={onNavigateBlogs} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"><BookOpen className="h-4 w-4" /> Read the notes</button></div></div></section>
            </main>

            <footer className="border-t border-slate-900/10 px-5 py-7 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>GPTX.VIP — useful systems for curious builders.</span><span className="flex items-center gap-2"><Bot className="h-3.5 w-3.5" /> Agent Labs · Finhub · Notes</span></div></footer>
        </div>
    );
};

export default RootHomePage;
