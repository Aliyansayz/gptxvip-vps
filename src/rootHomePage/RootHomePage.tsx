import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    Bot,
    Code2,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    Layers,
    LineChart,
    Network,
    Pause,
    Play,
} from 'lucide-react';
import { agentLabTopics, getAgentLabTopic } from '../devLushArea/agentLabsData';
import AgentTopicPreview from '../devLushArea/components/AgentTopicPreview';
import AgentLabsCatalog from '../devLushArea/components/AgentLabsCatalog';
// Extension is pinned: a case-insensitive filesystem resolves the extension-less
// specifier to the sibling `agenticRoleUseCases.ts` data module, which exports no
// component. `allowImportingTsExtensions` is on in tsconfig for exactly this.
import { AgenticRoleUseCases } from '../devLushArea/landingPage/AgenticRoleUseCases.tsx';
import { AgenticArticlePreview } from '../devLushArea/landingPage/AgenticArticlePreview';
import { ContactForm } from '../shared/components/ContactForm';
import { getAgenticRoleHref } from '../devLushArea/agenticRoles/roleRoutes';
import { AnimatePresence, motion } from 'motion/react';
import { AuroraBackground } from '../shared/components/atmosphere/AuroraBackground';
import GlassPanel from '../shared/components/GlassPanel';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Reveal, RevealGroup, RevealItem } from '../shared/components/Reveal';
import { CODE_CONCEPT_CATEGORIES } from '../constants/codeConcepts';
import QuotePanel from '../shared/components/QuotePanel';

export interface RootHomePageProps {
    onNavigateFinhub?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateAlgoTrading?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateAgentWorkspace?: () => void;
    onNavigateBlogs?: () => void;
    onNavigateSoftware?: () => void;
    onNavigateAgentArea?: () => void;
    onNavigateContact?: () => void;
}

/**
 * Accent steps, not arbitrary hues. `amber`/`orange`/`red` read as one warm
 * family at a glance while staying separable at icon size; `deep` is the
 * neutral anchor for surfaces that should not compete with the accent.
 *
 * `text` steps are AA on the paper ground (#f7f8f5). `solid` steps are for
 * fills and dots only — accent-400 and accent-500 fail AA as body copy.
 */
type Tone = 'amber' | 'orange' | 'red' | 'deep';

const slides: Array<{
    eyebrow: string;
    title: string;
    body: string;
    label: string;
    detail: string;
    tone: Tone;
    topicSlug?: string;
}> = [
    {
        eyebrow: 'Code Concepts',
        title: 'Work through code one step at a time.',
        body: 'Follow guided code walkthroughs, check your understanding, and explore visual examples across programming and trading topics.',
        label: 'Interactive lessons',
        detail: 'Read → inspect → practice',
        tone: 'amber',
    },
    {
        eyebrow: 'Finhub',
        title: 'Explore trading ideas with adjustable tools.',
        body: 'Open chart views and simulations, change the inputs, and see how a model responds.',
        label: 'Trading workspaces',
        detail: 'Adjust → observe → compare',
        tone: 'orange',
    },
    {
        eyebrow: 'Agent Labs',
        title: 'Explore how agent systems fit together.',
        body: 'Browse topics about agent types, memory, orchestration, and applied examples.',
        label: 'Agent learning',
        detail: 'Topic → mechanism → example',
        tone: 'red',
        topicSlug: 'agent-architectures',
    },
];

/**
 * `search` is a UI entry in the category list, not a track a visitor can study,
 * so the hero count leaves it out rather than over-reporting.
 */
const codeConceptTracks = CODE_CONCEPT_CATEGORIES.filter((category) => category.id !== 'search').length;

