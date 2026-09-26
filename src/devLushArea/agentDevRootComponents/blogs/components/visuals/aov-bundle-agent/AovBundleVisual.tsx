import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Coffee, PackagePlus, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export default function AovBundleVisual() {
    const [phase, setPhase] = useState<'empty' | 'added' | 'analyzing' | 'bundled'>('empty');
    const [bundleAdded, setBundleAdded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const sequence = async () => {
            // Initial state
            setPhase('empty');
            setBundleAdded(false);
            await new Promise(r => setTimeout(r, 1500));
            if (cancelled) return;
            
            // Add to cart
            setPhase('added');
            await new Promise(r => setTimeout(r, 1500));
            if (cancelled) return;
            
            // Agent analyzing
            setPhase('analyzing');
            await new Promise(r => setTimeout(r, 2000));
            if (cancelled) return;
            
            // Bundle generated
            setPhase('bundled');
            await new Promise(r => setTimeout(r, 5000)); // hold
            if (!cancelled) sequence(); // loop
        };
        sequence();
        return () => { cancelled = true; };
    }, []);

    return (
        <div className="w-full h-[450px] rounded-2xl bg-slate-950 p-6 shadow-2xl border border-slate-800 font-sans my-8 flex relative overflow-hidden">
            
            {/* Left side: E-commerce Store UI */}
            <div className="w-1/2 pr-6 border-r border-slate-800 flex flex-col relative z-10">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                    <Coffee className="w-6 h-6 text-amber-500" />
                    Bean & Brew Co.
                </h3>
                
                <div className="flex-1 flex flex-col justify-center gap-6">
                    <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between shadow-lg">
                         <div className="flex flex-col">
                             <span className="font-bold text-slate-200">Espresso Machine Pro</span>
                             <span className="text-emerald-400 font-mono font-bold">$499.00</span>
                         </div>
                         <button type="button" aria-label="Add Espresso Machine Pro to cart" disabled={phase !== 'empty'} onClick={() => setPhase('added')} className={`p-2 rounded-lg transition-colors ${phase !== 'empty' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'}`}>
                             <ShoppingCart className="w-5 h-5" />
                         </button>
                    </div>
                    
                    {/* Shadow items for realism */}
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-50 blur-[1px]">
                         <div className="flex flex-col">
                             <span className="font-bold text-slate-400">Standard Coffee Maker</span>
                             <span className="text-slate-500 font-mono">$89.00</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Right side: Cart & Agent Panel */}
            <div className="w-1/2 pl-6 flex flex-col relative z-10">
                <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
                    <h4 className="font-bold text-slate-300 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" /> Your Cart
                    </h4>
                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs font-bold font-mono">
                        {phase === 'empty' ? '0 items' : bundleAdded ? '3 items' : '1 item'}
                    </span>
                </div>

                <div className="flex-1 flex flex-col relative">
                    <AnimatePresence>
                        {phase === 'empty' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center text-slate-500">
                                Cart is empty
                            </motion.div>
                        )}
                        
                        {(phase === 'added' || phase === 'analyzing' || phase === 'bundled') && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                className="bg-slate-900 border border-slate-700 p-3 rounded-lg flex justify-between items-center shadow-md z-20"
                            >
                                <span className="text-sm font-bold text-slate-200">Espresso Machine Pro</span>
                                <span className="text-sm text-slate-400 font-mono">$499.00</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Agent Interception Space */}
                    <div className="mt-4 flex-1 relative flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                            {phase === 'analyzing' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex flex-col items-center gap-2 text-indigo-400"
                                >
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-center">Agent analyzing<br/>complementary SKUs</span>
                                </motion.div>
                            )}
                            
                            {phase === 'bundled' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="w-full bg-gradient-to-br from-indigo-950 to-fuchsia-950 border border-fuchsia-500/50 p-4 rounded-xl shadow-[0_0_25px_rgba(217,70,239,0.2)] relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 bg-fuchsia-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg">Agent Offer</div>
                                    <div className="flex items-center gap-2 text-fuchsia-400 mb-2">
                                        <Sparkles className="w-4 h-4" />
                                        <span className="text-sm font-bold text-white">Barista Starter Kit</span>
                                    </div>
                                    <div className="text-[11px] text-indigo-200 mb-4">Add these to complete your setup:</div>
                                    
                                    <div className="flex flex-col gap-2 mb-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-300 flex items-center gap-1.5"><PackagePlus className="w-3.5 h-3.5 text-slate-500"/> Premium Beans</span>
                                            <span className="text-slate-500 line-through">$25.00</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-300 flex items-center gap-1.5"><PackagePlus className="w-3.5 h-3.5 text-slate-500"/> Milk Frother</span>
                                            <span className="text-slate-500 line-through">$40.00</span>
                                        </div>
                                    </div>

                                    <button type="button" onClick={() => setBundleAdded(true)} disabled={bundleAdded} className="w-full bg-fuchsia-500 hover:bg-fuchsia-400 disabled:bg-emerald-700 disabled:cursor-default text-white text-sm font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg">
                                        {bundleAdded ? 'Bundle added to demo cart' : 'Add Bundle for +$58.50'}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center relative z-20">
                        <span className="font-bold text-slate-400">Total</span>
                        <span className="font-bold font-mono text-emerald-400 text-xl">
                            {phase === 'empty' ? '$0.00' : bundleAdded ? '$557.50' : '$499.00'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Background Data Flow Illusion */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
                 <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-transparent"></div>
            </div>
        </div>
    );
}
