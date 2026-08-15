import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Play, Layers, Cpu, Shield, CheckCircle2, ArrowRight, BarChart2, Sparkles, Terminal, Activity } from 'lucide-react';
import { HeroBannerSvg } from './HeroBannerSvg';

interface HeroSectionProps {
    onExploreCatalog: () => void;
    onBookDemo: () => void;
    onNavigateFinhub?: () => void;
}

type TerminalCategory = 'all' | 'valuation' | 'legal' | 'ecommerce' | 'cyber';

export const HeroSection: React.FC<HeroSectionProps> = ({ 
    onExploreCatalog, 
    onBookDemo,
    onNavigateFinhub 
}) => {
    const [selectedCategory, setSelectedCategory] = useState<TerminalCategory>('all');
    const [terminalLogs, setTerminalLogs] = useState([
        { id: 1, category: 'valuation', source: 'EQUITY-DCF', time: 'Just now', trigger: 'SEC 10-K ingested for AAPL (FY25 Q4).', action: 'Computed 3-statement DCF & WACC model. Intrinsic upside +18.4%.', color: 'text-emerald-400', badge: 'VALUATION' },
        { id: 2, category: 'ecommerce', source: 'MARGIN-GUARD', time: '1m ago', trigger: 'Competitor dropped price on #1 Amazon Buy-Box.', action: 'Automated repricing within 380ms. Guaranteed 38% gross margin floor.', color: 'text-cyan-400', badge: 'ECOMMERCE' },
        { id: 3, category: 'legal', source: 'LEGAL-MSA', time: '3m ago', trigger: 'Inbound vendor MSA contract uploaded by Procurement.', action: 'Flagged uncapped liability clause. Auto-substituted 3x annual cap.', color: 'text-purple-400', badge: 'LEGAL & IP' }
    ]);

    const simulateLog = () => {
        const pool = [
            { id: Date.now() + 1, category: 'cyber', source: 'CYBER-SECOPS', time: 'Just now', trigger: 'Automated AWS S3 bucket posture drift detected.', action: 'SOC 2 evidence recorded. Public access auto-remediated.', color: 'text-amber-400', badge: 'SECOPS' },
            { id: Date.now() + 2, category: 'valuation', source: 'EQUITY-DUPONT', time: 'Just now', trigger: 'DuPont 5-stage return decomposition triggered for MSFT.', action: 'Identified operating margin expansion (+240bps) and asset turnover trend.', color: 'text-emerald-400', badge: 'VALUATION' },
            { id: Date.now() + 3, category: 'ecommerce', source: 'CART-SENTINEL', time: 'Just now', trigger: 'High-intent cart abandoned ($740.00 order value).', action: 'Dispatched dynamic SMS coupon via Klaviyo. Cart recovered in 80s.', color: 'text-cyan-400', badge: 'ECOMMERCE' },
            { id: Date.now() + 4, category: 'valuation', source: 'ACCOUNTING-AUDIT', time: 'Just now', trigger: 'GAAP vs non-GAAP EBITDA reconciliation completed on 10-Q filing.', action: 'Auto-audited capitalization of R&D expenses with zero discrepancy.', color: 'text-emerald-400', badge: 'VALUATION' }
        ];
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        setTerminalLogs(prev => [randomItem, ...prev.slice(0, 3)]);
    };

    const filteredLogs = selectedCategory === 'all'
        ? terminalLogs
        : terminalLogs.filter(l => l.category === selectedCategory);

    return (
        <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 border-b border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
            {/* Soft Ambient Radial Backgrounds */}
            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
                
                {/* Hero Main Grid: Headline & Telemetry Terminal */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Headline, Value Proposition & Actions */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        
                        {/* Live Platform Badge */}
                        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bold">devLush AgentOS 4.0 &amp; Finhub Lab</span>
                            <span className="hidden sm:inline">• Enterprise Autonomous Intelligence</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                        </div>

                        {/* Main Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
                            Deploy Autonomous <br />
                            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 bg-clip-text text-transparent">
                                Enterprise AI Swarms
                            </span>
                            <br />
                            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-700 dark:text-zinc-300">
                                &amp; Equity Valuation Intelligence
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Eliminate enterprise friction with zero-trust autonomous agent fleets and fundamental valuation models engineered for <strong>Equity Valuation &amp; Accounting</strong>, <strong>Legal &amp; IP</strong>, <strong>Ecommerce</strong>, and <strong>Continuous SOC 2 Compliance</strong>.
                        </p>

                        {/* Primary CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <button 
                                onClick={onBookDemo}
                                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Zap className="w-4 h-4 fill-zinc-950" />
                                <span>Deploy Agent Swarms</span>
                            </button>

                            <button 
                                onClick={onExploreCatalog}
                                className="px-5 py-3.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs sm:text-sm font-semibold border border-zinc-200 dark:border-zinc-800 transition-all flex items-center gap-2 cursor-pointer hover:border-cyan-500/50"
                            >
                                <Layers className="w-4 h-4 text-cyan-500" />
                                <span>Explore Swarm Fleet</span>
                            </button>

                            {onNavigateFinhub && (
                                <button 
                                    onClick={onNavigateFinhub}
                                    className="px-5 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    <BarChart2 className="w-4 h-4 text-emerald-500" />
                                    <span>Finhub Equity Lab</span>
                                </button>
                            )}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80 text-xs sm:text-sm">
                            <div className="space-y-0.5">
                                <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">14,200+</p>
                                <p className="text-xs text-zinc-500 font-medium">Production Workflows</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">&lt; 400ms</p>
                                <p className="text-xs text-zinc-500 font-medium">Repricing &amp; Redline Speed</p>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xl sm:text-2xl font-black text-cyan-500 font-mono">100%</p>
                                <p className="text-xs text-zinc-500 font-medium">SOC 2 &amp; Zero Retention</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Sleek Live Telemetry Terminal */}
                    <div className="lg:col-span-5">
                        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-5 sm:p-6 shadow-2xl space-y-4 text-zinc-100 relative overflow-hidden backdrop-blur-xl">
                            
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                    <span className="text-xs text-zinc-400 font-mono ml-2">agentos // telemetry</span>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    SWARMS ONLINE
                                </span>
                            </div>

                            {/* Category Filter Pills for Terminal */}
                            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                                {(
                                    [
                                        { id: 'all', label: 'ALL' },
                                        { id: 'valuation', label: 'VALUATION' },
                                        { id: 'legal', label: 'LEGAL' },
                                        { id: 'ecommerce', label: 'ECOMMERCE' },
                                        { id: 'cyber', label: 'SECOPS' }
                                    ] as const
                                ).map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                                            selectedCategory === cat.id
                                                ? 'bg-cyan-500 text-zinc-950 font-bold'
                                                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                                        }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Live Terminal Log Stream */}
                            <div className="space-y-2.5 font-mono text-xs text-zinc-300 min-h-[210px]">
                                <AnimatePresence initial={false}>
                                    {filteredLogs.map((log) => (
                                        <motion.div 
                                            key={log.id}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="p-3 bg-zinc-900/90 rounded-xl border border-zinc-800 space-y-1 shadow-sm text-left"
                                        >
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className={`font-bold ${log.color}`}>[{log.source}]</span>
                                                <span className="text-zinc-500 text-[10px]">{log.time}</span>
                                            </div>
                                            <p className="text-zinc-200 text-xs">{log.trigger}</p>
                                            <p className="text-zinc-400 text-[11px]">&rarr; {log.action}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Terminal Action Bar */}
                            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Stream: 142 events/min</span>
                                </span>
                                <button 
                                    onClick={simulateLog} 
                                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1.5 font-bold cursor-pointer"
                                >
                                    <Play className="w-3 h-3 fill-cyan-400" />
                                    <span>Inject Event</span>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>

                {/* Vector Architecture Banner */}
                <div className="pt-2">
                    <HeroBannerSvg />
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
