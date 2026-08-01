import React from 'react';
import { motion } from 'framer-motion';

export const HeroBannerSvg: React.FC = () => {
    return (
        <div className="w-full h-auto relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4 sm:p-6 shadow-2xl">
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

            <svg
                viewBox="0 0 800 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full relative z-10"
            >
                <defs>
                    {/* Gradients */}
                    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id="emeraldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
                    </linearGradient>

                    <linearGradient id="lineGrad" x1="0" y1="0" x2="800" y2="450" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                    </linearGradient>

                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Connecting Swarm Cables / Paths */}
                <g stroke="url(#lineGrad)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4">
                    <path d="M 120 225 L 260 120 L 400 225 L 540 120 L 680 225" />
                    <path d="M 120 225 L 260 330 L 400 225 L 540 330 L 680 225" />
                    <path d="M 260 120 L 260 330" />
                    <path d="M 540 120 L 540 330" />
                    <path d="M 400 80 L 400 370" />
                </g>

                {/* Central Orchestrator Core */}
                <g transform="translate(400, 225)">
                    <circle r="45" fill="#09090b" stroke="#06b6d4" strokeWidth="2.5" filter="url(#glow)" />
                    <circle r="32" fill="url(#cyanGlow)" opacity="0.3" />
                    
                    {/* Rotating Core Ring */}
                    <motion.circle
                        r="38"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="20 40 10 30"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    />
                    
                    {/* Inner Core Icon Graphic */}
                    <path d="M-10 -10 L10 -10 L10 10 L-10 10 Z" fill="none" stroke="#67e8f9" strokeWidth="2" />
                    <circle r="4" fill="#67e8f9" />
                    <text y="60" textAnchor="middle" fill="#f4f4f5" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                        AGENT-OS CORE
                    </text>
                </g>

                {/* Swarm Node 1: Ecommerce (Top Left) */}
                <g transform="translate(260, 120)">
                    <rect x="-30" y="-30" width="60" height="60" rx="14" fill="#09090b" stroke="#10b981" strokeWidth="2" filter="url(#glow)" />
                    <rect x="-24" y="-24" width="48" height="48" rx="10" fill="url(#emeraldGlow)" opacity="0.2" />
                    <path d="M-8 -4 L-2 -12 L4 -12 L10 -4 L-8 -4 Z M-6 0 L8 0 L6 10 L-4 10 Z" fill="none" stroke="#34d399" strokeWidth="2" />
                    <text y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                        ECOMMERCE
                    </text>
                </g>

                {/* Swarm Node 2: Legal (Top Right) */}
                <g transform="translate(540, 120)">
                    <rect x="-30" y="-30" width="60" height="60" rx="14" fill="#09090b" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
                    <rect x="-24" y="-24" width="48" height="48" rx="10" fill="url(#cyanGlow)" opacity="0.2" />
                    <path d="M-8 -8 L8 -8 M0 -8 L0 10 M-10 10 L10 10" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                    <text y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                        LEGAL & IP
                    </text>
                </g>

                {/* Swarm Node 3: Supply Chain (Bottom Left) */}
                <g transform="translate(260, 330)">
                    <rect x="-30" y="-30" width="60" height="60" rx="14" fill="#09090b" stroke="#f59e0b" strokeWidth="2" filter="url(#glow)" />
                    <rect x="-24" y="-24" width="48" height="48" rx="10" fill="#f59e0b" opacity="0.15" />
                    <path d="M-10 -6 L0 -12 L10 -6 L10 6 L0 12 L-10 6 Z M-10 -6 L0 0 L10 -6 M0 0 L0 12" fill="none" stroke="#fbbf24" strokeWidth="2" />
                    <text y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                        SUPPLY CHAIN
                    </text>
                </g>

                {/* Swarm Node 4: Cybersecurity (Bottom Right) */}
                <g transform="translate(540, 330)">
                    <rect x="-30" y="-30" width="60" height="60" rx="14" fill="#09090b" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow)" />
                    <rect x="-24" y="-24" width="48" height="48" rx="10" fill="url(#purpleGlow)" opacity="0.2" />
                    <path d="M0 -10 L10 -5 L10 4 C10 10 0 14 0 14 C0 14 -10 10 -10 4 L-10 -5 Z" fill="none" stroke="#c084fc" strokeWidth="2" />
                    <text y="48" textAnchor="middle" fill="#a1a1aa" fontSize="10" fontWeight="600" fontFamily="sans-serif">
                        CYBER SEC
                    </text>
                </g>

                {/* Outer Ingest Endpoints */}
                <g transform="translate(120, 225)">
                    <circle r="20" fill="#09090b" stroke="#71717a" strokeWidth="2" />
                    <text textAnchor="middle" y="4" fill="#e4e4e7" fontSize="9" fontWeight="700">API</text>
                    <text y="34" textAnchor="middle" fill="#71717a" fontSize="9">Ingest</text>
                </g>

                <g transform="translate(680, 225)">
                    <circle r="20" fill="#09090b" stroke="#71717a" strokeWidth="2" />
                    <text textAnchor="middle" y="4" fill="#e4e4e7" fontSize="9" fontWeight="700">ERP</text>
                    <text y="34" textAnchor="middle" fill="#71717a" fontSize="9">Exec</text>
                </g>

                {/* Animated Data Pulses */}
                <motion.circle
                    r="4"
                    fill="#38bdf8"
                    animate={{
                        cx: [120, 260, 400, 540, 680],
                        cy: [225, 120, 225, 120, 225]
                    }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                />
                <motion.circle
                    r="4"
                    fill="#34d399"
                    animate={{
                        cx: [680, 540, 400, 260, 120],
                        cy: [225, 330, 225, 330, 225]
                    }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                />
            </svg>
        </div>
    );
};
