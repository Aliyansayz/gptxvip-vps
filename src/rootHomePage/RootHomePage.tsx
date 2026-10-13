import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    Bot,
    Code2,
    ChevronLeft,
    ChevronRight,
    FlaskConical,
    LineChart,
    Network,
    Pause,
    Play,
} from 'lucide-react';
import { agentLabTopics, getAgentLabTopic } from '../devLushArea/agentLabsData';
import AgentTopicPreview from '../devLushArea/components/AgentTopicPreview';
// Extension is pinned: a case-insensitive filesystem resolves the extension-less
// specifier to the sibling `agenticRoleUseCases.ts` data module, which exports no
// component. `allowImportingTsExtensions` is on in tsconfig for exactly this.
import { AgenticRoleUseCases } from '../devLushArea/landingPage/AgenticRoleUseCases.tsx';
import { AgenticArticlePreview } from '../devLushArea/landingPage/AgenticArticlePreview';
import { getAgenticRoleHref } from '../devLushArea/agenticRoles/roleRoutes';
import { AuroraBackground } from '../shared/components/atmosphere/AuroraBackground';
import GlassPanel from '../shared/components/GlassPanel';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export interface RootHomePageProps {
    onNavigateFinhub?: () => void;
    onNavigateCodeConcepts?: () => void;
    onNavigateAlgoTrading?: () => void;
    onNavigateDevLush?: () => void;
    onNavigateAgents?: () => void;
    onNavigateBlogs?: () => void;
    onNavigateSoftware?: () => void;
    onNavigateAgentArea?: () => void;
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
    onNavigateBlogs = () => window.location.assign('/blogs'),
    onNavigateSoftware = () => window.location.assign('/software_manual'),
    onNavigateAgentArea = () => window.location.assign('/agent-area'),
}) => {
    const navigateAgents = onNavigateAgents || onNavigateDevLush || (() => window.location.assign('/agents'));
    const navigateAgentArea = onNavigateAgentArea;
    const [slideIndex, setSlideIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);
    const [isCarouselFocused, setIsCarouselFocused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const slide = slides[slideIndex];
    const TOPIC_GROUP_ORDER = ['Foundations', 'Build and secure', 'Applied work'];
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
        const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 7000);
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
                onNavigateAgents={navigateAgents}
                onNavigateProjectSurfaces={() => window.location.assign('/agents/templates')}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateSoftware={onNavigateSoftware}
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

                    <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28">
                        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
                            <div>
                                <div className="glass-panel-light mb-6 inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
                                    <span className="accent-fill-gradient h-1.5 w-1.5 rounded-full" />
                                    Interactive learning and finance tools
                                </div>

                                <h1 id="hero-heading" className="max-w-3xl font-display text-[clamp(2.25rem,5.2vw,4.25rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-slate-950">
                                    Understand the code and systems <span className="accent-text-gradient-ink">behind the tools.</span>
                                </h1>

                                <p className="mt-7 max-w-xl text-[clamp(1.0625rem,1.4vw,1.1875rem)] leading-8 text-slate-600">GPTX.VIP brings together Code Concepts lessons, Agent Labs topics, and Finhub trading tools. Follow a walkthrough, explore an agent example, or adjust a market simulation.</p>

                                <div className="mt-9 flex flex-wrap gap-3">
                                    <button type="button" onClick={() => window.location.assign('/agents/lab')} className="accent-fill-gradient inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg shadow-accent-600/25 transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transform-none">Start an Agent Lab <ArrowRight className="h-4 w-4" /></button>
                                    <button type="button" onClick={navigateAgents} className="glass-panel-light inline-flex min-h-11 items-center gap-2 px-5 py-3 text-sm font-bold transition-[filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">Explore all agent paths <ChevronRight className="h-4 w-4" /></button>
                                </div>

                                <div className="mt-10 grid max-w-lg grid-cols-1 gap-2 border-t border-ink/10 pt-5 text-xs text-slate-500 sm:grid-cols-3 sm:gap-4">
                                    <div><span className="font-bold text-ink">Code</span> · walkthroughs</div>
                                    <div><span className="font-bold text-ink">Interactive</span> · visuals</div>
                                    <div><span className="font-bold text-ink">Trading</span> · simulations</div>
                                </div>
                            </div>

                            {/* ------------------------------------------------------ carousel */}
                            <div className="relative" role="region" aria-roledescription="carousel" aria-label="GPTX.VIP product surfaces" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowRight') moveSlide(1); if (event.key === 'ArrowLeft') moveSlide(-1); }} onFocus={() => setIsCarouselFocused(true)} onBlur={(event) => { if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) setIsCarouselFocused(false); }} onMouseEnter={() => setIsCarouselHovered(true)} onMouseLeave={() => setIsCarouselHovered(false)}>
                                <GlassPanel className="overflow-hidden rounded-none p-5 transition-colors sm:p-7">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-5 text-xs font-semibold text-slate-300">
                                        <span className="flex items-center gap-2"><Bot className={`h-4 w-4 ${slideTone.onGlass}`} /> {slide.eyebrow}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-on-dark">{slideIndex + 1} / {slides.length}</span>
                                    </div>
                                    <div className="mt-8 min-h-[230px]" aria-live={isCarouselPaused || isCarouselInteracting ? 'polite' : 'off'}>
                                        {slideTopic ? (
                                            <AgentTopicPreview topic={slideTopic} dark compact accent="warm" />
                                        ) : (
                                            <>
                                                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded bg-white/10 ${slideTone.onGlass}`}><FlaskConical className="h-6 w-6" /></div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-on-dark">{slide.label}</p>
                                                <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-[-0.03em] text-white">{slide.title}</h2>
                                                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">{slide.body}</p>
                                                <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-muted-on-dark"><span className={`h-2 w-2 rounded-full ${slideTone.solid}`} /> {slide.detail}</div>
                                            </>
                                        )}
                                    </div>
                                </GlassPanel>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
                                        {slides.map((item, index) => <button key={item.eyebrow} type="button" onClick={() => setSlideIndex(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600" aria-label={`Show slide ${index + 1}`} aria-current={index === slideIndex ? 'true' : undefined}><span aria-hidden="true" className={`h-2 rounded-full transition-all ${index === slideIndex ? `w-7 ${toneStyles[item.tone].solid}` : 'w-2 bg-ink/20'}`} /></button>)}
                                        <span className="ml-2 text-xs font-medium text-slate-500">{slideIndex + 1} / {slides.length}</span>
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
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------ intent blocks */}
                <section className="border-y border-ink/10 bg-white/65" aria-labelledby="intent-heading">
                    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
                        <div className="max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Choose a starting point</p>
                            <h2 id="intent-heading" className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">What would you like to explore?</h2>
                            <p className="mt-4 text-slate-600">Compare the format and outcome before opening a lesson, lab, tool, or project example.</p>
                        </div>
                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            {intentBlocks.map((block, index) => {
                                const style = toneStyles[block.tone];
                                const action = actions[index];
                                const Icon = block.icon;
                                return <button key={block.title} type="button" onClick={action} className="group flex h-full flex-col rounded-none border border-ink/10 bg-paper p-6 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-lg hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2 motion-reduce:transform-none sm:p-7"><div className={`flex h-12 w-12 items-center justify-center rounded ${style.soft} ${style.text}`}><Icon className="h-6 w-6" /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{block.audience}</p><h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-slate-950">{block.title}</h3><p className="mt-3 leading-7 text-slate-600">{block.body}</p><dl className="mt-5 grid gap-2 border-t border-ink/10 pt-4 text-sm"><div><dt className="font-bold text-ink">What you get</dt><dd className="text-slate-600">{block.result}</dd></div><div><dt className="font-bold text-ink">How it works</dt><dd className="text-slate-600">{block.effort}</dd></div></dl><span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold ${style.text}`}>{block.action}<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" /></span></button>;
                            })}
                        </div>
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
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Code Concepts · Algo Trading</p>
                            <h2 id="algo-topic-heading" className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">From ATR to an adaptive trend signal.</h2>
                            <p className="mt-4 max-w-2xl leading-7 text-slate-600">Follow the indicator logic from True Range and ATR through delayed swing-pivot confirmation and K-means volatility groups, then see how those inputs shape Supertrend bands and entry filters.</p>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <button onClick={onNavigateAlgoTrading} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white transition-colors hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">Open the Algo Trading topic <ArrowRight className="h-4 w-4" /></button>
                                <button onClick={onNavigateCodeConcepts} className="glass-panel-light inline-flex min-h-11 items-center gap-2 px-5 text-sm font-bold transition-[filter] duration-200 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-600 focus-visible:ring-offset-2">Browse all Code Concepts <ChevronRight className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3" aria-label="Topics covered in the Algo Trading course">
                            {[
                                { title: 'Range & ATR', detail: 'Measure movement size', icon: LineChart },
                                { title: 'Swing pivots', detail: 'Understand confirmation delay', icon: Network },
                                { title: 'K-means', detail: 'Group recent volatility', icon: FlaskConical },
                                { title: 'Supertrend', detail: 'Trace bands and signal filters', icon: Code2 },
                            ].map((item) => {
                                const Icon = item.icon;
                                return <div key={item.title} className="rounded-none border border-ink/10 bg-paper p-4 sm:p-5"><Icon className="h-5 w-5 text-accent-600" /><h3 className="mt-4 text-sm font-bold text-slate-950">{item.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{item.detail}</p></div>;
                            })}
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------- agent labs */}
                <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="topics-heading">
                    <div className="max-w-xl mb-8">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">Agent Labs</p>
                        <h2 id="topics-heading" className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold tracking-[-0.035em] text-slate-950">Explore agent topics.</h2>
                        <p className="mt-4 text-slate-600">Each preview opens the matching interactive lesson from the Agent and its Types curriculum.</p>
                    </div>
                    
                    {/* Category navigation inspired by basalt-standalone.html */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {TOPIC_GROUP_ORDER.map((group, i) => (
                            <button
                                key={group}
                                type="button"
                                onClick={() => setActiveGroup(group)}
                                className={`relative inline-flex items-center rounded-full border border-transparent px-4 py-1.5 text-xs font-medium text-slate-400 transition-all duration-200 ${
                                    activeGroup === group
                                        ? 'border-accent-600 text-accent-600 bg-accent-600/10'
                                        : 'hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Agent Labs topics">
                        {activeGroup 
                            ? agentLabTopics.filter((t) => {
                                // Map families to groups matching TOPIC_GROUP_ORDER
                                const familyToGroup: Record<string, string> = {
                                    Foundations: 'Foundations',
                                    Context: 'Build and secure',
                                    Action: 'Build and secure',
                                    Reliability: 'Applied work',
                                    Governance: 'Applied work',
                                    Orchestration: 'Applied work',
                                };
                                return familyToGroup[t.family] === activeGroup;
                            }).map((topic) => <AgentTopicPreview key={topic.slug} topic={topic} compact accent="warm" />)
                            : agentLabTopics.map((topic) => <AgentTopicPreview key={topic.slug} topic={topic} compact accent="warm" />)
                        }
                    </div>
                </section>
            </main>
            <Footer accent="warm" onNavigateFinhub={onNavigateFinhub} onNavigateCodeConcepts={onNavigateCodeConcepts} onNavigateDevLush={navigateAgents} onNavigateBlogs={onNavigateBlogs} />
        </div>
    );
};

export default RootHomePage;