import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, FileText, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

export const GovernanceFramework: React.FC = () => {
    const [activePhase, setActivePhase] = useState<'A1' | 'D' | 'A2' | 'P' | 'T'>('A1');

    const phases = [
        { id: 'A1', title: 'A - Access Control', subtitle: 'Phase 1', icon: <Key className="w-4 h-4 text-cyan-400" /> },
        { id: 'D', title: 'D - Deterministic', subtitle: 'Phase 2', icon: <Lock className="w-4 h-4 text-emerald-400" /> },
        { id: 'A2', title: 'A - Audit Logging', subtitle: 'Phase 3', icon: <FileText className="w-4 h-4 text-amber-400" /> },
        { id: 'P', title: 'P - Privacy Shield', subtitle: 'Phase 4', icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
        { id: 'T', title: 'T - Telemetry', subtitle: 'Phase 5', icon: <Activity className="w-4 h-4 text-blue-400" /> }
    ];

    const contentMap = {
        A1: {
            title: 'Access Control & Fine-Grained RBAC',
            desc: 'Agents execute strictly under scoped OAuth2 tokens and Role-Based Access Controls. An ecommerce agent cannot access legal contracts, and a legal redline agent has zero database write access to production ERP tables.',
            points: ['Scoped Least-Privilege IAM tokens', 'Zero write privileges on financial ledgers without 2FA', 'Automated token invalidation after session completion']
        },
        D: {
            title: 'Deterministic Sandbox Guards',
            desc: 'Agent tool execution is bounded by deterministic policy checkers. Actions that exceed monetary or security thresholds (e.g. wire transfers > $5,000) automatically require human-in-the-loop sign-off.',
            points: ['Deterministic threshold circuit-breakers', 'Human-in-the-loop escalation triggers', 'Sandboxed execution environment isolated from production networks']
        },
        A2: {
            title: 'Immutable Audit Logging',
            desc: 'Every thought chain, tool invocation, payload, and response is recorded in an immutable append-only ledger for instant compliance reporting and zero-trust verification.',
            points: ['Append-only cryptographic audit ledger', 'Complete replayability of every agent decision', 'Automated export for SOC 2 Type II & ISO 27001 auditors']
        },
        P: {
            title: 'Privacy Shield & Zero Data Retention',
            desc: 'Customer and enterprise payload data is scrubbed of PII prior to model inference. No enterprise data is ever stored or utilized for public foundation model training.',
            points: ['Automated pre-flight PII redaction and scrubbing', 'Zero training data retention guarantee', 'HIPAA, GDPR & CCPA compliant data flows']
        },
        T: {
            title: 'Real-Time Swarm Telemetry',
            desc: 'Comprehensive observability tracks token consumption, latency SLA, tool error rates, and swarm throughput across all active micro-agents.',
            points: ['Sub-second latency anomaly alerts', 'Cost attribution per business unit & workflow', 'Prometheus & OpenTelemetry native metrics exports']
        }
    };

    return (
        <section id="governance-framework" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 space-y-8 shadow-xl">
                
                <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                            Enterprise Security Standard
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-2">
                            The ADAPT Agent Governance Framework
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span>Zero Data Retained for Model Training</span>
                    </div>
                </div>

                {/* Phase Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {phases.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setActivePhase(p.id as any)}
                            className={`p-3.5 text-xs font-bold rounded-2xl text-left transition-all border cursor-pointer ${
                                activePhase === p.id
                                    ? 'bg-zinc-900 text-white dark:bg-cyan-500 dark:text-zinc-950 border-cyan-500 shadow-md font-extrabold'
                                    : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <span className="block text-[10px] text-zinc-400 uppercase">{p.subtitle}</span>
                            <span className="flex items-center gap-1.5 mt-1">{p.title}</span>
                        </button>
                    ))}
                </div>

                {/* Display Panel */}
                <div className="p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
                    <h4 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                        {phases.find(p => p.id === activePhase)?.icon}
                        <span>{contentMap[activePhase].title}</span>
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-4xl">
                        {contentMap[activePhase].desc}
                    </p>
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-2">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                            Enforcement Guarantees:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {contentMap[activePhase].points.map((pt, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-900 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span>{pt}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default GovernanceFramework;
