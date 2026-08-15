import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Bot, Scale, ShoppingBag, Ship, ShieldCheck, Activity, Cpu, Sparkles } from 'lucide-react';

interface SwarmNode {
    id: string;
    label: string;
    domain: string;
    metric: string;
    color: string;
    glowColor: string;
    x: number;
    y: number;
    icon: React.ReactNode;
}

export const HeroBannerSvg: React.FC = () => {
    const [activeNode, setActiveNode] = useState<string | null>(null);

    const nodes: SwarmNode[] = [
        {
            id: 'valuation',
            label: 'Equity Valuation & DCF',
            domain: 'FINHUB CORE',
            metric: '10-K parsed • +18.4% upside',
            color: '#10b981',
            glowColor: 'rgba(16, 185, 129, 0.4)',
            x: 100,
            y: 190,
            icon: <BarChart3 className="w-4 h-4 text-emerald-400" />
        },
        {
            id: 'legal',
            label: 'Legal MSA Redlining',
            domain: 'LEGAL & IP',
            metric: '400ms • Liability capped',
            color: '#06b6d4',
            glowColor: 'rgba(6, 182, 212, 0.4)',
            x: 230,
            y: 80,
            icon: <Scale className="w-4 h-4 text-cyan-400" />
        },
        {
            id: 'ecommerce',
            label: 'Dynamic Margin Guard',
            domain: 'ECOMMERCE',
            metric: '38% Gross Margin floor locked',
            color: '#3b82f6',
            glowColor: 'rgba(59, 130, 246, 0.4)',
            x: 570,
            y: 80,
            icon: <ShoppingBag className="w-4 h-4 text-blue-400" />
        },
        {
            id: 'supply',
            label: 'Maritime PO Re-Routing',
            domain: 'LOGISTICS & ERP',
            metric: 'SAP PO split • Saved $420k',
            color: '#f59e0b',
            glowColor: 'rgba(245, 158, 11, 0.4)',
            x: 230,
            y: 300,
            icon: <Ship className="w-4 h-4 text-amber-400" />
        },
        {
            id: 'security',
            label: 'Continuous SOC 2 Audit',
            domain: 'ZERO-TRUST CYBER',
            metric: 'Continuous evidence logging',
            color: '#8b5cf6',
            glowColor: 'rgba(139, 92, 246, 0.4)',
            x: 570,
            y: 300,
            icon: <ShieldCheck className="w-4 h-4 text-purple-400" />
        },
        {
            id: 'react',
            label: 'Autonomous ReAct Swarms',
            domain: 'AGENTOS ENGINE',
            metric: '14,200+ workflows live',
            color: '#10b981',
            glowColor: 'rgba(16, 185, 129, 0.4)',
            x: 700,
            y: 190,
            icon: <Bot className="w-4 h-4 text-emerald-400" />
        }
    ];

    return (
        <div className="w-full relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-900/90 dark:bg-zinc-950/95 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
            {/* Subtle background gradient & dots pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Banner Strip */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-zinc-800/80 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono font-bold text-zinc-200 tracking-wide">
                        DEV-LUSH AGENTOS // ORCHESTRATOR TOPOLOGY
                    </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-cyan-400">
                        <Activity className="w-3.5 h-3.5" /> 100% Deterministic Guard
                    </span>
                    <span className="hidden sm:inline-block text-zinc-600">•</span>
                    <span className="hidden sm:inline-block text-zinc-400">
                        Zero Data Retention Architecture
                    </span>
                </div>
            </div>

            {/* Interactive Vector Canvas */}
            <div className="relative w-full aspect-[16/8] min-h-[280px] max-h-[380px]">
                <svg
                    viewBox="0 0 800 380"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full select-none"
                >
                    <defs>
                        {/* Glow Filter */}
                        <filter id="vectorGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>

                        {/* Connection Line Gradient */}
                        <linearGradient id="netGrad" x1="0" y1="0" x2="800" y2="380" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>

                    {/* Network Connection Lines */}
                    <g stroke="url(#netGrad)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.45">
                        {nodes.map((node) => (
                            <line
                                key={`line-${node.id}`}
                                x1="400"
                                y1="190"
                                x2={node.x}
                                y2={node.y}
                            />
                        ))}
                        {/* Outer Perimeter Mesh */}
                        <path d="M 100 190 L 230 80 L 570 80 L 700 190 L 570 300 L 230 300 Z" fill="none" opacity="0.3" />
                    </g>

                    {/* Dynamic Moving Particles */}
                    <motion.circle
                        r="3.5"
                        fill="#06b6d4"
                        filter="url(#vectorGlow)"
                        animate={{
                            cx: [100, 400, 700, 570, 400, 230, 100],
                            cy: [190, 190, 190, 80, 190, 300, 190],
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    />
                    <motion.circle
                        r="3.5"
                        fill="#10b981"
                        filter="url(#vectorGlow)"
                        animate={{
                            cx: [700, 400, 100, 230, 400, 570, 700],
                            cy: [190, 190, 190, 80, 190, 300, 190],
                        }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    />

                    {/* Central Core Orchestrator Hub */}
                    <g transform="translate(400, 190)" className="cursor-pointer">
                        <circle r="44" fill="#09090b" stroke="#06b6d4" strokeWidth="2.5" filter="url(#vectorGlow)" />
                        <circle r="34" fill="#06b6d4" fillOpacity="0.15" />
                        
                        {/* Rotating Concentric Ring */}
                        <motion.circle
                            r="38"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="16 24 8 16"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                        />
                        <motion.circle
                            r="28"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="1"
                            strokeDasharray="10 18"
                            animate={{ rotate: -360 }}
                            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        />

                        {/* Core Icon */}
                        <circle r="6" fill="#67e8f9" />
                        <text y="58" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="system-ui, sans-serif">
                            ORCHESTRATOR
                        </text>
                        <text y="70" textAnchor="middle" fill="#06b6d4" fontSize="8.5" fontWeight="700" fontFamily="monospace">
                            ADAPT ENGINE
                        </text>
                    </g>

                    {/* Nodes Render */}
                    {nodes.map((node) => {
                        const isHovered = activeNode === node.id;
                        return (
                            <g
                                key={node.id}
                                transform={`translate(${node.x}, ${node.y})`}
                                onMouseEnter={() => setActiveNode(node.id)}
                                onMouseLeave={() => setActiveNode(null)}
                                className="cursor-pointer transition-transform duration-200"
                            >
                                <circle
                                    r={isHovered ? 26 : 22}
                                    fill="#09090b"
                                    stroke={node.color}
                                    strokeWidth={isHovered ? 2.5 : 1.8}
                                    filter="url(#vectorGlow)"
                                />
                                <circle
                                    r={isHovered ? 20 : 16}
                                    fill={node.color}
                                    fillOpacity={isHovered ? 0.35 : 0.18}
                                />
                                
                                {/* Label beneath node */}
                                <text
                                    y={node.y > 190 ? 36 : -30}
                                    textAnchor="middle"
                                    fill="#e4e4e7"
                                    fontSize="10"
                                    fontWeight="700"
                                    fontFamily="system-ui, sans-serif"
                                >
                                    {node.label}
                                </text>
                                <text
                                    y={node.y > 190 ? 48 : -18}
                                    textAnchor="middle"
                                    fill={node.color}
                                    fontSize="8"
                                    fontWeight="700"
                                    fontFamily="monospace"
                                >
                                    {node.domain}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Floating Active Info Overlay */}
                {activeNode && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-4 py-2 bg-zinc-900/95 border border-cyan-500/40 rounded-xl shadow-xl backdrop-blur-md text-xs flex items-center gap-3 animate-in fade-in zoom-in-95 duration-150">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        <span className="font-bold text-white">
                            {nodes.find(n => n.id === activeNode)?.label}:
                        </span>
                        <span className="font-mono text-cyan-300">
                            {nodes.find(n => n.id === activeNode)?.metric}
                        </span>
                    </div>
                )}
            </div>

            {/* Bottom Swarm Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 text-left text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Valuation Latency</p>
                    <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">&lt; 3 Seconds</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Active Swarm Agents</p>
                    <p className="text-sm font-bold font-mono text-cyan-400 mt-0.5">14,200+ Deployed</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Security Framework</p>
                    <p className="text-sm font-bold font-mono text-purple-400 mt-0.5">ADAPT Zero-Trust</p>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Data Retention</p>
                    <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">0.00% Retained</p>
                </div>
            </div>
        </div>
    );
};

export default HeroBannerSvg;
