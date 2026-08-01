import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, Layers, Cpu, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { HeroBannerSvg } from './HeroBannerSvg';

interface HeroSectionProps {
    onExploreCatalog: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCatalog }) => {
    const [terminalLogs, setTerminalLogs] = useState([
        { source: 'ECOMMERCE', time: 'Just now', trigger: 'Cart abandoned ($420.00 value).', action: 'Executed SMS discount offer tool via Klaviyo. Cart recovered.', color: 'text-emerald-400' },
        { source: 'LEGAL', time: '2m ago', trigger: 'MSA uploaded by Sales Team.', action: 'Flagged uncapped liability clause. Replaced with 3x contract cap.', color: 'text-cyan-400' },
        { source: 'SUPPLY', time: '5m ago', trigger: 'Port congestion alert (Suez Canal).', action: 'Re-routed 4 containers via air freight in SAP ERP.', color: 'text-amber-400' }
    ]);

    const simulateLog = () => {
        const logsPool = [
            { source: 'CYBER', time: 'Just now', trigger: 'Automated AWS S3 scan.', action: 'SOC 2 evidence recorded. Public bucket access auto-remediated.', color: 'text-purple-400' },
            { source: 'FINANCE', time: 'Just now', trigger: 'Inbound invoice anomaly.', action: 'Reconciled double-billing attempt with NetSuite ledger.', color: 'text-emerald-400' },
            { source: 'HEALHTCARE', time: 'Just now', trigger: 'HIPAA consent log verification.', action: 'Auto-scrubbed PII from diagnostic telemetry queue.', color: 'text-cyan-400' }
        ];
        const randomLog = logsPool[Math.floor(Math.random() * logsPool.length)];
        setTerminalLogs(prev => [randomLog, ...prev.slice(0, 2)]);
    };

    return (
        <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-200 dark:border-zinc-800">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
                
                {/* Hero Header + Terminal Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column: Headline & CTAs */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-bold">devLush AgentOS 4.0</span>
                            <span className="hidden sm:inline">• Multi-Agent Autonomous Swarm Framework</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.12]">
                            Deploy Autonomous <br />
                            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                Enterprise AI Swarms
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Eliminate operational bottlenecks with pre-trained autonomous agent fleets built for <strong>Ecommerce</strong>, <strong>Legal & IP</strong>, <strong>Supply Chain</strong>, and <strong>Cybersecurity Compliance</strong>.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button 
                                onClick={onExploreCatalog}
                                className="px-7 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                <span>Deploy Agent Swarm</span>
                            </button>

                            <button 
                                onClick={onExploreCatalog}
                                className="px-6 py-3.5 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-300 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-sm font-semibold border border-zinc-300 dark:border-zinc-800 transition-all flex items-center gap-2"
                            >
                                <Layers className="w-4 h-4 text-cyan-500" />
                                <span>Explore Swarm Catalog</span>
                            </button>
                        </div>

                        {/* Key Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 text-xs sm:text-sm">
                            <div>
                                <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 font-mono">14,200+</p>
                                <p className="text-xs text-zinc-500 font-medium">Active Swarm Workflows</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-black text-emerald-500 font-mono">&lt;450ms</p>
                                <p className="text-xs text-zinc-500 font-medium">Average ERP Response</p>
                            </div>
                            <div>
                                <p className="text-xl sm:text-2xl font-black text-cyan-500 font-mono">100%</p>
                                <p className="text-xs text-zinc-500 font-medium">SOC 2 & GDPR Compliant</p>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Live Interactive Agent Terminal */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 shadow-2xl space-y-4 text-zinc-100">
                            {/* Terminal Top Bar */}
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                                <div className="flex items-center space-x-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                                    <span className="text-xs text-zinc-500 font-mono ml-2">agentos-core // swarm-fleet</span>
                                </div>
                                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    SWARM ONLINE
                                </span>
                            </div>

                            {/* Terminal Feed */}
                            <div className="space-y-3 font-mono text-xs text-zinc-300 min-h-[220px]">
                                {terminalLogs.map((log, index) => (
                                    <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 bg-zinc-900/80 rounded-lg border border-zinc-800/80 space-y-1"
                                    >
                                        <div className="flex items-center justify-between text-[11px]">
                                            <span className={`font-bold ${log.color}`}>[{log.source} AGENT]</span>
                                            <span className="text-zinc-500 text-[10px]">{log.time}</span>
                                        </div>
                                        <p className="text-zinc-200">{log.trigger}</p>
                                        <p className="text-zinc-400 text-[11px]">&rarr; {log.action}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Terminal Footer Action */}
                            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                    Latency: 142ms
                                </span>
                                <button 
                                    onClick={simulateLog} 
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold"
                                >
                                    <Play className="w-3.5 h-3.5 fill-cyan-400" /> Trigger Test Event
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Hero Vector Banner Visualization */}
                <div className="pt-6">
                    <div className="text-center mb-4 space-y-1">
                        <span className="text-[11px] font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                            Swarm Network Visualizer
                        </span>
                        <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                            Zero-Trust Autonomous Node Mesh Topology
                        </h3>
                    </div>
                    <HeroBannerSvg />
                </div>

            </div>
        </section>
    );
};
