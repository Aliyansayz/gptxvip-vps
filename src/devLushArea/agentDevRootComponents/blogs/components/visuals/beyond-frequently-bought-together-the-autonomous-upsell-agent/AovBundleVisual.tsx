import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Sparkles, ChevronRight } from 'lucide-react';

export default function AovBundleVisual({ prompt }: { prompt?: string }) {
    const [step, setStep] = useState(0); // 0: Empty Cart, 1: Base Item added, 2: Agent Analyzing, 3: Bundle Offer

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                setStep(0);
                await new Promise(r => setTimeout(r, 1500));
                setStep(1);
                await new Promise(r => setTimeout(r, 1000));
                setStep(2);
                await new Promise(r => setTimeout(r, 1500));
                setStep(3);
                await new Promise(r => setTimeout(r, 4000));
            }
        };
        sequence();
    }, []);

    return (
        <div className="w-full rounded-2xl bg-slate-900 p-8 my-8 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
            <div className="max-w-md mx-auto bg-slate-950 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-slate-200">Your Cart</span>
                    <ShoppingCart className="w-5 h-5 text-slate-400" />
                </div>
                
                {/* Cart Body */}
                <div className="p-6 min-h-[340px] flex flex-col">
                    
                    <AnimatePresence mode="popLayout">
                        {step === 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex-1 flex items-center justify-center text-slate-500 text-sm h-32"
                            >
                                Cart is empty.
                            </motion.div>
                        )}

                        {step >= 1 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 bg-slate-900 p-4 rounded-lg border border-slate-800 mb-4 shrink-0"
                            >
                                <div className="w-16 h-16 bg-slate-800 rounded-md flex items-center justify-center">
                                    <span className="text-2xl">☕</span>
                                </div>
                                <div className="flex-1">
                                    <div className="text-slate-200 font-medium leading-tight">Breville Espresso Pro</div>
                                    <div className="text-slate-500 text-sm mt-1">Stainless Steel</div>
                                </div>
                                <div className="text-slate-300 font-semibold">$599.00</div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 flex flex-col justify-end min-h-[140px]">
                        {/* Agent Analyzing State */}
                        <AnimatePresence>
                            {step === 2 && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center justify-center gap-2 text-indigo-400 py-4 text-sm font-mono overflow-hidden"
                                >
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span>Agent architecting bundle...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* The Bundle Offer */}
                        <AnimatePresence>
                            {step === 3 && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="relative bg-gradient-to-r from-indigo-950 to-purple-950 p-1 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] mt-auto"
                                >
                                    <div className="bg-slate-950 rounded-lg p-4 h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                            Limited Time Offer
                                        </div>
                                        <h4 className="text-indigo-400 font-semibold flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4" /> The Barista Starter Kit
                                        </h4>
                                        
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex flex-col justify-center items-center text-xs text-slate-400 leading-tight">
                                                <span>☕</span>
                                            </div>
                                            <Plus className="w-3 h-3 text-slate-600" />
                                            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex flex-col justify-center items-center text-xs text-slate-400 leading-tight">
                                                <span>🥛</span>
                                            </div>
                                            <Plus className="w-3 h-3 text-slate-600" />
                                            <div className="w-10 h-10 bg-slate-900 rounded border border-slate-800 flex flex-col justify-center items-center text-xs text-slate-400 leading-tight">
                                                <span>⚖️</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-slate-500 text-xs line-through">$664.00</div>
                                                <div className="text-emerald-400 font-bold text-lg">$597.60</div>
                                            </div>
                                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                                                Add Bundle
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Standard Checkout Button */}
                    <div className="mt-4 pt-4 border-t border-slate-800 shrink-0">
                        <button className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition-all ${step >= 1 ? 'bg-slate-200 text-slate-900 hover:bg-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                            Checkout <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                </div>
            </div>

            {prompt && (
                <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center opacity-50 relative z-10">
                    {prompt}
                </div>
            )}
        </div>
    );
}
