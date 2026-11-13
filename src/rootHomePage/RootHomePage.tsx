import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    Bot,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Layers,
    Network,
    Pause,
    Play,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { agentLabTopics, getAgentLabTopic } from '../devLushArea/agentLabsData';
import AgentTopicPreview from '../devLushArea/components/AgentTopicPreview';
import AgentLabsCatalog from '../devLushArea/components/AgentLabsCatalog';
// Extension is pinned: a case-insensitive filesystem resolves the extension-less
// specifier to the sibling `agenticRoleUseCases.ts` data module, which exports no
// component. `allowImportingTsExtensions` is on in tsconfig for exactly this.
import { AgenticRoleUseCases } from '../devLushArea/landingPage/AgenticRoleUseCases.tsx';
import { AgenticArticlePreview } from '../devLushArea/landingPage/AgenticArticlePreview';
import { agenticRoleDefinitions } from '../devLushArea/agenticRoles/data';
import { ContactForm } from '../shared/components/ContactForm';
import { getAgenticRoleHref } from '../devLushArea/agenticRoles/roleRoutes';
import { AnimatePresence, motion } from 'motion/react';
import { AuroraBackground } from '../shared/components/atmosphere/AuroraBackground';
import GlassPanel from '../shared/components/GlassPanel';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Reveal, RevealGroup, RevealItem } from '../shared/components/Reveal';
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
        eyebrow: 'Applied Agent Roles',
        title: 'Deploy specialized agent roles.',
        body: 'Explore autonomous personas across operations, compliance auditing, engineering oversight, and quantitative analysis.',
        label: 'Agent roles',
        detail: 'Role → workflow → output',
        tone: 'amber',
    },
    {
        eyebrow: 'Enterprise Sandboxes',
        title: 'Test-drive real enterprise prototypes.',
        body: 'Explore interactive sandboxes for threat detection, asset tokenization models, and automated compliance auditing.',
        label: 'Case study sandboxes',
        detail: 'Sandbox → blueprint → telemetry',
        tone: 'orange',
    },
    {
        eyebrow: 'Agent Labs',
        title: 'Explore how agent systems fit together.',
        body: 'Browse topics about agent types, memory, orchestration, and applied enterprise examples.',
        label: 'Agent learning',
        detail: 'Topic → mechanism → example',
        tone: 'red',
        topicSlug: 'agent-architectures',
    },
];

const intentBlocks: Array<{
    icon: React.ElementType;
    title: string;
    body: string;
    action: string;
    audience: string;
    result: string;
    effort: string;
    tone: Tone;
    handlerIndex: number;
}> = [
    {
        icon: Bot,
        title: 'Explore agent roles',
        body: 'Test autonomous agent workflows across operations, compliance auditing, engineering oversight, and quantitative analysis.',
        action: 'Inspect Agent Roles',
        audience: 'For practical deployment',
        result: 'Leave with an actionable role blueprint and operational flow',
        effort: 'Hands-on role simulation',
        tone: 'amber',
        handlerIndex: 0,
    },
    {
        icon: Layers,
        title: 'Test an enterprise case study',
        body: 'Inspect production-grade sandboxes with live parameter tuning, system telemetry, and architecture blueprints.',
        action: 'Explore Case Studies',
        audience: 'For solution architects',
        result: 'Leave with a working system blueprint & live demo',
        effort: '10-minute sandbox run',
        tone: 'orange',
        handlerIndex: 1,
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
        handlerIndex: 2,
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
        handlerIndex: 3,
    },
];

