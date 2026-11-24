import React, { useEffect, useState } from 'react';
import {
    ArrowRight,
    Bot,
    ChevronLeft,
    ChevronRight,
    Clock,
    FlaskConical,
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
 * Semantic accent tokens following the Vireon SOC Teal + Sky Blue + Violet
 * palette (avoiding yellow), anchored by Obsidian `#0B131E`.
 */
type Tone = 'teal' | 'sky' | 'violet' | 'deep';

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
        tone: 'teal',
    },
    {
        eyebrow: 'Enterprise Sandboxes',
        title: 'Test-drive real enterprise prototypes.',
        body: 'Explore interactive sandboxes for threat detection, asset tokenization models, and automated compliance auditing.',
        label: 'Case study sandboxes',
        detail: 'Sandbox → blueprint → telemetry',
        tone: 'sky',
    },
    {
        eyebrow: 'Agent Labs',
        title: 'Explore how agent systems fit together.',
        body: 'Browse topics about agent types, memory, orchestration, and applied enterprise examples.',
        label: 'Agent learning',
        detail: 'Topic → mechanism → example',
        tone: 'violet',
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
        tone: 'teal',
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
        tone: 'sky',
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
        tone: 'violet',
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
    teal: { soft: 'bg-[#CCFBF1]', text: 'text-[#0F766E]', border: 'border-[#5EEAD4]', solid: 'bg-[#2DD4BF]', onGlass: 'text-[#5EEAD4]' },
    sky: { soft: 'bg-[#E0F2FE]', text: 'text-[#0369A1]', border: 'border-[#7DD3FC]', solid: 'bg-[#38BDF8]', onGlass: 'text-[#38BDF8]' },
    violet: { soft: 'bg-[#EDE9FE]', text: 'text-[#6D28D9]', border: 'border-[#C4B5FD]', solid: 'bg-[#A78BFA]', onGlass: 'text-[#C4B5FD]' },
    deep: { soft: 'bg-slate-900/[0.06]', text: 'text-[#0F172A]', border: 'border-slate-300', solid: 'bg-[#0F172A]', onGlass: 'text-white' },
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
        <div
            className="min-h-screen overflow-x-hidden bg-white text-[#0F172A] selection:bg-[#CCFBF1] selection:text-[#0F766E]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <Navbar
                variant="default"
                showPrototypesSubnav={true}
                showAreaBadge={false}
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
                {/* ---------------------------------------------------------------- hero (Vireon SOC Obsidian + Teal + Sky Blue palette) */}
                <section
                    className="relative overflow-hidden text-white"
                    style={{
                        background:
                            'radial-gradient(ellipse at 76% 24%, rgba(14, 165, 233, 0.16) 0, transparent 52%), linear-gradient(160deg, #070d17 0%, #0B131E 60%, #0d2238 100%)',
                    }}
                    aria-labelledby="hero-heading"
                >
                    <div className="relative z-10 mx-auto max-w-6xl px-5 pb-10 pt-8 sm:px-8 sm:pt-10 lg:pb-12">
                        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
                            <div>
                                <Reveal from="none" duration={0.45}>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#CCFBF1]">
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#2DD4BF]" />
                                        Zero-Setup In-Browser Workspaces · Live Systems
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.65} delay={0.05}>
                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#38BDF8]">
                                        Autonomous Systems &amp; Applied Architecture
                                    </p>
                                    <h1
                                        id="hero-heading"
                                        className="max-w-2xl text-balance text-3xl font-medium leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        See how agent systems and roles{' '}
                                        <span className="text-[#5EEAD4] underline decoration-[#2DD4BF] decoration-[3px] underline-offset-[6px]">
                                            actually work.
                                        </span>
                                    </h1>
                                </Reveal>

                                <Reveal from="up" duration={0.6} delay={0.12}>
                                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                                        Run autonomous agent, role, and system models right inside the page with no setup. Open a prototype above, change one input, and watch the model respond.
                                    </p>
                                </Reveal>

                                <Reveal from="up" duration={0.55} delay={0.18}>
                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => window.location.assign('/agents/lab')}
                                            className="inline-flex min-h-11 items-center gap-3 rounded-[30px] bg-gradient-to-r from-[#5EEAD4] via-[#2DD4BF] to-[#38BDF8] px-4 py-2.5 text-xs font-bold text-[#0B131E] transition hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B131E] motion-reduce:transform-none cursor-pointer"
                                        >
                                            <span>Start an Agent Lab</span>
                                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0B131E] text-[10px] text-[#5EEAD4]">
                                                ↗
                                            </span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={navigateUseCases}
                                            className="inline-flex min-h-11 items-center gap-2 rounded-[30px] border border-[#38BDF8]/35 bg-[#0EA5E9]/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-[#38BDF8]/60 hover:bg-[#0EA5E9]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
                                        >
                                            <span>Explore Case Studies</span>
                                            <ArrowRight className="h-3.5 w-3.5 text-[#38BDF8]" />
                                        </button>
                                    </div>
                                </Reveal>

                                <Reveal from="up" duration={0.55} delay={0.24}>
                                    <dl className="mt-7 flex max-w-xl flex-wrap items-center gap-x-7 gap-y-2 border-t border-white/15 pt-4 text-xs text-slate-300">
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Inbuilt prototypes</dt>
                                            <dd className="text-lg font-bold tabular-nums text-[#5EEAD4]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>5</dd>
                                            <span>inbuilt prototypes</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Agent lab topics</dt>
                                            <dd className="text-lg font-bold tabular-nums text-[#38BDF8]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{agentLabTopics.length}</dd>
                                            <span>agent lab topics</span>
                                        </div>
                                        <div className="flex items-baseline gap-2">
                                            <dt className="sr-only">Applied agent roles</dt>
                                            <dd className="text-lg font-bold tabular-nums text-[#A78BFA]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{agenticRoleDefinitions.length}</dd>
                                            <span>agent roles</span>
                                        </div>
                                    </dl>
                                </Reveal>
                            </div>

                            {/* ------------------------------------------------------ quiet preview panel */}
                            <Reveal from="left" duration={0.65} delay={0.14}>
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
                                    <div className="rounded-xl border border-[#2DD4BF]/25 bg-[#0F172A]/85 p-4 backdrop-blur-md sm:p-5">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-slate-300">
                                            <span className="flex items-center gap-2 font-semibold">
                                                <Bot className="h-3.5 w-3.5 text-[#5EEAD4]" /> {slide.eyebrow}
                                            </span>
                                            <span className="font-mono text-[10px] text-slate-400">
                                                {slideIndex + 1} / {slides.length}
                                            </span>
                                        </div>

                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.div
                                                key={slideIndex}
                                                className="mt-4 min-h-[215px]"
                                                aria-live={isCarouselPaused || isCarouselInteracting ? 'polite' : 'off'}
                                                initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                                                transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                            >
                                                {slideTopic ? (
                                                    <AgentTopicPreview topic={slideTopic} tone="dark" compact accent="soc" />
                                                ) : (
                                                    <div className="flex h-full flex-col justify-between gap-4">
                                                        <div>
                                                            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#2DD4BF]/15 text-[#5EEAD4]">
                                                                <FlaskConical className="h-4 w-4" />
                                                            </div>
                                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#38BDF8]">
                                                                {slide.label}
                                                            </p>
                                                            <h2
                                                                className="mt-1.5 text-xl font-medium leading-snug tracking-[-0.03em] text-white"
                                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                            >
                                                                {slide.title}
                                                            </h2>
                                                            <p className="mt-2 text-xs leading-relaxed text-slate-300">
                                                                {slide.body}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                                                            <span className="flex items-center gap-2 text-slate-300">
                                                                <span className={`h-1.5 w-1.5 rounded-full ${slideTone.solid}`} />
                                                                {slide.detail}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={slideIndex === 0 ? scrollToAgentRoles : navigateUseCases}
                                                                className="inline-flex min-h-9 items-center gap-1 font-semibold text-[#5EEAD4] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                                                            >
                                                                Open <ArrowRight className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                                            <div className="flex items-center gap-1" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>
                                                {slides.map((item, index) => (
                                                    <button
                                                        key={item.eyebrow}
                                                        type="button"
                                                        onClick={() => setSlideIndex(index)}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                                                        aria-label={`Show slide ${index + 1}`}
                                                        aria-current={index === slideIndex ? 'true' : undefined}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${index === slideIndex ? 'w-5 bg-[#2DD4BF]' : 'w-1.5 bg-white/30 hover:bg-white/50'}`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsCarouselPaused((paused) => !paused)}
                                                    className="flex h-7 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 text-[11px] font-medium text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                                                    aria-label={isCarouselPaused ? 'Resume automatic slides' : 'Pause automatic slides'}
                                                    aria-pressed={isCarouselPaused}
                                                >
                                                    {isCarouselPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                                                    <span>{isCarouselPaused ? 'Play' : 'Pause'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveSlide(-1)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                                                    aria-label="Previous slide"
                                                >
                                                    <ChevronLeft className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveSlide(1)}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5EEAD4]"
                                                    aria-label="Next slide"
                                                >
                                                    <ChevronRight className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------ intent blocks (Vireon SOC Teal + Sky Blue + Obsidian card system) */}
                <section className="border-b border-slate-200 bg-white" aria-labelledby="intent-heading">
                    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
                        <Reveal>
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                                <div className="max-w-xl">
                                    <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0D9488]">
                                        01 / CHOOSE A STARTING POINT
                                    </span>
                                    <h2
                                        id="intent-heading"
                                        className="bg-clip-text text-3xl font-medium leading-[0.98] tracking-[-0.055em] text-transparent sm:text-4xl"
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            backgroundImage: 'linear-gradient(100deg, #0D9488, #0284C7)',
                                        }}
                                    >
                                        What would you like to explore?
                                    </h2>
                                </div>
                                <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                                    Compare the format and outcome before opening an autonomous role, agent lab, research article, or sandbox.
                                </p>
                            </div>
                        </Reveal>

                        <RevealGroup className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
                            {intentBlocks.map((block, index) => {
                                const action = actions[block.handlerIndex];
                                const Icon = block.icon;
                                const isTealCard = index === 0;
                                const isDark = index === 2;
                                const isLightAlt = index === 1;
                                const cardSurfaceStyle = isTealCard
                                    ? {
                                          background:
                                              'radial-gradient(circle at 80% 20%, rgba(56,189,248,0.45), transparent 52%), linear-gradient(135deg, #0B4F6C, #0D9488)',
                                      }
                                    : isDark
                                    ? {
                                          background:
                                              'radial-gradient(circle at 80% 110%, rgba(45,212,191,0.28), transparent 44%), linear-gradient(145deg, #070d17, #0B131E)',
                                      }
                                    : undefined;
                                const onDarkCard = isTealCard || isDark;
                                return (
                                    <RevealItem key={block.title} index={index} className="h-full">
                                        <button
                                            type="button"
                                            onClick={action}
                                            style={cardSurfaceStyle}
                                            className={`group flex h-full w-full flex-col rounded-xl p-5 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2 motion-reduce:transform-none cursor-pointer ${
                                                onDarkCard
                                                    ? 'border border-transparent text-white shadow-lg'
                                                    : isLightAlt
                                                    ? 'border border-slate-200 bg-[#F8FAFC] text-[#0F172A] hover:border-[#0284C7]'
                                                    : 'border border-slate-200 bg-white text-[#0F172A] hover:border-[#0D9488]'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none ${
                                                        onDarkCard
                                                            ? 'bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]'
                                                            : isLightAlt
                                                                ? 'bg-[#E0F2FE] text-[#0369A1]'
                                                                : 'bg-[#CCFBF1] text-[#0F766E]'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <span
                                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                        onDarkCard
                                                            ? 'bg-white/15 text-white/90'
                                                            : 'bg-white text-slate-600 border border-slate-200'
                                                    }`}
                                                >
                                                    0{index + 1}
                                                </span>
                                            </div>
                                            <p className={`mt-3 text-[10px] font-bold uppercase tracking-[0.12em] ${onDarkCard ? 'text-white/75' : 'text-slate-500'}`}>
                                                {block.audience}
                                            </p>
                                            <h3
                                                className={`mt-1 text-lg font-medium leading-snug tracking-[-0.03em] ${onDarkCard ? 'text-white' : 'text-[#0F172A] group-hover:text-[#0D9488] transition-colors'}`}
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                {block.title}
                                            </h3>
                                            <p className={`mt-1.5 text-xs leading-relaxed ${onDarkCard ? 'text-white/85' : 'text-slate-600'}`}>
                                                {block.body}
                                            </p>
                                            <dl className={`mt-3.5 grid gap-1.5 border-t pt-3 text-xs ${onDarkCard ? 'border-white/15' : 'border-slate-200'}`}>
                                                <div>
                                                    <dt className={`font-bold ${onDarkCard ? 'text-[#5EEAD4]' : 'text-[#0D9488]'}`}>What you get</dt>
                                                    <dd className={onDarkCard ? 'text-white/80' : 'text-slate-600'}>{block.result}</dd>
                                                </div>
                                                <div>
                                                    <dt className={`font-bold ${onDarkCard ? 'text-white' : 'text-[#0F172A]'}`}>How it works</dt>
                                                    <dd className={onDarkCard ? 'text-white/75' : 'text-slate-500'}>{block.effort}</dd>
                                                </div>
                                            </dl>
                                            <span
                                                className={`mt-auto inline-flex items-center justify-between gap-2 pt-4 text-xs font-bold ${
                                                    onDarkCard ? 'text-white' : 'text-[#0F172A] group-hover:text-[#0D9488]'
                                                }`}
                                            >
                                                <span>{block.action}</span>
                                                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-r from-[#5EEAD4] to-[#38BDF8] text-[#0B131E] transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none">
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

                <AgenticRoleUseCases accent="soc" onOpenRole={(roleId) => window.location.assign(getAgenticRoleHref(roleId))} />

                <AgenticArticlePreview
                    accent="soc"
                    onOpenArticle={(roleId) => window.location.assign(getAgenticRoleHref(roleId) + '?mode=read')}
                />

                {/* ------------------------------------------------------- agent labs */}
                <AgentLabsCatalog accent="soc" />

                {/* ----------------------------------------------------------- proof */}
                <QuotePanel
                    accent="soc"
                    eyebrow="Interactive systems · built in the open"
                    headline={<>Stop reading about it.<br /><span className="text-slate-400">Run the thing.</span></>}
                    body="Every lesson here runs in your browser. Change an input, watch the model disagree with you, and keep the assumptions sitting next to the result."
                    highlights={['No signup', 'Production-grade logic', 'Source-linked']}
                    primaryAction={{ label: 'Browse the agent catalog', onSelect: navigateAgents }}
                    secondaryAction={{ label: 'Book a 30-min walkthrough', onSelect: () => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact')) }}
                    quote="I had bookmarked a hundred articles on agent architecture and understood almost none of them. Three lessons in here and I could finally explain the loop to my own team without notes."
                    attribution="Anonymous"
                    attributionDetail="Beta reader"
                />

                {/* ------------------------------------------------------- Contact Section (Vireon SOC Obsidian + Teal/Sky gradient) */}
                <section className="bg-white py-10 sm:py-12" aria-labelledby="contact-heading">
                    <div className="mx-auto max-w-6xl px-5 sm:px-8">
                        <div
                            className="relative overflow-hidden rounded-2xl p-6 text-white sm:p-10"
                            style={{
                                background:
                                    'radial-gradient(ellipse at 78% 22%, rgba(45, 212, 191, 0.24) 0, transparent 46%), radial-gradient(ellipse at 60% 78%, rgba(14, 165, 233, 0.32) 0, transparent 50%), linear-gradient(125deg, #070d17 5%, #0B131E 48%, #0c2d48 100%)',
                            }}
                        >
                            <div className="relative z-10 grid items-center gap-8 lg:grid-cols-12">
                                <Reveal className="space-y-5 lg:col-span-6">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/35 bg-[#2DD4BF]/15 px-3.5 py-1.5 text-xs font-bold text-[#5EEAD4]">
                                        <span>✳</span>
                                        Custom AI Agents &amp; Interactive Workspaces
                                    </div>
                                    <h2
                                        id="contact-heading"
                                        className="text-3xl font-normal leading-[1.05] tracking-[-0.05em] text-white sm:text-4xl"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Get in touch about your <span className="text-[#5EEAD4] underline decoration-[#2DD4BF] decoration-[3px] underline-offset-4">agent workflow.</span>
                                    </h2>
                                    <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                                        Questions about an agent system, interactive sandbox, or custom adaptation? Send a message directly to the owner's inbox.
                                    </p>

                                    <div className="space-y-3 pt-1">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]">
                                                <Sparkles className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                    In-Browser Prototypes Ready to Test
                                                </h3>
                                                <p className="mt-0.5 text-xs text-slate-300">
                                                    Try any role, sandbox, or lab live before requesting a tailored build.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]">
                                                <Clock className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                    Direct Reply from hello@gptx.vip
                                                </h3>
                                                <p className="mt-0.5 text-xs text-slate-300">
                                                    No intermediary intake queue — your note reaches the builder directly.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5EEAD4] to-[#38BDF8] text-[#0B131E]">
                                                <ShieldCheck className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                                    Full Case Walkthroughs Available
                                                </h3>
                                                <p className="mt-0.5 text-xs text-slate-300">
                                                    Switch to the{' '}
                                                    <button
                                                        type="button"
                                                        onClick={() => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact'))}
                                                        className="font-bold text-[#5EEAD4] underline underline-offset-4 hover:text-white cursor-pointer"
                                                    >
                                                        full contact page
                                                    </button>{' '}
                                                    or email <a href="mailto:hello@gptx.vip" className="font-mono text-[#5EEAD4] underline underline-offset-4 hover:text-white">hello@gptx.vip</a>.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal className="rounded-2xl bg-white p-5 text-[#0F172A] shadow-xl sm:p-7 lg:col-span-6" from="up" distance={20} duration={0.65}>
                                    <ContactForm
                                        variant="full"
                                        tone="light"
                                        accent="soc"
                                        title="Send a Message"
                                        description="Share what you're exploring or email hello@gptx.vip directly."
                                        subject="Contact from GPTX.VIP Landing Page"
                                    />
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer
                accent="soc"
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateDevLush={navigateAgents}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateProjectSurfaces={() => window.location.assign('/agents/templates')}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateUseCases={navigateUseCases}
            />
        </div>
    );
};

export default RootHomePage;
