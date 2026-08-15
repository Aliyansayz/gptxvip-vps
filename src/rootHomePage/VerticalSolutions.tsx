import React, { useState } from 'react';
import { FileSignature, Sliders, Ship, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

export const VerticalSolutions: React.FC = () => {
    const [marginDrop, setMarginDrop] = useState(12);
    const [simulatedContainers, setSimulatedContainers] = useState(6);

    return (
        <section id="vertical-solutions" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 space-y-20">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/25 inline-block">
                    Deep Operational Impact
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    How Autonomous Swarms Transform Enterprise Verticals
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-base">
                    Interactive operational visualizers demonstrating real-time agent decision loops across critical business units.
                </p>
            </div>

            {/* Vertical 1: Legal Interactive Redline Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                    <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest">
                        Vertical Suite 01 — Legal & IP
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Real-Time Contract Redlining & Playbook Enforcement
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Human legal review takes days and costs thousands per contract. devLush AgentOS processes 50-page Master Service Agreements in seconds, detecting rogue indemnity terms and substituting pre-approved corporate clauses automatically.
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Automatic risk scoring based on in-house legal playbooks</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Seamless export directly to tracked-changes DOCX files</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                            <span>Automated trademark enforcement across 40+ global marketplaces</span>
                        </li>
                    </ul>
                </div>
                
                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                <FileSignature className="w-4 h-4 text-cyan-500" />
                                <span>Agent Redline Visualizer (MSA Clause #14.2)</span>
                            </div>
                            <span className="text-[10px] bg-cyan-500 text-zinc-950 font-mono font-bold px-2.5 py-0.5 rounded-full">
                                AUTONOMOUS REPLACEMENT
                            </span>
                        </div>
                        <div className="mt-5 space-y-4 font-mono text-xs">
                            <div className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-xl text-red-900 dark:text-red-300">
                                <span className="font-bold block text-red-600 dark:text-red-400 text-[10px] uppercase mb-1">
                                    Original Inbound Clause (High Risk - Uncapped Vendor Exposure)
                                </span>
                                "Supplier total aggregate liability for data breaches, compliance failure, or indirect damages shall not exceed $5,000 USD."
                            </div>
                            <div className="p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-xl text-emerald-900 dark:text-emerald-300">
                                <span className="font-bold block text-emerald-600 dark:text-emerald-400 text-[10px] uppercase mb-1">
                                    Agent Replacement (Corporate Playbook v4.2 Approved)
                                </span>
                                "Supplier total aggregate liability for data breach, compliance violation, or cyber incidents shall be capped at 5x total annual contract value with uncapped direct gross negligence indemnity."
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical 2: Ecommerce Dynamic Pricing Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Sliders className="w-4 h-4 text-emerald-500" />
                                <span>Dynamic Margin Guard Simulator</span>
                            </span>
                            <span className="text-[10px] bg-emerald-500 text-zinc-950 font-bold px-2.5 py-0.5 rounded-full font-mono">
                                LIVE RECOVERY
                            </span>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div>
                                <div className="flex justify-between font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                                    <span>Simulate Competitor Price Drop:</span>
                                    <span className="text-emerald-500 font-mono text-sm">-{marginDrop}%</span>
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

                            <div className="p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
                                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100">
                                    <span>Automated Re-Pricing Action:</span>
                                    <span className="text-emerald-500 font-mono text-sm">
                                        $89.00 &rarr; ${(89 * (1 - marginDrop / 200)).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                                    Listing price dynamically optimized to win #1 Amazon Buy-Box & Shopify search ranking while strictly guaranteeing your 38% Gross Margin floor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-4 text-left order-1 lg:order-2">
                    <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">
                        Vertical Suite 02 — Ecommerce & Retail
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Autonomous Dynamic Margin & Buy-Box Guard
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Never bleed profit during predatory price wars. devLush agents scrape competitor catalogs 24/7, recalculating supplier COGS and executing algorithmic repricing within 400ms.
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Instant margin floor enforcement to eliminate loss-making sales</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Multi-channel abandoned cart recovery with personalized SMS discounts</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Shopify, Amazon, and Walmart Marketplace bi-directional sync</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Vertical 3: Supply Chain Auto-Routing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-4 text-left">
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                        Vertical Suite 03 — Supply Chain & Logistics
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Autonomous Port Congestion & PO Re-Routing
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Supply chain disruptions cost enterprise manufacturers millions in demurrage and factory downtime. Our agent swarms ingest global maritime AIS signals and automatically issue replacement POs in SAP and Oracle ERP.
                    </p>
                    <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-2">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Real-time maritime choke-point & demurrage penalty prediction</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Automated freight PO split execution in SAP ERP</span>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                <Ship className="w-4 h-4 text-amber-500" />
                                <span>Suez & Rotterdam Terminal Telemetry</span>
                            </div>
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold">
                                RE-ROUTING ACTIVE
                            </span>
                        </div>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-700 dark:text-zinc-300">Congestion Delay Status:</span>
                                <span className="font-mono text-red-500 font-bold">+9.4 Days Port Wait</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-700 dark:text-zinc-300">Agent Action:</span>
                                <span className="font-mono text-emerald-500 font-bold">Air-Freight 4 Containers (Zero Assembly Halt)</span>
                            </div>
                            <div className="text-[11px] text-zinc-500 pt-1 border-t border-zinc-200 dark:border-zinc-800">
                                Net Enterprise ROI: Saved $420,000 in contractual assembly delay penalties.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default VerticalSolutions;
