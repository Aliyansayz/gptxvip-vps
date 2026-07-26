import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, PackageX, DollarSign, Store, Activity, CheckCircle2 } from 'lucide-react';

export default function DynamicPricingVisual() {
    const [phase, setPhase] = useState<'monitoring' | 'stockout' | 'adjusting' | 'optimized'>('monitoring');
    const [price, setPrice] = useState(99.99);
    const [competitorStock, setCompetitorStock] = useState(142);
    const [margin, setMargin] = useState(32.5);

    useEffect(() => {
        const runLoop = async () => {
            // Reset
            setPhase('monitoring');
            setPrice(99.99);
            setCompetitorStock(142);
            setMargin(32.5);

            await new Promise(r => setTimeout(r, 2500));
            
            // Stockout event
            setPhase('stockout');
            setCompetitorStock(0);
            
            await new Promise(r => setTimeout(r, 2000));
            
            // Adjusting
            setPhase('adjusting');
            
            // Animate numbers up
            let steps = 0;
            const interval = setInterval(() => {
                steps++;
                setPrice(prev => prev + 1.50);
                setMargin(prev => prev + 0.88);
                if (steps === 10) {
                    clearInterval(interval);
                    setPrice(114.99);
                    setMargin(41.3);
                    setPhase('optimized');
                }
            }, 80);

            await new Promise(r => setTimeout(r, 4500));
            runLoop(); // Loop back
        };
        
        runLoop();
    }, []);

    return (
        <div className="w-full h-[380px] rounded-2xl bg-slate-950 p-6 shadow-2xl border border-slate-800 font-sans my-8 flex flex-col relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 relative z-10 border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    Algorithmic Pricing Engine
                </h3>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors duration-500 ${phase === 'optimized' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                    {phase === 'monitoring' && 'Market Watch'}
                    {phase === 'stockout' && 'Scarcity Detected'}
                    {phase === 'adjusting' && 'Calculating Elasticity...'}
                    {phase === 'optimized' && 'Margin Maximized'}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-between gap-8 relative z-10">
                
                {/* Competitor Panel */}
                <div className="w-1/3 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-inner flex flex-col items-center justify-center h-48 relative">
                     <div className="absolute top-2 left-3 text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                         <Store className="w-3 h-3" /> Competitor A
                     </div>
                     
                     <motion.div 
                        animate={{ scale: phase === 'stockout' ? [1, 1.1, 1] : 1 }}
                        className={`mt-4 rounded-full w-20 h-20 flex items-center justify-center border-4 ${phase === 'monitoring' ? 'border-sky-500/50 text-sky-400' : 'border-rose-500/80 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'}`}
                     >
                         {phase === 'monitoring' ? (
                             <div className="text-xl font-bold">{competitorStock}</div>
                         ) : (
                             <PackageX className="w-8 h-8" />
                         )}
                     </motion.div>
                     
                     <div className={`mt-3 text-sm font-bold ${phase === 'monitoring' ? 'text-slate-300' : 'text-rose-400'}`}>
                         {phase === 'monitoring' ? 'In Stock' : 'SOLD OUT'}
                     </div>
                </div>

                {/* Arrow / Agent Action */}
                <div className="flex flex-col items-center justify-center w-1/5 relative">
                     <AnimatePresence mode="wait">
                         {phase === 'stockout' && (
                             <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex flex-col items-center text-rose-400 absolute"
                             >
                                 <Activity className="w-8 h-8 mb-1" />
                                 <div className="text-[9px] font-bold uppercase text-center leading-tight">Supply<br/>Shock</div>
                             </motion.div>
                         )}
                         {(phase === 'adjusting' || phase === 'optimized') && (
                             <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center text-emerald-400 absolute"
                             >
                                 <DollarSign className="w-8 h-8 mb-1" />
                                 <div className="text-[9px] font-bold uppercase text-center leading-tight">Executing<br/>Markup</div>
                             </motion.div>
                         )}
                     </AnimatePresence>
                     {/* Connecting Line */}
                     <div className="w-full h-0.5 bg-slate-700 absolute top-1/2 -z-10"></div>
                </div>

                {/* Internal Store Panel */}
                <div className={`w-1/3 bg-slate-900 border rounded-xl p-4 shadow-inner flex flex-col items-center justify-center h-48 relative transition-colors duration-500 ${phase === 'optimized' ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]' : 'border-slate-700'}`}>
                     <div className="absolute top-2 left-3 text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                         <Store className="w-3 h-3 text-emerald-500" /> Your Store
                     </div>

                     <div className="mt-4 text-center">
                         <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Current Price</div>
                         <div className={`text-4xl font-black font-mono transition-colors duration-300 ${phase === 'optimized' ? 'text-emerald-400' : 'text-slate-100'}`}>
                             ${price.toFixed(2)}
                         </div>
                     </div>

                     <div className="mt-4 flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                         <span className="text-[10px] text-slate-400 uppercase font-bold">Margin</span>
                         <span className={`text-sm font-mono font-bold ${phase === 'optimized' ? 'text-emerald-400' : 'text-slate-300'}`}>
                             {margin.toFixed(1)}%
                         </span>
                     </div>
                     
                     <AnimatePresence>
                         {phase === 'optimized' && (
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 rounded-full p-1 shadow-lg"
                             >
                                 <CheckCircle2 className="w-5 h-5" />
                             </motion.div>
                         )}
                     </AnimatePresence>
                </div>
            </div>

            {/* Background Chart/Graph illusion */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20 pointer-events-none z-0">
                <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full text-emerald-500" fill="currentColor">
                    <motion.path 
                        d={phase === 'optimized' ? "M0,20 L0,15 L20,13 L40,14 L60,10 L80,5 L100,2 L100,20 Z" : "M0,20 L0,15 L20,13 L40,14 L60,12 L80,13 L100,11 L100,20 Z"}
                        transition={{ duration: 1 }}
                    />
                </svg>
            </div>
        </div>
    );
}
