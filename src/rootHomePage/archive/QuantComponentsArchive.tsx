import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Zap, ArrowRight, ShieldCheck, HelpCircle, Star, TrendingUp, Terminal, Activity, Layers } from 'lucide-react';

/**
 * ARCHIVED COMPONENT SUITE: Quant & High-Frequency Trading Components
 * 
 * Reason for Archival:
 * Initial company service priority focuses on Equity Valuation, Stocks Fundamental
 * Analysis, DCF Modeling, SEC 10-K/10-Q Filing Audits, and Accounting Intelligence.
 * Quantitative and algorithmic LOB pair trading services are non-primary and archived here.
 * 
 * Archived on: 2026-08-15
 */

// 1. Archived Agent Data & Card
export const ARCHIVED_QUANT_AGENT_DATA = {
    id: 'quant-arbitrage',
    name: 'Delta-Neutral Cointegration Arbiter',
    category: 'fintech',
    categoryLabel: 'FINTECH QUANT',
    description: 'Continuously measures statistical cointegration spreads across crypto & equities orderbooks to execute automated zero-risk delta-neutral pairs.',
    statLabel: 'Sharpe Ratio:',
    statValue: '3.42 Annualized',
    tags: ['LOB Depth', 'Cointegration', 'Binance', 'Bybit']
};

