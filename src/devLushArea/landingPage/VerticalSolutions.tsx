import React, { useState } from 'react';
import { FileSignature, Sliders, Ship, CheckCircle2, ShieldAlert, ArrowRight, Zap } from 'lucide-react';

export const VerticalSolutions: React.FC = () => {
    const [marginDrop, setMarginDrop] = useState(12);

    return (
        <section id="vertical-solutions" className="py-16 sm:py-24 max-w-7xl mx-auto px-6 border-b border-zinc-200 dark:border-zinc-800 space-y-20">
            
            {/* Section Title */}
            <div className="text-center max-w-3xl mx-auto space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                    Deep Operational Impact
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-2">
                    How Autonomous Swarms Transform Enterprise Verticals
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                    Interactive operational visualizers demonstrating real-time agent decision loops.
                </p>
            </div>

            {/* Vertical 1: Legal Interactive Redline Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest">
                        Vertical Suite 01 — Legal & IP
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        Real-Time Contract Redlining & Playbook Enforcement
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Human legal review takes days. devLush AgentOS processes 50-page Master Service Agreements in seconds, detecting rogue indemnity terms and substituting pre-approved corporate clauses automatically.
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Automatic risk scoring based on legal team playbooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Seamless export directly to tracked-changes DOCX files</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Automated trademark enforcement across global marketplaces</span>
                        </li>
                    </ul>
                </div>
                
                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                <FileSignature className="w-4 h-4 text-cyan-500" />
                                <span>Agent Redline Visualizer (MSA Clause #14.2)</span>
                            </div>
                            <span className="text-[10px] bg-cyan-500 text-zinc-950 font-mono font-bold px-2 py-0.5 rounded">
                                AUTONOMOUS REPLACEMENT
                            </span>
                        </div>
                        <div className="mt-4 space-y-3 font-mono text-xs">
                            <div className="p-3 bg-red-500/10 border-l-4 border-red-500 rounded text-red-900 dark:text-red-300">
                                <span className="font-bold block text-red-600 dark:text-red-400 text-[10px] uppercase mb-1">
                                    Original Inbound Clause (High Risk)
                                </span>
                                "Supplier total aggregate liability for data breaches or compliance failure shall not exceed $5,000 USD."
                            </div>
                            <div className="p-3 bg-emerald-500/10 border-l-4 border-emerald-500 rounded text-emerald-900 dark:text-emerald-300">
                                <span className="font-bold block text-emerald-600 dark:text-emerald-400 text-[10px] uppercase mb-1">
                                    Agent Replacement (Corporate Playbook v4.2)
                                </span>
                                "Supplier total aggregate liability for data breach or cyber incidents shall be capped at 5x total annual contract value."
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical 2: Ecommerce Dynamic Pricing Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-emerald-500" />
                                <span>Dynamic Margin Guard Simulator</span>
                            </span>
                            <span className="text-[10px] bg-emerald-500 text-zinc-950 font-bold px-2 py-0.5 rounded font-mono">
                                LIVE RECOVERY
                            </span>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <div className="flex justify-between font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                                    <span>Simulate Competitor Price Drop:</span>
                                    <span className="text-emerald-500 font-mono">-{marginDrop}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    value={marginDrop}
                                    onChange={(e) => setMarginDrop(Number(e.target.value))}
                                    className="w-full accent-emerald-500 cursor-pointer"
                                />
                            </div>

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
                                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100">
                                    <span>Automated Re-Pricing Action:</span>
                                    <span className="text-emerald-500 font-mono">
                                        $89.00 &rarr; ${(89 * (1 - marginDrop / 200)).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                                    Adjusted listing price to stay #1 Buy-Box winner while strictly guaranteeing your 38% Gross Margin floor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
                    <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">
                        Vertical Suite 02 — Ecommerce
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        Autonomous Revenue & Margin Protection
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Never lose revenue to stockouts or static pricing. AgentOS links your storefront to competitor benchmarks and logistics ledgers to capture lost cart revenue automatically.
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Instant exit-intent SMS offers via WhatsApp & Klaviyo</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Automated customer order lookup (WISMO) with 0 agent tickets</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Vertical 3: Supply Chain Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                        Vertical Suite 03 — Supply Chain
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        Real-Time Freight Bottleneck Auto-Rerouting
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Port congestion and canal blockages can delay shipments by weeks. Supply Chain Sentinel monitors satellite AIS telemetry and reroutes high-priority freight before stockouts occur.
                    </p>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-3">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Ship className="w-4 h-4 text-amber-500" />
                                <span>Satellite AIS Stream (Suez Canal Alert)</span>
                            </span>
                            <span className="text-[10px] bg-amber-500 text-zinc-950 font-bold px-2 py-0.5 rounded font-mono">
                                AUTO REROUTED
                            </span>
                        </div>
                        <div className="p-3 bg-amber-500/10 border-l-4 border-amber-500 rounded text-xs space-y-1 font-mono">
                            <div className="flex justify-between text-amber-700 dark:text-amber-300 font-bold">
                                <span>[ALERT] Port Congestion Detected</span>
                                <span>4 Containers Impacted</span>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                                Action: Executed SAP ERP Purchase Order #8421 to re-route via Air Freight. Lead time delay reduced by 4.5 days.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};
