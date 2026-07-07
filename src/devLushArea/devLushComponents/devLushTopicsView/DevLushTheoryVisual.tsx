import React from 'react';
import { motion } from 'motion/react';
import { Key, Ticket, UserCheck, ShieldAlert, Coins, Lock, Package, Sparkles, Radio, Bot, Target, Layers } from 'lucide-react';

interface DevLushTheoryVisualProps {
    analogyName: string;
    keywords: string[];
}

export const DevLushTheoryVisual: React.FC<DevLushTheoryVisualProps> = ({ analogyName, keywords }) => {
    const lowerKeywords = keywords.map(k => (k || '').toLowerCase());
    const has = (k: string) => lowerKeywords.some(kw => kw.includes(k));

    // 1. Perception-Reasoning-Action Loops (Autonomous Recon / Drone / Analyst)
    if (has('perception') || has('analyst') || has('scanning') || has('drone')) {
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
    }

    // 2. Prompt Injection Containment (Poisoned Translation / Hypnotist Teleprompter)
    if (has('translator') || has('teleprompter') || has('hypnotist') || has('poisoning') || has('hijacking')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-rose-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-rose-100 dark:border-rose-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-rose-500/10 rounded-lg text-rose-600 dark:text-rose-400">
                        <ShieldAlert className="w-4 h-4 animate-bounce" />
                    </span>
                    <h5 className="text-xs font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                        Concept: Prompt Injection Containment
                    </h5>
                </div>

                {/* Grid Visual representation */}
                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {/* Left: No Containment */}
                    <div className="p-2 bg-slate-900 rounded-lg border border-red-950 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-red-400">🚨 UNBOUNDED AGENT</span>
                        
                        <div className="my-3 flex flex-col gap-1 items-center">
                            <div className="text-[10px] font-bold text-red-500 line-through">System Instructions</div>
                            <span className="text-xl">💣</span>
                            <div className="text-[8px] text-red-400 bg-red-950/40 px-1 rounded animate-pulse">
                              "Format disk / C:"
                            </div>
                        </div>

                        <span className="text-[9px] text-slate-500 font-medium">Hijacked untrusted inputs gain shell level control.</span>
                    </div>

                    {/* Right: Isolation Sandbox */}
                    <div className="p-2 bg-slate-900 rounded-lg border border-emerald-950 flex flex-col justify-between">
                        <span className="text-[8px] font-mono text-emerald-400">🛡️ SECURE CONTAINMENT</span>

                        <div className="my-3 flex flex-col gap-1 items-center">
                            <div className="text-[10px] font-bold text-emerald-400">Strict Sandbox microVM</div>
                            <span className="text-xl">🧱🤖🧱</span>
                            <div className="text-[8px] text-emerald-400 bg-emerald-950/40 px-1 rounded">
                              "Explosion Isolated"
                            </div>
                        </div>

                        <span className="text-[9px] text-slate-500 font-medium">Kevlar microVM container absorbs host threat.</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Hypnotist Teleprompter Analogy:</strong> Asking an agent politely in prompts not to execute harmful text is like trusting a news anchor to ignore a hypnotic command injected directly into their teleprompter. Safe engineering uses container walls, not textual compliance.
                </p>
            </div>
        );
    }

    // 3. Developer Lens: Agent Architecture & Sandboxing (Bomb-Defusal Robot)
    if (has('bomb-defusal') || has('robot') || has('sandbox') || has('blast chamber') || has('kevlar')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-cyan-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-cyan-100 dark:border-cyan-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-600 dark:text-cyan-400">
                        <Bot className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-cyan-900 dark:text-cyan-300 uppercase tracking-wider">
                        Concept: MicroVM Blast Isolation
                    </h5>
                </div>

                {/* Interactive Visual Canvas */}
                <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-3">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:12px_12px]" />
                    
                    {/* The Blast Chamber (Thick Kevlar Walls) */}
                    <div className="relative w-72 h-36 border-4 border-cyan-500/40 bg-slate-900/90 rounded-2xl flex flex-col items-center justify-between p-2 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                        <div className="absolute top-1 right-2 text-[7px] font-mono text-cyan-400">KEVLAR CHAMBER SECURE</div>
                        
                        {/* Little robot & Sparking Bomb */}
                        <div className="flex-1 flex items-center justify-center gap-6">
                            <motion.div 
                                className="text-3xl"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                🤖
                            </motion.div>

                            <div className="relative">
                                <span className="text-3xl">💣</span>
                                <motion.span 
                                    className="absolute -top-1 -right-1 text-xs"
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    ⚡
                                </motion.span>
                            </div>
                        </div>

                        {/* Blast containment flash */}
                        <motion.div 
                            className="absolute inset-0 bg-red-600/30 rounded-xl mix-blend-screen pointer-events-none"
                            animate={{ opacity: [0, 0.8, 0, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                        />

                        <div className="text-[9px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-900">
                            BLAST SHIELD DETECTED: 100% EXPLOIT CONTAINMENT
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Bomb-Defusal Analogy:</strong> When building a bomb-defusal robot, you do not politely ask the robot not to fail. You place it inside a reinforced Kevlar blast chamber so that when a detonation happens, the host building remains entirely untouched.
                </p>
            </div>
        );
    }

    // 4. Business Lens: Autonomous Risk & Liability (Literal Intern)
    if (has('intern') || has('liability') || has('optimize') || has('spending limits') || has('bank account')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                        <Coins className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        Concept: Blast Radius & Hard Policies
                    </h5>
                </div>

                {/* Animated Pipeline showing transaction limit enforcement */}
                <div className="relative h-32 w-full bg-slate-950 rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-slate-800">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400 z-10">
                        <span>LITERAL INTERN (AI)</span>
                        <span>HARD HARDWARE GATEWAY</span>
                        <span>BUSINESS COFFERS</span>
                    </div>

                    <svg viewBox="0 0 300 60" className="w-full h-12 z-10">
                        {/* Transaction pipeline */}
                        <line x1="20" y1="30" x2="280" y2="30" stroke="#334155" strokeWidth="2" />

                        {/* Gate representation */}
                        <g transform="translate(140, 5)">
                            <rect width="20" height="50" rx="3" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
                            <text x="10" y="28" fill="#fbbf24" fontSize="7" fontWeight="bold" textAnchor="middle">MAX</text>
                        </g>

                        {/* Unlimited coin pulses gets blocked */}
                        <motion.g
                            animate={{ x: [20, 130, 130], opacity: [1, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeIn" }}
                        >
                            <circle cx="10" cy="30" r="6" fill="#f59e0b" />
                            <text x="10" y="33" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">$</text>
                        </motion.g>

                        {/* Allowed safe pulses goes through */}
                        <motion.g
                            animate={{ x: [20, 130, 270] }}
                            transition={{ duration: 3, repeat: Infinity, delay: 0.5, ease: "linear" }}
                        >
                            <circle cx="10" cy="30" r="4" fill="#10b981" />
                        </motion.g>
                    </svg>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 z-10 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        <span className="text-emerald-400 font-bold">✓ Safe Small Runs</span>
                        <span className="text-amber-400 font-bold">✗ Over-limit transactions blocked by Policy</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Literal Intern Analogy:</strong> If you hire a hyper-efficient, literal intern, you don't just ask them not to overspend; you set strict credit limits on their card. Guardrails must be enforced in infrastructure, not left to model instructions.
                </p>
            </div>
        );
    }

    // 5. Attack Surface Discovery (Burglar checking windows/perimeter)
    if (has('burglar') || has('perimeter') || has('building')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-indigo-100 dark:border-indigo-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Target className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                        Concept: Automated Attack Surface Mapping
                    </h5>
                </div>

                {/* Visual House Blueprint with checks */}
                <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-3">
                    <svg viewBox="0 0 300 120" className="w-full h-full">
                        {/* Building outline */}
                        <rect x="50" y="20" width="200" height="80" rx="4" fill="none" stroke="#334155" strokeWidth="2" />
                        <line x1="150" y1="20" x2="150" y2="100" stroke="#334155" strokeWidth="1" />
                        <text x="150" y="15" fill="#64748b" fontSize="8" textAnchor="middle">TARGET INFRASTRUCTURE</text>

                        {/* Windows / Ports */}
                        {/* Port 80 */}
                        <g transform="translate(80, 40)">
                            <rect width="30" height="20" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1" />
                            <text x="15" y="12" fill="#34d399" fontSize="6" textAnchor="middle">Port 80</text>
                            <text x="15" y="18" fill="#10b981" fontSize="5" textAnchor="middle">SECURE</text>
                        </g>

                        {/* Port 443 */}
                        <g transform="translate(185, 40)">
                            <rect width="30" height="20" rx="2" fill="#022c22" stroke="#10b981" strokeWidth="1" />
                            <text x="15" y="12" fill="#34d399" fontSize="6" textAnchor="middle">Port 443</text>
                            <text x="15" y="18" fill="#10b981" fontSize="5" textAnchor="middle">SECURE</text>
                        </g>

                        {/* Hidden Unsecured port */}
                        <g transform="translate(135, 75)">
                            <rect width="30" height="20" rx="2" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" />
                            <text x="15" y="12" fill="#fda4af" fontSize="6" textAnchor="middle">Port 8443</text>
                            <text x="15" y="18" fill="#f43f5e" fontSize="5" textAnchor="middle" className="animate-pulse">EXPOSED</text>
                        </g>

                        {/* Burglar/scanner sweeping target */}
                        <motion.circle 
                            r="5" 
                            fill="#06b6d4" 
                            animate={{
                                cx: [40, 95, 200, 150, 40],
                                cy: [15, 50, 50, 85, 15]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </svg>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Burglar Perimeter Analogy:</strong> A burglar does not try to crash through the front door of a bank. Instead, they walk the entire perimeter, feeling each latch, checking every window, and searching for a single unlatched cellar door.
                </p>
            </div>
        );
    }

    // 6. Direct Input Simulator (Lockpick)
    if (has('lockpick') || has('poorly secured door') || has('repeater')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Lock className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                        Concept: Direct Parameter Manipulation
                    </h5>
                </div>

                {/* Lockpicking mechanical representation */}
                <div className="relative w-full h-40 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
                    <svg viewBox="0 0 300 120" className="w-full h-full">
                        {/* Padlock Base */}
                        <rect x="110" y="40" width="80" height="60" rx="10" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                        <circle cx="150" cy="70" r="12" fill="#0f172a" />
                        
                        {/* Padlock Shackle */}
                        <path d="M 125 40 L 125 25 C 125 10, 175 10, 175 25 L 175 40" fill="none" stroke="#475569" strokeWidth="4" />

                        {/* Lockpick tool inserting */}
                        <motion.path 
                            d="M 20 70 L 138 70" 
                            stroke="#06b6d4" 
                            strokeWidth="3" 
                            strokeLinecap="round"
                            animate={{
                                x: [0, 5, 0, 10, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Turned Lock shackle upon bypass */}
                        <motion.path 
                            d="M 125 40 L 125 25 C 125 10, 175 10, 175 25 L 175 40" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="4"
                            animate={{
                                y: [0, -8, 0],
                                rotate: [0, 5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </svg>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Lockpick Analogy:</strong> Rather than using the official key, an attacker slips a lockpick into a poorly secured mechanical tumbler, manually setting each pin until the cylinder revolves.
                </p>
            </div>
        );
    }

    // 7. Environmental Simulator (Forging CSRF)
    if (has('forging') || has('signature') || has('bank transfer') || has('mailing') || has('csrf')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                        <Ticket className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        Concept: Cross-Site Request Forgery (CSRF)
                    </h5>
                </div>

                {/* Steps representing signature forgery */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div className="text-center p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[8px] text-slate-400 block font-bold mb-1">1. AUTHENTICATED</span>
                        <span className="text-lg block">👤🔐</span>
                        <span className="text-[8px] text-slate-500 font-medium">Victim holds active session</span>
                    </div>

                    <div className="text-center p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[8px] text-slate-400 block font-bold mb-1">2. EMBEDDED</span>
                        <span className="text-lg block animate-pulse">📝☠️</span>
                        <span className="text-[8px] text-slate-500 font-medium">Form submitted behind scene</span>
                    </div>

                    <div className="text-center p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[8px] text-slate-400 block font-bold mb-1">3. ACTION</span>
                        <span className="text-lg block text-red-500">💸🏦</span>
                        <span className="text-[8px] text-slate-500 font-medium">Bank processes forged slip</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Forged Bank Transfer Analogy:</strong> CSRF is like forging a victim’s signature on a pre-filled bank transfer form and tricking them into dropping it in the mail, relying on the bank’s blind trust in the signature.
                </p>
            </div>
        );
    }

    // 8. Tool-Based Simulator / Intruder (Keyring)
    if (has('keyring') || has('every key') || (has('key') && has('fuzzer')) || has('intruder')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-indigo-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300 animate-in fade-in-50">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Layers className="w-4 h-4 animate-pulse" />
                    </span>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                        Concept: Automated Key/Payload Brute-Forcing
                    </h5>
                </div>

                {/* Carousel representation of testing keys */}
                <div className="relative h-28 w-full bg-slate-950 rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-slate-800">
                    <div className="flex justify-between text-[8px] font-mono text-slate-400 z-10">
                        <span>INTRUDER CAROUSEL</span>
                        <span>TARGET CYLINDER</span>
                        <span>RESPONSE STATUS</span>
                    </div>

                    <svg viewBox="0 0 300 120" className="w-full h-12 z-10">
                        {/* Target Gate */}
                        <circle cx="150" cy="30" r="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                        <line x1="150" y1="24" x2="150" y2="36" stroke="#475569" strokeWidth="1.5" />

                        {/* Payload carousel */}
                        <motion.g
                            animate={{
                                x: [0, -60, -120],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Key 1 */}
                            <g transform="translate(60, 30)">
                                <circle cx="0" cy="0" r="6" fill="#ef4444" />
                                <text x="15" y="3" fill="#ef4444" fontSize="8" fontWeight="bold">Key_A</text>
                            </g>

                            {/* Key 2 */}
                            <g transform="translate(120, 30)">
                                <circle cx="0" cy="0" r="6" fill="#ef4444" />
                                <text x="15" y="3" fill="#ef4444" fontSize="8" fontWeight="bold">Key_B</text>
                            </g>

                            {/* Key 3 - Successful */}
                            <g transform="translate(180, 30)">
                                <circle cx="0" cy="0" r="6" fill="#10b981" />
                                <text x="15" y="3" fill="#10b981" fontSize="8" fontWeight="bold">Success_C</text>
                            </g>
                        </motion.g>

                        {/* Status feedback text */}
                        <motion.text 
                            x="250" 
                            y="33" 
                            fontSize="8" 
                            fontFamily="monospace" 
                            fontWeight="bold"
                            animate={{
                                fill: ["#ef4444", "#ef4444", "#10b981"],
                                opacity: [1, 1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            401 ERR
                        </motion.text>
                    </svg>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 z-10 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        <span className="text-slate-400 font-bold">Testing multi key-tumbler payloads rapidly</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Keyring Analogy:</strong> Fuzzing is like carrying a massive keyring with thousands of individual keys and using an automated machine to insert, turn, and remove each one at millisecond intervals until a lock finally yields.
                </p>
            </div>
        );
    }

    // A. Web Bug Bounty: Casino Service Elevator (Attack Surface Discovery)
    if (has('elevator') || has('casino') || has('service elevator')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-indigo-100 dark:border-indigo-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Key className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">
                        Concept: Attack Surface Discovery
                    </h5>
                </div>
                
                {/* Visual Canvas */}
                <div className="relative w-full h-44 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-between p-3">
                    {/* Background decor & labels */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                    
                    <div className="flex justify-between items-start z-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                Front Entrance
                            </span>
                            <span className="text-[9px] text-slate-400">Guarded / Keycard</span>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/40 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                                Back Alley Elevator
                            </span>
                            <span className="text-[9px] text-slate-400">Unlinked / Unchecked</span>
                        </div>
                    </div>

                    {/* SVG Diagram Layer */}
                    <svg viewBox="0 0 400 120" className="w-full h-24 z-10">
                        {/* Vault Room in center/top */}
                        <g transform="translate(165, 10)">
                            <rect width="70" height="40" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
                            <text x="35" y="18" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">GOLD VAULT</text>
                            <circle cx="35" cy="30" r="4" fill="#fbbf24" />
                        </g>

                        {/* Front Gate representation */}
                        <g transform="translate(30, 80)">
                            <rect width="60" height="24" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                            <text x="30" y="14" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">CHECKPOINT</text>
                            <line x1="30" y1="0" x2="30" y2="-30" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" />
                        </g>

                        {/* Service elevator representation */}
                        <g transform="translate(310, 80)">
                            <rect width="60" height="24" rx="4" fill="#4c0519" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
                            <text x="30" y="14" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">NO AUTH PATH</text>
                            {/* Bypassing route to Vault */}
                            <path d="M 30 0 C 30 -40, -105 -30, -110 -30" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                        </g>

                        {/* Glowing packet traveling service path */}
                        <motion.circle 
                            r="5" 
                            fill="#f43f5e" 
                            animate={{
                                cx: [340, 340, 200],
                                cy: [80, 40, 35]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Security check blocking the main gate */}
                        <motion.circle 
                            r="4" 
                            fill="#10b981" 
                            animate={{
                                cx: [60, 60, 60],
                                cy: [110, 80, 80]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeIn"
                            }}
                        />
                    </svg>

                    <div className="text-[10px] text-slate-400 text-center z-10 bg-slate-900/80 py-1 px-2 rounded border border-slate-800">
                        Finding the back door is scanning; verifying it’s unlocked is the exploit.
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Casino Elevator Analogy:</strong> Finding the hidden back elevator isn't the issue; the vulnerability is realizing that it takes anyone directly to the vault without requiring a card.
                </p>
            </div>
        );
    }

    // B. Web Bug Bounty: Coat Check (Authorization / IDOR)
    if (has('coat check') || has('necklace') || has('42')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-amber-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-amber-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-400">
                        <Ticket className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                        Concept: Authorization (IDOR)
                    </h5>
                </div>

                {/* Visual Flow with steps */}
                <div className="grid grid-cols-3 gap-3 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900">
                    <div className="flex flex-col items-center justify-between text-center p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400">1. ATTEMPT</span>
                        <div className="my-2 bg-rose-500/10 p-2 rounded-full text-rose-500">
                            <Ticket className="w-6 h-6 rotate-12" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">ID Changed to #42</span>
                    </div>

                    <div className="flex flex-col items-center justify-between text-center p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400">2. BLIND TRUST</span>
                        <div className="my-2 text-amber-500 animate-pulse">
                            <UserCheck className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">No Owner Check</span>
                    </div>

                    <div className="flex flex-col items-center justify-between text-center p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400">3. HANDOVER</span>
                        <div className="my-2 text-teal-500">
                            <Sparkles className="w-6 h-6 animate-bounce" />
                        </div>
                        <span className="text-[10px] font-medium text-teal-600 dark:text-teal-400">Leaked Asset #42</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Coat Check Analogy:</strong> An attendant who hands over a diamond necklace just because someone gave them a crayon ticket reading "42", without validating if they actually own coat #42.
                </p>
            </div>
        );
    }

    // C. Web Bug Bounty: Pizza Delivery / Alarm (Security Lens / High Impact)
    if (has('pizza') || has('burglar alarm') || has('pizza delivery') || has('master thief')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-purple-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-purple-100 dark:border-purple-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                        <ShieldAlert className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
                        Concept: Automated Scanners vs Logical Analysis
                    </h5>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Column 1: Scanner */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Automated Scanner</span>
                        <div className="my-3 text-red-500 relative">
                            <ShieldAlert className="w-10 h-10 animate-ping absolute opacity-20" />
                            <ShieldAlert className="w-10 h-10" />
                        </div>
                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Only Senses Breakages</span>
                        <span className="text-[9px] text-slate-500 mt-1">Looks for known signatures & smashed barriers. Misses business logic.</span>
                    </div>

                    {/* Column 2: Logical Attack */}
                    <div className="p-3 rounded-xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-950/40 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold tracking-widest text-purple-500 uppercase">Manual Logical Hunting</span>
                        <div className="my-3 text-purple-500 flex items-center justify-center gap-1">
                            <span className="text-2xl">🍕</span>
                            <span className="text-2xl">➡️</span>
                            <span className="text-2xl">🔑</span>
                        </div>
                        <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Pizza Delivery Bypass</span>
                        <span className="text-[9px] text-slate-500 mt-1">Posing as legitimate traffic. Walks through the front door using flawed credentials.</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Pizza Delivery Analogy:</strong> A burglar alarm detects smashed windows, but a master hunter poses as a pizza delivery person to walk directly in, completely undetected by sensors.
                </p>
            </div>
        );
    }

    // D. Web Bug Bounty: Bank Manager (Business Impact / Risk Prioritization)
    if (has('bank manager') || has('dictates priority') || has('bathroom')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-emerald-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Coins className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                        Concept: Business Risk vs Technical Complexity
                    </h5>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* High Complexity, Low Impact */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">LOW SEVERITY</span>
                        <div className="my-3 text-slate-400">
                            <Lock className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Bathroom Door Picked</span>
                        <span className="text-[9px] text-slate-500 mt-1">Super high picking skill required, but zero valuable assets inside. No one cares.</span>
                    </div>

                    {/* Low Complexity, High Impact */}
                    <div className="p-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-950/40 flex flex-col items-center text-center">
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">CRITICAL SEVERITY</span>
                        <div className="my-3 text-emerald-500 flex gap-1 items-center">
                            <Coins className="w-8 h-8 animate-bounce text-amber-500" />
                            <span className="text-xl">🚪🔓</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Main Vault Left Open</span>
                        <span className="text-[9px] text-slate-500 mt-1">Extremely simple, but exposes all assets. Threat of immediate business ruin.</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Bank Manager Analogy:</strong> The manager isn't concerned about picking the lock on the employee bathroom; they are terrified of the front vault door being left completely open. Risk equals impact.
                </p>
            </div>
        );
    }

    // E. Web Bug Bounty: Post Office Sorting Machine (Input Validation / Parameterization)
    if (has('sorting') || has('live grenade') || has('grenade') || has('post office')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-900/80 rounded-2xl border border-blue-100 dark:border-slate-800 shadow-md flex flex-col w-full hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-3">
                    <span className="p-1.5 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                        <Package className="w-4 h-4" />
                    </span>
                    <h5 className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                        Concept: Prepared Statements
                    </h5>
                </div>

                {/* Animated Filtering Slot */}
                <div className="relative h-28 w-full bg-slate-900 rounded-xl overflow-hidden p-3 flex flex-col justify-between border border-slate-800">
                    <div className="flex justify-between text-[9px] font-mono text-slate-400 z-10">
                        <span>INCOMING MAIL</span>
                        <span>SAFE FILTER SLOT</span>
                        <span>PROCESSING LINE</span>
                    </div>

                    <svg viewBox="0 0 300 60" className="w-full h-16 z-10">
                        {/* The Sorting Gate */}
                        <line x1="150" y1="0" x2="150" y2="20" stroke="#64748b" strokeWidth="4" />
                        <line x1="150" y1="40" x2="150" y2="60" stroke="#64748b" strokeWidth="4" />
                        {/* Gap in center at y=20 to y=40 */}
                        <rect x="145" y="20" width="10" height="20" fill="none" stroke="#60a5fa" strokeWidth="1" strokeDasharray="2 2" />

                        {/* Flat letter moving through */}
                        <motion.g
                            animate={{ x: [10, 150, 280], y: [25, 25, 25] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <rect width="16" height="10" rx="1" fill="#10b981" />
                            <line x1="2" y1="2" x2="14" y2="8" stroke="#ffffff" strokeWidth="1" />
                        </motion.g>

                        {/* Dangerous Grenade shape getting blocked at the gate */}
                        <motion.g
                            animate={{ 
                                x: [50, 140, 140, 140], 
                                y: [22, 22, 45, 55],
                                rotate: [0, 0, 45, 90],
                                opacity: [1, 1, 1, 0] 
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: "easeOut" }}
                        >
                            {/* Grenade box/circle */}
                            <circle cx="10" cy="10" r="8" fill="#ef4444" />
                            <rect x="8" y="0" width="4" height="4" fill="#f59e0b" />
                        </motion.g>
                    </svg>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 z-10 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                        <span className="text-emerald-400 font-bold">✓ Letters fit slot (Clean Data)</span>
                        <span className="text-rose-400 font-bold">✗ Bulk packages blocked (Code Execution)</span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    <strong>Sorting Machine Analogy:</strong> Rigid templates only permit thin envelopes. Malicious packages like live grenades cannot physically fit into the processing stream, ensuring zero execution risks.
                </p>
            </div>
        );
    }

    // 1. SQL Injection / Payload Injection
    if (has('sql injection') || has('injection') || has('payload')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Smuggling Instructions'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* The Guard / Gate */}
                    <rect x="90" y="20" width="20" height="60" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    <circle cx="100" cy="15" r="5" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />

                    {/* Standard Package (Rejected or harmless) */}
                    <motion.rect 
                        x="20" y="40" width="20" height="15" fill="currentColor" className="text-blue-400"
                        animate={{ x: [0, 50, 50] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    {/* Malicious Payload (Disguised) */}
                    <motion.g
                        animate={{ x: [0, 110, 150] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                        {/* Trojan horse box */}
                        <rect x="20" y="60" width="25" height="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                        {/* Hidden instruction pops out after passing */}
                        <motion.circle 
                            cx="32.5" cy="67.5" r="3" fill="currentColor" className="text-red-500"
                            animate={{ scale: [1, 1, 3], opacity: [0, 0, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        />
                    </motion.g>

                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Disguising commands inside normal data to trick the parser.
                </p>
            </div>
        );
    }

    // 2. Auth Bypass / IDOR
    if (has('bypass') || has('idor') || has('authorization')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Bypassing the Bouncer'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Club / Vault */}
                    <rect x="120" y="10" width="60" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    {/* Main Door */}
                    <rect x="120" y="30" width="10" height="40" fill="currentColor" className="text-slate-500" />
                    {/* Bouncer */}
                    <circle cx="110" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400" />

                    {/* Normal User (Blocked/Checked) */}
                    <motion.circle 
                        cx="50" cy="50" r="5" fill="currentColor" className="text-blue-400"
                        animate={{ x: [0, 40, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />

                    {/* Attacker Bypassing (Backdoor or Side Channel) */}
                    <motion.g
                        animate={{ x: [0, 80, 80], y: [0, -40, 20] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                        <circle cx="50" cy="50" r="5" fill="currentColor" className="text-purple-500" />
                        <path d="M 50 50 L 55 45" stroke="currentColor" strokeWidth="1" className="text-purple-300" />
                    </motion.g>
                    {/* Side Door */}
                    <rect x="140" y="10" width="20" height="5" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="text-green-500" />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Skipping the main check by finding an unsecured side entrance.
                </p>
            </div>
        );
    }

    // 3. Multi-Agent / Orchestrator
    if (has('orchestrator') || has('multi-agent') || has('master') || has('traffic') || has('manager')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Factory Foreman'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Foreman (Orchestrator) */}
                    <rect x="80" y="10" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="100" y="23" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">MASTER</text>

                    {/* Workers */}
                    <rect x="20" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                    <rect x="85" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />
                    <rect x="150" y="60" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400" />

                    {/* Delegation Lines */}
                    <path d="M 100 30 L 100 45 L 35 45 L 35 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 100 30 L 100 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 100 30 L 100 45 L 165 45 L 165 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Task Pulses */}
                    <motion.circle cx="35" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 35] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    <motion.circle cx="100" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 100] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
                    <motion.circle cx="165" cy="45" r="3" fill="currentColor" className="text-indigo-400"
                        animate={{ cy: [30, 60], cx: [100, 165] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A central intelligence delegating tasks to specialized workers.
                </p>
            </div>
        );
    }

    // 3b. Handoffs
    if (has('handoff') || has('sequential routing')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Relay Race'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agents */}
                    <rect x="20" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="40" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT 1</text>
                    
                    <rect x="140" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <text x="160" y="53" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">AGENT 2</text>

                    {/* Baton Passing */}
                    <path d="M 60 50 L 140 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    
                    <motion.rect x="90" y="45" width="20" height="10" rx="2" fill="currentColor" className="text-amber-500"
                        animate={{ x: [60, 120] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} />
                    <motion.text x="100" y="53" fontSize="6" textAnchor="middle" className="fill-white font-bold"
                        animate={{ x: [70, 130] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>CTX</motion.text>
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Passing control and full context memory to the next specialist.
                </p>
            </div>
        );
    }

    // 3c. Specialist Teams / Worker
    if (has('worker') || has('specialist') || has('teams')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Special Ops Team'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Hub */}
                    <circle cx="100" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300" />
                    <text x="100" y="53" fontSize="6" textAnchor="middle" className="fill-slate-500 font-bold">CONTEXT</text>

                    {/* Specialists */}
                    <rect x="20" y="20" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
                    <text x="35" y="30" fontSize="6" textAnchor="middle" className="fill-rose-500 font-bold">RED</text>
                    <path d="M 50 27 L 88 43" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <rect x="150" y="20" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    <text x="165" y="30" fontSize="6" textAnchor="middle" className="fill-blue-500 font-bold">BLUE</text>
                    <path d="M 150 27 L 112 43" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <rect x="85" y="80" width="30" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <text x="100" y="90" fontSize="6" textAnchor="middle" className="fill-amber-500 font-bold">GOLD</text>
                    <path d="M 100 80 L 100 65" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Pulses */}
                    <motion.circle cx="50" cy="27" r="2" fill="currentColor" className="text-rose-400"
                        animate={{ cx: [50, 88], cy: [27, 43] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="150" cy="27" r="2" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [150, 112], cy: [27, 43] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                    <motion.circle cx="100" cy="80" r="2" fill="currentColor" className="text-amber-400"
                        animate={{ cx: [100, 100], cy: [80, 65] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Experts contributing distinct skills to a shared goal.
                </p>
            </div>
        );
    }

    // 3. Multi-Agent / Orchestrator
    if (has('reconnaissance') || has('recon') || has('attack surface') || has('discovery')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'Mapping the Fortress'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* The Fortress */}
                    <path d="M 120 20 L 180 20 L 180 80 L 120 80 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400" />
                    <rect x="140" y="40" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" />

                    {/* Radar / Scanner */}
                    <circle cx="40" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <motion.circle cx="40" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-400"
                        animate={{ r: [10, 80], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
                    
                    {/* Detected points */}
                    <motion.circle cx="120" cy="30" r="3" fill="currentColor" className="text-red-500"
                        animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />
                    <motion.circle cx="180" cy="60" r="3" fill="currentColor" className="text-red-500"
                        animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 1.2 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Probing the perimeter to find all possible entry points.
                </p>
            </div>
        );
    }

    // 5. Benford's Law / Fraud / Audit
    if (has('benford') || has('fraud') || has('audit') || has('anomaly')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Invisible Fingerprint'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Expected Curve */}
                    <path d="M 20 80 Q 50 20 180 70" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" className="text-green-500 opacity-50" />
                    
                    {/* Bar Chart (Actual Data) */}
                    <rect x="25" y="40" width="15" height="40" fill="currentColor" className="text-slate-400" />
                    <rect x="55" y="60" width="15" height="20" fill="currentColor" className="text-slate-400" />
                    
                    {/* Anomalous Bar */}
                    <motion.rect 
                        x="85" y="30" width="15" height="50" fill="currentColor" className="text-rose-500"
                        animate={{ height: [50, 70, 50], y: [30, 10, 30] }} transition={{ duration: 2, repeat: Infinity }}
                    />
                    
                    <rect x="115" y="65" width="15" height="15" fill="currentColor" className="text-slate-400" />
                    <rect x="145" y="70" width="15" height="10" fill="currentColor" className="text-slate-400" />
                    
                    {/* Baseline */}
                    <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Natural data follows a pattern; manipulated data sticks out.
                </p>
            </div>
        );
    }

    // 6. Business Impact / Risk / Prioritization
    if (has('business impact') || has('risk') || has('prioritization') || has('disclosure')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Falling Dominoes'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* The Foundation */}
                    <line x1="20" y1="80" x2="180" y2="80" stroke="currentColor" strokeWidth="2" className="text-slate-500" />
                    
                    {/* Falling Dominoes */}
                    <motion.rect x="30" y="50" width="10" height="30" fill="currentColor" className="text-rose-500"
                        animate={{ rotate: [0, 45, 0], transformOrigin: "35px 80px" }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.rect x="60" y="50" width="10" height="30" fill="currentColor" className="text-amber-500"
                        animate={{ rotate: [0, 45, 0], transformOrigin: "65px 80px" }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} />
                    <motion.rect x="90" y="50" width="10" height="30" fill="currentColor" className="text-amber-400"
                        animate={{ rotate: [0, 45, 0], transformOrigin: "95px 80px" }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} />
                    <motion.rect x="120" y="50" width="10" height="30" fill="currentColor" className="text-emerald-500"
                        animate={{ rotate: [0, 45, 0], transformOrigin: "125px 80px" }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
                    <motion.rect x="150" y="50" width="10" height="30" fill="currentColor" className="text-emerald-400"
                        animate={{ rotate: [0, 45, 0], transformOrigin: "155px 80px" }} transition={{ duration: 2, repeat: Infinity, delay: 0.8 }} />

                    {/* Impact ripples */}
                    <motion.circle cx="45" cy="80" r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-rose-400"
                        animate={{ r: [10, 40], opacity: [1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A single vulnerability triggers a chain reaction across the business.
                </p>
            </div>
        );
    }

    // 7. ReAct Pattern / Thought-Action-Observation
    if (has('react') || has('reason') || has('thought') || has('act') || has('detective')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Detective Loop'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Nodes */}
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-purple-500 font-bold">THINK</text>

                    <rect x="130" y="20" width="30" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <text x="145" y="33" fontSize="8" textAnchor="middle" className="fill-amber-500 font-bold">ACT</text>

                    <rect x="130" y="60" width="30" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <text x="145" y="73" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">OBSERVE</text>

                    {/* Connecting lines */}
                    <path d="M 60 40 L 130 30" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 145 40 L 145 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 130 70 L 60 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Animated loop packet */}
                    <motion.circle cx="60" cy="40" r="3" fill="currentColor" className="text-purple-400"
                        animate={{ 
                            cx: [60, 130, 145, 145, 130, 60], 
                            cy: [40, 30, 30, 60, 70, 60] 
                        }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} 
                    />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Interleaving reasoning and environmental interaction.
                </p>
            </div>
        );
    }

    // 8. Evaluator-Optimizer
    if (has('evaluator') || has('optimizer') || has('critique') || has('feedback') || has('writer') || has('editor')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Editor and Writer'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Generator */}
                    <rect x="30" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-blue-500 font-bold">GENERATE</text>

                    {/* Evaluator */}
                    <rect x="130" y="40" width="40" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500" />
                    <text x="150" y="53" fontSize="8" textAnchor="middle" className="fill-rose-500 font-bold">CRITIQUE</text>

                    {/* Forward Draft */}
                    <path d="M 70 45 L 130 45" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    {/* Feedback loop */}
                    <path d="M 130 55 L 70 55" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Data packets */}
                    <motion.circle cx="70" cy="45" r="3" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [70, 130, 130] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} />
                    <motion.circle cx="130" cy="55" r="3" fill="currentColor" className="text-rose-400"
                        animate={{ cx: [130, 70, 70] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75, ease: "easeInOut" }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A generator refines outputs based on strict evaluation.
                </p>
            </div>
        );
    }

    // 9. Sequential Chaining
    if (has('sequential') || has('chaining') || has('pipeline') || has('linear') || has('assembly')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Assembly Line'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Nodes in a line */}
                    <circle cx="30" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <circle cx="100" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <circle cx="170" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />

                    {/* Connecting lines */}
                    <path d="M 40 50 L 90 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 110 50 L 160 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Animated packet traveling through chain */}
                    <motion.circle cx="10" cy="50" r="4" fill="currentColor" className="text-emerald-500"
                        animate={{ cx: [10, 30, 90, 100, 160, 170, 190] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Sequential processing where step B strictly waits for step A.
                </p>
            </div>
        );
    }

    // 10. Parallel Fanout
    if (has('parallel') || has('fanout') || has('scatter') || has('delegating')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Newsroom Spread'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Central dispatcher */}
                    <circle cx="40" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
                    
                    {/* Parallel nodes */}
                    <rect x="100" y="10" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <rect x="100" y="40" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    <rect x="100" y="70" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500" />
                    
                    {/* Aggregator */}
                    <circle cx="160" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />

                    {/* Fanout lines */}
                    <path d="M 50 45 L 100 20" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 50 50 L 100 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 50 55 L 100 80" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />

                    {/* Fan-in lines */}
                    <path d="M 120 20 L 155 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 120 50 L 150 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />
                    <path d="M 120 80 L 155 55" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300" />

                    {/* Animated Fanout */}
                    <motion.circle cx="50" cy="45" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100], cy: [45, 20] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="50" cy="50" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="50" cy="55" r="2" fill="currentColor" className="text-blue-400" animate={{ cx: [50, 100], cy: [55, 80] }} transition={{ duration: 1, repeat: Infinity }} />

                    {/* Animated Fan-in */}
                    <motion.circle cx="120" cy="20" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 155], cy: [20, 45] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                    <motion.circle cx="120" cy="50" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 150] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                    <motion.circle cx="120" cy="80" r="2" fill="currentColor" className="text-emerald-400" animate={{ cx: [120, 155], cy: [80, 55] }} transition={{ duration: 1, repeat: Infinity, delay: 1 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Executing independent tasks concurrently and aggregating results.
                </p>
            </div>
        );
    }

    // 11. Human-in-the-Loop
    if (has('human') || has('hitl') || has('approval') || has('gate') || has('self-driving')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Manager’s Approval'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Pipeline */}
                    <rect x="20" y="40" width="40" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="40" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    <rect x="140" y="40" width="40" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="160" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">PROCEED</text>

                    {/* Human Gate */}
                    <circle cx="100" cy="50" r="15" fill="currentColor" className="text-amber-500/20" stroke="currentColor" strokeWidth="2" />
                    <text x="100" y="53" fontSize="8" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 font-bold">HUMAN</text>

                    {/* Lines */}
                    <path d="M 60 50 L 85 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />
                    <path d="M 115 50 L 140 50" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 stroke-dashed" />

                    {/* Packet pausing and proceeding */}
                    <motion.circle cx="20" cy="50" r="4" fill="currentColor" className="text-purple-500"
                        animate={{ cx: [20, 60, 85, 85, 115, 140, 180] }} 
                        transition={{ duration: 4, times: [0, 0.2, 0.3, 0.7, 0.8, 0.9, 1], repeat: Infinity }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Agent pauses execution until human oversight grants permission.
                </p>
            </div>
        );
    }

    // 12. Memory Architectures / RAG
    if (has('memory') || has('rag') || has('vector') || has('database') || has('student') || has('exam')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Librarian'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Brain */}
                    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="50" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    {/* Vector DB / Library */}
                    <path d="M 130 30 L 170 30 L 170 70 L 130 70 Z" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500" />
                    <path d="M 130 40 L 170 40 M 130 50 L 170 50 M 130 60 L 170 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500/50" />
                    <text x="150" y="25" fontSize="8" textAnchor="middle" className="fill-emerald-500 font-bold">VECTOR DB</text>

                    {/* Query & Retrieve */}
                    <path d="M 70 45 L 125 45" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 125 55 L 70 55" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    <motion.circle cx="70" cy="45" r="2" fill="currentColor" className="text-blue-400"
                        animate={{ cx: [70, 125] }} transition={{ duration: 1, repeat: Infinity }} />
                    <motion.circle cx="125" cy="55" r="3" fill="currentColor" className="text-emerald-400"
                        animate={{ cx: [125, 70] }} transition={{ duration: 1, repeat: Infinity, delay: 0.5 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    Retrieving vast semantic context to inject into short-term reasoning.
                </p>
            </div>
        );
    }

    // 13. Single Agent (Fallback)
    if (has('agent') || has('single agent')) {
        return (
            <div className="my-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm flex flex-col items-center w-full transition-all hover:shadow-md">
                <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">
                    Analogy: {analogyName || 'The Autonomous Problem Solver'}
                </h5>
                <svg viewBox="0 0 200 100" className="w-full max-w-[240px] h-auto">
                    {/* Agent Brain */}
                    <circle cx="100" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-500" />
                    <text x="100" y="53" fontSize="8" textAnchor="middle" className="fill-indigo-500 font-bold">AGENT</text>

                    {/* Tools */}
                    <circle cx="30" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="30" y="52" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">API</text>

                    <circle cx="170" cy="30" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="170" y="32" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">DB</text>
                    
                    <circle cx="170" cy="70" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400" />
                    <text x="170" y="72" fontSize="5" textAnchor="middle" className="fill-slate-500 font-bold">WEB</text>

                    {/* Connections */}
                    <path d="M 42 50 L 75 50" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 158 30 L 122 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />
                    <path d="M 158 70 L 122 60" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-300 stroke-dashed" />

                    {/* Activity Orbits */}
                    <motion.circle cx="42" cy="50" r="2" fill="currentColor" className="text-indigo-400"
                        animate={{ cx: [75, 42, 75] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.circle cx="158" cy="30" r="2" fill="currentColor" className="text-indigo-400"
                        animate={{ cx: [122, 158, 122], cy: [40, 30, 40] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
                </svg>
                <p className="text-[10px] text-center mt-2 text-slate-500 italic">
                    A single model autonomously utilizing tools.
                </p>
            </div>
        );
    }

    return null;
};