const intentBlocks: Array<{ icon: React.ElementType; title: string; body: string; action: string; audience: string; result: string; effort: string; tone: Tone }> = [
    {
        icon: FlaskConical,
        title: 'Study a code concept',
        body: 'Use guided walkthroughs, knowledge checks, and small visual labs to explore programming and algorithmic trading ideas.',
        action: 'Browse Code Concepts',
        audience: 'For guided study',
        result: 'Leave with a worked explanation and a practice result',
        effort: 'One lesson at a time',
        tone: 'amber',
    },
    {
        icon: LineChart,
        title: 'Explore a trading tool',
        body: 'Change simulation inputs and inspect how indicators, market examples, and trading rules respond.',
        action: 'Open Finhub',
        audience: 'For market exploration',
        result: 'Leave with a comparison of simulated outcomes',
        effort: 'Adjust inputs at your own pace',
        tone: 'orange',
    },
    {
        icon: Network,
        title: 'Explore an agent topic',
        body: 'Browse interactive topics covering agent architecture, memory, orchestration, and applied scenarios.',
        action: 'Start an Agent Lab',
        audience: 'For hands-on agent learning',
        result: 'Leave with a traced agent mechanism',
        effort: 'Choose a topic and a chapter',
        tone: 'red',
    },
    {
        icon: Bot,
        title: 'Read Agent Research',
        body: 'Deep-dive editorial articles on multi-agent coordination, consensus mechanisms, and emergent behaviors with interactive simulations.',
        action: 'Open Agent Area',
        audience: 'For deep technical reading',
        result: 'Leave with a mental model of agent system dynamics',
        effort: 'Read at your own pace',
        tone: 'deep',
    },
    {
        icon: Bot,
        title: 'Inspect a project surface',
        body: 'Compare interface concepts, included patterns, and fit before contacting the owner about an adaptation.',
        action: 'Browse project surfaces',
        audience: 'For project planning',
        result: 'Leave with a shortlist and fit questions',
        effort: 'Browse and compare examples',
        tone: 'deep',
    },
];

const toneStyles: Record<Tone, { soft: string; text: string; border: string; solid: string; onGlass: string }> = {
    amber: { soft: 'bg-accent-50', text: 'text-accent-700', border: 'border-accent-200', solid: 'bg-accent-400', onGlass: 'text-accent-400' },
    orange: { soft: 'bg-accent-50', text: 'text-accent-600', border: 'border-accent-200', solid: 'bg-accent-500', onGlass: 'text-accent-400' },
    red: { soft: 'bg-accent-50', text: 'text-accent-800', border: 'border-accent-300', solid: 'bg-accent-600', onGlass: 'text-accent-300' },
    deep: { soft: 'bg-ink/[0.04]', text: 'text-ink', border: 'border-ink/15', solid: 'bg-ink', onGlass: 'text-white' },
};

