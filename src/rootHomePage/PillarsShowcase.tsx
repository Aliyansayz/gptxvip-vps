import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bot, BookOpen, ArrowRight, Activity, Cpu, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

interface PillarsShowcaseProps {
    onNavigateFinhub: () => void;
    onNavigateDevLush: () => void;
    onNavigateBlogs: () => void;
}

export const PillarsShowcase: React.FC<PillarsShowcaseProps> = ({
    onNavigateFinhub,
    onNavigateDevLush,
    onNavigateBlogs,
}) => {
    const pillars = [
        {
            id: 'finhub',
            title: 'Finhub Equity & Accounting Lab',
            subtitle: 'EQUITY VALUATION & DCF FORENSICS',
            badge: 'VALUATION ENGINE',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            description: 'Automated 3-statement financial modeling, multi-scenario DCF intrinsic valuation, SEC EDGAR 10-K/10-Q accounting forensics, and DuPont return decomposition.',
            icon: <BarChart3 className="w-6 h-6 text-emerald-500" />,
            actionLabel: 'Launch Valuation Lab',
            actionHandler: onNavigateFinhub,
            features: [
                'SEC EDGAR 10-K / 10-Q Ingestion & Parsing',
                'Discounted Cash Flow (DCF) & WACC Engine',
                'DuPont Return & Balance Sheet Health Ratios',
                'GAAP vs Non-GAAP Earnings Quality Forensics'
            ],
            accentBg: 'group-hover:border-emerald-500/50',
            btnGradient: 'group-hover:bg-emerald-500 group-hover:text-zinc-950'
        },
        {
            id: 'devlush',
            title: 'devLush AgentOS Swarms',
            subtitle: 'MULTI-AGENT AUTONOMOUS FLEETS',
            badge: 'ENTERPRISE AI',
            badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
            description: 'Zero-trust enterprise swarm intelligence with pre-built autonomous workers for legal contract redlining, dynamic margin protection, and continuous SOC 2 evidence harvesting.',
            icon: <Bot className="w-6 h-6 text-cyan-500" />,
            actionLabel: 'Launch AgentOS Swarms',
            actionHandler: onNavigateDevLush,
            features: [
                'ReAct Autonomous Reasoning & Action Loops',
                'Deterministic ADAPT Governance & Safety Sandbox',
                'Pre-Trained Specialized Fleets (Legal, Supply, Cyber)',
                '14,200+ Production Swarm Workflows Deployed'
            ],
            accentBg: 'group-hover:border-cyan-500/50',
            btnGradient: 'group-hover:bg-cyan-500 group-hover:text-zinc-950'
        },
        {
            id: 'blogs',
            title: 'Blogs & Research Lab',
            subtitle: 'DEEP LEARNING PAPERS & AUDITS',
            badge: 'RESEARCH & PAPERS',
            badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
            description: 'Rigorous architectural breakdowns, interactive transformer self-attention visualizers, latent diffusion analysis, and cybersecurity vulnerability forensics.',
            icon: <BookOpen className="w-6 h-6 text-purple-500" />,
            actionLabel: 'Explore Research & Articles',
            actionHandler: onNavigateBlogs,
            features: [
                'Interactive Transformer Attention Heatmaps',
                'Diffusion Latent Synthesizer Visualizers',
                'Cybersecurity Bug Bounty Red Team Studies',
                'Generative AI Contextual RAG Blueprints'
            ],
            accentBg: 'group-hover:border-purple-500/50',
            btnGradient: 'group-hover:bg-purple-500 group-hover:text-zinc-950'
        }
    ];

    return (
        <section id="platform-pillars" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
                <span className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                    Complete AI &amp; Financial Ecosystem
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Three Integrated Powerhouses in One Unified Platform
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                    Seamlessly switch between fundamental equity valuation &amp; accounting intelligence, autonomous enterprise agent fleets, and cutting-edge deep learning research.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {pillars.map((pillar) => (
                    <motion.div
                        key={pillar.id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        className={`rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-7 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 relative overflow-hidden group ${pillar.accentBg}`}
                    >
                        <div className="space-y-5 relative z-10 text-left">
                            <div className="flex items-center justify-between">
                                <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform shadow-inner">
                                    {pillar.icon}
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${pillar.badgeColor}`}>
                                    {pillar.badge}
                                </span>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                                    {pillar.subtitle}
                                </p>
                                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                    {pillar.title}
                                </h3>
                            </div>

                            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {pillar.description}
                            </p>

                            <div className="space-y-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide text-[11px]">
                                    Capabilities:
                                </p>
                                <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                                    {pillar.features.map((feat, idx) => (
                                        <li key={idx} className="flex items-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-8 relative z-10">
                            <button
                                onClick={pillar.actionHandler}
                                className={`w-full py-3 px-4 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${pillar.btnGradient}`}
                            >
                                <span>{pillar.actionLabel}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PillarsShowcase;
