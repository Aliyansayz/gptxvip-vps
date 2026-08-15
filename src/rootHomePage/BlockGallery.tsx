import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Eye, X, Sparkles, Terminal, Shield, Brain, Layers, ArrowRight, Play, Maximize2 } from 'lucide-react';

import AgentReactPatternActivity from '../devLushArea/devLushComponents/devLushTopics/agentTypes/AgentReactPatternActivity';
import SecOpsActivity from '../devLushArea/devLushComponents/devLushTopics/cybersecurity/SecOpsActivity';
import { GenerativeAIDiscoveryOverview } from '../devLushArea/devLushComponents/reference_visuals/GenerativeAIDiscoveryOverview';
import LanguageTransformerOverview from '../devLushArea/devLushComponents/reference_visuals/LanguageTransformerOverview';
import { OverviewActivity as DiffusionOverviewActivity } from '../devLushArea/devLushComponents/reference_visuals/DiffusionOverviewActivity';

interface TopicBlock {
    id: string;
    title: string;
    category: 'agents' | 'security' | 'models' | 'valuation';
    description: string;
    badge: string;
    badgeColor: string;
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
        <section id="block-gallery" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 text-cyan-500" />
                    Interactive Visual Architecture
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Interactive Agent & Model Visualizer Gallery
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                    Explore live, fully interactive visualizers of autonomous agent execution patterns, threat hunting simulators, and neural model architectures.
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'all'
                                ? 'bg-zinc-900 text-white dark:bg-cyan-500 dark:text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                        }`}
                    >
                        All Topic Blocks ({blocks.length})
                    </button>
                    <button
                        onClick={() => setSelectedCategory('agents')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'agents'
                                ? 'bg-cyan-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50'
                        }`}
                    >
                        Agent Patterns
                    </button>
                    <button
                        onClick={() => setSelectedCategory('security')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'security'
                                ? 'bg-purple-500 text-white shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50'
                        }`}
                    >
                        Cybersecurity
                    </button>
                    <button
                        onClick={() => setSelectedCategory('models')}
                        className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                            selectedCategory === 'models'
                                ? 'bg-emerald-500 text-zinc-950 shadow-md'
                                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50'
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
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 15 }}
                        className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:scale-105 transition-transform">
                                    {block.icon}
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${block.badgeColor}`}>
                                    {block.badge}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {block.title}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                    {block.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-4 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                                <Play className="w-3 h-3 text-cyan-500" /> Interactive Simulation
                            </span>
                            <button
                                onClick={() => setActiveModalBlock(block)}
                                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                <Maximize2 className="w-3.5 h-3.5" />
                                <span>Launch Visualizer</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal Dialog for Live Visualizer Sandbox */}
            <AnimatePresence>
                {activeModalBlock && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                                        {activeModalBlock.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            {activeModalBlock.title}
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            {activeModalBlock.badge} • Live Autonomous Interactive Sandbox
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setActiveModalBlock(null)}
                                    className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Interactive Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-950">
                                <activeModalBlock.Component />
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex items-center justify-between text-xs text-zinc-500">
                                <span>Zero-latency WebGL & React interactive engine</span>
                                <button
                                    onClick={() => setActiveModalBlock(null)}
                                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
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
