import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Eye, X, Sparkles, Terminal, Shield, Brain, Layers, ArrowRight } from 'lucide-react';

// Lazy/Dynamic import or direct import of visual components
import AgentReactPatternActivity from '../devLushComponents/devLushTopics/agentTypes/AgentReactPatternActivity';
import SecOpsActivity from '../devLushComponents/devLushTopics/cybersecurity/SecOpsActivity';
import { GenerativeAIDiscoveryOverview } from '../devLushComponents/reference_visuals/GenerativeAIDiscoveryOverview';
import LanguageTransformerOverview from '../devLushComponents/reference_visuals/LanguageTransformerOverview';
import { OverviewActivity as DiffusionOverviewActivity } from '../devLushComponents/reference_visuals/DiffusionOverviewActivity';

interface TopicBlock {
    id: string;
    title: string;
    category: 'agents' | 'security' | 'models';
    description: string;
    badge: string;
    icon: React.ReactNode;
    Component: React.ComponentType<any>;
}

export const BlockGallery: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'agents' | 'security' | 'models'>('all');
    const [activeModalBlock, setActiveModalBlock] = useState<TopicBlock | null>(null);

    const blocks: TopicBlock[] = [
        {
            id: 'react-pattern',
            title: 'ReAct Agent Execution Loop',
            category: 'agents',
            description: 'Reasoning and Acting loop with step-by-step tool invocation and state updates.',
            badge: 'AGENT ARCHITECTURE',
            icon: <Terminal className="w-5 h-5 text-cyan-400" />,
            Component: AgentReactPatternActivity
        },
        {
            id: 'secops-hunting',
            title: 'Autonomous Threat Hunting',
            category: 'security',
            description: 'Real-time SIEM log parsing, vulnerability scoring, and automated patch execution.',
            badge: 'CYBERSECURITY',
            icon: <Shield className="w-5 h-5 text-purple-400" />,
            Component: SecOpsActivity
        },
        {
            id: 'genai-discovery',
            title: 'Generative AI Discovery Stack',
            category: 'models',
            description: 'Multi-modal LLM routing, embedding retrieval, and contextual RAG pipelines.',
            badge: 'FOUNDATION MODELS',
            icon: <Brain className="w-5 h-5 text-emerald-400" />,
            Component: GenerativeAIDiscoveryOverview
        },
        {
            id: 'transformer-arch',
            title: 'Transformer Attention Matrix',
            category: 'models',
            description: 'Self-attention heatmaps, multi-head projections, and key-value token lookups.',
            badge: 'DEEP LEARNING',
            icon: <Layers className="w-5 h-5 text-blue-400" />,
            Component: LanguageTransformerOverview
        },
        {
            id: 'diffusion-pipeline',
            title: 'Diffusion Latent Generator',
            category: 'models',
            description: 'Noise scheduling, U-Net denoising steps, and latent space image synthesis.',
            badge: 'GENERATIVE ARCH',
            icon: <Sparkles className="w-5 h-5 text-amber-400" />,
            Component: DiffusionOverviewActivity
        }
    ];

    const filteredBlocks = selectedCategory === 'all' 
        ? blocks 
        : blocks.filter(b => b.category === selectedCategory);

    return (
        <section id="block-gallery" className="py-16 sm:py-24 max-w-7xl mx-auto px-6">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider rounded-full">
                    Interactive Visual Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    devLush Interactive Topic Gallery
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                    Explore live, interactive visualizations of autonomous agent execution patterns, threat hunting simulators, and neural model architectures.
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                            selectedCategory === 'all'
                                ? 'bg-zinc-900 text-white dark:bg-cyan-500 dark:text-zinc-950 shadow-md'
                                : 'bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800'
                        }`}
                    >
                        All Topic Blocks ({blocks.length})
                    </button>
                    <button
                        onClick={() => setSelectedCategory('agents')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                            selectedCategory === 'agents'
                                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800'
                        }`}
                    >
                        Agent Patterns
                    </button>
                    <button
                        onClick={() => setSelectedCategory('security')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                            selectedCategory === 'security'
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800'
                        }`}
                    >
                        Cybersecurity
                    </button>
                    <button
                        onClick={() => setSelectedCategory('models')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all ${
                            selectedCategory === 'models'
                                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-200 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-800'
                        }`}
                    >
                        AI & Models
                    </button>
                </div>
            </div>

            {/* Block Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlocks.map((block) => (
                    <motion.div
                        key={block.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                                    {block.icon}
                                </div>
                                <span className="text-[10px] bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                                    {block.badge}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-lg group-hover:text-cyan-500 transition-colors">
                                    {block.title}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                    {block.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800/80">
                            <button
                                onClick={() => setActiveModalBlock(block)}
                                className="w-full py-2.5 bg-zinc-100 hover:bg-cyan-500 hover:text-zinc-950 dark:bg-zinc-800 dark:hover:bg-cyan-500 dark:hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Inspect Interactive Visual</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal for Visual Inspection */}
            <AnimatePresence>
                {activeModalBlock && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-950 border border-zinc-800 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                        {activeModalBlock.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-100">
                                            {activeModalBlock.title}
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                            Live devLush Topic Visual Inspector
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveModalBlock(null)}
                                    className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Component Body */}
                            <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-zinc-100">
                                {React.createElement(activeModalBlock.Component as React.ComponentType<any>, { exercise: { title: activeModalBlock.title }, onComplete: () => {} })}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