const toneStyles: Record<Tone, { soft: string; text: string; border: string; solid: string; onGlass: string }> = {
    amber: { soft: 'bg-[#d8ff38]', text: 'text-ink', border: 'border-[#c6f028]', solid: 'bg-[#d8ff38]', onGlass: 'text-[#d8ff38]' },
    orange: { soft: 'bg-[#e7ff6d]', text: 'text-ink', border: 'border-[#c6f028]', solid: 'bg-[#c6f028]', onGlass: 'text-[#e7ff6d]' },
    red: { soft: 'bg-[#f3ffa3]', text: 'text-ink', border: 'border-[#a8d210]', solid: 'bg-[#d8ff38]', onGlass: 'text-[#d8ff38]' },
    deep: { soft: 'bg-ink/[0.06]', text: 'text-ink', border: 'border-ink/15', solid: 'bg-ink', onGlass: 'text-white' },
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

    const navigateUseCases = () => {
        if ((window as any).smartNavigate) {
            (window as any).smartNavigate('/resources/usecases');
        } else {
            window.location.assign('/resources/usecases');
        }
    };

    const scrollToAgentRoles = () => {
        const el = document.getElementById('agentic-role-use-cases-heading');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            navigateAgents();
        }
    };

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
        const previousTitle = document.title;
        document.title = 'GPTX.VIP — Interactive AI Agent Workspaces & Applied Personas';
        return () => {
            document.title = previousTitle;
        };
    }, []);

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
        const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 12000);
        return () => window.clearInterval(timer);
    }, [reducedMotion, isCarouselPaused, isCarouselInteracting, isDesktop]);

    const moveSlide = (direction: number) => {
        setSlideIndex((current) => (current + direction + slides.length) % slides.length);
    };

    const actions = [
        scrollToAgentRoles,
        navigateUseCases,
        navigateAgents,
        navigateAgentArea,
        () => window.location.assign('/agents/templates')
    ];

    return (
        <div className="premium-surface min-h-screen overflow-x-hidden bg-paper text-ink selection:bg-accent-200 selection:text-ink">
            <Navbar
                variant="glass"
                showPrototypesSubnav={true}
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateAgents={navigateAgents}
                onNavigateUseCases={navigateUseCases}
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
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_95%_at_22%_54%,rgba(247,248,245,0.92)_0%,rgba(247,248,245,0.72)_40%,rgba(247,248,245,0)_76%)]" />

                    <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-5 sm:px-8 sm:pt-8 lg:pb-12 lg:pt-10">
                        <div className="grid items-center gap-7 lg:grid-cols-[0.94fr_1.06fr] lg:gap-9">
                            <div>
                                <Reveal from="none" duration={0.5}>
                                    <div className="glass-panel-light mb-3 inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#d8ff38] ring-1 ring-ink/25" />
                                        Zero-Setup In-Browser Workspaces · Interactive Systems
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.7} delay={0.06}>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 sm:text-sm">
                                        Autonomous Systems &amp; Applied Architecture
                                    </p>
                                    <h1 id="hero-heading" className="max-w-2xl text-balance font-display text-[clamp(2.2rem,4.7vw,3.95rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-slate-950">
                                        See how agent systems and roles{' '}
                                        <span className="inline-block rounded-xl bg-[#d8ff38] px-2.5 py-0.5 text-slate-950 shadow-[0_8px_24px_rgba(216,255,56,0.48)]">
                                            actually work.
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal from="up" duration={0.65} delay={0.14}>
                                    <p className="mt-4 max-w-xl text-[clamp(1rem,1.35vw,1.125rem)] leading-7 text-slate-600">
                                        Run autonomous agent, role, and system models right inside the page with no setup. Open a prototype above, change one input, and watch the model respond.
                                    </p>
                                </Reveal>

                                <Reveal from="up" duration={0.6} delay={0.22}>
                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={() => window.location.assign('/agents/lab')}
                                            className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-[#d8ff38] px-5 py-2.5 text-sm font-bold text-[#101014] shadow-[0_10px_28px_rgba(216,255,56,0.45)] transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-[#c6f028] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 motion-reduce:transform-none"
                                        >
                                            Start an Agent Lab <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={navigateUseCases}
                                            className="glass-panel-light inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-slate-800 transition-[filter,border-color] duration-200 hover:border-ink/25 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                                        >
                                            Explore Case Studies{' '}
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014]">
                                                <ArrowRight className="h-3.5 w-3.5" />
                                            </span>
                                        </button>
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.6} delay={0.3}>
                                    <dl className="mt-6 flex max-w-xl flex-wrap items-center gap-x-7 gap-y-2 border-t border-ink/10 pt-4 text-sm text-slate-600">
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Inbuilt prototypes</dt>
                                            <dd className="rounded-md bg-[#d8ff38]/75 px-1.5 font-display text-lg font-extrabold text-ink">5</dd>
                                            <span>inbuilt prototypes</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Agent lab topics</dt>
                                            <dd className="rounded-md bg-[#d8ff38]/75 px-1.5 font-display text-lg font-extrabold text-ink">{agentLabTopics.length}</dd>
                                            <span>agent lab topics</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Applied agent roles</dt>
                                            <dd className="rounded-md bg-[#d8ff38]/75 px-1.5 font-display text-lg font-extrabold text-ink">{agenticRoleDefinitions.length}</dd>
                                            <span>agent roles</span>
                                        </div>
                                    </dl>
                                </Reveal>
                            </div>

                            {/* ------------------------------------------------------ prominent hero visual */}
                            <Reveal from="left" duration={0.75} delay={0.18}>
                                <div
                                    className="relative"
                                    role="region"
                                    aria-roledescription="carousel"
                                    aria-label="GPTX.VIP product surfaces"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === 'ArrowRight') moveSlide(1);
                                        if (event.key === 'ArrowLeft') moveSlide(-1);
                                    }}
                                    onFocus={() => setIsCarouselFocused(true)}
                                    onBlur={(event) => {
                                        if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) {
                                            setIsCarouselFocused(false);
                                        }
                                    }}
                                    onMouseEnter={() => setIsCarouselHovered(true)}
                                    onMouseLeave={() => setIsCarouselHovered(false)}
                                >
                                    <div aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-[1.75rem] bg-[radial-gradient(circle_at_80%_20%,rgba(216,255,56,0.48),transparent_62%)] blur-xl" />

                                    <GlassPanel className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0c0e13]/95 p-4 shadow-[0_28px_72px_rgba(12,13,18,0.28)] transition-colors sm:p-6">
                                        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#d8ff38] to-transparent opacity-90" />

                                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs font-semibold text-slate-300">
                                            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Featured system views">
                                                {slides.map((item, idx) => {
                                                    const active = idx === slideIndex;
                                                    const shortTabLabel = idx === 0 ? 'Roles' : idx === 1 ? 'Sandboxes' : 'Agent Labs';
                                                    return (
                                                        <button
                                                            key={item.eyebrow}
                                                            type="button"
                                                            role="tab"
                                                            aria-selected={active}
                                                            aria-label={item.label}
                                                            onClick={() => setSlideIndex(idx)}
                                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff38] ${
                                                                active
                                                                    ? 'bg-[#d8ff38] text-[#101014]'
                                                                    : 'bg-white/[0.06] text-slate-300 hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            <span className="font-mono text-[10px]">0{idx + 1}</span>
                                                            <span>{shortTabLabel}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#d8ff38]/35 bg-[#d8ff38]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#d8ff38]">
                                                <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff38]" />
                                                Interactive · {slideIndex + 1}/{slides.length}
                                            </span>
                                        </div>

                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={slideIndex}
                                                className="mt-5 min-h-[325px]"
                                                aria-live={isCarouselPaused || isCarouselInteracting ? 'polite' : 'off'}
                                                initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: reducedMotion ? 0 : -10 }}
                                                transition={{ duration: reducedMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                {slideTopic ? (
                                                    <AgentTopicPreview topic={slideTopic} tone="dark" compact accent="warm" />
                                                ) : slideIndex === 0 ? (
                                                    <div className="flex h-full flex-col justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8ff38]">
                                                                        <Sparkles className="h-3.5 w-3.5" /> {slide.eyebrow}
                                                                    </p>
                                                                    <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-[1.7rem]">
                                                                        {slide.title}
                                                                    </h2>
                                                                </div>
                                                                <span className="shrink-0 rounded-lg bg-[#d8ff38] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#101014]">
                                                                    {agenticRoleDefinitions.length} Roles
                                                                </span>
                                                            </div>
                                                            <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
                                                                {slide.body}
                                                            </p>

                                                            {/* Visual Architecture Pipeline */}
                                                            <div className="mt-4 grid grid-cols-3 gap-2">
                                                                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                                                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                                        <span>01</span>
                                                                        <Bot className="h-3.5 w-3.5 text-slate-300" />
                                                                    </div>
                                                                    <p className="mt-1.5 text-xs font-bold text-white">Role Intake</p>
                                                                    <p className="mt-0.5 text-[11px] text-slate-400">Live signals &amp; constraints</p>
                                                                </div>
                                                                <div className="rounded-xl border border-[#d8ff38]/55 bg-[#d8ff38]/12 p-2.5 shadow-[0_0_24px_rgba(216,255,56,0.12)]">
                                                                    <div className="flex items-center justify-between text-[10px] font-mono text-[#d8ff38]">
                                                                        <span>02 · LOOP</span>
                                                                        <Cpu className="h-3.5 w-3.5 text-[#d8ff38]" />
                                                                    </div>
                                                                    <p className="mt-1.5 text-xs font-bold text-white">Agent Decision</p>
                                                                    <p className="mt-0.5 text-[11px] text-[#f3ffa3]">Trace &amp; verify choices</p>
                                                                </div>
                                                                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                                                                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                                        <span>03</span>
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-[#d8ff38]" />
                                                                    </div>
                                                                    <p className="mt-1.5 text-xs font-bold text-white">Proof Output</p>
                                                                    <p className="mt-0.5 text-[11px] text-slate-400">Auditable artifacts</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Clickable Quick-Launch Role Strip */}
                                                        <div className="border-t border-white/10 pt-3.5">
                                                            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                                                <span>Jump straight into a live role</span>
                                                                <span className="text-[#d8ff38]">{slide.detail}</span>
                                                            </div>
                                                            <div className="flex flex-wrap items-center gap-1.5">
                                                                {agenticRoleDefinitions.slice(0, 4).map((role) => (
                                                                    <button
                                                                        key={role.id}
                                                                        type="button"
                                                                        onClick={() => window.location.assign(getAgenticRoleHref(role.id))}
                                                                        className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[11px] font-semibold text-slate-200 transition-colors hover:border-[#d8ff38]/60 hover:bg-[#d8ff38]/15 hover:text-[#d8ff38]"
                                                                    >
                                                                        {role.shortTitle}
                                                                    </button>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={scrollToAgentRoles}
                                                                    className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#d8ff38] px-3 py-1 text-[11px] font-bold text-[#101014] transition-colors hover:bg-[#c6f028]"
                                                                >
                                                                    All roles <ArrowRight className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex h-full flex-col justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8ff38]">
                                                                        <ShieldCheck className="h-3.5 w-3.5" /> {slide.eyebrow}
                                                                    </p>
                                                                    <h2 className="mt-1.5 font-display text-2xl font-bold leading-tight tracking-[-0.03em] text-white sm:text-[1.7rem]">
                                                                        {slide.title}
                                                                    </h2>
                                                                </div>
                                                                <span className="shrink-0 rounded-lg bg-[#d8ff38] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#101014]">
                                                                    Live Blueprints
                                                                </span>
                                                            </div>
                                                            <p className="mt-2 max-w-lg text-xs leading-relaxed text-slate-300 sm:text-sm">
                                                                {slide.body}
                                                            </p>

                                                            <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                                                {[
                                                                    ['Threat Detection', 'Anomaly 0.94', 'Real-time triage'],
                                                                    ['Tokenization', 'Liquidity Pool', 'Stress simulation'],
                                                                    ['Compliance', '100% Traced', 'Policy verifier'],
                                                                ].map(([name, stat, sub]) => (
                                                                    <div key={name} className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                                                                        <p className="font-mono text-[10px] font-bold text-[#d8ff38]">{stat}</p>
                                                                        <p className="mt-1 text-xs font-bold text-white">{name}</p>
                                                                        <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between border-t border-white/10 pt-3.5">
                                                            <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                                                <span className={`h-2 w-2 rounded-full ${slideTone.solid}`} /> {slide.detail}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={navigateUseCases}
                                                                className="inline-flex items-center gap-1 rounded-full bg-[#d8ff38] px-3 py-1 text-[11px] font-bold text-[#101014] transition-colors hover:bg-[#c6f028]"
                                                            >
                                                                Open Sandboxes <ArrowRight className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                    </GlassPanel>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center gap-1" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
                                            {slides.map((item, index) => (
                                                <button
                                                    key={item.eyebrow}
                                                    type="button"
                                                    onClick={() => setSlideIndex(index)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                                    aria-label={`Show slide ${index + 1}`}
                                                    aria-current={index === slideIndex ? 'true' : undefined}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`h-2 rounded-full transition-all duration-300 ${index === slideIndex ? 'w-7 border border-ink/25 bg-[#d8ff38]' : 'w-2 bg-ink/20 hover:bg-ink/35'}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsCarouselPaused((paused) => !paused)}
                                                className="glass-panel-light flex h-8 items-center gap-1.5 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                                aria-label={isCarouselPaused ? 'Resume automatic slides' : 'Pause automatic slides'}
                                                aria-pressed={isCarouselPaused}
                                            >
                                                {isCarouselPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                                                <span>{isCarouselPaused ? 'Play' : 'Pause'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveSlide(-1)}
                                                className="glass-panel-light flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                                aria-label="Previous slide"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveSlide(1)}
                                                className="glass-panel-light flex h-8 w-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                                aria-label="Next slide"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------ intent blocks */}
                <section className="border-y border-ink/10 bg-white/65" aria-labelledby="intent-heading">
                    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
                        <Reveal>
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-xl">
                                    <p className="inline-flex items-center rounded-full bg-[#d8ff38] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink">Choose a starting point</p>
                                    <h2 id="intent-heading" className="mt-2 font-display text-[clamp(1.6rem,2.8vw,2.25rem)] font-extrabold tracking-[-0.035em] text-slate-950">What would you like to explore?</h2>
                                </div>
                                <p className="max-w-md text-sm leading-relaxed text-slate-600">Compare the format and outcome before opening an autonomous role, agent lab, research article, or sandbox.</p>
                            </div>
                        </Reveal>

                        <RevealGroup className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.08}>
                            {intentBlocks.map((block, index) => {
                                const style = toneStyles[block.tone];
                                const action = actions[block.handlerIndex];
                                const Icon = block.icon;
                                return (
                                    <RevealItem key={block.title} index={index} className="h-full">
                                        <button
                                            type="button"
                                            onClick={action}
                                            className="group flex h-full w-full flex-col rounded-xl border border-ink/10 bg-paper p-5 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#a8d210] hover:shadow-lg hover:shadow-ink/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 motion-reduce:transform-none"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${style.border} ${style.soft} ${style.text} transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none`}>
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <span className="text-[10px] font-bold uppercase leading-tight tracking-[0.11em] text-slate-500">{block.audience}</span>
                                            </div>
                                            <h3 className="mt-3.5 font-display text-lg font-bold leading-snug tracking-[-0.025em] text-slate-950">{block.title}</h3>
                                            <p className="mt-1.5 text-sm leading-6 text-slate-600">{block.body}</p>
                                            <dl className="mt-3.5 grid gap-1.5 border-t border-ink/10 pt-3 text-xs">
                                                <div>
                                                    <dt className="font-bold text-ink">What you get</dt>
                                                    <dd className="text-slate-600">{block.result}</dd>
                                                </div>
                                                <div>
                                                    <dt className="font-bold text-ink">How it works</dt>
                                                    <dd className="text-slate-600">{block.effort}</dd>
                                                </div>
                                            </dl>
                                            <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-bold text-ink">
                                                <span className="underline decoration-[#c6f028] decoration-2 underline-offset-4">{block.action}</span>
                                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d8ff38] text-ink transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </span>
                                            </span>
                                        </button>
                                    </RevealItem>
                                );
                            })}
                        </RevealGroup>
                    </div>
                </section>

                <AgenticRoleUseCases accent="warm" onOpenRole={(roleId) => window.location.assign(getAgenticRoleHref(roleId))} />

                <AgenticArticlePreview
                    accent="warm"
                    onOpenArticle={(roleId) => window.location.assign(getAgenticRoleHref(roleId) + '?mode=read')}
                />

                {/* ------------------------------------------------------- agent labs */}
                <AgentLabsCatalog accent="warm" />

                {/* ----------------------------------------------------------- proof */}
                <QuotePanel
                    eyebrow="Interactive systems · built in the open"
                    headline={<>Stop reading about it.<br /><span className="text-zinc-400">Run the thing.</span></>}
                    body="Every lesson here runs in your browser. Change an input, watch the model disagree with you, and keep the assumptions sitting next to the result."
                    highlights={['No signup', 'Production-grade logic', 'Source-linked']}
                    primaryAction={{ label: 'Browse the agent catalog', onSelect: navigateAgents }}
                    secondaryAction={{ label: 'Book a 30-min walkthrough', onSelect: () => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact')) }}
                    quote="I had bookmarked a hundred articles on agent architecture and understood almost none of them. Three lessons in here and I could finally explain the loop to my own team without notes."
                    attribution="Anonymous"
                    attributionDetail="Beta reader"
                />

                {/* ------------------------------------------------------- Contact Section */}
                <section className="bg-paper py-10 sm:py-12" aria-labelledby="contact-heading">
                    <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
                        <Reveal>
                            <div className="glass-panel-light mb-3 inline-flex items-center gap-2 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                <span className="h-2 w-2 rounded-full bg-[#d8ff38] ring-1 ring-ink/25" />
                                Say hello
                            </div>
                            <h2 id="contact-heading" className="font-display text-[clamp(1.6rem,2.8vw,2.25rem)] font-extrabold tracking-[-0.035em] text-slate-950">
                                Get in touch
                            </h2>
                            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                                Questions about an agent system, interactive sandbox, or want to share feedback? Send a message and it lands in the owner's inbox.
                            </p>
                            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                                <button
                                    type="button"
                                    onClick={() => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact'))}
                                    className="inline-flex min-h-[40px] items-center gap-1.5 font-bold text-slate-800 underline decoration-[#c6f028] decoration-2 underline-offset-4 transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
                                >
                                    Open the full contact page
                                </button>
                                <span className="inline-flex min-h-[40px] items-center text-slate-500">
                                    or email&nbsp;<a href="mailto:hello@gptx.vip" className="font-mono text-slate-800 underline decoration-[#c6f028] decoration-2 underline-offset-4 transition-colors hover:text-ink">hello@gptx.vip</a>
                                </span>
                            </div>
                        </Reveal>
                        <Reveal from="up" distance={20} duration={0.65}>
                            <div className="group rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/[0.07] motion-reduce:transform-none sm:p-6">
                                <ContactForm
                                    variant="full"
                                    tone="light"
                                    accent="warm"
                                    subject="Contact from GPTX.VIP Landing Page"
                                />
                            </div>
                        </Reveal>
                    </div>
                </section>
            </main>

            <Footer
                accent="warm"
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateDevLush={navigateAgents}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateUseCases={navigateUseCases}
            />
        </div>
    );
};

export default RootHomePage;
