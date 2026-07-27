import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Server, Cpu, GitPullRequest, ShieldAlert, CheckCircle } from 'lucide-react';

interface ClusterNode {
    id: string;
    emoji: string;
    nodeName: string;
    status: 'OPTIMAL' | 'SPIKING' | 'SHARDING' | 'REBALANCED';
    iopsLoad: string;
    forecastAction: string;
    color: string;
    details: string;
}

const clusterNodes: ClusterNode[] = [
    { id: 'monolith', emoji: '🖥️', nodeName: 'PostgreSQL Monolith Core', status: 'SPIKING', iopsLoad: '8,950 / 9,000 IOPS (99.4%)', forecastAction: 'Predicts Saturation in 28 mins', color: 'border-red-500/50 bg-red-950/30 text-red-400', details: 'High write throughput from marketing campaign. Disk queue length breaching critical SRE SLO threshold.' },
    { id: 'bot', emoji: '🤖', nodeName: 'AI System Design Agent', status: 'SHARDING', iopsLoad: 'Synthesizing HCL Code', forecastAction: 'Generating Terraform PR #142', color: 'border-indigo-500/50 bg-indigo-950/30 text-indigo-400', details: 'Agent ingests Prometheus metrics, queries AWS RDS API limits, and drafts horizontal sharding HCL modules.' },
    { id: 'shards', emoji: '🧩', nodeName: 'Sharded Cluster (3 Pods)', status: 'REBALANCED', iopsLoad: '2,980 IOPS per Pod (33%)', forecastAction: 'PR Approved & Merged', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400', details: 'Traffic partitioned across three read/write shards. Monolith saturation risk mitigated prior to outage.' },
];

export default function ClusterInfrastructureIconographic({ prompt }: { prompt?: string }) {
    const [selectedId, setSelectedId] = useState<string>('monolith');

    const selected = clusterNodes.find(n => n.id === selectedId) || clusterNodes[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Server className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Predictive Infrastructure Monitor <span className="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-500/30">Prometheus Telemetry</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Autonomous IOPS Forecast & IaC Terraform PR Generator</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                    <GitPullRequest className="w-4 h-4 text-indigo-400" />
                    HITL PR Verification
                </div>
            </div>

            {/* Cluster Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {clusterNodes.map((n) => {
                    const isSelected = n.id === selectedId;
                    return (
                        <button
                            key={n.id}
                            onClick={() => setSelectedId(n.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{n.emoji}</span>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${n.color}`}>
                                    {n.status}
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-200">{n.nodeName}</div>
                            <div className="text-xs text-indigo-400 font-mono mt-1">{n.forecastAction}</div>
                        </button>
                    );
                })}
            </div>

            {/* Details Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{selected.emoji}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{selected.nodeName}</h5>
                                <span className="text-xs text-slate-400 font-mono">{selected.iopsLoad}</span>
                            </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold font-mono ${selected.color}`}>
                            {selected.status}
                        </span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.details}</p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>SRE Safety Rule: Agent creates GitHub Pull Request with Terraform plan. Human approval required before `terraform apply`.</span>
                    </div>
                </motion.div>
            </AnimatePresence>

            {prompt && (
                <div className="mt-6 text-center text-xs text-slate-500 font-mono opacity-60">
                    {prompt}
                </div>
            )}
        </div>
    );
}
