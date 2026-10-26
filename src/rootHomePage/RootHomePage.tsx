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
    Sparkles,
    ShieldCheck,
    Clock,
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

type Tone = 'blue' | 'indigo' | 'dark' | 'lime';

const slides: Array<{
    eyebrow: string;
    title: string;
    body: string;
    label: string;
    detail: string;
    topicSlug?: string;
}> = [
    {
        eyebrow: 'Code Concepts',
        title: 'Work through code one step at a time.',
        body: 'Follow guided code walkthroughs, check your understanding, and explore visual examples across programming and trading topics.',
        label: 'Interactive lessons',
        detail: 'Read → inspect → practice',
    },
    {
        eyebrow: 'Finhub',
        title: 'Explore trading ideas with adjustable tools.',
        body: 'Open chart views and simulations, change the inputs, and see how a model responds in real time.',
        label: 'Trading workspaces',
        detail: 'Adjust → observe → compare',
    },
    {
        eyebrow: 'Agent Labs',
        title: 'Explore how agent systems fit together.',
        body: 'Browse topics about agent types, memory, orchestration, and applied enterprise examples.',
        label: 'Agent learning',
        detail: 'Topic → mechanism → example',
        topicSlug: 'agent-architectures',
    },
];

const codeConceptTracks = CODE_CONCEPT_CATEGORIES.filter((category) => category.id !== 'search').length;

