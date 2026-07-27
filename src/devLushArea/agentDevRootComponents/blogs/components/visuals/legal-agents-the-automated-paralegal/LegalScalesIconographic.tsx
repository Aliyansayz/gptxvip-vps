import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, ShieldCheck, AlertCircle, FileCheck, CheckCircle } from 'lucide-react';

interface ClauseRisk {
    id: string;
    emoji: string;
    clauseName: string;
    riskLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'COMPLIANT';
    impact: string;
    suggestedFix: string;
    color: string;
}

const clauseRisks: ClauseRisk[] = [
    { id: 'liability', emoji: '⚠️', clauseName: 'Section 8: Limitation of Liability', riskLevel: 'HIGH RISK', impact: 'Exposes company to uncapped consequential damages', suggestedFix: 'Insert $1M or 12-month trailing fee liability cap clause', color: 'border-amber-500/50 bg-amber-950/30 text-amber-400' },
    { id: 'indemnity', emoji: '📜', clauseName: 'Section 12: Broad Indemnification', riskLevel: 'HIGH RISK', impact: 'One-sided IP infringement indemnity without limit', suggestedFix: 'Add mutual defense clause & cap third-party claims', color: 'border-red-500/50 bg-red-950/30 text-red-400' },
    { id: 'term', emoji: '⏳', clauseName: 'Section 3: Auto-Renewal Term', riskLevel: 'MEDIUM RISK', impact: '60-day advance notice required to prevent 2-year lock', suggestedFix: 'Shorten notice period to 30 days prior to expiry', color: 'border-indigo-500/50 bg-indigo-950/30 text-indigo-400' },
    { id: 'ip', emoji: '✅', clauseName: 'Section 15: Intellectual Property Rights', riskLevel: 'COMPLIANT', impact: 'Fully aligns with company standard playbook policy', suggestedFix: 'No redline required. Fully approved.', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400' },
];

export default function LegalScalesIconographic({ prompt }: { prompt?: string }) {
    const [selectedId, setSelectedId] = useState<string>('liability');

    const selected = clauseRisks.find(c => c.id === selectedId) || clauseRisks[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Scale className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Automated Playbook Compliance Scale <span className="text-xs px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/30">HITL Verified</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Real-Time Legal Risk Assessment & Redline Synthesizer</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Zero Citation Hallucinations
                </div>
            </div>

            {/* Clause Selector Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {clauseRisks.map((c) => {
                    const isSelected = c.id === selectedId;
                    return (
                        <button
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{c.emoji}</span>
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${c.color}`}>
                                    {c.riskLevel.split(' ')[0]}
                                </span>
                            </div>
                            <div className="font-semibold text-xs text-slate-200 truncate">{c.clauseName.split(':')[1] || c.clauseName}</div>
                        </button>
                    );
                })}
            </div>

            {/* Redline Recommendation View */}
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
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{selected.clauseName}</h5>
                                <span className="text-xs text-slate-400 font-mono">Impact: {selected.impact}</span>
                            </div>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold font-mono ${selected.color}`}>
                            {selected.riskLevel}
                        </span>
                    </div>

                    <div className="mb-4">
                        <span className="text-xs text-slate-400 font-mono block mb-1">Agent Suggested Redline Fix:</span>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-emerald-400 font-serif text-sm">
                            {selected.suggestedFix}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Playbook Alignment: Scanned against enterprise legal standards. Precedent verified in database.</span>
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
