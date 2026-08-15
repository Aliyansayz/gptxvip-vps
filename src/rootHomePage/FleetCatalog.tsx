import React, { useState } from 'react';
import { ShoppingCart, Scale, Box, Shield, ArrowRight, Zap, CheckCircle2, Search, BarChart3, Bot, Terminal } from 'lucide-react';

interface FleetAgent {
    id: string;
    name: string;
    category: 'fintech' | 'ecommerce' | 'legal' | 'supply' | 'cyber';
    categoryLabel: string;
    description: string;
    statLabel: string;
    statValue: string;
    icon: React.ReactNode;
    colorClass: string;
    badgeColor: string;
    tags: string[];
}

interface FleetCatalogProps {
    onDeployAgent?: (agentName: string) => void;
}

export const FleetCatalog: React.FC<FleetCatalogProps> = ({ onDeployAgent }) => {
    const [filter, setFilter] = useState<'all' | 'fintech' | 'ecommerce' | 'legal' | 'supply' | 'cyber'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fleet: FleetAgent[] = [
        {
            id: 'equity-valuation-analyst',
            name: 'Equity Valuation & DCF Fundamental Analyst',
            category: 'fintech',
            categoryLabel: 'EQUITY & ACCOUNTING',
            description: 'Parses SEC 10-K & 10-Q filings, computes multi-stage DCF intrinsic valuations, WACC discount rates, and performs automated DuPont accounting ratio decomposition.',
            statLabel: 'Intrinsic Valuation Accuracy:',
            statValue: '99.8% Audit Match',
            icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
            colorClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            tags: ['SEC EDGAR 10-K', 'DCF & WACC', 'DuPont Analysis', 'GAAP / Non-GAAP']
        },
        {
            id: 'cart-sentinel',
            name: 'Cart Recovery Sentinel',
            category: 'ecommerce',
            categoryLabel: 'ECOMMERCE',
            description: 'Monitors checkout exit intent and executes personalized multi-channel recovery incentives via WhatsApp, SMS, and Klaviyo with dynamic coupon logic.',
            statLabel: 'Avg. Recovery:',
            statValue: '+24.8% Revenue',
            icon: <ShoppingCart className="w-5 h-5 text-cyan-500" />,
            colorClass: 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
            badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
            tags: ['Shopify Plus', 'Klaviyo', 'WhatsApp API']
        },
        {
            id: 'margin-guard',
            name: 'Dynamic Margin Guard',
            category: 'ecommerce',
            categoryLabel: 'ECOMMERCE',
            description: 'Tracks competitor catalog pricing and shifts Shopify & Amazon Buy-Box pricing in sub-second intervals while strictly enforcing gross margin floors.',
            statLabel: 'Margin Protection:',
            statValue: '100% Automated',
            icon: <Zap className="w-5 h-5 text-emerald-500" />,
            colorClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
            badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
            tags: ['Amazon Buy-Box', 'Shopify', 'COGS Tracking']
        },
        {
            id: 'contract-redliner',
            name: 'Enterprise Contract Redliner',
            category: 'legal',
            categoryLabel: 'LEGAL & IP',
            description: 'Parses inbound MSAs, NDAs, and vendor SLAs against custom corporate risk playbooks to output tracked DOCX edits in under 15 seconds.',
            statLabel: 'Review Speed:',
            statValue: '< 15 Seconds',
            icon: <Scale className="w-5 h-5 text-cyan-500" />,
            colorClass: 'border-cyan-500/30 text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
            badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
            tags: ['Docx Playbooks', 'Ironclad Sync', 'Liability Caps']
        },
        {
            id: 'inventory-predictor',
            name: 'Inventory Risk Predictor',
            category: 'supply',
            categoryLabel: 'SUPPLY CHAIN',
            description: 'Reconciles real-time demand forecasting with global freight lead times to trigger automated purchase orders directly in SAP and NetSuite ERP.',
            statLabel: 'Stockouts Prevented:',
            statValue: '99.4% Reduction',
            icon: <Box className="w-5 h-5 text-amber-500" />,
            colorClass: 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10',
            badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
            tags: ['SAP S/4HANA', 'Oracle NetSuite', 'AIS Maritime']
        },
        {
            id: 'soc2-auditor',
            name: 'SOC 2 Evidence Auditor',
            category: 'cyber',
            categoryLabel: 'CYBERSECURITY',
            description: 'Continuously gathers non-repudiation audit proof from GitHub, AWS IAM, Okta, and HR platforms to keep enterprise compliance live 24/7.',
            statLabel: 'Audit Readiness:',
            statValue: 'Continuous 24/7',
            icon: <Shield className="w-5 h-5 text-purple-500" />,
            colorClass: 'border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/10',
            badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
            tags: ['AWS S3 Audit', 'Vanta/Drata Sync', 'GitHub Actions']
        }
    ];

    const filteredFleet = fleet.filter(agent => {
        const matchesCategory = filter === 'all' || agent.category === filter;
        const matchesSearch = searchQuery === '' || 
            agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            agent.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <section id="fleet-catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                <span className="px-3.5 py-1.5 bg-zinc-900 text-cyan-400 dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-1.5 shadow-sm">
                    <Bot className="w-3.5 h-3.5" />
                    Autonomous Fleet Catalog
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    Specialized Autonomous Enterprise Fleet
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                    Select an operational domain or search capabilities to inspect zero-trust autonomous workers pre-trained for your stack.
                </p>

                {/* Search and Filter Bar */}
                <div className="pt-4 max-w-xl mx-auto space-y-4">
                    <div className="relative">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search agents by name, stack, or ERP connector..."
                            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {(['all', 'fintech', 'ecommerce', 'legal', 'supply', 'cyber'] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all border cursor-pointer ${
                                    filter === cat
                                        ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md font-extrabold'
                                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'
                                }`}
                            >
                                {cat === 'all' ? 'All Swarms' : cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFleet.map((agent) => (
                    <div
                        key={agent.id}
                        className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300 group"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 group-hover:scale-105 transition-transform">
                                    {agent.icon}
                                </div>
                                <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${agent.badgeColor}`}>
                                    {agent.categoryLabel}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    {agent.name}
                                </h3>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                                    {agent.description}
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {agent.tags.map((tag, idx) => (
                                    <span key={idx} className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Stats & Deploy CTA */}
                        <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 mt-5 space-y-3">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">{agent.statLabel}</span>
                                <span className="font-mono font-black text-emerald-500">{agent.statValue}</span>
                            </div>

                            <button
                                onClick={() => onDeployAgent && onDeployAgent(agent.name)}
                                className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-cyan-500 dark:bg-zinc-800 dark:hover:bg-cyan-500 text-zinc-900 dark:text-zinc-100 hover:text-zinc-950 dark:hover:text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                <span>Deploy Agent Fleet</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FleetCatalog;
