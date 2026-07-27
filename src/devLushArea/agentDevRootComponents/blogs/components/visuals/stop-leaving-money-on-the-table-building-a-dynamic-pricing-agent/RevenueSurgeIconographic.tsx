import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, DollarSign, PackageX, Zap, ArrowUpRight } from 'lucide-react';

interface PricingScenario {
    id: string;
    emoji: string;
    scenarioName: string;
    competitorStatus: string;
    priceMutation: string;
    marginResult: string;
    badge: string;
    details: string;
}

const scenarios: PricingScenario[] = [
    { id: 'stockout', emoji: '🛑', scenarioName: 'Competitor A Stockout', competitorStatus: '0 Units in Stock', priceMutation: '$49.99 ➔ $59.99 (+20%)', marginResult: 'Margin: 32% ➔ 45%', badge: 'High Capture', details: 'Viral TikTok demand wiped out Competitor A. Agent automatically pushed 20% surge pricing to Shopify API.' },
    { id: 'lowstock', emoji: '⚡', scenarioName: 'Competitor Scarcity Warning', competitorStatus: '< 10 Units in Stock', priceMutation: '$49.99 ➔ $54.99 (+10%)', marginResult: 'Margin: 32% ➔ 38%', badge: 'Pre-Emptive Surge', details: 'Scraper detected inventory degradation. Agent executed pre-emptive 10% price bump.' },
    { id: 'normal', emoji: '⚖️', scenarioName: 'Equilibrium Market State', competitorStatus: 'Full Inventory Supply', priceMutation: '$49.99 (Base Price)', marginResult: 'Margin: 32% (Baseline)', badge: 'Baseline', details: 'Competitor inventory stable. Agent maintains optimal baseline pricing tier.' },
];

export default function RevenueSurgeIconographic({ prompt }: { prompt?: string }) {
    const [selectedId, setSelectedId] = useState<string>('stockout');

    const selected = scenarios.find(s => s.id === selectedId) || scenarios[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Dynamic Pricing Market Monitor <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">GraphQL Mutator</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Real-Time Competitor Inventory & Margin Maximizer Engine</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    Margin Ceiling Active
                </div>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {scenarios.map((s) => {
                    const isSelected = s.id === selectedId;
                    return (
                        <button
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{s.emoji}</span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                                    {s.badge}
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-200">{s.scenarioName}</div>
                            <div className="text-xs text-emerald-400 font-mono font-bold mt-1">{s.priceMutation}</div>
                        </button>
                    );
                })}
            </div>

            {/* Inspector */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{selected.emoji}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{selected.scenarioName}</h5>
                                <span className="text-xs text-slate-400 font-mono">Competitor Feed: {selected.competitorStatus}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            <ArrowUpRight className="w-4 h-4" />
                            {selected.marginResult}
                        </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.details}</p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>GraphQL Mutation: `mutation &#123; productVariantUpdate(id: "SKU-09", price: "{selected.priceMutation.split('➔')[1] || selected.priceMutation}") &#125;`</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {prompt && (
                <div className="mt-6 text-center text-xs text-slate-500 font-mono opacity-60">
                    {prompt}
                </div>
            )}
        </div>
    );
}
