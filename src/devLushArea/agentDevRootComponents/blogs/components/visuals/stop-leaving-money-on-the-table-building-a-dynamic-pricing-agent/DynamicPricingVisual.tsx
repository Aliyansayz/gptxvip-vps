import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, PackageMinus, Zap, AlertTriangle } from 'lucide-react';

export default function DynamicPricingVisual({ prompt }: { prompt?: string }) {
    const [competitorStock, setCompetitorStock] = useState(120);
    const [price, setPrice] = useState(49.99);
    const [margin, setMargin] = useState(32.5);
    const [isSurging, setIsSurging] = useState(false);

    useEffect(() => {
        let stock = 120;
        let currentPrice = 49.99;
        let currentMargin = 32.5;
        
        const loop = async () => {
            while (true) {
                // Reset state
                stock = 120;
                currentPrice = 49.99;
                currentMargin = 32.5;
                setCompetitorStock(stock);
                setPrice(currentPrice);
                setMargin(currentMargin);
                setIsSurging(false);
                await new Promise(r => setTimeout(r, 2000));

                // Stock starts dropping rapidly
                for (let i = 0; i < 5; i++) {
                    stock -= Math.floor(Math.random() * 20) + 10;
                    setCompetitorStock(Math.max(0, stock));
                    await new Promise(r => setTimeout(r, 600));
                }

                // Stockout event
                stock = 0;
                setCompetitorStock(0);
                setIsSurging(true);
                
                // Agent dynamically raises price
                await new Promise(r => setTimeout(r, 500));
                currentPrice = 59.99;
                currentMargin = 41.3;
                setPrice(currentPrice);
                setMargin(currentMargin);
                
                await new Promise(r => setTimeout(r, 500));
                currentPrice = 64.99;
                currentMargin = 45.8;
                setPrice(currentPrice);
                setMargin(currentMargin);

                await new Promise(r => setTimeout(r, 4000));
            }
        };
        loop();
    }, []);

    // Calculate gauge rotation (-90 to 90 degrees)
    const normalizedPrice = Math.min(Math.max(price, 40), 80);
    const gaugeRotation = ((normalizedPrice - 40) / 40) * 180 - 90;

    return (
        <div className="w-full rounded-2xl bg-slate-900 p-8 my-8 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
            <h4 className="text-slate-200 font-semibold mb-8 flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" /> Algorithmic Margin Optimizer
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-2xl mx-auto">
                
                {/* Competitor Stock Stream */}
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                    
                    <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Competitor A Stock</div>
                    <div className="flex items-center gap-3">
                        <PackageMinus className={`w-8 h-8 transition-colors duration-300 ${competitorStock === 0 ? 'text-red-500' : 'text-slate-500'}`} />
                        <motion.div 
                            key={competitorStock}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className={`font-mono text-4xl font-bold tabular-nums ${competitorStock === 0 ? 'text-red-500' : 'text-slate-200'}`}
                        >
                            {competitorStock}
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {competitorStock === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 bg-red-950/50 border border-red-500/50 text-red-400 text-[10px] px-3 py-1 rounded-full flex items-center gap-1 font-bold animate-pulse"
                            >
                                <AlertTriangle className="w-3 h-3" /> STOCKOUT DETECTED
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Our Dynamic Price Gauge */}
                <div className="flex flex-col items-center relative">
                    <div className="relative w-48 h-24 overflow-hidden">
                        {/* Gauge Arc */}
                        <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[12px] border-slate-800 border-t-emerald-500/20 border-r-emerald-500/50 border-b-emerald-400 border-l-slate-800 rotate-45" />
                        
                        {/* Needle */}
                        <motion.div 
                            className="absolute bottom-0 left-1/2 w-1 h-20 bg-slate-400 origin-bottom rounded-t-full z-10 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                            style={{ x: '-50%' }}
                            animate={{ rotate: gaugeRotation }}
                            transition={{ type: "spring", stiffness: 120, damping: 15 }}
                        >
                            {/* Needle Center Point */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-slate-200 rounded-full" />
                        </motion.div>
                    </div>

                    <div className="mt-4 text-center">
                        <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Our Dynamic Price</div>
                        <motion.div 
                            className={`font-mono text-3xl font-bold tabular-nums transition-colors duration-500 ${isSurging ? 'text-emerald-400' : 'text-slate-200'}`}
                        >
                            ${price.toFixed(2)}
                        </motion.div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                            <TrendingUp className={`w-3 h-3 ${isSurging ? 'text-emerald-400' : 'text-slate-600'}`} />
                            <span className={`font-mono text-xs font-bold tabular-nums transition-colors duration-500 ${isSurging ? 'text-emerald-400' : 'text-slate-500'}`}>
                                Margin: {margin.toFixed(1)}%
                            </span>
                        </div>
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