export const ArchivedQuantArbitrageAgentCard: React.FC<{ onDeploy?: (name: string) => void }> = ({ onDeploy }) => {
    return (
        <div className="rounded-3xl bg-zinc-950 border border-emerald-500/30 p-6 flex flex-col justify-between shadow-xl text-zinc-100 relative overflow-hidden">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        ARCHIVED • FINTECH QUANT
                    </span>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-zinc-100">
                        {ARCHIVED_QUANT_AGENT_DATA.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        {ARCHIVED_QUANT_AGENT_DATA.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                    {ARCHIVED_QUANT_AGENT_DATA.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-mono bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md border border-zinc-800">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 mt-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium">{ARCHIVED_QUANT_AGENT_DATA.statLabel}</span>
                    <span className="font-mono font-black text-emerald-400">{ARCHIVED_QUANT_AGENT_DATA.statValue}</span>
                </div>

                <button
                    onClick={() => onDeploy && onDeploy(ARCHIVED_QUANT_AGENT_DATA.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Archived Deployment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

// 2. Archived Ecosystem Pillar
export const ARCHIVED_QUANT_PILLAR_DATA = {
    id: 'finhub-quant',
    title: 'Finhub Quant Lab',
    subtitle: 'ALGORITHMIC TRADING & LOB ENGINE',
    badge: 'ARCHIVED QUANT PLATFORM',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Real-time Limit Order Book depth simulation, statistical cointegration pair trading, delta-neutral leverage calculus, and interactive algorithmic market replay.',
    features: [
        'Limit Order Book (LOB) Microsecond Matching',
        'Cointegration & Statistical Arbitrage Matrix',
        'Dynamic Margin & Leverage Risk Calculus',
        'Multi-Asset Interactive Technical Visualizers'
    ]
};

export const ArchivedQuantLabPillarCard: React.FC<{ onLaunch?: () => void }> = ({ onLaunch }) => {
    return (
        <div className="rounded-3xl bg-zinc-900 border border-emerald-500/30 p-8 flex flex-col justify-between shadow-xl text-zinc-100 relative overflow-hidden">
            <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                        {ARCHIVED_QUANT_PILLAR_DATA.badge}
                    </span>
                </div>

                <div className="space-y-1.5">
                    <p className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                        {ARCHIVED_QUANT_PILLAR_DATA.subtitle}
                    </p>
                    <h3 className="text-2xl font-extrabold text-zinc-100">
                        {ARCHIVED_QUANT_PILLAR_DATA.title}
                    </h3>
                </div>

                <p className="text-sm text-zinc-400 leading-relaxed">
                    {ARCHIVED_QUANT_PILLAR_DATA.description}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                    <p className="text-xs font-bold text-zinc-300">
                        Archived Quant Capabilities:
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-400">
                        {ARCHIVED_QUANT_PILLAR_DATA.features.map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                <span>{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="pt-8 relative z-10">
                <button
                    onClick={onLaunch}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                    <span>Launch Standalone Finhub Quant Engine</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// 3. Archived Hero SVG Vector Node
export const ArchivedQuantHeroSvgNode: React.FC<{ transform?: string }> = ({ transform = "translate(120, 225)" }) => {
    return (
        <g transform={transform}>
            <circle r="32" fill="#09090b" stroke="#10b981" strokeWidth="2" />
            <circle r="26" fill="#10b981" opacity="0.25" />
            <path d="M-8 4 L-2 -6 L4 0 L10 -8" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="system-ui, sans-serif">
                FINHUB QUANT
            </text>
        </g>
    );
};

// 4. Archived Terminal Logs
export const ARCHIVED_QUANT_TERMINAL_LOGS = [
    { source: 'FINHUB-QUANT', time: 'Archived', trigger: 'Cointegration spread breach detected (+2.8σ on BTC/ETH).', action: 'Auto-routed 100x delta-neutral pair trade with dynamic stop-loss.', color: 'text-emerald-400' },
    { source: 'FINHUB-LOB', time: 'Archived', trigger: 'Liquidity imbalance detected on BTC-USDT orderbook.', action: 'Executed microsecond limit order balancing market depth.', color: 'text-emerald-400' }
];

// 5. Archived Testimonials & FAQ
export const ARCHIVED_QUANT_TESTIMONIAL = {
    quote: "Our quantitative pair trading strategies run on Finhub's microsecond LOB engine. The statistical cointegration visualizers give our trading desk unmatched clarity.",
    name: "Alexander Vance",
    role: "Head of Quantitative Strategy, Apex Alpha Capital",
    metric: "+3.42 Annualized Sharpe",
    initials: "AV"
};

export const ARCHIVED_QUANT_FAQ = {
    q: "How fast is Finhub Quant Engine's Limit Order Book (LOB) matching?",
    a: "Finhub's quant infrastructure matches order flows in sub-millisecond cycles (<450μs). It is built for algorithmic backtesting, real-time statistical cointegration arbitrage, and dynamic leverage management across equities and crypto pairs."
};

// 6. Comprehensive Archive Container View for Inspection
export const QuantArchiveView: React.FC = () => {
    return (
        <section className="py-12 px-6 bg-zinc-950 text-zinc-100 rounded-3xl border border-zinc-800 space-y-8 my-8">
            <div className="border-b border-zinc-800 pb-4">
                <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider">
                    Archive Registry // Quant & High-Frequency Assets
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                    Archived Quantitative Trading Components
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                    These components were safely extracted from the main root page during the repositioning toward Equity Valuation, Fundamental Stock Analysis, and Accounting Intelligence.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase mb-3">
                        Archived Agent Card
                    </h4>
                    <ArchivedQuantArbitrageAgentCard />
                </div>
                <div>
                    <h4 className="text-xs font-bold font-mono text-zinc-400 uppercase mb-3">
                        Archived Platform Pillar
                    </h4>
                    <ArchivedQuantLabPillarCard />
                </div>
            </div>

            <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase">
                    Archived Quant Testimonial & FAQ Record
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-emerald-400 font-bold block mb-1">Testimonial:</span>
                        <p className="italic">"{ARCHIVED_QUANT_TESTIMONIAL.quote}"</p>
                        <p className="text-zinc-500 text-[10px] mt-1">— {ARCHIVED_QUANT_TESTIMONIAL.name}, {ARCHIVED_QUANT_TESTIMONIAL.role}</p>
                    </div>
                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                        <span className="text-cyan-400 font-bold block mb-1">FAQ Item:</span>
                        <p className="font-semibold">{ARCHIVED_QUANT_FAQ.q}</p>
                        <p className="text-zinc-400 text-[11px] mt-1">{ARCHIVED_QUANT_FAQ.a}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuantArchiveView;
