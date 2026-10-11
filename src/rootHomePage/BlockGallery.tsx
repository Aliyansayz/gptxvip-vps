import React, { useState, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Eye, X, Sparkles, Terminal, Shield, Brain, Layers, ArrowRight, Play, Maximize2, Loader2 } from 'lucide-react';

// Lazy load heavy visualizer activities on demand to boost landing page FCP & LCP speeds
const AgentReactPatternActivity = lazy(() => import('../devLushArea/devLushComponents/devLushTopics/agentTypes/AgentReactPatternActivity'));
const SecOpsActivity = lazy(() => import('../devLushArea/devLushComponents/devLushTopics/cybersecurity/SecOpsActivity'));
const GenerativeAIDiscoveryOverview = lazy(() => import('../devLushArea/devLushComponents/reference_visuals/GenerativeAIDiscoveryOverview').then(m => ({ default: m.GenerativeAIDiscoveryOverview })));
const LanguageTransformerOverview = lazy(() => import('../devLushArea/devLushComponents/reference_visuals/LanguageTransformerOverview'));
const DiffusionOverviewActivity = lazy(() => import('../devLushArea/devLushComponents/reference_visuals/DiffusionOverviewActivity').then(m => ({ default: m.OverviewActivity })));

interface TopicBlock {
    id: string;
    title: string;
    category: 'agents' | 'security' | 'models' | 'valuation';
    description: string;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
    Component: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const BlockGallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'agents' | 'security' | 'models'>('all');
    const [activeModalBlock, setActiveModalBlock] = useState<TopicBlock | null>(null);

    const blocks: TopicBlock[] = [
        {
            id: 'react-pattern',
            title: 'ReAct Agent Execution Loop',
            category: 'agents',
            description: 'Reasoning and Acting loop with step-by-step tool invocation, memory management, and deterministic state validation.',
            badge: 'AGENT ARCHITECTURE',
            badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
            icon: <Terminal className="w-5 h-5 text-cyan-400" />,
            Component: AgentReactPatternActivity
        },
        {
            id: 'secops-hunting',
            title: 'Autonomous Threat Hunting',
            category: 'security',
            description: 'Real-time SIEM log parsing, vulnerability scoring, and automated patch execution for zero-day mitigation.',
            badge: 'CYBERSECURITY',
            badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
            icon: <Shield className="w-5 h-5 text-purple-400" />,
            Component: SecOpsActivity
        },
        {
            id: 'genai-discovery',
            title: 'Generative AI Discovery Stack',
            category: 'models',
            description: 'Multi-modal LLM routing, contextual RAG embeddings, vector index lookups, and structured token validation.',
            badge: 'FOUNDATION MODELS',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            icon: <Brain className="w-5 h-5 text-emerald-400" />,
            Component: GenerativeAIDiscoveryOverview
        },
        {
            id: 'transformer-arch',
            title: 'Transformer Attention Matrix',
            category: 'models',
            description: 'Self-attention heatmaps, multi-head projections, and key-value token lookups across dense transformer layers.',
            badge: 'DEEP LEARNING',
            badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
            icon: <Layers className="w-5 h-5 text-blue-400" />,
            Component: LanguageTransformerOverview
        },
        {
            id: 'diffusion-pipeline',
            title: 'Diffusion Latent Generator',
            category: 'models',
            description: 'Noise scheduling, U-Net denoising steps, cross-attention guidance, and latent space image synthesis.',
            badge: 'GENERATIVE ARCH',
            badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
            icon: <Sparkles className="w-5 h-5 text-amber-400" />,
            Component: DiffusionOverviewActivity
        }
    ];

    const filteredBlocks = selectedCategory === 'all' 
        ? blocks 
        : blocks.filter(b => b.category === selectedCategory);

    return (
        <section id="block-gallery" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
                <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-500" />
                    Interactive Visual Architecture
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Interactive Agent &amp; Model Visualizer Gallery
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Explore live, fully interactive visualizers of autonomous agent execution patterns, threat hunting simulators, and neural model architectures.
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-3">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'all'
                                ? 'bg-zinc-900 text-white dark:bg-cyan-500 dark:text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                        }`}
                    >
                        All Blocks ({blocks.length})
                    </button>
                    <button
                        onClick={() => setSelectedCategory('agents')}
                        className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'agents'
                                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50'
                        }`}
                    >
                        Agent Patterns
                    </button>
                    <button
                        onClick={() => setSelectedCategory('security')}
                        className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'security'
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50'
                        }`}
                    >
                        Cybersecurity
                    </button>
                    <button
                        onClick={() => setSelectedCategory('models')}
                        className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'models'
                                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50'
                        }`}
                    >
                        AI &amp; Models
                    </button>
                </div>
            </div>

            {/* Block Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredBlocks.map((block) => (
                    <div
                        key={block.id}
                        className="rounded-2xl sm:rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all duration-200 group text-left"
                    >
                        <div className="space-y-3.5">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 sm:p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:scale-105 transition-transform shadow-inner">
                                    {block.icon}
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${block.badgeColor}`}>
                                    {block.badge}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {block.title}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
                                    {block.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-4 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                                <Play className="w-3 h-3 text-cyan-500" /> Live Sandbox
                            </span>
                            <button
                                onClick={() => setActiveModalBlock(block)}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Launch</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Dialog for Live Visualizer Sandbox with Suspense Lazy Load */}
            <AnimatePresence>
                {activeModalBlock && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                                    <div className="p-2 sm:p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 shrink-0">
                                        {activeModalBlock.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                            {activeModalBlock.title}
                                        </h3>
                                        <p className="text-[11px] text-zinc-500 truncate">
                                            {activeModalBlock.badge} • Live Autonomous Interactive Sandbox
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModalBlock(null)}
                                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-2"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Interactive Content with Suspense */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950">
                                <Suspense fallback={
                                    <div className="h-64 w-full flex flex-col items-center justify-center gap-3 text-zinc-500">
                                        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                                        <span className="text-xs font-mono">Loading Interactive Engine...</span>
                                    </div>
                                }>
                                    <activeModalBlock.Component />
                                </Suspense>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-3 sm:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-500">
                                <span className="hidden sm:inline">Zero-latency WebGL &amp; React interactive engine</span>
                                <button
                                    onClick={() => setActiveModalBlock(null)}
                                    className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                                >
                                    Close Visualizer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </section>
    );
};

export default BlockGallery;
