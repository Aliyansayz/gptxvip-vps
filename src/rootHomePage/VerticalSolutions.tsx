import React, { useState } from 'react';
import { FileSignature, Sliders, Ship, CheckCircle2, ShieldAlert, ArrowRight, Zap, RefreshCw, BarChart2 } from 'lucide-react';

export const VerticalSolutions: React.FC = () => {
    const [marginDrop, setMarginDrop] = useState(12);
    const [simulatedContainers, setSimulatedContainers] = useState(6);

    return (
        <section id="vertical-solutions" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 border-b border-zinc-200/80 dark:border-zinc-800/80 space-y-12 sm:space-y-16">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/25 inline-block">
                    Deep Operational Impact
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                    How Autonomous Swarms Transform Enterprise Verticals
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                    Interactive operational visualizers demonstrating real-time agent decision loops across critical business units.
                </p>
            </div>

            {/* Vertical 1: Legal Interactive Redline Demo */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4 text-left">
                    <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-widest">
                        Vertical Suite 01 — Legal &amp; IP
                    </span>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Real-Time Contract Redlining &amp; Playbook Enforcement
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        Human legal review takes days and costs thousands per contract. devLush AgentOS processes 50-page Master Service Agreements in seconds, detecting rogue indemnity terms and substituting pre-approved corporate clauses automatically.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-1">
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
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl">
                        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                <FileSignature className="w-4 h-4 text-cyan-500 shrink-0" />
                                <span className="truncate">Agent Redline Visualizer (MSA Clause #14.2)</span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] bg-cyan-500 text-zinc-950 font-mono font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                                REPLACEMENT
                            </span>
                        </div>
                        <div className="mt-4 space-y-3 font-mono text-xs text-left">
                            <div className="p-3 sm:p-4 bg-red-500/10 border-l-4 border-red-500 rounded-xl text-red-900 dark:text-red-300">
                                <span className="font-bold block text-red-600 dark:text-red-400 text-[10px] uppercase mb-1">
                                    Original Inbound Clause (High Risk)
                                </span>
                                "Supplier total aggregate liability for data breaches, compliance failure, or indirect damages shall not exceed $5,000 USD."
                            </div>
                            <div className="p-3 sm:p-4 bg-emerald-500/10 border-l-4 border-emerald-500 rounded-xl text-emerald-900 dark:text-emerald-300">
                                <span className="font-bold block text-emerald-600 dark:text-emerald-400 text-[10px] uppercase mb-1">
                                    Agent Replacement (Playbook Approved)
                                </span>
                                "Supplier total aggregate liability for data breach or cyber incidents shall be capped at 5x total annual contract value with uncapped direct gross negligence indemnity."
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical 2: Ecommerce Dynamic Pricing Simulator */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl space-y-5">
                        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-3 sm:pb-4 gap-2">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 truncate">
                                <Sliders className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span>Dynamic Margin Guard Simulator</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] bg-emerald-500 text-zinc-950 font-bold px-2.5 py-0.5 rounded-full font-mono whitespace-nowrap">
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

                            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5 text-left">
                                <div className="flex justify-between font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm">
                                    <span>Automated Re-Pricing Action:</span>
                                    <span className="text-emerald-500 font-mono">
                                        $89.00 &rarr; ${(89 * (1 - marginDrop / 200)).toFixed(2)}
                                    </span>
                                </div>
                                <p className="text-zinc-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                                    Listing price dynamically optimized to win #1 Buy-Box while strictly guaranteeing your 38% Gross Margin floor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4 text-left order-1 lg:order-2">
                    <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">
                        Vertical Suite 02 — Ecommerce &amp; Retail
                    </span>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Autonomous Dynamic Margin &amp; Buy-Box Guard
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        Never bleed profit during predatory price wars. devLush agents scrape competitor catalogs 24/7, recalculating supplier COGS and executing algorithmic repricing within 400ms.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-1">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Instant margin floor enforcement to eliminate loss-making sales</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Multi-channel abandoned cart recovery with personalized SMS discounts</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Vertical 3: Supply Chain Auto-Routing */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4 text-left">
                    <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">
                        Vertical Suite 03 — Supply Chain &amp; Logistics
                    </span>
                    <h3 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                        Autonomous Port Congestion &amp; PO Re-Routing
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                        Supply chain disruptions cost enterprise manufacturers millions in demurrage and factory downtime. Our agent swarms ingest maritime AIS signals and automatically issue replacement POs in SAP and Oracle ERP.
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium pt-1">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Real-time maritime choke-point &amp; demurrage penalty prediction</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>Automated freight PO split execution in SAP ERP</span>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-7">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl space-y-4 text-left">
                        <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                                <Ship className="w-4 h-4 text-amber-500 shrink-0" />
                                <span className="truncate">Suez &amp; Rotterdam Terminal Telemetry</span>
                            </div>
                            <span className="text-[9px] sm:text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-mono font-bold whitespace-nowrap">
                                RE-ROUTING
                            </span>
                        </div>

                        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-700 dark:text-zinc-300">Congestion Delay:</span>
                                <span className="font-mono text-red-500 font-bold">+9.4 Days Port Wait</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-zinc-700 dark:text-zinc-300">Agent Action:</span>
                                <span className="font-mono text-emerald-500 font-bold">Air-Freight 4 Containers</span>
                            </div>
                            <div className="text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
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
