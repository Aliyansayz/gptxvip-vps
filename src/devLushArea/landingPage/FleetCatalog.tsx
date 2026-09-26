import React, { useEffect, useState } from 'react';
import { ShoppingCart, Scale, Box, Shield, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface FleetAgent {
    id: string;
    name: string;
    category: 'ecommerce' | 'legal' | 'supply' | 'cyber';
    categoryLabel: string;
    description: string;
    statLabel: string;
    statValue: string;
    icon: React.ReactNode;
    colorClass: string;
}

export const FleetCatalog: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'ecommerce' | 'legal' | 'supply' | 'cyber'>('all');
    const [selectedAgent, setSelectedAgent] = useState<FleetAgent | null>(null);

    useEffect(() => {
        if (!selectedAgent) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedAgent(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedAgent]);

    const fleet: FleetAgent[] = [
        {
            id: 'cart-sentinel',
            name: 'Cart Recovery Sentinel',
            category: 'ecommerce',
            categoryLabel: 'ECOMMERCE',
            description: 'Monitors exit intent and issues multi-channel personalized incentives via SMS & WhatsApp.',
            statLabel: 'Avg. Recovery:',
            statValue: '+24.8% Revenue',
            icon: <ShoppingCart className="w-5 h-5 text-emerald-500" />,
            colorClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
        },
        {
            id: 'margin-guard',
            name: 'Dynamic Margin Guard',
            category: 'ecommerce',
            categoryLabel: 'ECOMMERCE',
            description: 'Tracks competitor prices and supply COGS to adjust Shopify catalog prices in real-time.',
            statLabel: 'Margin Protection:',
            statValue: '100% Automated',
            icon: <Zap className="w-5 h-5 text-emerald-500" />,
            colorClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
        },
        {
            id: 'contract-redliner',
            name: 'Contract Redline Agent',
            category: 'legal',
            categoryLabel: 'LEGAL',
            description: 'Parses inbound MSAs and vendor terms against playbooks to output tracked DOCX edits.',
            statLabel: 'Review Speed:',
            statValue: '< 15 Seconds',
            icon: <Scale className="w-5 h-5 text-cyan-500" />,
            colorClass: 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10'
        },
        {
            id: 'inventory-predictor',
            name: 'Inventory Risk Predictor',
            category: 'supply',
            categoryLabel: 'SUPPLY CHAIN',
            description: 'Reconciles demand forecasting with lead times to trigger auto-reorder POs in SAP ERP.',
            statLabel: 'Stockouts Prevented:',
            statValue: '99.4% Reduction',
            icon: <Box className="w-5 h-5 text-amber-500" />,
            colorClass: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
        },
        {
            id: 'soc2-auditor',
            name: 'SOC 2 Evidence Auditor',
            category: 'cyber',
            categoryLabel: 'CYBERSECURITY',
            description: 'Continuously gathers proof from GitHub, AWS, and HR systems to maintain live compliance.',
            statLabel: 'Audit Readiness:',
            statValue: 'Continuous 24/7',
            icon: <Shield className="w-5 h-5 text-purple-500" />,
            colorClass: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10'
        }
    ];

    const filteredFleet = filter === 'all' ? fleet : fleet.filter(a => a.category === filter);

    return (
        <section id="fleet-catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <span className="px-3.5 py-1.5 bg-zinc-900 text-cyan-400 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-full">
                    Autonomous Fleet Catalog
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                    Specialized Autonomous Enterprise Fleet
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                    Select an operational domain to inspect zero-trust autonomous workers pre-trained for your tech stack.
                </p>

                {/* Vertical Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                    {(['all', 'ecommerce', 'legal', 'supply', 'cyber'] as const).map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilter(cat)}
                            aria-pressed={filter === cat}
                            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all border ${
                                filter === cat
                                    ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md'
                                    : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            {cat === 'all' ? 'All Verticals (5)' : cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFleet.map((agent) => (
                    <div
                        key={agent.id}
                        className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80">
                                    {agent.icon}
                                </div>
                                <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${agent.colorClass}`}>
                                    {agent.categoryLabel}
                                </span>
                            </div>

                            <div>
                                <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-lg">
                                    {agent.name}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                    {agent.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500">{agent.statLabel}</span>
                                <span className="font-bold text-cyan-600 dark:text-cyan-400 font-mono">
                                    {agent.statValue}
                                </span>
                            </div>
                            <button type="button" onClick={() => setSelectedAgent(agent)} aria-label={`Inspect ${agent.name} specification`} className="w-full py-2 bg-zinc-100 hover:bg-cyan-500 hover:text-zinc-950 dark:bg-zinc-800 dark:hover:bg-cyan-500 dark:hover:text-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all flex items-center justify-center gap-1.5">
                                <span>Inspect Agent Spec</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedAgent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedAgent(null); }}>
                    <section role="dialog" aria-modal="true" aria-labelledby="fleet-spec-title" className="w-full max-w-lg rounded-2xl border border-zinc-700 bg-white p-6 shadow-2xl dark:bg-zinc-900">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-cyan-600">{selectedAgent.categoryLabel} · Demo specification</p>
                                <h3 id="fleet-spec-title" className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">{selectedAgent.name}</h3>
                            </div>
                            <button type="button" autoFocus onClick={() => setSelectedAgent(null)} className="rounded-lg px-3 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Close</button>
                        </div>
                        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">{selectedAgent.description}</p>
                        <div className="mt-5 rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-800">
                            <span className="text-zinc-500 dark:text-zinc-400">{selectedAgent.statLabel}</span>
                            <strong className="ml-2 text-cyan-700 dark:text-cyan-300">{selectedAgent.statValue}</strong>
                        </div>
                        <p className="mt-4 text-xs text-zinc-500">Catalog preview only. Integrations and live agent operations are not connected here.</p>
                    </section>
                </div>
            )}
        </section>
    );
};
