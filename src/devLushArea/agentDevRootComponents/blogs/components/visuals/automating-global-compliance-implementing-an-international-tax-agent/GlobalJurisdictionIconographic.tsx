import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Building2, ShieldCheck, DollarSign, ArrowRight } from 'lucide-react';

interface Jurisdiction {
    id: string;
    flag: string;
    country: string;
    rate: string;
    bepsStatus: string;
    color: string;
    details: string;
}

const jurisdictions: Jurisdiction[] = [
    { id: 'us', flag: '🏛️', country: 'United States (US)', rate: '21.0%', bepsStatus: 'Pillar 2 Aligned', color: 'from-blue-500 to-indigo-600', details: 'GILTI & Corporate Alternative Minimum Tax active. Treaty Article 12 applies.' },
    { id: 'ie', flag: '☘️', country: 'Ireland (IE)', rate: '15.0%', bepsStatus: 'GloBE Implemented', color: 'from-emerald-500 to-teal-600', details: '15% Minimum ETR for multinationals under GloBE rules. IP hub rate.' },
    { id: 'eu', flag: '💶', country: 'Germany (DE/EU)', rate: '29.9%', bepsStatus: 'Strict Compliance', color: 'from-amber-500 to-orange-600', details: 'Trade tax + Corporate tax. Strict transfer pricing documentation mandated.' },
    { id: 'jp', flag: '🗾', country: 'Japan (JP)', rate: '23.2%', bepsStatus: 'Pillar 2 Enacted', color: 'from-purple-500 to-pink-600', details: 'Local tax additions bring effective rate to ~30%. Bilateral DTAA in effect.' },
];

export default function GlobalJurisdictionIconographic({ prompt }: { prompt?: string }) {
    const [selectedId, setSelectedId] = useState<string>('us');

    const selected = jurisdictions.find(j => j.id === selectedId) || jurisdictions[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Globe className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Global Tax Treaty Navigator <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">Live Sync</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Autonomous Multi-Jurisdiction ETR Map</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    OECD Pillar Two Ready
                </div>
            </div>

            {/* Interactive Emoji Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {jurisdictions.map((j) => {
                    const isSelected = j.id === selectedId;
                    return (
                        <button
                            key={j.id}
                            onClick={() => setSelectedId(j.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{j.flag}</span>
                                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-950 ${isSelected ? 'text-emerald-400 border border-emerald-500/30' : 'text-slate-400'}`}>
                                    {j.rate}
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-200">{j.country.split(' ')[0]}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-1">{j.bepsStatus}</div>

                            {isSelected && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-emerald-400"
                                />
                            )}
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
                    transition={{ duration: 0.2 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{selected.flag}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-lg">{selected.country}</h5>
                                <span className="text-xs text-indigo-400 font-mono">{selected.bepsStatus}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Effective Tax Rate</div>
                                <div className="text-xl font-bold text-emerald-400 font-mono">{selected.rate}</div>
                            </div>
                            <div className="h-8 w-px bg-slate-800" />
                            <div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Tax Treaty Status</div>
                                <div className="text-xs font-semibold text-slate-300">Active DTAA</div>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.details}</p>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Automated Agent Mapping: Ingested ERP ledger syncs automatically via Article 12 compliance checks.</span>
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
