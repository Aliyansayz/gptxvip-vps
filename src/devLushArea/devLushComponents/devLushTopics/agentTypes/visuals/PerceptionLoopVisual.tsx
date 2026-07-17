import React from 'react';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';

export const PerceptionLoopVisual: React.FC<{ analogyName?: string }> = ({ analogyName }) => {
    return (
            <div className="my-4 p-5 bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Radio className="w-4 h-4 animate-pulse" />
                    </span>
                    <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                        Concept: Perception-Reasoning-Action Loop
                    </h5>
                </div>
                
                {/* Visual Canvas */}
                <div className="relative w-full h-48 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between p-3">
                    <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
                    
                    <div className="flex justify-between items-start z-10">
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                          SYS_STATUS: ACTIVE_LOOP
                        </span>
                        <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40 animate-pulse">
                          MODEL: OMNI_FLASH
                        </span>
                    </div>

                    {/* SVG diagram representing autonomous drone scanning */}
                    <svg viewBox="0 0 400 120" className="w-full h-24 z-10">
                        {/* Central Agent brain */}
                        <g transform="translate(180, 40)">
                            <rect x="-30" y="-15" width="60" height="30" rx="4" fill="#022c22" stroke="#10b981" strokeWidth="1.5" />
                            <text x="0" y="3" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">LLM AGENT</text>
                        </g>

                        {/* Environment state / Targets */}
                        <g transform="translate(30, 40)">
                            <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
                            <text x="0" y="3" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="monospace">ENV STATUS</text>
                        </g>

                        <g transform="translate(330, 40)">
                            <rect x="-25" y="-15" width="50" height="30" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                            <text x="0" y="3" fill="#fda4af" fontSize="7" textAnchor="middle" fontFamily="monospace">EXPLOIT TOOL</text>
                        </g>

                        {/* Connectors / Flow of Loop */}
                        {/* Perceive: Env -> Agent */}
                        <path d="M 55 45 C 100 45, 110 30, 140 30" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
                        <motion.circle r="3" fill="#10b981" animate={{ cx: [55, 140], cy: [45, 30] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                        <text x="95" y="25" fill="#10b981" fontSize="7" fontFamily="monospace" textAnchor="middle">1. PERCEIVE</text>

                        {/* Reason: Internal logic circular ring */}
                        <motion.circle cx="180" cy="40" r="22" fill="none" stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 4" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} />
                        <text x="180" y="10" fill="#06b6d4" fontSize="7" fontFamily="monospace" textAnchor="middle">2. REASON</text>

                        {/* Act: Agent -> Tool */}
                        <path d="M 220 30 C 250 30, 260 45, 305 45" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                        <motion.circle r="3" fill="#06b6d4" animate={{ cx: [220, 305], cy: [30, 45] }} transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }} />
                        <text x="260" y="25" fill="#06b6d4" fontSize="7" fontFamily="monospace" textAnchor="middle">3. ACTION</text>
                    </svg>

                    <div className="text-[10px] text-slate-400 text-center z-10 bg-slate-900/85 py-1 px-2 rounded border border-emerald-950">
                        Autonomous loops replace static templates with dynamic tool responses.
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Perception Loop Analogy:</strong> A military drone doesn't follow a hardcoded flight plan. It continuously sweeps the field, receives live radar data (Perceive), calculates target threat level (Reason), and engages optimal tactics (Action) dynamically.
                </p>
            </div>
        );
};