const intentBlocks: Array<{
    id: string;
    icon: React.ElementType;
    title: string;
    body: string;
    action: string;
    audience: string;
    result: string;
    effort: string;
    gradient: string;
    category: 'code' | 'trading' | 'agents' | 'projects';
    handlerIndex: number;
}> = [
    {
        id: 'code-concepts',
        icon: FlaskConical,
        title: 'Study a code concept',
        body: 'Use guided walkthroughs, knowledge checks, and small visual labs to explore programming and algorithmic trading ideas.',
        action: 'Browse Code Concepts',
        audience: 'For guided study',
        result: 'Worked explanation and practice result',
        effort: 'One lesson at a time',
        gradient: 'radial-gradient(ellipse at 80% 110%, #4739ff, transparent 42%), linear-gradient(145deg, #030305, #15151b 65%, #30303a)',
        category: 'code',
        handlerIndex: 0,
    },
    {
        id: 'trading-tool',
        icon: LineChart,
        title: 'Explore a trading tool',
        body: 'Change simulation inputs and inspect how indicators, market depth, and leverage trading rules respond.',
        action: 'Open Finhub',
        audience: 'For market exploration',
        result: 'Comparison of simulated outcomes',
        effort: 'Adjust inputs at your own pace',
        gradient: 'radial-gradient(circle at 80% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
        category: 'trading',
        handlerIndex: 1,
    },
    {
        id: 'agent-topic',
        icon: Network,
        title: 'Explore an agent topic',
        body: 'Browse interactive topics covering agent architecture, memory, orchestration, and applied scenarios.',
        action: 'Start an Agent Lab',
        audience: 'For hands-on agent learning',
        result: 'Traced agent mechanism & flow',
        effort: 'Choose a topic and a chapter',
        gradient: 'linear-gradient(125deg, #14152a 0%, #343edb 52%, #aeb9ff 100%)',
        category: 'agents',
        handlerIndex: 2,
    },
    {
        id: 'agent-research',
        icon: Bot,
        title: 'Read Agent Research',
        body: 'Deep-dive editorial articles on multi-agent coordination, consensus mechanisms, and emergent behaviors with interactive quizzes.',
        action: 'Open Agent Area',
        audience: 'For deep technical reading',
        result: 'Clear mental model of agent system dynamics',
        effort: 'Read at your own pace',
        gradient: 'radial-gradient(circle at 60% 35%, rgba(255,255,255,.16), transparent 36%), linear-gradient(140deg, #222, #050506)',
        category: 'agents',
        handlerIndex: 3,
    },
    {
        id: 'project-surface',
        icon: Bot,
        title: 'Inspect a project surface',
        body: 'Compare interface concepts, included patterns, and fit before contacting the owner about a custom adaptation.',
        action: 'Browse project surfaces',
        audience: 'For project planning',
        result: 'Shortlist and fit questions',
        effort: 'Browse and compare examples',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        category: 'projects',
        handlerIndex: 4,
    },
];

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

    const navigateUseCases = () => {
        if ((window as any).smartNavigate) {
            (window as any).smartNavigate('/resources/usecases');
        } else {
            window.location.assign('/resources/usecases');
        }
    };

    const inbuiltPrototypes: Array<{ id: string; prefix: string; label: string; hint: string; icon: React.ElementType; action: () => void }> = [
        { id: 'finhub', prefix: '/finhub', label: 'Finhub', hint: 'Leverage trading tool', icon: LineChart, action: onNavigateFinhub },
        { id: 'code-concepts', prefix: '/code_concepts', label: 'Code Concepts', hint: 'Guided walkthroughs', icon: Code2, action: onNavigateCodeConcepts },
        { id: 'agent-labs', prefix: '/agents/lab', label: 'Agent Labs', hint: 'Run an agent topic', icon: FlaskConical, action: () => window.location.assign('/agents/lab') },
    ];

    const [slideIndex, setSlideIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'trading' | 'agents' | 'code' | 'projects'>('all');
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);
    const [isCarouselHovered, setIsCarouselHovered] = useState(false);
    const [isCarouselFocused, setIsCarouselFocused] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
    const slide = slides[slideIndex];
    const isCarouselInteracting = isCarouselHovered || isCarouselFocused;
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
        const timer = window.setInterval(() => setSlideIndex((current) => (current + 1) % slides.length), 10000);
        return () => window.clearInterval(timer);
    }, [reducedMotion, isCarouselPaused, isCarouselInteracting, isDesktop]);

    const moveSlide = (direction: number) => {
        setSlideIndex((current) => (current + direction + slides.length) % slides.length);
    };

    const actions = [
        onNavigateCodeConcepts,
        onNavigateFinhub,
        navigateAgents,
        navigateAgentArea,
        () => window.location.assign('/agents/templates')
    ];

    return (
        <div
            className="flex min-h-screen flex-col bg-white text-[#101014] selection:bg-[#d8ff38] selection:text-[#101014]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
            <Navbar
                variant="default"
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

            <main className="flex-1">
                {/* ---------------------------------------------------- Prototype Nav Ribbon */}
                <nav aria-label="Inbuilt prototypes" className="relative border-b border-[#e9e9ec] bg-[#f5f5f7] py-2 px-5 sm:px-8">
                    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
                        <p className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#343edb]">
                            <Layers className="h-3.5 w-3.5 text-[#343edb]" aria-hidden="true" />
                            <span>Inbuilt Prototypes</span>
                        </p>
                        <ul className="flex flex-wrap items-center gap-1.5 rounded-full bg-white p-1 border border-[#e9e9ec]">
                            {inbuiltPrototypes.map((prototype) => {
                                const isCurrent = heroPath.startsWith(prototype.prefix);
                                const Icon = prototype.icon;
                                return (
                                    <li key={prototype.id}>
                                        <button
                                            type="button"
                                            onClick={prototype.action}
                                            aria-current={isCurrent ? 'page' : undefined}
                                            className={`flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343edb] ${
                                                isCurrent
                                                    ? 'bg-[#343edb] text-white shadow-xs'
                                                    : 'text-[#555560] hover:bg-[#f5f5f7] hover:text-[#101014]'
                                            }`}
                                        >
                                            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                            <span>{prototype.label}</span>
                                            <span className="hidden text-[11px] opacity-75 lg:inline">· {prototype.hint}</span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* ---------------------------------------------------- Boulevard Hero Section */}
                <section
                    className="relative overflow-hidden text-white pt-6 pb-6 px-5 sm:px-8 sm:pt-8 sm:pb-8"
                    style={{
                        background:
                            'radial-gradient(ellipse at 78% 25%, #6f78ff 0, transparent 38%), radial-gradient(ellipse at 63% 76%, #1528b7 0, transparent 42%), linear-gradient(115deg, #11121c 5%, #272bc3 58%, #7f8cff 100%)',
                    }}
                >
                    <div className="mx-auto max-w-6xl">
                        {/* Top Badges Row */}
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/80">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-wide text-white">
                                <span className="h-2 w-2 rounded-full bg-[#d8ff38]" />
                                Live Interactive Workspaces • 0-Setup In-Browser
                            </span>
                            <span className="font-mono text-[11px] text-[#d8ff38]">
                                03 INBUILT PROTOTYPES • 10+ LABS
                            </span>
                        </div>

                        {/* Two-Column Hero Grid with Reduced Whitespace */}
                        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] pt-2 pb-4">
                            <div>
                                <h1
                                    className="text-3xl sm:text-5xl font-normal leading-[1.04] tracking-[-0.05em] text-white"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    See How Trading Systems &amp; Agents <span className="hl-circle-sketch">Actually</span> Work in <span className="hl-brutalist">Live Workspaces.</span>
                                </h1>
                                <p className="mt-3 text-xs sm:text-sm text-white/85 leading-relaxed max-w-xl">
                                    Run the code, agent, and market models we teach, inside your browser with zero setup. Open a prototype, adjust inputs, watch the model respond, and inspect the logic in plain English.
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => window.location.assign('/agents/lab')}
                                        className="inline-flex items-center gap-3 rounded-[30px] bg-[#d8ff38] px-4 py-2.5 text-xs font-bold text-[#101014] transition hover:-translate-y-0.5 cursor-pointer shadow-md"
                                    >
                                        <span>Start an Agent Lab</span>
                                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#101014] text-[10px] text-white">
                                            ↗
                                        </span>
                                    </button>
                                    <a
                                        href="#intent-starting-points"
                                        className="inline-flex items-center gap-2 rounded-[30px] border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
                                    >
                                        <span>Explore All Paths</span>
                                        <span className="text-[#d8ff38]">↓</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={navigateUseCases}
                                        className="inline-flex items-center gap-1.5 rounded-[30px] border border-white/20 bg-white/5 px-3 py-2 text-xs font-medium text-white/90 hover:bg-white/15"
                                    >
                                        <span>View Case Studies</span>
                                        <ArrowRight className="h-3 w-3 text-[#d8ff38]" />
                                    </button>
                                </div>

                                <dl className="mt-5 flex max-w-xl flex-wrap items-center gap-x-6 gap-y-1.5 border-t border-white/15 pt-3 text-xs text-white/80">
                                    <div className="flex items-baseline gap-1.5">
                                        <dt className="sr-only">Inbuilt prototypes</dt>
                                        <dd className="font-mono text-base font-bold text-[#d8ff38]">{inbuiltPrototypes.length}</dd>
                                        <span>inbuilt prototypes</span>
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <dt className="sr-only">Agent lab topics</dt>
                                        <dd className="font-mono text-base font-bold text-[#d8ff38]">{agentLabTopics.length}</dd>
                                        <span>agent lab topics</span>
                                    </div>
                                    <div className="flex items-baseline gap-1.5">
                                        <dt className="sr-only">Code concept tracks</dt>
                                        <dd className="font-mono text-base font-bold text-[#d8ff38]">{codeConceptTracks}</dd>
                                        <span>code tracks</span>
                                    </div>
                                </dl>
                            </div>

                            {/* Right Column: Boulevard Glass Carousel */}
                            <div
                                className="relative rounded-xl border border-white/20 bg-black/30 backdrop-blur-md p-4 sm:p-5 text-white"
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
                                <div className="flex items-center justify-between border-b border-white/15 pb-3 text-xs font-semibold text-white/80">
                                    <span className="flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-[#d8ff38]" />
                                        {slide.eyebrow}
                                    </span>
                                    <span className="font-mono text-[10px] text-[#d8ff38]">
                                        {slideIndex + 1} / {slides.length}
                                    </span>
                                </div>

                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={slideIndex}
                                        className="mt-4 min-h-[190px]"
                                        aria-live={isCarouselPaused || isCarouselInteracting ? 'polite' : 'off'}
                                        initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                                        transition={{ duration: reducedMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        {slideTopic ? (
                                            <AgentTopicPreview topic={slideTopic} tone="dark" compact accent="warm" />
                                        ) : (
                                            <div className="flex flex-col justify-between h-full">
                                                <div>
                                                    <span className="inline-block rounded-full bg-[#d8ff38] px-2 py-0.5 text-[9px] font-bold text-[#101014] uppercase tracking-wider mb-2">
                                                        {slide.label}
                                                    </span>
                                                    <h3
                                                        className="text-xl sm:text-2xl font-medium leading-tight tracking-[-0.03em] text-white"
                                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                    >
                                                        {slide.title}
                                                    </h3>
                                                    <p className="mt-2 text-xs leading-relaxed text-white/80">
                                                        {slide.body}
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-white/70">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-[#d8ff38]" />
                                                    {slide.detail}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                                    <div className="flex items-center gap-1.5">
                                        {slides.map((item, index) => (
                                            <button
                                                key={item.eyebrow}
                                                type="button"
                                                onClick={() => setSlideIndex(index)}
                                                className="flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d8ff38]"
                                                aria-label={`Show slide ${index + 1}`}
                                                aria-current={index === slideIndex ? 'true' : undefined}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        index === slideIndex ? 'w-5 bg-[#d8ff38]' : 'w-1.5 bg-white/30'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setIsCarouselPaused((paused) => !paused)}
                                            className="flex h-7 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 text-[10px] font-semibold text-white/90 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d8ff38]"
                                            aria-label={isCarouselPaused ? 'Resume slides' : 'Pause slides'}
                                        >
                                            {isCarouselPaused ? <Play className="h-2.5 w-2.5" /> : <Pause className="h-2.5 w-2.5" />}
                                            <span>{isCarouselPaused ? 'Play' : 'Pause'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveSlide(-1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d8ff38]"
                                            aria-label="Previous slide"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveSlide(1)}
                                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d8ff38]"
                                            aria-label="Next slide"
                                        >
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Boulevard Bottom Typographic Watermark */}
                        <div className="mt-2 text-[10px] text-white/70">Scroll to explore ↓</div>
                        <div
                            className="mt-1 select-none whitespace-nowrap font-medium leading-[0.92] tracking-[-0.095em] text-white/95"
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: 'clamp(52px, 12vw, 130px)',
                            }}
                            aria-hidden="true"
                        >
                            GPTX.VIP
                        </div>
                    </div>
                </section>

                {/* ---------------------------------------------------- Main Editorial Container */}
                <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
                    {/* Boulevard 3-Card Feature Grid */}
                    <section className="mb-10">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <h2
                                className="max-w-xl text-xl sm:text-2xl font-medium leading-[1.15] tracking-[-0.05em] text-[#101014]"
                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                            >
                                Built for builders and traders — <span className="hl-circle-sketch">visual models</span>, real code, and <span className="hl-brutalist">instant feedback</span> inside the browser.
                            </h2>
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#101014] text-xs text-white">
                                ✳
                            </span>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            {/* Feature Blue */}
                            <article
                                onClick={onNavigateFinhub}
                                className="flex min-h-[220px] cursor-pointer flex-col justify-between rounded-xl p-5 text-white transition hover:-translate-y-1"
                                style={{
                                    background:
                                        'radial-gradient(circle at 80% 20%, #818bff, transparent 50%), linear-gradient(135deg, #1821b5, #343ce8)',
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl leading-none">✳</span>
                                    <span className="rounded-full bg-[#d8ff38] px-2.5 py-0.5 text-[10px] font-bold text-[#101014]">
                                        LIVE PROTOTYPE
                                    </span>
                                </div>
                                <div>
                                    <h3
                                        className="mb-1.5 text-xl font-medium leading-[1.04] tracking-[-0.05em]"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Finhub Trading Systems.
                                    </h3>
                                    <p className="text-xs leading-relaxed text-white/85">
                                        Adjust liquidity depth, simulate leverage trade executions, and analyze cointegration spread arbitrage in real time.
                                    </p>
                                </div>
                            </article>

                            {/* Feature Black */}
                            <article
                                onClick={() => window.location.assign('/agents/lab')}
                                className="flex min-h-[220px] cursor-pointer flex-col justify-between rounded-xl p-5 text-white transition hover:-translate-y-1"
                                style={{
                                    background:
                                        'radial-gradient(circle at 60% 35%, rgba(255,255,255,.16), transparent 36%), linear-gradient(140deg, #222, #050506)',
                                }}
                            >
                                <div className="text-[11px] text-white/70">Hands-on Agent Architecture</div>
                                <div>
                                    <h3
                                        className="mb-1.5 text-xl font-medium leading-[1.04] tracking-[-0.05em]"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        Agent Labs &amp; Applied Roles.
                                    </h3>
                                    <p className="text-xs leading-relaxed text-white/80">
                                        Trace memory states, inspect multi-agent orchestration, and simulate consensus mechanisms with zero configuration.
                                    </p>
                                </div>
                            </article>

                            {/* Feature White */}
                            <article
                                onClick={onNavigateCodeConcepts}
                                className="flex min-h-[220px] cursor-pointer flex-col justify-between rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-5 text-[#101014] transition hover:-translate-y-1"
                            >
                                <div className="text-[11px] text-[#777780]">In-Browser Execution</div>
                                <div
                                    className="text-4xl sm:text-5xl font-medium leading-none tracking-[-0.08em] text-[#343edb]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    0-Setup
                                </div>
                                <p className="text-xs leading-relaxed text-[#555560]">
                                    No Docker, no complex terminal dependencies. Every simulator, code walk, and agent experiment runs instantly in your browser.
                                </p>
                            </article>
                        </div>
                    </section>

                    {/* ---------------------------------------------------- Intent Blocks Section */}
                    <section id="intent-starting-points" className="mb-10 pt-2 border-t border-[#e9e9ec]">
                        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 pt-4">
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-widest text-[#343edb] mb-1.5">
                                    01 / INTERACTIVE STARTING POINTS
                                </span>
                                <h2
                                    className="text-3xl sm:text-4xl font-medium leading-[0.96] tracking-[-0.06em] text-transparent bg-clip-text"
                                    style={{
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        backgroundImage: 'linear-gradient(100deg, #2534bf, #8d9dff)',
                                    }}
                                >
                                    Explore Starting Points
                                </h2>
                            </div>
                            <p className="max-w-md text-xs sm:text-sm text-[#777780] leading-relaxed">
                                Compare the format and outcome before opening a lesson, lab, tool, or project example.
                            </p>
                        </div>

                        {/* Category filter pills - Hick's Law: Reduces decision fatigue */}
                        <div className="mb-6 flex flex-wrap items-center gap-1.5" role="toolbar" aria-label="Filter formats by category">
                            {[
                                { id: 'all', label: 'All Formats', count: intentBlocks.length },
                                { id: 'trading', label: 'Trading Simulators', count: intentBlocks.filter((b) => b.category === 'trading').length },
                                { id: 'agents', label: 'AI Agents', count: intentBlocks.filter((b) => b.category === 'agents').length },
                                { id: 'code', label: 'Code Concepts', count: intentBlocks.filter((b) => b.category === 'code').length },
                                { id: 'projects', label: 'Project Surfaces', count: intentBlocks.filter((b) => b.category === 'projects').length },
                            ].map((filterTab) => {
                                const isActive = selectedCategory === filterTab.id;
                                return (
                                    <button
                                        key={filterTab.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(filterTab.id as any)}
                                        aria-pressed={isActive}
                                        className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343edb] ${
                                            isActive
                                                ? 'bg-[#101014] text-white shadow-xs'
                                                : 'bg-[#f5f5f7] text-[#555560] hover:bg-[#e9e9ec] hover:text-[#101014]'
                                        }`}
                                    >
                                        <span>{filterTab.label}</span>
                                        <span className={`text-[11px] ${isActive ? 'text-white/70' : 'text-[#777780]'}`}>
                                            ({filterTab.count})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
                            {intentBlocks
                                .filter((block) => selectedCategory === 'all' || block.category === selectedCategory)
                                .map((block, index) => {
                                    const action = actions[block.handlerIndex];
                                    const Icon = block.icon;
                                    return (
                                        <RevealItem key={block.id} index={index} className="h-full">
                                            <article
                                                role="button"
                                                tabIndex={0}
                                                onClick={action}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        action();
                                                    }
                                                }}
                                                aria-label={`${block.title}: ${block.body}. Action: ${block.action}`}
                                                className="group flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-[#e9e9ec] bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#343edb] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343edb] focus-visible:ring-offset-2"
                                            >
                                                {/* Boulevard Visual Header */}
                                                <div
                                                    className="relative mb-3 flex h-32 w-full flex-col justify-between rounded-lg p-3.5 text-white"
                                                    style={{ background: block.gradient }}
                                                >
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                                            {block.audience}
                                                        </span>
                                                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d8ff38] text-xs font-bold text-[#101014] transition-transform duration-200 group-hover:scale-110">
                                                            ↗
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white">
                                                            <Icon className="h-4 w-4" />
                                                        </div>
                                                        <span
                                                            className="font-medium text-lg text-white tracking-tight"
                                                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                        >
                                                            {block.title}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Card Content */}
                                                <div className="flex flex-1 flex-col justify-between px-1">
                                                    <p className="text-xs leading-relaxed text-[#555560]">
                                                        {block.body}
                                                    </p>

                                                    <div className="mt-3 border-t border-[#f0f0f4] pt-2.5 text-[11px]">
                                                        <div className="flex justify-between text-[#777780] py-0.5">
                                                            <span className="font-semibold text-[#101014]">Outcome:</span>
                                                            <span className="truncate max-w-[65%]">{block.result}</span>
                                                        </div>
                                                        <div className="flex justify-between text-[#777780] py-0.5">
                                                            <span className="font-semibold text-[#101014]">Effort:</span>
                                                            <span>{block.effort}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 text-xs font-bold text-[#343edb] group-hover:text-[#2534bf]">
                                                        <span>{block.action}</span>
                                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                                                    </div>
                                                </div>
                                            </article>
                                        </RevealItem>
                                    );
                                })}
                        </RevealGroup>
                    </section>
                </div>

                {/* ---------------------------------------------------- Applied Roles Section */}
                <AgenticRoleUseCases
                    accent="warm"
                    onOpenRole={(roleId) => window.location.assign(getAgenticRoleHref(roleId))}
                />

                {/* ---------------------------------------------------- Reading Mode / Articles */}
                <AgenticArticlePreview
                    accent="warm"
                    onOpenArticle={(roleId) => window.location.assign(getAgenticRoleHref(roleId) + '?mode=read')}
                />

                {/* ---------------------------------------------------- Algo Trading Architecture */}
                <section className="border-b border-[#e9e9ec] bg-white py-8 sm:py-10" aria-labelledby="algo-topic-heading">
                    <div className="mx-auto max-w-6xl px-5 sm:px-8">
                        <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_.9fr]">
                            <Reveal>
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-widest text-[#343edb] mb-1.5">
                                        04 / CODE CONCEPTS · ALGO TRADING
                                    </span>
                                    <h2
                                        id="algo-topic-heading"
                                        className="text-2xl sm:text-3xl font-medium tracking-tight text-[#101014]"
                                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                    >
                                        From ATR to an adaptive trend signal.
                                    </h2>
                                    <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#777780] max-w-xl">
                                        Follow the indicator logic from True Range and ATR through delayed swing-pivot confirmation and K-means volatility groups, then see how those inputs shape Supertrend bands and entry filters.
                                    </p>
                                    <div className="mt-5 flex flex-wrap items-center gap-2.5">
                                        <button
                                            type="button"
                                            onClick={onNavigateAlgoTrading}
                                            className="group inline-flex min-h-10 items-center gap-2 rounded-[30px] bg-[#343edb] px-4 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2534bf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#343edb]"
                                        >
                                            <span>Open Algo Trading Topic</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onNavigateCodeConcepts}
                                            className="inline-flex min-h-10 items-center gap-1.5 rounded-[30px] border border-[#e9e9ec] bg-[#f5f5f7] px-4 text-xs font-semibold text-[#101014] transition hover:bg-[#e9e9ec]"
                                        >
                                            <span>Browse All Code Concepts</span>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </Reveal>

                            <RevealGroup className="grid grid-cols-2 gap-3" stagger={0.07}>
                                {[
                                    { title: 'Range & ATR', detail: 'Measure movement size', icon: LineChart },
                                    { title: 'Swing pivots', detail: 'Understand confirmation delay', icon: Network },
                                    { title: 'K-means', detail: 'Group recent volatility', icon: FlaskConical },
                                    { title: 'Supertrend', detail: 'Trace bands and signal filters', icon: Code2 },
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <RevealItem key={item.title} index={index} from="right" className="h-full">
                                            <div className="group h-full rounded-xl border border-[#e9e9ec] bg-[#f5f5f7] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#343edb] hover:bg-white hover:shadow-xs">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#e9e9ec] text-[#343edb] shadow-xs transition-transform duration-200 group-hover:scale-105">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                                <h3
                                                    className="mt-3 text-sm font-bold text-[#101014]"
                                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                                >
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-xs leading-4 text-[#777780]">{item.detail}</p>
                                            </div>
                                        </RevealItem>
                                    );
                                })}
                            </RevealGroup>
                        </div>
                    </div>
                </section>

                {/* ---------------------------------------------------- Agent Labs Catalog */}
                <AgentLabsCatalog accent="warm" />

                {/* ---------------------------------------------------- Boulevard Proof Stats Bar */}
                <div className="mx-auto max-w-6xl px-5 sm:px-8">
                    <section className="border-t border-[#e9e9ec] pt-6 pb-6 my-2">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className="border-l border-[#e9e9ec] pl-4 first:border-l-0 first:pl-0">
                                <strong
                                    className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    <span className="hl-brutalist">{inbuiltPrototypes.length}</span>
                                </strong>
                                <span className="text-xs text-[#777780]">
                                    Inbuilt live prototypes ready in your browser
                                </span>
                            </div>
                            <div className="border-l border-[#e9e9ec] pl-4">
                                <strong
                                    className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    <span className="hl-circle-sketch">{agentLabTopics.length}+</span>
                                </strong>
                                <span className="text-xs text-[#777780]">
                                    Hands-on Agent Labs &amp; applied role scenarios
                                </span>
                            </div>
                            <div className="border-l border-[#e9e9ec] pl-4">
                                <strong
                                    className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    {codeConceptTracks}
                                </strong>
                                <span className="text-xs text-[#777780]">
                                    Guided code tracks across algo trading &amp; HFT
                                </span>
                            </div>
                            <div className="border-l border-[#e9e9ec] pl-4">
                                <strong
                                    className="block text-3xl sm:text-4xl font-medium tracking-[-0.07em] text-[#343edb]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    <span className="hl-brutalist">100%</span>
                                </strong>
                                <span className="text-xs text-[#777780]">
                                    In-browser execution with zero installation
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ---------------------------------------------------- Quote & Reader Testimonial */}
                <QuotePanel
                    eyebrow="Interactive systems · built in the open"
                    headline={<>Stop reading about it.<br /><span className="text-zinc-400">Run the thing.</span></>}
                    body="Every lesson here runs in your browser. Change an input, watch the model disagree with you, and keep the assumptions sitting next to the result."
                    highlights={['No signup required', 'Real market logic', 'Source-linked exercises']}
                    primaryAction={{ label: 'Browse the agent catalog', onSelect: navigateAgents }}
                    secondaryAction={{ label: 'Book a 30-min walkthrough', onSelect: () => (onNavigateContact ? onNavigateContact() : window.location.assign('/contact')) }}
                    quote="I had bookmarked a hundred articles on agent architecture and understood almost none of them. Three lessons in here and I could finally explain the loop to my own team without notes."
                    attribution="Anonymous"
                    attributionDetail="Beta reader"
                />

                {/* ---------------------------------------------------- Boulevard Conversion / Lead Gen */}
                <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 sm:py-10">
                    <section
                        className="rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl"
                        style={{
                            background:
                                'radial-gradient(ellipse at 78% 25%, #6f78ff 0, transparent 38%), radial-gradient(ellipse at 63% 76%, #1528b7 0, transparent 42%), linear-gradient(115deg, #11121c 5%, #272bc3 58%, #7f8cff 100%)',
                        }}
                    >
                        <div className="relative z-10 grid gap-8 lg:grid-cols-12 items-center">
                            {/* Left Column: Value Proposition */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-[#d8ff38]">
                                    <span>✳</span>
                                    Interactive Systems &amp; Custom Workspaces
                                </div>

                                <h2
                                    className="text-2xl sm:text-4xl font-normal tracking-[-0.05em] text-white leading-[1.05]"
                                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                >
                                    Ready to <span className="hl-circle-sketch">explore custom agents</span> or <span className="hl-brutalist">trading tools?</span>
                                </h2>

                                <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                                    Whether you want a private agent workspace for compliance and operations, an algorithmic trading sandbox, or an engineering workshop for your team, let's talk.
                                </p>

                                <div className="space-y-3 pt-1">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                                            <Sparkles className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h3
                                                className="text-xs sm:text-sm font-bold text-white"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                Easy for Anyone on Your Team to Run
                                            </h3>
                                            <p className="text-[11px] text-white/75 mt-0.5">
                                                Clean, visual workspaces designed in plain English — zero technical setup needed.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                                            <Clock className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h3
                                                className="text-xs sm:text-sm font-bold text-white"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                Fast Turnaround &amp; Practical Prototypes
                                            </h3>
                                            <p className="text-[11px] text-white/75 mt-0.5">
                                                Start with a working interactive prototype tailored to your company requirements.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d8ff38] text-[#101014] shrink-0">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                            <h3
                                                className="text-xs sm:text-sm font-bold text-white"
                                                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                                            >
                                                100% Transparent &amp; Private
                                            </h3>
                                            <p className="text-[11px] text-white/75 mt-0.5">
                                                Your data and code remain strictly yours, with full architectural explanations.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Contact Form */}
                            <div className="lg:col-span-6 bg-white text-[#101014] rounded-2xl p-5 sm:p-7 shadow-xl">
                                <ContactForm
                                    variant="full"
                                    tone="light"
                                    accent="warm"
                                    title="Book a Friendly Walkthrough"
                                    description="Drop a note below and we'll reply directly to your inbox within 24 hours."
                                    subject="Inquiry from Landing Page Walkthrough"
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer
                theme="light"
                accent="cyan"
                onNavigateFinhub={onNavigateFinhub}
                onNavigateCodeConcepts={onNavigateCodeConcepts}
                onNavigateDevLush={navigateAgents}
                onNavigateBlogs={onNavigateBlogs}
                onNavigateAgentWorkspace={onNavigateAgentWorkspace}
                onNavigateUseCases={navigateUseCases}
            />
        </div>
    );
};

export default RootHomePage;
