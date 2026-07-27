import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShoppingBag, TrendingUp, Gift, Zap } from 'lucide-react';

interface BundleOption {
    id: string;
    emoji: string;
    name: string;
    items: string[];
    originalPrice: string;
    bundlePrice: string;
    marginLift: string;
    badge: string;
}

const bundleOptions: BundleOption[] = [
    { id: 'barista', emoji: '☕', name: 'Barista Master Bundle', items: ['Breville Espresso Pro', '🥛 Milk Frother', '⚖️ Precision Scale'], originalPrice: '$664.00', bundlePrice: '$597.60', marginLift: '+24.5% AOV', badge: 'Popular Choice' },
    { id: 'tech', emoji: '💻', name: 'Developer Desk Setup', items: ['4K Ergonomic Monitor', '⌨️ Mechanical Keyboard', '🎧 ANC Headphones'], originalPrice: '$1,250.00', bundlePrice: '$1,099.00', marginLift: '+38.2% AOV', badge: 'High Margin' },
    { id: 'fitness', emoji: '🏋️', name: 'Pro Recovery Kit', items: ['Smart Fitness Watch', '🧴 Muscle Massage Gun', '🥤 Protein Shaker'], originalPrice: '$340.00', bundlePrice: '$299.00', marginLift: '+19.8% AOV', badge: 'Fast Converting' },
];

export default function CartSparkleIconographic({ prompt }: { prompt?: string }) {
    const [activeId, setActiveId] = useState<string>('barista');

    const active = bundleOptions.find(b => b.id === activeId) || bundleOptions[0];

    return (
        <div className="w-full rounded-3xl bg-slate-950 p-6 md:p-8 my-8 border border-slate-800 shadow-2xl overflow-hidden font-sans relative">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg">
                        <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h4 className="text-slate-100 font-bold text-base md:text-lg flex items-center gap-2">
                            Autonomous Bundle Architect <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/30">Dynamic AOV</span>
                        </h4>
                        <p className="text-slate-400 text-xs">Real-Time Vector Space Complementary SKU Assembler</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                    AOV Lift Guaranteed
                </div>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {bundleOptions.map((b) => {
                    const isSelected = b.id === activeId;
                    return (
                        <button
                            key={b.id}
                            onClick={() => setActiveId(b.id)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-slate-900 border-indigo-500/80 shadow-[0_0_25px_rgba(99,102,241,0.2)] scale-[1.02]'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-3xl select-none">{b.emoji}</span>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-500/30">
                                    {b.badge}
                                </span>
                            </div>
                            <div className="font-semibold text-sm text-slate-200">{b.name}</div>
                            <div className="text-xs text-emerald-400 font-mono font-bold mt-1">{b.marginLift}</div>
                        </button>
                    );
                })}
            </div>

            {/* Dynamic Bundle Preview */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl select-none">{active.emoji}</span>
                            <div>
                                <h5 className="text-slate-100 font-bold text-base md:text-lg">{active.name}</h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-slate-500 line-through font-mono">{active.originalPrice}</span>
                                    <span className="text-sm text-emerald-400 font-bold font-mono">{active.bundlePrice}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                            <Gift className="w-4 h-4" />
                            One-Click Cart Inject
                        </div>
                    </div>

                    <div className="mb-4">
                        <span className="text-xs text-slate-400 font-mono block mb-2">Architected SKUs Included:</span>
                        <div className="flex flex-wrap gap-2">
                            {active.items.map((item, i) => (
                                <span key={i} className="text-xs bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1 font-medium">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                        <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>Agent Execution: Dynamically evaluated profit margins (&gt;40%) and stock levels in &lt;180ms.</span>
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