export const RootHomePage: React.FC<RootHomePageProps> = ({
    onNavigateFinhub = () => window.location.assign('/finhub'),
    onNavigateCodeConcepts = () => window.location.assign('/code_concepts/general'),
    onNavigateAlgoTrading = () => window.location.assign('/code_concepts/algo_trading'),
    onNavigateDevLush,
    onNavigateAgents,
    onNavigateAgentWorkspace,
    onNavigateBlogs = () => window.location.assign('/blogs'),
    onNavigateSoftware = () => window.location.assign('/guide'),
    onNavigateAgentArea = () => window.location.assign('/agent-area'),
    onNavigateContact,
}) => {
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigateAgentArea = onNavigateAgentArea;
    const heroPath = window.location.pathname;

    /**
     * The three inbuilt prototypes. They sit in the hero's secondary
     * navigation so the CTA row below keeps a single primary action, and each
     * one opens the tool itself rather than a page describing the tool.
     */
    const inbuiltPrototypes: Array<{ id: string; prefix: string; label: string; hint: string; icon: React.ElementType; action: () => void }> = [
        { id: 'finhub', prefix: '/finhub', label: 'Finhub', hint: 'Leverage trading tool', icon: LineChart, action: onNavigateFinhub },
        { id: 'code-concepts', prefix: '/code_concepts', label: 'Code Concepts', hint: 'Guided walkthroughs', icon: Code2, action: onNavigateCodeConcepts },
        { id: 'agent-labs', prefix: '/agents/lab', label: 'Agent Labs', hint: 'Run an agent topic', icon: FlaskConical, action: () => window.location.assign('/agents/lab') },
    ];
    const [slideIndex, setSlideIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);
    const [isCarouselFocused, setIsCarouselFocused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
    const slide = slides[slideIndex];
    const isCarouselInteracting = isCarouselHovered || isCarouselFocused;
    const slideTone = toneStyles[slide.tone];
    const slideTopic = getAgentLabTopic(slide.topicSlug);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const desktop = window.matchMedia('(min-width: 768px)');
        const update = () => setReducedMotion(media.matches);
        const updateDesktop = () => setIsDesktop(desktop.matches);
        update();
        updateDesktop();
        media.addEventListener?.('change', update);
        desktop.addEventListener?.('change', updateDesktop);
        return () => {
            media.removeEventListener?.('change', update);
            desktop.removeEventListener?.('change', updateDesktop);
        };
    }, []);

    useEffect(() => {
        if (reducedMotion || isCarouselPaused || isCarouselInteracting || !isDesktop) return;
        // 12s, not the shorter interval: the hero CTA is read in the same
        // viewport, so a fast rotation competes with it for attention.
        const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 12000);
        return () => window.clearInterval(timer);
    }, [reducedMotion, isCarouselPaused, isCarouselInteracting, isDesktop]);

    const moveSlide = (direction: number) => {
        setSlideIndex((current) => (current + direction + slides.length) % slides.length);
    };

    const actions = [onNavigateCodeConcepts, onNavigateFinhub, navigateAgents, navigateAgentArea, () => window.location.assign('/agents/templates')];

    return (
        <div className="premium-surface min-h-screen overflow-x-hidden bg-paper text-ink selection:bg-accent-200 selection:text-ink">
            <Navbar
                variant="glass"
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateAgents={navigateAgents}
                onNavigateProjectSurfaces={() => window.location.assign('/agents/templates')}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateSoftware={onNavigateSoftware}
                onBookDemo={onNavigateContact}
            />

            <main>
                {/* ---------------------------------------------------------------- hero */}
                <section className="relative isolate" aria-labelledby="hero-heading">
                    {/* Scoped to the hero rather than `fixed`, so the four blurred
                        blades never become a permanent compositing layer. */}
                    <AuroraBackground theme="light" variant="hero" />

                    {/*
                     * Legibility scrim. The blades drift, so the saturated core
                     * periodically passes under the text column; composited over
                     * paper it reaches roughly rgb(202,82,88), which drops
                     * slate-600 body copy to about 1.75:1. This holds the copy
                     * column near paper while leaving the right side — where the
                     * dark glass carousel sits and the red reads most strongly —
                     * fully saturated.
                     */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(115%_95%_at_24%_58%,rgba(247,248,245,0.94)_0%,rgba(247,248,245,0.78)_40%,rgba(247,248,245,0)_74%)]" />

                    {/* ---------------------------------------------------- prototype nav */}
                    {/* The three inbuilt tools get their own secondary navigation
                        directly under the main bar, so the hero keeps one primary
                        CTA instead of three competing entry points. */}
                    <nav aria-label="Inbuilt prototypes" className="relative border-b border-ink/10 bg-white/70 backdrop-blur-xl">
                        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-3 sm:px-8 lg:flex-row lg:items-center lg:gap-5">
                            <p className="flex shrink-0 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                <Layers className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" />
                                Inbuilt prototypes
                            </p>
                            {/* Outer rail owns the fill, each control owns its own
                                state, so the radius stays concentric (pill + p-1). */}
                            <ul className="grid grid-cols-3 gap-1 rounded-full bg-ink/[0.04] p-1 sm:flex sm:flex-wrap">
                                {inbuiltPrototypes.map((prototype) => {
                                    const isCurrent = heroPath.startsWith(prototype.prefix);
                                    const Icon = prototype.icon;
                                    return (
                                        <li key={prototype.id}>
                                            <button
                                                type="button"
                                                onClick={prototype.action}
                                                aria-current={isCurrent ? 'page' : undefined}
                                                className={`flex min-h-11 flex-col items-center justify-center gap-1 rounded-full px-3 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transition-none sm:flex-row sm:gap-2 sm:px-4 sm:text-sm ${isCurrent ? 'bg-white text-ink shadow-sm' : 'text-slate-600 hover:bg-white/60 hover:text-ink'}`}
                                            >
                                                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                                <span className="truncate">{prototype.label}</span>
                                                <span className="hidden text-xs font-medium text-slate-500 lg:inline">{prototype.hint}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>

                    <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20 lg:pb-28">
                        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
                            <div>
                                {/* The hero is above the fold on every breakpoint, so it
                                    runs on mount rather than on scroll. `Reveal` would never
                                    fire its in-view trigger before the user can see it. */}
                                <Reveal from="none" duration={0.5}>
                                    <div className="glass-panel-light mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                        <span className="accent-fill-gradient h-1.5 w-1.5 rounded-full" />
                                        Learn by running the system
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.7} delay={0.06}>
                                    <h1 id="hero-heading" className="max-w-3xl text-balance font-display text-[clamp(2.25rem,5.2vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-slate-950">
                                        See how trading systems and agents <span className="accent-text-gradient-ink">actually work.</span>
                                    </h1>
                                </Reveal>

                                <Reveal from="up" duration={0.65} delay={0.14}>
                                    <p className="mt-7 max-w-xl text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-8 text-slate-600">Run the code, agent, and market models we teach, inside the page with no setup. Open a prototype above, change one input, and watch the model respond.</p>
                                </Reveal>

                                <Reveal from="up" duration={0.6} delay={0.22}>
                                    <div className="mt-9 flex flex-wrap gap-3">
                                        <button type="button" onClick={() => window.location.assign('/agents/lab')} className="group accent-fill-gradient inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg shadow-accent-600/25 transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transform-none">Start an Agent Lab <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" /></button>
                                        <button type="button" onClick={navigateAgents} className="glass-panel-light inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-[filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">Browse all paths <ChevronRight className="h-4 w-4" /></button>
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.6} delay={0.3}>
                                    {/* Proof, not a feature list: counts come from the
                                        same registries the rest of the page renders from,
                                        so they cannot drift out of date. */}
                                    <dl className="mt-10 flex max-w-xl flex-wrap items-center gap-x-8 gap-y-2 border-t border-ink/10 pt-5 text-sm text-slate-600">
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Inbuilt prototypes</dt>
                                            <dd className="font-display text-xl font-extrabold text-ink">{inbuiltPrototypes.length}</dd>
                                            <span>inbuilt prototypes</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Agent lab topics</dt>
                                            <dd className="font-display text-xl font-extrabold text-ink">{agentLabTopics.length}</dd>
                                            <span>agent lab topics</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Code concept tracks</dt>
                                            <dd className="font-display text-xl font-extrabold text-ink">{codeConceptTracks}</dd>
                                            <span>code concept tracks</span>
                                        </div>
                                    </dl>
                                </Reveal>
                            </div>

                            {/* ------------------------------------------------------ carousel */}
                            <Reveal from="left" duration={0.75} delay={0.18}>
                            <div className="relative" role="region" aria-roledescription="carousel" aria-label="GPTX.VIP product surfaces" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowRight') moveSlide(1); if (event.key === 'ArrowLeft') moveSlide(-1); }} onFocus={() => setIsCarouselFocused(true)} onBlur={(event) => { if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) setIsCarouselFocused(false); }} onMouseEnter={() => setIsCarouselHovered(true)} onMouseLeave={() => setIsCarouselHovered(false)}>
                                <GlassPanel className="overflow-hidden rounded-none p-5 transition-colors sm:p-7">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-5 text-xs font-semibold text-slate-300">
                                        <span className="flex items-center gap-2"><Bot className={`h-4 w-4 ${slideTone.onGlass}`} /> {slide.eyebrow}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-on-dark">{slideIndex + 1} / {slides.length}</span>
                                    </div>
                                    {/* Re-keying on the index is what re-runs the slide transition;
                                        `AnimatePresence` handles the exit, and `mode="wait"` keeps the
                                        outgoing copy from overlapping the incoming one. */}
                                    <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={slideIndex}
                                        className="mt-8 min-h-[230px]"
                                        aria-live={isCarouselPaused || isCarouselInteracting ? 'polite' : 'off'}
                                        initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                                        transition={{ duration: reducedMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {slideTopic ? (
                                            <AgentTopicPreview topic={slideTopic} tone="dark" compact accent="warm" />
                                        ) : (
                                            <>
                                                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded bg-white/10 ${slideTone.onGlass}`}><FlaskConical className="h-6 w-6" /></div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-on-dark">{slide.label}</p>
                                                <p className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-white">{slide.title}</p>
                                                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">{slide.body}</p>
                                                <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-muted-on-dark"><span className={`h-2 w-2 rounded-full ${slideTone.solid}`} /> {slide.detail}</div>
                                            </>
                                        )}
                                    </motion.div>
                                    </AnimatePresence>
                                </GlassPanel>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
                                        {slides.map((item, index) => <button key={item.eyebrow} type="button" onClick={() => setSlideIndex(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600" aria-label={`Show slide ${index + 1}`} aria-current={index === slideIndex ? 'true' : undefined}><span aria-hidden="true" className={`h-2 rounded-full transition-all ${index === slideIndex ? `w-7 ${toneStyles[item.tone].solid}` : 'w-2 bg-ink/20'}`} /></button>)}
                                        {/* The panel header already carries the
                                            "N / M" position, so the dots carry only
                                            the selection state. */}
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setIsCarouselPaused((paused) => !paused)} className="glass-panel-light flex min-h-11 items-center gap-2 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600" aria-label={isCarouselPaused ? 'Resume automatic slides' : 'Pause automatic slides'} aria-pressed={isCarouselPaused}>
                                            {isCarouselPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                                            <span>{isCarouselPaused ? 'Play' : 'Pause'}</span>
                                        </button>
                                        <button type="button" onClick={() => moveSlide(-1)} className="glass-panel-light flex h-11 w-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600" aria-label="Previous slide"><ChevronLeft className="h-4 w-4" /></button>
                                        <button type="button" onClick={() => moveSlide(1)} className="glass-panel-light flex h-11 w-11 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600" aria-label="Next slide"><ChevronRight className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------ intent blocks */}
                <section className="border-y border-ink/10 bg-white/65" aria-labelledby="intent-heading">
                    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                        <Reveal>
                            <div className="max-w-xl">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Choose a starting point</p>
                                <h2 id="intent-heading" className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">What would you like to explore?</h2>
                                <p className="mt-4 text-slate-600">Compare the format and outcome before opening a lesson, lab, tool, or project example.</p>
                            </div>
                        </Reveal>
                        {/* `h-full` on the wrapper keeps the staggered cards stretched to
                            the tallest one; without it the grid row collapses to the
                            tallest natural height and the cards look ragged. */}
                        <RevealGroup className="mt-10 grid gap-5 md:grid-cols-2" stagger={0.09}>
                            {intentBlocks.map((block, index) => {
                                const style = toneStyles[block.tone];
                                const action = actions[index];
                                const Icon = block.icon;
                                return <RevealItem key={block.title} index={index} className="h-full"><button type="button" onClick={action} className="group flex h-full w-full flex-col rounded-none border border-ink/10 bg-paper p-6 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-lg hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transform-none sm:p-7"><div className={`flex h-12 w-12 items-center justify-center rounded ${style.soft} ${style.text} transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none`}><Icon className="h-6 w-6" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{block.audience}</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-slate-950">{block.title}</h3><p className="mt-3 leading-7 text-slate-600">{block.body}</p><dl className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm"><div><dt className="font-bold text-ink">What you get</dt><dd className="text-slate-600">{block.result}</dd></div><div><dt className="font-bold text-ink">How it works</dt><dd className="text-slate-600">{block.effort}</dd></div></dl><span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold ${style.text}`}>{block.action}<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" /></span></button></RevealItem>;
                            })}
                        </RevealGroup>
                    </div>
                </section>

                <AgenticRoleUseCases accent="warm" onOpenRole={(roleId) => window.location.assign(getAgenticRoleHref(roleId))} />

                <AgenticArticlePreview 
                  accent="warm" 
                  onOpenArticle={(roleId) => window.location.assign(getAgenticRoleHref(roleId) + '?mode=read')} 
                />

                {/* ------------------------------------------------------ algo trading */}
                <section className="border-b border-ink/10 bg-white/65" aria-labelledby="algo-topic-heading">
                    <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.1fr_.9fr]">
                        <Reveal>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Code Concepts · Algo Trading</p>
                            <h2 id="algo-topic-heading" className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">From ATR to an adaptive trend signal.</h2>
                            <p className="mt-4 max-w-2xl leading-7 text-slate-600">Follow the indicator logic from True Range and ATR through delayed swing-pivot confirmation and K-means volatility groups, then see how those inputs shape Supertrend bands and entry filters.</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <button onClick={onNavigateAlgoTrading} className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transform-none">Open the Algo Trading topic <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" /></button>
                                <button onClick={onNavigateCodeConcepts} className="glass-panel-light inline-flex min-h-11 items-center gap-2 px-5 text-sm font-bold transition-[filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">Browse all Code Concepts <ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                        </Reveal>
                        <RevealGroup className="grid grid-cols-2 gap-3" stagger={0.08} delay={0.1}>
                            {[
                                { title: 'Range & ATR', detail: 'Measure movement size', icon: LineChart },
                                { title: 'Swing pivots', detail: 'Understand confirmation delay', icon: Network },
                                { title: 'K-means', detail: 'Group recent volatility', icon: FlaskConical },
                                { title: 'Supertrend', detail: 'Trace bands and signal filters', icon: Code2 },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return <RevealItem key={item.title} index={index} from="right" className="h-full"><div className="group h-full rounded-none border border-ink/10 bg-paper p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/25 motion-reduce:transform-none sm:p-5"><Icon className="h-5 w-5 text-accent-600 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none" /><h3 className="mt-4 text-sm font-bold text-slate-950">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p></div></RevealItem>;
                            })}
                        </RevealGroup>
                    </div>
                </section>

                {/* ------------------------------------------------------- agent labs */}
                {/* Shared with the `/agents` catalog root, so the two cannot drift. */}
                <AgentLabsCatalog accent="warm" />

                {/* ----------------------------------------------------------- proof */}
                {/* Sits after the catalog and before contact: the reader has seen
                    what exists, now hears it described, then has somewhere to go. */}
                <QuotePanel
                    eyebrow="Interactive systems · built in the open"
                    headline={<>Stop reading about it.<br /><span className="text-zinc-400">Run the thing.</span></>}
                    body="Every lesson here runs in your browser. Change an input, watch the model disagree with you, and keep the assumptions sitting next to the result."
                    highlights={['No signup', 'Real case data', 'Source-linked']}
                    primaryAction={{ label: 'Browse the agent catalog', onSelect: navigateAgents }}
                    secondaryAction={{ label: 'Book a 30-min walkthrough', onSelect: () => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact')) }}
                    quote="I had bookmarked a hundred articles on agent architecture and understood almost none of them. Three lessons in here and I could finally explain the loop to my own team without notes."
                    attribution="Anonymous"
                    attributionDetail="Beta reader"
                />

            {/* Contact Section */}
            <section className="bg-white/65 py-16 sm:py-24" aria-labelledby="contact-heading">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <Reveal className="mx-auto max-w-2xl text-center">
                  <div className="glass-panel-light mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                    <span className="accent-fill-gradient h-1.5 w-1.5 rounded-full" />
                    Say hello
                  </div>
                  <h2 id="contact-heading" className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">
                    Get in touch
                  </h2>
                  <p className="mt-4 text-slate-600">
                    Questions about a lesson, tool, or want to share feedback? Send a message and it lands in the owner's inbox.
                  </p>
                </Reveal>
                {/* The card lifts on hover rather than on entrance: it is the page's
                    primary conversion point, so it should feel live the whole time
                    the section is on screen, not only as it arrives. */}
                <Reveal className="mx-auto mt-10 max-w-2xl" from="up" distance={24} duration={0.7}>
                <div className="group rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.07] motion-reduce:transform-none sm:p-9">
                  <ContactForm
                    variant="full"
                    tone="light"
                    accent="warm"
                    subject="Contact from GPTX.VIP Landing Page"
                  />
                </div>
                </Reveal>
                <Reveal className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" delay={0.12}>
                  <button type="button" onClick={() => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact'))} className="inline-flex items-center gap-1.5 font-bold text-slate-700 underline decoration-accent-400 decoration-2 underline-offset-4 transition-colors hover:text-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600">
                    Open the full contact page
                  </button>
                  <span className="text-slate-500">or email <a href="mailto:aliyan@gptx.vip" className="font-mono text-slate-800 underline decoration-ink/20 underline-offset-4 transition-colors hover:text-accent-700">aliyan@gptx.vip</a></span>
                </Reveal>
              </div>
            </section>

            </main>
            <Footer accent="warm" onNavigateFinhub={onNavigateFinhub} onNavigateCodeConcepts={onNavigateCodeConcepts} onNavigateDevLush={navigateAgents} onNavigateBlogs={onNavigateBlogs} />
        </div>
    );
};

export default RootHomePage;